"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MascotBanner } from "@/components/MascotBanner";
import lessonsData from "@/data/lessons.json";
import { Lesson, UserProgress } from "@/types";
import { getProgress } from "@/lib/storage";
import {
  BookOpen,
  Layers,
  Award,
  AlertTriangle,
  GitCompare,
  ArrowRight,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const lessons: Lesson[] = lessonsData as unknown as Lesson[];

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const totalLessons = lessons.length;
  const completedCount = progress?.completedLessons.length || 1;
  const completionPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-vet-mint/20 via-vet-cream/40 to-vet-coral/15 border border-vet-mint/30 p-6 sm:p-10 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-vet-mint/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-vet-mint/40 text-vet-teal text-xs font-bold shadow-xs">
            <span>✨</span>
            <span>Học phần Sinh Lý Động Vật (NS470) • ĐH Cần Thơ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Chinh phục Sinh Lý Thú Y <br />
            <span className="text-teal-800 bg-clip-text bg-gradient-to-r from-teal-800 to-emerald-800 font-black">
              dễ như đọc truyện tranh!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            Dành riêng cho bạn mới bắt đầu: Đơn giản hóa cơ chế phức tạp với ví von trực quan, 
            công thức rõ ràng, <strong>300+ flashcards</strong> nhớ lâu và <strong>phòng thi thử trắc nghiệm chuẩn đề thi</strong> của Thầy Thâm, Thầy Đồ, Thầy Nhã.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/lessons/1"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm shadow-md shadow-teal-900/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="text-white">Vào Đảo 1: Bài Tiết</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <Link
              href="/exam"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Phòng Thi Thử 50 Câu</span>
            </Link>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-xs">
            <div className="text-2xl font-black text-slate-800">7 Buổi</div>
            <div className="text-xs text-slate-500 font-medium">19 giờ bài giảng sâu</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-xs">
            <div className="text-2xl font-black text-amber-600">350+ Câu</div>
            <div className="text-xs text-slate-500 font-medium">Trắc nghiệm giải thích chi tiết</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-xs">
            <div className="text-2xl font-black text-emerald-600">300+ Thẻ</div>
            <div className="text-xs text-slate-500 font-medium">Flashcard chỉ số & thuật ngữ</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-xs">
            <div className="text-2xl font-black text-teal-700">Dr. Paw AI</div>
            <div className="text-xs text-slate-500 font-medium">Trợ lý gia sư hỏi đáp 24/7</div>
          </div>
        </div>
      </section>

      {/* Mascot Daily Motivation */}
      <MascotBanner />

      {/* Progress & Quick Stats Card */}
      <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-vet-teal" />
              Tiến Độ Học Tập Của Bạn
            </h2>
            <p className="text-xs text-slate-500">Hoàn thành bài đọc và câu hỏi ôn tập để nhận danh hiệu Bác Sĩ Trưởng Khoa!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-2xl font-black text-vet-teal">{completionPercent}%</span>
              <span className="text-xs text-slate-400 block">({completedCount}/{totalLessons} buổi)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-vet-mint to-vet-teal rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* The 7 Islands Map */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🗺️</span>
              <span>Bản Đồ 7 Đảo Học Tập Phiêu Lưu</span>
            </h2>
            <p className="text-sm text-slate-500">Mỗi buổi học là một hòn đảo kỳ thú của cơ thể động vật</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const isCompleted = progress?.completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="group relative rounded-3xl bg-white border border-slate-200 hover:border-vet-mint/60 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                {/* Header of Island Card */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-vet-cream to-amber-100 border border-amber-200/60 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                      {lesson.icon}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {lesson.badge}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-vet-teal uppercase tracking-wider mb-1">
                    Buổi {lesson.id}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 leading-snug group-hover:text-vet-teal transition-colors">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {lesson.subtitle}
                  </p>

                  {/* ELIF5 Metaphor Box */}
                  <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900 leading-relaxed italic">
                    💡 &ldquo;{lesson.analogy}&rdquo;
                  </div>

                  {/* Meta details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {lesson.professor}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {lesson.duration}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/lessons/${lesson.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-vet-mint/15 hover:bg-vet-mint/25 text-vet-teal font-bold text-xs transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Học Bài Này</span>
                  </Link>

                  <Link
                    href={`/flashcards?session=${lesson.id}`}
                    title="Ôn Flashcard buổi này"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/exam?session=${lesson.id}`}
                    title="Thi thử trắc nghiệm buổi này"
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                  >
                    <Award className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 Feature Columns */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {/* Flashcards */}
        <Link
          href="/flashcards"
          className="group rounded-3xl bg-white border border-slate-200 hover:border-vet-mint p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🃏
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">300+ Flashcards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lật thẻ 3D hoặc đọc lướt dạng bảng: Ghi nhớ thuật ngữ, công thức GFR, chu kỳ động dục và chỉ số sinh lý nước tiểu.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-vet-teal group-hover:translate-x-1 transition-transform">
            <span>Khám phá ngay &rarr;</span>
          </div>
        </Link>

        {/* Mock Exam */}
        <Link
          href="/exam"
          className="group rounded-3xl bg-white border border-slate-200 hover:border-amber-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ⏱️
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Thi Thử 50 Câu</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Đồng hồ đếm ngược 60 phút mô phỏng 100% phòng thi cuối kỳ ĐH Cần Thơ, chấm điểm và giải thích tức thì.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
            <span>Vào phòng thi &rarr;</span>
          </div>
        </Link>

        {/* Exam Traps */}
        <Link
          href="/traps"
          className="group rounded-3xl bg-white border border-slate-200 hover:border-rose-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🚨
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Cẩm Nang Bẫy Đề</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tổng hợp những &ldquo;cú lừa&rdquo; kinh điển trong đề thi của Thầy Thâm, Thầy Đồ và Thầy Nhã.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
            <span>Xem cẩm nang &rarr;</span>
          </div>
        </Link>

        {/* Comparative Species */}
        <Link
          href="/comparative"
          className="group rounded-3xl bg-white border border-slate-200 hover:border-purple-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🐾
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">So Sánh Các Loài</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bảng tra cứu dị biệt giữa Trâu/Bò (nhai lại), Ngựa, Heo, Chó/Mèo và Gia cầm (không bàng quang).
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
            <span>Mở bảng so sánh &rarr;</span>
          </div>
        </Link>
      </section>
    </div>
  );
}
