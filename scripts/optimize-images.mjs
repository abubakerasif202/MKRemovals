import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// Source art lives in assets-src/ (not deployed). Optimised derivatives are written to public/assets/.
const photoWidths = [640, 960, 1376];
for (const f of fs.readdirSync('assets-src/photography')) {
  if (!f.endsWith('.jpg')) continue;
  const base = f.replace(/\.jpg$/, '');
  for (const w of photoWidths) {
    await sharp(path.join('assets-src/photography', f)).resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 74, effort: 5 }).toFile(path.join('public/assets/photography', `${base}-${w}.webp`));
  }
}
for (const f of fs.readdirSync('assets-src/aistudio')) {
  if (!f.endsWith('.png')) continue;
  const base = f.replace(/\.png$/, '');
  await sharp(path.join('assets-src/aistudio', f)).resize({ width: 512, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 }).toFile(path.join('public/assets/aistudio', `${base}.webp`));
}
await sharp('assets-src/aistudio/ruby_platinum_badge_concept_6a6760d6.png').resize(64, 64).png({ compressionLevel: 9 }).toFile('public/favicon.ico');
