// ===== เวลากิจกรรม (ไทม์ไลน์ตามเวลาไทย) =====
// events/<id> = { name, time: "00:00 / 01:00 ...", detail, image }
// event_slot_images/<HHMM> = [url, ...]  รูปประจำช่วงเวลา (แสดงบนการ์ดรอบถัดไป หมุนทุก 5 วิ)
import { $, h, icon, img, mount, safeUrl } from '../lib/dom.js';
import { on, state } from '../lib/bus.js';
import { newId, remove, set, subscribe } from '../lib/store.js';
import { openModal } from '../ui/modal.js';
import { openFormModal, userError } from '../ui/form.js';
import { confirmDialog, toast } from '../ui/dialog.js';
import { currentTab } from '../ui/router.js';
import { loading } from './collection.js';

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#06b6d4'];
const PERIODS = [
    { name: 'ช่วงดึก (00:00–05:59)', icon: 'moon', from: 0, to: 360 },
    { name: 'ช่วงเช้า (06:00–11:59)', icon: 'sun', from: 360, to: 720 },
    { name: 'ช่วงบ่าย (12:00–17:59)', icon: 'cloud-sun', from: 720, to: 1080 },
    { name: 'ช่วงค่ำ (18:00–23:59)', icon: 'star', from: 1080, to: 1440 },
];
const LIVE_MINUTES = 10;

/** ดึงเวลาทุกรูปแบบ HH:MM / H.MM ออกจากข้อความ */
export function parseTimes(raw) {
    const re = /(?<!\d)([01]?\d|2[0-3])[:.]([0-5]\d)(?!\d)/g;
    const out = new Set();
    let m;
    while ((m = re.exec(String(raw || ''))) !== null) out.add(m[1].padStart(2, '0') + ':' + m[2]);
    return [...out].sort();
}

function nowMinutes() {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    return (parseInt(p.find((x) => x.type === 'hour').value, 10) % 24) * 60 + parseInt(p.find((x) => x.type === 'minute').value, 10);
}
const toMin = (t) => parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(3), 10);
const pad = (n) => String(n).padStart(2, '0');
function colorOf(key) { let x = 0; for (const c of String(key)) x = (x * 31 + c.charCodeAt(0)) >>> 0; return COLORS[x % COLORS.length]; }
const countdown = (mins, now) => { const d = mins - now, hh = Math.floor(d / 60), mm = d % 60; return 'อีก ' + (hh ? hh + ' ชม. ' : '') + (mm || !hh ? mm + ' นาที' : ''); };

