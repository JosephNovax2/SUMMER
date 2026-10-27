// ===== ธีมตามเทศกาล (ตอนนี้มี Halloween) =====
// เปิด/ปิดที่ config.js (SEASON) — ใส่ <html data-season="..."> ให้ CSS ใน styles/season.css เปลี่ยนสี
// แล้วเติมของตกแต่ง: ค้างคาวบิน, แมงมุมห้อยใย, ใยแมงมุมมุมจอ, หมอกพื้น, ฟักทองข้างโลโก้,
// เมือกเขียวหยดจากหัวเว็บ, ฟักทองแกะสลักมุมจอ, ผีลอย, แม่มดบินผ่านพระจันทร์, ฟ้าแลบ, ประกายตามเมาส์
import { h } from '../lib/dom.js';
import { SEASON, SEASONS } from '../config.js';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SVG = 'http://www.w3.org/2000/svg';
const svg = (tag, attrs, ...kids) => {
    const el = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
    el.append(...kids);
    return el;
};

/** เทศกาลที่ใช้อยู่ตอนนี้ (null = ไม่มี) */
export function currentSeason(now = new Date()) {
    if (SEASON === 'none') return null;
    if (SEASON !== 'auto') return SEASON;
    const md = String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    return Object.keys(SEASONS).find((k) => md >= SEASONS[k].from && md <= SEASONS[k].to) || null;
}

/** ใส่ธีมให้ <html> ทันที (เรียกก่อนสร้างหน้า กันสีเดิมแวบ) */
export function applySeason() {
    const s = currentSeason();
    if (s) document.documentElement.dataset.season = s;
    return s;
}

/** ของตกแต่ง (เรียกหลังสร้างโครงหน้าแล้ว) */
export function decorateSeason() {
    if (document.documentElement.dataset.season !== 'halloween') return;
    pumpkinBrand();
    cobweb();
    slime();
    lanterns();
    if (reduceMotion()) return;
    bats();
    spider();
    fog();
    ghosts();
    witch();
    lightning();
    cursorTrail();
}

// ---------------------------------------------------------------------------
/** เมือกเขียวเรืองแสงหยดจากขอบล่างของแถบหัวเว็บ + หยดเมือกร่วงเป็นระยะ */
function slime() {
    const bar = document.querySelector('.appbar');
    if (!bar) return;
    // ขอบเมือกเป็นคลื่น มีหยดยาวสั้นสุ่มตำแหน่ง (viewBox กว้าง 1200 ยืดเต็มความกว้างจอ)
    const drips = [];
    for (let x = 30; x < 1200; x += 70 + Math.random() * 90) drips.push({ x, len: 8 + Math.random() * 22, w: 10 + Math.random() * 10 });
    let d = 'M0 0 H1200 V6';
    for (let i = drips.length - 1; i >= 0; i--) {
        const { x, len, w } = drips[i];
        d += ` L${(x + w).toFixed(0)} 6 C${(x + w * 0.7).toFixed(0)} 6 ${(x + w * 0.65).toFixed(0)} ${(6 + len).toFixed(0)} ${x.toFixed(0)} ${(6 + len).toFixed(0)}`
            + ` C${(x - w * 0.65).toFixed(0)} ${(6 + len).toFixed(0)} ${(x - w * 0.7).toFixed(0)} 6 ${(x - w).toFixed(0)} 6`;
    }
    d += ' L0 6 Z';
    const el = h('div', { class: 'hw-slime', 'aria-hidden': 'true' },
        svg('svg', { viewBox: '0 0 1200 32', preserveAspectRatio: 'none' }, svg('path', { d })));
    // หยดที่ร่วงลงมาจากปลายหยดยาวๆ
    if (!reduceMotion()) {
        drips.filter((p) => p.len > 18).slice(0, 6).forEach((p, i) => el.append(h('span', {
            class: 'hw-slime__drop',
            style: { left: (p.x / 12).toFixed(2) + '%', top: (6 + p.len) * 0.9 + 'px', '--delay': (i * 1.7 + Math.random() * 2).toFixed(1) + 's' },
        })));
    }
    bar.append(el);
}

