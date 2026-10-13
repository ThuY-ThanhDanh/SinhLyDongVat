"use client";

import React, { useState } from "react";
import { Sparkles, HelpCircle, X } from "lucide-react";

interface MascotBannerProps {
  tip?: string;
  analogy?: string;
  quote?: string;
}

const defaultTips = [
  "Bò có 15-25 thùy thận, ngựa có thận phải hình trái tim, gia cầm tuyệt đối không có bàng quang!",
  "Động vật ăn cỏ nước tiểu có tính kiềm (pH 7.4 - 8.4), còn chó mèo ăn thịt nước tiểu có tính acid (pH 5.5 - 7.0)!",
  "Tại dạ cỏ, VFA (Acetate, Propionate, Butyrate) cung cấp tới 70-80% tổng nhu cầu năng lượng cho gia súc nhai lại!",
  "Thi trắc nghiệm 50 câu / 60 phút, nhớ cẩn thận các bẫy đảo ngược câu chữ của đề thi nhé!",
];

export const MascotBanner: React.FC<MascotBannerProps> = ({ tip, analogy, quote }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const currentTip = tip || defaultTips[Math.floor(Math.random() * defaultTips.length)];

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-amber-50 via-vet-cream/40 to-emerald-50 border border-amber-200/80 p-5 shadow-sm transition-all hover:shadow-md">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors"
        aria-label="Đóng"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        {/* Mascot Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-vet-coral flex items-center justify-center text-3xl shadow-md animate-float">
            🐕
          </div>
          <span className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.2 bg-white rounded-full border border-slate-200 shadow-xs font-bold text-amber-700">
            Dr. Paw
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 pr-6 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Lời khuyên từ Bác sĩ Poodle
            </span>
            {analogy && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                Góc ví von ELIF5
              </span>
            )}
          </div>

          <p className="text-sm md:text-base text-slate-800 font-medium leading-relaxed">
            {analogy ? `💡 "${analogy}"` : `🐾 "${currentTip}"`}
          </p>

          {quote && (
            <p className="text-xs text-slate-500 italic">
              — {quote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
