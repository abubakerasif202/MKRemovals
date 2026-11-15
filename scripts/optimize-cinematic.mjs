import sharp from "sharp";
import fs from "node:fs/promises";
const output = "public/assets/photography/cinematic";
await fs.mkdir(output, { recursive: true });
const photos = [
  "adelaide_moving_day_hero_banner",
  "premium_mrk_removals_adelaide_scene",
  "premium_strata_move_in_adelaide",
  "mrk_s_seamless_adelaide_office_move",
  "boulevard_twilight_truck",
];
async function writeVariants(source, name, widths) {
  for (const width of widths) {
    const image = sharp(source).resize({ width, withoutEnlargement: true });
    await image
      .clone()
      .avif({ quality: 45, effort: 5 })
      .toFile(`${output}/${name}-${width}.avif`);
    await image
      .clone()
      .webp({ quality: 74, effort: 5 })
      .toFile(`${output}/${name}-${width}.webp`);
  }
}
for (const name of photos) {
  const source =
    name === "boulevard_twilight_truck"
      ? `assets-src/photography/${name}.png`
      : `assets-src/photography/mrk-site-graphics/${name}.png`;
  await writeVariants(source, name, [640, 960, 1376, 1920]);
}
const mobile = await sharp(
  "assets-src/photography/mrk-site-graphics/adelaide_moving_day_hero_banner.png",
)
  .extract({ left: 520, top: 0, width: 1152, height: 941 })
  .png()
  .toBuffer();
await writeVariants(
  mobile,
  "adelaide_moving_day_hero_mobile",
  [420, 640, 960, 1152],
);
console.log(
  "Cinematic responsive assets generated from existing source artwork.",
);
