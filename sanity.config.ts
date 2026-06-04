"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "qlam-portfolio",
  title: "Portfolio Quỳnh Lam",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Nội dung")
          .items([
            S.documentTypeListItem("siteContent").title("📄 Thông tin cá nhân"),
            S.documentTypeListItem("experience").title("💼 Kinh nghiệm"),
            S.documentTypeListItem("signatureWork").title("🎨 Selected Works"),
            S.documentTypeListItem("skills").title("🛠 Kỹ năng"),
            S.documentTypeListItem("channelStats").title("📊 Thống kê kênh"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemas },
});
