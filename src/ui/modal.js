// ===== หน้าต่าง modal กลางของทั้งเว็บ =====
// ซ้อนกันได้หลายชั้น, Esc ปิดชั้นบนสุด, คลิกพื้นหลังปิดได้, ล็อกการเลื่อนหน้าหลัก, มีเสียงเปิด/ปิด
import { h, icon } from '../lib/dom.js';
import { sound } from '../lib/sound.js';

const stack = [];
let savedOverflow = '';

function lockScroll() {
    if (stack.length !== 1) return;
    savedOverflow = document.body.style.overflow;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = gap + 'px';
}
function unlockScroll() {
    if (stack.length) return;
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !stack.length) return;
    const top = stack[stack.length - 1];
    if (top.escape !== false) { e.preventDefault(); top.close(); }
});

/**
 * @param {object} o
 * @param {string} [o.title]
 * @param {string} [o.icon]       ชื่อไอคอน Font Awesome
 * @param {string} [o.tone]       orange | amber | cyan | emerald | violet | rose | red
 * @param {string} [o.size]       sm | md | lg | xl
 * @param {Node|Node[]} [o.body]
 * @param {Node|Node[]} [o.footer]
 * @param {boolean} [o.bare]      ไม่มีกรอบ/หัว — body จัดหน้าตาเอง
 * @param {string} [o.className]
 * @param {Function} [o.onClose]
 * @param {boolean} [o.silent]    ไม่เล่นเสียง
 */
export function openModal(o = {}) {
    const titleId = 'm-' + Math.random().toString(36).slice(2, 8);
    const close = () => handle.close();

    const panel = o.bare
        ? h('div', { class: ['modal modal--bare', o.className], role: 'dialog', 'aria-modal': 'true' }, o.body)
        : h('div', {
            class: ['modal', `modal--${o.size || 'md'}`, o.className],
            dataset: { tone: o.tone || 'orange' },
            role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId,
        },
            h('header', { class: 'modal__head' },
                h('h2', { class: 'modal__title', id: titleId }, o.icon ? icon(o.icon) : null, o.title || ''),
                h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'ปิด', onclick: close, 'data-silent': '' }, icon('xmark'))),
            h('div', { class: 'modal__body' }, o.body),
            o.footer ? h('footer', { class: 'modal__foot' }, o.footer) : null);

    const backdrop = h('div', { class: 'modal-backdrop' }, panel);
    backdrop.addEventListener('mousedown', (e) => {
        if (e.target === backdrop && o.closeOnBackdrop !== false) close();
    });

    let closed = false;
    const handle = {
        el: panel,
        backdrop,
        escape: o.escape,
        close() {
            if (closed) return;
            closed = true;
            const i = stack.indexOf(handle);
            if (i >= 0) stack.splice(i, 1);
            backdrop.classList.add('is-leaving');
            setTimeout(() => backdrop.remove(), 160);
            unlockScroll();
            if (!o.silent) sound.close();
            o.onClose?.();
        },
    };

    stack.push(handle);
    document.body.append(backdrop);
    lockScroll();
    if (!o.silent) sound.open();
    requestAnimationFrame(() => panel.querySelector('[autofocus]')?.focus());
    return handle;
}

export function closeAllModals() {
    [...stack].reverse().forEach((m) => m.close());
}
