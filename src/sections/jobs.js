// ===== ข้อมูลงานฟาร์ม (งานขาว / งานดำ) + หน้ารายละเอียดงาน =====
// jobs/<id> = { name, image, type: 'งานขาว'|'งานดำ', difficulty, isHot, requiredItems[], howto, steps[{text,image}] }
import { h, icon, img, mount } from '../lib/dom.js';
import { newId, remove, set, subscribe } from '../lib/store.js';
import { openModal } from '../ui/modal.js';
import { openFormModal } from '../ui/form.js';
import { confirmDialog, toast } from '../ui/dialog.js';
import { openLightbox } from '../ui/lightbox.js';
import { reveal } from '../ui/reveal.js';
import { loading } from './collection.js';
import { openCalculator } from './calculator.js';

const WHITE = 'งานขาว';
const BLACK = 'งานดำ';

const DIFFICULTY = {
    'ง่าย': { cls: 'easy', stars: 1 },
    'ปานกลาง': { cls: 'medium', stars: 2 },
    'ยาก': { cls: 'hard', stars: 3 },
    'ยากมาก': { cls: 'vhard', stars: 0 },
};

function difficultyBadge(level, { long = false } = {}) {
    const name = DIFFICULTY[level] ? level : 'ง่าย';
    const d = DIFFICULTY[name];
    return h('span', { class: `diff diff--${d.cls}` }, icon('shield-halved'), long ? ` ระดับความยาก: ${name} ` : ` ${name} `,
        d.stars ? Array.from({ length: d.stars }, () => icon('star')) : icon('skull'));
}

const typeChip = (type) => type === BLACK
    ? h('span', { class: 'chip job-type', dataset: { tone: 'orange' } }, icon('circle'), 'งานดำ')
    : h('span', { class: 'chip job-type', dataset: { tone: 'cyan' } }, icon('circle', 'regular'), 'งานขาว');

const FIELDS = [
    { name: 'isHot', type: 'switch', label: 'เปิดโหมดงานยอดนิยม (งานฮอตฮิต)', icon: 'fire', hint: 'การ์ดจะมีกรอบไฟนีออนส้มโชว์เด่น' },
    { name: 'name', label: 'ชื่องานฟาร์ม', required: true, autofocus: true },
    { name: 'image', label: 'รูปภาพประกอบงาน', type: 'url', preview: true, required: true },
    { name: 'type', label: 'ประเภทงาน', type: 'select', options: [{ value: WHITE, label: 'งานขาว' }, { value: BLACK, label: 'งานดำ' }] },
    { name: 'difficulty', label: 'ระดับความยากของงาน', type: 'select', options: Object.keys(DIFFICULTY).map((v) => ({ value: v, label: v })) },
    { name: 'requiredItems', label: 'ไอเทมที่จำเป็นต้องใช้ฟาร์ม', type: 'list', addLabel: 'เพิ่มไอเทม', itemPlaceholder: 'เช่น จอบขุดดิน / กล่องพัสดุ', showIf: (v) => v.type === WHITE },
    { name: 'howto', label: 'คำโปรยสั้นๆ (โชว์บนการ์ด)', type: 'textarea', rows: 3, placeholder: 'อธิบายงานนี้คร่าวๆ (รายละเอียดเต็มใส่เป็นขั้นตอนด้านล่าง)' },
    { name: 'steps', label: 'ขั้นตอนการฟาร์ม (ใส่รูปประกอบได้ ไม่บังคับ)', type: 'steps', help: 'ใส่เรียงตามลำดับ แต่ละขั้นใส่รูป (เช่น แมพ/จุดฟาร์ม) แยกได้' },
];

