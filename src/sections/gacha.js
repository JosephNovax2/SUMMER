// ===== ร้านค้า GACHA: ป้ายหน้าฟาร์ม + ป็อปอัปร้าน =====
// gacha_banner = { titles[], desc, images[{url,focus}], saleVisible }
// gacha_categories/<id> = { name, color, order }   gacha_items/<id> = { categoryId, name, image, price, badge, detail }
import { h, hexToRgb, icon, img, mount, safeColor, safeUrl } from '../lib/dom.js';
import { newId, remove, set, subscribe } from '../lib/store.js';
import { openModal } from '../ui/modal.js';
import { openFormModal } from '../ui/form.js';
import { confirmDialog, toast } from '../ui/dialog.js';

const DEFAULT_TITLE = 'GACHA DONATE SUMMER CITY SS2';
const DEFAULT_DESC = 'กดเพื่อดูของในกาชา — รถ, แฟชั่น, สกินอาวุธ และอื่นๆ';
const TITLE_COLORS = ['#ffffff', '#fbbf24', '#34d399', '#38bdf8', '#fb923c', '#2dd4bf', '#fcd34d'];
const BADGES = {
    new: { label: 'ใหม่', icon: 'star', tone: 'cyan' },
    hot: { label: 'ขายดี', icon: 'fire', tone: 'red' },
    ltd: { label: 'Limited', icon: 'gem', tone: 'violet' },
    rec: { label: 'แนะนำ', icon: 'thumbs-up', tone: 'emerald' },
};
export const COLOR_PRESETS = [
    ['#f97316', 'ส้มไฟ'], ['#fbbf24', 'ทอง'], ['#facc15', 'เหลืองทอง'], ['#22d3ee', 'ฟ้าไซเบอร์'], ['#06b6d4', 'ฟ้าเทอร์คอยซ์'],
    ['#60a5fa', 'น้ำเงินฟ้า'], ['#3b82f6', 'น้ำเงินสด'], ['#a78bfa', 'ม่วงอ่อน'], ['#8b5cf6', 'ม่วงกลาง'], ['#7c3aed', 'ม่วงเข้ม'],
    ['#ec4899', 'ชมพูร้อน'], ['#f472b6', 'ชมพูอ่อน'], ['#fb7185', 'แดงโรส'], ['#ef4444', 'แดงสด'], ['#f43f5e', 'แดงเข้ม'],
    ['#34d399', 'เขียวมรกต'], ['#10b981', 'เขียวเข้ม'], ['#4ade80', 'เขียวสด'], ['#a3e635', 'เขียวมะนาว'], ['#84cc16', 'เขียวมะกอก'],
    ['#d946ef', 'ม็อบไวโอเล็ต'], ['#c084fc', 'ลาเวนเดอร์'], ['#e879f9', 'ฟุกเซีย'], ['#fb923c', 'ส้มอ่อน'], ['#fdba74', 'พีช'],
    ['#fde68a', 'ครีมทอง'], ['#67e8f9', 'ฟ้าอ่อน'], ['#5eead4', 'เทียล'], ['#94a3b8', 'เทาเงิน'], ['#e2e8f0', 'ขาวเงิน'],
].map(([hex, name]) => ({ hex, name }));

let banner = {};
let categories = {};
let items = {};
let activeCat = null;
let shop = null; // { render() } ตอนป็อปอัปเปิดอยู่

export function initGacha() {
    subscribe('gacha_categories', (v) => { categories = v || {}; shop?.render(); });
    subscribe('gacha_items', (v) => { items = v || {}; shop?.render(); });
}

