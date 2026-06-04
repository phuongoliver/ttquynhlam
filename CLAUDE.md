# CLAUDE.md — Trịnh Thanh Quỳnh Lam · Creative Portfolio & CV

> Đọc toàn bộ file này trước khi viết bất kỳ dòng code nào.
> File này là single source of truth cho toàn bộ project.

---

## 0. Project Brief

Build một **portfolio web cá nhân** cho Trịnh Thanh Quỳnh Lam (bút danh: Quỳnh Lam / Đông Xanh / Chung Lan), sinh viên Báo chí CLC năm 3 tại ĐH KHXH&NV, ĐHQG-HCM, đang apply vị trí **Creative Copywriter Intern/Fresher tại MoMo**.

Hai deliverable song song:
1. **Portfolio web** — Next.js, deploy Vercel, dashboard cập nhật stat kênh
2. **CV giấy PDF** — song ngữ VN + EN, layout A4, style minimal modern MoMo

Người cuối cùng mở portfolio này là **nhà tuyển dụng MoMo** và **bạn bè / đối tác trong ngành content**. Ấn tượng đầu tiên quyết định tất cả.

---

## 1. Tech Stack

| Layer | Quyết định | Lý do |
|-------|-----------|-------|
| Framework | **Next.js 14** (App Router) | Serverless `/api` route cho Threads API, deploy Vercel zero-config |
| Styling | **Tailwind CSS** | Utility-first, dễ token màu MoMo |
| Font | **Be Vietnam Pro** (Google Fonts) | Đẹp tiếng Việt, modern, có đủ weights |
| Animation | **Framer Motion** | Fade-in scroll nhẹ, không lạm dụng |
| Charts | **Recharts** | Visualize stat kênh, lightweight |
| CMS / Data layer | **Sanity v3** | Lam chỉnh sửa MỌI content (CV, bio, bullets, stats, works...) qua Sanity Studio tại `/studio` — giao diện như Notion, không thấy JSON, không cần code. Free tier đủ dùng. |
| Sanity Studio | Embedded trong Next.js tại `app/studio/[[...tool]]/page.tsx` | Không cần deploy riêng, Lam vào `quynhlam.vercel.app/studio` là xài được |
| Auth Studio | Sanity built-in (Google/GitHub login) | Lam tạo Sanity account 1 lần, sau đó login bằng Google — không cần nhớ mật khẩu thêm |
| Threads API | `/api/threads-sync` (Next.js Route Handler) | Proxy giữ token phía server, không lộ secret ra client |
| Deploy | **Vercel** (GitHub integration) | Push → auto-deploy, zero config với Next.js |
| PDF CV | HTML + `@media print` → Chrome print to PDF | Đơn giản nhất, không token, không dependency nặng |

---

## 2. Design System — MoMo × Minimal Modern

### Color Palette

```css
/* Primary */
--momo-deep:    #A50064;   /* màu MoMo chính — dùng cho tên, section heading, border accent */
--momo-bright:  #D82D8B;   /* accent — hover state, icon, highlight stat */
--momo-light:   #FCE4F3;   /* background tint nhẹ — card background, tag */

/* Neutral */
--ink:          #1A1A1A;   /* body text chính */
--ink-soft:     #4A4A4A;   /* secondary text, caption */
--line:         #E8E8E8;   /* divider, border */
--surface:      #FAFAFA;   /* page background */
--white:        #FFFFFF;   /* card surface */

/* Semantic */
--tiktok:       #010101;   /* TikTok brand */
--threads:      #000000;   /* Threads brand */
```

### Typography Scale

```
Display (tên):   Be Vietnam Pro 700, 48px
H1 (section):    Be Vietnam Pro 600, 32px
H2 (card title): Be Vietnam Pro 600, 20px
Body:            Be Vietnam Pro 400, 16px, line-height 1.7
Caption:         Be Vietnam Pro 400, 13px
Label/tag:       Be Vietnam Pro 500, 12px uppercase tracking-wide
Stat number:     Be Vietnam Pro 700, 40px, color: --momo-deep
```

### Design Principles

- **Không dùng gradient màu sắc** — chỉ dùng flat color
- **Chỉ 1 màu chủ**: `--momo-deep` dẫn mắt (line dưới tên, section bullet, link hover)
- **Khoảng trắng nhiều** — content thoáng, không nhồi nhét
- **Số liệu phải lớn** — stat (311K, 212K) là selling point, không được nhỏ
- **Mobile-first** — nhà tuyển dụng xem trên điện thoại là chính

---

## 3. Folder Structure

```
quynhlam-portfolio/
├── CLAUDE.md                        ← file này (luôn đọc trước)
├── .env.local                       ← secrets (không commit)
├── .env.example
├── next.config.js
├── tailwind.config.js
├── sanity.config.ts                 ← Sanity Studio config (project ID, dataset, schemas)
├── sanity.cli.ts                    ← CLI config cho `sanity deploy`
├── package.json
│
├── data/
│   ├── content.json                 ← seed data (dùng 1 lần để import vào Sanity)
│   └── stats.json                   ← seed data (dùng 1 lần để import vào Sanity)
│
├── sanity/
│   ├── schemas/
│   │   ├── index.ts                 ← export tất cả schemas
│   │   ├── siteContent.ts           ← schema: personal info, bio, profile
│   │   ├── experience.ts            ← schema: mảng experience entries
│   │   ├── signatureWork.ts         ← schema: mảng portfolio works
│   │   ├── skills.ts                ← schema: skills groups
│   │   ├── education.ts             ← schema: education + certs
│   │   └── channelStats.ts          ← schema: TikTok + Threads + UIT stats
│   ├── lib/
│   │   ├── client.ts                ← Sanity client (browser-safe, read-only token)
│   │   ├── queries.ts               ← GROQ queries cho từng section
│   │   └── image.ts                 ← urlFor() helper cho ảnh
│   └── components/                  ← custom Studio components nếu cần
│
├── cv/
│   ├── cv-vn.html
│   └── cv-en.html
│
├── public/
│   ├── cv/
│   │   ├── CV_QuynhLam_VN.pdf
│   │   └── CV_QuynhLam_EN.pdf
│   ├── og-image.jpg
│   └── favicon.ico
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     ← portfolio (fetch data từ Sanity)
│   ├── globals.css
│   │
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx             ← Sanity Studio embedded (Lam vào /studio)
│   │
│   └── api/
│       └── threads-sync/
│           └── route.ts
│
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── StatsBoard.tsx
│   │   ├── SelectedWorks.tsx
│   │   ├── Channels.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   └── Footer.tsx
│   │
│   └── ui/
│       ├── StatCard.tsx
│       ├── WorkCard.tsx
│       └── ChannelTable.tsx
│
└── lib/
    ├── threads.ts
    └── utils.ts
```

