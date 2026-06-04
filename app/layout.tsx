import type { Metadata } from "next";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://quynhlam.vercel.app"
  ),
  title: "Quỳnh Lam — Creative Copywriter Portfolio",
  description:
    "Portfolio của Trịnh Thanh Quỳnh Lam — sinh viên Báo chí CLC, content creator với ~2.000 bài viết, TikTok 311K views và Threads 212K views.",
  openGraph: {
    title: "Quỳnh Lam — Creative Copywriter Portfolio",
    description: "~2.000 bài viết · TikTok 311.4K views · Threads 212K views",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quỳnh Lam — Creative Copywriter Portfolio",
    description: "~2.000 bài viết · TikTok 311.4K views · Threads 212K views",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
