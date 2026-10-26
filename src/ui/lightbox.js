// ===== ขยายรูปเต็มจอ =====
import { h, icon, img } from '../lib/dom.js';
import { openModal } from './modal.js';

export function openLightbox(src) {
    if (!src) return;
    const m = openModal({
        bare: true, silent: true,
        body: h('div', { class: 'lightbox' },
            img(src, { alt: '', loading: 'eager' }),
            h('button', { type: 'button', class: 'icon-btn lightbox__close', 'aria-label': 'ปิดรูป', onclick: () => m.close() }, icon('xmark'))),
    });
    m.backdrop.style.cursor = 'zoom-out';
    m.backdrop.addEventListener('click', (e) => { if (e.target.tagName !== 'IMG') m.close(); });
}
