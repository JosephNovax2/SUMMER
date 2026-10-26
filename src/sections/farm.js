// ===== หมวดงานฟาร์ม: ป้ายร้านกาชา + บอร์ดราคา + การ์ดงาน =====
import { $, mount } from '../lib/dom.js';
import { createShopBanner } from './gacha.js';
import { createEcoBoard } from './eco.js';
import { createJobs } from './jobs.js';

export function initFarm() {
    mount($('#panel-farm'), createShopBanner(), createEcoBoard(), createJobs());
}
