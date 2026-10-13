"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import lessonsData from "@/data/lessons.json";
import quizzesData from "@/data/quizzes.json";
import flashcardsData from "@/data/flashcards.json";
import { Lesson } from "@/types";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MascotBanner } from "@/components/MascotBanner";
import { markLessonComplete, getProgress } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { syncCloudLessonComplete } from "@/lib/supabase/sync";
import { PersonalNotesBox } from "@/components/notes/PersonalNotesBox";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  Layers,
  Award,
  BookOpen,
  Share2,
  Bookmark,
  Sparkles,
} from "lucide-react";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = Number(params.id) || 1;

  const lessons: Lesson[] = lessonsData as unknown as Lesson[];
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];

  const [activeSection, setActiveSection] = useState<string>("all");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    const progress = getProgress();
    setIsCompleted(progress.completedLessons.includes(lesson.id));
  }, [lesson.id]);

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    setIsCompleted(true);
    if (user) {
      syncCloudLessonComplete(user.id, lesson.id).then(() => {
        refreshProfile();
      });
    }
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const prevLesson = lessons.find((l) => l.id === lesson.id - 1);
  const nextLesson = lessons.find((l) => l.id === lesson.id + 1);

  const sectionKeys = Object.keys(lesson.contentSections || {});

  const dynamicQuizCount = quizzesData.filter((q) => q.sessionId === lesson.id).length || 50;
  const dynamicFlashcardCount = flashcardsData.filter((f) => f.sessionId === lesson.id).length || 44;

  return (
    <div className="space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ 7 Đảo</span>
        </Link>

        <div className="flex items-center gap-2">
          {prevLesson && (
            <Link
              href={`/lessons/${prevLesson.id}`}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buổi {prevLesson.id}</span>
            </Link>
          )}

          {nextLesson && (
            <Link
              href={`/lessons/${nextLesson.id}`}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <span className="hidden sm:inline">Buổi {nextLesson.id}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Lesson Header Banner */}
      <section className="relative rounded-3xl bg-gradient-to-br from-white via-vet-cream/30 to-vet-mint/15 border border-vet-mint/30 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-teal-700 text-white shadow-xs">
                Buổi {lesson.id}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200">
                {lesson.badge}
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lesson.duration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              {lesson.icon} {lesson.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {lesson.subtitle}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <User className="w-4 h-4 text-slate-400" />
              <span>Giảng viên phụ trách: <strong>{lesson.professor}</strong></span>
            </div>
          </div>

          {/* Complete button & Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              onClick={handleComplete}
              disabled={isCompleted}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-md transition-all ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                  : "bg-teal-700 hover:bg-teal-800 text-white hover:scale-105 active:scale-95 shadow-teal-900/20"
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${isCompleted ? "text-emerald-600" : "text-white"}`} />
              <span>{isCompleted ? "Đã Hoàn Thành ✨ (+100 XP)" : "Đánh Dấu Hoàn Thành"}</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href={`/flashcards?session=${lesson.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Flashcards ({dynamicFlashcardCount})</span>
              </Link>

              <Link
                href={`/exam?session=${lesson.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Quiz ({dynamicQuizCount})</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mascot Analogy Banner */}
      <MascotBanner analogy={lesson.analogy} />

      {/* Section Quick Navigation Pills */}
      <div className="sticky top-16 z-30 bg-[#FDFBF7]/90 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-slate-200/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setActiveSection("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSection === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Tất Cả Nội Dung
          </button>
          {sectionKeys.map((secKey) => {
            const shortLabel = secKey.replace(/^[^\w\s]+/, "").trim();
            return (
              <button
                key={secKey}
                onClick={() => setActiveSection(secKey)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeSection === secKey
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {shortLabel.length > 25 ? `${shortLabel.slice(0, 25)}...` : shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-12">
        {activeSection === "all" ? (
          // Render all sections
          sectionKeys.map((secKey) => (
            <section key={secKey} id={secKey} className="space-y-4">
              {secKey !== "intro" && (
                <div className="pt-6 border-t border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 pb-2 border-b-2 border-vet-mint/40 inline-block">
                    {secKey}
                  </h2>
                </div>
              )}
              <MarkdownRenderer content={lesson.contentSections[secKey]} />
            </section>
          ))
        ) : (
          // Render only active section
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 pb-2 border-b-2 border-vet-mint/40 inline-block">
              {activeSection}
            </h2>
            <MarkdownRenderer content={lesson.contentSections[activeSection]} />
          </section>
        )}
      </div>

      {/* Personal Notes Box for this Lesson */}
      <PersonalNotesBox lessonId={lesson.id} />

      {/* Bottom Next/Prev Bar */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-xs hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Buổi trước: {prevLesson.title}</span>
          </Link>
        ) : <div />}

        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md hover:scale-[1.02]"
          >
            <span>Buổi kế: {nextLesson.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/exam"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 text-white font-bold text-sm shadow-md hover:scale-[1.02]"
          >
            <Award className="w-4 h-4" />
            <span>Chúc mừng bạn đã học hết 7 buổi! Vào thi thử ngay</span>
          </Link>
        )}
      </div>
    </div>
  );
}
