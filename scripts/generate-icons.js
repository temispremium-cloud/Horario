import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createSvg(size) {
  const fontSize = Math.round(size * 0.35);
  const subFontSize = Math.round(size * 0.08);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#b7191f"/>
    <circle cx="${size/2}" cy="${size*0.42}" r="${size*0.28}" fill="#ffffff" opacity="0.15"/>
    <text x="${size/2}" y="${size*0.48}" font-family="Arial, sans-serif" font-weight="900" font-size="${fontSize}" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">50</text>
    <text x="${size/2}" y="${size*0.78}" font-family="Arial, sans-serif" font-weight="bold" font-size="${subFontSize}" fill="#ffffff" text-anchor="middle">UNIGUAJIRA</text>
  </svg>`;
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon.svg'), createSvg(512));
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), createSvg(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), createSvg(512));
console.log('Created SVG icons in public/');
