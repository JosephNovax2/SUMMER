// ===== เมนูลัดปุ่ม G =====
import { $, h, icon, img, mount } from '../lib/dom.js';
import { set, subscribe } from '../lib/store.js';
import { openFormModal } from '../ui/form.js';
import { openLightbox } from '../ui/lightbox.js';
import { loading } from './collection.js';

export function initGkey() {
    const panel = $('#panel-gkey');
    const content = h('div', null, loading('', 1));
    let data = {};

    mount(panel,
        h('header', { class: 'section-head', dataset: { tone: 'amber' } },
            h('h2', null, icon('keyboard'), 'เมนูลัดปุ่มตัว G'),
            h('div', { class: 'section-head__actions admin-only' },
                h('button', { type: 'button', class: 'btn btn--primary', onclick: edit }, icon('pen-to-square'), 'แก้ไขข้อมูล G-Key'))),
        content);

    subscribe('gkey', (value) => {
        data = value || {};
        if (!data.image && !data.detail) {
            mount(content, h('div', { class: 'empty-state' }, icon('keyboard'), 'ยังไม่มีข้อมูลเมนูลัดปุ่ม G'));
            return;
        }
        mount(content, h('article', { class: 'gkey-card' },
            data.image ? h('button', { type: 'button', class: 'gkey-card__media', 'aria-label': 'ขยายรูป', onclick: () => openLightbox(data.image) }, img(data.image)) : null,
            h('div', { class: 'gkey-card__body' },
                h('span', { class: 'info-card__label', dataset: { tone: 'amber' } }, icon('keyboard'), ' รายละเอียดเมนูลัดปุ่ม G'),
                h('div', { class: 'detail-text pre-line' }, data.detail || 'ยังไม่มีข้อมูล'))));
    });

    function edit() {
        openFormModal({
            title: 'แก้ไขข้อมูลเมนูลัดปุ่ม G', icon: 'keyboard', tone: 'amber', folder: 'gkey',
            values: data,
            fields: [
                { name: 'image', label: 'รูปภาพหลัก', type: 'url', preview: true },
                { name: 'detail', label: 'ข้อมูลอธิบายเมนูลัดปุ่ม G (พิมพ์ได้ยาว)', type: 'textarea', rows: 8 },
            ],
            onSubmit: (v) => set('gkey', v),
        });
    }
}
