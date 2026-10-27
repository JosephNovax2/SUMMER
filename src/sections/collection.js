// ===== หมวดการ์ดแบบเดียวกัน (ผลไม้ปีศาจ / แฟชั่น / รูน / ไอเทม / อาหาร) =====
// ประกาศแค่ config: หัวข้อ, การเรียง, หน้าตาการ์ด, ช่องกรอกของฟอร์ม — ส่วนที่เหลือ (โหลดข้อมูล, ปุ่มแอดมิน,
// เพิ่ม/แก้ไข/ลบ, ขยายการ์ด, เอฟเฟกต์) ทำให้ที่นี่ที่เดียว
import { $, h, icon, img, mount } from '../lib/dom.js';
import { newId, remove, set, subscribe } from '../lib/store.js';
import { openModal } from '../ui/modal.js';
import { openFormModal } from '../ui/form.js';
import { confirmDialog, toast } from '../ui/dialog.js';
import { reveal } from '../ui/reveal.js';

/**
 * @param {object} cfg
 * @param {string} cfg.tab           id ของแท็บ (panel-<tab>)
 * @param {string} cfg.path          path ในฐานข้อมูล เช่น 'devils'
 * @param {string} cfg.title
 * @param {string} cfg.icon
 * @param {string} [cfg.tone]
 * @param {string} cfg.noun          คำเรียกของในหมวด เช่น 'ผลไม้ปีศาจ'
 * @param {(a:object,b:object)=>number} [cfg.sort]
 * @param {(item:object)=>object} cfg.view    คืน { tone, glow, icon, chip:{label,icon,tone}, label, text, tags }
 * @param {Array} cfg.fields         ช่องกรอกของฟอร์มแอดมิน (ดู ui/form.js)
 * @param {(values:object)=>object} [cfg.toData]  แปลงค่าจากฟอร์มก่อนบันทึก
 * @param {(key:string,item:object)=>void} [cfg.onOpen]  กดการ์ด (ค่าเริ่มต้น = ขยายการ์ด)
 * @param {Array<{id,label,icon,tone,test:(item)=>boolean}>} [cfg.filters]  ปุ่มกรอง (เช่น ตามระดับ)
 */
