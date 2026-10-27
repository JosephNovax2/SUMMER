// ===== ย้ายรูปทั้งหมดในฐานข้อมูลไปไว้ที่ Supabase Storage (WebP) =====
// 1) อ่านข้อมูลทุกแถวในตาราง nodes แล้วหาลิงก์รูปทั้งหมด (ลิงก์นอก, ลิงก์ repo บน jsDelivr, data:image)
// 2) โหลดรูป -> ย่อ + แปลงเป็น WebP -> อัปโหลดเข้า bucket "images" โฟลเดอร์ migrated/<หมวด>/
// 3) เปลี่ยนลิงก์ในข้อมูลให้ชี้ไปที่ Supabase
//
// ใช้:   npm run migrate:images -- --dry-run     (ลองโหลด+แปลงอย่างเดียว ไม่เขียนอะไร ไม่ต้องล็อกอิน)
//        npm run migrate:images                  (ทำจริง — จะถาม username/password แอดมินในเทอร์มินัล)
// รันซ้ำได้: รูปที่ย้ายแล้วจะถูกข้าม / ชื่อไฟล์มาจาก hash ของลิงก์เดิม
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const DRY = process.argv.includes('--dry-run');
const BUCKET = 'images';
const CONCURRENCY = 4;
const MAX_SIZE = { gacha_banner: 1920, event_slot_images: 2400, calc_icons: 256 };
const REPO = /^https?:\/\/(?:cdn\.jsdelivr\.net\/gh\/JosephNovax2\/SUMMER@main|raw\.githubusercontent\.com\/JosephNovax2\/SUMMER\/(?:refs\/heads\/)?main)\/([^?#]+)/i;

// ---------- ค่าเชื่อมต่อจาก .env / .env.local ----------
function loadEnv() {
    const env = {};
    for (const f of ['.env', '.env.local']) {
        if (!fs.existsSync(f)) continue;
        for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
            const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
            if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
    }
    return env;
}
const env = loadEnv();
const URL_ = env.VITE_SUPABASE_URL, KEY = env.VITE_SUPABASE_ANON_KEY;
if (!URL_ || !KEY) { console.error('ไม่พบ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ใน .env'); process.exit(1); }
const sb = createClient(URL_, KEY, { auth: { persistSession: false } });
const OWN_PREFIX = `${URL_.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/`;

// ---------- ถามรหัสผ่านแบบไม่แสดงตัวอักษร ----------
function ask(question, hidden = false) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
        if (hidden) rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
        rl.question(question, (a) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(a.trim()); });
    });
}

async function login() {
    const user = (await ask('Username แอดมิน (เช่น summer_admin): ')).toLowerCase();
    const pass = await ask('Password: ', true);
    const email = user === 'summer_admin' ? 'admin@summercity.app' : `${user}@summercity.app`;
    const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
    if (error) { console.error('ล็อกอินไม่สำเร็จ:', error.message); process.exit(1); }
    const role = await sb.from('user_roles').select('role').eq('user_id', data.user.id).maybeSingle();
    if (role.data?.role !== 'ADMIN') { console.error('บัญชีนี้ไม่มียศ ADMIN (ดูท้ายไฟล์ schema.sql)'); process.exit(1); }
    console.log('✓ ล็อกอินเป็นแอดมินแล้ว\n');
}

// ---------- หาลิงก์รูปในข้อมูล ----------
const isImageRef = (s) => /^data:image\//i.test(s)
    || (/^https?:\/\//i.test(s) && !s.startsWith(OWN_PREFIX))
    || (/^[^/:]+\.(png|jpe?g|webp|gif)$/i.test(s)); // ชื่อไฟล์ใน repo เช่น "tomato.png"

function collect(value, top, found) {
    if (typeof value === 'string') {
        const s = value.trim();
        if (isImageRef(s) && (/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(s) || /^data:image\//i.test(s) || /i\.postimg\.cc|ik\.imagekit\.io|pic\.in\.th/i.test(s))) {
            if (!found.has(s)) found.set(s, top);
        }
    } else if (Array.isArray(value)) value.forEach((v) => collect(v, top, found));
    else if (value && typeof value === 'object') Object.values(value).forEach((v) => collect(v, top, found));
}

function replaceAll(value, map) {
    if (typeof value === 'string') return map.get(value.trim()) ?? value;
    if (Array.isArray(value)) return value.map((v) => replaceAll(v, map));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceAll(v, map)]));
    return value;
}

