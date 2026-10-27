// ===== บอร์ดแจ้งปรับราคากลาง Economy =====
// eco_list/<id> = { name, image, status: 'BUFF'|'NERF', note }  /  eco_time = ข้อความวันเวลา  /  eco_golden = true|false
import { h, icon, img, mount } from '../lib/dom.js';
import { newId, remove, set, subscribe, update } from '../lib/store.js';
import { openFormModal } from '../ui/form.js';
import { confirmDialog, toast } from '../ui/dialog.js';
import { onUser } from '../lib/bus.js';

const FIELDS = [
    { name: 'name', label: 'ชื่องานฟาร์ม', required: true, autofocus: true },
    { name: 'image', label: 'รูปภาพประกอบ', type: 'url', preview: true, required: true },
    { name: 'status', label: 'สถานะราคา', type: 'select', options: [{ value: 'BUFF', label: 'BUFF (ราคาขึ้น)' }, { value: 'NERF', label: 'NERF (ราคาลง)' }] },
    { name: 'note', label: 'หมายเหตุกำกับ (ถ้ามี)', maxlength: 60, placeholder: 'เช่น บัฟแค่ 48 ชม. / เฉพาะวันหยุด' },
];

export function createEcoBoard() {
    let list = {};
    let golden = false;

    const time = h('span', { class: 'eco__time' }, '-');
    const goldenTag = h('span', { class: 'eco__tag eco__tag--gold', hidden: true }, icon('crown'), 'GOLDEN WEEK');
    const goldenNote = h('p', { class: 'eco__golden-note', hidden: true }, icon('wand-magic-sparkles'), ' ช่วงนี้คือช่วง GoldenWeek — บัพราคาพิเศษที่สุดประจำเมือง! รีบฟาร์มก่อนหมดช่วง');
    const buffGrid = h('div', { class: 'eco__grid' });
    const nerfGrid = h('div', { class: 'eco__grid' });

    // ----- เครื่องมือแอดมิน (ซ่อน/แสดง) -----
    const timeInput = h('input', { class: 'input', placeholder: 'ระบุวันเวลา เช่น 17/06/2569 15:30' });
    const goldenBox = h('input', { type: 'checkbox', class: 'switch__box' });
    goldenBox.addEventListener('change', async () => {
        try { await set('eco_golden', goldenBox.checked); toast(goldenBox.checked ? 'เปิดโหมด GoldenWeek แล้ว' : 'ปิดโหมด GoldenWeek แล้ว', 'info'); }
        catch (e) { toast('บันทึกไม่สำเร็จ', 'error'); goldenBox.checked = golden; }
    });
    const tools = h('div', { class: 'eco__tools admin-only', hidden: true },
        h('div', { class: 'eco__tools-row' },
            h('label', { class: 'field' }, h('span', { class: 'field__label' }, 'เวลาอัปเดตล่าสุด'), timeInput),
            h('button', {
                type: 'button', class: 'btn btn--primary', onclick: async () => {
                    try { await set('eco_time', timeInput.value.trim()); toast('บันทึกวันเวลาเรียบร้อย'); } catch (e) { toast('บันทึกไม่สำเร็จ', 'error'); }
                },
            }, icon('clock'), 'บันทึกเวลา'),
            h('button', { type: 'button', class: 'btn btn--soft', onclick: () => edit() }, icon('plus'), 'เพิ่มรายการ')),
        h('label', { class: 'switch', dataset: { tone: 'gold' } },
            h('span', { class: 'switch__text' }, icon('crown'), 'เปิดโหมด GoldenWeek (ช่วงบัพราคาพิเศษที่สุด)'),
            goldenBox, h('span', { class: 'switch__track' })));

    const toggleBtn = h('button', { type: 'button', class: 'btn btn--primary btn--sm admin-only', 'aria-expanded': 'false' });
    const syncToggle = () => {
        mount(toggleBtn, icon(tools.hidden ? 'pen-to-square' : 'chevron-up'), tools.hidden ? 'แก้ไขบอร์ดราคา' : 'ปิดเครื่องมือ');
        toggleBtn.setAttribute('aria-expanded', String(!tools.hidden));
    };
    toggleBtn.addEventListener('click', () => { tools.hidden = !tools.hidden; syncToggle(); });
    syncToggle();

    const el = h('section', { class: 'eco' },
        h('div', { class: 'eco__topline', 'aria-hidden': 'true' }),
        h('header', { class: 'eco__head' },
            h('div', { class: 'eco__head-main' },
                h('h2', { class: 'eco__title' }, icon('circle-exclamation'), h('span', null, 'บอร์ดแจ้งปรับราคากลาง Economy ล่าสุดประจำเมือง')),
                h('p', { class: 'eco__sub' }, icon('thumbtack'), ' ตรวจสอบราคาตลาดก่อนออกฟาร์ม · อัปเดตล่าสุด ', time),
                goldenNote),
            // ป้ายสถานะ + ปุ่มแอดมินอยู่คอลัมน์ขวาด้วยกัน (ไม่ลอยทับกัน)
            h('div', { class: 'eco__head-side' },
                h('div', { class: 'eco__tags' }, h('span', { class: 'eco__tag' }, h('span', { class: 'eco__dot' }), 'LIVE BOARD'), goldenTag),
                toggleBtn)),
        tools,
        h('div', { class: 'eco__cols' },
            h('div', { class: 'eco__col' }, h('div', { class: 'eco__col-head eco__col-head--buff' }, icon('arrow-trend-up'), 'รายการงานที่โดน BUFF ราคา (เงินดีมาก)'), buffGrid),
            h('div', { class: 'eco__col' }, h('div', { class: 'eco__col-head eco__col-head--nerf' }, icon('arrow-trend-down'), 'รายการงานที่โดน NERF ราคา (รายได้ลดลง)'), nerfGrid)));

    // ออกจากระบบแล้ว: พับเครื่องมือแอดมินเก็บ
    onUser((u) => { if (u?.role !== 'ADMIN') { tools.hidden = true; syncToggle(); } });

    subscribe('eco_time', (v) => { time.textContent = v || 'ยังไม่ได้ระบุเวลา'; timeInput.value = v || ''; });
    subscribe('eco_golden', (v) => {
        golden = v === true;
        goldenBox.checked = golden;
        goldenTag.hidden = !golden;
        goldenNote.hidden = !golden;
        el.classList.toggle('is-golden', golden);
        render();
    });
    subscribe('eco_list', (v) => { list = v || {}; render(); });

    function render() {
        const keys = Object.keys(list);
        const buff = keys.filter((k) => list[k].status === 'BUFF');
        const nerf = keys.filter((k) => list[k].status !== 'BUFF');
        mount(buffGrid, buff.length ? buff.map((k) => card(k, list[k])) : h('p', { class: 'eco__empty' }, 'ยังไม่มีรายการ'));
        mount(nerfGrid, nerf.length ? nerf.map((k) => card(k, list[k])) : h('p', { class: 'eco__empty' }, 'ยังไม่มีรายการ'));
    }

    function card(key, item) {
        const buff = item.status === 'BUFF';
        return h('div', { class: ['eco-card', buff ? 'is-buff' : 'is-nerf'] },
            h('div', { class: 'eco-card__img' }, img(item.image, { alt: '' })),
            h('div', { class: 'eco-card__body' },
                h('h4', { class: 'eco-card__name clamp-2' }, item.name),
                h('div', { class: 'eco-card__meta' },
                    h('span', { class: 'eco-card__status' }, icon(buff ? 'arrow-up' : 'arrow-down'), buff ? ' Buff' : ' Nerf'),
                    item.note ? h('span', { class: 'eco-card__note' }, icon('clock'), h('span', null, item.note)) : null)),
            golden && buff ? h('span', { class: 'eco-card__gw' }, icon('crown'), 'GW') : null,
            h('div', { class: 'eco-card__admin admin-only' },
                h('button', { type: 'button', class: 'icon-btn icon-btn--sm', 'aria-label': 'แก้ไข', onclick: () => edit(key) }, icon('pen')),
                h('button', { type: 'button', class: 'icon-btn icon-btn--sm', 'aria-label': buff ? 'สลับเป็น NERF' : 'สลับเป็น BUFF', onclick: () => update(`eco_list/${key}`, { status: buff ? 'NERF' : 'BUFF' }) }, icon('arrow-right-arrow-left')),
                h('button', { type: 'button', class: 'icon-btn icon-btn--sm icon-btn--danger', 'aria-label': 'ลบ', onclick: () => del(key) }, icon('xmark'))));
    }

    function edit(key) {
        openFormModal({
            title: key ? 'แก้ไขรายการบอร์ดราคา' : 'เพิ่มรายการบอร์ดราคา', icon: 'pen-to-square', tone: 'amber', size: 'sm', folder: 'eco',
            fields: FIELDS, values: key ? list[key] : { status: 'BUFF' },
            onSubmit: (v) => set(`eco_list/${key || newId()}`, v),
        });
    }

    async function del(key) {
        if (!await confirmDialog(`ต้องการลบ "${list[key]?.name || ''}" ออกจากบอร์ดราคา?`, { danger: true, okText: 'ลบ' })) return;
        await remove(`eco_list/${key}`).then(() => toast('ลบแล้ว', 'info'), () => toast('ลบไม่สำเร็จ', 'error'));
    }

    return el;
}
