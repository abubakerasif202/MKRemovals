import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// Source art lives in assets-src/ (not deployed). Optimised derivatives are written to public/assets/.
const OUT_PHOTO = 'public/assets/photography';
const OUT_BRAND = 'public/assets/brand';
fs.mkdirSync(OUT_PHOTO, { recursive: true });
fs.mkdirSync(OUT_BRAND, { recursive: true });

// Photography actually used on the site (owner-supplied renders + the one remaining legacy office image).
const PHOTOS = {
  'boulevard_twilight_truck.png': 'boulevard_twilight_truck',
  'midnight_delivery_truck.png': 'midnight_delivery_truck',
  'mover_wrapped_armchair.png': 'mover_wrapped_armchair',
  'crew_protecting_furniture.png': 'crew_protecting_furniture',
  'office_commercial_relocation.jpg': 'office_commercial_relocation',
};
for (const [file, base] of Object.entries(PHOTOS)) {
  for (const w of [640, 960, 1376, 1920]) {
    await sharp(path.join('assets-src/photography', file))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 74, effort: 5 })
      .toFile(path.join(OUT_PHOTO, `${base}-${w}.webp`));
  }
}

// Owner-supplied logo: full artwork, plus a wide wordmark crop for the header/footer.
const logo = 'assets-src/mrk_logo_full.png';
await sharp(logo).resize({ width: 960 }).webp({ quality: 82, effort: 5 }).toFile(path.join(OUT_BRAND, 'mrk-logo-full.webp'));
await sharp(logo).extract({ left: 20, top: 585, width: 1496, height: 238 })
  .resize({ width: 720 }).webp({ quality: 85, effort: 5 }).toFile(path.join(OUT_BRAND, 'mrk-wordmark.webp'));
await sharp(logo).resize(64, 64, { fit: 'cover', position: 'attention' }).png({ compressionLevel: 9 }).toFile('public/favicon.ico');
