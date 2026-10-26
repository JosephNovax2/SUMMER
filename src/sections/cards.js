// ===== หมวดการ์ด: ผลไม้ปีศาจ / แฟชั่น / รูน / แหล่งที่มา ITEMS / อาหาร =====
import { h, icon, img } from '../lib/dom.js';
import { openModal } from '../ui/modal.js';
import { createCollection } from './collection.js';

const IMAGE_FIELD = { name: 'image', label: 'รูปภาพ', type: 'url', preview: true };
const NAME_FIELD = (placeholder) => ({ name: 'name', label: 'ชื่อ', required: true, placeholder, autofocus: true });

/** เรียงจากระดับสูงไปต่ำตามตาราง rank */
const byRank = (rankOf) => (a, b) => rankOf(b) - rankOf(a);

// ---------------------------------------------------------------------------
// ผลไม้ปีศาจ
const DEVIL_TIERS = {
    Mythic: { rank: 5, tone: 'red', icon: 'skull', glow: true, label: '🔴 Mythic (ตำนาน)' },
    Legendary: { rank: 4, tone: 'gold', icon: 'crown', glow: true, label: '🟡 Legendary (หายากที่สุด)' },
    EPIC: { rank: 3, tone: 'purple', icon: 'gem', glow: true, label: '🟣 EPIC (หายากมาก)' },
    Rare: { rank: 2, tone: 'sky', icon: 'diamond', label: '🔵 Rare (หายาก)' },
    Common: { rank: 1, tone: 'green', icon: 'leaf', label: '🟢 Common (ธรรมดา)' },
};
const devilTier = (d) => DEVIL_TIERS[d.tier] || DEVIL_TIERS.Common;

function devils() {
    createCollection({
        tab: 'devil', path: 'devils', title: 'ข้อมูลผลไม้ปีศาจ', icon: 'fire', noun: 'ผลไม้ปีศาจ',
        sort: byRank((d) => devilTier(d).rank),
        view: (d) => {
            const t = devilTier(d);
            return { tone: t.tone, glow: t.glow, icon: 'fire', chip: { label: d.tier || 'Common', icon: t.icon }, label: 'ข้อมูลสถานะ', text: d.status };
        },
        defaults: { tier: 'Common' },
        fields: [
            IMAGE_FIELD, NAME_FIELD('เช่น กูมะกูมะโนะมิ'),
            { name: 'tier', label: 'ระดับ (Tier)', type: 'select', options: Object.entries(DEVIL_TIERS).reverse().map(([value, t]) => ({ value, label: t.label })) },
            { name: 'status', label: 'ข้อมูลสถานะ (พิมพ์ได้ยาว รองรับหลายสถานะ)', type: 'textarea', rows: 6, placeholder: 'เช่น\n- สกิลพิเศษ : ...\n- เมื่อรับประทาน จะได้รับ...' },
        ],
    });
}

// ---------------------------------------------------------------------------
// แฟชั่น
const FASHION_TYPES = [
    { value: 'แฟชั่น Topdonate', match: 'Topdonate', rank: 6, tone: 'gold', icon: 'crown', glow: true, label: 'แฟชั่น Topdonate (หายากที่สุด)' },
    { value: 'แฟชั่นประมูล', match: 'ประมูล', rank: 5, tone: 'red', icon: 'fire', glow: true, label: 'แฟชั่นประมูล' },
    { value: 'แฟชั่น Celebrity', match: 'Celebrity', rank: 4, tone: 'blue', icon: 'gem', glow: true, label: 'แฟชั่น Celebrity' },
    { value: 'แฟชั่นยอด30k', match: '30k', rank: 3, tone: 'violet', icon: 'coins', label: 'แฟชั่นยอด30k' },
    { value: 'แฟชั่นกิจกรรม', match: 'กิจกรรม', rank: 2, tone: 'green', icon: 'star', label: 'แฟชั่นกิจกรรม' },
    { value: 'แฟชั่นปกติ', match: '', rank: 1, tone: 'neutral', icon: 'shirt', label: 'แฟชั่นปกติ' },
];
const fashionType = (d) => FASHION_TYPES.find((t) => t.match && String(d.category || '').includes(t.match)) || FASHION_TYPES[FASHION_TYPES.length - 1];

