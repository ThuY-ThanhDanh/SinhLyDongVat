-- ============================================================================
-- DR. PAW 🐕 - SINH LÝ ĐỘNG VẬT (NS470) - ĐH CẦN THƠ
-- SUPABASE POSTGRESQL MIGRATION SCRIPT (AUTH, DATABASE & ROW LEVEL SECURITY)
-- ============================================================================
-- Hướng dẫn:
-- 1. Vào Supabase Dashboard -> chọn Project của bạn.
-- 2. Mở mục "SQL Editor" ở thanh menu bên trái.
-- 3. Tạo "New Query", dán toàn bộ nội dung file này vào và bấm "Run" (hoặc Ctrl + Enter).
-- ============================================================================

-- 1. EXTENSIONS & TIỆN ÍCH
create extension if not exists "uuid-ossp";

-- Hàm tự động cập nhật thời gian updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================================
-- 2. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text default '🐕',
  role text not null default 'student' check (role in ('student', 'admin')),
  xp integer not null default 0 check (xp >= 0),
  level text not null default 'Tân Binh Thú Y 🐾',
  streak integer not null default 1 check (streak >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger tự động tạo profile khi có user đăng ký mới từ auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url, role, xp, level, streak)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    '🐕',
    'student',
    0,
    'Tân Binh Thú Y 🐾',
    1
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger cũ nếu có để tránh trùng
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger cập nhật updated_at cho profiles
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- 3. BẢNG DANH MỤC BÀI HỌC (LESSONS)
-- ============================================================================
create table if not exists public.lessons (
  id text primary key,
  title text not null,
  sort_order integer not null default 0,
  published boolean not null default true
);

-- Chèn sẵn 7 bài giảng cơ sở nếu chưa có
insert into public.lessons (id, title, sort_order, published) values
  ('1', 'Sinh Lý Bài Tiết & Giới Thiệu Môn Học', 1, true),
  ('2', 'Sinh Lý Máu & Dịch Thể Gia Súc', 2, true),
  ('3', 'Sinh Lý Tuần Hoàn & Điều Hòa Tim Mạch', 3, true),
  ('4', 'Sinh Lý Hô Hấp Gia Súc & Gia Cầm', 4, true),
  ('5', 'Sinh Lý Cơ - Thần Kinh Động Vật', 5, true),
  ('6', 'Sinh Lý Tiêu Hóa Gia Súc Nhai Lại', 6, true),
  ('7', 'Sinh Lý Nội Tiết & Sinh Sản', 7, true)
on conflict (id) do nothing;

-- ============================================================================
-- 4. TIẾN ĐỘ BÀI HỌC (LESSON_PROGRESS)
-- ============================================================================
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  last_position jsonb not null default '{}'::jsonb,
  started_at timestamptz default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

drop trigger if exists set_lesson_progress_updated_at on public.lesson_progress;
create trigger set_lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- 5. TIẾN ĐỘ FLASHCARD (FLASHCARD_PROGRESS)
-- ============================================================================
create table if not exists public.flashcard_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  is_mastered boolean not null default false,
  review_count integer not null default 0,
  last_reviewed_at timestamptz default now(),
  primary key (user_id, card_id)
);

-- ============================================================================
-- 6. GHI CHÚ CÁ NHÂN TỪNG BÀI (PERSONAL_NOTES)
-- ============================================================================
create table if not exists public.personal_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id),
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

drop trigger if exists set_personal_notes_updated_at on public.personal_notes;
create trigger set_personal_notes_updated_at
  before update on public.personal_notes
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- 7. LỊCH SỬ THI THỬ (QUIZ_ATTEMPTS & QUIZ_ANSWERS)
-- ============================================================================
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_type text not null default 'final_exam',
  session_id text,
  score numeric(5,2) not null default 0,
  total_questions integer not null default 50 check (total_questions >= 0),
  correct_answers integer not null default 0 check (correct_answers >= 0),
  duration_seconds integer default 0,
  passed boolean not null default false,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  check (correct_answers <= total_questions)
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id text not null,
  selected_index integer,
  is_correct boolean,
  unique (attempt_id, question_id)
);

