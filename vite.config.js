import { defineConfig } from 'vite';

// base: './' ให้ไฟล์อ้างอิงแบบ relative — ใช้ได้ทั้งบน GitHub Pages (/SUMMER/) และโดเมนอื่น
export default defineConfig({
    base: './',
    build: {
        target: 'es2020',
        assetsInlineLimit: 0,
    },
});
