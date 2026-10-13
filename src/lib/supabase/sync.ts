import { getSupabase } from "./client";
import { UserProgress } from "@/types";
import { Profile, PersonalNoteRow } from "./types";

export async function fetchCloudProgress(userId: string): Promise<UserProgress | null> {
  const supabase = getSupabase();
  if (!supabase || !userId) return null;

  try {
    // 1. Fetch Profile
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileErr && profileErr.code !== "PGRST116") {
      console.warn("Cloud profile fetch error:", profileErr);
    }

    // 2. Fetch completed lessons
    const { data: lessonRows } = await supabase
      .from("lesson_progress")
      .select("lesson_id, status")
      .eq("user_id", userId)
      .eq("status", "completed");

    const completedLessons = (lessonRows || []).map((r) => Number(r.lesson_id)).filter(Boolean);

    // 3. Fetch mastered flashcards
    const { data: flashcardRows } = await supabase
      .from("flashcard_progress")
      .select("card_id")
      .eq("user_id", userId)
      .eq("is_mastered", true);

    const masteredFlashcards = (flashcardRows || []).map((r) => r.card_id);

    // 4. Fetch recent quiz attempts
    const { data: quizRows } = await supabase
      .from("quiz_attempts")
      .select("score, total_questions, passed, started_at")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(10);

    const quizHistory = (quizRows || []).map((q) => ({
      date: new Date(q.started_at).toLocaleDateString("vi-VN"),
      score: Number(q.score),
      total: q.total_questions,
      passed: q.passed,
    }));

    return {
      xp: profile?.xp ?? 0,
      level: profile?.level ?? "Tân Binh Thú Y 🐾",
      streak: profile?.streak ?? 1,
      completedLessons: completedLessons.length > 0 ? completedLessons : [1],
      masteredFlashcards,
      quizHistory,
    };
  } catch (err) {
    console.error("fetchCloudProgress exception:", err);
    return null;
  }
}

export async function syncCloudLessonComplete(userId: string, lessonId: number): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  try {
    // Upsert lesson_progress
    await supabase.from("lesson_progress").upsert({
      user_id: userId,
      lesson_id: String(lessonId),
      status: "completed",
      progress_percent: 100,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Award +100 XP
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", userId)
      .single();

    if (profile) {
      const newXp = (profile.xp || 0) + 100;
      let newLevel = "Tân Binh Thú Y 🐾";
      if (newXp >= 2000) newLevel = "Bác Sĩ Trưởng Khoa 🩺";
      else if (newXp >= 1200) newLevel = "Chuyên Gia Sinh Lý 🔬";
      else if (newXp >= 600) newLevel = "Trợ Lý Bác Sĩ 🐕";
      else if (newXp >= 300) newLevel = "Học Viên Tích Cực 📚";

      await supabase
        .from("profiles")
        .update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
        .eq("id", userId);
    }
  } catch (e) {
    console.warn("syncCloudLessonComplete error:", e);
  }
}

export async function syncCloudFlashcard(userId: string, cardId: string, isMastered: boolean): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  try {
    await supabase.from("flashcard_progress").upsert({
      user_id: userId,
      card_id: cardId,
      is_mastered: isMastered,
      last_reviewed_at: new Date().toISOString(),
    });

    if (isMastered) {
      const { data: profile } = await supabase.from("profiles").select("xp").eq("id", userId).single();
      if (profile) {
        await supabase
          .from("profiles")
          .update({ xp: (profile.xp || 0) + 15 })
          .eq("id", userId);
      }
    }
  } catch (e) {
    console.warn("syncCloudFlashcard error:", e);
  }
}

export async function syncCloudExamAttempt(
  userId: string,
  score: number,
  total: number,
  passed: boolean
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  try {
    await supabase.from("quiz_attempts").insert({
      user_id: userId,
      quiz_type: "final_exam",
      score,
      total_questions: total,
      correct_answers: score,
      passed,
      started_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
    });

    const xpEarned = score * 5 + (passed ? 200 : 50);
    const { data: profile } = await supabase.from("profiles").select("xp").eq("id", userId).single();
    if (profile) {
      const newXp = (profile.xp || 0) + xpEarned;
      let newLevel = "Tân Binh Thú Y 🐾";
      if (newXp >= 2000) newLevel = "Bác Sĩ Trưởng Khoa 🩺";
      else if (newXp >= 1200) newLevel = "Chuyên Gia Sinh Lý 🔬";
      else if (newXp >= 600) newLevel = "Trợ Lý Bác Sĩ 🐕";
      else if (newXp >= 300) newLevel = "Học Viên Tích Cực 📚";

      await supabase
        .from("profiles")
        .update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
        .eq("id", userId);
    }
  } catch (e) {
    console.warn("syncCloudExamAttempt error:", e);
  }
}

export async function saveCloudNote(userId: string, lessonId: number, content: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId) return false;

  try {
    const { error } = await supabase.from("personal_notes").upsert({
      user_id: userId,
      lesson_id: String(lessonId),
      content,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function getCloudNote(userId: string, lessonId: number): Promise<string> {
  const supabase = getSupabase();
  if (!supabase || !userId) return "";

  try {
    const { data } = await supabase
      .from("personal_notes")
      .select("content")
      .eq("user_id", userId)
      .eq("lesson_id", String(lessonId))
      .single();
    return data?.content || "";
  } catch {
    return "";
  }
}

export async function migrateLocalDataToCloud(
  userId: string,
  localData: UserProgress
): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase();
  if (!supabase || !userId) {
    return { success: false, message: "Supabase chưa được cấu hình" };
  }

  try {
    // 1. Ghi nhận biên lai migration
    await supabase.from("migration_receipts").insert({
      user_id: userId,
      source_storage_key: "vet_physiology_progress_v1",
      snapshot_data: localData,
      status: "success",
    });

    // 2. Chuyển đổi completed lessons
    if (localData.completedLessons?.length > 0) {
      for (const id of localData.completedLessons) {
        await supabase.from("lesson_progress").upsert({
          user_id: userId,
          lesson_id: String(id),
          status: "completed",
          progress_percent: 100,
          completed_at: new Date().toISOString(),
        });
      }
    }

    // 3. Chuyển đổi flashcards
    if (localData.masteredFlashcards?.length > 0) {
      for (const cardId of localData.masteredFlashcards) {
        await supabase.from("flashcard_progress").upsert({
          user_id: userId,
          card_id: cardId,
          is_mastered: true,
          last_reviewed_at: new Date().toISOString(),
        });
      }
    }

    // 4. Cập nhật profile XP nếu lớn hơn
    const { data: profile } = await supabase.from("profiles").select("xp").eq("id", userId).single();
    const currentXp = profile?.xp || 0;
    const finalXp = Math.max(currentXp, localData.xp || 0);

    let newLevel = "Tân Binh Thú Y 🐾";
    if (finalXp >= 2000) newLevel = "Bác Sĩ Trưởng Khoa 🩺";
    else if (finalXp >= 1200) newLevel = "Chuyên Gia Sinh Lý 🔬";
    else if (finalXp >= 600) newLevel = "Trợ Lý Bác Sĩ 🐕";
    else if (finalXp >= 300) newLevel = "Học Viên Tích Cực 📚";

    await supabase
      .from("profiles")
      .update({
        xp: finalXp,
        level: newLevel,
        streak: Math.max(1, localData.streak || 1),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return { success: true, message: "Đồng bộ tiến độ thành công!" };
  } catch (err: any) {
    console.error("Migration error:", err);
    return { success: false, message: err?.message || "Lỗi khi đồng bộ" };
  }
}
