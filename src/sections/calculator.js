// ===== เครื่องคำนวณสัดส่วนฟาร์มท้ายรถโล (งานปลากระป๋อง) =====
// สูตรเดิม: เป้าหมาย = floor((น้ำหนักkg / 0.5 + 180) / 3)
//   มะเขือเทศ/พริก ใส่กระเป๋า 40 ที่เหลือท้ายรถ / ปลา ใส่กระเป๋า 100 (ถ้าเป้าน้อยกว่า ใส่กระเป๋าทั้งหมด)
// รูปไอคอนวัตถุดิบตั้งได้โดยแอดมิน: calc_icons = { tomato, chili, fish, can } (ลิงก์ หรือรูปที่อัปโหลดย่อ 128×128)
import { h, icon, img, mount, safeUrl } from '../lib/dom.js';
import { set, subscribe } from '../lib/store.js';
import { state } from '../lib/bus.js';
import { sound } from '../lib/sound.js';
import { openModal } from '../ui/modal.js';
import { toast } from '../ui/dialog.js';
import { uploadImage } from '../lib/upload.js';

const ITEMS = [
    { id: 'tomato', name: 'มะเขือเทศ', bag: 40 },
    { id: 'chili', name: 'พริก', bag: 40 },
    { id: 'fish', name: 'ปลา', bag: 100 },
];
const CAN = { id: 'can', name: 'ปลากระป๋อง' };
const MAX_KG = 100000000;

let icons = {};
let listening = false;
let repaint = null; // วาดไอคอนใหม่เมื่อแอดมินเปลี่ยนรูป ขณะเครื่องคิดเลขเปิดอยู่

export function calculate(kgInput) {
    let kg = parseFloat(kgInput);
    if (isNaN(kg) || kg < 0) kg = 0;
    kg = Math.min(kg, MAX_KG);
    const target = Math.floor((kg / 0.5 + 180) / 3);
    const rows = {};
    for (const it of ITEMS) {
        let bag = it.bag;
        let trunk = target - bag;
        if (trunk < 0) { trunk = 0; if (it.id === 'fish') bag = target; }
        rows[it.id] = { bag, trunk };
    }
    return { total: target, rows };
}

const fmt = (n) => n.toLocaleString('th-TH');
const iconOf = (it, src) => h('span', { class: 'calc__ic' }, safeUrl(src) ? img(src, { alt: '' }, { fallback: '' }) : it.name[0]);

