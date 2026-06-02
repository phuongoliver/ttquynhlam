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
| Data layer | JSON files trong `/data/` | `content.json` (CV) + `stats.json` (kênh). Sửa file → commit → auto-redeploy |
| Threads API | `/api/threads-sync` (Next.js Route Handler) | Proxy giữ token phía server, không lộ secret ra client |
| Deploy | **Vercel** (GitHub integration) | Push → auto-deploy, zero config với Next.js |
| PDF CV | `@react-pdf/renderer` hoặc export HTML → print | TBD khi làm CV |

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
├── CLAUDE.md                  ← file này (luôn đọc trước)
├── .env.local                 ← Threads token (không commit, đã .gitignore)
├── .env.example               ← template env var cho người clone
├── next.config.js
├── tailwind.config.js
├── package.json
│
├── data/
│   ├── content.json           ← toàn bộ CV content (personal info, experience, skills...)
│   └── stats.json             ← số liệu kênh TikTok + Threads (nguồn cho dashboard)
│
├── public/
│   ├── cv/
│   │   ├── CV_QuynhLam_VN.pdf
│   │   └── CV_QuynhLam_EN.pdf
│   ├── og-image.jpg           ← Open Graph image (1200×630)
│   └── favicon.ico
│
├── app/
│   ├── layout.tsx             ← font, metadata, global styles
│   ├── page.tsx               ← single-page portfolio (tất cả sections)
│   ├── globals.css
│   │
│   └── api/
│       └── threads-sync/
│           └── route.ts       ← Threads API proxy (serverless)
│
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── StatsBoard.tsx     ← dashboard chính (có Edit mode)
│   │   ├── SelectedWorks.tsx
│   │   ├── Channels.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   └── Footer.tsx
│   │
│   ├── ui/
│   │   ├── StatCard.tsx       ← card số liệu (view, like, bài)
│   │   ├── WorkCard.tsx       ← portfolio work card
│   │   ├── ChannelTable.tsx   ← bảng top posts của mỗi kênh
│   │   ├── EditableNumber.tsx ← inline edit cho dashboard Tầng 1
│   │   └── SyncButton.tsx     ← nút "Sync from Threads" Tầng 2
│   │
│   └── layout/
│       ├── Navbar.tsx
│       └── SectionWrapper.tsx ← Framer Motion fade-in wrapper
│
└── lib/
    ├── threads.ts             ← Threads API client (fetch + token refresh)
    ├── stats-store.ts         ← localStorage read/write helper
    └── utils.ts               ← format số (311K → "311.4K"), dates...
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

**Edit Mode (Tầng 1)**:
- Nút "Chỉnh sửa" (hidden đến khi hover, hoặc password đơn giản như `?edit=true` trong URL)
- Khi active: các số liệu trở thành `<input>`, có thể sửa trực tiếp
- Nút "Lưu" → persist vào `localStorage` key `qlam_stats`
- Nút "Export JSON" → download file `stats-[date].json` để backup/commit
- Nút "Import JSON" → upload file → ghi đè `localStorage`
- Note trong UI: "Dữ liệu lưu trong trình duyệt. Export → commit vào repo để mọi người xem được."

**Sync Button (Tầng 2 — Threads API)**:
- Nút "Đồng bộ từ Threads API" chỉ hiện trong Edit Mode
- Gọi `/api/threads-sync` → trả về số liệu mới nhất từ Threads Insights API
- Merge vào data hiện tại → hiện diff trước khi lưu

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

## 6. Threads API Integration

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
# Threads API
THREADS_APP_ID=your_app_id
THREADS_APP_SECRET=your_app_secret
THREADS_ACCESS_TOKEN=your_long_lived_token
THREADS_USER_ID=your_threads_user_id

# Admin (cho Edit Mode Tầng 1, optional)
ADMIN_SECRET=simple_password_for_edit_mode
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

## 7. CV Generation

CV được làm ngoài Next.js (không cần dynamic render). Cách làm đề xuất:

