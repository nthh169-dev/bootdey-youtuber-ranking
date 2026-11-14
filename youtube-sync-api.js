/**
 * API & Script tự động cập nhật các cột trong bảng `channels` trên Supabase
 * từ nguồn YouTube Data API v3 (đọc cấu hình từ youtube.txt và supabase.txt).
 *
 * Các cột được cập nhật tự động:
 * - subscribers
 * - subscribers_formatted
 * - videos_count
 * - view_count
 *
 * Cách sử dụng:
 * 1. Chạy cập nhật ngay lập tức qua CLI:
 *    node youtube-sync-api.js
 *
 * 2. Chạy dưới dạng REST API Server (mặc định cổng 3000):
 *    node youtube-sync-api.js --serve
 *    -> Endpoint: GET/POST http://localhost:3000/api/sync-youtube
 *    -> Endpoint 1 kênh: GET/POST http://localhost:3000/api/sync-youtube?id=UCX6OQ3DkcsbYNE6H8uQQuVA
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

function loadConfigFromFiles() {
    const supabasePath = path.join(__dirname, 'supabase.txt');
    const youtubePath = path.join(__dirname, 'youtube.txt');

    let supabaseUrl = 'https://qhkdldltwqnwpmifqdcj.supabase.co';
    let supabaseKey = 'sb_publishable_th6ALyrrhz5qWwppeBOlRw_ouLOX2CU';
    let youtubeApiKey = 'AIzaSyCoccJ_YSStOgdLxct49Td3PA9z6e4aJ_A';

    if (fs.existsSync(supabasePath)) {
        const content = fs.readFileSync(supabasePath, 'utf8');
        const urlMatch = content.match(/Project URL:\s*(\S+)/i);
        const keyMatch = content.match(/Publishable key:\s*(\S+)/i);
        if (urlMatch) supabaseUrl = urlMatch[1].trim();
        if (keyMatch) supabaseKey = keyMatch[1].trim();
    }

    if (fs.existsSync(youtubePath)) {
        const content = fs.readFileSync(youtubePath, 'utf8');
        const keyMatch = content.match(/API_KEY=([^\s&]+)/i) || content.match(/[?&]key=([^\s&]+)/i);
        if (keyMatch) youtubeApiKey = keyMatch[1].trim();
    }

    return {
        supabaseUrl,
        supabaseKey,
        table: 'channels',
        youtubeApiKey,
        youtubeEndpoint: 'https://www.googleapis.com/youtube/v3/channels'
    };
}

function formatSubscribersCount(num) {
    const n = Number(num || 0);
    if (n <= 0) return '0';
    if (n >= 1000000000) {
        return Number((n / 1000000000).toFixed(2)).toString() + 'B';
    }
    if (n >= 1000000) {
        return Number((n / 1000000).toFixed(2)).toString() + 'M';
    }
    if (n >= 1000) {
        return Number((n / 1000).toFixed(1)).toString() + 'K';
    }
    return String(n);
}

async function syncYouTubeToSupabase(targetChannelId = null) {
    const config = loadConfigFromFiles();

    // 1. Lấy danh sách kênh hiện có từ bảng `channels` trên Supabase
    let queryUrl = `${config.supabaseUrl}/rest/v1/${config.table}?select=id,name,handle`;
    if (targetChannelId) {
        queryUrl += `&id=eq.${encodeURIComponent(targetChannelId)}`;
    }

    const chRes = await fetch(queryUrl, {
        headers: {
            'apikey': config.supabaseKey,
            'Accept': 'application/json'
        }
    });

    if (!chRes.ok) {
        throw new Error(`Không thể đọc bảng channels từ Supabase (HTTP ${chRes.status})`);
    }

    const channels = await chRes.json();
    if (!Array.isArray(channels) || channels.length === 0) {
        return { success: false, updated_count: 0, message: 'Không tìm thấy kênh cần đồng bộ' };
    }

    // 2. Gọi YouTube Data API v3 theo danh sách ID
    const idsCsv = channels.map(c => c.id).join(',');
    const ytByIdUrl = `${config.youtubeEndpoint}?part=snippet,statistics,contentDetails&id=${encodeURIComponent(idsCsv)}&key=${encodeURIComponent(config.youtubeApiKey)}`;
    const ytRes = await fetch(ytByIdUrl);
    if (!ytRes.ok) {
        throw new Error(`YouTube API HTTP Error: ${ytRes.status}`);
    }
    const ytData = await ytRes.json();
    const ytItemsById = new Map();
    if (Array.isArray(ytData.items)) {
        for (const item of ytData.items) {
            ytItemsById.set(item.id, item);
        }
    }

    // 3. Chuẩn bị dữ liệu cập nhật (nếu ID trong DB khác ID thật trên YouTube thì tra cứu theo forHandle)
    const updates = [];
    for (const ch of channels) {
        let ytItem = ytItemsById.get(ch.id);

        if (!ytItem && ch.handle) {
            let handleLookup = ch.handle.trim();
            if (handleLookup.toLowerCase() === '@sbsdrama') {
                handleLookup = '@SBSCatch';
            }
            const ytByHandleUrl = `${config.youtubeEndpoint}?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(handleLookup)}&key=${encodeURIComponent(config.youtubeApiKey)}`;
            const handleRes = await fetch(ytByHandleUrl);
            if (handleRes.ok) {
                const handleData = await handleRes.json();
                if (Array.isArray(handleData.items) && handleData.items.length > 0) {
                    ytItem = handleData.items[0];
                }
            }
        }

        if (ytItem && ytItem.statistics) {
            const subscribers = Number(ytItem.statistics.subscriberCount || 0);
            const subscribers_formatted = formatSubscribersCount(subscribers);
            const videos_count = Number(ytItem.statistics.videoCount || 0);
            const view_count = Number(ytItem.statistics.viewCount || 0);

            updates.push({
                id: ch.id,
                name: ch.name,
                subscribers,
                subscribers_formatted,
                videos_count,
                view_count
            });
        }
    }

    // 4. Gọi Supabase RPC API để cập nhật đồng loạt 4 cột vào database
    const rpcRes = await fetch(`${config.supabaseUrl}/rest/v1/rpc/update_channels_youtube_stats`, {
        method: 'POST',
        headers: {
            'apikey': config.supabaseKey,
            'Authorization': `Bearer ${config.supabaseKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ p_items: updates })
    });

    if (!rpcRes.ok) {
        const errText = await rpcRes.text();
        throw new Error(`Lỗi khi cập nhật Supabase RPC (${rpcRes.status}): ${errText}`);
    }

    const rpcResult = await rpcRes.json();
    return {
        success: true,
        updated_count: updates.length,
        synced_at: rpcResult.synced_at || new Date().toISOString(),
        channels: updates
    };
}

// Chạy trực tiếp hoặc khởi tạo HTTP API Server
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.includes('--serve')) {
        const PORT = process.env.PORT || 3000;
        const server = http.createServer(async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                return res.end();
            }

            const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
            if (parsedUrl.pathname === '/api/sync-youtube') {
                try {
                    const channelId = parsedUrl.searchParams.get('id') || null;
                    const result = await syncYouTubeToSupabase(channelId);
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(result, null, 2));
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                }
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    service: 'YouTube -> Supabase Channels Auto-Sync API',
                    endpoints: {
                        syncAll: `http://localhost:${PORT}/api/sync-youtube`,
                        syncOne: `http://localhost:${PORT}/api/sync-youtube?id=UCX6OQ3DkcsbYNE6H8uQQuVA`
                    }
                }, null, 2));
            }
        });

        server.listen(PORT, () => {
            console.log(`API Server đang chạy tại: http://localhost:${PORT}/api/sync-youtube`);
        });
    } else {
        const targetId = args[0] && !args[0].startsWith('--') ? args[0] : null;
        console.log('Đang lấy dữ liệu từ YouTube Data API v3 và cập nhật vào Supabase...');
        syncYouTubeToSupabase(targetId)
            .then(result => {
                console.log(`Đã cập nhật thành công ${result.updated_count} kênh trên Supabase!`);
                console.table(result.channels);
            })
            .catch(err => {
                console.error('Lỗi đồng bộ:', err);
                process.exit(1);
            });
    }
}

module.exports = { syncYouTubeToSupabase, formatSubscribersCount, loadConfigFromFiles };
