// ===== เสียงเอฟเฟกต์โทนนุ่ม (สังเคราะห์ด้วย Web Audio — ไม่มีไฟล์เสียง) =====
// คลิก / พิมพ์ / เปิด-ปิดการ์ด / ลบ / ล็อกอินสำเร็จ / เปลี่ยนหมวด
// ปิดเสียงได้ (จำค่าไว้ในเครื่อง)

const MUTE_KEY = 'sc_sound_muted';
const N = { G3: 196.0, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0 };

let ctx = null, master = null, reverbIn = null, dryBus = null;
let muted = false;
try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { /* ignore */ }

const rnd = (min, max) => min + Math.random() * (max - min);

function makeImpulse(c, seconds, decay) {
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
}

function getCtx() {
    if (muted) return null;
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 1500; lp.Q.value = 0.5;
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.005; comp.release.value = 0.2;
        master = ctx.createGain(); master.gain.value = 0.5;
        master.connect(lp); lp.connect(comp); comp.connect(ctx.destination);
        dryBus = ctx.createGain(); dryBus.gain.value = 0.7; dryBus.connect(comp);
        const conv = ctx.createConvolver(); conv.buffer = makeImpulse(ctx, 0.45, 3);
        const wetOut = ctx.createGain(); wetOut.gain.value = 0.1;
        reverbIn = ctx.createGain();
        reverbIn.connect(conv); conv.connect(wetOut); wetOut.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

function tone({ freq = 600, dur = 0.2, vol = 0.1, delay = 0, attack = 0.008, glide = 0, bell = 0.1, wet = 0.2 } = {}) {
    const c = getCtx(); if (!c) return;
    try {
        const t0 = c.currentTime + delay;
        const out = c.createGain();
        out.gain.setValueAtTime(0.0001, t0);
        out.gain.linearRampToValueAtTime(vol, t0 + attack);
        out.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        const o1 = c.createOscillator();
        o1.type = 'sine'; o1.detune.value = rnd(-5, 5);
        o1.frequency.setValueAtTime(freq, t0);
        if (glide) o1.frequency.exponentialRampToValueAtTime(freq * (1 + glide), t0 + dur * 0.6);
        o1.connect(out);
        let o2 = null;
        if (bell > 0) {
            o2 = c.createOscillator(); o2.type = 'sine';
            o2.frequency.setValueAtTime(freq * 2, t0);
            const g2 = c.createGain(); g2.gain.value = bell;
            o2.connect(g2); g2.connect(out);
        }
        out.connect(master);
        const send = c.createGain(); send.gain.value = wet;
        out.connect(send); send.connect(reverbIn);
        o1.start(t0); o1.stop(t0 + dur + 0.05);
        if (o2) { o2.start(t0); o2.stop(t0 + dur + 0.05); }
    } catch (e) { /* เงียบไว้ */ }
}

function noiseBuffer(c, seconds) {
    const len = Math.max(1, Math.floor(c.sampleRate * seconds));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
}

function air({ dur = 0.5, vol = 0.05, from = 450, to = 1700 } = {}) {
    const c = getCtx(); if (!c) return;
    try {
        const src = c.createBufferSource(); src.buffer = noiseBuffer(c, dur);
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.7;
        const t0 = c.currentTime;
        bp.frequency.setValueAtTime(from, t0);
        bp.frequency.exponentialRampToValueAtTime(to, t0 + dur);
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.35);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.connect(bp); bp.connect(g); g.connect(master);
        const send = c.createGain(); send.gain.value = 0.4; g.connect(send); send.connect(reverbIn);
        src.start(t0); src.stop(t0 + dur + 0.02);
    } catch (e) { /* เงียบไว้ */ }
}

function noise({ dur = 0.05, vol = 0.05, delay = 0, type = 'bandpass', freq = 2000, freqTo = 0, q = 1, attack = 0.004 } = {}) {
    const c = getCtx(); if (!c) return;
    try {
        const src = c.createBufferSource(); src.buffer = noiseBuffer(c, dur + 0.02);
        const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
        const t0 = c.currentTime + delay;
        f.frequency.setValueAtTime(freq, t0);
        if (freqTo) f.frequency.exponentialRampToValueAtTime(freqTo, t0 + dur);
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.connect(f); f.connect(g); g.connect(dryBus);
        src.start(t0); src.stop(t0 + dur + 0.02);
    } catch (e) { /* เงียบไว้ */ }
}

export const sound = {
    get muted() { return muted; },
    setMuted(v) {
        muted = !!v;
        try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) { /* ignore */ }
    },
    click() {
        noise({ dur: 0.012, vol: 0.11, freq: 3200, q: 2.5, attack: 0.001 });
        noise({ dur: 0.016, vol: 0.07, freq: 1500, q: 3, attack: 0.001 });
        noise({ dur: 0.009, vol: 0.05, freq: 2800, q: 2.5, attack: 0.001, delay: 0.07 });
        noise({ dur: 0.012, vol: 0.03, freq: 1400, q: 3, attack: 0.001, delay: 0.07 });
    },
    type() {
        noise({ dur: 0.014, vol: 0.06, freq: rnd(2200, 3000), q: 2, attack: 0.001 });
        noise({ dur: 0.03, vol: 0.045, freq: rnd(750, 1050), q: 1.2, attack: 0.001 });
        noise({ dur: 0.008, vol: 0.02, freq: rnd(2800, 3400), q: 2, attack: 0.001, delay: 0.055 });
    },
    open() {
        noise({ dur: 0.14, vol: 0.04, freq: 600, freqTo: 2200, q: 0.7, attack: 0.04 });
        tone({ freq: 400, dur: 0.09, vol: 0.045, glide: 0.2, bell: 0.06, wet: 0.2, delay: 0.03 });
        tone({ freq: 600, dur: 0.14, vol: 0.035, bell: 0.08, wet: 0.25, delay: 0.09 });
    },
    close() {
        noise({ dur: 0.1, vol: 0.03, freq: 2000, freqTo: 500, q: 0.7, attack: 0.02 });
        tone({ freq: 520, dur: 0.09, vol: 0.035, glide: -0.25, bell: 0.05, wet: 0.15 });
        tone({ freq: 350, dur: 0.11, vol: 0.03, bell: 0.05, wet: 0.2, delay: 0.05 });
    },
    remove() { tone({ freq: N.D4, dur: 0.14, vol: 0.05, glide: -0.35, bell: 0 }); },
    success() {
        [N.G3, N.C4, N.E4, N.G4].forEach((f, i) =>
            tone({ freq: f, dur: i === 3 ? 0.3 : 0.16, vol: 0.05, delay: i * 0.07, wet: 0.25 }));
    },
    chime() {
        [[523.25, 0], [783.99, 0.09], [1046.5, 0.18]].forEach(([f, d]) =>
            tone({ freq: f, dur: 0.5, vol: 0.07, delay: d, bell: 0, wet: 0.15 }));
    },
    transition() { air({ dur: 0.3, vol: 0.03, from: 500, to: 1600 }); },
};

/** เสียงคลิกทุกปุ่ม + เสียงพิมพ์ทุกช่อง (ผูกครั้งเดียวทั้งเว็บ) */
export function installGlobalSounds() {
    document.addEventListener('click', (e) => {
        const b = e.target.closest('button, [role="button"], a');
        if (b && !b.hasAttribute('data-silent')) sound.click();
    }, true);
    document.addEventListener('input', (e) => {
        const t = e.target;
        if (t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && !/^(checkbox|radio|range|file|color)$/i.test(t.type))) sound.type();
    });
}