**Option A (đơn giản, khuyến nghị)**: Tạo `cv/index.html` riêng với CSS print-friendly, mở bằng Chrome → Ctrl+P → Save as PDF. Làm 2 bản VN + EN bằng cách đổi ngôn ngữ trong HTML.

**Option B**: Dùng `@react-pdf/renderer` nếu muốn integrate vào Next.js và có nút "Download CV" dynamic.

CV content: lấy từ `data/content.json`, không hardcode thẳng vào template.

---

## 8. Deploy Checklist

```bash
# 1. Init project
npx create-next-app@latest quynhlam-portfolio --typescript --tailwind --app

# 2. Cài dependencies
npm install framer-motion recharts @types/node

# 3. Setup env
cp .env.example .env.local
# → điền Threads token vào .env.local

# 4. Test local
npm run dev

# 5. Push GitHub → import vào vercel.com → Add env vars → Deploy
```

**Vercel env vars cần add**:
- `THREADS_APP_ID`
- `THREADS_APP_SECRET`
- `THREADS_ACCESS_TOKEN`
- `THREADS_USER_ID`

---

## 9. Rules cho Claude Code

1. **Luôn đọc CLAUDE.md đầu tiên** trong mỗi session mới.
2. **Content không hardcode** trong component — luôn đọc từ `data/*.json`.
3. **Màu sắc qua Tailwind config** — define MoMo palette trong `tailwind.config.js` dưới `extend.colors.momo.*`, dùng class `text-momo-deep`, `bg-momo-light` v.v. Không dùng hex inline.
4. **Mobile-first** — mọi layout đều responsive, test trên 375px trước.
5. **Không over-engineer** — Lam là người dùng cuối, UI phải tự giải thích được (self-explanatory).
6. **Placeholder rõ ràng** — mọi field `PLACEHOLDER_*` trong content.json phải hiển thị text "PLACEHOLDER" có màu đỏ nhạt trong dev mode để dễ tìm.
7. **Số liệu format đẹp** — 311400 → "311.4K", 2000 → "~2.000", dùng hàm trong `lib/utils.ts`.
8. **Performance** — hình ảnh qua `next/image`, font chỉ load weights cần thiết (400, 500, 600, 700).
9. **Stats dashboard là feature ưu tiên** — làm StatsBoard trước, các section khác sau.
10. **Không xóa data** trong `stats.json` hay `content.json` khi refactor — đây là nguồn dữ liệu gốc.

---

## 10. Tiến độ (gợi ý build order)

```
Phase 1 — Foundation
  [x] CLAUDE.md ← đang ở đây
  [ ] create-next-app + tailwind setup + font
  [ ] tailwind.config.js với MoMo palette
  [ ] data/content.json + data/stats.json
  [ ] lib/utils.ts (formatNumber, formatDate)

Phase 2 — Core Sections
  [ ] layout.tsx (metadata, font)
  [ ] Hero section
  [ ] StatsBoard — Tầng 1 (hiển thị + Edit Mode localStorage)
  [ ] Selected Works grid
  [ ] Experience timeline

Phase 3 — Polish
  [ ] Skills section
  [ ] Footer
  [ ] Framer Motion animations
  [ ] Mobile responsive pass
  [ ] Open Graph meta tags + og-image

Phase 4 — Threads API (Tầng 2)
  [ ] lib/threads.ts
  [ ] /api/threads-sync/route.ts
  [ ] SyncButton component
  [ ] Token refresh logic + error handling

Phase 5 — CV
  [ ] cv/index.html (VN)
  [ ] cv/index-en.html (EN)
  [ ] Export PDF, để vào /public/cv/
  [ ] Link từ Hero section

Phase 6 — Deploy
  [ ] .env.example
  [ ] README.md (hướng dẫn clone + setup + deploy)
  [ ] Push GitHub + Vercel deploy
  [ ] Test trên thiết bị thật
```

---

*Last updated: 2026-06-02 · Maintained by Oliver (friend of Quỳnh Lam)*
