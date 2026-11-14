// Cấu hình kết nối Supabase (được nạp từ supabase.js / supabase.txt)
var SUPABASE_CONFIG = (typeof window !== 'undefined' && window.SUPABASE_CONFIG) || {
    url: 'https://qhkdldltwqnwpmifqdcj.supabase.co',
    publishableKey: 'sb_publishable_th6ALyrrhz5qWwppeBOlRw_ouLOX2CU',
    table: 'channels'
};

// Dữ liệu dự phòng (fallback) được trích xuất từ file data-channels.sql (21 kênh)
const FALLBACK_CHANNELS_DATA = [
    {
        id: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
        name: 'MrBeast',
        handle: '@MrBeast',
        avatar: 'default-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 375000000,
        subscribers_formatted: '375M',
        category: 'Entertainment',
        videos_count: 840,
        view_count: 0,
        description: 'Kênh giải trí lớn nhất thế giới của Jimmy Donaldson (MrBeast) với các thử thách quy mô lớn và hoạt động từ thiện.',
        url: 'https://youtube.com/@MrBeast',
        website: 'https://mrbeast.com',
        facebook: 'https://facebook.com/MrBeast6000',
        twitter: 'https://twitter.com/MrBeast',
        tiktok: 'https://tiktok.com/@mrbeast',
        published_at: '2012-02-20T00:00:00Z'
    },
    {
        id: 'UCq-Fj5jknLsUf-MWSy4_brA',
        name: 'T-Series',
        handle: '@tseries',
        avatar: 'tseries-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 285000000,
        subscribers_formatted: '285M',
        category: 'Music',
        videos_count: 21500,
        view_count: 0,
        description: 'Hãng thu âm và sản xuất phim hàng đầu Ấn Độ (Super Cassettes Industries Private Limited).',
        url: 'https://youtube.com/@tseries',
        website: 'https://tseries.com',
        facebook: 'https://facebook.com/tseriesmusic',
        twitter: 'https://twitter.com/TSeries',
        tiktok: null,
        published_at: '2006-03-13T00:00:00Z'
    },
    {
        id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
        name: 'PewDiePie',
        handle: '@PewDiePie',
        avatar: 'pewdiepie-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 111000000,
        subscribers_formatted: '111M',
        category: 'Game',
        videos_count: 4790,
        view_count: 0,
        description: 'Kênh YouTube cá nhân nổi tiếng của Felix Kjellberg chuyên về bình luận game, meme và vlog.',
        url: 'https://youtube.com/@PewDiePie',
        website: 'https://pewdiepie.com',
        facebook: 'https://facebook.com/pewdiepie',
        twitter: 'https://twitter.com/pewdiepie',
        tiktok: null,
        published_at: '2010-04-29T00:00:00Z'
    },
    {
        id: 'UCGCZAYq5Xxojl_tSXcVJhiQ',
        name: 'ANN News Channel',
        handle: '@ANNnewsCH',
        avatar: 'ann-news-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 3800000,
        subscribers_formatted: '3.8M',
        category: 'News',
        videos_count: 154000,
        view_count: 0,
        description: 'Kênh tin tức chính thức của mạng lưới All-Nippon News Network (TV Asahi) tại Nhật Bản.',
        url: 'https://youtube.com/@ANNnewsCH',
        website: 'https://news.tv-asahi.co.jp',
        facebook: null,
        twitter: 'https://twitter.com/tv_asahi_news',
        tiktok: null,
        published_at: '2009-07-07T00:00:00Z'
    },
    {
        id: 'UC8butISFwT-Wl7EV0hUK0BQ',
        name: 'FreeCodeCamp.org',
        handle: '@freecodecamp',
        avatar: 'freecodecamp-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 10200000,
        subscribers_formatted: '10.2M',
        category: 'Development',
        videos_count: 1850,
        view_count: 0,
        description: 'Cộng đồng mã nguồn mở giúp mọi người học lập trình miễn phí thông qua các khóa học chuyên sâu.',
        url: 'https://youtube.com/@freecodecamp',
        website: 'https://www.freecodecamp.org',
        facebook: null,
        twitter: 'https://twitter.com/freecodecamp',
        tiktok: null,
        published_at: '2014-12-16T00:00:00Z'
    },
    {
        id: 'UCJFZiqLm7iJ0vEM18y4_bWw',
        name: 'Hololive Ch. hololive-VTuber',
        handle: '@hololive',
        avatar: 'hololive-channel-thumbnail.jpg',
        banner: 'hololive-channel-banner.jpg',
        subscribers: 2500000,
        subscribers_formatted: '2.5M',
        category: 'VTuber',
        videos_count: 2100,
        view_count: 0,
        description: 'Kênh chính thức của nhóm nhạc thần tượng ảo VTuber Hololive Production thuộc COVER Corp.',
        url: 'https://youtube.com/@hololive',
        website: 'https://hololive.hololivepro.com',
        facebook: null,
        twitter: 'https://twitter.com/hololivetv',
        tiktok: 'https://tiktok.com/@hololive_eng',
        published_at: '2016-05-02T00:00:00Z'
    },
    {
        id: 'UC4YaOt1yT-ZeyB0OmxHgolA',
        name: 'Kizuna AI Channel',
        handle: '@KizunaAI',
        avatar: 'kizuna-ai-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 3000000,
        subscribers_formatted: '3.0M',
        category: 'VTuber',
        videos_count: 1100,
        view_count: 0,
        description: 'Virtual YouTuber (VTuber) tiên phong trên thế giới với khẩu hiệu kết nối mọi người qua AI.',
        url: 'https://youtube.com/@KizunaAI',
        website: 'https://kizunaai.com',
        facebook: null,
        twitter: 'https://twitter.com/aichan_nel',
        tiktok: 'https://tiktok.com/@kizunaai0630',
        published_at: '2016-10-19T00:00:00Z'
    },
    {
        id: 'UCott96qGP5ADmsB_yNQMvDA',
        name: 'Muse Vietnam',
        handle: '@MuseVN',
        avatar: 'musevn-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 1800000,
        subscribers_formatted: '1.8M',
        category: 'Entertainment',
        videos_count: 3200,
        view_count: 0,
        description: 'Kênh phát sóng Anime bản quyền chính thức của Muse Communication tại Việt Nam.',
        url: 'https://youtube.com/@MuseVN',
        website: null,
        facebook: 'https://facebook.com/museacg.vn',
        twitter: null,
        tiktok: null,
        published_at: '2020-05-15T00:00:00Z'
    },
    {
        id: 'UClOf1XXinvZsy4wKPAkro2A',
        name: 'PlayOverwatch',
        handle: '@PlayOverwatch',
        avatar: 'play-overwatch-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 3600000,
        subscribers_formatted: '3.6M',
        category: 'Game',
        videos_count: 890,
        view_count: 0,
        description: 'Kênh YouTube chính thức của tựa game bắn súng đồng đội Overwatch từ Blizzard Entertainment.',
        url: 'https://youtube.com/@PlayOverwatch',
        website: 'https://overwatch.blizzard.com',
        facebook: 'https://facebook.com/PlayOverwatch',
        twitter: 'https://twitter.com/PlayOverwatch',
        tiktok: null,
        published_at: '2014-11-07T00:00:00Z'
    },
    {
        id: 'UC9nK195uN_z_4L0Qj7x1l0w',
        name: 'SBS Drama',
        handle: '@sbsdrama',
        avatar: 'sbs-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 7200000,
        subscribers_formatted: '7.2M',
        category: 'Entertainment',
        videos_count: 45000,
        view_count: 0,
        description: 'Kênh phim truyền hình chính thức của đài truyền hình SBS Hàn Quốc.',
        url: 'https://youtube.com/@sbsdrama',
        website: 'https://www.sbs.co.kr',
        facebook: 'https://facebook.com/sbsNOW',
        twitter: null,
        tiktok: null,
        published_at: '2012-08-22T00:00:00Z'
    },
    {
        id: 'UCuP2vJ6_0nB9H_P1o5_P3wA',
        name: 'Vexsper',
        handle: '@vexsper',
        avatar: 'vexsper-channel-thumbnail.jpg',
        banner: 'default-channel-banner.jpg',
        subscribers: 500000,
        subscribers_formatted: '500K',
        category: 'Development',
        videos_count: 150,
        view_count: 0,
        description: 'Kênh chia sẻ kiến thức lập trình, phát triển phần mềm và công nghệ hiện đại.',
        url: 'https://youtube.com/@vexsper',
        website: null,
        facebook: null,
        twitter: 'https://twitter.com/vexsper',
        tiktok: null,
        published_at: '2021-03-10T00:00:00Z'
    },
    {
        id: 'UCVia_crjzJylRmGq7SHTiaw',
        name: 'Hearthstone',
        handle: '@Hearthstone',
        avatar: 'hearthstone-channel-thumbnail.jpg',
        banner: 'hearthstone-channel-banner.jpg',
        subscribers: 496000,
        subscribers_formatted: '496K',
        category: 'Game',
        videos_count: 1680,
        view_count: 0,
        description: 'Kênh chính thức của trò chơi thẻ bài chiến thuật Hearthstone lấy bối cảnh vũ trụ Warcraft.',
        url: 'https://youtube.com/@Hearthstone',
        website: 'https://us.shop.battle.net/en-us/family/hearthstone',
        facebook: null,
        twitter: null,
        tiktok: null,
        published_at: '2013-03-22T00:00:00Z'
    },
    {
        id: 'UCkWnwVAYGshTEVDPZ451kBQ',
        name: 'essie ch.',
        handle: '@essiech',
        avatar: 'essie-channel-thumbnail.jpg',
        banner: 'essie-channel-banner.jpg',
        subscribers: 75400,
        subscribers_formatted: '75.4K',
        category: 'VTuber',
        videos_count: 497,
        view_count: 0,
        description: 'Kênh sáng tạo nội dung và stream của VTuber essie.',
        url: 'https://www.youtube.com/@essiech',
        website: null,
        facebook: null,
        twitter: 'https://x.com/essie_ch',
        tiktok: null,
        published_at: '2021-07-01T00:00:00Z'
    },
    {
        id: 'UCp-9F3MEliOQ2sbAnG0OqLQ',
        name: 'Gawr Gura Ch. hololive-EN',
        handle: '@GawrGura',
        avatar: 'gawr-gura-channel-thumbnail.jpg',
        banner: 'gawr-gura-channel-banner.jpg',
        subscribers: 4590000,
        subscribers_formatted: '4.59M',
        category: 'VTuber',
        videos_count: 565,
        view_count: 0,
        description: 'Kênh VTuber Gawr Gura thuộc thế hệ Hololive English -Myth-.',
        url: 'https://www.youtube.com/@GawrGura',
        website: null,
        facebook: null,
        twitter: 'https://x.com/gawrgura',
        tiktok: null,
        published_at: '2020-07-16T00:00:00Z'
    },
    {
        id: 'UCCzUftO8KOVkV4wQG1vkU1g',
        name: 'Marine Ch. 宝鐘マリン',
        handle: '@HoushouMarine',
        avatar: 'houshou-marine-channel-thumbnail.jpg',
        banner: 'houshou-marine-channel-banner.jpg',
        subscribers: 4440000,
        subscribers_formatted: '4.44M',
        category: 'VTuber',
        videos_count: 565,
        view_count: 0,
        description: 'Kênh chính thức của thuyền trưởng Houshou Marine thuộc Hololive Fantasy (Gen 3).',
        url: 'https://www.youtube.com/@HoushouMarine',
        website: null,
        facebook: null,
        twitter: null,
        tiktok: null,
        published_at: '2019-07-22T00:00:00Z'
    },
    {
        id: 'UC5CwaMl1eIgY8h02uZw7u8A',
        name: 'Suisei Channel',
        handle: '@HoshimachiSuisei',
        avatar: 'hoshimachi-suisei-channel-thumbnail.jpg',
        banner: 'hoshimachi-suisei-channel-banner.jpg',
        subscribers: 75400,
        subscribers_formatted: '75.4K',
        category: 'VTuber',
        videos_count: 497,
        view_count: 0,
        description: 'Kênh âm nhạc và livestream của thần tượng ảo Hoshimachi Suisei thuộc Hololive Gen 0.',
        url: 'https://www.youtube.com/@HoshimachiSuisei',
        website: null,
        facebook: null,
        twitter: null,
        tiktok: null,
        published_at: '2018-03-18T00:00:00Z'
    },
    {
        id: 'UC1DCedRgGHBdm81E1llLhOQ',
        name: 'Pekora Ch. 兎田ぺこら',
        handle: '@usadapekora',
        avatar: 'usada-pekora-channel-thumbnail.jpg',
        banner: 'usada-pekora-channel-banner.jpg',
        subscribers: 75400,
        subscribers_formatted: '75.4K',
        category: 'VTuber',
        videos_count: 497,
        view_count: 0,
        description: 'Kênh livestream game và giải trí của Usada Pekora thuộc Hololive Fantasy (Gen 3).',
        url: 'https://www.youtube.com/@usadapekora',
        website: null,
        facebook: null,
        twitter: null,
        tiktok: null,
        published_at: '2019-07-07T00:00:00Z'
    },
    {
        id: 'UC-hM6YJuNYVAmUWxeIr9FeA',
        name: 'Miko Ch. さくらみこ',
        handle: '@SakuraMiko',
        avatar: 'sakura-miko-channel-thumbnail.jpg',
        banner: 'sakura-miko-channel-banner.jpg',
        subscribers: 75400,
        subscribers_formatted: '75.4K',
        category: 'VTuber',
        videos_count: 497,
        view_count: 0,
        description: 'Kênh chính thức của Elite VTuber Sakura Miko thuộc Hololive Gen 0.',
        url: 'https://www.youtube.com/@usadapekora',
        website: null,
        facebook: null,
        twitter: null,
        tiktok: null,
        published_at: '2018-04-25T00:00:00Z'
    },
    {
        id: 'UC7jHm3zfoSZWV5d1cxfJ-BA',
        name: 'Ngọc Trinh Official',
        handle: '@ngoctrinhofficial9626',
        avatar: 'ngoc-trinh-channel-thumbnail.jpg',
        banner: 'ngoc-trinh-channel-banner.jpg',
        subscribers: 75400,
        subscribers_formatted: '75.4K',
        category: 'Entertainment',
        videos_count: 341,
        view_count: 0,
        description: 'Kênh vlog đời sống, thời trang và giải trí chính thức của Ngọc Trinh.',
        url: 'https://www.youtube.com/@ngoctrinhofficial9626',
        website: null,
        facebook: null,
        twitter: null,
        tiktok: null,
        published_at: '2019-02-14T00:00:00Z'
    },
    {
        id: 'UCfdNM3NAhaBOXCafH7krzrA',
        name: 'The Infographics Show',
        handle: '@TheInfographicsShow',
        avatar: 'the-infographics-show-channel-thumbnail.jpg',
        banner: 'the-infographics-show-channel-banner.jpg',
        subscribers: 75400,
        subscribers_formatted: '75.4K',
        category: 'News',
        videos_count: 6391,
        view_count: 0,
        description: 'Kênh video đồ họa thông tin (infographics) giải thích kiến thức, lịch sử và tin tức thú vị.',
        url: 'https://www.youtube.com/@TheInfographicsShow',
        website: null,
        facebook: null,
        twitter: null,
        tiktok: null,
        published_at: '2011-04-06T00:00:00Z'
    },
    {
        id: 'UCTF0ldaORTbCfx2ahvFfYWg',
        name: 'Phê Game',
        handle: '@daylaphegame',
        avatar: 'phe-game-channel-thumbnail.jpg',
        banner: 'phe-game-channel-banner.jpg',
        subscribers: 75400,
        subscribers_formatted: '75.4K',
        category: 'Entertainment',
        videos_count: 6391,
        view_count: 0,
        description: 'Kênh phân tích cốt truyện game, đánh giá game và tin tức làng game chuyên sâu tại Việt Nam.',
        url: 'https://www.youtube.com/@daylaphegame',
        website: null,
        facebook: null,
        twitter: null,
        tiktok: null,
        published_at: '2020-01-12T00:00:00Z'
    }
];

