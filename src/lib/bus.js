// ===== สถานะกลางของแอป + event เล็กๆ =====
const listeners = new Map();

export function on(event, cb) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(cb);
    return () => listeners.get(event).delete(cb);
}

export function emit(event, payload) {
    listeners.get(event)?.forEach((cb) => {
        try { cb(payload); } catch (e) { console.error(`[${event}]`, e); }
    });
}

export const state = {
    /** { username, role } หรือ null */
    user: null,
    get isAdmin() { return this.user?.role === 'ADMIN'; },
};

/** เรียก cb ทันที และทุกครั้งที่ผู้ใช้/ยศเปลี่ยน */
export function onUser(cb) {
    cb(state.user);
    return on('user', cb);
}

export function setUser(user) {
    state.user = user;
    emit('user', user);
}