export function createCollection(cfg) {
    const panel = $(`#panel-${cfg.tab}`);
    const grid = h('div', { class: 'card-grid' }, loading(cfg.noun));
    let data = {};
    let query = '';
    let filter = 'all';

    // ----- ค้นหา + ปุ่มกรอง -----
    const search = h('input', {
        class: 'input search__input', type: 'search', placeholder: `ค้นหา${cfg.noun}... (กด / เพื่อค้นหา)`,
        'aria-label': `ค้นหา${cfg.noun}`, oninput: (e) => { query = e.target.value.trim().toLowerCase(); render(); },
    });
    const chips = h('div', { class: 'filter-chips', role: 'group', 'aria-label': 'กรอง' });
    const resultInfo = h('span', { class: 'search__info', 'aria-live': 'polite' });
    const bar = h('div', { class: 'collection-bar' },
        h('label', { class: 'search' }, icon('magnifying-glass'), search, resultInfo),
        cfg.filters?.length ? chips : null);

    mount(panel,
        h('header', { class: 'section-head', dataset: { tone: cfg.tone || 'orange' } },
            h('div', null, h('h2', null, icon(cfg.icon), cfg.title), cfg.subtitle ? h('p', null, cfg.subtitle) : null),
            h('div', { class: 'section-head__actions admin-only' },
                h('button', { type: 'button', class: 'btn btn--primary', onclick: () => edit() }, icon('plus'), `เพิ่ม${cfg.noun}`))),
        bar,
        grid);

    // กด "/" เพื่อไปที่ช่องค้นหาของหมวดที่เปิดอยู่
    document.addEventListener('keydown', (e) => {
        if (e.key !== '/' || panel.hidden || e.target.closest?.('input, textarea, select') || document.querySelector('.modal-backdrop')) return;
        e.preventDefault();
        search.focus();
    });

    subscribe(cfg.path, (value) => { data = value || {}; render(); });

    const matches = (item) => {
        if (!query) return true;
        const v = cfg.view(item);
        return [item.name, v.text, v.chip?.label, ...(v.tags || [])].some((x) => String(x || '').toLowerCase().includes(query));
    };

    function renderChips(all) {
        if (!cfg.filters?.length) return;
        const count = (f) => all.filter((k) => f.test(data[k])).length;
        mount(chips, [{ id: 'all', label: 'ทั้งหมด', icon: 'layer-group', test: () => true }, ...cfg.filters].map((f) => {
            const n = count(f);
            if (f.id !== 'all' && !n) return null;
            return h('button', {
                type: 'button', class: 'filter-chip', dataset: { tone: f.tone || cfg.tone || 'orange' },
                'aria-pressed': String(filter === f.id), onclick: () => { filter = f.id; render(); },
            }, f.icon ? icon(f.icon) : null, f.label, h('small', null, n));
        }));
    }

    function render() {
        const all = Object.keys(data);
        if (cfg.sort) all.sort((a, b) => cfg.sort(data[a], data[b]));
        renderChips(all);
        if (!all.length) {
            resultInfo.textContent = '';
            mount(grid, h('div', { class: 'empty-state' }, icon(cfg.icon), `ยังไม่มีข้อมูล${cfg.noun}`));
            return;
        }
        const f = cfg.filters?.find((x) => x.id === filter);
        const keys = all.filter((k) => (!f || f.test(data[k])) && matches(data[k]));
        resultInfo.textContent = query || f ? `${keys.length}/${all.length}` : `${all.length} รายการ`;
        if (!keys.length) {
            mount(grid, h('div', { class: 'empty-state' }, icon('magnifying-glass'), `ไม่พบ${cfg.noun}ที่ค้นหา — ลองคำอื่น หรือเลือก "ทั้งหมด"`));
            return;
        }
        mount(grid, keys.map((key) => card(key, data[key])));
        reveal(grid);
    }

    function card(key, item, { zoomed = false } = {}) {
        const v = cfg.view(item);
        const el = h('article', {
            role: zoomed ? null : 'button', tabindex: zoomed ? null : '0',
            class: ['info-card', v.glow && 'is-glow', zoomed && 'is-zoomed'],
            dataset: { tone: v.tone || cfg.tone || 'orange', ...(v.rarity && { rarity: v.rarity }) },
            'aria-label': zoomed ? null : `ดู${cfg.noun} ${item.name || ''}`,
            onclick: zoomed ? null : () => (cfg.onOpen ? cfg.onOpen(key, item) : zoom(key, item)),
        },
            h('div', { class: 'info-card__media' }, img(item.image, { alt: item.name || '' })),
            h('div', { class: 'info-card__body' },
                h('h3', { class: 'info-card__name' }, icon(v.icon || cfg.icon), h('span', null, item.name || 'ไม่มีชื่อ')),
                v.chip ? h('span', { class: 'chip chip--glow', dataset: { tone: v.chip.tone || v.tone } }, v.chip.icon ? icon(v.chip.icon) : null, v.chip.label) : null,
                v.tags?.length ? h('div', { class: 'info-card__tags' }, v.tags.map((t) => h('span', { class: 'chip' }, t))) : null,
                v.label ? h('span', { class: 'info-card__label' }, icon(v.labelIcon || 'bolt'), ' ', v.label) : null,
                h('div', { class: 'info-card__text pre-line scroll-y' }, v.text || 'ยังไม่มีข้อมูล'),
                zoomed ? null : h('div', { class: 'info-card__admin admin-only' },
                    h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: (e) => { e.stopPropagation(); edit(key); } }, icon('pen-to-square'), 'แก้ไข'),
                    h('button', { type: 'button', class: 'btn btn--danger btn--sm', onclick: (e) => { e.stopPropagation(); del(key); } }, icon('trash'), 'ลบ'))));
        if (!zoomed) el.addEventListener('keydown', (e) => {
            if (e.target === el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); el.click(); }
        });
        return el;
    }

    function zoom(key, item) {
        const m = openModal({ bare: true, body: h('div', { class: 'card-zoom' }, card(key, item, { zoomed: true }),
            h('button', { type: 'button', class: 'icon-btn card-zoom__close', 'aria-label': 'ปิด', onclick: () => m.close() }, icon('xmark'))) });
    }

    function edit(key) {
        const item = key ? data[key] : null;
        openFormModal({
            title: key ? `แก้ไข${cfg.noun}` : `เพิ่ม${cfg.noun}ใหม่`,
            icon: key ? 'pen-to-square' : 'plus', tone: cfg.tone, folder: cfg.path,
            fields: cfg.fields, values: item || cfg.defaults || {},
            onSubmit: (values) => set(`${cfg.path}/${key || newId()}`, cfg.toData ? cfg.toData(values, item) : values),
        });
    }

    async function del(key) {
        if (!await confirmDialog(`ต้องการลบ${cfg.noun} "${data[key]?.name || ''}" ถาวร?`, { danger: true, okText: 'ลบ' })) return;
        try { await remove(`${cfg.path}/${key}`); toast('ลบแล้ว', 'info'); }
        catch (e) { console.error(e); toast('ลบไม่สำเร็จ', 'error'); }
    }

    return { get data() { return data; }, edit };
}

/** การ์ดโครงร่างระหว่างรอโหลด */
export function loading(noun, count = 4) {
    return Array.from({ length: count }, (_, i) => h('div', { class: 'skeleton', 'aria-hidden': i ? 'true' : null, 'aria-label': i ? null : `กำลังโหลดข้อมูล${noun}` }));
}
