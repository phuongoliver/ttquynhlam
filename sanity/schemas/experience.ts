import { defineField, defineType } from "sanity";

export const experience = defineType({
  name: "experience",
  title: "Kinh nghiệm",
  type: "document",
  orderings: [
    {
      title: "Thứ tự hiển thị",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "order",
      title: "Thứ tự hiển thị (số nhỏ hơn lên trước)",
      type: "number",
      initialValue: 99,
    }),
    defineField({ name: "role_vi", title: "Chức vụ (Tiếng Việt)", type: "string" }),
    defineField({ name: "role_en", title: "Chức vụ (English)", type: "string" }),
    defineField({ name: "org_vi", title: "Tổ chức (Tiếng Việt)", type: "string" }),
    defineField({ name: "org_en", title: "Tổ chức (English)", type: "string" }),
    defineField({ name: "period", title: "Thời gian (VD: 03/2024 – nay)", type: "string" }),
    defineField({
      name: "bullets_vi",
      title: "Mô tả công việc (Tiếng Việt)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "bullets_en",
      title: "Mô tả công việc (English)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "links",
      title: "Link bài viết / video nổi bật",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Tên hiển thị", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "logo",
      title: "Logo tổ chức (Không bắt buộc)",
      type: "image",
      description: "Tải lên logo vuông của tổ chức. Nếu để trống, hệ thống sẽ tự hiển thị ký tự chấm tròn mặc định.",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: { title: "role_vi", subtitle: "org_vi" },
  },
});
