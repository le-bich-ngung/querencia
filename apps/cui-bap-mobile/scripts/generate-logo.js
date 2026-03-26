/**
 * node scripts/generate-logo.js
 * Tạo tất cả icon sizes từ Querencia SVG logo
 * npm i sharp trước khi chạy
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="#0d0f0d"/>
  <g transform="translate(152,152) scale(6.0)">
    <defs><clipPath id="c"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke="#4a7c59" stroke-width="7" stroke-linecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke="#4a7c59" stroke-width="7" stroke-linecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke="#4a7c59" stroke-width="3.5"
      stroke-linecap="round" stroke-linejoin="round" clip-path="url(#c)"/>
  </g>
</svg>`;

const OUTPUTS = [
  ['android/app/src/main/res/mipmap-mdpi/ic_launcher.png',    48],
  ['android/app/src/main/res/mipmap-hdpi/ic_launcher.png',    72],
  ['android/app/src/main/res/mipmap-xhdpi/ic_launcher.png',   96],
  ['android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png',  144],
  ['android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', 192],
  ['src/assets/icon-1024.png', 1024],
];

(async () => {
  const buf = Buffer.from(SVG);
  for (const [name, size] of OUTPUTS) {
    const out = path.join(__dirname, '..', name);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(buf).resize(size, size).png().toFile(out);
    console.log(`✅ ${name}`);
  }
})().catch(console.error);
