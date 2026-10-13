"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getProgress } from "@/lib/storage";
import { UserProgress } from "@/types";
import lessonsData from "@/data/lessons.json";
import {
  User,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  LogIn,
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Sinh Viên Thú Y";
  const avatar = profile?.avatar_url || "🐕";
  const xp = profile?.xp ?? progress.xp;
  const level = profile?.level ?? progress.level;
  const streak = profile?.streak ?? progress.streak;

  const completedCount = progress.completedLessons.length;
  const masteredCardCount = progress.masteredFlashcards.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Profile Card */}
      <section className="relative rounded-3xl bg-gradient-to-br from-white via-vet-cream/40 to-teal-50/50 border border-teal-200/40 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-teal-700 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-md">
              {avatar}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {displayName}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  {level}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                {user ? user.email : "Tài khoản khách (Đang lưu trên trình duyệt)"}
              </p>

              <div className="flex items-center gap-3 pt-1 text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1 text-emerald-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <strong>{xp}</strong> XP
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <strong>{streak}</strong> ngày streak
                </span>
              </div>
            </div>
          </div>

          {!user && (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Để Lưu Cloud</span>
            </button>
          )}
        </div>
      </section>

      {/* 4 Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg">
            📚
          </div>
          <div className="text-2xl font-black text-slate-900">
            {completedCount} <span className="text-xs text-slate-400 font-normal">/ 7</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Buổi học đã hoàn thành</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg">
            🃏
          </div>
          <div className="text-2xl font-black text-slate-900">
            {masteredCardCount} <span className="text-xs text-slate-400 font-normal">/ 305</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Flashcards đã ghi nhớ</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg">
            ⏱️
          </div>
          <div className="text-2xl font-black text-slate-900">
            {progress.quizHistory?.length || 0}
          </div>
          <p className="text-xs text-slate-500 font-medium">Lượt thi thử 50 câu</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
            🎯
          </div>
          <div className="text-2xl font-black text-slate-900">
            {progress.quizHistory?.[0] ? `${progress.quizHistory[0].score}/50` : "Chưa thi"}
          </div>
          <p className="text-xs text-slate-500 font-medium">Điểm thi lần gần nhất</p>
        </div>
      </section>

      {/* 7 Islands Progress Track */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Tiến Độ 7 Hòn Đảo Sinh Lý
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hoàn thành toàn bộ để tự tin đạt điểm A môn Sinh lý động vật
            </p>
          </div>
          <span className="text-sm font-extrabold text-teal-700">
            {Math.round((completedCount / 7) * 100)}% Hoàn Tất
          </span>
        </div>

        <div className="space-y-3">
          {(lessonsData as any[]).map((lesson) => {
            const isDone = progress.completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                    {lesson.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm">
                      Buổi {lesson.id}: {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500">{lesson.professor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã xong</span>
                    </span>
                  ) : (
                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full hover:bg-teal-100 transition-colors"
                    >
                      <span>Vào học</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mock Exam History */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900">
          Lịch Sử Thi Thử Cuối Kỳ
        </h2>
        {progress.quizHistory && progress.quizHistory.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {progress.quizHistory.map((item, index) => (
              <div key={index} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-bold flex items-center justify-center">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">
                      Đạt {item.score}/{item.total} câu ({Math.round((item.score / item.total) * 100)}%)
                    </p>
                    <p className="text-slate-400 font-mono text-[11px]">{item.date}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs ${
                    item.passed
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {item.passed ? "Đạt Chuẩn (>= 70%)" : "Cần Ôn Lại"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs space-y-3">
            <p>Bạn chưa thực hiện bài thi thử nào.</p>
            <Link
              href="/exam"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs hover:bg-amber-600 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Vào Thi Thử 50 Câu Ngay</span>
            </Link>
          </div>
        )}
      </section>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