export function openCalculator() {
    if (!listening) { listening = true; subscribe('calc_icons', (v) => { icons = v || {}; repaint?.(); }); }

    let value = '';
    let last = null;
    let busy = false;

    const lcd = h('div', { class: 'calc__lcd', 'aria-live': 'polite' }, '0');
    const total = h('b', { class: 'calc__total-num' }, '-');
    const hint = h('p', { class: 'calc__hint' }, 'ยังไม่ได้คำนวณ — ใส่น้ำหนักแล้วกดปุ่ม “คำนวณ”');
    const cells = {};
    const rows = h('div', { class: 'calc__rows' });
    const canIc = h('span');
    const res = h('section', { class: 'calc__card calc__res is-stale' },
        h('div', { class: 'calc__cols' }, h('span', null, 'วัตถุดิบที่ต้องใช้'), h('span', null, 'ในกระเป๋า'), h('span', null, 'ท้ายรถโล')),
        rows,
        h('div', { class: 'calc__total' }, h('div', { class: 'calc__total-l' }, canIc, h('span', null, 'ยอดรวมการฟาร์ม', h('small', null, 'จะได้ปลากระป๋องทั้งหมด'))), total),
        hint);

    const paintIcons = () => {
        mount(rows, ITEMS.map((it) => {
            cells[it.id] = { bag: h('span', { class: 'calc__v calc__v--bag' }, '-'), trunk: h('span', { class: 'calc__v' }, '-') };
            return h('div', { class: 'calc__row' }, h('span', { class: 'calc__who' }, iconOf(it, icons[it.id]), it.name), cells[it.id].bag, cells[it.id].trunk);
        }));
        mount(canIc, iconOf(CAN, icons.can));
        if (last) paint(last);
    };

    const paint = (c) => {
        ITEMS.forEach((it) => {
            mount(cells[it.id].bag, fmt(c.rows[it.id].bag), h('small', null, 'ชิ้น'));
            mount(cells[it.id].trunk, fmt(c.rows[it.id].trunk), h('small', null, 'ชิ้น'));
        });
        mount(total, fmt(c.total), h('small', null, ' กระป๋อง'));
    };

    const countUp = (c) => {
        const t0 = performance.now();
        const step = (now) => {
            const p = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - p, 3);
            const s = { total: Math.round(c.total * e), rows: {} };
            ITEMS.forEach((it) => { s.rows[it.id] = { bag: Math.round(c.rows[it.id].bag * e), trunk: Math.round(c.rows[it.id].trunk * e) }; });
            paint(s);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const show = () => {
        lcd.textContent = value === '' ? '0' : Number(value).toLocaleString('en-US');
        if (last) { res.classList.add('is-stale'); hint.textContent = 'ค่าเปลี่ยนแล้ว — กด “คำนวณ” เพื่ออัปเดตผล'; }
    };
    const press = (k) => {
        if (k === 'C') value = '';
        else if (k === 'B') value = value.slice(0, -1);
        else if (value.length < 9) { value = (value + k).replace(/^0+(?=\d)/, ''); if (Number(value) > MAX_KG) value = String(MAX_KG); }
        show();
    };

    const go = h('button', { type: 'button', class: 'btn btn--primary calc__go' }, 'คำนวณสัดส่วน');
    const run = () => {
        if (busy) return;
        busy = true;
        go.classList.add('is-busy');
        res.classList.add('is-loading');
        hint.textContent = 'กำลังคำนวณสัดส่วน...';
        setTimeout(() => {
            last = calculate(value);
            countUp(last);
            sound.chime();
            res.classList.remove('is-loading', 'is-stale');
            res.classList.add('is-pop');
            hint.textContent = '';
            go.classList.remove('is-busy');
            busy = false;
            setTimeout(() => res.classList.remove('is-pop'), 1000);
        }, 900);
    };
    go.addEventListener('click', run);

    const key = (k, label, cls = '') => h('button', { type: 'button', class: `calc__key ${cls}`, onclick: () => press(k), 'aria-label': label }, label);
    const keypad = h('div', { class: 'calc__keys' },
        ['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((d) => key(d, d)),
        key('0', '0', 'is-wide'), key('B', '⌫', 'is-fn'),
        key('C', 'ล้างค่า', 'is-fn is-full'), go);

    const gear = h('button', { type: 'button', class: 'btn btn--ghost btn--sm admin-only', onclick: () => openIconManager() }, icon('gear'), 'จัดการรูป');
    const body = h('div', { class: 'calc' },
        h('header', { class: 'calc__head' },
            h('span', { class: 'calc__brand' }, h('i', { class: 'calc__dot' }), 'SUMMER CITY'),
            h('h2', null, 'เครื่องคำนวณสัดส่วนฟาร์มท้ายรถโล', h('small', null, 'งานปลากระป๋อง · ใส่น้ำหนักแล้วกด “คำนวณ”')),
            gear,
            h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'ปิด', onclick: () => m.close() }, icon('xmark'))),
        h('div', { class: 'calc__main' },
            h('section', { class: 'calc__card' },
                h('div', { class: 'calc__lcd-top' }, h('span', null, 'น้ำหนักท้ายรถโล'), h('span', { class: 'calc__unit' }, 'KG')),
                lcd, keypad),
            res));

    paintIcons();
    repaint = paintIcons;
    const onKey = (e) => {
        if (e.target.closest?.('input, textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
        if (/^\d$/.test(e.key)) { e.preventDefault(); sound.click(); press(e.key); }
        else if (e.key === 'Backspace') { e.preventDefault(); sound.click(); press('B'); }
        else if (e.key === 'Enter' && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); run(); }
    };
    document.addEventListener('keydown', onKey);
    const m = openModal({ bare: true, body, onClose: () => { document.removeEventListener('keydown', onKey); repaint = null; } });
}

/** แอดมิน: ตั้งรูปไอคอนวัตถุดิบ (ลิงก์ หรืออัปโหลดแล้วย่อ 128×128) */
function openIconManager() {
    if (!state.isAdmin) return;
    const draft = { ...icons };
    const all = [...ITEMS, CAN];
    const previews = {};
    const inputs = {};
    const refresh = (id) => mount(previews[id], iconOf(all.find((i) => i.id === id), draft[id]));

    const rows = all.map((it) => {
        previews[it.id] = h('span');
        inputs[it.id] = h('input', {
            class: 'input', type: 'url', readOnly: true, placeholder: 'ยังไม่มีรูป — กดอัปโหลดไฟล์',
            value: String(draft[it.id] || '').startsWith('data:') ? '' : draft[it.id] || '',
            oninput: (e) => { draft[it.id] = e.target.value.trim(); refresh(it.id); },
        });
        const file = h('input', {
            type: 'file', accept: 'image/*', hidden: true,
            onchange: async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                try {
                    // ครอปจัตุรัส ย่อ 256px แปลง WebP แล้วเก็บที่ Supabase Storage
                    draft[it.id] = await uploadImage(f, { folder: 'calc', maxSize: 256, square: true });
                    inputs[it.id].value = draft[it.id];
                    refresh(it.id);
                } catch (err) { console.error(err); toast('อัปโหลดรูปไม่สำเร็จ', 'error'); }
                e.target.value = '';
            },
        });
        refresh(it.id);
        return h('div', { class: 'calc-icon-row' }, previews[it.id],
            h('div', { class: 'calc-icon-row__f' }, h('b', null, it.name), inputs[it.id],
                h('div', { class: 'calc-icon-row__btns' },
                    h('label', { class: 'btn btn--ghost btn--sm' }, icon('upload'), 'อัปโหลดไฟล์', file),
                    h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: () => { draft[it.id] = ''; inputs[it.id].value = ''; refresh(it.id); } }, 'ลบรูป'))));
    });

    const save = h('button', { type: 'button', class: 'btn btn--primary' }, icon('floppy-disk'), 'บันทึก');
    save.addEventListener('click', async () => {
        save.disabled = true;
        try { await set('calc_icons', draft); toast('บันทึกแล้ว (ทุกคนเห็นรูปใหม่)'); m.close(); }
        catch (e) { toast('บันทึกไม่สำเร็จ', 'error'); }
        finally { save.disabled = false; }
    });
    const m = openModal({
        title: 'จัดการรูปวัตถุดิบ (แอดมิน)', icon: 'images', size: 'md',
        body: h('div', { class: 'form' }, h('p', { class: 'field__help' }, 'กดอัปโหลดไฟล์ รูปจะถูกครอปจัตุรัส ย่อ และแปลงเป็น WebP แล้วเก็บที่ Supabase อัตโนมัติ'), rows),
        footer: [h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => m.close() }, 'ปิด'), save],
    });
}