export function initEvents() {
    let events = {};
    let slotImages = {};

    const heroLabel = h('span', null, 'รอบถัดไป');
    const heroBody = h('div', { class: 'ev-hero__body' });
    const heroImgs = h('div', { class: 'ev-hero__imgs', hidden: true });
    const clock = h('span', null, '--:--');
    const list = h('div', { class: 'ev-list' }, loading('กิจกรรม'));

    mount($('#panel-events'),
        h('header', { class: 'section-head', dataset: { tone: 'amber' } },
            h('h2', null, icon('hourglass-half'), 'เวลากิจกรรม'),
            h('div', { class: 'section-head__actions admin-only' },
                h('button', { type: 'button', class: 'btn btn--ghost', onclick: copyAsText }, icon('copy', 'regular'), 'คัดลอกเป็นข้อความ'),
                h('button', { type: 'button', class: 'btn btn--ghost', onclick: openImport }, icon('file-import'), 'นำเข้าจากข้อความ'),
                h('button', { type: 'button', class: 'btn btn--primary', onclick: () => edit() }, icon('plus'), 'เพิ่มกิจกรรม'))),
        h('div', { class: 'ev-hero' },
            h('div', { class: 'ev-hero__main' }, h('div', { class: 'ev-hero__label' }, h('span', { class: 'ev-pulse' }), heroLabel), heroBody),
            heroImgs,
            h('div', { class: 'ev-hero__clock' }, h('span', { class: 'ev-hero__clock-label' }, icon('clock', 'regular'), ' เวลาไทยตอนนี้'), h('b', null, clock, h('small', null, ' น.')))),
        list);

    subscribe('events', (v) => { events = v || {}; render(); });
    subscribe('event_slot_images', (v) => { slotImages = v || {}; render(); });
    setInterval(() => { if (currentTab() === 'events') render(); }, 30000);
    on('tab', (id) => { if (id === 'events') render(); });
    on('user', render);

    let slideTimer = null;
    let lastSig = '';

    function slots() {
        const map = {};
        for (const [key, d] of Object.entries(events)) {
            for (const t of parseTimes(d.time)) (map[t] ||= []).push({ key, name: d.name || 'ไม่มีชื่อ' });
        }
        return Object.keys(map).sort().map((t) => ({ t, mins: toMin(t), items: map[t] }));
    }

    const chip = (it, small) => h(small ? 'span' : 'button', {
        type: small ? null : 'button', class: ['ev-chip', small && 'ev-chip--sm'],
        style: { '--c': colorOf(it.key) }, onclick: small ? null : () => openInfo(it.key),
    }, it.name);

    function render() {
        const all = slots();
        const now = nowMinutes();
        clock.textContent = pad(Math.floor(now / 60)) + ':' + pad(now % 60);

        const live = all.filter((s) => s.mins <= now && now - s.mins < LIVE_MINUTES).pop();
        const upcoming = all.find((s) => s.mins > now);
        const target = live || upcoming || all[0];
        if (!target) {
            heroLabel.textContent = 'รอบถัดไป';
            mount(heroBody, h('span', { class: 'muted' }, 'ยังไม่มีข้อมูลกิจกรรม'));
        } else {
            heroLabel.textContent = live ? 'กำลังเริ่มตอนนี้' : upcoming ? 'รอบถัดไป' : 'รอบแรกของพรุ่งนี้';
            const cd = live ? `เริ่มมา ${now - live.mins} นาที` : countdown(target.mins + (upcoming ? 0 : 1440), now);
            mount(heroBody, h('span', { class: 'ev-hero__time' }, target.t), h('span', { class: 'ev-hero__count' }, cd),
                h('div', { class: 'ev-hero__names' }, target.items.map((i) => chip(i, true))));
        }

        // รูปของช่วงเวลา: เปลี่ยนเฉพาะตอนรายการรูปเปลี่ยน
        const urls = target ? (slotImages[target.t.replace(':', '')] || []).filter((u) => safeUrl(u)) : [];
        const sig = urls.join('|');
        if (sig !== lastSig) {
            lastSig = sig;
            clearInterval(slideTimer);
            mount(heroImgs, urls.map((u, i) => h('div', { class: ['ev-slide', i === 0 && 'is-on'] }, img(u, { referrerpolicy: 'no-referrer' }))));
            heroImgs.hidden = !urls.length;
            if (urls.length > 1) {
                slideTimer = setInterval(() => {
                    const s = [...heroImgs.children];
                    const cur = s.findIndex((x) => x.classList.contains('is-on'));
                    s[cur]?.classList.remove('is-on');
                    s[(cur + 1) % s.length]?.classList.add('is-on');
                }, 5000);
            }
        }

        if (!all.length) {
            mount(list, h('div', { class: 'empty-state' }, icon('calendar-days'), 'ยังไม่มีข้อมูลกิจกรรม', state.isAdmin ? ' — กด "เพิ่มกิจกรรม" หรือ "นำเข้าจากข้อความ"' : ''));
            return;
        }
        const nextMins = upcoming ? upcoming.mins : null;
        mount(list, PERIODS.map((p) => {
            const rows = all.filter((s) => s.mins >= p.from && s.mins < p.to);
            if (!rows.length) return null;
            return h('section', { class: 'ev-period' },
                h('h3', { class: 'ev-period__head' }, icon(p.icon), p.name),
                rows.map((s) => {
                    const isLive = s.mins <= now && now - s.mins < LIVE_MINUTES;
                    const cls = isLive ? 'is-live' : s.mins === nextMins ? 'is-next' : s.mins < now ? 'is-past' : '';
                    const status = isLive ? 'กำลังเริ่ม' : s.mins < now ? 'ผ่านไปแล้ว' : countdown(s.mins, now);
                    const nImg = (slotImages[s.t.replace(':', '')] || []).length;
                    return h('div', { class: ['ev-row', cls] },
                        h('span', { class: 'ev-row__time' }, s.t),
                        h('div', { class: 'ev-row__chips' }, s.items.map((i) => chip(i, false))),
                        h('button', { type: 'button', class: ['btn btn--ghost btn--sm ev-row__img admin-only', nImg && 'has-img'], onclick: () => editSlotImages(s.t) },
                            icon('image', 'regular'), nImg ? `${nImg} รูป` : 'เพิ่มรูป'),
                        h('span', { class: 'ev-row__status' }, status));
                }));
        }));
    }

    function openInfo(key) {
        const d = events[key];
        if (!d) return;
        const times = parseTimes(d.time);
        let url = safeUrl(d.image);
        if (!url) for (const t of times) { const f = (slotImages[t.replace(':', '')] || []).find((u) => safeUrl(u)); if (f) { url = f; break; } }
        const m = openModal({
            bare: true,
            body: h('article', { class: 'ev-info', style: { '--c': colorOf(key) } },
                h('div', { class: 'ev-info__hero' },
                    url ? img(url, { alt: '' }) : h('span', { class: 'ev-info__ph' }, icon('calendar-days')),
                    h('button', { type: 'button', class: 'icon-btn ev-info__close', 'aria-label': 'ปิด', onclick: () => m.close() }, icon('xmark'))),
                h('div', { class: 'ev-info__body' },
                    h('h2', null, d.name || ''),
                    h('section', { class: 'detail-section' }, h('h3', null, icon('clock', 'regular'), 'เวลาจัดกิจกรรม'),
                        h('div', { class: 'ev-info__times' }, times.length ? times.map((t) => h('span', { class: 'ev-time' }, t)) : h('span', { class: 'muted' }, d.time || '-'))),
                    h('section', { class: 'detail-section' }, h('h3', null, icon('circle-info'), 'รายละเอียด'),
                        h('p', { class: 'detail-text pre-line scroll-y ev-info__detail' }, d.detail || 'ยังไม่มีรายละเอียด')),
                    h('div', { class: 'info-card__admin admin-only' },
                        h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: () => { m.close(); edit(key); } }, icon('pen-to-square'), 'แก้ไข'),
                        h('button', { type: 'button', class: 'btn btn--danger btn--sm', onclick: () => { m.close(); del(key); } }, icon('trash'), 'ลบ')))),
        });
    }

    function edit(key) {
        openFormModal({
            title: key ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่', icon: 'calendar-plus', tone: 'amber', folder: 'events',
            values: key ? events[key] : {},
            fields: [
                { name: 'name', label: 'ชื่อกิจกรรม', required: true, autofocus: true, placeholder: 'เช่น กิจกรรมแข่งรถ / ล่าสมบัติ' },
                { name: 'time', label: 'เวลาที่กิจกรรมเกิดขึ้น (ระบุทุกช่วงเวลา)', placeholder: 'เช่น 00:00 / 01:00 / 02:30 (ใส่ทุกรอบ คั่นด้วย /)' },
                { name: 'image', label: 'รูปกิจกรรม (แสดงด้านบนของการ์ด ไม่บังคับ)', type: 'url', preview: true },
                { name: 'detail', label: 'รายละเอียดกิจกรรม (ใครเล่นได้บ้าง / เงื่อนไขต่างๆ)', type: 'textarea', rows: 5 },
            ],
            onSubmit: (v) => set(`events/${key || newId()}`, v),
        });
    }

    async function del(key) {
        if (!await confirmDialog(`ต้องการลบกิจกรรม "${events[key]?.name || ''}" ถาวร?`, { danger: true, okText: 'ลบ' })) return;
        await remove(`events/${key}`).then(() => toast('ลบแล้ว', 'info'), () => toast('ลบไม่สำเร็จ', 'error'));
    }

    function editSlotImages(t) {
        const key = t.replace(':', '');
        openFormModal({
            title: `รูปประกอบเวลา ${t} น.`, icon: 'images', tone: 'amber', folder: 'events',
            values: { urls: slotImages[key] || [] },
            fields: [{
                name: 'urls', label: 'รูปประกอบช่วงเวลานี้', type: 'list', itemType: 'url', addLabel: 'เพิ่มรูป', maxSize: 2400,
                                help: 'รูปจะแสดงบนการ์ดรอบถัดไปเมื่อใกล้ถึงหรือกำลังอยู่ในช่วงเวลานี้ หลายรูปจะสลับทุก 5 วินาที — แนะนำรูปแนวยาว 6:1 (2400×400 px)',
            }],
            onSubmit: ({ urls }) => {
                const list = urls.filter((x) => /^(https?|blob):/i.test(x));
                return list.length ? set(`event_slot_images/${key}`, list) : remove(`event_slot_images/${key}`);
            },
        });
    }

    async function copyAsText() {
        const all = slots();
        if (!all.length) { toast('ยังไม่มีข้อมูลกิจกรรมให้คัดลอก', 'info'); return; }
        const text = 'ตารางเวลากิจกรรม (เวลาไทย)\n' + all.map((s) => s.t + ' ' + s.items.map((i) => i.name).join(', ')).join('\n');
        try { await navigator.clipboard.writeText(text); toast('คัดลอกตารางกิจกรรมแล้ว'); }
        catch (e) { window.prompt('คัดลอกข้อความนี้:', text); }
    }

    function openImport() {
        openFormModal({
            title: 'นำเข้าจากข้อความ', icon: 'file-import', tone: 'amber', submitLabel: 'นำเข้า',
            fields: [{
                name: 'text', label: 'วางข้อความทีละบรรทัด รูปแบบ "เวลา ชื่อกิจกรรม"', type: 'textarea', rows: 10, required: true,
                placeholder: '00:00 วิ่งสี, Justdance\n00:15 BB\n01:15 TDM',
                help: 'หลายกิจกรรมในเวลาเดียวกันคั่นด้วยจุลภาค (,) — ถ้าชื่อตรงกับกิจกรรมเดิม ระบบจะอัปเดตเวลาให้ (รายละเอียดเดิมยังอยู่)',
            }],
            successText: 'นำเข้ากิจกรรมเรียบร้อย',
            onSubmit: async ({ text }) => {
                const byName = {};
                for (const line of text.split(/\r?\n/)) {
                    const m = line.match(/^\s*((?:[01]?\d|2[0-3])[:.][0-5]\d)\s*[-–:|]?\s*(.+?)\s*$/);
                    if (!m) continue;
                    const t = m[1].replace('.', ':').padStart(5, '0');
                    m[2].split(/\s*,\s*/).filter(Boolean).forEach((name) => (byName[name] ||= new Set()).add(t));
                }
                const names = Object.keys(byName);
                if (!names.length) throw userError('ไม่พบรูปแบบ "เวลา ชื่อกิจกรรม" เช่น 00:15 BB');
                await Promise.all(names.map((name, i) => {
                    const found = Object.entries(events).find(([, d]) => (d.name || '').trim() === name);
                    const id = found ? found[0] : String(Date.now() + i);
                    return set(`events/${id}`, { detail: '', ...(found ? found[1] : {}), name, time: [...byName[name]].sort().join(' / ') });
                }));
            },
        });
    }
}