function fashion() {
    createCollection({
        tab: 'fashion', path: 'fashions', title: 'ข้อมูลสถานะแฟชั่น', icon: 'shirt', tone: 'amber', noun: 'แฟชั่น',
        sort: byRank((d) => fashionType(d).rank),
        view: (d) => {
            const t = fashionType(d);
            return { tone: t.tone, glow: t.glow, icon: 'shirt', chip: { label: d.category || 'แฟชั่นปกติ', icon: t.icon }, label: 'ข้อมูลสถานะ', labelIcon: 'star', text: d.status };
        },
        defaults: { category: 'แฟชั่นปกติ' },
        fields: [
            IMAGE_FIELD,
            { name: 'category', label: 'ประเภทแฟชั่น', type: 'select', options: FASHION_TYPES.map((t) => ({ value: t.value, label: t.label })) },
            NAME_FIELD('เช่น ชุดนักสืบ / หมวกคาวบอย'),
            { name: 'status', label: 'ข้อมูลสถานะแฟชั่น (พิมพ์ได้ยาว รองรับหลายสถานะ)', type: 'textarea', rows: 5, placeholder: 'เช่น\n- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗' },
        ],
    });
}

// ---------------------------------------------------------------------------
// รูน
function runes() {
    createCollection({
        tab: 'rune', path: 'runes', title: 'ข้อมูลรูน', icon: 'scroll', tone: 'cyan', noun: 'รูน',
        view: (d) => ({
            tone: 'cyan', icon: 'scroll', label: 'ข้อมูลรายละเอียด', labelIcon: 'circle-info', text: d.detail,
            tags: String(d.weapons || '').split(/[,\n]+/).map((x) => x.trim()).filter(Boolean),
        }),
        fields: [
            IMAGE_FIELD, NAME_FIELD('เช่น รูนแห่งเปลวเพลิง'),
            { name: 'weapons', label: 'อาวุธที่ใส่ได้ (คั่นด้วย , หรือขึ้นบรรทัดใหม่)', type: 'textarea', rows: 2, placeholder: 'เช่น ดาบ, ปืนพก, ธนู' },
            { name: 'detail', label: 'ข้อมูลรายละเอียด (พิมพ์ได้ยาว)', type: 'textarea', rows: 5, placeholder: 'เช่น\nเอฟเฟกต์: เพิ่มดาเมจ 5%' },
        ],
    });
}

// ---------------------------------------------------------------------------
// แหล่งที่มา ITEMS
function items() {
    createCollection({
        tab: 'items', path: 'items', title: 'ข้อมูลแหล่งที่มาของ ITEMS', icon: 'bag-shopping', tone: 'cyan', noun: ' ITEM',
        view: (d) => ({ tone: 'orange', icon: 'cube', label: 'แหล่งที่มา', labelIcon: 'map-pin', text: d.source }),
        fields: [
            IMAGE_FIELD, NAME_FIELD('เช่น จอบขุดดิน / กล่องพัสดุ'),
            { name: 'source', label: 'แหล่งที่มา / วิธีหาได้จากไหน (อธิบายได้ยาว)', type: 'textarea', rows: 5, placeholder: 'เช่น\n- ซื้อจากร้านค้า XYZ ราคา 500$\n- ดรอปจากงานดำ' },
        ],
    });
}

