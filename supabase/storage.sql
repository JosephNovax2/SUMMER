-- =====================================================================
-- ที่เก็บรูปภาพ (Supabase Storage) — รันใน SQL Editor ครั้งเดียว (รันซ้ำได้)
-- ต้องรัน schema.sql มาก่อน (ใช้ฟังก์ชัน public.is_admin())
--
-- bucket "images": ทุกคนดูรูปได้ / อัปโหลด แก้ ลบ ได้เฉพาะแอดมิน
-- เว็บแปลงรูปเป็น WebP และย่อขนาดก่อนอัปโหลดเสมอ (PNG เฉพาะเบราว์เซอร์เก่าที่สร้าง WebP ไม่ได้)
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 5242880, array['image/webp', 'image/png'])
on conflict (id) do update
    set public = excluded.public,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "images: admin can upload" on storage.objects;
drop policy if exists "images: admin can update" on storage.objects;
drop policy if exists "images: admin can delete" on storage.objects;

create policy "images: admin can upload" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'images' and public.is_admin());

create policy "images: admin can update" on storage.objects
    for update to authenticated
    using (bucket_id = 'images' and public.is_admin())
    with check (bucket_id = 'images' and public.is_admin());

create policy "images: admin can delete" on storage.objects
    for delete to authenticated
    using (bucket_id = 'images' and public.is_admin());
