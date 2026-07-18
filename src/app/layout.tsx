import type { Metadata, Viewport } from "next";
import { Playfair_Display, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Servio AI — منيوك الذكي يبيع لك",
  description:
    "نظام المنيو الذكي بالذكاء الاصطناعي الذي يوجه ويوصي ويزيد إيرادات مطعمك تلقائياً",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${tajawal.variable} antialiased`}
        style={{ fontFamily: "var(--font-tajawal)", background: "#0F0F0F", color: "#F5F0E8" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}