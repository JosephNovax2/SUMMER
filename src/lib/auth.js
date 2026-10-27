// ===== เข้าสู่ระบบแอดมิน =====
// ผู้เล่นทั่วไปไม่ต้องล็อกอิน / แอดมินล็อกอินผ่าน Supabase Auth ด้วยอีเมล <username>@summercity.app
// ยศอ่านจากตาราง user_roles (อ่านได้เฉพาะยศของตัวเอง) — ไม่มีรหัสผ่านอยู่ในฐานข้อมูลของเว็บ
import { ADMIN_EMAIL, ADMIN_USERNAME, EMAIL_DOMAIN } from '../config.js';
import { db, init } from './store.js';
import { setUser, state } from './bus.js';

const GUEST = { username: 'ผู้เล่น', role: 'USER' };

function emailFor(username) {
    const u = username.trim().toLowerCase();
    if (u === ADMIN_USERNAME) return ADMIN_EMAIL;
    if (!/^[a-z0-9._-]+$/.test(u)) return null;
    return `${u}@${EMAIL_DOMAIN}`;
}

function displayName(email) {
    if (email === ADMIN_EMAIL) return 'Admin_Summer';
    return email.split('@')[0];
}

async function roleOf(userId) {
    const { data, error } = await db.client.from('user_roles').select('role').eq('user_id', userId).maybeSingle();
    if (error) { console.warn('อ่านยศไม่สำเร็จ', error); return 'USER'; }
    return data?.role || 'USER';
}

/** ลบ session ที่เก็บไว้ในเครื่อง (ใช้เมื่อเซิร์ฟเวอร์ยกเลิก session ไปแล้ว แต่ในเครื่องยังค้าง) */
function clearStoredSession() {
    try {
        Object.keys(localStorage).filter((k) => /^sb-.+-auth-token/.test(k)).forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* ignore */ }
}

/** เริ่มต้น: ถ้าเคยล็อกอินไว้ (Supabase จำ session) ให้กลับเป็นแอดมิน — แต่ตรวจกับเซิร์ฟเวอร์ก่อนว่า session ยังใช้ได้จริง */
export async function restoreSession() {
    await init();
    setUser(GUEST);
    if (db.kind !== 'supabase') return;
    const { data } = await db.client.auth.getSession();
    if (data.session) {
        const { data: check, error } = await db.client.auth.getUser();
        if (error || !check?.user) {
            // ถูกออกจากระบบไปแล้ว (เช่น ออกจากทุกเครื่อง / เปลี่ยนรหัสผ่าน) — ไม่คืนสิทธิ์แอดมิน
            clearStoredSession();
            await db.client.auth.signOut({ scope: 'local' }).catch(() => {});
        } else {
            setUser({ username: displayName(check.user.email), role: await roleOf(check.user.id) });
        }
    }
    // session หมดอายุ หรือออกจากระบบในแท็บอื่น -> กลับเป็นผู้เล่นทั่วไปทันที
    db.client.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_OUT' || !session) && state.isAdmin) setUser(GUEST);
    });
}

/** คืนค่า true เมื่อสำเร็จ */
export async function login(username, password) {
    await init();
    if (db.kind === 'memory') {
        // ข้อมูลจำลองตอน dev เท่านั้น: ล็อกอินอะไรก็ได้เป็นแอดมิน เพื่อทดสอบหน้าแก้ไข
        if (!import.meta.env.DEV) return false;
        setUser({ username: username || 'dev', role: 'ADMIN' });
        return true;
    }
    const email = emailFor(username);
    if (!email || !password) return false;
    const { data, error } = await db.client.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    setUser({ username: displayName(data.user.email), role: await roleOf(data.user.id) });
    return true;
}

export async function logout() {
    setUser(GUEST);
    if (db.kind !== 'supabase') return;
    const { error } = await db.client.auth.signOut().catch((e) => ({ error: e }));
    if (error) {
        // เซิร์ฟเวอร์ยกเลิก session ไปก่อนแล้ว Supabase จะไม่ลบ session ในเครื่องให้เอง
        // -> ลบเองแล้วโหลดหน้าใหม่ ให้ไม่มีอะไรค้างในหน่วยความจำ
        console.warn('signOut:', error.message);
        clearStoredSession();
        location.reload();
    }
}
