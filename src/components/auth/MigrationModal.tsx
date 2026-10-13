"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ArrowRight, ShieldCheck, X, Loader2 } from "lucide-react";

export const MigrationModal: React.FC = () => {
  const { user, pendingMigration, confirmMigration, dismissMigration } = useAuth();
  const [migrating, setMigrating] = useState(false);

  if (!user || !pendingMigration) return null;

  const handleConfirm = async () => {
    setMigrating(true);
    try {
      await confirmMigration();
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5">
        <button
          onClick={dismissMigration}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-xs">
          💾
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">
            Đồng Bộ Tiến Độ Vào Tài Khoản
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Dr. Paw phát hiện máy tính này đang lưu sẵn dữ liệu học tập cũ trước khi bạn đăng nhập. Bạn có muốn lưu vĩnh viễn vào tài khoản <strong>{user.email}</strong> không?
          </p>
        </div>

        {/* Snapshot Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Điểm tích lũy (XP):</span>
            <span className="font-bold text-emerald-600">+{pendingMigration.xp} XP</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Cấp độ hiện tại:</span>
            <span className="font-bold text-slate-800">{pendingMigration.level}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Số buổi học đã hoàn thành:</span>
            <span className="font-bold text-teal-700">{pendingMigration.completedLessons?.length || 0} / 7 buổi</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Flashcards đã thuộc:</span>
            <span className="font-bold text-purple-700">{pendingMigration.masteredFlashcards?.length || 0} thẻ</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleConfirm}
            disabled={migrating}
            className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75"
          >
            {migrating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đồng bộ lên Cloud...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Đồng Bộ Ngay (Khuyên dùng)</span>
              </>
            )}
          </button>

          <button
            onClick={dismissMigration}
            disabled={migrating}
            className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors"
          >
            Để sau, bắt đầu từ đầu với tài khoản mới
          </button>
        </div>
      </div>
    </div>
  );
};