// ---------------------------------------------------------------------------
// ข้อมูลป้าย (รองรับข้อมูลรูปแบบเก่า: title เป็น string, images เป็น string)
const normTitles = (d) => (Array.isArray(d.titles) && d.titles.filter((t) => t?.trim()).length ? d.titles.filter((t) => t?.trim()) : d.title ? [d.title] : [DEFAULT_TITLE]);
function normImages(d) {
    if (!Array.isArray(d.images)) return [];
    return d.images.map((it) => {
        const raw = typeof it === 'string' ? { url: it, focus: 50 } : it || {};
        let f = raw.focus;
        f = f === 'top' ? 0 : f === 'bottom' ? 100 : f === 'center' ? 50 : Number.isFinite(parseFloat(f)) ? Math.min(100, Math.max(0, parseFloat(f))) : 50;
        return { url: raw.url || '', focus: f };
    }).filter((x) => safeUrl(x.url));
}

/** ป้ายร้านบนหน้าฟาร์ม: ชื่อหลายชื่อหมุนทุก 3–4 วิ (flip + สี), รูปหลายรูปหมุนตาม */
export function createShopBanner() {
    const picture = h('img', { class: 'shop-banner__img', alt: '', hidden: true });
    const cart = h('span', { class: 'shop-banner__cart' }, icon('cart-shopping'));
    const titleText = h('span', { class: 'flip' }, DEFAULT_TITLE);
    const desc = h('span', { class: 'shop-banner__desc' }, DEFAULT_DESC);
    const sale = h('span', { class: 'shop-banner__sale' }, icon('tag'), 'SALE');

    const el = h('div', { class: 'shop-banner-wrap' }, sale,
        h('button', { type: 'button', class: 'shop-banner', onclick: openShop, 'aria-label': 'เปิดร้านค้า GACHA' },
            h('span', { class: 'shop-banner__shine', 'aria-hidden': 'true' }),
            picture, cart,
            h('span', { class: 'shop-banner__shade', 'aria-hidden': 'true' }),
            h('span', { class: 'shop-banner__text' }, h('span', { class: 'shop-banner__title clamp-2' }, titleText), desc),
            icon('chevron-right', 'solid', 'shop-banner__arrow')),
        h('button', { type: 'button', class: 'btn btn--sm shop-banner__edit admin-only', onclick: editBanner }, icon('pen'), 'แก้ป้าย'));

    let timer = null;
    let signature = '';

    const setPicture = (im) => {
        const u = im ? safeUrl(im.url) : '';
        picture.hidden = !u;
        cart.hidden = !!u;
        if (u) { picture.src = u; picture.style.objectPosition = `center ${im.focus}%`; }
    };
    const flip = (text, color) => {
        titleText.classList.remove('is-in');
        titleText.classList.add('is-out');
        setTimeout(() => {
            titleText.textContent = text;
            titleText.style.color = color;
            titleText.classList.replace('is-out', 'is-in');
        }, 280);
    };

    subscribe('gacha_banner', (v) => {
        banner = v || {};
        const titles = normTitles(banner);
        const images = normImages(banner);
        desc.textContent = banner.desc || DEFAULT_DESC;
        sale.hidden = banner.saleVisible === false;
        const sig = JSON.stringify([titles, images]);
        if (sig === signature) return;
        signature = sig;
        clearTimeout(timer);
        titleText.textContent = titles[0];
        titleText.style.color = TITLE_COLORS[0];
        setPicture(images[0]);
        if (titles.length <= 1 && images.length <= 1) return;
        let step = 0;
        const tick = () => {
            step++;
            if (titles.length > 1) flip(titles[step % titles.length], TITLE_COLORS[(step % titles.length) % TITLE_COLORS.length]);
            if (images.length > 1) setPicture(images[step % images.length]);
            timer = setTimeout(tick, 3000 + Math.random() * 1000);
        };
        timer = setTimeout(tick, 3000 + Math.random() * 1000);
    });

    return el;
}