---

## 4. Data Files

### `data/stats.json` — Nguồn dữ liệu dashboard

```json
{
  "lastUpdated": "2026-06-02",
  "tiktok_panorama": {
    "handle": "@panorama.pvt",
    "url": "https://www.tiktok.com/@panorama.pvt",
    "totalVideos": 11,
    "totalViews": 660000,
    "topVideo": {
      "title": "Ngô Lan Hương + Chi Xê",
      "views": 311400,
      "likes": 16400,
      "url": "https://www.tiktok.com/@panorama.pvt/video/7510958733405523208"
    },
    "videos": [
      { "title": "Ngô Lan Hương + Chi Xê", "views": 311400, "likes": 16400, "url": "https://www.tiktok.com/@panorama.pvt/video/7510958733405523208" },
      { "title": "Cầu vồng lấp lánh", "views": 161600, "likes": 6701, "url": "https://www.tiktok.com/@panorama.pvt/video/7432919036050017553" },
      { "title": "Chị đẹp đi đường quyền", "views": 64500, "likes": 1645, "url": "https://www.tiktok.com/@panorama.pvt/video/7433043693201886480" },
      { "title": "ATSH (Alan Walker - Spectre)", "views": 31800, "likes": 1742, "url": "https://www.tiktok.com/@panorama.pvt/video/7414500921629003028" },
      { "title": "Atus (Bao lời con chưa nói)", "views": 23400, "likes": 2010, "url": "https://www.tiktok.com/@panorama.pvt/video/7404506177163316487" },
      { "title": "PMC (Vũ Trụ Cò Bay)", "views": 23200, "likes": 499, "url": "https://www.tiktok.com/@panorama.pvt/video/7428068945661332753" },
      { "title": "Dương Domic", "views": 10300, "likes": 852, "url": "https://www.tiktok.com/@panorama.pvt/video/7437852914770644231" },
      { "title": "Jackie edit 1", "views": 15800, "likes": 356, "url": "https://www.tiktok.com/@panorama.pvt/video/7379593305312546055" },
      { "title": "Jackie edit 2", "views": 11200, "likes": 241, "url": "https://www.tiktok.com/@panorama.pvt/video/7381831887087504661" },
      { "title": "Khánh Vy (đa ảnh)", "views": 6023, "likes": 75, "url": "https://www.tiktok.com/@panorama.pvt/photo/7489132709684481335" },
      { "title": "Jackie edit 3", "views": 847, "likes": 44, "url": "https://www.tiktok.com/@panorama.pvt/video/7385535907803303186" }
    ]
  },
  "threads_queenlam": {
    "handle": "@ttqueenlam",
    "displayName": "Queen Lam",
    "url": "https://www.threads.com/@ttqueenlam",
    "status": "archived_dec2025",
    "direction": "UGC - Showbiz Việt & Bình đẳng giới",
    "topPost": {
      "title": "Dh Foods / Giờ tan học TP.HCM",
      "views": 131000,
      "url": "https://www.threads.com/@ttqueenlam/post/DO0NhabkouC"
    },
    "posts": [
      { "title": "Giờ tan học TP.HCM (viral)", "views": 131000, "likes": 3100, "comments": 542, "reposts": 357, "url": "https://www.threads.com/@ttqueenlam/post/DO0NhabkouC" },
      { "title": "Tính năng mới của Threads", "views": 124000, "likes": 2700, "comments": 67, "reposts": 400, "url": "https://www.threads.com/@ttqueenlam/post/DLlpJ7Cy5wg" },
      { "title": "Mở cửa / Đóng cửa", "views": 122000, "likes": 4700, "comments": 80, "reposts": 161, "url": "https://www.threads.com/@ttqueenlam/post/DLIDOIYym1Z" },
      { "title": "Mưa đỏ (highlight báo chí)", "views": 27900, "likes": 2600, "comments": 28, "reposts": 92, "url": "https://www.threads.com/@ttqueenlam/post/DOSOaZgElVC" },
      { "title": "Thành tựu Phương Mỹ Chi", "views": 22700, "likes": 1500, "comments": 27, "reposts": 136, "url": "https://www.threads.com/@ttqueenlam/post/DNnpdpYyThX" },
      { "title": "Thảo luận giáo dục, ngôn ngữ", "views": 50100, "likes": 1500, "comments": 96, "reposts": 201, "url": "https://www.threads.com/@ttqueenlam/post/DLoeNISPp44" }
    ]
  },
  "threads_finding20s": {
    "handle": "@finding20s",
    "displayName": "Chung Lan học lớn",
    "url": "https://www.threads.com/@finding20s",
    "status": "archived_dec2025",
    "direction": "UGC - F&B, Beauty, Sức khỏe",
    "topPost": {
      "title": "Dh Foods Rebranding",
      "views": 212000,
      "url": "https://www.threads.com/@finding20s/post/DP_L9MZk9na"
    },
    "posts": [
      { "title": "Dh Foods Rebranding (post 2)", "views": 212000, "likes": 6500, "comments": 41, "reposts": 271, "url": "https://www.threads.com/@finding20s/post/DP_L9MZk9na" },
      { "title": "Dh Foods Rebranding (post 1)", "views": 206000, "likes": 4100, "comments": 125, "reposts": 69, "url": "https://www.threads.com/@finding20s/post/DP83ejSE3FT" },
      { "title": "Dh Foods Rebranding (post 3)", "views": 76900, "likes": 1100, "comments": 26, "reposts": 13, "url": "https://www.threads.com/@finding20s/post/DQL-shVjAvS" },
      { "title": "BVS Diana - Em Xinh", "views": 13200, "likes": 873, "comments": 8, "reposts": 8, "url": "https://www.threads.com/@finding20s/post/DP6L2S0Ewfh" },
      { "title": "Hướng dẫn skincare", "views": 12100, "likes": 117, "comments": 98, "reposts": 13, "url": "https://www.threads.com/@finding20s/post/DPvKEQxEwXd" }
    ]
  },
  "uit_articles": {
    "platform": "UIT – Trường ĐH Công nghệ Thông tin",
    "url": "https://www.uit.edu.vn",
    "startDate": "2024-03-01",
    "totalArticles": 2000,
    "byYear": { "2023": 72, "2024": 925, "2025": 673, "2026_ytd": 330 }
  },
  "beemedic_articles": {
    "platform": "BeeMedic.vn",
    "penName": "Chung Lan",
    "url": "https://beemedic.vn",
    "totalArticles": 7,
    "topics": ["Sức khỏe sinh sản", "Hỏi đáp phòng the", "Ăn khỏe - Sống khỏe"]
  }
}
```

