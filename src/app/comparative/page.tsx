"use client";

import React, { useState } from "react";
import { COMPARATIVE_DATA, ComparativeItem } from "@/data/comparative";
import { MascotBanner } from "@/components/MascotBanner";
import { GitCompare, Sparkles, AlertCircle, Bookmark, CheckCircle2 } from "lucide-react";

export default function ComparativePage() {
  const [selectedSystem, setSelectedSystem] = useState<string>("all");

  const systems = [
    { id: "all", label: "Tất Cả Các Hệ Cơ Quan" },
    { id: "Hệ Tiết Niệu (Thận)", label: "💧 Hệ Tiết Niệu" },
    { id: "Hệ Máu (Huyết Học)", label: "🩸 Hệ Máu & Miễn Dịch" },
    { id: "Hệ Tiêu Hóa", label: "🌿 Hệ Tiêu Hóa & Dạ Cỏ" },
  ];

  const filteredItems = COMPARATIVE_DATA.filter((item) => {
    if (selectedSystem === "all") return true;
    return item.system === selectedSystem;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 shadow-xs">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Sinh học so sánh thú y</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Ma Trận So Sánh Dị Biệt Các Loài Vật Nuôi 🐾
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Đặc thù sống còn của ngành Thú y: Mỗi loài động vật có cấu trúc giải phẫu và quy luật sinh lý riêng biệt. Bảng tổng hợp dưới đây giúp bạn ghi nhớ nhanh và tránh nhầm lẫn lâm sàng.
        </p>
      </div>

      <MascotBanner
        tip="Gia cầm có hồng cầu và tiểu cầu đều CÓ NHÂN, hình bầu dục! Thú có vú thì hồng cầu đĩa lõm KHÔNG NHÂN!"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-3xl border border-slate-200 shadow-xs">
        {systems.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSystem(s.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              selectedSystem === s.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Comparative Cards */}
      <div className="space-y-8">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-vet-teal uppercase tracking-wider block">
                {item.system}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {item.feature}
              </h2>
            </div>

            {/* Species Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.species.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-2xl p-5 border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-vet-mint/50 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-vet-teal" />
                      {spec.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {spec.description}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                    <strong className="text-amber-950 font-bold flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Điểm nhấn lâm sàng & bẫy thi:
                    </strong>
                    {spec.clinicalPearl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
