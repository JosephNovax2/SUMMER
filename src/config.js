// ===== ค่าตั้งต้นของเว็บ — แก้ที่นี่ที่เดียว =====

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const LINKS = {
    discord: 'https://discord.gg/5x4NxuAZZ',
    facebook: 'https://www.facebook.com/joseph.cnv',
};

// ชื่อผู้ใช้ -> อีเมลใน Supabase Auth (summer_admin ใช้อีเมลแอดมินเดิม)
export const EMAIL_DOMAIN = 'summercity.app';
export const ADMIN_USERNAME = 'summer_admin';
export const ADMIN_EMAIL = 'admin@summercity.app';

// ลิงก์รูปที่ชี้ไป repo นี้ (jsDelivr / raw.githubusercontent) จะถูกโหลดจากเว็บตัวเองแทน
export const REPO_IMAGE_PATTERN =
    /^https?:\/\/(?:cdn\.jsdelivr\.net\/gh\/JosephNovax2\/SUMMER@main|raw\.githubusercontent\.com\/JosephNovax2\/SUMMER\/(?:refs\/heads\/)?main)\/([^?#]+)/i;

export const INTRO_MS = { first: 1600, repeat: 800 };
export const TAB_CUTSCENE_MS = 280;
