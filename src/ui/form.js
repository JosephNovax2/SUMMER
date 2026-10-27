// ===== ฟอร์มแอดมินแบบประกาศช่องกรอก =====
// ทุกหมวดใช้ openFormModal({ fields, values, onSubmit }) — ไม่ต้องเขียน HTML ฟอร์มแยกเอง
//
// ชนิดช่องกรอก (type):
//   text | url | number | textarea | select | switch | color
//   list    – ข้อความหลายช่อง (array ของ string)
//   steps   – ขั้นตอน {text, image} หลายขั้น
//   focusImages – รูปหลายรูปพร้อมจุดโฟกัส {url, focus}
// ตัวเลือกเสริม: label, placeholder, required, rows, maxlength, help, options, preview (url), showIf(values), itemPlaceholder
//   ช่องลิงก์รูป (url / list ที่ itemType 'url' / steps / focusImages) มีปุ่มอัปโหลดในตัว:
//   แปลงเป็น WebP แล้วเก็บที่ Supabase Storage — ปิดได้ด้วย upload: false, กำหนดขนาดด้วย maxSize
import { h, icon, img, safeUrl } from '../lib/dom.js';
import { isOwnImage, uploadImage } from '../lib/upload.js';
import { openModal } from './modal.js';
import { toast } from './dialog.js';

const fieldBuilders = {
    text: textInput, url: textInput, number: textInput,
    textarea, select, switch: switchInput, color: colorInput,
    list: listInput, steps: stepsInput, focusImages: focusImagesInput,
};

export function buildForm(fields, values = {}, ctx = {}) {
    const controls = [];
    const form = h('form', { class: 'form', onsubmit: (e) => e.preventDefault() });

    for (const f of fields) {
        const ctl = fieldBuilders[f.type || 'text'](f, values[f.name], ctx);
        const wrap = h('div', { class: ['field', f.type === 'switch' && 'field--switch', f.wide && 'field--wide'] },
            f.type === 'switch' ? null : h('label', { class: 'field__label' }, f.label, f.required ? h('span', { class: 'field__req' }, ' *') : null),
            ctl.el,
            f.help ? h('p', { class: 'field__help' }, f.help) : null);
        controls.push({ f, ctl, wrap });
        form.append(wrap);
    }

    const read = () => Object.fromEntries(controls.map(({ f, ctl }) => [f.name, ctl.get()]));
    const syncVisibility = () => {
        const v = read();
        controls.forEach(({ f, wrap }) => { if (f.showIf) wrap.hidden = !f.showIf(v); });
    };
    form.addEventListener('input', syncVisibility);
    form.addEventListener('change', syncVisibility);
    syncVisibility();

    return {
        el: form,
        read,
        /** คืนข้อความผิดพลาดแรก หรือ null */
        validate() {
            const v = read();
            for (const { f, wrap } of controls) {
                if (!f.required || wrap.hidden) continue;
                const x = v[f.name];
                if (x == null || (typeof x === 'string' && !x.trim()) || (Array.isArray(x) && !x.length)) return `กรุณากรอก "${f.label}"`;
            }
            return null;
        },
    };
}

/**
 * เปิดฟอร์มในหน้าต่าง
 * @param {object} o  title, icon, tone, size, fields, values, submitLabel, onSubmit(values) => Promise
 */
/** ข้อผิดพลาดที่ต้องการแสดงข้อความให้ผู้ใช้เห็นตรงๆ */
export function userError(message) {
    const e = new Error(message);
    e.userMessage = message;
    return e;
}

export function openFormModal(o) {
    const form = buildForm(o.fields, o.values || {}, { folder: o.folder });
    const save = h('button', { type: 'submit', class: 'btn btn--primary' }, icon('floppy-disk'), o.submitLabel || 'บันทึกข้อมูล');
    const m = openModal({
        title: o.title, icon: o.icon, tone: o.tone, size: o.size || 'md',
        body: form.el,
        footer: [h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => m.close() }, 'ยกเลิก'), save],
    });
    const submit = async () => {
        const err = form.validate();
        if (err) { toast(err, 'error'); return; }
        const external = [...form.el.querySelectorAll('[data-image]')].find((i) => !isOwnImage(i.value));
        if (external) { external.focus(); toast('ใช้ลิงก์รูปภายนอกไม่ได้ — กรุณากดอัปโหลดรูปใหม่', 'error'); return; }
        save.disabled = true;
        save.classList.add('is-busy');
        try {
            await o.onSubmit(form.read());
            m.close();
            toast(o.successText || 'บันทึกข้อมูลเรียบร้อย');
        } catch (e) {
            console.error(e);
            toast(e?.userMessage || 'บันทึกไม่สำเร็จ — ตรวจสอบสิทธิ์แอดมินหรือการเชื่อมต่อ', 'error');
        } finally {
            save.disabled = false;
            save.classList.remove('is-busy');
        }
    };
    save.addEventListener('click', submit);
    form.el.addEventListener('submit', submit);
    return m;
}

