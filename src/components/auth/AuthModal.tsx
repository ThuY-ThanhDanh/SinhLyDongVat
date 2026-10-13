"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { X, Mail, Lock, User, Sparkles, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "login",
}) => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const res = await signIn(email, password);
        if (res.error) {
          if (res.error.includes("Invalid login credentials")) {
            setErrorMsg("Email hoặc mật khẩu không chính xác.");
          } else {
            setErrorMsg(res.error);
          }
        } else {
          setSuccessMsg("Đăng nhập thành công! Đang tải dữ liệu...");
          setTimeout(() => {
            onClose();
          }, 800);
        }
      } else {
        const name = displayName.trim() || email.split("@")[0];
        const res = await signUp(email, password, name);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg("Tạo tài khoản thành công! Bạn có thể sử dụng ngay.");
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Decoration */}
        <div className="p-6 bg-gradient-to-br from-amber-50 via-teal-50 to-emerald-50 border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center text-2xl shadow-md">
              🐕
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {mode === "login" ? "Đăng Nhập Dr. Paw" : "Tạo Tài Khoản Sinh Viên"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Lưu tiến độ học, ghi chú riêng và đồng bộ đa thiết bị
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!isConfigured && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Chế độ Demo (Chưa gắn Supabase Key)</span>
              </div>
              <p className="text-amber-700">
                Khi thêm <code>NEXT_PUBLIC_SUPABASE_URL</code> và <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> vào Vercel / <code>.env.local</code>, hệ thống sẽ tự động kích hoạt Cloud Auth.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và Tên / Biệt danh
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A (K48 Thú Y)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sinhvien@ctu.edu.vn hoặc gmail"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isConfigured}
              className={`w-full py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                !isConfigured
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : loading
                  ? "bg-teal-800 text-white cursor-wait opacity-80"
                  : "bg-teal-700 hover:bg-teal-800 text-white active:scale-98"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : mode === "login" ? (
                <>
                  <span>Vào Học Ngay</span>
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Hoàn Tất Đăng Ký</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === "login" ? (
              <p>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMsg(null);
                  }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Đăng ký miễn phí
                </button>
              </p>
            ) : (
              <p>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg(null);
                  }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Đăng nhập lại
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
