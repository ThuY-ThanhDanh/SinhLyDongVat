export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  professor: string;
  duration: string;
  icon: string;
  badge: string;
  color: string;
  analogy: string;
  contentSections: Record<string, string>;
  quizCount?: number;
  flashcardCount?: number;
}

export interface QuizQuestion {
  id: string;
  sessionId: number;
  sessionTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  correctLetter: string;
  explanation: string;
  badge: string;
}

export interface Flashcard {
  id: string;
  sessionId: number;
  badge: string;
  front: string;
  back: string;
  category: string;
}

export interface ExamTrap {
  sessionId: number;
  sessionTitle: string;
  professor: string;
  badge: string;
  content: string;
}

export interface UserProgress {
  xp: number;
  level: string;
  streak: number;
  completedLessons: number[];
  masteredFlashcards: string[];
  quizHistory: {
    date: string;
    score: number;
    total: number;
    passed: boolean;
  }[];
}