### `data/content.json` — CV Content

```json
{
  "personal": {
    "name": "Trịnh Thanh Quỳnh Lam",
    "penNames": ["Quỳnh Lam", "Đông Xanh", "Chung Lan"],
    "major": "Báo chí — Chương trình Chất lượng cao",
    "school": "Trường ĐH KHXH&NV, ĐHQG-HCM",
    "schoolShort": "USSH – VNUHCM",
    "gpa": "8.61/10",
    "gpaSemesters": 5,
    "ielts": "6.0 (Overall)",
    "location": "TP. Hồ Chí Minh",
    "email": "PLACEHOLDER_EMAIL",
    "phone": "PLACEHOLDER_PHONE",
    "linkedin": "PLACEHOLDER_LINKEDIN",
    "github": "PLACEHOLDER_GITHUB",
    "portfolioUrl": "PLACEHOLDER_VERCEL_URL"
  },
  "highlights": [
    "~2.000 tin/bài chấp bút (2023–nay)",
    "TikTok top video: 311.4K views",
    "Threads top post: 212K views",
    "1 bài đăng Báo Tuổi Trẻ (in + online)",
    "GPA 8.61 · IELTS 6.0 · MOS Associate"
  ],
  "profile": {
    "vi": "Sinh viên năm cuối ngành Báo chí CLC (ĐH KHXH&NV) với hơn 2 năm viết và sản xuất nội dung cho website trường, báo Tuổi Trẻ, BeeMedic và các kênh TikTok/Threads tự xây. Đã chấp bút ~2.000 tin/bài, có video TikTok đạt 311K views và Threads post chạm 212K views. Đam mê dissect ý tưởng hay, quan sát văn hoá mạng và biến insight thành câu chữ chạm cảm xúc. Sử dụng ChatGPT, Claude, Gemini hàng ngày cho ideation, research và content production.",
    "en": "Final-year Journalism student (CLC program, USSH – VNUHCM) with 2+ years writing and producing content for UIT's university website, Tuổi Trẻ newspaper, BeeMedic, and self-built TikTok/Threads channels. Author of ~2,000 published articles, with a TikTok video reaching 311K views and a Threads post hitting 212K views. Passionate about dissecting great ideas, tracking internet culture, and turning insight into copy that lands emotionally. Daily user of ChatGPT, Claude, and Gemini for ideation, research, and content production."
  },
  "experience": [
    {
      "id": "uit",
      "role_vi": "Cộng tác viên Truyền thông",
      "role_en": "Media Contributor",
      "org_vi": "Trường ĐH Công nghệ Thông tin, ĐHQG-HCM",
      "org_en": "University of Information Technology, VNU-HCM",
      "period": "03/2024 – nay",
      "bullets_vi": [
        "Chấp bút ~2.000 tin/bài trên website trường; đỉnh điểm 925 bài trong năm 2024.",
        "Viết chuỗi bài chân dung sinh viên ưu tú: tự lên concept, đặt tagline, soạn câu phỏng vấn, drafting đến final edit.",
        "Biên tập và chuẩn hoá tone & voice cho fanpage Tuyển sinh UIT — cân bằng ngôn ngữ GenZ và chuẩn mực học thuật."
      ],
      "bullets_en": [
        "Authored ~2,000 published articles on the university website; peak output of 925 articles in 2024.",
        "Self-directed student portrait series: concept, headline, interview questions, drafting through final edit.",
        "Copy-edited and standardized tone & voice for UIT Admissions fanpage — balancing GenZ language with academic standards."
      ],
      "links": [
        { "label": "Dionysus — Tình bạn kết tinh từ nghiên cứu khoa học", "url": "https://www.uit.edu.vn/dionysus-tinh-ban-ket-tinh-tu-nghien-cuu-khoa-hoc" },
        { "label": "'Bóng hồng' tài năng ngành KHMT", "url": "https://www.uit.edu.vn/bong-hong-tai-nang-nganh-khoa-hoc-may-tinh" }
      ]
    },
    {
      "id": "tuoitre",
      "role_vi": "Cộng tác viên Ban Giáo dục",
      "role_en": "Education Desk Contributor",
      "org_vi": "Báo Tuổi Trẻ",
      "org_en": "Tuổi Trẻ Newspaper",
      "period": "11/2024",
      "bullets_vi": [
        "Tự tác nghiệp, bài được đăng trên cả báo in và báo điện tử Tuổi Trẻ — tờ báo lớn nhất khu vực phía Nam.",
        "Bài: "Bất ngờ: học sinh tự tổ chức đêm nhạc toàn sao" — chủ đề GenZ dám mơ lớn, làm lớn."
      ],
      "bullets_en": [
        "Independently reported and published in both print and online editions of Tuổi Trẻ — Vietnam's largest southern newspaper.",
        "Feature: "Students Stun with Self-Produced All-Star Concert" — capturing GenZ's ambition to dream and execute big."
      ],
      "links": [
        { "label": "Bài báo điện tử Tuổi Trẻ", "url": "https://tuoitre.vn/bat-ngo-hoc-sinh-tu-to-chuc-dem-nhac-toan-sao-20241128095757422.htm" }
      ]
    },
    {
      "id": "panorama",
      "role_vi": "Scriptwriter & Content Creator",
      "role_en": "Scriptwriter & Content Creator",
      "org_vi": "TikTok @panorama.pvt — ekip Panorama, CLB Phóng Viên Trẻ USSH",
      "org_en": "TikTok @panorama.pvt — Panorama Team, USSH Young Journalists Club",
      "period": "06/2024 – nay",
      "bullets_vi": [
        "Đồng sáng lập ekip Panorama: khai thác văn hoá – nghệ thuật – giải trí để sản xuất video ấn tượng.",
        "Viết kịch bản, edit (CapCut), caption cho 11+ video; tổng >660K views.",
        "Video viral nhất: "Ngô Lan Hương + Chi Xê" — 311.4K views, 16.4K likes; "Cầu vồng lấp lánh" — 161.6K views."
      ],
      "bullets_en": [
        "Co-founded Panorama — a content team covering culture, arts, and entertainment for short-form video.",
        "Wrote scripts, edited (CapCut), and crafted captions for 11+ videos; combined 660K+ views.",
        "Top video: "Ngô Lan Hương + Chi Xê" — 311.4K views, 16.4K likes; "Cầu vồng lấp lánh" — 161.6K views."
      ]
    },
    {
      "id": "threads",
      "role_vi": "Founder & Content Creator",
      "role_en": "Founder & Content Creator",
      "org_vi": "Threads @ttqueenlam & @finding20s",
      "org_en": "Threads @ttqueenlam & @finding20s",
      "period": "2025 (thử nghiệm)",
      "bullets_vi": [
        "Xây 2 tài khoản với 2 angle khác nhau: showbiz/bình đẳng giới vs. UGC nhãn hàng F&B – beauty.",
        "Post "Dh Foods Rebranding" — 212K views, "Giờ tan học TP.HCM" — 131K views, "Tính năng mới Threads" — 124K views.",
        "Rèn kỹ năng đọc mạng xã hội, bắt trend nhanh, viết caption chạm insight GenZ."
      ],
      "bullets_en": [
        "Built 2 accounts testing 2 angles: showbiz/gender equality (UGC news) vs. F&B–beauty brand UGC.",
        ""Dh Foods Rebranding" — 212K views; "Giờ tan học TP.HCM" — 131K views; "Tính năng mới Threads" — 124K views.",
        "Developed skills in social listening, trend identification, and caption writing that resonates with GenZ."
      ]
    },
    {
      "id": "beemedic",
      "role_vi": "Content Writer (bút danh Chung Lan)",
      "role_en": "Content Writer (pen name Chung Lan)",
      "org_vi": "BeeMedic.vn",
      "org_en": "BeeMedic.vn",
      "period": "05/2025 – nay",
      "bullets_vi": [
        "Viết 7+ bài về sức khoẻ giới tính, dinh dưỡng — chủ đề nhạy cảm, cần cân bằng khoa học và dễ tiếp cận cho GenZ.",
        "Rèn khả năng viết tone empathy + headline có hook — chuyển thông tin y khoa khô thành bài đọc được."
      ],
      "bullets_en": [
        "Authored 7+ articles on sexual health and nutrition — sensitive topics requiring balance between clinical accuracy and GenZ readability.",
        "Developed empathy-first writing tone and hook-driven headlines — translating medical information into engaging reads."
      ]
    }
  ],
  "projects": [
    {
      "id": "justice",
      "title_vi": "Trưởng Ban Nội dung — Mùa tuyển thứ 16 'JUSTice'",
      "title_en": "Head of Content — 16th Recruitment Season 'JUSTice'",
      "org": "CLB Phóng Viên Trẻ USSH",
      "period": "10–11/2024",
      "desc_vi": "Dẫn dắt ban Nội dung: chốt concept, phân công, soạn văn bản thể lệ, đề thi, kịch bản; làm việc trực tiếp với Ban Giám khảo."
    },
    {
      "id": "inkspire",
      "title_vi": "BTC Ban Nội dung — Tuần lễ Phóng Viên Trẻ 2024 'INKSPIRE'",
      "title_en": "Organizing Committee (Content) — INKSPIRE 2024",
      "org": "CLB Phóng Viên Trẻ USSH",
      "period": "2024",
      "desc_vi": "Brainstorm tagline & key message; viết kịch bản khai mạc, talkshow, tập huấn, chung kết."
    },
    {
      "id": "wisteria",
      "title_vi": "Trưởng Ban Liên lạc — Gala 15 năm CLB 'Wish'teria'",
      "title_en": "Head of Relations — 15th Anniversary Gala 'Wish'teria'",
      "org": "CLB Phóng Viên Trẻ USSH",
      "period": "2025"
    },
    {
      "id": "younique",
      "title_vi": "BTC Ban Đối ngoại — Talkshow 'YOU'NIQUE' (Thương hiệu cá nhân)",
      "title_en": "Organizing Committee (External Relations) — 'YOU'NIQUE' Personal Branding Talkshow",
      "org": "CLB Phóng Viên Trẻ USSH",
      "period": "2025",
      "desc_vi": "Lập danh sách nhà tài trợ, soạn mail mẫu, liên hệ và pitch ý tưởng với nhà tài trợ."
    }
  ],
  "signatureWorks": [
    {
      "id": "sw1",
      "title": "Tình yêu Trí tuệ nhân tạo của cậu sinh viên Khoa học Máy tính",
      "type_vi": "Bài chân dung — UIT",
      "type_en": "Portrait Feature — UIT",
      "hook_vi": "Chân dung có góc kể emotion + tech — tự tiếp cận, tự đặt headline.",
      "hook_en": "An emotion-meets-tech portrait — self-pitched, self-headlined.",
      "url": "https://www.uit.edu.vn/tinh-yeu-tri-tue-nhan-tao-cau-sinh-vien-khoa-hoc-may-tinh"
    },
    {
      "id": "sw2",
      "title": "Dionysus — Tình bạn kết tinh từ nghiên cứu khoa học",
      "type_vi": "Bài chân dung nhóm — UIT",
      "type_en": "Group Portrait — UIT",
      "hook_vi": "Dùng metaphor thần thoại đặt tên nhóm sinh viên nghiên cứu — kể chuyện bằng hình ảnh.",
      "hook_en": "Named a student research group after a Greek myth — storytelling through imagery.",
      "url": "https://www.uit.edu.vn/dionysus-tinh-ban-ket-tinh-tu-nghien-cuu-khoa-hoc"
    },
    {
      "id": "sw3",
      "title": "Bất ngờ: học sinh tự tổ chức đêm nhạc toàn sao",
      "type_vi": "Báo Tuổi Trẻ — In + Online",
      "type_en": "Tuổi Trẻ Newspaper — Print + Online",
      "hook_vi": "Bài được đăng báo chính thống lớn nhất phía Nam — tự tác nghiệp.",
      "hook_en": "Published in Vietnam's largest southern newspaper — fully self-reported.",
      "url": "https://tuoitre.vn/bat-ngo-hoc-sinh-tu-to-chuc-dem-nhac-toan-sao-20241128095757422.htm"
    },
    {
      "id": "sw4",
      "title": "Ngô Lan Hương + Chi Xê — TikTok Viral",
      "type_vi": "Kịch bản + Edit + Caption — TikTok",
      "type_en": "Script + Edit + Caption — TikTok",
      "hook_vi": "311.4K views, 16.4K likes — viết kịch bản, dựng video, đặt caption.",
      "hook_en": "311.4K views, 16.4K likes — script, edit, caption all in-house.",
      "url": "https://www.tiktok.com/@panorama.pvt/video/7510958733405523208"
    },
    {
      "id": "sw5",
      "title": "Dh Foods Rebranding — Threads Viral",
      "type_vi": "UGC Case Study — Threads @finding20s",
      "type_en": "UGC Brand Case Study — Threads @finding20s",
      "hook_vi": "212K views — phân tích rebranding nhãn hàng, angle người tiêu dùng GenZ.",
      "hook_en": "212K views — brand rebranding analysis from a GenZ consumer angle.",
      "url": "https://www.threads.com/@finding20s/post/DP_L9MZk9na"
    },
    {
      "id": "sw6",
      "title": "'Bóng hồng' tài năng ngành Khoa học Máy tính",
      "type_vi": "Bài chân dung — UIT",
      "type_en": "Portrait Feature — UIT",
      "hook_vi": "Tự tiếp cận nhân vật, tự đặt headline — mô tả người phụ nữ trong ngành STEM.",
      "hook_en": "Self-pitched, self-headlined — portraying a woman thriving in a male-dominated STEM field.",
      "url": "https://www.uit.edu.vn/bong-hong-tai-nang-nganh-khoa-hoc-may-tinh"
    }
  ],
  "skills": {
    "copywriting": [
      "Tagline, headline, social caption, kịch bản video ngắn, storyboard",
      "Long-form journalism: chân dung, phỏng vấn, tường thuật sự kiện",
      "Biên tập, chuẩn hoá tone & voice cho fanpage và website",
      "Viết theo nhiều angle: GenZ bắt trend · học thuật · UGC nhãn hàng"
    ],
    "ai": [
      "ChatGPT, Claude, Gemini — dùng hàng ngày: research, brainstorm, drafting, polishing",
      "Prompt engineering cơ bản: phân vai, đưa brief, yêu cầu tone-of-voice cụ thể",
      "Dùng AI để dissect vì sao một headline/TVC hay — rút insight cho project tiếp theo",
      "Kết hợp AI với CapCut/Canva để tăng tốc sản xuất (script → caption → thumbnail)"
    ],
    "tools": [
      "Video editing: CapCut (intermediate)",
      "Design: Canva (intermediate)",
      "MS Office: MOS Associate — Word, Excel, PowerPoint 2019",
      "Social platforms: TikTok, Threads, Facebook, Instagram — hiểu thuật toán và hành vi người xem"
    ],
    "languages": [
      "Tiếng Việt — bản ngữ",
      "Tiếng Anh — IELTS 6.0 (Overall)",
      "Tiếng Trung — đang học"
    ]
  },
  "education": {
    "school_vi": "Trường ĐH Khoa học Xã hội và Nhân văn — ĐHQG-HCM",
    "school_en": "University of Social Sciences and Humanities — VNUHCM",
    "major_vi": "Ngành Báo chí — Chương trình Chất lượng cao, Khoa Báo chí và Truyền thông",
    "major_en": "Journalism — High-Quality Program, Faculty of Journalism and Communication",
    "period": "2023 – 2027 (dự kiến)",
    "gpa": "8.61/10",
    "certs": ["IELTS 6.0 Overall", "MOS Associate — Word, Excel, PowerPoint 2019"]
  },
  "interests": [
    "Lưu mọi tagline / TVC / campaign đáng nhớ vào ghi chú riêng để mổ xẻ vì sao nó hay",
    "Viết caption nhiều hơn nhắn tin — có thói quen quan sát, phản xạ ngôn từ",
    "Hàng trăm note ý tưởng trong điện thoại, cập nhật hàng tuần",
    "Quan tâm cảm xúc con người, song tò mò với AI, fintech và văn hoá internet",
    "Thích môi trường fast-paced, lún tay vào thử nghiệm cái mới"
  ]
}
```

