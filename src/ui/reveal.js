// ===== การ์ดค่อยๆ ปรากฏตอนเลื่อนมาถึง (ไล่ทีละใบ) =====
const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let io = null;

function observer() {
    if (io) return io;
    io = new IntersectionObserver((entries) => {
        let i = 0;
        for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.style.setProperty('--d', Math.min(i++, 8) * 60 + 'ms');
            e.target.classList.add('is-in');
            io.unobserve(e.target);
        }
    }, { rootMargin: '0px 0px -8% 0px' });
    return io;
}

/** ใส่เอฟเฟกต์ให้ลูกทุกตัวของ container */
export function reveal(container) {
    if (reduce || !('IntersectionObserver' in window)) return;
    for (const el of container.children) {
        if (el.classList.contains('empty-state')) continue;
        el.classList.add('reveal');
        observer().observe(el);
    }
}
