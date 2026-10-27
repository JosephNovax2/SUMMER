// ===== ตัวช่วยสร้าง DOM =====
// h() สร้าง element จริง ข้อความทุกตัวใส่เป็น text node — ไม่มี innerHTML กับข้อมูลจากฐานข้อมูล จึงกัน XSS ได้ในตัว
import { REPO_IMAGE_PATTERN } from '../config.js';

const PLACEHOLDER = 'img-placeholder.svg';

export function h(tag, props, ...children) {
    const el = document.createElement(tag);
    if (props) {
        for (const [key, value] of Object.entries(props)) {
            if (value == null || value === false) continue;
            if (key === 'class') el.className = Array.isArray(value) ? value.filter(Boolean).join(' ') : value;
            else if (key === 'style' && typeof value === 'object') {
                // ตัวแปร CSS (--x) ต้องใช้ setProperty, Object.assign ใส่ไม่ติด
                for (const [k, v] of Object.entries(value)) k.startsWith('--') ? el.style.setProperty(k, v) : (el.style[k] = v);
            }
            else if (key === 'dataset') Object.assign(el.dataset, value);
            else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
            else if (key === 'value' || key === 'checked' || key === 'selected') el[key] = value;
            else el.setAttribute(key, value === true ? '' : value);
        }
    }
    append(el, children);
    return el;
}

function append(el, children) {
    for (const child of children) {
        if (child == null || child === false || child === true) continue;
        if (Array.isArray(child)) append(el, child);
        else el.append(child instanceof Node ? child : String(child));
    }
}

/** แทนที่ลูกทั้งหมดของ el */
export function mount(el, ...children) {
    el.replaceChildren();
    append(el, children);
    return el;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** ไอคอน Font Awesome: icon('fire') / icon('discord', 'brands') */
export function icon(name, style = 'solid', extra = '') {
    return h('i', { class: `fa-${style} fa-${name}${extra ? ' ' + extra : ''}`, 'aria-hidden': 'true' });
}

/** ลิงก์รูปที่อยู่ใน repo นี้ -> path ในเว็บเอง */
export function localImg(url) {
    const u = String(url ?? '').trim();
    const m = u.match(REPO_IMAGE_PATTERN);
    return m ? m[1] : u;
}

/** รับเฉพาะ http(s), data:image หรือ path ในเว็บ — อย่างอื่น (เช่น javascript:) คืนค่าว่าง */
export function safeUrl(url) {
    const u = localImg(url);
    if (!u) return '';
    if (/^(https?:)?\/\//i.test(u) || /^data:image\//i.test(u) || /^blob:/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return '';
    return u;
}

/** <img> ที่ลองโหลดซ้ำเมื่อพลาด แล้วค่อยใช้รูปสำรอง */
export function img(src, props = {}, { fallback = PLACEHOLDER, retries = 2 } = {}) {
    const url = safeUrl(src);
    const el = h('img', { loading: 'lazy', decoding: 'async', alt: '', ...props });
    let tries = 0;
    el.addEventListener('error', () => {
        if (tries < retries && url) {
            tries++;
            setTimeout(() => { el.src = url + (url.includes('?') ? '&' : '?') + '_r=' + tries; }, 400 * tries);
        } else if (fallback && !el.src.endsWith(fallback)) {
            el.src = fallback;
        }
    });
    el.src = url || fallback || '';
    return el;
}

/** สีจากข้อมูล: รับเฉพาะ hex */
export function safeColor(c, fallback = '#f97316') {
    const s = String(c ?? '').trim();
    return /^#[0-9a-f]{3,8}$/i.test(s) ? s : fallback;
}

export function hexToRgb(hex) {
    let s = safeColor(hex).slice(1);
    if (s.length === 3) s = s.split('').map((c) => c + c).join('');
    const n = parseInt(s.slice(0, 6), 16);
    return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
