// ===== ลูกเล่นเล็กๆ ทั่วเว็บ =====
// - แถบหมวด: แคปซูลไฮไลต์เลื่อนตามแท็บที่เลือก
// - การ์ด: เอียงตามเมาส์ + แสงไล่ตามเมาส์ (เฉพาะอุปกรณ์ที่มีเมาส์)
// - ปุ่ม: คลื่นตอนกด (ripple)
// - ปุ่มกลับขึ้นบนสุด
// - ประกายไฟลอยในพื้นหลัง
// - ตัวเลขนับขึ้น (countUp)
// ทุกอย่างปิดเองเมื่อผู้ใช้ตั้งค่า "ลดการเคลื่อนไหว"
import { $, h, icon } from '../lib/dom.js';
import { on } from '../lib/bus.js';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasMouse = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initEffects() {
    tabPill();
    cardTilt();
    ripple();
    backToTop();
    embers();
}

// ---------------------------------------------------------------------------
function tabPill() {
    const list = $('#tabbar-list');
    if (!list) return;
    const pill = h('span', { class: 'tabs__pill', 'aria-hidden': 'true' });
    list.prepend(pill);
    const move = (instant = false) => {
        const active = list.querySelector('.tab.is-active');
        if (!active) { pill.style.opacity = '0'; return; }
        if (instant) pill.style.transition = 'none';
        pill.style.opacity = '1';
        pill.style.width = active.offsetWidth + 'px';
        pill.style.transform = `translateX(${active.offsetLeft}px)`;
        if (instant) requestAnimationFrame(() => { pill.style.transition = ''; });
    };
    on('tab', () => move());
    // ตำแหน่งแท็บเปลี่ยนได้หลายสาเหตุ (ย่อ/ขยายจอ, ฟอนต์โหลดเสร็จ, ล็อกอินแล้วแถบแอดมินโผล่จนพื้นที่แท็บแคบลง)
    // จึงคอยดูขนาดของแถบและแท็บทุกตัวโดยตรง แล้วจัดแคปซูลใหม่ทันที
    let queued = false;
    const relayout = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; move(true); }); };
    if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(relayout);
        ro.observe(list);
        list.querySelectorAll('.tab').forEach((t) => ro.observe(t));
    }
    window.addEventListener('resize', relayout);
    on('user', relayout);
    document.fonts?.ready.then(relayout);
    relayout();
}

// ---------------------------------------------------------------------------
const TILT_SELECTOR = '.info-card:not(.is-zoomed), .job-card, .product:not(.is-zoomed), .shortcut, .mini-card';

function cardTilt() {
    let current = null;
    const reset = (el) => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); el.classList.remove('is-tilting'); };
    document.addEventListener('pointermove', (e) => {
        if (!hasMouse() || reduceMotion()) return;
        const el = e.target.closest?.(TILT_SELECTOR);
        if (current && current !== el) { reset(current); current = null; }
        if (!el) return;
        current = el;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const strength = el.matches('.shortcut, .mini-card') ? 3 : 6;
        el.classList.add('is-tilting');
        el.style.setProperty('--ry', ((x - 0.5) * strength).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * strength).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (current) reset(current); current = null; });
}

// ---------------------------------------------------------------------------
function ripple() {
    document.addEventListener('pointerdown', (e) => {
        if (reduceMotion()) return;
        const el = e.target.closest?.('.btn, .tab, .segmented__btn, .shop__tab, .discord-btn');
        if (!el || el.disabled) return;
        const r = el.getBoundingClientRect();
        const size = Math.max(r.width, r.height) * 1.6;
        const dot = h('span', { class: 'ripple', style: { width: size + 'px', height: size + 'px', left: e.clientX - r.left - size / 2 + 'px', top: e.clientY - r.top - size / 2 + 'px' } });
        el.append(dot);
        dot.addEventListener('animationend', () => dot.remove());
    }, { passive: true });
}

// ---------------------------------------------------------------------------
function backToTop() {
    const btn = h('button', { type: 'button', class: 'to-top', 'aria-label': 'กลับขึ้นบนสุด', onclick: () => window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' }) }, icon('arrow-up'));
    document.body.append(btn);
    // ซ่อนตอนเลื่อนถึงท้ายเว็บแล้ว (ไม่ให้ทับข้อความใน footer)
    let atBottom = false;
    const bottom = document.querySelector('.footer');
    if (bottom && 'IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => { atBottom = en.isIntersecting; update(); }).observe(bottom);
    }
    let ticking = false;
    const update = () => { btn.classList.toggle('is-visible', window.scrollY > 700 && !atBottom); ticking = false; };
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive: true });
}

// ---------------------------------------------------------------------------
function embers() {
    if (reduceMotion()) return;
    const layer = h('div', { class: 'embers', 'aria-hidden': 'true' });
    const count = window.innerWidth < 640 ? 10 : 18;
    for (let i = 0; i < count; i++) {
        layer.append(h('span', {
            style: {
                left: Math.random() * 100 + '%',
                '--size': (2 + Math.random() * 3).toFixed(1) + 'px',
                '--dur': (9 + Math.random() * 10).toFixed(1) + 's',
                '--delay': (-Math.random() * 18).toFixed(1) + 's',
                '--drift': (Math.random() * 80 - 40).toFixed(0) + 'px',
                '--alpha': (0.25 + Math.random() * 0.45).toFixed(2),
            },
        }));
    }
    document.querySelector('.bg-scene')?.after(layer);
}

// ---------------------------------------------------------------------------
/** ตัวเลขนับขึ้นจาก 0 (หรือค่าเดิม) ไปถึง target */
export function countUp(el, target, { duration = 900, format = (n) => n.toLocaleString('th-TH') } = {}) {
    const from = Number(el.dataset.value || 0);
    el.dataset.value = String(target);
    if (reduceMotion() || from === target) { el.textContent = format(target); return; }
    const t0 = performance.now();
    const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const v = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
        el.textContent = format(v);
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
