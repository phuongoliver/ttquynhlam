import { defineField, defineType } from "sanity";

const videoFields = [
  defineField({ name: "title", title: "Tên video", type: "string" }),
  defineField({ name: "views", title: "Lượt xem", type: "number" }),
  defineField({ name: "likes", title: "Lượt thích", type: "number" }),
  defineField({ name: "url", title: "Link TikTok", type: "url" }),
];

const postFields = [
  defineField({ name: "title", title: "Tên / mô tả bài", type: "string" }),
  defineField({ name: "views", title: "Lượt xem", type: "number" }),
  defineField({ name: "likes", title: "Lượt thích", type: "number" }),
  defineField({ name: "comments", title: "Bình luận", type: "number" }),
  defineField({ name: "reposts", title: "Repost", type: "number" }),
  defineField({ name: "url", title: "Link bài", type: "url" }),
];

export const channelStats = defineType({
  name: "channelStats",
  title: "Thống kê kênh",
  type: "document",
  fields: [
    defineField({ name: "lastUpdated", title: "Cập nhật lúc", type: "datetime" }),

    /* ── TikTok ── */
    defineField({
      name: "tiktok",
      title: "TikTok @panorama.pvt",
      type: "object",
      fields: [
        defineField({ name: "handle", title: "Handle", type: "string", initialValue: "@panorama.pvt" }),
        defineField({ name: "url", title: "URL kênh", type: "url" }),
        defineField({ name: "totalViews", title: "Tổng lượt xem", type: "number" }),
        defineField({ name: "totalVideos", title: "Tổng số video", type: "number" }),
        defineField({
          name: "videos",
          title: "Danh sách video",
          type: "array",
          of: [{ type: "object", fields: videoFields }],
        }),
      ],
    }),

    /* ── Threads @ttqueenlam ── */
    defineField({
      name: "threads_queenlam",
      title: "Threads @ttqueenlam",
      type: "object",
      fields: [
        defineField({ name: "handle", title: "Handle", type: "string", initialValue: "@ttqueenlam" }),
        defineField({ name: "displayName", title: "Tên hiển thị", type: "string" }),
        defineField({ name: "url", title: "URL trang", type: "url" }),
        defineField({ name: "status", title: "Trạng thái (VD: archived_dec2025)", type: "string" }),
        defineField({ name: "direction", title: "Hướng nội dung", type: "string" }),
        defineField({
          name: "posts",
          title: "Danh sách bài đăng",
          type: "array",
          of: [{ type: "object", fields: postFields }],
        }),
      ],
    }),

    /* ── Threads @finding20s ── */
    defineField({
      name: "threads_finding20s",
      title: "Threads @finding20s",
      type: "object",
      fields: [
        defineField({ name: "handle", title: "Handle", type: "string", initialValue: "@finding20s" }),
        defineField({ name: "displayName", title: "Tên hiển thị", type: "string" }),
        defineField({ name: "url", title: "URL trang", type: "url" }),
        defineField({ name: "status", title: "Trạng thái", type: "string" }),
        defineField({ name: "direction", title: "Hướng nội dung", type: "string" }),
        defineField({
          name: "posts",
          title: "Danh sách bài đăng",
          type: "array",
          of: [{ type: "object", fields: postFields }],
        }),
      ],
    }),

    /* ── UIT ── */
    defineField({
      name: "uit",
      title: "Bài viết UIT",
      type: "object",
      fields: [
        defineField({ name: "platform", title: "Tên trang", type: "string", initialValue: "UIT – Trường ĐH Công nghệ Thông tin" }),
        defineField({ name: "url", title: "URL", type: "url" }),
        defineField({ name: "totalArticles", title: "Tổng bài đã đăng", type: "number" }),
        defineField({
          name: "byYear",
          title: "Số bài theo năm",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "year", title: "Năm", type: "string" }),
              defineField({ name: "count", title: "Số bài", type: "number" }),
            ],
          }],
        }),
      ],
    }),
  ],
});
