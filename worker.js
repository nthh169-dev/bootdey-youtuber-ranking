/**
 * Cloudflare Worker cho dự án bootdey-youtuber-ranking
 * Hỗ trợ:
 * 1. API Endpoint: GET/POST /api/sync-youtube (và ?id=...)
 *    Tự động lấy dữ liệu từ YouTube Data API v3 và cập nhật 4 cột:
 *    subscribers, subscribers_formatted, videos_count, view_count vào bảng `channels` trên Supabase.
 * 2. Static Assets: Phục vụ giao diện index.html, profile.html, img/...
 */

const DEFAULT_CONFIG = {
    supabaseUrl: 'https://qhkdldltwqnwpmifqdcj.supabase.co',
    supabaseKey: 'sb_publishable_th6ALyrrhz5qWwppeBOlRw_ouLOX2CU',
    table: 'channels',
    youtubeApiKey: 'AIzaSyCoccJ_YSStOgdLxct49Td3PA9z6e4aJ_A',
    youtubeEndpoint: 'https://www.googleapis.com/youtube/v3/channels'
};

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

async function handleSyncYouTube(urlObj, env) {
    const supabaseUrl = (env && env.SUPABASE_URL) || DEFAULT_CONFIG.supabaseUrl;
    const supabaseKey = (env && env.SUPABASE_KEY) || DEFAULT_CONFIG.supabaseKey;
    const youtubeApiKey = (env && env.YOUTUBE_API_KEY) || DEFAULT_CONFIG.youtubeApiKey;
    const targetChannelId = urlObj.searchParams.get('id') || null;

    // 1. Lấy danh sách kênh từ bảng `channels` trên Supabase
    let queryUrl = `${supabaseUrl}/rest/v1/${DEFAULT_CONFIG.table}?select=id,name,handle`;
    if (targetChannelId) {
        queryUrl += `&id=eq.${encodeURIComponent(targetChannelId)}`;
    }

    const chRes = await fetch(queryUrl, {
        headers: {
            'apikey': supabaseKey,
            'Accept': 'application/json'
        }
    });

    if (!chRes.ok) {
        throw new Error(`Không thể đọc bảng channels từ Supabase (HTTP ${chRes.status})`);
    }

    const channels = await chRes.json();
    if (!Array.isArray(channels) || channels.length === 0) {
        return {
            success: false,
            updated_count: 0,
            message: 'Không tìm thấy kênh cần đồng bộ trong bảng channels'
        };
    }

    // 2. Gọi YouTube Data API v3 theo danh sách ID
    const idsCsv = channels.map(c => c.id).join(',');
    const ytByIdUrl = `${DEFAULT_CONFIG.youtubeEndpoint}?part=snippet,statistics,contentDetails&id=${encodeURIComponent(idsCsv)}&key=${encodeURIComponent(youtubeApiKey)}`;
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

    // 3. Đối chiếu từng kênh (hỗ trợ tra cứu qua forHandle nếu ID trong DB là ID mẫu)
    const updates = [];
    for (const ch of channels) {
        let ytItem = ytItemsById.get(ch.id);

        if (!ytItem && ch.handle) {
            let handleLookup = ch.handle.trim();
            if (handleLookup.toLowerCase() === '@sbsdrama') {
                handleLookup = '@SBSCatch';
            }
            const ytByHandleUrl = `${DEFAULT_CONFIG.youtubeEndpoint}?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(handleLookup)}&key=${encodeURIComponent(youtubeApiKey)}`;
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

    // 4. Cập nhật 4 cột vào Supabase thông qua RPC `update_channels_youtube_stats`
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/update_channels_youtube_stats`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
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

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const pathname = url.pathname.replace(/\/+$/, '');

        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (pathname === '/api/sync-youtube') {
            try {
                const result = await handleSyncYouTube(url, env);
                return new Response(JSON.stringify(result, null, 2), {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json; charset=utf-8',
                        'Cache-Control': 'no-store'
                    }
                });
            } catch (err) {
                return new Response(JSON.stringify({
                    success: false,
                    error: err.message || String(err)
                }, null, 2), {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            }
        }

        // Phục vụ các file tĩnh (index.html, profile.html, img/...)
        if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
            return env.ASSETS.fetch(request);
        }

        return new Response('Not Found', { status: 404 });
    },

    // Hỗ trợ Cloudflare Cron Triggers tự động chạy ngầm
    async scheduled(event, env, ctx) {
        ctx.waitUntil(handleSyncYouTube(new URL('https://localhost/api/sync-youtube'), env));
    }
};
