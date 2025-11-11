// scripts/fetch-yoga-data.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://yoga-api-nzy4.onrender.com/v1/poses';
const OUTPUT_PATH = path.join(__dirname, '../src/data/yoga-poses.json');

console.log('🚀 Fetching yoga data...');

https.get(API_URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const poses = JSON.parse(data);

            // Tạo thư mục nếu chưa tồn tại
            const dir = path.dirname(OUTPUT_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(poses, null, 2));
            console.log(`✅ Done! Saved ${poses.length} yoga poses to: ${OUTPUT_PATH}`);
        } catch (err) {
            console.error('❌ JSON parse error:', err);
        }
    });

}).on('error', (err) => {
    console.error('❌ Request error:', err.message);
});
