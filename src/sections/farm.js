// ===== หมวดงานฟาร์ม: การ์ดงาน + เครื่องคำนวณ (ป้ายร้าน/บอร์ดราคาอยู่หน้าแรก) =====
import { $, mount } from '../lib/dom.js';
import { createJobs } from './jobs.js';

export function initFarm() {
    mount($('#panel-farm'), createJobs());
}
