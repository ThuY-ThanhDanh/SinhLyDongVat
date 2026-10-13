"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { saveCloudNote, getCloudNote } from "@/lib/supabase/sync";
import { BookOpen, Check, Cloud, HardDrive, Edit3, Loader2 } from "lucide-react";

interface PersonalNotesBoxProps {
  lessonId: number;
}

export const PersonalNotesBox: React.FC<PersonalNotesBoxProps> = ({ lessonId }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<"idle" | "saved">("idle");
  const localKey = `dr_paw_note_lesson_${lessonId}`;

  // Load note on mount or user change
  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (user) {
        const cloudContent = await getCloudNote(user.id, lessonId);
        if (isMounted) {
          if (cloudContent) {
            setContent(cloudContent);
          } else {
            // Check local fallback
            const local = localStorage.getItem(localKey);
            if (local) setContent(local);
          }
        }
      } else {
        const local = localStorage.getItem(localKey);
        if (isMounted && local) setContent(local);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [user, lessonId, localKey]);

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setSavedStatus("idle");

    try {
      // Always save to localStorage as local cache
      localStorage.setItem(localKey, content);

      if (user) {
        await saveCloudNote(user.id, lessonId, content);
      }

      setSavedStatus("saved");
      setTimeout(() => setSavedStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl bg-amber-50/50 border border-amber-200/80 p-5 sm:p-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              Sổ Tay Ghi Chú Cá Nhân (Buổi {lessonId})
            </h3>
            <p className="text-[11px] text-slate-500">
              Ghi lại lưu ý của giảng viên, công thức cần nhớ hay mẹo tránh bẫy thi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
          {user ? (
            <span className="flex items-center gap-1 text-teal-700">
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lưu Cloud Supabase</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-700">
              <HardDrive className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lưu cục bộ máy tính</span>
            </span>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSavedStatus("idle");
        }}
        placeholder="Nhập ghi chú riêng của bạn tại đây... (VD: Thầy Thâm nhấn mạnh câu hỏi về áp suất lọc cầu thận Ph - (Pk + Pn), chú ý bẫy thận ngựa...)"
        rows={4}
        className="w-full p-3.5 rounded-2xl bg-white border border-amber-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent resize-y placeholder:text-slate-400"
      />

      <div className="flex items-center justify-between pt-1">
        <div className="text-xs">
          {savedStatus === "saved" && (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Đã lưu thành công!</span>
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-75"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Lưu Ghi Chú</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