/** ฟักทองแกะสลักมุมล่างซ้าย/ขวา หน้าเรืองแสงวูบวาบเหมือนเทียน */
function lanterns() {
    const make = (side) => {
        const s = svg('svg', { viewBox: '0 0 120 112' },
            svg('path', { class: 'hw-lantern__stem', d: 'M55 16 C54 7 60 2 67 3 C63 8 62 12 64 19 Z' }),
            svg('ellipse', { class: 'hw-lantern__b1', cx: 60, cy: 64, rx: 56, ry: 44 }),
            svg('ellipse', { class: 'hw-lantern__b2', cx: 60, cy: 64, rx: 36, ry: 44 }),
            svg('ellipse', { class: 'hw-lantern__b3', cx: 60, cy: 64, rx: 15, ry: 44 }),
            svg('g', { class: 'hw-lantern__face' },
                svg('path', { d: 'M28 52 L43 36 L52 56 Z' }),
                svg('path', { d: 'M92 52 L77 36 L68 56 Z' }),
                svg('path', { d: 'M60 60 L54 71 L66 71 Z' }),
                svg('path', { d: 'M24 76 Q60 108 96 76 L88 80 L82 75 L74 86 L66 77 L58 88 L50 77 L42 86 L36 76 Z' })));
        return h('div', { class: `hw-lantern hw-lantern--${side}`, 'aria-hidden': 'true' }, s);
    };
    document.body.append(make('left'), make('right'));
}

/** ผีโปร่งแสงลอยวนช้าๆ หลังเนื้อหา */
function ghosts() {
    const n = window.innerWidth < 640 ? 2 : 4;
    for (let i = 0; i < n; i++) {
        document.body.append(h('div', {
            class: 'hw-ghost', 'aria-hidden': 'true',
            style: {
                left: (8 + Math.random() * 80).toFixed(0) + 'vw', top: (20 + Math.random() * 55).toFixed(0) + 'vh',
                '--dur': (9 + Math.random() * 7).toFixed(1) + 's', '--delay': (-Math.random() * 10).toFixed(1) + 's',
                '--size': (40 + Math.random() * 34).toFixed(0) + 'px',
            },
        }, svg('svg', { viewBox: '0 0 60 72' },
            svg('path', { d: 'M30 2 C14 2 4 14 4 30 L4 68 L12 60 L20 68 L30 60 L40 68 L48 60 L56 68 L56 30 C56 14 46 2 30 2 Z' }),
            svg('ellipse', { class: 'hw-ghost__eye', cx: 21, cy: 28, rx: 4, ry: 6 }),
            svg('ellipse', { class: 'hw-ghost__eye', cx: 39, cy: 28, rx: 4, ry: 6 }),
            svg('ellipse', { class: 'hw-ghost__eye', cx: 30, cy: 44, rx: 5, ry: 7 }))));
    }
}

/** แม่มดขี่ไม้กวาดบินผ่านพระจันทร์ (วนทุก ~32 วินาที) */
function witch() {
    document.body.append(h('div', { class: 'hw-witch', 'aria-hidden': 'true' },
        svg('svg', { viewBox: '0 0 140 70' },
            svg('path', { d: 'M4 50 L104 38', 'stroke-width': 3.5, stroke: 'currentColor', fill: 'none', 'stroke-linecap': 'round' }),
            svg('path', { d: 'M100 33 L136 22 L132 40 L138 50 L102 44 Z' }),
            svg('path', { d: 'M48 44 C44 34 47 24 55 21 L50 3 L63 18 C70 20 73 27 71 35 L82 42 Z' }),
            svg('path', { d: 'M40 21 L74 17 L72 21 L42 25 Z' }),
            svg('circle', { cx: 60, cy: 26, r: 5 }),
            svg('path', { d: 'M70 30 C80 30 88 36 90 46 L74 42 Z' }))));
}

/** ฟ้าแลบแวบทั้งจอแบบสุ่มทุก 12–28 วินาที */
function lightning() {
    const flash = h('div', { class: 'hw-flash', 'aria-hidden': 'true' });
    document.body.append(flash);
    const next = () => setTimeout(() => {
        if (!document.hidden) {
            flash.classList.remove('is-on');
            void flash.offsetWidth;
            flash.classList.add('is-on');
        }
        next();
    }, 12000 + Math.random() * 16000);
    next();
}

