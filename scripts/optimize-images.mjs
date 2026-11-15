import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// Source art lives in assets-src/ (not deployed). Optimised derivatives are written to public/.
const OUT_PHOTO = 'public/assets/photography';
const OUT_BRAND = 'public/assets/brand';
fs.mkdirSync(OUT_PHOTO, { recursive: true });
fs.mkdirSync(OUT_BRAND, { recursive: true });

// ---- Photography actually used on the site -------------------------------------------------------
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

// ---- Owner-supplied MRK logos (transparent PNGs, readable directly on the light page) -------------
const logoSrc = (name) => `assets-src/logos/mrk-logo-${name}.png`;
async function trimmed(name) {
  return sharp(logoSrc(name))
    .ensureAlpha()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .png()
    .toBuffer();
}
const LOGO_OUT = { horizontal: 720, circle: 640, shield: 480, stacked: 640 };
for (const [name, width] of Object.entries(LOGO_OUT)) {
  await sharp(await trimmed(name))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 95, effort: 5 })
    .toFile(path.join(OUT_BRAND, `mrk-logo-${name}.webp`));
}

// Favicon (round emblem) and iOS home-screen icon (opaque white tile, iOS fills transparency with black).
const circle = await trimmed('circle');
await sharp(circle).resize(64, 64).png({ compressionLevel: 9 }).toFile('public/favicon.ico');
await sharp({ create: { width: 180, height: 180, channels: 3, background: '#FFFFFF' } })
  .composite([{ input: await sharp(circle).resize(156, 156).png().toBuffer(), gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT_BRAND, 'apple-touch-icon.png'));

// Social share card 1200x630: bright gradient, horizontal logo, ruby base bar.
const cardSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.55" stop-color="#EEF4FC"/><stop offset="1" stop-color="#DCE8F8"/>
       </linearGradient>
       <radialGradient id="r" cx="0.1" cy="0.05" r="0.6"><stop offset="0" stop-color="#C81036" stop-opacity="0.12"/><stop offset="1" stop-color="#C81036" stop-opacity="0"/></radialGradient>
     </defs>
     <rect width="1200" height="630" fill="url(#g)"/><rect width="1200" height="630" fill="url(#r)"/>
     <rect y="610" width="1200" height="20" fill="#C81036"/><rect y="610" width="400" height="20" fill="#124FA3"/>
   </svg>`
);
const horizontalForCard = await sharp(await trimmed('horizontal')).resize({ width: 980 }).png().toBuffer();
await sharp(cardSvg)
  .composite([{ input: horizontalForCard, gravity: 'centre' }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(OUT_BRAND, 'og-image.jpg'));

// ---- AB Web Studio monogram for the footer credit (supplied by the studio; transparent) -----------
await sharp('assets-src/ab-web-studio-logo.webp')
  .resize({ height: 192, withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 95, effort: 5 })
  .toFile(path.join(OUT_BRAND, 'ab-web-studio-logo.webp'));
