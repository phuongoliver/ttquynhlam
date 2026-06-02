# Quỳnh Lam — Creative Portfolio

Portfolio cá nhân cho Trịnh Thanh Quỳnh Lam, sinh viên Báo chí CLC tại ĐH KHXH&NV, ĐHQG-HCM.

**Live:** [quynhlam.vercel.app](https://quynhlam.vercel.app) · **Admin:** `/admin`

---

## Tech stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Font | Be Vietnam Pro |
| Animation | Framer Motion |
| Charts | Recharts |
| Deploy | Vercel |

---

## Cài đặt local

```bash
git clone https://github.com/<your-username>/quynhlam-portfolio.git
cd quynhlam-portfolio
npm install
cp .env.example .env.local   # điền token vào đây
npm run dev                  # → http://localhost:3000
```

---

## Cấu trúc data

Toàn bộ nội dung đọc từ 2 file JSON — sửa file rồi commit để redeploy:

| File | Nội dung |
|---|---|
| `data/content.json` | Thông tin CV: họ tên, kinh nghiệm, kỹ năng, học vấn |
| `data/stats.json` | Số liệu kênh: TikTok, Threads, UIT, BeeMedic |

---

## Cập nhật số liệu

### Cách 1 — Admin dashboard (đơn giản nhất)

1. Truy cập `/admin` → nhập mật khẩu (`NEXT_PUBLIC_ADMIN_SECRET`)
2. Sửa số liệu trực tiếp trên giao diện
3. Nhấn **Lưu** → **Export JSON** → tải file `stats-YYYY-MM-DD.json`
4. Copy file → đổi tên thành `data/stats.json` → commit → push

### Cách 2 — Sửa file trực tiếp

Mở `data/stats.json`, sửa số liệu, commit và push.
Vercel tự build lại trong khoảng 1 phút.

### Cách 3 — Threads API sync

Sau khi setup token (xem mục Threads API bên dưới):

1. Vào `/admin` → nhấn **↺ Sync Threads API**
2. Xem preview → nhấn **Áp dụng**
3. **Lưu** → **Export JSON** → commit

---

## CV

Xem và in tại:
- `/cv` — Tiếng Việt
- `/cv/en` — English

Mở bằng Chrome → `Ctrl+P` → **Save as PDF** → đặt vào `public/cv/`.

---

## Threads API setup

1. Tạo app tại [developers.facebook.com](https://developers.facebook.com)
2. Add **Threads** product → OAuth với tài khoản Threads
3. Xin quyền: `threads_basic`, `threads_manage_insights`
4. Lấy long-lived token (60 ngày) → điền vào `.env.local`

```bash
THREADS_ACCESS_TOKEN=your_long_lived_token
THREADS_USER_ID=your_user_id
```

Refresh token trước khi hết hạn (60 ngày):

```bash
curl "https://graph.threads.net/v1.0/refresh_access_token?grant_type=th_refresh_token&access_token=YOUR_TOKEN"
```

---

## Deploy lên Vercel

1. Push repo lên GitHub
2. Import tại [vercel.com](https://vercel.com) → chọn repo
3. Add env vars trong Vercel dashboard:

```
NEXT_PUBLIC_SITE_URL=https://quynhlam.vercel.app
NEXT_PUBLIC_ADMIN_SECRET=your_password
THREADS_ACCESS_TOKEN=...
THREADS_USER_ID=...
THREADS_APP_ID=...
THREADS_APP_SECRET=...
```

4. Deploy — xong. Mọi push lên `main` sẽ tự redeploy.

---

## Biến môi trường

Xem đầy đủ trong [`.env.example`](.env.example).

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Có | URL deploy (VD: https://quynhlam.vercel.app) |
| `NEXT_PUBLIC_ADMIN_SECRET` | Nên có | Mật khẩu trang `/admin` |
| `THREADS_ACCESS_TOKEN` | Threads sync | Long-lived token (60 ngày) |
| `THREADS_USER_ID` | Threads sync | Numeric user ID Threads |

---

*Maintained by Oliver (friend of Quỳnh Lam)*
