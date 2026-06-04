import { defineField, defineType } from "sanity";

export const skills = defineType({
  name: "skills",
  title: "Kỹ năng",
  type: "document",
  fields: [
    defineField({
      name: "copywriting",
      title: "Copywriting & Journalism",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "ai",
      title: "AI & Innovation",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "tools",
      title: "Tools & Platforms",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "languages",
      title: "Ngôn ngữ",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