// Biến dữ liệu chính dùng cho giao diện (mặc định khởi tạo bằng fallback trước khi đồng bộ từ Supabase)
let CHANNELS_DATA = FALLBACK_CHANNELS_DATA.slice();

// Khởi tạo hoặc sử dụng Supabase Client từ supabase.js
var supabaseClient = (typeof window !== 'undefined' && window.supabaseClient) || null;
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.publishableKey);
        window.supabaseClient = supabaseClient;
    }
}

function formatSubscribersCount(num) {
    const n = Number(num || 0);
    if (n >= 1000000) {
        return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'M';
    }
    if (n >= 1000) {
        return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'K';
    }
    return String(n);
}

function normalizeChannelRow(row) {
    const fallbackItem = FALLBACK_CHANNELS_DATA.find(function (item) { return item.id === row.id; }) || {};
    const subscribers = Number(row.subscribers != null ? row.subscribers : (fallbackItem.subscribers || 0));
    return {
        id: row.id,
        name: row.name || fallbackItem.name || 'Unknown Channel',
        handle: row.handle || fallbackItem.handle || '',
        avatar: row.avatar || fallbackItem.avatar || 'default-channel-thumbnail.jpg',
        banner: row.banner || fallbackItem.banner || 'default-channel-banner.jpg',
        subscribers: subscribers,
        subscribers_formatted: row.subscribers_formatted || fallbackItem.subscribers_formatted || formatSubscribersCount(subscribers),
        category: row.category || fallbackItem.category || 'Entertainment',
        videos_count: Number(row.videos_count != null ? row.videos_count : (fallbackItem.videos_count || 0)),
        view_count: Number(row.view_count != null ? row.view_count : (fallbackItem.view_count || 0)),
        description: row.description || fallbackItem.description || '',
        url: row.url || fallbackItem.url || '#',
        website: row.website || fallbackItem.website || null,
        facebook: row.facebook || fallbackItem.facebook || null,
        twitter: row.twitter || fallbackItem.twitter || null,
        tiktok: row.tiktok || fallbackItem.tiktok || null,
        published_at: row.published_at || fallbackItem.published_at || row.created_at || null
    };
}

