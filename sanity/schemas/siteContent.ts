import { defineField, defineType } from "sanity";

export const siteContent = defineType({
  name: "siteContent",
  title: "Thông tin cá nhân",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Họ và tên", type: "string" }),
    defineField({
      name: "penNames",
      title: "Bút danh",
      type: "array",
      of: [{ type: "string" }],
      description: "Thêm từng bút danh riêng (VD: Quỳnh Lam, Đông Xanh, Chung Lan)",
    }),
    defineField({
      name: "tagline_vi",
      title: "Tagline (Tiếng Việt)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "profile_vi",
      title: "Giới thiệu bản thân (Tiếng Việt)",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "profile_en",
      title: "Giới thiệu bản thân (English)",
      type: "text",
      rows: 5,
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Số điện thoại", type: "string" }),
    defineField({ name: "location", title: "Địa điểm", type: "string" }),
    defineField({
      name: "highlights",
      title: "Key Highlights (5 dòng đầu CV)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "photo",
      title: "Ảnh chân dung (Ảnh đại diện)",
      type: "image",
      description: "Tải lên ảnh chân dung tỉ lệ 4:5. Nếu để trống, hệ thống sẽ tự hiển thị khung placeholder.",
      options: {
        hotspot: true,
      },
    }),
  ],
});
