// ===== หน้าแรก: สรุปทุกอย่างที่ต้องรู้ =====
// ป้ายร้านกาชา (เต็มความกว้าง) / แถบประกาศตัววิ่ง / กิจกรรมรอบถัดไป / บอร์ดราคา / ทางลัดไปทุกหมวด
import { $, h, icon, mount } from '../lib/dom.js';
import { on } from '../lib/bus.js';
import { subscribe } from '../lib/store.js';
import { TABS, currentTab, goTo } from '../ui/router.js';
import { createShopBanner } from './gacha.js';
import { createEcoBoard } from './eco.js';
import { buildSlots, createEventHero, nowSeconds } from './events.js';
import { countUp } from '../ui/effects.js';
import { hasUnread, openMail } from './mail.js';

const fmtDate = (ts) => { try { return ts ? new Date(Number(ts)).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : ''; } catch (e) { return ''; } };

export function initHome() {
    mount($('#panel-home'),
        h('div', { class: 'home-banner' }, createShopBanner()),
        newsTicker(),
        nextEventHero(),
        createEcoBoard(),
        shortcuts());
}

// ---------------------------------------------------------------------------
function nextEventHero() {
    let events = {};
    let slotImages = {};
    let lastMin = -1;
    const hero = createEventHero({
        extra: h('button', { type: 'button', class: 'ev-hero__more', onclick: () => goTo('events') }, 'ดูตารางทั้งวัน ', icon('arrow-right')),
    });
    const render = () => {
        const sec = nowSeconds();
        lastMin = Math.floor(sec / 60);
        hero.show(buildSlots(events), events, slotImages, lastMin);
        hero.tick(sec);
    };
    subscribe('events', (v) => { events = v || {}; render(); });
    subscribe('event_slot_images', (v) => { slotImages = v || {}; render(); });
    setInterval(() => {
        if (currentTab() !== 'home' || document.hidden) return;
        const sec = nowSeconds();
        if (Math.floor(sec / 60) !== lastMin) render(); else hero.tick(sec);
    }, 1000);
    on('tab', (id) => { if (id === 'home') render(); });
    return hero.el;
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

/** แถบประกาศเล็กๆ: ประกาศทุกฉบับวิ่งต่อกันจากขวาไปซ้าย (ชี้ค้าง = หยุด / กด = เปิดหน้าต่างประกาศ) */
function newsTicker() {
    const track = h('div', { class: 'ticker__track' });
    const bar = h('button', { type: 'button', class: 'ticker', onclick: openMail, 'aria-label': 'เปิดประกาศจากทีมงาน' },
        h('span', { class: 'ticker__tag' }, icon('bullhorn'), h('span', { class: 'ticker__tag-text' }, 'ประกาศ'), h('span', { class: 'ticker__new' }, 'ใหม่')),
        h('span', { class: 'ticker__view' }, track),
        h('span', { class: 'ticker__more' }, 'อ่านทั้งหมด ', icon('arrow-right')));
    const paintUnread = (u) => bar.classList.toggle('is-unread', u);
    on('mail-unread', paintUnread);
    subscribe('announcements', (v) => {
        const list = Object.values(v || {}).sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
        paintUnread(hasUnread());
        if (!list.length) { mount(track, h('span', { class: 'ticker__item muted' }, 'ยังไม่มีประกาศ')); track.style.removeProperty('--dur'); return; }
        // เนื้อหาแต่ละฉบับตัดเหลือบรรทัดสั้นๆ (อ่านเต็มได้ในหน้าต่างประกาศ)
        const snippet = (s) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > 120 ? s.slice(0, 120) + '…' : s; };
        const items = () => list.map((d) => h('span', { class: 'ticker__item' },
            h('b', null, d.title || 'ไม่มีหัวข้อ'),
            d.content && h('span', { class: 'ticker__text' }, ' — ' + snippet(d.content)),
            h('small', null, ' · ', timeAgo(d.createdAt))));
        // ใส่ 2 ชุดต่อกันให้วนได้ไม่สะดุด
        mount(track, h('span', { class: 'ticker__set' }, items()), h('span', { class: 'ticker__set', 'aria-hidden': 'true' }, items()));
    });
    // ความเร็วคงที่ ~70px/วินาที ไม่ว่าข้อความจะยาวแค่ไหน (วัดใหม่เมื่อขนาดเปลี่ยน / ตอนแท็บหน้าแรกเปิด)
    new ResizeObserver(() => {
        const w = track.firstChild?.offsetWidth || 0;
        if (w) track.style.setProperty('--dur', Math.max(10, Math.round(w / 70)) + 's');
    }).observe(track);
    return bar;
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
