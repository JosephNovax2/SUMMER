// ===== สลับหมวด (แท็บ) — จำหมวดไว้ใน URL เช่น #fashion ปุ่มย้อนกลับของเบราว์เซอร์ใช้ได้ =====
import { TAB_CUTSCENE_MS } from '../config.js';
import { emit } from '../lib/bus.js';
import { playCutscene } from './cutscene.js';

export const TABS = [
    { id: 'home', label: 'หน้าแรก', icon: 'house', desc: 'สรุปทุกอย่างที่ต้องรู้วันนี้' },
    { id: 'farm', label: 'งานฟาร์ม', icon: 'wheat-awn', desc: 'วิธีทำงานขาว/ดำ + เครื่องคำนวณ', path: 'jobs' },
    { id: 'food', label: 'อาหาร', icon: 'drumstick-bite', desc: 'เอฟเฟกต์และวัตถุดิบ', path: 'foods' },
    { id: 'devil', label: 'ผลไม้ปีศาจ', icon: 'apple-whole', desc: 'สกิลพิเศษแต่ละระดับ', path: 'devils' },
    { id: 'rune', label: 'รูน', icon: 'scroll', desc: 'อาวุธที่ใส่ได้และเอฟเฟกต์', path: 'runes' },
    { id: 'fashion', label: 'แฟชั่น', icon: 'shirt', desc: 'สถานะของชุดแต่ละแบบ', path: 'fashions' },
    { id: 'items', label: 'ITEMS', icon: 'cube', desc: 'แหล่งที่มาของไอเทม', path: 'items' },
    { id: 'events', label: 'เวลากิจกรรม', icon: 'calendar-days', desc: 'ตารางทั้งวัน เวลาไทย', path: 'events' },
    { id: 'gkey', label: 'ปุ่ม G', icon: 'keyboard', desc: 'เมนูลัดในเกม' },
];

let current = null;

export const currentTab = () => current;

const fromHash = () => {
    const id = location.hash.replace('#', '');
    return TABS.some((t) => t.id === id) ? id : 'home';
};

function show(id) {
    current = id;
    document.querySelectorAll('.panel').forEach((p) => { p.hidden = p.dataset.tab !== id; });
    document.querySelectorAll('[data-nav]').forEach((b) => {
        const on = b.dataset.nav === id;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-current', on ? 'page' : 'false');
        if (on) b.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
    window.scrollTo({ top: 0 });
    emit('tab', id);
}

/** เปลี่ยนหมวดพร้อมคัทซีนสั้นๆ */
export function goTo(id) {
    if (id === current) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
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