export function createJobs() {
    let jobs = {};
    let filter = 'all';

    const whiteGrid = h('div', { class: 'job-grid' }, loading('งานฟาร์ม'));
    const blackGrid = h('div', { class: 'job-grid' });
    const whiteGroup = h('div', { class: 'job-group' }, h('h3', { class: 'job-group__head', dataset: { tone: 'cyan' } }, 'หมวดหมู่: งานขาว (งานถูกกฎหมายรอบเมือง)'), whiteGrid);
    const blackGroup = h('div', { class: 'job-group' }, h('h3', { class: 'job-group__head', dataset: { tone: 'orange' } }, 'หมวดหมู่: งานดำ (งานใต้ดินมืด)'), blackGrid);

    const filters = [['all', 'ทั้งหมด', 'list'], ['white', 'งานขาว', 'circle'], ['black', 'งานดำ', 'circle']].map(([id, label, ic]) =>
        h('button', {
            type: 'button', class: 'segmented__btn', dataset: { filter: id }, 'aria-pressed': String(id === filter),
            onclick: () => { filter = id; applyFilter(); },
        }, icon(ic, id === 'white' ? 'regular' : 'solid'), label));

    const el = h('section', { class: 'jobs' },
        h('header', { class: 'section-head', dataset: { tone: 'cyan' } },
            h('h2', null, icon('briefcase'), 'ข้อมูลวิธีทำและระบบงานฟาร์มทั้งหมดในประเทศ'),
            h('div', { class: 'section-head__actions admin-only' },
                h('button', { type: 'button', class: 'btn btn--primary', onclick: () => edit() }, icon('plus'), 'เพิ่มข้อมูลงานฟาร์มใหม่'))),
        h('div', { class: 'jobs__toolbar' },
            h('div', { class: 'segmented', role: 'group', 'aria-label': 'กรองประเภทงาน' }, filters),
            h('button', { type: 'button', class: 'btn btn--primary', onclick: openCalculator }, icon('calculator'), icon('truck-pickup'), 'เปิดเครื่องคำนวณรถโล (งานปลากระป๋อง)')),
        whiteGroup, blackGroup);

    function applyFilter() {
        filters.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
        whiteGroup.hidden = filter === 'black';
        blackGroup.hidden = filter === 'white';
    }
    applyFilter();

    subscribe('jobs', (v) => { jobs = v || {}; render(); });

    function render() {
        const keys = Object.keys(jobs);
        const make = (type) => {
            const list = keys.filter((k) => (jobs[k].type === BLACK ? BLACK : WHITE) === type);
            return list.length ? list.map((k) => card(k, jobs[k])) : h('div', { class: 'empty-state' }, icon('briefcase'), `ยังไม่มีข้อมูล${type}`);
        };
        mount(whiteGrid, make(WHITE));
        mount(blackGrid, make(BLACK));
        reveal(whiteGrid);
        reveal(blackGrid);
    }

    function card(key, job) {
        const hot = job.isHot === true;
        const items = (job.requiredItems || []).filter(Boolean);
        const el = h('article', {
            class: ['job-card', hot && 'is-hot'], role: 'button', tabindex: '0',
            'aria-label': `ดูรายละเอียด ${job.name || ''}`,
            onclick: () => openJobDetail(job),
            onkeydown: (e) => { if (e.target === el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openJobDetail(job); } },
        },
            hot ? h('div', { class: 'hot-ribbon' }, icon('fire'), h('span', null, 'HOT RECOMMEND')) : null,
            h('div', { class: 'job-card__media' }, img(job.image, { alt: '' }), typeChip(job.type)),
            h('div', { class: 'job-card__body' },
                h('h3', { class: 'job-card__name' }, h('span', { class: 'job-card__dot' }), h('span', { class: 'clamp-2' }, job.name)),
                job.type !== BLACK ? h('div', { class: 'job-card__items' },
                    h('span', { class: 'info-card__label' }, icon('toolbox'), ' ITEMS ที่ต้องใช้ในการฟาร์ม'),
                    h('div', { class: 'job-card__chips' }, items.length ? items.map((i) => h('span', { class: 'item-chip' }, icon('box'), i)) : h('span', { class: 'muted' }, 'ไม่มีไอเทมเงื่อนไข'))) : null,
                job.howto
                    ? h('p', { class: 'job-card__howto clamp-3' }, job.howto)
                    : h('p', { class: 'job-card__howto is-empty' }, icon('hand-pointer'), ' กดที่การ์ดเพื่อดูขั้นตอนการฟาร์ม'),
                h('div', { class: 'job-card__foot' },
                    difficultyBadge(job.difficulty),
                    h('span', { class: 'job-card__hint' }, icon('circle-info'), ' ดูรายละเอียด')),
                h('div', { class: 'info-card__admin admin-only' },
                    h('button', { type: 'button', class: 'btn btn--ghost btn--sm', onclick: (e) => { e.stopPropagation(); edit(key); } }, icon('pen-to-square'), 'แก้ไข'),
                    h('button', { type: 'button', class: 'btn btn--danger btn--sm', onclick: (e) => { e.stopPropagation(); del(key); } }, icon('trash'), 'ลบ'))));
        return el;
    }

    function edit(key) {
        openFormModal({
            title: key ? 'แก้ไขคู่มือข้อมูลงานฟาร์ม' : 'เพิ่มคู่มือข้อมูลงานฟาร์มชุดใหม่', icon: 'briefcase', tone: 'cyan', size: 'lg', folder: 'jobs',
            fields: FIELDS,
            values: key ? jobs[key] : { type: WHITE, difficulty: 'ง่าย', isHot: false },
            onSubmit: (v) => set(`jobs/${key || newId()}`, { ...v, requiredItems: v.type === WHITE ? v.requiredItems : [] }),
        });
    }

    async function del(key) {
        if (!await confirmDialog(`ต้องการลบคู่มือ "${jobs[key]?.name || ''}" ถาวร?`, { danger: true, okText: 'ลบ' })) return;
        await remove(`jobs/${key}`).then(() => toast('ลบแล้ว', 'info'), () => toast('ลบไม่สำเร็จ', 'error'));
    }

    return el;
}

