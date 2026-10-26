# SUMMER CITY SS2 — Guide Book

คู่มือผู้เล่นใหม่ของเซิร์ฟเวอร์ SUMMER CITY SS2: งานฟาร์ม, บอร์ดราคากลาง, ผลไม้ปีศาจ, แฟชั่น, รูน, ไอเทม, อาหาร, เวลากิจกรรม, เมนูปุ่ม G, ร้านกาชา และประกาศจากทีมงาน

สร้างด้วย **Vite + JavaScript** (ไม่มี framework) ข้อมูลอยู่ใน **Supabase** (อัปเดตเรียลไทม์)

## เริ่มใช้งานในเครื่อง

```bash
npm install
cp .env.example .env.local   # ใส่ VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY
npm run dev
```

ยังไม่มี Supabase? สร้างข้อมูลจำลองจากไฟล์ export ของ Firebase แล้ว `npm run dev` ได้เลย
(ตอนใช้ข้อมูลจำลอง กดรูปพระอาทิตย์แล้วล็อกอินอะไรก็ได้เพื่อทดสอบหน้าแอดมิน — ข้อมูลไม่ถูกบันทึกจริง)

```bash
npm run seed:fixture -- "path/to/firebase-export.json"
```

## ตั้งค่า Supabase (ครั้งเดียว)

1. สร้างโปรเจกต์ที่ supabase.com (Region: Singapore)
2. SQL Editor → รัน [`supabase/schema.sql`](supabase/schema.sql), [`supabase/seed.sql`](supabase/seed.sql) และ [`supabase/storage.sql`](supabase/storage.sql) (ที่เก็บรูป)
3. Authentication → Users → สร้าง `admin@summercity.app` (ตั้งรหัสผ่านเอง)
4. SQL Editor → รันคำสั่งให้ยศ ADMIN ที่ท้ายไฟล์ `schema.sql`
5. ล็อกอินบนเว็บด้วยชื่อผู้ใช้ `summer_admin` + รหัสผ่านที่ตั้งไว้

แอดมินคนอื่น: สร้างบัญชี `<ชื่อผู้ใช้>@summercity.app` แล้วเพิ่มแถวใน `user_roles` เป็น `ADMIN`
(ชื่อผู้ใช้ใช้ได้เฉพาะ a–z, 0–9, `.` `_` `-`)

## Deploy (GitHub Pages)

push ขึ้น `main` แล้ว GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) จะ build และ deploy ให้เอง

ตั้งค่าครั้งแรกบน GitHub:
- **Settings → Pages → Source:** `GitHub Actions`
- **Settings → Secrets and variables → Actions → Variables:** เพิ่ม `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY`

> anon key เป็นคีย์สาธารณะ อยู่ในหน้าเว็บได้ สิทธิ์จริงคุมด้วย RLS ใน Supabase — **ห้ามใส่ service_role key ที่ไหนเด็ดขาด**

## โครงสร้าง

```
index.html            โครงหน้า (เมนูข้าง, หัวเว็บ, คัทซีน, ช่องของแต่ละหมวด)
public/               รูปภาพ (เสิร์ฟตรงตามชื่อไฟล์)
src/
  main.js             จุดเริ่มต้น
  config.js           ค่าตั้งต้น (ลิงก์, อีเมลแอดมิน, เวลาคัทซีน)
  lib/                dom (สร้าง HTML แบบกัน XSS), store (ข้อมูล), auth, sound, bus (สถานะกลาง)
  ui/                 modal, dialog/toast, form (ฟอร์มแอดมิน), layout, router (#แท็บ), cutscene, lightbox, reveal
  sections/           แต่ละหมวด — collection.js คือแม่แบบของหมวดการ์ด
  styles/             tokens (สี/ขนาด), base, layout, components, sections
supabase/             schema.sql, seed.sql, สคริปต์แปลงข้อมูลจาก Firebase
docs/FEATURES.md      เช็กลิสต์ฟีเจอร์ทั้งหมด
legacy/               เว็บเวอร์ชันเดิม (ไว้อ้างอิง — ลบได้หลังย้ายเสร็จ)
```

### เพิ่มหมวดการ์ดใหม่

ใช้ `createCollection()` ใน [`src/sections/collection.js`](src/sections/collection.js) — ดูตัวอย่างใน [`src/sections/cards.js`](src/sections/cards.js)
แค่ประกาศ path ในฐานข้อมูล, หน้าตาการ์ด (`view`) และช่องกรอก (`fields`) แล้วเพิ่มแท็บใน `src/ui/router.js` + `<section>` ใน `index.html`

### รูปภาพ

ทุกช่องลิงก์รูปในฟอร์มแอดมินมีปุ่ม **อัปโหลด** (หรือลากไฟล์มาวาง / วางรูปจากคลิปบอร์ด)
เว็บจะย่อรูป (ด้านยาวไม่เกิน 1600px, ป้ายร้าน 1920px, ไอคอนเครื่องคำนวณ 256px) แปลงเป็น **WebP**
แล้วเก็บที่ Supabase Storage bucket `images` จากนั้นใส่ลิงก์ให้อัตโนมัติ — ดู [`src/lib/upload.js`](src/lib/upload.js)

### รูปแบบข้อมูล

ทุกอย่างอยู่ในตาราง `nodes` (คอลัมน์ `path`, `value`) แบบเดียวกับ Firebase เดิม:
`devils/<id>`, `fashions/<id>`, `jobs/<id>`, `eco_list/<id>`, `events/<id>`, `gacha_items/<id>`, ... และค่าเดี่ยว `gkey`, `gacha_banner`, `eco_time`, `eco_golden`, `calc_icons`