function editBanner() {
    openFormModal({
        title: 'แก้ไขป้ายร้านค้า GACHA', icon: 'pen-to-square', tone: 'violet', folder: 'banner',
        values: { titles: normTitles(banner).join('\n'), desc: banner.desc || '', images: normImages(banner), saleVisible: banner.saleVisible !== false },
        fields: [
            { name: 'titles', label: 'ชื่อหัวข้อป้าย (ใส่ได้หลายชื่อ — แยกด้วย Enter)', type: 'textarea', rows: 3, help: 'ถ้าใส่หลายชื่อ ชื่อจะสลับวนไปเรื่อยๆ บนป้าย ทุก 3–4 วินาที' },
            { name: 'desc', label: 'คำอธิบายใต้ชื่อ', maxlength: 100, placeholder: DEFAULT_DESC },
            { name: 'images', label: 'รูปภาพประกอบป้าย', type: 'focusImages', help: 'แนะนำรูปแนวนอน (เช่น 1920×1080) — ปรับโฟกัสบน→ล่างได้ / หลายรูปจะหมุนพร้อมชื่อ / ไม่ใส่รูป = โชว์ไอคอนตะกร้า' },
            { name: 'saleVisible', label: 'แสดงป้าย SALE', type: 'switch', icon: 'tag' },
        ],
        onSubmit: (v) => set('gacha_banner', {
            titles: v.titles.split(/\r?\n/).map((t) => t.trim()).filter(Boolean),
            desc: v.desc, images: v.images, saleVisible: v.saleVisible,
        }),
    });
}

// ---------------------------------------------------------------------------
const sortedCats = () => Object.keys(categories).sort((a, b) => (categories[a].order || 0) - (categories[b].order || 0));
const catColor = (id) => safeColor(categories[id]?.color);

export function openShop() {
    const tabs = h('div', { class: 'shop__tabs', role: 'tablist' });
    const title = h('h3', { class: 'shop__sign' });
    const catActions = h('div', { class: 'shop__cat-actions admin-only' });
    const grid = h('div', { class: 'shop__grid' });
    const headTitle = h('h2', { class: 'shop__title' }, normTitles(banner)[0] || 'ร้านค้า GACHA ประจำเซิฟเวอร์');

    const body = h('div', { class: 'shop' },
        h('header', { class: 'shop__head' },
            h('span', { class: 'shop__logo' }, icon('cart-shopping')),
            h('div', { class: 'shop__head-text' }, headTitle,
                h('p', null, icon('circle-info'), ' ', banner.desc || 'รวมไอเทมในกาชาทั้งหมด เลือกหมวดหมู่เพื่อดูรายละเอียด')),
            h('button', { type: 'button', class: 'icon-btn icon-btn--danger', 'aria-label': 'ปิด', onclick: () => m.close() }, icon('xmark'))),
        h('div', { class: 'shop__roof' }, tabs,
            h('button', { type: 'button', class: 'btn btn--soft btn--sm admin-only', onclick: () => editCategory() }, icon('plus'), 'เพิ่มหมวดหมู่ใหม่')),
        h('div', { class: 'shop__store' },
            h('div', { class: 'shop__awning', 'aria-hidden': 'true' }),
            h('div', { class: 'shop__bar' }, title, catActions),
            h('div', { class: 'shop__scroll scroll-y' }, grid)));

    const render = () => {
        const keys = sortedCats();
        if (!activeCat || !categories[activeCat]) activeCat = keys[0] || null;
        mount(tabs, keys.length ? keys.map((k) => h('button', {
            type: 'button', role: 'tab', class: 'shop__tab', 'aria-selected': String(k === activeCat),
            style: { '--cat': hexToRgb(catColor(k)) },
            onclick: () => { activeCat = k; render(); },
        }, icon('tag'), categories[k].name || 'ไม่มีชื่อ')) : h('span', { class: 'muted' }, icon('circle-info'), ' ยังไม่มีหมวดหมู่ Gacha'));

        body.style.setProperty('--cat', hexToRgb(activeCat ? catColor(activeCat) : '#f97316'));
        mount(title, icon('basket-shopping'), activeCat ? ` หมวดหมู่: ${categories[activeCat].name || ''}` : ' เลือกหมวดหมู่เพื่อดูสินค้า');
        mount(catActions, activeCat ? [
            h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: () => editCategory(activeCat) }, icon('pen-to-square'), 'แก้ไขชื่อ/สีหมวด'),
            h('button', { type: 'button', class: 'btn btn--danger btn--sm', onclick: () => deleteCategory(activeCat) }, icon('trash'), 'ลบหมวดนี้'),
            h('button', { type: 'button', class: 'btn btn--primary btn--sm', onclick: () => editItem() }, icon('cart-plus'), 'เพิ่มไอเทม'),
        ] : []);

        if (!activeCat) { mount(grid, h('div', { class: 'empty-state' }, icon('hand-pointer'), 'เลือกหมวดหมู่ด้านบนเพื่อดูสินค้า')); return; }
        const list = Object.keys(items).filter((k) => items[k]?.categoryId === activeCat);
        mount(grid, list.length
            ? list.map((k, i) => productCard(k, items[k], i + 1))
            : h('div', { class: 'empty-state' }, icon('basket-shopping'), 'ยังไม่มีไอเทมในหมวดนี้'));
    };

    shop = { render };
    const m = openModal({ bare: true, body, onClose: () => { shop = null; } });
    render();
}