// ---------- โหลดรูป ----------
async function fetchBytes(src) {
    if (/^data:image\//i.test(src)) return Buffer.from(src.split(',')[1], 'base64');
    const repo = src.match(REPO);
    const local = repo ? decodeURIComponent(repo[1]) : (/^https?:/i.test(src) ? null : src);
    if (local) {
        const p = path.join('public', local);
        if (fs.existsSync(p)) return fs.readFileSync(p);
    }
    let lastErr;
    for (let i = 0; i < 3; i++) {
        try {
            const ctrl = AbortSignal.timeout(30000);
            const res = await fetch(src, { signal: ctrl, headers: { 'User-Agent': 'Mozilla/5.0 (SUMMER-CITY image migration)' } });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return Buffer.from(await res.arrayBuffer());
        } catch (e) { lastErr = e; await new Promise((r) => setTimeout(r, 800 * (i + 1))); }
    }
    throw lastErr;
}

async function toWebp(buf, top) {
    const max = MAX_SIZE[top] || 1600;
    return sharp(buf, { animated: false, failOn: 'none' })
        .rotate()
        .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toBuffer();
}

async function pool(items, worker) {
    let i = 0;
    await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (i < items.length) { const idx = i++; await worker(items[idx], idx); } }));
}

// ---------- main ----------
console.log(DRY ? '=== ทดลอง (dry run) — ไม่เขียนอะไรลง Supabase ===\n' : '=== ย้ายรูปไป Supabase Storage ===\n');
if (!DRY) await login();

const { data: rows, error } = await sb.from('nodes').select('path,top,value');
if (error) { console.error('อ่านข้อมูลไม่ได้:', error.message); process.exit(1); }

const found = new Map();
rows.forEach((r) => collect(r.value, r.top, found));
const list = [...found.entries()];
console.log(`พบรูปที่ต้องย้าย ${list.length} รูป\n`);

const map = new Map();
const failed = [];
let bytesIn = 0, bytesOut = 0, done = 0;

await pool(list, async ([src, top]) => {
    try {
        const raw = await fetchBytes(src);
        const webp = await toWebp(raw, top);
        bytesIn += raw.length; bytesOut += webp.length;
        const name = `migrated/${top}/${crypto.createHash('sha1').update(src).digest('hex').slice(0, 16)}.webp`;
        if (!DRY) {
            // ไม่ใช้ upsert (ต้องมีสิทธิ์ SELECT/UPDATE เพิ่ม) — ชื่อไฟล์มาจาก hash ของลิงก์ ถ้ามีอยู่แล้วคือรูปเดียวกัน ข้ามได้
            const up = await sb.storage.from(BUCKET).upload(name, webp, { contentType: 'image/webp', cacheControl: '31536000', upsert: false });
            const exists = up.error && (String(up.error.statusCode) === '409' || /already exists|Duplicate/i.test(up.error.message));
            if (up.error && !exists) throw up.error;
            map.set(src, sb.storage.from(BUCKET).getPublicUrl(name).data.publicUrl);
        }
        done++;
        process.stdout.write(`\r  ${done}/${list.length} รูป`);
    } catch (e) {
        failed.push({ src, top, error: String(e.message || e) });
    }
});
process.stdout.write('\n\n');
console.log(`ขนาดรวม: ${(bytesIn / 1048576).toFixed(1)} MB -> ${(bytesOut / 1048576).toFixed(1)} MB (WebP)`);

if (!DRY && map.size) {
    let changed = 0;
    for (const r of rows) {
        const next = replaceAll(r.value, map);
        if (JSON.stringify(next) === JSON.stringify(r.value)) continue;
        const { error: e } = await sb.from('nodes').upsert({ path: r.path, value: next }, { onConflict: 'path' });
        if (e) { console.error(`  อัปเดต ${r.path} ไม่สำเร็จ:`, e.message); continue; }
        changed++;
    }
    console.log(`อัปเดตลิงก์ในข้อมูลแล้ว ${changed} แถว`);
    fs.mkdirSync('dev', { recursive: true });
    fs.writeFileSync('dev/migrated-images.json', JSON.stringify(Object.fromEntries(map), null, 1));
    console.log('บันทึกรายการลิงก์เดิม -> ลิงก์ใหม่ไว้ที่ dev/migrated-images.json');
}

if (failed.length) {
    console.log(`\n⚠ ย้ายไม่สำเร็จ ${failed.length} รูป (ลิงก์เดิมยังอยู่ แก้แล้วรันใหม่ได้):`);
    failed.forEach((f) => console.log(`  [${f.top}] ${f.src.slice(0, 90)} — ${f.error}`));
} else {
    console.log(`\n✓ ${DRY ? 'โหลดและแปลงได้ครบ' : 'ย้ายครบ'} ${done} รูป`);
}
// ออกเฉพาะ session ของสคริปต์นี้ — ไม่เตะแอดมินที่ล็อกอินอยู่ในเบราว์เซอร์ออกไปด้วย
if (!DRY) await sb.auth.signOut({ scope: 'local' });