---

## 5. Sections — Chi tiết từng phần web

### 5.1 Hero
- Background: trắng thuần. Không ảnh nền, không gradient.
- Layout: centered, tên lớn `--momo-deep`, pen names nhỏ hơn kiểu italic.
- Tagline 1 câu: lấy từ `profile.vi` (rút gọn, punchier).
- CTA: 2 nút — **"Tải CV (VN)"** + **"Tải CV (EN)"** → link `/public/cv/*.pdf`.
- Social links: TikTok @panorama.pvt · Threads @ttqueenlam.
- Hiệu ứng: typing animation trên tagline (nhẹ thôi) hoặc fade-in đơn giản.

### 5.2 Stats Dashboard ⭐ (feature chính)

**Layout**: 4 "Big Number" cards đầu trang (KPI hero):
| KPI | Giá trị |
|-----|---------|
| Tổng tin/bài | ~2.000 |
| TikTok top video | 311.4K views |
| Threads top post | 212K views |
| Báo đã đăng | 1 (Tuổi Trẻ) |

Phía dưới: Tabs hoặc Accordion theo kênh:
- **TikTok @panorama.pvt** — bar chart top 5 video theo views + bảng đầy đủ 11 video
- **Threads @ttqueenlam** — top posts table
- **Threads @finding20s** — top posts table
- **UIT Articles** — line/bar chart bài theo năm (2023→2024→2025→2026 YTD)

