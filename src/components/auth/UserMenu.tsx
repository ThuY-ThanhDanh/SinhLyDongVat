"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "./AuthModal";
import { LogIn, LogOut, User, Award, Shield, ChevronDown, Sparkles } from "lucide-react";

export const UserMenu: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-24 h-9 rounded-full bg-slate-100 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Đăng Nhập</span>
        </button>
        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Sinh Viên";
  const avatar = profile?.avatar_url || "🐕";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all shadow-2xs"
      >
        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm">
          {avatar}
        </div>
        <div className="text-left hidden sm:block max-w-[100px] truncate">
          <span className="block truncate">{displayName}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="font-extrabold text-sm text-slate-800 truncate">{displayName}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                {profile?.level || "Tân Binh"}
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                {profile?.xp || 0} XP
              </span>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Hồ Sơ & Tiến Độ Cá Nhân</span>
            </Link>

            <Link
              href="/exam"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Lịch Sử Thi & Điểm Số</span>
            </Link>
          </div>

          <div className="pt-1 border-t border-slate-100">
            <button
              onClick={async () => {
                setDropdownOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
