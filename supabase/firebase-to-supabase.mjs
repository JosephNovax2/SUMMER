// แปลงไฟล์ Export JSON จาก Firebase Realtime Database -> supabase/seed.sql
// ใช้: node supabase/firebase-to-supabase.mjs "<ไฟล์ export.json>"
// โหนด users/ (มีรหัสผ่าน) จะถูกข้ามเสมอ ไม่ย้ายไป Supabase
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// หมวดที่เก็บเป็นรายตัว (path = "หมวด/คีย์") ให้ตรงกับที่หน้าเว็บเขียนข้อมูล
const COLLECTIONS = new Set([
    'announcements', 'devils', 'eco_list', 'event_slot_images', 'events', 'fashions',
    'foods', 'gacha_categories', 'gacha_items', 'items', 'jobs', 'runes', 'site_config',
]);
const SKIP = new Set(['users', 'roles']);

const input = process.argv[2];
if (!input) {
    console.error('usage: node supabase/firebase-to-supabase.mjs <firebase-export.json>');
    process.exit(1);
}
const data = JSON.parse(fs.readFileSync(input, 'utf8'));

const rows = [];
for (const [top, value] of Object.entries(data)) {
    if (SKIP.has(top) || value === null) continue;
    if (COLLECTIONS.has(top) && value && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, child] of Object.entries(value)) {
            if (child !== null) rows.push([`${top}/${key}`, child]);
        }
    } else {
        rows.push([top, value]);
    }
}

const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;
const lines = [
    '-- สร้างจาก Firebase export โดย supabase/firebase-to-supabase.mjs (ไม่มีโหนด users)',
    '-- รันใน SQL Editor หลังจากรัน schema.sql แล้ว',
    'begin;',
    ...rows.map(([p, v]) =>
        `insert into public.nodes (path, value) values (${lit(p)}, ${lit(JSON.stringify(v))}::jsonb)\n` +
        `    on conflict (path) do update set value = excluded.value;`),
    'commit;',
    '',
];

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed.sql');
fs.writeFileSync(out, lines.join('\n'));
console.log(`wrote ${rows.length} rows -> ${out}`);
