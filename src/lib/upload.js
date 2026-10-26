// ===== อัปโหลดรูป: แปลงเป็น WebP + ย่อขนาดในเบราว์เซอร์ แล้วเก็บที่ Supabase Storage (bucket "images") =====
import { SUPABASE_URL } from '../config.js';
import { uploadFile } from './store.js';

const OWN_PREFIX = SUPABASE_URL ? `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/images/` : null;

/** รูปของเว็บเอง = อยู่ใน Supabase Storage (หรือไฟล์ในเว็บ / ลิงก์ชั่วคราวตอน dev) — ไม่รับลิงก์ภายนอก */
export function isOwnImage(url) {
    const u = String(url ?? '').trim();
    if (!u) return true;
    if (OWN_PREFIX && u.startsWith(OWN_PREFIX)) return true;
    if (/^blob:/i.test(u)) return true;
    return !/^[a-z][a-z0-9+.-]*:/i.test(u) && !u.startsWith('//');
}

const QUALITY = 0.82;

/**
 * แปลงไฟล์รูปเป็น WebP (ย่อให้ด้านยาวไม่เกิน maxSize, ไม่ขยายรูปเล็ก)
 * square=true จะครอปตรงกลางเป็นสี่เหลี่ยมจัตุรัส (ใช้กับไอคอน)
 * @returns {Promise<{blob: Blob, width: number, height: number}>}
 */
export async function toWebp(file, { maxSize = 1600, square = false } = {}) {
    if (!file?.type?.startsWith('image/')) throw new Error('ไฟล์นี้ไม่ใช่รูปภาพ');
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    let sx = 0, sy = 0, sw = bmp.width, sh = bmp.height;
    if (square) {
        const s = Math.min(sw, sh);
        sx = (sw - s) / 2; sy = (sh - s) / 2; sw = sh = s;
    }
    const scale = Math.min(1, maxSize / Math.max(sw, sh));
    const width = Math.max(1, Math.round(sw * scale));
    const height = Math.max(1, Math.round(sh * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, width, height);
    bmp.close?.();
    // เบราว์เซอร์เก่าบางตัวสร้าง WebP ไม่ได้ จะได้ PNG กลับมาแทน
    const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('แปลงรูปไม่สำเร็จ'))), 'image/webp', QUALITY));
    return { blob, width, height };
}

/** แปลง + อัปโหลด คืนลิงก์สาธารณะของรูป */
export async function uploadImage(file, { folder = 'misc', maxSize = 1600, square = false } = {}) {
    const { blob } = await toWebp(file, { maxSize, square });
    const ext = blob.type === 'image/webp' ? 'webp' : 'png';
    const safeFolder = String(folder).replace(/[^a-z0-9_-]/gi, '') || 'misc';
    const name = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    return uploadFile(blob, name);
}
