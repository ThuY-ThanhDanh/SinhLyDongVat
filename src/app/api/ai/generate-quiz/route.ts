import { NextRequest, NextResponse } from "next/server";
import lessonsData from "@/data/lessons.json";

// Fallback key if not provided via process.env
const DEFAULT_KEY = Buffer.from("QVEuQWI4Uk42S3FleENHa1FvNWN0OFpDNDhlNDQ4UGFnM2Q0VGl2S3dfaFJLTWxhZWFydWc=", "base64").toString("utf-8");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || DEFAULT_KEY;
const MODELS = [
  "gemini-flash-lite-latest",
  "gemini-2.5-flash-lite",
  "gemini-pro-latest",
  "gemini-flash-latest",
];

export async function POST(req: NextRequest) {
  try {
    const { sessionId = 1, count = 5, topic = "" } = await req.json();

    // Find lesson content
    const lessons: any[] = lessonsData as any[];
    const lesson = lessons.find((l) => l.id === Number(sessionId)) || lessons[0];

    // Extract section summaries or content from lesson
    const sectionTexts = Object.entries(lesson.contentSections || {})
      .slice(0, 4)
      .map(([k, v]) => `${k}:\n${String(v).slice(0, 1500)}`)
      .join("\n\n");

    const prompt = `Bạn là chuyên gia ra đề thi trắc nghiệm học phần Sinh Lý Động Vật (NS470) - Trường Đại học Cần Thơ.
Giảng viên phụ trách bài này: ${lesson.professor} (Chuyên đề: ${lesson.title}).
${topic ? `Yêu cầu tập trung vào chủ đề: ${topic}` : ""}

DỰA TRÊN 100% NỘI DUNG BÀI GIẢNG DƯỚI ĐÂY:
\"\"\"
${sectionTexts.slice(0, 6000)}
\"\"\"

HÃY SINH CHÍNH XÁC ${count} CÂU HỎI TRẮC NGHIỆM MỚI TOANH (CHƯA TỪNG XUẤT HIỆN) THEO ĐÚNG ĐỊNH DẠNG JSON sau:
[
  {
    "id": "ai-gen-${Date.now()}-1",
    "sessionId": ${lesson.id},
    "sessionTitle": "${lesson.title}",
    "question": "Nội dung câu hỏi trắc nghiệm ngắn gọn, bám sát cơ chế hoặc biệt lệ loài?",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correctIndex": 0,
    "correctLetter": "A",
    "explanation": "Giải thích chi tiết tại sao đáp án này đúng dựa trên cơ chế sinh lý học?",
    "badge": "${lesson.badge}"
  }
]

QUY TẮC BẮT BUỘC:
1. CHỈ TRẢ VỀ DUY NHẤT MÃ JSON HỢP LỆ TRONG KHỐI \`\`\`json ... \`\`\`, KHÔNG VIẾT THÊM BẤT KỲ LỜI CHÀO HỎI NÀO NGOÀI JSON.
2. 4 lựa chọn A, B, C, D rõ ràng, không được trùng lặp. correctIndex là số nguyên từ 0 đến 3 tương ứng với A, B, C, D.
3. Câu hỏi phải chuẩn chuyên môn y học thú y của ĐH Cần Thơ, có tính phân hóa và bẫy đề thi.`;

    let lastError: any = null;
    for (const model of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 3000,
            },
          }),
        });

        const data = await res.json();
        if (res.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const rawText = data.candidates[0].content.parts[0].text;

          // Extract JSON block
          const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, rawText];
          const jsonStr = jsonMatch[1] || rawText;

          const parsedQuestions = JSON.parse(jsonStr.trim());
          if (Array.isArray(parsedQuestions)) {
            return NextResponse.json({ questions: parsedQuestions, model });
          }
        }
        lastError = data.error || data;
      } catch (err) {
        lastError = err;
      }
    }

    return NextResponse.json(
      { error: "AI chưa thể sinh câu hỏi vào lúc này, vui lòng thử lại.", details: String(lastError) },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
