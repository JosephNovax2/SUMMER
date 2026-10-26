// ===== สลับหมวด (แท็บ) — จำหมวดไว้ใน URL เช่น #fashion ปุ่มย้อนกลับของเบราว์เซอร์ใช้ได้ =====
import { TAB_CUTSCENE_MS } from '../config.js';
import { emit } from '../lib/bus.js';
import { playCutscene } from './cutscene.js';

export const TABS = [
    { id: 'farm', label: 'ข้อมูลงานฟาร์ม', icon: 'wheat-awn' },
    { id: 'food', label: 'ข้อมูลอาหาร', icon: 'drumstick-bite' },
    { id: 'devil', label: 'ผลไม้ปีศาจ', icon: 'apple-whole' },
    { id: 'rune', label: 'ข้อมูลรูน', icon: 'scroll' },
    { id: 'fashion', label: 'สถานะแฟชั่น', icon: 'shirt' },
    { id: 'items', label: 'แหล่งที่มา ITEMS', icon: 'cube' },
    { id: 'events', label: 'เวลากิจกรรม', icon: 'calendar-days' },
    { id: 'gkey', label: 'เมนูลัดปุ่ม G', icon: 'keyboard' },
];

let current = null;

export const currentTab = () => current;

const fromHash = () => {
    const id = location.hash.replace('#', '');
    return TABS.some((t) => t.id === id) ? id : 'farm';
};

function show(id) {
    current = id;
    document.querySelectorAll('.panel').forEach((p) => { p.hidden = p.dataset.tab !== id; });
    document.querySelectorAll('[data-nav]').forEach((b) => {
        const on = b.dataset.nav === id;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-current', on ? 'page' : 'false');
    });
    document.body.classList.remove('side-open');
    window.scrollTo({ top: 0 });
    emit('tab', id);
}

/** เปลี่ยนหมวดพร้อมคัทซีนสั้นๆ */
export function goTo(id) {
    if (id === current) { document.body.classList.remove('side-open'); return; }
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    playCutscene(() => show(id), TAB_CUTSCENE_MS);
}

export function initRouter() {
    show(fromHash());
    window.addEventListener('popstate', () => {
        const id = fromHash();
        if (id !== current) playCutscene(() => show(id), TAB_CUTSCENE_MS);
    });
}
