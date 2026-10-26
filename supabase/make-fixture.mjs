// สร้างข้อมูลจำลองสำหรับ dev (dev/fixture.json) จากไฟล์ Export JSON ของ Firebase
// ใช้: npm run seed:fixture -- "<ไฟล์ export.json>"
// โหนด users/ และ roles/ ถูกตัดทิ้งเสมอ
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
if (!input) {
    console.error('usage: npm run seed:fixture -- <firebase-export.json>');
    process.exit(1);
}
const data = JSON.parse(fs.readFileSync(input, 'utf8'));
delete data.users;
delete data.roles;

fs.mkdirSync('dev', { recursive: true });
fs.writeFileSync(path.join('dev', 'fixture.json'), JSON.stringify(data, null, 1));
console.log('wrote dev/fixture.json:', Object.keys(data).join(', '));