**Edit Mode**: không còn inline trên portfolio public — đã chuyển sang `/admin`. Portfolio chỉ đọc, không có nút sửa công khai.

### 5.3 Selected Works
- Grid 2×3 (desktop) / 1 cột (mobile)
- Mỗi card: type badge (màu `--momo-light`, chữ `--momo-deep`) + title + hook 1 câu + view count nếu có + link "Đọc / Xem →"
- Lấy từ `content.signatureWorks[6]`

### 5.4 Experience
- Timeline dọc (vertical line `--momo-deep`)
- Mỗi mục: role · org · period · bullet list
- Logo/icon đơn giản cho UIT, Tuổi Trẻ, Panorama, BeeMedic

### 5.5 Skills
- 4 nhóm: Copywriting · AI & Innovation · Tools · Languages
- Dạng tag pill hoặc grid có icon nhỏ
- **AI & Innovation để màu khác nhẹ** (vì JD MoMo nhấn riêng section này)

### 5.6 Footer
- Tên + pen names + email (placeholder) + năm
- "Made with Claude + Next.js · Deploy on Vercel" (optional, credit nhỏ)

---

## 6. Admin — Sanity Studio (`/studio`)

### Tại sao Sanity thay vì custom admin

Lam cần edit **mọi thứ**: bio, bullets kinh nghiệm, danh sách works, kỹ năng, số liệu kênh, thậm chí CV. Build custom form cho từng field đó = tháng trời code. Sanity cho Lam giao diện CMS chuyên nghiệp sẵn, developer chỉ cần define schema.