// ---------------------------------------------------------------------------
function textInput(f, value, ctx) {
    const input = h('input', {
        class: 'input', type: f.type === 'url' ? 'url' : f.type === 'number' ? 'number' : 'text',
        placeholder: f.placeholder, maxlength: f.maxlength, value: value ?? '', autofocus: f.autofocus,
    });
    if (f.type !== 'url') return { el: input, get: () => input.value.trim() };
    const field = imageInput(input, f, ctx);
    if (!f.preview) return { el: field, get: () => input.value.trim() };
    const thumb = h('div', { class: 'thumb-preview' });
    const update = () => {
        const u = safeUrl(input.value.trim());
        thumb.replaceChildren(u ? img(u, { alt: 'ตัวอย่างรูป' }) : h('span', null, 'ยังไม่มีรูป'));
    };
    input.addEventListener('change', update);
    input.addEventListener('blur', update);
    update();
    return { el: h('div', { class: 'url-preview' }, field, thumb), get: () => input.value.trim() };
}

function textarea(f, value) {
    const el = h('textarea', { class: 'input', rows: f.rows || 4, placeholder: f.placeholder, maxlength: f.maxlength });
    el.value = value ?? '';
    return { el, get: () => el.value.trim() };
}

function select(f, value) {
    const el = h('select', { class: 'input' },
        f.options.map((o) => h('option', { value: o.value }, o.label)));
    el.value = value ?? f.options[0].value;
    return { el, get: () => el.value };
}

function switchInput(f, value) {
    const box = h('input', { type: 'checkbox', class: 'switch__box', checked: value === true });
    const el = h('label', { class: 'switch' },
        h('span', { class: 'switch__text' }, f.icon ? icon(f.icon) : null, h('span', null, f.label), f.hint ? h('small', null, f.hint) : null),
        box, h('span', { class: 'switch__track', 'aria-hidden': 'true' }));
    return { el, get: () => box.checked };
}

function colorInput(f, value) {
    let current = value || f.options[0].hex;
    const row = h('div', { class: 'swatches', role: 'radiogroup', 'aria-label': f.label });
    const render = () => row.replaceChildren(...f.options.map((c) => h('button', {
        type: 'button', class: ['swatch', c.hex.toLowerCase() === current.toLowerCase() && 'is-selected'],
        style: { '--swatch': c.hex }, 'aria-label': c.name, role: 'radio',
        'aria-checked': String(c.hex.toLowerCase() === current.toLowerCase()),
        onclick: () => { current = c.hex; render(); },
    })));
    render();
    return { el: row, get: () => current };
}

/** แถวที่เพิ่ม/ลบได้ ใช้ร่วมกันหลายชนิด */
function repeater({ addLabel, makeRow, initial, empty, numbered }) {
    const list = h('div', { class: 'repeater__list' });
    const renumber = () => numbered && [...list.children].forEach((row, i) => {
        const n = row.querySelector('.repeater__no'); if (n) n.textContent = `ขั้นที่ ${i + 1}`;
    });
    const add = (v) => {
        const row = makeRow(v);
        row.classList.add('repeater__row');
        row.append(h('button', {
            type: 'button', class: 'icon-btn icon-btn--danger', 'aria-label': 'ลบแถวนี้',
            onclick: () => { row.remove(); renumber(); },
        }, icon('trash-can')));
        list.append(row);
        renumber();
    };
    (initial?.length ? initial : [empty]).forEach(add);
    const el = h('div', { class: 'repeater' }, list,
        h('button', { type: 'button', class: 'btn btn--soft btn--sm', onclick: () => add(empty) }, icon('plus'), addLabel));
    return { el, list };
}

function listInput(f, value, ctx) {
    const r = repeater({
        addLabel: f.addLabel || 'เพิ่ม', empty: '', initial: Array.isArray(value) ? value : [],
        makeRow: (v) => {
            const input = h('input', { class: 'input', type: f.itemType || 'text', value: v ?? '', placeholder: f.itemPlaceholder });
            return h('div', null, f.itemType === 'url' ? imageInput(input, f, ctx) : input);
        },
    });
    return { el: r.el, get: () => [...r.list.querySelectorAll('input')].map((i) => i.value.trim()).filter(Boolean) };
}

function stepsInput(f, value, ctx) {
    const r = repeater({
        addLabel: 'เพิ่มขั้นตอน', empty: { text: '', image: '' }, numbered: true,
        initial: Array.isArray(value) ? value : [],
        makeRow: (v) => {
            const ta = h('textarea', { class: 'input step-text', rows: 2, placeholder: 'อธิบายขั้นตอนนี้ เช่น เดินทางไปจุด X แล้วใช้ไอเทม Y' });
            ta.value = v?.text ?? '';
            return h('div', { class: 'step-row' },
                h('span', { class: 'repeater__no' }),
                h('div', { class: 'step-row__fields' }, ta,
                    imageInput(h('input', { class: 'input step-image', type: 'url', value: v?.image ?? '', placeholder: 'ลิงก์รูปประกอบขั้นตอนนี้ (ไม่บังคับ) หรือกดอัปโหลด' }), f, ctx)));
        },
    });
    return {
        el: r.el,
        get: () => [...r.list.children].map((row) => ({
            text: row.querySelector('.step-text').value.trim(),
            image: row.querySelector('.step-image').value.trim(),
        })).filter((s) => s.text || s.image),
    };
}

