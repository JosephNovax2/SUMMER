// ===== โครงหน้า: เมนูข้าง, หัวเว็บ, ปุ่มลอย, เข้าสู่ระบบแอดมิน =====
import { LINKS } from '../config.js';
import { $, h, icon, mount, safeUrl } from '../lib/dom.js';
import { onUser, state } from '../lib/bus.js';
import { login, logout } from '../lib/auth.js';
import { sound } from '../lib/sound.js';
import { get, set } from '../lib/store.js';
import { closeAllModals, openModal } from './modal.js';
import { openFormModal } from './form.js';
import { toast } from './dialog.js';
import { TABS, goTo } from './router.js';

export function initLayout({ onOpenMail, onOpenShop }) {
    // ----- เมนูข้าง -----
    mount($('#sidebar-nav'), TABS.map((t) => h('a', {
        href: '#' + t.id, class: 'nav-item', dataset: { nav: t.id },
        onclick: (e) => { e.preventDefault(); goTo(t.id); },
    }, icon(t.icon, 'solid', 'nav-item__icon'), h('span', { class: 'sidebar__label' }, t.label))));

    $('#discord-link').href = LINKS.discord;
    $('#creator-link').href = LINKS.facebook;
    $('#burger').addEventListener('click', () => document.body.classList.toggle('side-open'));
    $('#side-backdrop').addEventListener('click', () => document.body.classList.remove('side-open'));

    // ----- หัวเว็บ: พื้นทึบตอนเลื่อนลง -----
    const topbar = $('#topbar');
    let ticking = false;
    const onScroll = () => { topbar.classList.toggle('is-scrolled', window.scrollY > 24); ticking = false; };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    // ----- ปุ่มเปิด/ปิดเสียง -----
    const soundBtn = $('#sound-toggle');
    const paintSound = () => {
        mount(soundBtn, icon(sound.muted ? 'volume-xmark' : 'volume-high'));
        soundBtn.setAttribute('aria-label', sound.muted ? 'เปิดเสียง' : 'ปิดเสียง');
        soundBtn.classList.toggle('is-off', sound.muted);
    };
    soundBtn.addEventListener('click', () => { sound.setMuted(!sound.muted); paintSound(); });
    paintSound();

    $('#mail-btn').addEventListener('click', onOpenMail);
    $('#float-cart').addEventListener('click', onOpenShop);

    // ----- แอดมิน -----
    $('#admin-login-btn').addEventListener('click', () => { if (!state.isAdmin) openLoginModal(); });
    $('#logout-btn').addEventListener('click', async () => { await logout(); toast('ออกจากระบบแล้ว', 'info'); });
    $('#logo-edit-btn').addEventListener('click', openLogoEditor);

    let wasAdmin = false;
    onUser((user) => {
        const admin = user?.role === 'ADMIN';
        // หลุดจากแอดมิน (กดออก / session หมดอายุ / ออกจากแท็บอื่น): ปิดหน้าต่างแก้ไขที่ค้างอยู่ทั้งหมด
        if (wasAdmin && !admin) closeAllModals();
        wasAdmin = admin;
        document.body.classList.toggle('is-admin', admin);
        $('#admin-bar').hidden = !admin;
        $('#creator-link').hidden = admin;
        $('#admin-name').textContent = admin ? user.username : '';
    });

    // ปิดเมนูคลิกขวาทั้งเว็บ (ตามเว็บเดิม)
    document.addEventListener('contextmenu', (e) => {
        if (!e.target.closest('input, textarea')) e.preventDefault();
    });
}

function openLoginModal() {
    const user = h('input', { class: 'input', autocomplete: 'username', required: true, placeholder: 'ระบุ Username ของคุณ', autofocus: true });
    const pass = h('input', { class: 'input', type: 'password', autocomplete: 'current-password', required: true, placeholder: 'ระบุ Password ของคุณ' });
    const err = h('p', { class: 'login__error', hidden: true }, 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    const submit = h('button', { type: 'submit', class: 'btn btn--primary btn--block' }, 'เข้าสู่ระบบ Guide Book');
    const form = h('form', {
        class: 'login', onsubmit: async (e) => {
            e.preventDefault();
            submit.disabled = true; submit.classList.add('is-busy'); err.hidden = true;
            const ok = await login(user.value, pass.value).catch(() => false);
            submit.disabled = false; submit.classList.remove('is-busy');
            if (ok) { sound.success(); m.close(); toast('เข้าสู่ระบบแอดมินแล้ว'); }
            else { err.hidden = false; pass.value = ''; pass.focus(); }
        },
    },
        h('div', { class: 'login__logo' }, icon('sun')),
        h('h2', { class: 'login__title' }, 'SUMMER ', h('span', null, 'CITY')),
        h('span', { class: 'chip chip--cyan' }, icon('rocket'), 'Guide Book แนะนำผู้เล่นใหม่'),
        h('label', { class: 'field' }, h('span', { class: 'field__label' }, 'ชื่อผู้ใช้งาน (Username)'), user),
        h('label', { class: 'field' }, h('span', { class: 'field__label' }, 'รหัสผ่าน (Password)'), pass),
        err, submit,
        h('p', { class: 'login__foot' }, 'SYSTEM SECURED BY SUMMER CITY DEVELOPER'));
    const m = openModal({ title: 'เข้าสู่ระบบแอดมิน', icon: 'lock', size: 'sm', body: form });
}

async function openLogoEditor() {
    const cfg = (await get('site_config')) || {};
    openFormModal({
        title: 'รูปโลโก้คัทซีน', icon: 'image', size: 'sm', folder: 'site',
        fields: [{
            name: 'url', label: 'รูปโลโก้ (เว้นว่าง = ไม่แสดงโลโก้)', type: 'url', preview: true, maxSize: 800,
        }],
        values: { url: cfg.cutscene_logo || '' },
        onSubmit: ({ url }) => set('site_config/cutscene_logo', safeUrl(url) ? url : ''),
    });
}
