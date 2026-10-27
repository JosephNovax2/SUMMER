/*
 * ===== ตัวกลางฐานข้อมูลของเว็บ (Firebase หรือ Supabase) =====
 * หน้าเว็บเรียกใช้ฟังก์ชันชื่อเดิมแบบ Firebase (ref / get / set / update / remove / onValue
 * / signInWithEmailAndPassword / signOut) ไฟล์นี้จะส่งต่อไปยังฐานข้อมูลที่เลือกไว้ใน SC_CONFIG
 *
 * สลับไป Supabase: ใส่ supabaseUrl + supabaseAnonKey แล้วเปลี่ยน backend เป็น 'supabase'
 * (anon key เป็นคีย์สาธารณะ ใส่ในหน้าเว็บได้ — ห้ามใส่ service_role key เด็ดขาด)
 */
export const SC_CONFIG = {
    backend: 'firebase',            // 'firebase' | 'supabase'
    supabaseUrl: '',                // เช่น https://xxxxxxxx.supabase.co
    supabaseAnonKey: '',
    firebase: {
        apiKey: "AIzaSyDRMwSLQHZOfzAo8MwXsH4bBcO5cLiGSvQ",
        authDomain: "summer-city-6ddec.firebaseapp.com",
        databaseURL: "https://summer-city-6ddec-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "summer-city-6ddec",
        storageBucket: "summer-city-6ddec.firebasestorage.app",
        messagingSenderId: "278037090920",
        appId: "1:278037090920:web:0d6e75fcc521537aece1dd"
    }
};

const snap = (v) => ({ val: () => (v === undefined ? null : v), exists: () => v !== null && v !== undefined });

// ทุก listener ถูกจดไว้ เพื่อให้ replayListeners() วาดหน้าใหม่จากข้อมูลล่าสุดได้ (เช่น ตอนแอดมินล็อกอิน)
// โดยไม่ต้องสมัคร listener ซ้ำ
const listeners = [];
function track(path, cb) {
    const entry = { path, cb, last: undefined, has: false };
    listeners.push(entry);
    return entry;
}
function emit(entry, value) {
    entry.last = value; entry.has = true;
    try { entry.cb(snap(value)); } catch (e) { console.error('listener error @' + entry.path, e); }
}
export function replayListeners() {
    listeners.forEach((l) => { if (l.has) emit(l, l.last); });
}

let impl;

if (SC_CONFIG.backend === 'supabase') {
    impl = await createSupabaseBackend();
} else {
    impl = await createFirebaseBackend();
}

export const ok = impl.ok;
export const backend = SC_CONFIG.backend;
export const db = impl.db;
export const auth = impl.auth;
export const ref = (_db, path) => ({ path: String(path || '').replace(/^\/+|\/+$/g, '') });
export const get = (r) => impl.get(r.path);
export const set = (r, value) => impl.set(r.path, value);
export const update = (r, patch) => impl.update(r.path, patch);
export const remove = (r) => impl.remove(r.path);
export function onValue(r, cb) { return impl.onValue(r.path, track(r.path, cb)); }
export const signInWithEmailAndPassword = (_auth, email, password) => impl.signIn(email, password);
export const signOut = () => impl.signOut();

// ให้สคริปต์ธรรมดา (ไม่ใช่ module) ใช้ร่วมได้ เช่น เครื่องคำนวณรถโล
window.SCDB = { ok, backend, db, ref, get, set, update, remove, onValue, replayListeners };
window.dispatchEvent(new Event('scdb-ready'));

// ---------------------------------------------------------------------------
async function createFirebaseBackend() {
    try {
        const V = 'https://www.gstatic.com/firebasejs/10.8.0/';
        const [A, D, U] = await Promise.all([
            import(V + 'firebase-app.js'), import(V + 'firebase-database.js'), import(V + 'firebase-auth.js'),
        ]);
        const app = A.getApps().length ? A.getApp() : A.initializeApp(SC_CONFIG.firebase);
        const fdb = D.getDatabase(app);
        const fauth = U.getAuth(app);
        const R = (p) => D.ref(fdb, p);
        return {
            ok: true, db: fdb, auth: fauth,
            get: (p) => D.get(R(p)),
            set: (p, v) => D.set(R(p), v),
            update: (p, v) => D.update(R(p), v),
            remove: (p) => D.remove(R(p)),
            onValue: (p, entry) => D.onValue(R(p), (s) => emit(entry, s.val())),
            signIn: (e, pw) => U.signInWithEmailAndPassword(fauth, e, pw),
            signOut: () => U.signOut(fauth),
        };
    } catch (e) {
        console.warn('Firebase fallback active.', e);
        return offlineBackend();
    }
}

