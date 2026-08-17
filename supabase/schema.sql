-- ============================================================
-- TradeLearn — Supabase 建表 SQL（第一阶段：基础架构）
-- 在 Supabase Dashboard → SQL Editor 中整体执行。
-- 说明：当前无登录系统，user_id 用匿名设备 ID 充当；
--       接 Auth 后把 RLS policy 收紧为 auth.uid() = user_id。
-- ============================================================

-- 1) 卡片/知识点复习进度（核心：熟练度 + 上次/下次复习 + 复习次数 + 薄弱项）
create table if not exists public.card_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  module_id text not null,
  concept_id text not null,
  status text not null default 'new'
    check (status in ('new', 'learning', 'familiar', 'mastered')),
  last_reviewed timestamptz,
  next_review_at timestamptz,
  review_count integer not null default 0,
  interval_ms bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint card_progress_user_module_concept_key unique (user_id, module_id, concept_id)
);

create index if not exists card_progress_user_idx on public.card_progress (user_id);
create index if not exists card_progress_module_idx on public.card_progress (module_id);

-- 2) 实战会话（每次完成的实战，含薄弱术语代码）
create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  score integer not null default 0,
  total integer not null default 0,
  mistake_term_codes text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists practice_sessions_user_idx on public.practice_sessions (user_id);

-- 3) 实战答题记录（每题一次）
create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  question_id text not null,
  selected_index integer not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists practice_attempts_user_idx on public.practice_attempts (user_id);

-- 4) Row Level Security
alter table public.card_progress      enable row level security;
alter table public.practice_sessions  enable row level security;
alter table public.practice_attempts  enable row level security;

-- 无登录阶段：只允许匿名客户端写入/更新，不开放读取。
-- 当前页面仍以 localStorage 为读取主源；接 Auth 后把下面策略改为 auth.uid() = user_id。
drop policy if exists "anon all pre-auth" on public.card_progress;
drop policy if exists "anon insert card progress" on public.card_progress;
drop policy if exists "anon update card progress" on public.card_progress;
create policy "anon insert card progress" on public.card_progress
  for insert to anon with check (true);
create policy "anon update card progress" on public.card_progress
  for update to anon using (true) with check (true);

drop policy if exists "anon all pre-auth" on public.practice_sessions;
drop policy if exists "anon insert practice sessions" on public.practice_sessions;
create policy "anon insert practice sessions" on public.practice_sessions
  for insert to anon with check (true);

drop policy if exists "anon all pre-auth" on public.practice_attempts;
drop policy if exists "anon insert practice attempts" on public.practice_attempts;
create policy "anon insert practice attempts" on public.practice_attempts
  for insert to anon with check (true);
