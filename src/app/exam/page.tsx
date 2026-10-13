"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import quizzesData from "@/data/quizzes.json";
import { QuizQuestion, UserProgress } from "@/types";
import { recordExamResult, getProgress } from "@/lib/storage";
import { KaTeXMath } from "@/components/KaTeXMath";
import confetti from "canvas-confetti";
import {
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  BookOpen,
} from "lucide-react";

function ExamContent() {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session") ? Number(searchParams.get("session")) : 0;

  const allQuizzes: QuizQuestion[] = quizzesData as unknown as QuizQuestion[];

  // Exam configuration
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examFinished, setExamFinished] = useState<boolean>(false);

  // Selected questions for this exam
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Timer: 60 minutes = 3600 seconds
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Prepare questions
  const initializeExam = () => {
    let pool: QuizQuestion[] = [];
    if (sessionParam > 0) {
      pool = allQuizzes.filter((q) => q.sessionId === sessionParam);
    } else {
      // Shuffle all quizzes and pick 50
      const shuffled = [...allQuizzes].sort(() => 0.5 - Math.random());
      pool = shuffled.slice(0, 50);
    }

    setQuestions(pool);
    setUserAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeLeft(sessionParam > 0 ? pool.length * 72 : 3600); // 72s per question
    setExamStarted(true);
    setExamFinished(false);
  };

  // Timer countdown
  useEffect(() => {
    if (examStarted && !examFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, examFinished, timeLeft]);

  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setExamFinished(true);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    recordExamResult(correctCount, questions.length);

    if (correctCount >= Math.round(questions.length * 0.7)) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Score calculation
  const score = useMemo(() => {
    let count = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) count++;
    });
    return count;
  }, [questions, userAnswers]);

  const currentQ = questions[currentIndex];

  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border border-amber-200 flex items-center justify-center text-4xl shadow-sm">
            ⏱️
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Phòng Thi Thử Trắc Nghiệm Sinh Lý Động Vật (NS470)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Mô phỏng 100% hình thức thi kết thúc học phần chính thức của Trường Đại học Cần Thơ.
          </p>
        </div>

        {/* Exam Rules Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Quy Chế & Cấu Trúc Đề Thi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-slate-800">
                {sessionParam > 0 ? "20 Câu" : "50 Câu"}
              </div>
              <div className="text-xs text-slate-500 font-medium">Trắc nghiệm 4 lựa chọn (A, B, C, D)</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-amber-600">
                {sessionParam > 0 ? "25 Phút" : "60 Phút"}
              </div>
              <div className="text-xs text-slate-500 font-medium">Đếm ngược tự động thu bài</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-emerald-600">
                {sessionParam > 0 ? "14/20 (70%)" : "35/50 (70%)"}
              </div>
              <div className="text-xs text-slate-500 font-medium">Ngưỡng đạt tiêu chuẩn bác sĩ</div>
            </div>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-4 list-disc pl-5">
            <li>Đề thi bao quát cả 3 giảng viên: ThS. Hồ Thanh Thâm, Thầy Hồ Quản Đồ, TS. Phạm Tấn Nhã.</li>
            <li>Có giải thích chi tiết cơ chế hóa sinh - sinh lý học sau khi nộp bài.</li>
            <li>Tích lũy điểm XP và lưu vào bảng lịch sử ôn thi.</li>
          </ul>

          <div className="pt-2 flex justify-center">
            <button
              onClick={initializeExam}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-base shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              Bắt Đầu Làm Bài Ngay 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (examFinished) {
    const isPassed = score >= Math.round(questions.length * 0.7);

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Score Banner */}
        <div
          className={`rounded-3xl p-6 sm:p-10 border text-center space-y-4 shadow-sm ${
            isPassed
              ? "bg-gradient-to-br from-emerald-50 via-white to-vet-mint/20 border-emerald-300"
              : "bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-300"
          }`}
        >
          <div className="text-5xl">{isPassed ? "🎉" : "💪"}</div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            {isPassed ? "Xuất Sắc! Bạn Đã Đạt Kỳ Thi" : "Chưa Đạt! Cố Gắng Lên Bạn Ơi"}
          </h1>
          <div className="text-4xl sm:text-6xl font-black text-slate-900 font-mono">
            {score} <span className="text-2xl text-slate-400">/ {questions.length}</span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            {isPassed
              ? "Bạn đã nắm rất vững cơ chế sinh lý của các hệ cơ quan! Sẵn sàng cho kỳ thi chính thức của ĐH Cần Thơ."
              : "Đừng nản lòng! Hãy đọc lại các phần giải thích chi tiết bên dưới để nắm vững những lỗ hổng kiến thức nhé."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={initializeExam}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thi Lại Đề Mới</span>
            </button>
            <a
              href="#review"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-vet-teal" />
              <span>Xem Lại Từng Câu & Giải Thích</span>
            </a>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div id="review" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Chi Tiết Từng Câu Hỏi & Cơ Chế Sinh Lý
            </h2>
            <span className="text-xs text-slate-500">Đúng: {score} | Sai: {questions.length - score}</span>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctIndex;
              const isUnanswered = userAns === undefined;

              return (
                <div
                  key={idx}
                  className={`rounded-3xl border p-6 space-y-4 bg-white shadow-xs ${
                    isCorrect
                      ? "border-emerald-200/90"
                      : isUnanswered
                      ? "border-amber-200/90"
                      : "border-rose-200/90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                        Câu {idx + 1}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        Buổi {q.sessionId}: {q.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {isCorrect ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Chính xác
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> {isUnanswered ? "Chưa làm" : "Sai"}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-base font-bold text-slate-800 leading-relaxed">
                    {renderTextWithMath(q.question)}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctIndex;
                      const isOptionSelected = optIdx === userAns;

                      let optClass = "border-slate-200 bg-slate-50 text-slate-700";
                      if (isOptionCorrect) {
                        optClass = "border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold";
                      } else if (isOptionSelected) {
                        optClass = "border-rose-400 bg-rose-50 text-rose-800 font-medium";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-2xl border flex items-start gap-2.5 ${optClass}`}
                        >
                          <span className="font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="flex-1">{renderTextWithMath(opt)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation box */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-slate-800 space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Cơ chế sinh lý chuyên sâu:</span>
                    </div>
                    <div className="leading-relaxed text-slate-700">
                      {renderTextWithMath(q.explanation)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE EXAM SCREEN
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Floating Exam Header */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-3xl shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
            #{currentIndex + 1}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Tiến độ câu hỏi</div>
            <div className="text-sm font-bold text-slate-800">
              {Object.keys(userAnswers).length} / {questions.length} đã trả lời
            </div>
          </div>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono font-black text-sm sm:text-base border ${
            timeLeft < 300
              ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
              : "bg-slate-100 border-slate-200 text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Submit early button */}
        <button
          onClick={handleFinishExam}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-vet-teal text-white font-bold text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          Nộp Bài
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Question Info Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Buổi {currentQ.sessionId} • {currentQ.badge}
            </span>

            <button
              onClick={() =>
                setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }))
              }
              className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-xl transition-colors ${
                flagged[currentIndex]
                  ? "bg-amber-100 text-amber-800"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${flagged[currentIndex] ? "fill-amber-600" : ""}`} />
              <span>{flagged[currentIndex] ? "Đã gắn cờ xem lại" : "Gắn cờ"}</span>
            </button>
          </div>

          {/* Question Text */}
          <div className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed py-2">
            Câu {currentIndex + 1}: {renderTextWithMath(currentQ.question)}
          </div>

          {/* 4 Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = userAnswers[currentIndex] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() =>
                    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }))
                  }
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "border-vet-teal bg-vet-mint/10 text-slate-900 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                      isSelected
                        ? "bg-vet-teal text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <div className="text-sm sm:text-base leading-relaxed pt-0.5">
                    {renderTextWithMath(option)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Next/Prev within Question */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
              }
              disabled={currentIndex === questions.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition-all"
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Navigation Question Palette (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Bảng Câu Hỏi
            </h3>
            <span className="text-xs text-slate-400 font-mono">50 câu</span>
          </div>

          <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {questions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isCurrent = currentIndex === idx;
              const isFlag = flagged[idx];

              let cellClass = "bg-slate-100 text-slate-600 border-transparent";
              if (isAnswered) cellClass = "bg-vet-teal text-white border-transparent";
              if (isFlag) cellClass = "border-amber-400 bg-amber-50 text-amber-800 border-2";
              if (isCurrent) cellClass = "ring-2 ring-slate-900 font-black";

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${cellClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-vet-teal" />
              <span>Đã trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-slate-100" />
              <span>Chưa trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md border-2 border-amber-400 bg-amber-50" />
              <span>Gắn cờ xem lại</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to render math inside text
function renderTextWithMath(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      return (
        <KaTeXMath
          key={idx}
          math={part.slice(1, -1)}
          block={false}
          className="mx-0.5 text-vet-teal font-serif font-bold text-sm"
        />
      );
    }
    return part;
  });
}

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium">Đang chuẩn bị đề thi trắc nghiệm...</div>}>
      <ExamContent />
    </Suspense>
  );
}

