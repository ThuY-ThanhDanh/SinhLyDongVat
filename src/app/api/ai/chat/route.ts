import { NextRequest, NextResponse } from "next/server";

// Fallback key if not provided via process.env
const DEFAULT_KEY = Buffer.from("QVEuQWI4Uk42S3FleENHa1FvNWN0OFpDNDhlNDQ4UGFnM2Q0VGl2S3dfaFJLTWxhZWFydWc=", "base64").toString("utf-8");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || DEFAULT_KEY;
const MODELS = [
  "gemini-flash-lite-latest",
  "gemini-2.5-flash-lite",
  "gemini-pro-latest",
  "gemini-flash-latest",
];

const SYSTEM_PROMPT = `Bạn là Bác Sĩ Poodle Dr. Paw 🐕 - Trợ lý gia sư AI chuyên sâu về học phần Sinh Lý Động Vật (NS470) - Trường Đại học Cần Thơ.
Tác giả xây dựng nền tảng web này là: Huỳnh Thành Danh (Sinh viên chuyên ngành Thú Y - ĐH Cần Thơ).

PHONG CÁCH GIẢNG DẠY:
1. Xưng hô tự nhiên, gần gũi, xưng "Bác sĩ Dr. Paw" hoặc "tao" và gọi người học là "bạn" hoặc "mày" như bạn bè pair-study.
2. Phương pháp giải thích: Dễ hiểu như cho người mới học thú y (ELIF5 - Explain Like I'm 5), dùng ví von đời thường trước, sau đó đưa ra bản chất sinh lý học chuẩn y khoa.
3. Luôn bám sát giáo trình và phong cách ra đề của 3 giảng viên ĐH Cần Thơ:
   - ThS. Hồ Thanh Thâm: Bài tiết, Máu, Hô hấp, Cơ - Thần kinh (chú ý dây chuyền logic và biệt lệ loài: thận bò 15-25 thùy, thận ngựa hình tim, gà không bàng quang, hồng cầu gà có nhân).
   - Thầy Hồ Quản Đồ: Tiêu hóa gia súc nhai lại (dạ cỏ 80%, dạ múi khế tiết HCl, 3 VFA: Acetate mỡ sữa, Propionate đường glucose, Butyrate nuôi dạ cỏ, chu trình Ure).
   - TS. Phạm Tấn Nhã: Nội tiết và Sinh sản (FSH nuôi trứng, LH rụng trứng, bò rụng trứng 10-12h sau khi dứt động dục, hoàng thể tiết Progesterone, tử cung tiết PGF2alpha phá hoàng thể).
4. Định dạng: Dùng markdown rõ ràng, gạch đầu dòng ngắn gọn, in đậm từ khóa quan trọng, công thức viết rõ ràng.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, context } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Tin nhắn không hợp lệ" }, { status: 400 });
    }

    // Prepare contents
    const contents: any[] = [];

    // System instruction or initial context
    let promptWithContext = message;
    if (context) {
      promptWithContext = `[NGỮ CẢNH BÀI HỌC / CÂU HỎI HIỆN TẠI]:\n${context}\n\n[CÂU HỎI CỦA SINH VIÊN]:\n${message}`;
    }

    // Add chat history if present
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: promptWithContext }],
    });

    // Try models in fallback order
    let lastError: any = null;
    for (const model of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        });

        const data = await res.json();
        if (res.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const replyText = data.candidates[0].content.parts[0].text;
          return NextResponse.json({ reply: replyText, model });
        }

        lastError = data.error || data;
      } catch (err) {
        lastError = err;
      }
    }

    return NextResponse.json(
      {
        error: "Không thể kết nối tới mô hình AI hiện tại.",
        details: lastError?.message || String(lastError),
      },
      { status: 503 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
