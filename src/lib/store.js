// ===== ชั้นข้อมูลของเว็บ =====
// ข้อมูลเก็บแบบ path เหมือนเดิม: "devils" (ทั้งหมวด) หรือ "devils/<id>" (รายตัว)
// ใช้ตาราง public.nodes ใน Supabase (ดู supabase/schema.sql) + Realtime ให้หน้าเว็บอัปเดตเอง
//
// ตอน dev ถ้าไม่ได้ตั้งค่า Supabase จะใช้ข้อมูลจำลอง dev/fixture.json (เขียนได้ แต่อยู่ในหน่วยความจำเท่านั้น)
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

const topOf = (path) => path.split('/')[0];
const clean = (path) => String(path ?? '').replace(/^\/+|\/+$/g, '');

/** สร้างคีย์ใหม่แบบเดิม (เวลาเป็นมิลลิวินาที) */
export const newId = () => Date.now().toString();

// ---------------------------------------------------------------------------
// listener + แคช: หมวดเดียวโหลดครั้งเดียว แม้หลายส่วนของเว็บจะฟังหมวดเดียวกัน
const subs = new Map(); // top -> Set<cb>
const cache = new Map(); // top -> value
let backend = null;
let ready = null;

export const db = {
    get kind() { return backend?.kind ?? 'none'; },
    get ok() { return !!backend?.ok; },
    /** client ของ Supabase (ใช้ใน auth.js) */
    get client() { return backend?.client ?? null; },
};

export function init() {
    if (!ready) ready = (async () => { backend = await pickBackend(); })();
    return ready;
}

/** ฟังข้อมูลทั้งหมวด: cb(value) ทันทีที่มีข้อมูล และทุกครั้งที่เปลี่ยน */
export function subscribe(top, cb) {
    top = clean(top);
    if (!subs.has(top)) subs.set(top, new Set());
    const set = subs.get(top);
    set.add(cb);
    if (cache.has(top)) queueMicrotask(() => set.has(cb) && cb(cache.get(top)));
    else if (set.size === 1) init().then(() => refresh(top));
    return () => set.delete(cb);
}

async function refresh(top) {
    try {
        const value = await backend.read(top);
        cache.set(top, value);
        subs.get(top)?.forEach((cb) => {
            try { cb(value); } catch (e) { console.error(`[render ${top}]`, e); }
        });
    } catch (e) {
        console.error(`[load ${top}]`, e);
    }
}

const pending = new Map();
function scheduleRefresh(top) {
    if (!subs.has(top)) return;
    clearTimeout(pending.get(top));
    pending.set(top, setTimeout(() => refresh(top), 60));
}

export async function get(path) {
    await init();
    return backend.read(clean(path));
}

export async function set(path, value) {
    await init();
    path = clean(path);
    await backend.write(path, value);
    scheduleRefresh(topOf(path)); // ไม่รอ Realtime — ผู้แก้เห็นผลทันที
}

/** รวมฟิลด์ใหม่เข้ากับข้อมูลเดิม (เหมือน Firebase update) */
export async function update(path, patch) {
    path = clean(path);
    const current = await get(path);
    const base = current && typeof current === 'object' && !Array.isArray(current) ? current : {};
    await set(path, { ...base, ...patch });
}

/** อัปโหลดรูป (Blob) ไปที่ Storage แล้วคืนลิงก์สาธารณะ — ดู lib/upload.js */
export async function uploadFile(blob, filePath) {
    await init();
    return backend.upload(blob, filePath);
}

export async function remove(path) {
    await init();
    path = clean(path);
    await backend.remove(path);
    scheduleRefresh(topOf(path)); // ไม่รอ Realtime — ผู้แก้เห็นผลทันที
}

// ---------------------------------------------------------------------------
async function pickBackend() {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) return supabaseBackend();
    if (import.meta.env.DEV) {
        const fixture = await loadFixture();
        if (fixture) return memoryBackend(fixture);
    }
    console.warn('ยังไม่ได้ตั้งค่า Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
    return memoryBackend({}, false);
}

async function loadFixture() {
    const files = import.meta.glob('../../dev/fixture.json', { import: 'default' });
    const load = Object.values(files)[0];
    return load ? structuredClone(await load()) : null;
}

/** ประกอบแถวของหมวดกลับเป็น object เดียว (แถว "top" = ค่าทั้งก้อน, แถว "top/id" = รายตัว) */
function assemble(top, rows) {
    if (!rows.length) return null;
    let whole = null;
    const children = {};
    let hasChild = false;
    for (const row of rows) {
        if (row.path === top) whole = row.value;
        else { children[row.path.slice(top.length + 1)] = row.value; hasChild = true; }
    }
    if (!hasChild) return whole;
    return whole && typeof whole === 'object' && !Array.isArray(whole) ? { ...whole, ...children } : children;
}

async function supabaseBackend() {
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const T = 'nodes';
    const fail = ({ error }) => { if (error) throw error; };

    client.channel('nodes-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: T }, (payload) => {
            const p = payload.new?.path || payload.old?.path;
            if (p) scheduleRefresh(topOf(p));
        })
        .subscribe();

    return {
        kind: 'supabase', ok: true, client,
        async read(path) {
            if (path.includes('/')) {
                const res = await client.from(T).select('value').eq('path', path).maybeSingle();
                fail(res);
                return res.data ? res.data.value : null;
            }
            const res = await client.from(T).select('path,value').eq('top', path);
            fail(res);
            return assemble(path, res.data || []);
        },
        async write(path, value) {
            if (path.split('/').length > 2) throw new Error('path ลึกเกิน 2 ชั้น: ' + path);
            if (value == null) return this.remove(path);
            if (!path.includes('/')) fail(await client.from(T).delete().eq('top', path).neq('path', path));
            fail(await client.from(T).upsert({ path, value }, { onConflict: 'path' }));
        },
        async remove(path) {
            const q = client.from(T).delete();
            fail(await (path.includes('/') ? q.eq('path', path) : q.eq('top', path)));
        },
        async upload(blob, filePath) {
            const bucket = client.storage.from('images');
            const res = await bucket.upload(filePath, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false });
            fail(res);
            return bucket.getPublicUrl(res.data.path).data.publicUrl;
        },
    };
}

/** เก็บข้อมูลในหน่วยความจำ (ข้อมูลจำลองตอน dev) */
function memoryBackend(data, ok = true) {
    return {
        kind: 'memory', ok, client: null,
        async read(path) {
            const [top, key] = path.split('/');
            const v = key ? data[top]?.[key] : data[top];
            return v === undefined ? null : structuredClone(v);
        },
        async write(path, value) {
            const [top, key] = path.split('/');
            if (key) data[top] = { ...(data[top] || {}), [key]: structuredClone(value) };
            else data[top] = structuredClone(value);
        },
        async remove(path) {
            const [top, key] = path.split('/');
            if (key) { if (data[top]) delete data[top][key]; } else delete data[top];
        },
        // ข้อมูลจำลอง: ไม่ได้อัปโหลดจริง ใช้ลิงก์ชั่วคราวในเบราว์เซอร์แทน
        async upload(blob) { return URL.createObjectURL(blob); },
    };
}
