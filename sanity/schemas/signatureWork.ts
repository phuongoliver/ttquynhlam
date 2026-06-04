import { defineField, defineType } from "sanity";

export const signatureWork = defineType({
  name: "signatureWork",
  title: "Selected Works",
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
    defineField({
      name: "workId",
      title: "ID (VD: sw1, sw2...)",
      type: "string",
      description: "ID nội bộ, không hiển thị ra ngoài",
    }),
    defineField({ name: "title", title: "Tiêu đề bài viết / video", type: "string" }),
    defineField({ name: "type_vi", title: "Thể loại (Tiếng Việt)", type: "string" }),
    defineField({ name: "type_en", title: "Thể loại (English)", type: "string" }),
    defineField({
      name: "hook_vi",
      title: "Mô tả ngắn (Tiếng Việt)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "hook_en",
      title: "Mô tả ngắn (English)",
      type: "text",
      rows: 2,
    }),
    defineField({ name: "url", title: "Link bài viết / video", type: "url" }),
    defineField({
      name: "image",
      title: "Hình ảnh hiển thị (Không bắt buộc)",
      type: "image",
      description: "Tải lên ảnh bìa cho tác phẩm. Nếu để trống, hệ thống sẽ tự hiển thị dạng kẻ ô (hatched pattern) hoài cổ.",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type_vi" },
  },
});