// ---------------------------------------------------------------------------
function openJobDetail(job) {
    const hot = job.isHot === true;
    const items = (job.requiredItems || []).filter(Boolean);
    let steps = (job.steps || []).filter((s) => s && (s.text || s.image));
    if (!steps.length && job.howto?.trim()) steps = [{ text: job.howto, image: '' }];

    const box = h('article', { class: ['job-detail', hot && 'is-hot'] },
        h('div', { class: 'job-detail__hero' },
            img(job.image, { alt: '' }),
            hot ? h('div', { class: 'job-detail__embers', 'aria-hidden': 'true' }, Array.from({ length: 7 }, () => h('span'))) : null,
            typeChip(job.type),
            h('button', { type: 'button', class: 'icon-btn job-detail__close', 'aria-label': 'ปิด', onclick: () => m.close() }, icon('xmark'))),
        h('div', { class: 'job-detail__body scroll-y' },
            h('h2', { class: 'job-detail__name' }, job.name || ''),
            h('div', { class: 'job-detail__badges' },
                difficultyBadge(job.difficulty, { long: true }),
                hot ? h('span', { class: 'hot-badge' }, icon('fire'), ' งานฮอตฮิต') : null),
            job.type !== BLACK && items.length ? h('section', { class: 'detail-section' },
                h('h3', null, icon('toolbox'), 'ITEMS ที่ต้องใช้'),
                h('div', { class: 'job-card__chips' }, items.map((i) => h('span', { class: 'item-chip item-chip--lg' }, icon('box'), i)))) : null,
            h('section', { class: 'detail-section' },
                h('h3', null, icon('list-check'), 'ขั้นตอนการฟาร์ม'),
                steps.length
                    ? h('ol', { class: 'steps' }, steps.map((s, i) => h('li', { class: 'step' },
                        h('span', { class: 'step__no' }, i + 1),
                        h('div', { class: 'step__body' },
                            s.text ? h('p', { class: 'pre-line' }, s.text) : null,
                            s.image ? h('button', { type: 'button', class: 'step__img', 'aria-label': 'ขยายรูปประกอบ', onclick: () => openLightbox(s.image) }, img(s.image, { alt: `รูปประกอบขั้นที่ ${i + 1}` })) : null))))
                    : h('p', { class: 'muted' }, 'ยังไม่มีข้อมูลขั้นตอนสำหรับงานนี้'))));

    const m = openModal({ bare: true, body: box });
    if (hot) enableTilt(box, m);
}

/** การ์ดงานฮอต: เอียง 3 มิติตามเมาส์ (เฉพาะอุปกรณ์ที่มีเมาส์) */
function enableTilt(box, modal) {
    if (!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e) => {
        const r = box.getBoundingClientRect();
        const x = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5));
        const y = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5));
        box.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
        box.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
    };
    document.addEventListener('mousemove', move);
    const close = modal.close;
    modal.close = () => { document.removeEventListener('mousemove', move); close(); };
}
