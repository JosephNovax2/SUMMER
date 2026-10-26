// ===== ประกาศจากทีมงาน (กล่องจดหมาย) =====
// announcements/<id> = { title, content, createdAt, author }
// จำในเครื่อง: เปิดรายการล่าสุดเมื่อไหร่ (จุดแดง) และอ่านฉบับไหนแล้ว (ไอคอนซองเปิด)
import { $, h, icon, mount } from '../lib/dom.js';
import { state } from '../lib/bus.js';
import { newId, remove, set, subscribe } from '../lib/store.js';
import { openModal } from '../ui/modal.js';
import { openFormModal } from '../ui/form.js';
import { confirmDialog, toast } from '../ui/dialog.js';

const SEEN_KEY = 'sc_ann_last_seen';
const READ_KEY = 'sc_ann_read_ids';

let data = {};
let view = null; // { render() } ตอนหน้าต่างเปิดอยู่

const readIds = () => { try { return JSON.parse(localStorage.getItem(READ_KEY) || '{}'); } catch (e) { return {}; } };
const markRead = (key) => { try { localStorage.setItem(READ_KEY, JSON.stringify({ ...readIds(), [key]: true })); } catch (e) { /* ignore */ } };
const fmtDate = (ts) => { try { return ts ? new Date(Number(ts)).toLocaleString('th-TH', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''; } catch (e) { return ''; } };
const sortedKeys = () => Object.keys(data).sort((a, b) => (Number(data[b].createdAt) || 0) - (Number(data[a].createdAt) || 0));

function refreshBadge() {
    const latest = Math.max(0, ...Object.values(data).map((d) => Number(d.createdAt) || 0));
    let seen = 0;
    try { seen = Number(localStorage.getItem(SEEN_KEY) || 0); } catch (e) { /* ignore */ }
    $('#mail-btn')?.classList.toggle('has-unread', latest > seen);
}

export function initMail() {
    subscribe('announcements', (v) => {
        data = v || {};
        // หน้าต่างประกาศเปิดอยู่ = เห็นแล้ว ไม่ต้องขึ้นจุดแดง
        if (view) try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch (e) { /* ignore */ }
        refreshBadge();
        view?.render();
    });
}

export function openMail() {
    try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch (e) { /* ignore */ }
    refreshBadge();

    let current = null;
    const listEl = h('div', { class: 'mail__list scroll-y' });
    const detail = h('div', { class: 'mail__detail' });
    const root = h('div', { class: 'mail' },
        h('div', { class: 'mail__list-pane' },
            h('div', { class: 'mail__list-head' },
                h('span', null, icon('inbox'), ' แตะที่จดหมายเพื่อเช็คข้อความ'),
                h('button', { type: 'button', class: 'btn btn--primary btn--sm admin-only', onclick: () => edit() }, icon('pen'), 'เขียนประกาศใหม่')),
            listEl),
        detail);

    const render = () => {
        const read = readIds();
        const keys = sortedKeys();
        mount(listEl, keys.length ? keys.map((k) => {
            const d = data[k];
            return h('button', {
                type: 'button', class: ['mail-item', k === current && 'is-active', read[k] && 'is-read'],
                onclick: () => { current = k; markRead(k); root.classList.add('is-reading'); render(); },
            },
                h('span', { class: 'mail-item__icon' }, icon(read[k] ? 'envelope-open' : 'envelope')),
                h('span', { class: 'mail-item__text' }, h('b', null, d.title || 'ไม่มีหัวข้อ'), h('small', null, icon('clock', 'regular'), ' ', fmtDate(d.createdAt))));
        }) : h('div', { class: 'empty-state' }, icon('envelope-open'), 'ยังไม่มีประกาศจากทีมงาน'));

        const d = current && data[current];
        if (!d) {
            root.classList.remove('is-reading');
            mount(detail, h('div', { class: 'mail__empty' }, icon('envelope-open-text'), h('p', null, 'เลือกประกาศจากรายการเพื่ออ่าน')));
            return;
        }
        mount(detail,
            h('button', { type: 'button', class: 'btn btn--ghost btn--sm mail__back', onclick: () => { root.classList.remove('is-reading'); } }, icon('arrow-left'), 'กลับไปที่รายการ'),
            h('h2', { class: 'mail__title' }, d.title || 'ไม่มีหัวข้อ'),
            h('p', { class: 'mail__meta' }, icon('clock', 'regular'), ' ', fmtDate(d.createdAt), d.author ? ` · ${d.author}` : ''),
            h('div', { class: 'mail__content pre-line scroll-y' }, d.content || ''),
            h('div', { class: 'info-card__admin admin-only' },
                h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: () => edit(current) }, icon('pen-to-square'), 'แก้ไข'),
                h('button', { type: 'button', class: 'btn btn--danger btn--sm', onclick: () => del(current) }, icon('trash'), 'ลบ')));
    };

    view = { render };
    openModal({ title: 'ประกาศจากทีมงาน', icon: 'envelope', size: 'xl', className: 'mail-modal', body: root, onClose: () => { view = null; } });
    render();
}

function edit(key) {
    if (!state.isAdmin) return;
    const old = key ? data[key] : null;
    openFormModal({
        title: key ? 'แก้ไขประกาศ' : 'เขียนประกาศใหม่', icon: 'pen', submitLabel: 'เผยแพร่ประกาศ', successText: 'เผยแพร่ประกาศเรียบร้อย',
        values: old || {},
        fields: [
            { name: 'title', label: 'หัวข้อประกาศ', required: true, autofocus: true, placeholder: 'เช่น อัปเดตข้อมูลเว็บไซต์ประจำสัปดาห์' },
            { name: 'content', label: 'เนื้อหาประกาศ', type: 'textarea', rows: 8, required: true },
        ],
        onSubmit: (v) => set(`announcements/${key || newId()}`, {
            ...v,
            createdAt: old?.createdAt || Date.now(),
            author: old?.author || state.user?.username || 'Admin',
        }),
    });
}

async function del(key) {
    if (!await confirmDialog(`ต้องการลบประกาศ "${data[key]?.title || ''}" ถาวร?`, { danger: true, okText: 'ลบ' })) return;
    await remove(`announcements/${key}`).then(() => toast('ลบแล้ว', 'info'), () => toast('ลบไม่สำเร็จ', 'error'));
}
