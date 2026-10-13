"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import flashcardsData from "@/data/flashcards.json";
import { Flashcard, UserProgress } from "@/types";
import { getProgress, toggleMasteredFlashcard, addXP } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { syncCloudFlashcard } from "@/lib/supabase/sync";
import { KaTeXMath } from "@/components/KaTeXMath";
import confetti from "canvas-confetti";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
} from "lucide-react";

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const initialSession = searchParams.get("session") ? Number(searchParams.get("session")) : 0;

  const allCards: Flashcard[] = flashcardsData as unknown as Flashcard[];

  const [selectedSession, setSelectedSession] = useState<number>(initialSession);
  const [filterMastered, setFilterMastered] = useState<"all" | "learning" | "mastered">("all");
  const [viewMode, setViewMode] = useState<"card" | "grid">("card");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const { user, refreshProfile } = useAuth();

  // Cards currently in view
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  // Filtered cards
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchSession = selectedSession === 0 || card.sessionId === selectedSession;
      const isMastered = progress?.masteredFlashcards.includes(card.id);

      if (!matchSession) return false;
      if (filterMastered === "learning" && isMastered) return false;
      if (filterMastered === "mastered" && !isMastered) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchText =
          card.front.toLowerCase().includes(term) ||
          card.back.toLowerCase().includes(term) ||
          card.badge.toLowerCase().includes(term) ||
          (card.category && card.category.toLowerCase().includes(term));
        if (!matchText) return false;
      }

      return true;
    });
  }, [allCards, selectedSession, filterMastered, searchTerm, progress]);

  // Reset card index when filters change
  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [selectedSession, filterMastered, searchTerm]);

  const currentCard: Flashcard | undefined = filteredCards[cardIndex];
  const isCurrentMastered = currentCard ? progress?.masteredFlashcards.includes(currentCard.id) : false;

  const handleNext = () => {
    setIsFlipped(false);
    if (cardIndex < filteredCards.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    } else {
      setCardIndex(filteredCards.length - 1);
    }
  };

  const handleToggleMastered = () => {
    if (!currentCard) return;
    const { progress: updated, isMastered } = toggleMasteredFlashcard(currentCard.id);
    setProgress(updated);
    if (user) {
      syncCloudFlashcard(user.id, currentCard.id, isMastered).then(() => {
        refreshProfile();
      });
    }
    if (isMastered) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCardIndex(Math.floor(Math.random() * filteredCards.length));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cardIndex, filteredCards.length]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Phương pháp ghi nhớ Spaced Repetition</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {allCards.length} Thẻ Ghi Nhớ Sinh Lý 🃏
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Bấm thẻ để lật mặt sau, hoặc chuyển sang <strong>Chế độ Xem Dạng Lưới</strong> để đọc lướt nhanh toàn bộ thẻ!
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-semibold">Đã thuộc làu</div>
            <div className="text-lg font-black text-emerald-600">
              {progress?.masteredFlashcards.length || 0} / {allCards.length}
            </div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500 fill-emerald-100" />
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Tìm nhanh thuật ngữ, chỉ số, công thức..."
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal-700 focus:bg-white"
          />

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode("card")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "card"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🃏 Lật Thẻ 3D
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📋 Xem Toàn Bộ Dạng Lưới ({filteredCards.length})
            </button>
          </div>
        </div>

        {/* Session Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedSession(0)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedSession === 0
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất Cả 7 Buổi ({allCards.length})
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSession(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedSession === s
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Buổi {s}
            </button>
          ))}
        </div>

        {/* Mastery Filter */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Lọc theo:</span>
            <button
              onClick={() => setFilterMastered("all")}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                filterMastered === "all" ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterMastered("learning")}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                filterMastered === "learning" ? "bg-amber-100 text-amber-800" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Đang học
            </button>
            <button
              onClick={() => setFilterMastered("mastered")}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                filterMastered === "mastered" ? "bg-emerald-100 text-emerald-800" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Đã thuộc
            </button>
          </div>

          <div className="text-slate-400 font-mono">
            {filteredCards.length > 0 ? `${cardIndex + 1} / ${filteredCards.length}` : "0 thẻ"}
          </div>
        </div>
      </div>

      {/* Main Content: Card or Grid */}
      {filteredCards.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCards.map((card) => {
              const isMastered = progress?.masteredFlashcards.includes(card.id);
              return (
                <div
                  key={card.id}
                  className={`p-5 rounded-3xl border transition-all space-y-3 bg-white shadow-xs ${
                    isMastered ? "border-emerald-300 bg-emerald-50/20" : "border-slate-200 hover:border-teal-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Buổi {card.sessionId} • {card.badge}
                    </span>
                    <button
                      onClick={() => {
                        const { progress: updated } = toggleMasteredFlashcard(card.id);
                        setProgress(updated);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-colors ${
                        isMastered
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {isMastered ? "✓ Đã thuộc" : "+ Đánh dấu thuộc"}
                    </button>
                  </div>
                  <div className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                    {renderTextWithMath(card.front)}
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-amber-50/50 p-3 rounded-2xl border border-amber-100/80">
                    <span className="font-bold text-amber-900 block mb-0.5">💡 Đáp án & Cơ chế:</span>
                    {renderTextWithMath(card.back)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          currentCard && (
            <div className="space-y-6">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer perspective-1000 min-h-[340px] sm:min-h-[380px] w-full"
              >
                <div
                  className={`relative w-full h-full min-h-[340px] sm:min-h-[380px] rounded-3xl transition-transform duration-500 transform-style-3d border shadow-lg ${
                    isFlipped ? "rotate-y-180" : ""
                  } ${
                    isCurrentMastered
                      ? "border-emerald-300 bg-emerald-50/20 shadow-emerald-500/10"
                      : "border-slate-200/80 bg-white shadow-slate-200/50"
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 backface-hidden p-8 sm:p-12 flex flex-col justify-between rounded-3xl bg-white">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold px-3 py-1 rounded-full bg-vet-cream text-amber-900 border border-amber-200">
                        {currentCard.badge} • Buổi {currentCard.sessionId}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        Chạm để lật mặt sau
                      </span>
                    </div>

                    <div className="text-center my-auto px-4">
                      <div className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
                        {renderTextWithMath(currentCard.front)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                      <span>Phím [Space] để lật</span>
                      <span>{currentCard.category}</span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 sm:p-12 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/40 border border-teal-500/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        💡 Đáp Án & Cơ Chế Sinh Lý
                      </span>
                      <span className="text-slate-400">Buổi {currentCard.sessionId}</span>
                    </div>

                    <div className="my-auto px-4 text-center">
                      <div className="text-base sm:text-xl font-bold text-slate-800 leading-relaxed">
                        {renderTextWithMath(currentCard.back)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                      <span>Đã ghi nhớ rõ cơ chế chưa?</span>
                      <span>Bấm vào thẻ để quay lại</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                {/* Prev / Next buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Thẻ trước (Phím mũi tên trái)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleShuffle}
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Xáo trộn ngẫu nhiên"
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Thẻ tiếp theo (Phím mũi tên phải)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Mastery Toggle */}
                <button
                  onClick={handleToggleMastered}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all ${
                    isCurrentMastered
                      ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600"
                      : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCurrentMastered ? "Đã Thuộc Lòng ✨" : "Đánh Dấu Đã Thuộc (+15 XP)"}</span>
                </button>
              </div>
            </div>
          )
        )
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-bold text-slate-800">Không có thẻ nào phù hợp bộ lọc!</h3>
          <p className="text-sm text-slate-500">
            Bạn có thể đổi bộ lọc sang &ldquo;Tất cả&rdquo; để xem toàn bộ 147 flashcards nhé!
          </p>
          <button
            onClick={() => {
              setSelectedSession(0);
              setFilterMastered("all");
            }}
            className="px-5 py-2.5 rounded-2xl bg-vet-teal text-white font-bold text-sm"
          >
            Xem Tất Cả 147 Thẻ
          </button>
        </div>
      )}
    </div>
  );
}

// Helper to render text containing inline math $...$
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
          className="mx-1 text-vet-teal font-serif font-bold text-lg"
        />
      );
    }
    return part;
  });
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium">Đang tải bộ thẻ học...</div>}>
      <FlashcardsContent />
    </Suspense>
  );
}

