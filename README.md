# 🐕 Dr. Paw — Nền Tảng Học & Ôn Thi Sinh Lý Động Vật (NS470)
> **Trường Đại Học Cần Thơ | Khoa Nông Nghiệp & PTNT | Bộ Môn Thú Y**
> Thiết kế đặc thù cho người mới bắt đầu học thú y: Trực quan, ví von ELIF5, công thức KaTeX chuẩn mực, flashcards 3D, phòng thi thử 50 câu / 60 phút.

---

## 🌟 1. Giới Thiệu Tổng Quan
Học phần **Sinh Lý Động Vật (NS470)** là môn học cơ sở ngành cốt lõi, nghiên cứu chức năng và quy luật hoạt động của các cơ quan trong cơ thể động vật.

Dự án **Dr. Paw** được xây dựng nhằm giúp sinh viên và người mới học có thể nắm bắt bản chất cơ chế sinh lý học một cách trực quan, vui vẻ, không áp lực thông qua sự đồng hành của linh vật Bác sĩ Poodle **Dr. Paw**.

---

## 🚀 2. Các Tính Năng Cốt Lõi

### 🗺️ 2.1. Bản Đồ 7 Đảo Kiến Thức Toàn Diện
Bao gồm trọn vẹn 7 buổi học (19 giờ bài giảng từ 3 giảng viên chuyên môn):
1. **Buổi 1:** Sinh Lý Bài Tiết & Giới Thiệu Môn Học (ThS. Hồ Thanh Thâm) — Cấu tạo thận, màng lọc cầu thận, $P_l = P_h - (P_k + P_n)$, GFR, nước tiểu.
2. **Buổi 2:** Sinh Lý Máu & Miễn Dịch (ThS. Hồ Thanh Thâm) — Hồng cầu có/không nhân, Hemoglobin, nhóm máu thú cưng, đông máu.
3. **Buổi 3:** Sinh Lý Hô Hấp (ThS. Hồ Thanh Thâm) — Cơ học thông khí, dung tích sống, màng phế nang, túi khí gia cầm.
4. **Buổi 4:** Sinh Lý Cơ - Thần Kinh (ThS. Hồ Thanh Thâm) — Điện thế màng, bơm $Na^+/K^+$, Synapse, cơ vân, cơ trơn, cơ tim.
5. **Buổi 5:** Sinh Lý Tiêu Hóa Gia Súc Nhai Lại (Thầy Hồ Quản Đồ) — Dạ dày 4 túi (dạ cỏ, tổ ong, lá sách, múi khế), lên men VFA, tái chế ure.
6. **Buổi 6:** Sinh Lý Tuyến Nội Tiết (TS. Phạm Tấn Nhã) — Trục dưới đồi - tuyến yên, hormone tăng trưởng, tuyến giáp, Insulin/Glucagon.
7. **Buổi 7:** Sinh Lý Sinh Sản & Tiết Sữa (TS. Phạm Tấn Nhã) — Chu kỳ động dục gia súc, rụng trứng, thụ tinh, nhau thai, tiết sữa.

### 🃏 2.2. Hệ Thống 147 Flashcards Spaced Repetition (Lật Thẻ 3D)
- Lật thẻ 3D mượt mà bằng chuột hoặc phím `Space`/`Enter`.
- Lọc theo từng buổi học hoặc tình trạng thuộc bài.
- Chế độ tự động tăng XP và đánh dấu thẻ đã thuộc làu.

### ⏱️ 2.3. Phòng Thi Thử 50 Câu / 60 Phút
- Mô phỏng 100% định dạng đề thi kết thúc học phần trắc nghiệm ĐH Cần Thơ.
- Đồng hồ đếm ngược 60:00, tự động thu bài.
- Bảng điều hướng câu hỏi 50 ô trực quan, cờ đánh dấu câu phân vân.
- Chấm điểm ngay lập tức, giải thích tường tận cơ chế sinh lý cho từng đáp án đúng/sai.

### 🚨 2.4. Cẩm Nang Bẫy Đề Thi 3 Giảng Viên
- Radar cảnh báo các câu gài, từ ngữ phủ định kép và mẹo làm bài theo từng phong cách ra đề của Thầy Thâm, Thầy Đồ, Thầy Nhã.

### 🐾 2.5. Ma Trận So Sánh Các Loài Động Vật
- Bảng tra cứu dị biệt giữa Trâu/Bò (nhai lại), Ngựa, Heo, Chó/Mèo và Lớp Chim (Gia cầm).

---

## 🛠️ 3. Công Nghệ Sử Dụng (Tech Stack)
- **Framework:** Next.js 14 (App Router)
- **UI & Styling:** React 18, Tailwind CSS (Pastel Vet Theme)
- **Icons:** Lucide React
- **Công Thức Toán & Sinh Lý:** KaTeX (Hiển thị mượt mà không lỗi)
- **Hiệu Ứng Game:** Canvas Confetti
- **Lưu Trữ Tiến Độ:** LocalStorage (Offline-first, không tốn chi phí database)

---

## 💻 4. Hướng Dẫn Chạy Cục Bộ (Local Development)

```bash
# 1. Di chuyển vào thư mục dự án
cd F:\Workspace\vet-physiology-web

# 2. Cài đặt thư viện (nếu chưa có)
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

---

## 🚢 5. Hướng Dẫn Deploy Lên Vercel (Miễn Phí 100%)

### Cách 1: Deploy qua GitHub (Khuyên Dùng)
1. Tạo một repository mới trên GitHub (ví dụ: `vet-physiology-web`).
2. Đẩy toàn bộ mã nguồn lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete vet physiology web app"
   git branch -M main
   git remote add origin https://github.com/<username>/vet-physiology-web.git
   git push -u origin main
   ```
3. Truy cập [Vercel Dashboard](https://vercel.com).
4. Bấm **Add New** $\rightarrow$ **Project** $\rightarrow$ Chọn repo `vet-physiology-web`.
5. Bấm **Deploy**. Vercel sẽ tự động build và cấp domain miễn phí dạng `https://vet-physiology-web.vercel.app`.

### Cách 2: Deploy qua Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

---
*Chúc các bạn học tốt và đạt điểm cao trong kỳ thi môn Sinh Lý Động Vật (NS470)! 🩺🐾*
