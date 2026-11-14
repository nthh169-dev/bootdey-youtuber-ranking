# Lịch sử Cuộc trò chuyện & Ngữ cảnh Dự án (Antigravity Chat Backup)

> **Mẹo khi mở trên máy tính khác**: Khi mở project này trên máy mới bằng Antigravity, bạn chỉ cần nhắn trong khung chat mới:
> *"Hãy đọc file `CHAT_HISTORY.md` để nắm toàn bộ ngữ cảnh dự án và tiếp tục hỗ trợ mình"* — AI sẽ hiểu ngay toàn bộ lịch sử và cấu hình đã làm mà không cần giải thích lại từ đầu.

---

## 1. Thông tin Kết nối & Cấu hình Hệ thống

### A. Supabase (`supabase.txt` & `supabase.js`)
- **Project URL**: `https://qhkdldltwqnwpmifqdcj.supabase.co`
- **Publishable Key**: `sb_publishable_th6ALyrrhz5qWwppeBOlRw_ouLOX2CU`
- **Bảng dữ liệu**: `public.channels` (21 kênh YouTube)
- **Bảo mật RLS**:
  - Đã bật Row Level Security (`ENABLE ROW LEVEL SECURITY`).
  - Đã tạo Policy `"Allow public read access on channels"` (`FOR SELECT TO anon, authenticated USING (true)`).

### B. YouTube Data API v3 (`youtube.txt` & `supabase.js`)
- **Endpoint**: `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails`
- **Các cột tự động cập nhật trong bảng `channels`**:
  1. `subscribers` (`BIGINT`)
  2. `subscribers_formatted` (`VARCHAR` - ví dụ: `526M`, `316M`, `15.5M`, `833K`)
  3. `videos_count` (`INT`)
  4. `view_count` (`BIGINT`)

### C. Các Hàm RPC & Cron trên Supabase Database
1. `public.format_subscribers_count(p_subs bigint)`: Định dạng số lượng người đăng ký (`B`, `M`, `K`).
2. `public.sync_youtube_channels_stats(p_channel_id varchar DEFAULT NULL)`:
   - Hàm chạy trực tiếp trong PostgreSQL (sử dụng extension `http`), tự động gọi YouTube Data API v3 (theo `id` và dự phòng theo `forHandle`) và cập nhật 4 cột trong `public.channels`.
3. `public.update_channels_youtube_stats(p_items jsonb)`:
   - Hàm RPC nhận mảng JSON các kênh để cập nhật hàng loạt 4 cột.
4. **Lịch tự động `pg_cron`**:
   - Job `auto-sync-youtube-channels-stats` chạy tự động mỗi 6 giờ (`0 */6 * * *`).

---

## 2. Cấu hình Deploy Cloudflare Workers & Link Cron-Job

### A. Các file cấu hình Cloudflare Workers
- `wrangler.jsonc`: Cấu hình Worker `main: "worker.js"`, Static Assets (`"run_worker_first": true`) và Cron Trigger (`0 */6 * * *`).
- `worker.js`: Xử lý API `/api/sync-youtube` trực tiếp trên Cloudflare Edge và phục vụ các trang tĩnh (`index.html`, `profile.html`, `img/...`).
- `api/sync-youtube/index.html` & `api/sync-youtube.html`: Trang fallback tự động chạy đồng bộ khi truy cập ở chế độ Static Assets.

### B. Link dùng để gắn vào dịch vụ Cron-Job (cron-job.org, UptimeRobot...)
1. **Link qua Cloudflare Worker (`GET` hoặc `POST`)**:
   - Cập nhật tất cả kênh: `https://bootdey-youtuber-ranking.nthh169.workers.dev/api/sync-youtube`
   - Cập nhật 1 kênh theo ID: `https://bootdey-youtuber-ranking.nthh169.workers.dev/api/sync-youtube?id=UCX6OQ3DkcsbYNE6H8uQQuVA`
2. **Link gọi trực tiếp tới Supabase RPC (`GET` hoặc `POST`)**:
   - `https://qhkdldltwqnwpmifqdcj.supabase.co/rest/v1/rpc/sync_youtube_channels_stats?apikey=sb_publishable_th6ALyrrhz5qWwppeBOlRw_ouLOX2CU`

---

## 3. Tóm tắt Lịch sử Trao đổi
1. **Yêu cầu 1**: Kết nối project với Supabase dựa trên file `supabase.txt` và bảng `channels`.
   - *Đã thực hiện*: Tạo `supabase.js`, kết nối `channels-data.js`, `index.html`, `profile.html` với Supabase, mở quyền đọc RLS cho bảng `channels` và đồng bộ đầy đủ 21 kênh.
2. **Yêu cầu 2**: Tạo API tự động cập nhật 4 cột (`subscribers`, `subscribers_formatted`, `videos_count`, `view_count`) từ YouTube API trong `youtube.txt`.
   - *Đã thực hiện*: Tạo hàm RPC `sync_youtube_channels_stats` & `update_channels_youtube_stats` trên Supabase, tạo `youtube-sync-api.js`, và thêm nút **Cập nhật từ YouTube API** trên giao diện `index.html` và `profile.html`.
3. **Yêu cầu 3**: Khắc phục lỗi 404 khi gọi `/api/sync-youtube` trên Cloudflare Workers (`bootdey-youtuber-ranking.nthh169.workers.dev`) và cung cấp link cài đặt Cron-Job.
   - *Đã thực hiện*: Tạo `worker.js`, `wrangler.jsonc`, `.assetsignore`, `api/sync-youtube/index.html` và `api/sync-youtube.html`.
