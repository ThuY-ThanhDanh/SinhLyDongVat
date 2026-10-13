import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dr. Paw 🐕 | Sinh Lý Động Vật (NS470) - ĐH Cần Thơ",
  description:
    "Nền tảng học tập & ôn thi tương tác toàn diện môn Sinh Lý Động Vật (NS470) Đại học Cần Thơ. Trực quan, dễ hiểu, flashcards, trắc nghiệm 50 câu có giải thích.",
  keywords: ["sinh lý động vật", "NS470", "đại học cần thơ", "thú y", "dr paw", "bác sĩ thú y"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        {/* KaTeX Fallback Stylesheet */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-slate-800 antialiased selection:bg-vet-mint/30 selection:text-vet-teal">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
