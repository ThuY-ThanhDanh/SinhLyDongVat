"use client";

import React, { useState } from "react";
import trapsData from "@/data/traps.json";
import { ExamTrap } from "@/types";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MascotBanner } from "@/components/MascotBanner";
import { AlertTriangle, User, ShieldAlert, Sparkles, Filter } from "lucide-react";

export default function TrapsPage() {
  const traps: ExamTrap[] = trapsData as unknown as ExamTrap[];

  const [selectedProf, setSelectedProf] = useState<string>("all");

  const professors = [
    { id: "all", name: "Tất Cả 3 Giảng Viên" },
    { id: "ThS. Hồ Thanh Thâm", name: "ThS. Hồ Thanh Thâm (Bài tiết, Máu, Hô hấp, Thần kinh)" },
    { id: "Thầy Hồ Quản Đồ", name: "Thầy Hồ Quản Đồ (Dạ cỏ & Tiêu hóa nhai lại)" },
    { id: "TS. Phạm Tấn Nhã", name: "TS. Phạm Tấn Nhã (Nội tiết & Sinh sản)" },
  ];

  const filteredTraps = traps.filter((t) => {
    if (selectedProf === "all") return true;
    return t.professor === selectedProf;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 shadow-xs">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Bảo bối phòng thi ĐH Cần Thơ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Cẩm Nang Bẫy Đề Thi & Điểm Liệt 🚨
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Đề thi trắc nghiệm Sinh lý động vật (NS470) thường gài các từ ngữ phủ định kép, hoán đổi thứ tự các đoạn ống thận, đảo nghịch tác dụng hormone. Đọc kỹ cẩm nang này để không bị mất điểm oan!
        </p>
      </div>

      <MascotBanner
        tip="Thầy Nhã hay hỏi về thời điểm rụng trứng của bò (10-12 giờ SAU KHI DỨT ĐỘNG DỤC chứ không phải trong khi động dục), nhớ kỹ kẻo bị lừa nhé!"
      />

      {/* Professor Filter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Lọc theo Giảng Viên ra đề:
        </div>
        <div className="flex flex-wrap gap-2">
          {professors.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProf(p.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedProf === p.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Traps List */}
      <div className="space-y-8">
        {filteredTraps.map((trap) => (
          <div
            key={trap.sessionId}
            className="rounded-3xl bg-white border border-rose-200/90 shadow-sm p-6 sm:p-8 space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-600 text-white">
                  Buổi {trap.sessionId}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  {trap.badge}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>GV: {trap.professor}</span>
              </div>
            </div>

            <div className="text-slate-800">
              <MarkdownRenderer content={trap.content} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