function focusImagesInput(f, value, ctx) {
    const r = repeater({
        addLabel: 'เพิ่มรูป', empty: { url: '', focus: 50 }, initial: Array.isArray(value) ? value : [],
        makeRow: (v) => {
            const out = h('output', { class: 'focus-val' }, `${v?.focus ?? 50}%`);
            const range = h('input', {
                type: 'range', min: 0, max: 100, value: v?.focus ?? 50, class: 'focus-range',
                oninput: (e) => { out.textContent = e.target.value + '%'; },
            });
            return h('div', { class: 'focus-row' },
                imageInput(h('input', { class: 'input focus-url', type: 'url', value: v?.url ?? '', placeholder: 'ลิงก์รูป หรือกดอัปโหลด' }), { maxSize: 1920, ...f }, ctx),
                h('label', { class: 'focus-slider' }, h('span', null, 'โฟกัส บน→ล่าง'), range, out));
        },
    });
    return {
        el: r.el,
        get: () => [...r.list.children].map((row) => ({
            url: row.querySelector('.focus-url').value.trim(),
            focus: Number(row.querySelector('.focus-range').value),
        })).filter((x) => x.url),
    };
}

/**
 * ช่องลิงก์รูป + ปุ่มอัปโหลด (เลือกไฟล์ / ลากไฟล์มาวาง / วางรูปจากคลิปบอร์ด)
 * อัปโหลดเสร็จจะใส่ลิงก์ลงช่องให้เอง
 */
function imageInput(input, f = {}, ctx = {}) {
    if (f.upload === false) return input;
    const opts = { folder: f.folder || ctx.folder || 'misc', maxSize: f.maxSize || 1600, square: !!f.square };
    // รับเฉพาะรูปที่อัปโหลด: ช่องนี้อ่านอย่างเดียว คลิกช่องเพื่อเลือกไฟล์ได้
    input.readOnly = true;
    input.dataset.image = '1';
    input.placeholder = 'ยังไม่มีรูป — กดอัปโหลด หรือลาก/วางรูปที่นี่';
    input.addEventListener('click', () => file.click());
    const file = h('input', { type: 'file', accept: 'image/*', hidden: true });
    const btn = h('label', { class: 'btn btn--soft btn--sm img-input__btn', title: 'อัปโหลดรูป (แปลงเป็น WebP อัตโนมัติ)' },
        icon('cloud-arrow-up'), h('span', null, 'อัปโหลด'), file);
    const clear = h('button', {
        type: 'button', class: 'icon-btn icon-btn--sm icon-btn--danger img-input__clear', 'aria-label': 'เอารูปออก',
        onclick: () => { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); },
    }, icon('xmark'));
    const wrap = h('div', { class: 'img-input' }, input, btn, clear);

    const run = async (picked) => {
        if (!picked) return;
        if (!picked.type.startsWith('image/')) { toast('ไฟล์นี้ไม่ใช่รูปภาพ', 'error'); return; }
        wrap.classList.add('is-uploading');
        btn.classList.add('is-busy');
        try {
            input.value = await uploadImage(picked, opts);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            toast('อัปโหลดรูปแล้ว (WebP)');
        } catch (e) {
            console.error(e);
            const msg = String(e?.message || '');
            toast(msg.includes('Bucket not found') ? 'ยังไม่ได้สร้างที่เก็บรูป — รัน supabase/storage.sql ก่อน'
                : msg.includes('row-level security') || e?.statusCode === '403' ? 'อัปโหลดไม่ได้ — ต้องล็อกอินเป็นแอดมิน'
                : 'อัปโหลดรูปไม่สำเร็จ', 'error');
        } finally {
            wrap.classList.remove('is-uploading');
            btn.classList.remove('is-busy');
            file.value = '';
        }
    };
    file.addEventListener('change', () => run(file.files?.[0]));
    wrap.addEventListener('dragover', (e) => { e.preventDefault(); wrap.classList.add('is-drop'); });
    wrap.addEventListener('dragleave', () => wrap.classList.remove('is-drop'));
    wrap.addEventListener('drop', (e) => { e.preventDefault(); wrap.classList.remove('is-drop'); run(e.dataTransfer.files?.[0]); });
    wrap.addEventListener('paste', (e) => {
        const pic = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith('image/'));
        if (pic) { e.preventDefault(); run(pic); }
    });
    return wrap;
}
