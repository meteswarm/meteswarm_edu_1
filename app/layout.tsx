import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "요금제",
  description: "요금제 확인과 변경 신청",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg-default font-sans">
        <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-bg-surface">
          {children}
        </div>
      </body>
    </html>
  );
}
