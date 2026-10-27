-- =====================================================================
-- SUMMER CITY SS2 Guide Book — Supabase schema
-- รันไฟล์นี้ครั้งเดียวใน Supabase Dashboard > SQL Editor
-- (รันซ้ำได้ ไม่ทำข้อมูลหาย)
-- =====================================================================

-- ---------- ข้อมูลเว็บ: เก็บเป็น path แบบเดียวกับ Firebase ----------
-- path = "devils" (ค่าเดี่ยว) หรือ "devils/1781817273323" (ข้อมูลรายตัวในหมวด)
create table if not exists public.nodes (
    path        text primary key check (path ~ '^[^/]+(/[^/]+)?$'),
    top         text generated always as (split_part(path, '/', 1)) stored,
    value       jsonb not null,
    updated_at  timestamptz not null default now()
);
create index if not exists nodes_top_idx on public.nodes (top);

create or replace function public.nodes_touch() returns trigger
language plpgsql as $$
begin
    new.updated_at := now();
    return new;
end $$;

drop trigger if exists nodes_touch on public.nodes;
create trigger nodes_touch before update on public.nodes
    for each row execute function public.nodes_touch();

-- ---------- ยศผู้ใช้ (แทน users/ เดิม — ไม่มีรหัสผ่านในตารางนี้) ----------
create table if not exists public.user_roles (
    user_id  uuid primary key references auth.users (id) on delete cascade,
    role     text not null default 'USER' check (role in ('USER', 'ADMIN'))
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
    select exists (
        select 1 from public.user_roles
        where user_id = auth.uid() and role = 'ADMIN'
    );
$$;

-- ---------- สิทธิ์ (RLS) ----------
alter table public.nodes      enable row level security;
alter table public.user_roles enable row level security;

drop policy if exists "nodes: everyone can read"  on public.nodes;
drop policy if exists "nodes: admin can insert"   on public.nodes;
drop policy if exists "nodes: admin can update"   on public.nodes;
drop policy if exists "nodes: admin can delete"   on public.nodes;
drop policy if exists "roles: read own role"      on public.user_roles;

create policy "nodes: everyone can read" on public.nodes
    for select using (true);
create policy "nodes: admin can insert" on public.nodes
    for insert to authenticated with check (public.is_admin());
create policy "nodes: admin can update" on public.nodes
    for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "nodes: admin can delete" on public.nodes
    for delete to authenticated using (public.is_admin());

-- อ่านได้เฉพาะยศของตัวเอง / ไม่มี policy เขียน = แก้ยศได้จาก SQL Editor เท่านั้น
create policy "roles: read own role" on public.user_roles
    for select to authenticated using (user_id = auth.uid());

grant select on public.nodes to anon, authenticated;
grant insert, update, delete on public.nodes to authenticated;
grant select on public.user_roles to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Realtime: แอดมินแก้แล้วหน้าเว็บผู้เล่นเปลี่ยนทันที ----------
do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nodes'
    ) then
        alter publication supabase_realtime add table public.nodes;
    end if;
end $$;

-- =====================================================================
-- หลังสร้างบัญชีแอดมินใน Authentication > Users แล้ว ให้รันบรรทัดนี้
-- (เปลี่ยนอีเมลให้ตรงกับที่สร้าง)
--
-- insert into public.user_roles (user_id, role)
-- select id, 'ADMIN' from auth.users where email = 'admin@summercity.app'
-- on conflict (user_id) do update set role = excluded.role;
-- =====================================================================
