import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./tokens.css";
import "./typography.css";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "메모",
  description: "생각보다 빠른 메모 앱",
  applicationName: "메모",
  // 아이폰: 홈 화면에 추가하면 주소창 없이 앱처럼 열린다 (아이콘은 app/apple-icon.png)
  appleWebApp: { capable: true, title: "메모", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

// 상태 표시줄 색 — surface/page 의 Light · Dark 값
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body>{children}</body>
    </html>
  );
}
