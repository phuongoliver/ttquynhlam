"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
);

export default function StudioPage() {
  if (!isConfigured) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          background: "#101112",
          color: "#e4e4e7",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Sanity Studio chưa cấu hình
          </h1>
          <p style={{ color: "#a1a1aa", lineHeight: 1.6 }}>
            Thêm <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> và{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code> vào file{" "}
            <code>.env.local</code> để sử dụng Studio.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
