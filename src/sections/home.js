// ===== หน้าแรก: สรุปทุกอย่างที่ต้องรู้ =====
// ป้ายร้านกาชา + กิจกรรมรอบถัดไป + ประกาศล่าสุด / บอร์ดราคา / ทางลัดไปทุกหมวด
import { $, h, icon, mount } from '../lib/dom.js';
import { on } from '../lib/bus.js';
import { subscribe } from '../lib/store.js';
import { TABS, currentTab, goTo } from '../ui/router.js';
import { createShopBanner } from './gacha.js';
import { createEcoBoard } from './eco.js';
import { buildSlots, colorOf, fmtCd, nextSlot, nowSeconds, setTick } from './events.js';
import { countUp } from '../ui/effects.js';
import { hasUnread, openMail } from './mail.js';

const fmtDate = (ts) => { try { return ts ? new Date(Number(ts)).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : ''; } catch (e) { return ''; } };

export function initHome() {
    mount($('#panel-home'),
        h('div', { class: 'home-hero' },
            h('div', { class: 'home-hero__banner' }, createShopBanner()),
            h('div', { class: 'home-hero__side' }, nextEventCard(), latestNewsCard())),
        createEcoBoard(),
        shortcuts());
}

// ---------------------------------------------------------------------------
function nextEventCard() {
    let slots = [];
    const body = h('div', { class: 'mini-card__body' }, h('span', { class: 'muted' }, 'กำลังโหลด...'));
    const card = h('button', { type: 'button', class: 'mini-card', dataset: { tone: 'amber' }, onclick: () => goTo('events') },
        h('span', { class: 'mini-card__label' }, h('span', { class: 'ev-pulse' }), h('span', { class: 'mini-card__label-text' }, 'กิจกรรมรอบถัดไป')),
        body,
        h('span', { class: 'mini-card__more' }, 'ดูตารางทั้งวัน ', icon('arrow-right')));

    // ค่าที่ tick ทุกวินาทีใช้ (ตั้งใหม่ทุกครั้งที่ render)
    let cur = null;
    let lastMin = -1;
    const count = h('span', { class: 'next-ev__count' });
    const bar = h('span');

    const render = () => {
        const sec = nowSeconds();
        lastMin = Math.floor(sec / 60);
        const n = nextSlot(slots, lastMin);
        card.querySelector('.mini-card__label-text').textContent = n ? n.label : 'กิจกรรมรอบถัดไป';
        cur = null;
        card.classList.remove('is-soon', 'is-live');
        if (!n) { mount(body, h('span', { class: 'muted' }, 'ยังไม่มีข้อมูลกิจกรรม')); return; }
        // แถบความคืบหน้า: จากรอบก่อนหน้า -> รอบถัดไป (กำลังเริ่ม = เต็ม)
        const idx = slots.indexOf(n.slot);
        const prev = idx > 0 ? slots[idx - 1].mins : (slots[slots.length - 1]?.mins ?? 0) - 1440;
        cur = { live: n.live, start: n.slot.mins * 60, target: (n.slot.mins + (n.tomorrow ? 1440 : 0)) * 60, prev: prev * 60 };
        const after = slots.length > 1 ? slots[(idx + 1) % slots.length] : null;
        count.classList.toggle('is-live', n.live);
        mount(body,
            h('div', { class: 'next-ev__row' },
                h('b', { class: 'next-ev__time' }, n.slot.t),
                count),
            h('div', { class: 'next-ev__names' }, n.slot.items.map((i, k) => h('span', { class: 'ev-chip ev-chip--sm', style: { '--c': colorOf(i.key), '--i': k } }, i.name))),
            h('div', { class: ['next-ev__bar', n.live && 'is-live'], role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': 'ใกล้ถึงรอบถัดไป' }, bar),
            after && h('div', { class: 'next-ev__after' }, icon('forward'), ' ต่อจากนั้น ', h('b', null, after.t), ' · ', after.items.map((i) => i.name).join(', ')));
        tick();
    };

    const tick = () => {
        const sec = nowSeconds();
        if (Math.floor(sec / 60) !== lastMin) { render(); return; }
        if (!cur) return;
        if (cur.live) {
            setTick(count, 'เริ่มมา ' + fmtCd(sec - cur.start));
            bar.style.width = '100%';
        } else {
            let left = cur.target - sec;
            if (left < 0) left += 86400;
            setTick(count, 'อีก ' + fmtCd(left));
            const pct = Math.max(0, Math.min(100, ((sec - cur.prev) / Math.max(1, cur.target - cur.prev)) * 100));
            bar.style.width = pct.toFixed(2) + '%';
            bar.parentElement?.setAttribute('aria-valuenow', Math.round(pct));
            card.classList.toggle('is-soon', left <= 300);
        }
        card.classList.toggle('is-live', cur.live);
    };

    subscribe('events', (v) => { slots = buildSlots(v); render(); });
    setInterval(() => { if (currentTab() === 'home' && !document.hidden) tick(); }, 1000);
    on('tab', (id) => { if (id === 'home') render(); });
    return card;
}

/** "เมื่อสักครู่" / "3 ชม. ที่แล้ว" / "2 วันที่แล้ว" (เกิน 30 วันแสดงวันที่) */
function timeAgo(ts) {
    const s = (Date.now() - Number(ts)) / 1000;
    if (!ts || !(s >= 0)) return fmtDate(ts);
    if (s < 60) return 'เมื่อสักครู่';
    if (s < 3600) return Math.floor(s / 60) + ' นาทีที่แล้ว';
    if (s < 86400) return Math.floor(s / 3600) + ' ชม. ที่แล้ว';
    if (s < 86400 * 30) return Math.floor(s / 86400) + ' วันที่แล้ว';
    return fmtDate(ts);
}

function latestNewsCard() {
    const body = h('div', { class: 'mini-card__body' }, h('span', { class: 'muted' }, 'กำลังโหลด...'));
    const total = h('span', { class: 'news__total' });
    const card = h('button', { type: 'button', class: 'mini-card news-card', dataset: { tone: 'orange' }, onclick: openMail },
        h('span', { class: 'news-card__bg', 'aria-hidden': 'true' }, icon('bullhorn')),
        h('span', { class: 'mini-card__label' },
            h('span', { class: 'news-card__icon' }, icon('bullhorn')), 'ประกาศล่าสุดจากทีมงาน',
            h('span', { class: 'news-card__new' }, 'ใหม่')),
        body,
        h('span', { class: 'mini-card__more' }, 'อ่านประกาศทั้งหมด ', total, icon('arrow-right')));
    const paintUnread = (u) => card.classList.toggle('is-unread', u);
    on('mail-unread', paintUnread);
    subscribe('announcements', (v) => {
        const list = Object.values(v || {}).sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
        total.textContent = list.length > 1 ? `(${list.length}) ` : '';
        paintUnread(hasUnread());
        if (!list.length) { mount(body, h('span', { class: 'muted' }, 'ยังไม่มีประกาศ')); return; }
        const d = list[0];
        mount(body,
            h('b', { class: 'news__title clamp-2' }, d.title || 'ไม่มีหัวข้อ'),
            d.content && h('p', { class: 'news__excerpt clamp-2' }, d.content),
            h('small', { class: 'news__time', title: fmtDate(d.createdAt) }, icon('clock', 'regular'), ' ', timeAgo(d.createdAt)));
    });
    return card;
}

function shortcuts() {
    const cards = TABS.filter((t) => t.id !== 'home').map((t) => {
        const count = h('span', { class: 'shortcut__count' });
        if (t.path) subscribe(t.path, (v) => {
            const n = Object.keys(v || {}).length;
            if (n) countUp(count, n, { format: (x) => `${x} รายการ` }); else count.textContent = '';
        });
        return h('a', {
            href: '#' + t.id, class: 'shortcut',
            onclick: (e) => { e.preventDefault(); goTo(t.id); },
        },
            h('span', { class: 'shortcut__icon' }, icon(t.icon)),
            h('span', { class: 'shortcut__text' }, h('b', null, t.label), h('small', null, t.desc)),
            count);
    });
    return h('section', { class: 'home-section' },
        h('h2', { class: 'home-section__title' }, icon('compass'), 'ไปที่หมวดต่างๆ'),
        h('div', { class: 'shortcuts' }, cards));
}