### Lam thấy gì khi vào `/studio`

Giao diện Studio chia sidebar trái thành các "document type":

```
📄 Thông tin cá nhân       ← sửa tên, bio, email, tagline, profile VN/EN
📋 Kinh nghiệm             ← list, có thể drag reorder, mỗi entry có rich text bullets
🎨 Selected Works          ← list 6 works, add/remove/reorder tùy ý
🛠 Kỹ năng                 ← 4 nhóm skills, add/remove tag
🎓 Học vấn & Chứng chỉ    ← GPA, certs
📊 Thống kê kênh           ← TikTok videos, Threads posts, số liệu
```

Lam bấm vào bất kỳ document → thấy form có label tiếng Việt → sửa → bấm **Publish** → portfolio live ngay (Next.js revalidate on-demand hoặc ISR 60s).

**Không có JSON. Không có code. Không có terminal.**

### Setup Sanity (bạn làm 1 lần)

```bash
# Trong folder project
npm create sanity@latest -- --project YOUR_PROJECT_ID --dataset production --template clean
# Hoặc tạo project mới tại sanity.io/manage
```

Thêm Lam vào project: **sanity.io/manage → Project → Members → Add member** (bằng email). Cho quyền **Editor**.

Lam chỉ cần: tạo account Sanity (free, login bằng Google) → nhận invite → vào `/studio` là dùng được.

### `sanity.config.ts` — cấu hình Studio

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemas } from './sanity/schemas'

