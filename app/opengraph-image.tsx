import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F4EFE6",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 88px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#8FA08A",
          }}
        />

        {/* Name */}
        <p
          style={{
            fontSize: 68,
            fontWeight: 700,
            fontStyle: "italic",
            color: "#1F1B16",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Trịnh Thanh Quỳnh Lam
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            color: "#5C5448",
            margin: "16px 0 0",
            fontWeight: 400,
            fontFamily: "sans-serif",
          }}
        >
          Creative Copywriter Intern/Fresher · Báo chí CLC, ĐHQG-HCM
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 56,
            marginTop: 52,
          }}
        >
          {(
            [
              ["~2.000", "tin/bài đã đăng"],
              ["311.4K", "TikTok views"],
              ["212K", "Threads views"],
              ["GPA 8.61", "IELTS 6.0"],
            ] as [string, string][]
          ).map(([num, label]) => (
            <div
              key={num}
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              <span
                style={{ fontSize: 44, fontWeight: 700, fontStyle: "italic", color: "#1F1B16" }}
              >
                {num}
              </span>
              <span style={{ fontSize: 18, color: "#5C5448", fontFamily: "sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p
          style={{
            position: "absolute",
            bottom: 48,
            left: 88,
            fontSize: 18,
            color: "#5C5448",
            margin: 0,
            fontFamily: "sans-serif",
          }}
        >
          quynhlam.vercel.app
        </p>

        {/* Right accent block */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: "#C97A5B",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