/** ประกายม่วง/เขียว/ส้มตามเมาส์ (เฉพาะอุปกรณ์ที่มีเมาส์) */
function cursorTrail() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const COLORS = ['#c084fc', '#a3e635', '#fb923c'];
    let last = 0;
    window.addEventListener('pointermove', (e) => {
        const t = performance.now();
        if (t - last < 45) return;
        last = t;
        const dot = h('span', {
            class: 'hw-spark', 'aria-hidden': 'true',
            style: { left: e.clientX + 'px', top: e.clientY + 'px', '--c': COLORS[Math.floor(Math.random() * COLORS.length)], '--dx': (Math.random() * 30 - 15).toFixed(0) + 'px' },
        });
        document.body.append(dot);
        dot.addEventListener('animationend', () => dot.remove());
    }, { passive: true });
}

// ---------------------------------------------------------------------------
function pumpkinBrand() {
    document.querySelector('.brand__text strong')?.append(h('span', { class: 'hw-pumpkin', 'aria-hidden': 'true' }, '🎃'));
}

/** ค้างคาวบินผ่านจอเป็นระยะ (เงาดำขอบม่วง กระพือปีก) */
function bats() {
    const layer = h('div', { class: 'hw-bats', 'aria-hidden': 'true' });
    const n = window.innerWidth < 640 ? 3 : 6;
    for (let i = 0; i < n; i++) {
        const wing = 'M32 14 C26 4 14 2 2 8 C8 9 11 12 12 16 C16 13 20 13 23 16 C25 14 28 14 32 18 C36 14 39 14 41 16 C44 13 48 13 52 16 C53 12 56 9 62 8 C50 2 38 4 32 14 Z';
        layer.append(h('span', {
            class: 'hw-bat',
            style: {
                '--y': (6 + Math.random() * 45).toFixed(1) + 'vh',
                '--dur': (14 + Math.random() * 14).toFixed(1) + 's',
                '--delay': (-Math.random() * 28).toFixed(1) + 's',
                '--scale': (0.55 + Math.random() * 0.7).toFixed(2),
                '--bob': (10 + Math.random() * 30).toFixed(0) + 'px',
            },
        }, svg('svg', { viewBox: '0 0 64 24' }, svg('path', { d: wing }), svg('circle', { cx: 32, cy: 14, r: 3 }))));
    }
    document.body.append(layer);
}

/** แมงมุมห้อยใยลงมาจากใต้แถบหัวเว็บ ขยับขึ้นลงช้าๆ */
function spider() {
    const el = h('div', { class: 'hw-spider', 'aria-hidden': 'true' },
        h('span', { class: 'hw-spider__thread' }),
        h('i', { class: 'fa-solid fa-spider hw-spider__body' }));
    document.body.append(el);
}

/** ใยแมงมุมมุมซ้ายบน: เส้นรัศมี + เส้นโค้งเชื่อม */
function cobweb() {
    const g = svg('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': 1 });
    const R = [40, 75, 110, 150, 190];
    const angles = [0, 15, 32, 50, 68, 90].map((a) => (a * Math.PI) / 180);
    for (const a of angles) g.append(svg('line', { x1: 0, y1: 0, x2: Math.cos(a) * 210, y2: Math.sin(a) * 210 }));
    for (const r of R) {
        let d = '';
        angles.forEach((a, i) => {
            const x = Math.cos(a) * r, y = Math.sin(a) * r;
            if (!i) { d += `M${x.toFixed(1)} ${y.toFixed(1)}`; return; }
            // โค้งยุบเข้าหามุมเล็กน้อยเหมือนใยหย่อน
            const m = (angles[i - 1] + a) / 2, rr = r * 0.86;
            d += ` Q${(Math.cos(m) * rr).toFixed(1)} ${(Math.sin(m) * rr).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
        });
        g.append(svg('path', { d }));
    }
    document.body.append(h('div', { class: 'hw-web', 'aria-hidden': 'true' }, svg('svg', { viewBox: '0 0 210 210' }, g)));
}

/** หมอกลอยเรี่ยพื้น 2 ชั้นเลื่อนสวนกัน */
function fog() {
    document.body.append(h('div', { class: 'hw-fog', 'aria-hidden': 'true' }, h('span'), h('span')));
}