export default defineConfig({
  name: 'qlam-portfolio',
  title: 'Portfolio Quỳnh Lam',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Nội dung')
          .items([
            S.documentTypeListItem('siteContent').title('Thông tin cá nhân'),
            S.documentTypeListItem('experience').title('Kinh nghiệm'),
            S.documentTypeListItem('signatureWork').title('Selected Works'),
            S.documentTypeListItem('skills').title('Kỹ năng'),
            S.documentTypeListItem('education').title('Học vấn'),
            S.documentTypeListItem('channelStats').title('Thống kê kênh'),
          ])
    }),
    visionTool(), // GROQ query playground, hữu ích khi debug
  ],
  schema: { types: schemas },
})
```

### Schemas — định nghĩa từng document

#### `sanity/schemas/siteContent.ts`
```typescript
export const siteContent = defineType({
  name: 'siteContent',
  title: 'Thông tin cá nhân',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Họ và tên', type: 'string' }),
    defineField({ name: 'penNames', title: 'Bút danh (phân cách bởi dấu phẩy)', type: 'string' }),
    defineField({ name: 'tagline_vi', title: 'Tagline (Tiếng Việt)', type: 'text', rows: 2 }),
    defineField({ name: 'tagline_en', title: 'Tagline (English)', type: 'text', rows: 2 }),
    defineField({ name: 'profile_vi', title: 'Giới thiệu bản thân (Tiếng Việt)', type: 'text', rows: 5 }),
    defineField({ name: 'profile_en', title: 'Giới thiệu bản thân (English)', type: 'text', rows: 5 }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Số điện thoại', type: 'string' }),
    defineField({ name: 'location', title: 'Địa điểm', type: 'string' }),
    defineField({ name: 'highlights', title: 'Key Highlights (CV header)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'photo', title: 'Ảnh đại diện', type: 'image' }),
  ],
})
```

#### `sanity/schemas/experience.ts`
```typescript
export const experience = defineType({
  name: 'experience',
  title: 'Kinh nghiệm',
  type: 'document',
  fields: [
    defineField({ name: 'order', title: 'Thứ tự hiển thị', type: 'number' }),
    defineField({ name: 'role_vi', title: 'Chức vụ (Tiếng Việt)', type: 'string' }),
    defineField({ name: 'role_en', title: 'Chức vụ (English)', type: 'string' }),
    defineField({ name: 'org_vi', title: 'Tổ chức (Tiếng Việt)', type: 'string' }),
    defineField({ name: 'org_en', title: 'Tổ chức (English)', type: 'string' }),
    defineField({ name: 'period', title: 'Thời gian', type: 'string' }),
    defineField({ name: 'bullets_vi', title: 'Mô tả công việc (Tiếng Việt)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'bullets_en', title: 'Mô tả công việc (English)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'links', title: 'Link bài viết / video', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'label', title: 'Tên hiển thị', type: 'string' },
        { name: 'url', title: 'URL', type: 'url' },
      ]
    }]}),
  ],
  orderings: [{ title: 'Thứ tự', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
```

#### `sanity/schemas/channelStats.ts`
```typescript
// Schema này cho phép Lam sửa số liệu kênh + thêm/xóa video/post
export const channelStats = defineType({
  name: 'channelStats',
  title: 'Thống kê kênh',
  type: 'document',
  fields: [
    defineField({ name: 'lastUpdated', title: 'Cập nhật lúc', type: 'datetime' }),
    defineField({
      name: 'tiktok',
      title: 'TikTok @panorama.pvt',
      type: 'object',
      fields: [
        { name: 'totalViews', title: 'Tổng lượt xem', type: 'number' },
        { name: 'totalVideos', title: 'Tổng số video', type: 'number' },
        { name: 'videos', title: 'Danh sách video', type: 'array', of: [{
          type: 'object',
          fields: [
            { name: 'title', title: 'Tên video', type: 'string' },
            { name: 'views', title: 'Lượt xem', type: 'number' },
            { name: 'likes', title: 'Lượt thích', type: 'number' },
            { name: 'url', title: 'Link TikTok', type: 'url' },
          ]
        }]}
      ]
    }),
    defineField({
      name: 'threads_queenlam',
      title: 'Threads @ttqueenlam',
      type: 'object',
      fields: [
        { name: 'posts', title: 'Danh sách bài', type: 'array', of: [{
          type: 'object',
          fields: [
            { name: 'title', title: 'Tên / mô tả bài', type: 'string' },
            { name: 'views', title: 'Lượt xem', type: 'number' },
            { name: 'likes', title: 'Lượt thích', type: 'number' },
            { name: 'comments', title: 'Bình luận', type: 'number' },
            { name: 'reposts', title: 'Repost', type: 'number' },
            { name: 'url', title: 'Link bài', type: 'url' },
          ]
        }]}
      ]
    }),
    defineField({
      name: 'threads_finding20s',
      title: 'Threads @finding20s',
      type: 'object',
      // tương tự threads_queenlam
    }),
    defineField({
      name: 'uit',
      title: 'Bài viết UIT',
      type: 'object',
      fields: [
        { name: 'totalArticles', title: 'Tổng bài đã đăng', type: 'number' },
        { name: 'byYear', title: 'Số bài theo năm', type: 'array', of: [{
          type: 'object',
          fields: [
            { name: 'year', title: 'Năm', type: 'string' },
            { name: 'count', title: 'Số bài', type: 'number' },
          ]
        }]}
      ]
    }),
  ]
})
```

> Schemas còn lại (`signatureWork`, `skills`, `education`) tương tự — build theo cùng pattern. Xem `data/content.json` để biết đầy đủ fields cần define.

### `sanity/lib/queries.ts` — GROQ queries

```typescript
export const SITE_CONTENT_QUERY = `*[_type == "siteContent"][0]`
export const EXPERIENCE_QUERY = `*[_type == "experience"] | order(order asc)`
export const WORKS_QUERY = `*[_type == "signatureWork"] | order(order asc)`
export const STATS_QUERY = `*[_type == "channelStats"][0]`
export const SKILLS_QUERY = `*[_type == "skills"][0]`
export const EDUCATION_QUERY = `*[_type == "education"][0]`
```

### Fetch data trong Next.js components

```typescript
// app/page.tsx — Server Component, fetch trực tiếp
import { client } from '@/sanity/lib/client'
import { SITE_CONTENT_QUERY, EXPERIENCE_QUERY } from '@/sanity/lib/queries'

export default async function Home() {
  const [siteContent, experiences] = await Promise.all([
    client.fetch(SITE_CONTENT_QUERY),
    client.fetch(EXPERIENCE_QUERY),
  ])
  // ...
}
```

**Revalidation**: dùng `next: { revalidate: 60 }` trong fetch options → portfolio tự refresh tối đa 60 giây sau khi Lam bấm Publish. Hoặc setup Sanity webhook → Next.js on-demand revalidation (instant).

---

## 7. Threads API Integration

### Setup Flow

```
1. Tạo Meta Developer App tại developers.facebook.com
2. Add Threads product → OAuth với tài khoản Threads của Lam
3. Xin permissions: threads_basic, threads_manage_insights
4. Lấy Long-lived token (sống 60 ngày)
5. Implement token refresh tự động trong lib/threads.ts
```

### Environment Variables (.env.local)

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id   # lấy từ sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token                      # Settings → API → Add token (Editor role)

# Threads API
THREADS_APP_ID=your_app_id
THREADS_APP_SECRET=your_app_secret
THREADS_ACCESS_TOKEN_QUEENLAM=your_token         # token của @ttqueenlam
THREADS_ACCESS_TOKEN_FINDING20S=your_token       # token của @finding20s
THREADS_USER_ID_QUEENLAM=your_user_id
THREADS_USER_ID_FINDING20S=your_user_id
```

### `/api/threads-sync/route.ts`

```
GET /api/threads-sync
- Gọi Threads Insights API: GET /{user-id}/threads?fields=id,text,timestamp,views,likes,replies,reposts
- Map response về shape của stats.json
- Không lưu server-side (stateless) — trả về JSON, client quyết định có lưu không
- Error handling: nếu token expired → trả 401 + message hướng dẫn refresh
```

### Threads API endpoints cần dùng

```
GET https://graph.threads.net/v1.0/{user-id}/threads
  ?fields=id,text,timestamp,permalink,views,likes_count,replies_count,reposts_count
  &limit=25
  &access_token={token}

GET https://graph.threads.net/v1.0/{media-id}/insights
  ?metric=views,likes,replies,reposts,quotes
  &access_token={token}
```

---

## 8. CV Generation

CV được làm ngoài Next.js (không cần dynamic render). Cách làm đề xuất:

**Option A (đơn giản, khuyến nghị)**: Tạo `cv/index.html` riêng với CSS print-friendly, mở bằng Chrome → Ctrl+P → Save as PDF. Làm 2 bản VN + EN bằng cách đổi ngôn ngữ trong HTML.

**Option B**: Dùng `@react-pdf/renderer` nếu muốn integrate vào Next.js và có nút "Download CV" dynamic.

CV content: lấy từ `data/content.json`, không hardcode thẳng vào template.

---

## 9. Deploy Checklist

```bash
# 1. Init project
npx create-next-app@latest quynhlam-portfolio --typescript --tailwind --app

# 2. Cài dependencies
npm install next-sanity @sanity/vision @sanity/image-url sanity
npm install framer-motion recharts
npm install -D @types/node

# 3. Tạo Sanity project
npx sanity@latest init
# → chọn "Create new project" → tên: qlam-portfolio → dataset: production → template: clean

# 4. Setup env
cp .env.example .env.local
# → điền NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN, Threads tokens

# 5. Import seed data vào Sanity (chạy 1 lần)
# Dùng Sanity CLI hoặc import thủ công qua Studio

# 6. Test local
npm run dev
# Portfolio: localhost:3000
# Studio:    localhost:3000/studio

# 7. Thêm Lam vào Sanity project
# sanity.io/manage → project → Members → Add → email của Lam → role: Editor

# 8. Push GitHub → import vào vercel.com → Add env vars → Deploy
```

**Vercel env vars cần add:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `THREADS_APP_ID`, `THREADS_APP_SECRET`
- `THREADS_ACCESS_TOKEN_QUEENLAM`, `THREADS_USER_ID_QUEENLAM`
- `THREADS_ACCESS_TOKEN_FINDING20S`, `THREADS_USER_ID_FINDING20S`

**Sau khi deploy**, vào Sanity project settings → API → **CORS Origins** → thêm domain Vercel (`https://quynhlam.vercel.app`). Không làm bước này thì Studio trên production sẽ bị lỗi CORS.

---

## 10. Rules cho Claude Code

1. **Luôn đọc CLAUDE.md đầu tiên** trong mỗi session mới.
2. **Mọi content fetch từ Sanity** — không hardcode text trong component, không import `data/*.json` trong runtime code. `data/*.json` chỉ dùng để seed Sanity lần đầu.
3. **Màu sắc qua Tailwind config** — define MoMo palette trong `tailwind.config.js`, dùng class `text-momo-deep` v.v. Không dùng hex inline.
4. **Mobile-first** — mọi layout đều responsive, test trên 375px trước.
5. **GROQ queries tập trung trong `sanity/lib/queries.ts`** — không viết inline query trong component.
6. **Revalidation đúng cách** — dùng `{ next: { revalidate: 60 } }` hoặc on-demand revalidation với Sanity webhook. Không dùng `cache: 'no-store'` vì sẽ làm chậm portfolio.
7. **Số liệu format đẹp** — 311400 → "311.4K", dùng `lib/utils.ts`. Không format inline.
8. **Schema label bằng tiếng Việt** — field `title` trong Sanity schema phải là tiếng Việt, rõ ràng cho Lam đọc. Không để tên kỹ thuật như `bullets_vi`.
9. **Performance** — hình ảnh qua `next/image` + Sanity image CDN (`urlFor()`), font chỉ load weights cần thiết.
10. **Không xóa schema field** khi refactor — xóa field Sanity mà không migrate data sẽ mất nội dung Lam đã nhập.

---

## 11. Tiến độ (gợi ý build order)

```
Phase 1 — Foundation + Sanity Setup
  [x] CLAUDE.md ← đang ở đây
  [ ] create-next-app + tailwind setup + font + MoMo palette
  [ ] npx sanity init → tạo project, chọn clean template
  [ ] sanity.config.ts
  [ ] Viết toàn bộ schemas (siteContent, experience, signatureWork, skills, education, channelStats)
  [ ] sanity/lib/client.ts + queries.ts + utils.ts
  [ ] Import seed data từ data/content.json + data/stats.json vào Sanity Studio
  [ ] Test: Studio tại localhost:3000/studio, sửa 1 field → fetch được từ Next.js

Phase 2 — Portfolio Public (fetch từ Sanity)
  [ ] layout.tsx (metadata, font)
  [ ] Hero section
  [ ] StatsBoard (đọc channelStats từ Sanity)
  [ ] Selected Works grid
  [ ] Experience timeline
  [ ] Skills section
  [ ] Footer

Phase 3 — Polish
  [ ] Framer Motion animations
  [ ] Mobile responsive pass toàn bộ
  [ ] Open Graph meta tags + og-image
  [ ] Sanity webhook → Next.js on-demand revalidation (instant update khi Lam Publish)

Phase 4 — Threads API
  [ ] lib/threads.ts
  [ ] /api/threads-sync/route.ts (write back vào Sanity channelStats document)
  [ ] Nút "Sync từ Threads" trong Sanity Studio (custom action hoặc hướng dẫn thủ công)

Phase 5 — CV
  [ ] cv/cv-vn.html (fetch từ Sanity hoặc dùng data/content.json làm nguồn)
  [ ] cv/cv-en.html
  [ ] Export PDF → public/cv/
  [ ] Link từ Hero section

Phase 6 — Deploy + Onboard Lam
  [ ] .env.example
  [ ] README.md
  [ ] Add Lam vào Sanity project (Editor role)
  [ ] Add CORS origin trên Sanity cho domain Vercel
  [ ] Add env vars trên Vercel → Deploy
  [ ] Test trên thiết bị thật
  [ ] Walk Lam qua Studio: sửa bio → Publish → thấy live trên portfolio (~5 phút)
```

---

*Last updated: 2026-06-03 v3 (Sanity CMS full edit) · Maintained by Oliver (friend of Quỳnh Lam)*