// ---------------------------------------------------------------------------
async function createSupabaseBackend() {
    if (!SC_CONFIG.supabaseUrl || !SC_CONFIG.supabaseAnonKey) {
        console.warn('Supabase config missing.');
        return offlineBackend();
    }
    let sb;
    try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm');
        sb = createClient(SC_CONFIG.supabaseUrl, SC_CONFIG.supabaseAnonKey);
    } catch (e) {
        console.warn('Supabase fallback active.', e);
        return offlineBackend();
    }
    const T = 'nodes';
    const topOf = (p) => p.split('/')[0];
    const depthOk = (p) => p && p.split('/').length <= 2;
    const fail = (error) => { if (error) throw error; };

    async function read(p) {
        if (topOf(p) === 'roles') {
            // roles/<uid> -> ตาราง user_roles (RLS ให้อ่านได้เฉพาะของตัวเอง)
            const uid = p.split('/')[1];
            const { data, error } = await sb.from('user_roles').select('role').eq('user_id', uid).maybeSingle();
            fail(error);
            return data ? data.role : null;
        }
        if (p.includes('/')) {
            const { data, error } = await sb.from(T).select('value').eq('path', p).maybeSingle();
            fail(error);
            return data ? data.value : null;
        }
        const { data, error } = await sb.from(T).select('path,value').eq('top', p);
        fail(error);
        if (!data || !data.length) return null;
        let whole = null; const children = {}; let hasChild = false;
        data.forEach((row) => {
            if (row.path === p) whole = row.value;
            else { children[row.path.slice(p.length + 1)] = row.value; hasChild = true; }
        });
        if (!hasChild) return whole;
        return (whole && typeof whole === 'object' && !Array.isArray(whole)) ? Object.assign({}, whole, children) : children;
    }

    async function write(p, value) {
        if (!depthOk(p)) throw new Error('Unsupported path: ' + p);
        if (value === null || value === undefined) return removeP(p);
        if (!p.includes('/')) {
            const { error: e1 } = await sb.from(T).delete().eq('top', p).neq('path', p);
            fail(e1);
        }
        const { error } = await sb.from(T).upsert({ path: p, value }, { onConflict: 'path' });
        fail(error);
    }

    async function patch(p, obj) {
        if (!p.includes('/')) {
            for (const [k, v] of Object.entries(obj || {})) await write(p + '/' + k, v);
            return;
        }
        const cur = await read(p);
        const base = (cur && typeof cur === 'object' && !Array.isArray(cur)) ? cur : {};
        const next = Object.assign({}, base, obj);
        Object.keys(next).forEach((k) => { if (next[k] === null) delete next[k]; });
        await write(p, next);
    }

    async function removeP(p) {
        const q = p.includes('/') ? sb.from(T).delete().eq('path', p) : sb.from(T).delete().eq('top', p);
        const { error } = await q;
        fail(error);
    }

    // Realtime: แถวไหนเปลี่ยน -> โหลดหมวดนั้นใหม่แล้วส่งให้ listener ที่ฟังหมวดนั้นอยู่
    const subs = new Map(); // top -> Set(entry)
    const pending = new Map();
    function refresh(top) {
        clearTimeout(pending.get(top));
        pending.set(top, setTimeout(async () => {
            const set_ = subs.get(top); if (!set_) return;
            const entries = [...set_];
            const byPath = new Map();
            for (const en of entries) {
                if (!byPath.has(en.path)) byPath.set(en.path, read(en.path).catch((e) => { console.warn(e); return undefined; }));
            }
            for (const en of entries) {
                const v = await byPath.get(en.path);
                if (v !== undefined) emit(en, v);
            }
        }, 60));
    }
    sb.channel('sc-nodes')
        .on('postgres_changes', { event: '*', schema: 'public', table: T }, (payload) => {
            const p = (payload.new && payload.new.path) || (payload.old && payload.old.path);
            if (p) refresh(topOf(p));
        })
        .subscribe();

    return {
        ok: true, db: sb, auth: sb.auth,
        get: async (p) => snap(await read(p)),
        set: write,
        update: patch,
        remove: removeP,
        onValue: (p, entry) => {
            const top = topOf(p);
            if (!subs.has(top)) subs.set(top, new Set());
            subs.get(top).add(entry);
            read(p).then((v) => emit(entry, v)).catch((e) => console.error('load ' + p, e));
            return () => subs.get(top).delete(entry);
        },
        signIn: async (email, password) => {
            const { data, error } = await sb.auth.signInWithPassword({ email, password });
            fail(error);
            return { user: { uid: data.user.id, email: data.user.email } };
        },
        signOut: () => sb.auth.signOut(),
    };
}

function offlineBackend() {
    const no = () => Promise.reject(new Error('database offline'));
    return { ok: false, db: null, auth: null, get: no, set: no, update: no, remove: no, onValue: () => () => {}, signIn: no, signOut: () => Promise.resolve() };
}