-- ============================================================================
-- 8. BIÊN LAI NHẬP DỮ LIỆU TỪ LOCALSTORAGE (MIGRATION_RECEIPTS)
-- ============================================================================
create table if not exists public.migration_receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_storage_key text not null default 'vet_physiology_progress_v1',
  snapshot_data jsonb not null,
  migrated_at timestamptz not null default now(),
  status text not null default 'success' check (status in ('success', 'failed'))
);

-- ============================================================================
-- 9. CHỈ MỤC TĂNG TỐC ĐỘ TRUY VẤN (INDEXES)
-- ============================================================================
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_flashcard_progress_user on public.flashcard_progress(user_id);
create index if not exists idx_personal_notes_user_lesson on public.personal_notes(user_id, lesson_id);
create index if not exists idx_quiz_attempts_user_date on public.quiz_attempts(user_id, started_at desc);
create index if not exists idx_quiz_answers_attempt on public.quiz_answers(attempt_id);

-- ============================================================================
-- 10. CHÍNH SÁCH BẢO MẬT ROW LEVEL SECURITY (RLS)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.flashcard_progress enable row level security;
alter table public.personal_notes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.migration_receipts enable row level security;

-- 10.1 Policies PROFILES
drop policy if exists "Public read profiles" on public.profiles;
create policy "Public read profiles" on public.profiles for select using (true);

drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid() 
    and role = (select role from public.profiles where id = auth.uid())
  );

-- 10.2 Policies LESSONS
drop policy if exists "Anyone can read published lessons" on public.lessons;
create policy "Anyone can read published lessons" on public.lessons
  for select using (published = true);

-- 10.3 Policies LESSON_PROGRESS
drop policy if exists "Read own lesson progress" on public.lesson_progress;
create policy "Read own lesson progress" on public.lesson_progress
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Insert own lesson progress" on public.lesson_progress;
create policy "Insert own lesson progress" on public.lesson_progress
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Update own lesson progress" on public.lesson_progress;
create policy "Update own lesson progress" on public.lesson_progress
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Delete own lesson progress" on public.lesson_progress;
create policy "Delete own lesson progress" on public.lesson_progress
  for delete to authenticated using (user_id = auth.uid());

-- 10.4 Policies FLASHCARD_PROGRESS
drop policy if exists "Manage own flashcard progress" on public.flashcard_progress;
create policy "Manage own flashcard progress" on public.flashcard_progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 10.5 Policies PERSONAL_NOTES
drop policy if exists "Manage own personal notes" on public.personal_notes;
create policy "Manage own personal notes" on public.personal_notes
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 10.6 Policies QUIZ_ATTEMPTS
drop policy if exists "Manage own quiz attempts" on public.quiz_attempts;
create policy "Manage own quiz attempts" on public.quiz_attempts
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 10.7 Policies QUIZ_ANSWERS
drop policy if exists "Read own quiz answers" on public.quiz_answers;
create policy "Read own quiz answers" on public.quiz_answers
  for select to authenticated using (
    exists (select 1 from public.quiz_attempts a where a.id = quiz_answers.attempt_id and a.user_id = auth.uid())
  );

drop policy if exists "Insert own quiz answers" on public.quiz_answers;
create policy "Insert own quiz answers" on public.quiz_answers
  for insert to authenticated with check (
    exists (select 1 from public.quiz_attempts a where a.id = quiz_answers.attempt_id and a.user_id = auth.uid())
  );

-- 10.8 Policies MIGRATION_RECEIPTS
drop policy if exists "Manage own migration receipts" on public.migration_receipts;
create policy "Manage own migration receipts" on public.migration_receipts
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
