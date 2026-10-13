import { UserProgress } from "@/types";

const STORAGE_KEY = "vet_physiology_progress_v1";

const defaultProgress: UserProgress = {
  xp: 150,
  level: "Tân Binh Thú Y 🐾",
  streak: 3,
  completedLessons: [1],
  masteredFlashcards: [],
  quizHistory: [],
};

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
      return defaultProgress;
    }
    return JSON.parse(raw);
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}

export function addXP(amount: number): UserProgress {
  const current = getProgress();
  const newXP = current.xp + amount;
  let newLevel = "Tân Binh Thú Y 🐾";

  if (newXP >= 2000) newLevel = "Bác Sĩ Trưởng Khoa 🩺";
  else if (newXP >= 1200) newLevel = "Chuyên Gia Sinh Lý 🔬";
  else if (newXP >= 600) newLevel = "Trợ Lý Bác Sĩ 🐕";
  else if (newXP >= 300) newLevel = "Học Viên Tích Cực 📚";

  const updated: UserProgress = {
    ...current,
    xp: newXP,
    level: newLevel,
  };
  saveProgress(updated);
  return updated;
}

export function markLessonComplete(lessonId: number): UserProgress {
  const current = getProgress();
  if (!current.completedLessons.includes(lessonId)) {
    const updated: UserProgress = {
      ...current,
      completedLessons: [...current.completedLessons, lessonId],
      xp: current.xp + 100,
    };
    saveProgress(updated);
    return updated;
  }
  return current;
}

export function toggleMasteredFlashcard(cardId: string): { progress: UserProgress; isMastered: boolean } {
  const current = getProgress();
  let mastered = [...current.masteredFlashcards];
  let isMastered = false;

  if (mastered.includes(cardId)) {
    mastered = mastered.filter((id) => id !== cardId);
  } else {
    mastered.push(cardId);
    isMastered = true;
  }

  const updated: UserProgress = {
    ...current,
    masteredFlashcards: mastered,
    xp: current.xp + (isMastered ? 15 : 0),
  };
  saveProgress(updated);
  return { progress: updated, isMastered };
}

export function recordExamResult(score: number, total: number): UserProgress {
  const current = getProgress();
  const passed = score >= 35; // 70%
  const updated: UserProgress = {
    ...current,
    xp: current.xp + score * 5 + (passed ? 200 : 50),
    quizHistory: [
      {
        date: new Date().toLocaleDateString("vi-VN"),
        score,
        total,
        passed,
      },
      ...current.quizHistory.slice(0, 9),
    ],
  };
  saveProgress(updated);
  return updated;
}
