import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 py-12 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐕</span>
              <span className="font-extrabold text-slate-900 text-lg">Dr. Paw — Sinh Lý Động Vật</span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-md">
              Hệ thống học tập và ôn thi tương tác thông minh cho học phần <strong>Sinh Lý Động Vật (NS470)</strong> — Khoa Nông nghiệp & Phát triển Nông thôn, Trường Đại học Cần Thơ.
            </p>
            <p className="text-xs text-slate-400">
              Giảng viên: ThS. Hồ Thanh Thâm • Thầy Hồ Quản Đồ • TS. Phạm Tấn Nhã
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Học Tập & Ôn Luyện</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-vet-teal transition-colors">
                  7 Đảo Kiến Thức
                </Link>
              </li>
              <li>
                <Link href="/flashcards" className="hover:text-vet-teal transition-colors">
                  147 Thẻ Ghi Nhớ
                </Link>
              </li>
              <li>
                <Link href="/exam" className="hover:text-vet-teal transition-colors">
                  Phòng Thi Thử 50 Câu
                </Link>
              </li>
              <li>
                <Link href="/traps" className="hover:text-vet-teal transition-colors">
                  Cẩm Nang Bẫy Đề Thi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Tác Giả & Phát Triển</h4>
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1">
              <div className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <span>👨‍⚕️</span>
                <span>Phát triển bởi: Huỳnh Thành Danh</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Sinh viên chuyên ngành Thú Y • Trường Đại học Cần Thơ (CTU).
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Được xây dựng với</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>dành cho sinh viên Thú Y</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Dr. Paw Vet Physiology. All learning materials aligned with CTU syllabus.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 transition-colors">Phiên bản 1.0.0</span>
            <span>•</span>
            <span className="hover:text-slate-600 transition-colors">Sẵn sàng triển khai Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
