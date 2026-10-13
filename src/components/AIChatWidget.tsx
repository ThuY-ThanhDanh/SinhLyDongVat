"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, Trash2, ArrowDown } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

const QUICK_QUESTIONS = [
  "Tại sao gà không có bàng quang?",
  "Phân biệt 3 loại VFA dạ cỏ bò?",
  "Bò rụng trứng vào thời điểm nào?",
  "Mẹo nhớ 3 loại bạch cầu hạt?",
  "Giải thích công thức áp suất lọc Pl?",
];

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "Gâu gâu! 🐕 Tao là **Bác Sĩ Poodle Dr. Paw** đây! Mày đang học phần nào môn Sinh Lý Động Vật (NS470) mà chưa hiểu hoặc có câu hỏi trắc nghiệm nào hóc búa cứ quăng vào đây tao giải thích theo kiểu bình dân cho mày nghe!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "model",
          text: data.reply,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errMsg: Message = {
          id: `err-${Date.now()}`,
          role: "model",
          text: `⚠️ ${data.error || "Có lỗi khi kết nối với AI, mày thử hỏi lại lần nữa nhé!"}`,
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "⚠️ Mạng hơi chập chờn, mày bấm gửi lại phát nữa nhé!",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-teal-900/30 hover:scale-105 active:scale-95 transition-all border-2 border-white"
          aria-label="Mở Trợ Lý AI Dr. Paw"
        >
          <span className="text-xl animate-bounce">🐕</span>
          <span className="hidden sm:inline">Hỏi Dr. Paw AI</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl bg-white border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-teal-800 to-emerald-800 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-xs">
                🐕
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>Dr. Paw AI Tutor</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400 text-emerald-950 font-black">
                    GEMINI
                  </span>
                </div>
                <div className="text-[11px] text-teal-100 font-medium">Hỏi đáp Sinh Lý Thú Y 24/7</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: "welcome",
                      role: "model",
                      text: "Gâu gâu! 🐕 Đã làm mới cuộc trò chuyện. Mày muốn hỏi phần nào cứ nhắn nhé!",
                    },
                  ])
                }
                title="Xóa lịch sử chat"
                className="p-1.5 rounded-xl hover:bg-white/20 text-teal-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Gợi ý:
            </span>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-[11px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-700 transition-all flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "model" && (
                  <div className="w-7 h-7 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    🐕
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    m.role === "user"
                      ? "bg-teal-700 text-white rounded-br-xs font-medium"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <MarkdownRenderer content={m.text} />
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-sm flex-shrink-0">
                  🐕
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                  <span className="animate-spin text-teal-600">🐾</span>
                  <span>Dr. Paw đang tra cứu bài giảng...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Hỏi Dr. Paw về cơ chế, bẫy thi..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 transition-all shadow-xs flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