function specLines(detail) {
    const lines = String(detail || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return [h('p', { class: 'muted' }, 'ยังไม่มีรายละเอียดสินค้า')];
    return lines.map((l) => {
        const m = l.match(/^([^:：]{1,28}?)\s*[:：]\s*(.+)$/);
        return m
            ? h('div', { class: 'spec' }, h('span', { class: 'spec__k' }, m[1]), h('span', { class: 'spec__v' }, m[2]))
            : h('div', { class: 'point' }, icon('circle-check'), h('span', null, l));
    });
}

function productCard(key, d, no, { zoomed = false } = {}) {
    const badge = BADGES[d.badge];
    const price = String(d.price ?? '').trim();
    const el = h('article', {
        class: ['product', zoomed && 'is-zoomed'], role: zoomed ? null : 'button', tabindex: zoomed ? null : '0',
        onclick: zoomed ? null : () => zoomProduct(key, d, no),
        onkeydown: zoomed ? null : (e) => { if (e.target === el && e.key === 'Enter') zoomProduct(key, d, no); },
    },
        h('div', { class: 'product__media' },
            badge ? h('span', { class: 'chip chip--glow product__badge', dataset: { tone: badge.tone } }, icon(badge.icon), badge.label) : null,
            h('span', { class: 'product__no' }, '#' + String(no).padStart(2, '0')),
            safeUrl(d.image) ? img(d.image, { alt: d.name || '' }) : h('span', { class: 'product__noimg' }, icon('cart-shopping'))),
        h('div', { class: 'product__body' },
            h('span', { class: 'product__cat' }, categories[d.categoryId]?.name || ''),
            h('h4', { class: 'product__name' }, d.name || 'ไม่มีชื่อ'),
            price ? h('div', { class: 'product__price' }, h('span', null, 'ราคา'), h('b', null, price), /^[\d,.]+$/.test(price) ? h('small', null, 'บาท') : null) : null,
            h('div', { class: 'product__sec' }, icon('list-ul'), ' รายละเอียดสินค้า'),
            h('div', { class: 'product__detail scroll-y' }, specLines(d.detail))),
        zoomed ? null : h('div', { class: 'product__foot' },
            h('span', { class: 'product__cta' }, icon('magnifying-glass-plus'), ' ดูรายละเอียดสินค้า'),
            h('div', { class: 'product__admin admin-only' },
                h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: (e) => { e.stopPropagation(); editItem(key); } }, icon('pen-to-square'), 'แก้ไข'),
                h('button', { type: 'button', class: 'btn btn--danger btn--sm', onclick: (e) => { e.stopPropagation(); deleteItem(key); } }, icon('trash'), 'ลบ'))));
    el.style.setProperty('--cat', hexToRgb(catColor(d.categoryId)));
    return el;
}

