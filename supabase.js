// Cấu hình kết nối Supabase (đồng bộ từ file supabase.txt)
var SUPABASE_CONFIG = {
    url: 'https://qhkdldltwqnwpmifqdcj.supabase.co',
    publishableKey: 'sb_publishable_th6ALyrrhz5qWwppeBOlRw_ouLOX2CU',
    table: 'channels'
};

// Cấu hình YouTube Data API v3 (đồng bộ từ file youtube.txt)
var YOUTUBE_CONFIG = {
    endpoint: 'https://www.googleapis.com/youtube/v3/channels',
    parts: 'snippet,statistics,contentDetails',
    apiKey: 'AIzaSyCoccJ_YSStOgdLxct49Td3PA9z6e4aJ_A'
};

// Khởi tạo Supabase Client từ @supabase/supabase-js CDN
var supabaseClient = null;
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.YOUTUBE_CONFIG = YOUTUBE_CONFIG;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.publishableKey
        );
        window.supabaseClient = supabaseClient;
    }
}