// Hàm tải danh sách kênh trực tiếp từ bảng `channels` trên Supabase
async function fetchChannelsFromSupabase() {
    try {
        let rows = null;

        // Ưu tiên dùng Supabase JS SDK nếu có
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from(SUPABASE_CONFIG.table)
                .select('*')
                .order('subscribers', { ascending: false });
            if (!error && Array.isArray(data)) {
                rows = data;
            }
        }

        // Nếu chưa có rows (hoặc SDK gặp lỗi), gọi trực tiếp Supabase REST API
        if (!rows) {
            const endpoint = SUPABASE_CONFIG.url + '/rest/v1/' + SUPABASE_CONFIG.table + '?select=*&order=subscribers.desc';
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_CONFIG.publishableKey,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Supabase HTTP Error: ' + response.status);
            }
            rows = await response.json();
        }

        if (Array.isArray(rows) && rows.length > 0) {
            const normalized = rows.map(normalizeChannelRow);
            CHANNELS_DATA.length = 0;
            normalized.forEach(function (item) {
                CHANNELS_DATA.push(item);
            });
            return { data: CHANNELS_DATA, source: 'supabase', count: CHANNELS_DATA.length, error: null };
        }

        return { data: CHANNELS_DATA, source: 'fallback', count: CHANNELS_DATA.length, error: 'Bảng channels trên Supabase đang trống' };
    } catch (err) {
        console.warn('Không thể tải dữ liệu từ Supabase, sử dụng dữ liệu dự phòng:', err);
        return { data: CHANNELS_DATA, source: 'fallback', count: CHANNELS_DATA.length, error: err.message || String(err) };
    }
}

if (typeof window !== 'undefined') {
    window.fetchChannelsFromSupabase = fetchChannelsFromSupabase;
}
