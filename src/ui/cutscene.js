// ===== คัทซีน: อินโทรตอนเปิดเว็บ + คั่นตอนเปลี่ยนหมวด =====
// คลุมจอทันที -> เปลี่ยนเนื้อหาเบื้องหลัง -> ค้างไว้ครู่ -> จางออก (ไม่เห็นเนื้อหาแวบก่อน)
import { INTRO_MS } from '../config.js';
import { safeUrl } from '../lib/dom.js';
import { sound } from '../lib/sound.js';
import { subscribe } from '../lib/store.js';

const LOGO_KEY = 'sc_cutscene_logo';
const el = () => document.getElementById('cutscene');
let hideTimer = null;
let raf = null;

/** คลุมจอ เรียก onCovered ตอนจอมิดแล้ว แล้วจางออกหลัง holdMs */
export function playCutscene(onCovered, holdMs, { intro = false } = {}) {
    const c = el();
    if (!c) { onCovered?.(); return; }
    clearTimeout(hideTimer);
    c.classList.toggle('is-intro', intro);
    c.classList.remove('is-fading');
    c.classList.add('is-active');
    void c.offsetWidth;
    if (!intro) sound.transition();
    onCovered?.();
    if (intro) runIntroProgress(Math.max(600, holdMs - 250));
    requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('is-fading')));
    hideTimer = setTimeout(() => c.classList.remove('is-active'), holdMs);
}

/** อินโทรเต็มเฉพาะครั้งแรกของแท็บ รีเฟรชซ้ำจะสั้นลง */
export function playIntro(onCovered) {
    let seen = false;
    try { seen = sessionStorage.getItem('sc_intro_seen') === '1'; sessionStorage.setItem('sc_intro_seen', '1'); } catch (e) { /* ignore */ }
    playCutscene(onCovered, seen ? INTRO_MS.repeat : INTRO_MS.first, { intro: true });
}

function runIntroProgress(duration) {
    const title = document.getElementById('intro-title');
    const count = document.getElementById('intro-count');
    if (!title || !count) return;
    cancelAnimationFrame(raf);
    const fit = () => {
        title.style.fontSize = '';
        const max = window.innerWidth * 0.88;
        if (title.offsetWidth > max) title.style.fontSize = parseFloat(getComputedStyle(title).fontSize) * max / title.offsetWidth + 'px';
    };
    fit();
    document.fonts?.ready.then(fit);
    title.classList.add('is-running');
    const t0 = performance.now();
    const step = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        const pct = (0.45 * t + 0.55 * (t * t * (3 - 2 * t))) * 100;
        title.style.setProperty('--p', pct.toFixed(2) + '%');
        count.textContent = String(Math.round(pct)).padStart(3, '0');
        if (t < 1) raf = requestAnimationFrame(step);
        else title.classList.replace('is-running', 'is-done');
    };
    raf = requestAnimationFrame(step);
}

/** รูปโลโก้คัทซีน: ใช้ค่าที่จำไว้ก่อน (ไม่กระพริบ) แล้วตามค่าจากฐานข้อมูล */
export function initCutsceneLogo() {
    const apply = (url) => {
        const logo = document.getElementById('cutscene-logo');
        const u = safeUrl(url);
        try { u ? localStorage.setItem(LOGO_KEY, u) : localStorage.removeItem(LOGO_KEY); } catch (e) { /* ignore */ }
        logo.hidden = !u;
        if (u && logo.getAttribute('src') !== u) logo.src = u;
    };
    try { apply(localStorage.getItem(LOGO_KEY)); } catch (e) { /* ignore */ }
    subscribe('site_config', (cfg) => apply(cfg?.cutscene_logo || ''));
}
