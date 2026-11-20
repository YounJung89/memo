import type { MetadataRoute } from "next";

// 매니페스트는 CSS 변수를 못 쓰므로 토큰 값을 그대로 적는다
const SURFACE_PAGE = "#f2f4f6"; // surface/page (Light)

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "메모",
    short_name: "메모",
    description: "생각보다 빠른 메모 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone", // 주소창 없이 앱처럼 열린다
    orientation: "portrait",
    background_color: SURFACE_PAGE, // 앱을 켤 때 잠깐 보이는 바탕
    theme_color: SURFACE_PAGE,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