// ---------------------------------------------------------------------------
// อาหาร (กดการ์ดเปิดหน้ารายละเอียด)
const FOOD_TIERS = {
    'ทอง': { rank: 3, tone: 'gold', icon: 'crown', label: 'Legendary', option: '🟡 Legendary (หายากที่สุด)' },
    'ม่วง': { rank: 2, tone: 'violet', icon: 'gem', label: 'EPIC', option: '🟣 EPIC (หายาก)' },
    'เขียว': { rank: 1, tone: 'green', icon: 'leaf', label: 'Common', option: '🟢 Common (ธรรมดา)' },
};
const foodTier = (d) => FOOD_TIERS[d.tier] || FOOD_TIERS['เขียว'];

function foods() {
    createCollection({
        tab: 'food', path: 'foods', title: 'ข้อมูลอาหาร', icon: 'utensils', tone: 'emerald', noun: 'อาหาร',
        sort: byRank((d) => foodTier(d).rank),
        view: (d) => {
            const t = foodTier(d);
            return { tone: t.tone, glow: true, icon: 'utensils', chip: { label: t.label, icon: t.icon }, label: 'ข้อมูล', labelIcon: 'circle-info', text: d.desc };
        },
        onOpen: (key, d) => openFoodDetail(d),
        defaults: { tier: 'เขียว' },
        fields: [
            IMAGE_FIELD, NAME_FIELD('เช่น ข้าวผัดทะเล / สเต็กเนื้อ'),
            { name: 'tier', label: 'ระดับอาหาร', type: 'select', options: Object.entries(FOOD_TIERS).reverse().map(([value, t]) => ({ value, label: t.option })) },
            { name: 'desc', label: 'ข้อมูล/คำอธิบายอาหาร (เอฟเฟกต์ / วิธีทำ / ที่มา)', type: 'textarea', rows: 5, placeholder: 'เช่น\n- ฟื้นฟูค่าความหิว 100 หน่วย' },
            { name: 'craft', label: 'วัตถุดิบที่ใช้ในการคราฟต์ (ไม่บังคับ)', type: 'textarea', rows: 3, placeholder: 'เช่น\nไม้ที่ยังไม่แปรรูป = 2 EA' },
            { name: 'ingredientImgs', label: 'รูปวัตถุดิบ/ส่วนผสม (ไม่บังคับ)', type: 'list', itemType: 'url', addLabel: 'เพิ่มรูป', itemPlaceholder: '' },
        ],
    });
}

function openFoodDetail(d) {
    const t = foodTier(d);
    const section = (label, ic, ...children) => h('section', { class: 'detail-section' }, h('h3', null, icon(ic), label), ...children);
    const body = h('article', { class: 'detail-card is-glow', dataset: { tone: t.tone } },
        h('div', { class: 'detail-card__hero' },
            img(d.image, { alt: d.name || '' }),
            h('span', { class: 'chip chip--glow chip--lg detail-card__badge' }, icon(t.icon), t.label)),
        h('div', { class: 'detail-card__body scroll-y' },
            h('h2', { class: 'detail-card__title' }, d.name || ''),
            section('ข้อมูลอาหาร', 'circle-info', h('p', { class: 'detail-text pre-line' }, d.desc || 'ยังไม่มีข้อมูล')),
            d.craft?.trim() ? section('วัตถุดิบที่ใช้ในการคราฟต์', 'hammer', h('p', { class: 'detail-text pre-line' }, d.craft.trim())) : null,
            d.ingredientImgs?.length ? section('รูปวัตถุดิบ/ส่วนผสม', 'images',
                h('div', { class: 'ingredient-grid' }, d.ingredientImgs.map((u) => h('div', { class: 'ingredient' }, img(u, { draggable: 'false' }))))) : null));
    const m = openModal({ bare: true, body: h('div', { class: 'detail-wrap' }, body,
        h('button', { type: 'button', class: 'icon-btn detail-card__close', 'aria-label': 'ปิด', onclick: () => m.close() }, icon('xmark'))) });
}

export function initCardSections() {
    devils();
    fashion();
    runes();
    items();
    foods();
}
