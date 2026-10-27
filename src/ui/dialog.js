// ===== กล่องยืนยัน + แจ้งเตือนสั้น (แทน confirm()/alert() ของเบราว์เซอร์) =====
import { h, icon } from '../lib/dom.js';
import { openModal } from './modal.js';
import { sound } from '../lib/sound.js';

/** ถามยืนยัน คืนค่า Promise<boolean> */
export function confirmDialog(message, { okText = 'ยืนยัน', danger = false, title = 'ยืนยันการทำรายการ' } = {}) {
    return new Promise((resolve) => {
        let answered = false;
        const done = (v) => { answered = true; resolve(v); m.close(); };
        const ok = h('button', { type: 'button', class: ['btn', danger ? 'btn--danger' : 'btn--primary'], autofocus: true, onclick: () => { if (danger) sound.remove(); done(true); } },
            danger ? icon('trash-can') : icon('check'), okText);
        const m = openModal({
            title, icon: danger ? 'triangle-exclamation' : 'circle-question', tone: danger ? 'rose' : 'orange', size: 'sm',
            body: h('p', { class: 'dialog__msg' }, message),
            footer: [h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => done(false) }, 'ยกเลิก'), ok],
            onClose: () => { if (!answered) resolve(false); },
        });
    });
}

let toastRoot = null;
/** แจ้งเตือนสั้นมุมล่าง หายเองใน 2.6 วิ */
export function toast(message, kind = 'success') {
    if (!toastRoot) toastRoot = document.body.appendChild(h('div', { class: 'toast-root', 'aria-live': 'polite' }));
    const ic = kind === 'error' ? 'circle-exclamation' : kind === 'info' ? 'circle-info' : 'circle-check';
    const el = h('div', { class: `toast toast--${kind}` }, icon(ic), h('span', null, message));
    toastRoot.append(el);
    setTimeout(() => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 250); }, 2600);
}