function zoomProduct(key, d, no) {
    const m = openModal({ bare: true, body: h('div', { class: 'card-zoom card-zoom--wide' }, productCard(key, d, no, { zoomed: true }),
        h('button', { type: 'button', class: 'icon-btn card-zoom__close', 'aria-label': 'ปิด', onclick: () => m.close() }, icon('xmark'))) });
}

function editCategory(key) {
    const c = key ? categories[key] : null;
    openFormModal({
        title: key ? 'แก้ไขหมวดหมู่ GACHA' : 'เพิ่มหมวดหมู่ GACHA', icon: 'tags', size: 'sm',
        values: { name: c?.name || '', color: c?.color || COLOR_PRESETS[0].hex },
        fields: [
            { name: 'name', label: 'ชื่อหมวดหมู่ (เช่น รถ, แฟชั่น, สกินอาวุธ)', required: true, autofocus: true },
            { name: 'color', label: 'สีประจำหมวดหมู่', type: 'color', options: COLOR_PRESETS },
        ],
        onSubmit: async (v) => {
            const id = key || newId();
            const nextOrder = Math.max(-1, ...Object.values(categories).map((x) => Number(x.order) || 0)) + 1;
            await set(`gacha_categories/${id}`, { name: v.name, color: v.color, order: c ? c.order ?? 0 : nextOrder });
            activeCat = id;
        },
    });
}

async function deleteCategory(key) {
    if (!await confirmDialog('ลบหมวดหมู่นี้ถาวร? (ไอเทมทั้งหมดในหมวดนี้จะถูกลบไปด้วย)', { danger: true, okText: 'ลบหมวด' })) return;
    try {
        await Promise.all(Object.keys(items).filter((k) => items[k]?.categoryId === key).map((k) => remove(`gacha_items/${k}`)));
        await remove(`gacha_categories/${key}`);
        activeCat = null;
        toast('ลบหมวดหมู่แล้ว', 'info');
    } catch (e) { toast('ลบไม่สำเร็จ', 'error'); }
}

function editItem(key) {
    const d = key ? items[key] : null;
    const categoryId = d?.categoryId || activeCat;
    if (!categoryId) { toast('กรุณาเลือกหมวดหมู่ก่อน', 'error'); return; }
    openFormModal({
        title: key ? 'แก้ไขไอเทม GACHA' : 'เพิ่มไอเทม GACHA', icon: 'cart-shopping', folder: 'gacha',
        values: d || { badge: '' },
        fields: [
            { name: 'image', label: 'รูปภาพ', type: 'url', preview: true },
            { name: 'name', label: 'ชื่อไอเทม (เช่น ชื่อรถ / ชื่อชุด / ชื่อสกินอาวุธ)', required: true, autofocus: true },
            { name: 'price', label: 'ราคา (ไม่บังคับ)', placeholder: 'เช่น 199' },
            { name: 'badge', label: 'ป้ายสินค้า (ไม่บังคับ)', type: 'select', options: [{ value: '', label: 'ไม่มีป้าย' }, ...Object.entries(BADGES).map(([value, b]) => ({ value, label: b.label }))] },
            { name: 'detail', label: 'รายละเอียดเพิ่มเติม (ไม่บังคับ)', type: 'textarea', rows: 5, help: 'พิมพ์ทีละบรรทัด — "หัวข้อ: ค่า" จะแสดงเป็นตารางสเปก / บรรทัดธรรมดาแสดงเป็นจุดเด่นสินค้า' },
        ],
        onSubmit: (v) => set(`gacha_items/${key || newId()}`, { ...v, categoryId }),
    });
}

async function deleteItem(key) {
    if (!await confirmDialog(`ต้องการลบไอเทม "${items[key]?.name || ''}" ถาวร?`, { danger: true, okText: 'ลบ' })) return;
    await remove(`gacha_items/${key}`).then(() => toast('ลบแล้ว', 'info'), () => toast('ลบไม่สำเร็จ', 'error'));
}
