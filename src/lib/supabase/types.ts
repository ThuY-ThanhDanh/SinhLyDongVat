export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string;
  role: "student" | "admin";
  xp: number;
  level: string;
  streak: number;
  created_at?: string;
  updated_at?: string;
}

export interface LessonProgressRow {
  user_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  progress_percent: number;
  last_position?: Record<string, any>;
  started_at?: string;
  completed_at?: string | null;
  updated_at?: string;
}

export interface FlashcardProgressRow {
  user_id: string;
  card_id: string;
  is_mastered: boolean;
  review_count: number;
  last_reviewed_at?: string;
}

export interface PersonalNoteRow {
  id: string;
  user_id: string;
  lesson_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizAttemptRow {
  id: string;
  user_id: string;
  quiz_type: string;
  session_id?: string | null;
  score: number;
  total_questions: number;
  correct_answers: number;
  duration_seconds?: number;
  passed: boolean;
  started_at?: string;
  submitted_at?: string;
}

export interface QuizAnswerRow {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_index?: number;
  is_correct?: boolean;
}

export interface MigrationReceiptRow {
  id: string;
  user_id: string;
  source_storage_key: string;
  snapshot_data: Record<string, any>;
  migrated_at: string;
  status: "success" | "failed";
}
