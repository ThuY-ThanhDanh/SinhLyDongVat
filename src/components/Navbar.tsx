"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getProgress } from "@/lib/storage";
import { UserProgress } from "@/types";
import { BookOpen, Layers, Award, AlertTriangle, GitCompare, Menu, X, Flame, Sparkles } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load progress initially and setup storage event listener
    const update = () => setProgress(getProgress());
    update();

    window.addEventListener("storage", update);
    const interval = setInterval(update, 2000);
    return () => {
      window.removeEventListener("storage", update);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Học Tập", icon: BookOpen },
    { href: "/flashcards", label: "Flashcards", icon: Layers },
    { href: "/exam", label: "Thi Thử 50 Câu", icon: Award },
    { href: "/traps", label: "Bẫy Đề Thi", icon: AlertTriangle },
    { href: "/comparative", label: "So Sánh Loài", icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-vet-mint to-vet-teal flex items-center justify-center text-xl shadow-md shadow-vet-mint/30 group-hover:scale-105 transition-transform">
            🐕
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>Dr. Paw</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-vet-cream text-amber-800 font-semibold border border-amber-200">
                NS470
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Sinh Lý Động Vật • ĐH Cần Thơ</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-vet-mint/15 text-vet-teal shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-vet-teal" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Gamification Stats */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse fill-amber-500" />
            <span>{progress?.streak ?? 1} Ngày</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>{progress?.xp ?? 0} XP</span>
          </div>

          {/* Rank Badge */}
          <div className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 max-w-[130px] truncate">
            {progress?.level ?? "Tân Binh"}
          </div>
        </div>

        {/* User Auth Menu & Mobile Button */}
        <div className="flex items-center gap-2">
          <UserMenu />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {/* Stats in Mobile */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 pt-1">
            <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{progress?.streak ?? 1} ngày streak</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{progress?.xp ?? 0} XP</span>
            </div>
            <span className="text-xs text-slate-600 font-semibold">{progress?.level ?? "Tân Binh"}</span>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-vet-mint/20 text-vet-teal"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-vet-teal" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
