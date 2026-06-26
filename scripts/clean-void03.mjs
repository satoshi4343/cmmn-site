/**
 * VOID03 image cleaner v2
 * - Restores from _original backups
 * - Wider zone + lower threshold to catch grey text on light background
 * - Nearest-neighbor diffusion for seamless fill
 */

import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');

const dir = join(__dirname, '../public/products');

async function processImage(idx) {
  const src  = join(dir, `void-03-c${idx}_original.jpg`);
  const dest = join(dir, `void-03-c${idx}.jpg`);

  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const buf = Buffer.from(data);

  // Sample background from corners
  let sumR = 0, sumG = 0, sumB = 0, n = 0;
  for (const [cx, cy] of [[0,0],[W-6,0],[0,H-6],[W-6,H-6]]) {
    for (let dy = 0; dy < 5; dy++) for (let dx = 0; dx < 5; dx++) {
      const i = ((cy+dy)*W+(cx+dx))*C;
      sumR += buf[i]; sumG += buf[i+1]; sumB += buf[i+2]; n++;
    }
  }
  const bgR = sumR/n, bgG = sumG/n, bgB = sumB/n;

  // Text zones (generous margins)
  // Zone A: top strip (CMMN. logo) — full width, top 20%
  const logoYEnd = Math.floor(H * 0.20);
  // Zone B: bottom strip (color name) — full width, bottom 20%
  const textYStart = Math.floor(H * 0.80);

  // Detect text: pixels that differ from background by >15 but not extreme product color
  // In these zones, anything below bgR-15 is considered potential text
  const mask = new Uint8Array(W * H);
  let textPixels = 0;

  for (let y = 0; y < H; y++) {
    const inZone = y < logoYEnd || y >= textYStart;
    if (!inZone) continue;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const r = buf[i], g = buf[i+1], b = buf[i+2];
      // Text pixels: darker than background by threshold, or out of bg tone
      const diffR = bgR - r, diffG = bgG - g, diffB = bgB - b;
      if (diffR > 15 || diffG > 15 || diffB > 15) {
        mask[y * W + x] = 1;
        textPixels++;
      }
    }
  }

  console.log(`C${idx}: bg=R${Math.round(bgR)} G${Math.round(bgG)} B${Math.round(bgB)}, text pixels: ${textPixels}`);

  // Diffusion fill: replace each masked pixel with average of nearest non-masked neighbors
  // Do multiple passes to propagate fill into clusters
  for (let pass = 0; pass < 3; pass++) {
    const newMask = new Uint8Array(mask);
    for (let y = 0; y < H; y++) {
      if (y >= logoYEnd && y < textYStart) continue;
      for (let x = 0; x < W; x++) {
        if (!mask[y * W + x]) continue;
        let sumR2 = 0, sumG2 = 0, sumB2 = 0, cnt = 0;
        for (let dy = -6; dy <= 6; dy++) {
          for (let dx = -6; dx <= 6; dx++) {
            const ny = y+dy, nx = x+dx;
            if (ny < 0||ny >= H||nx < 0||nx >= W) continue;
            if (mask[ny*W+nx]) continue;
            const ni = (ny*W+nx)*C;
            sumR2 += buf[ni]; sumG2 += buf[ni+1]; sumB2 += buf[ni+2]; cnt++;
          }
        }
        if (cnt > 0) {
          const i = (y*W+x)*C;
          buf[i]   = Math.round(sumR2/cnt);
          buf[i+1] = Math.round(sumG2/cnt);
          buf[i+2] = Math.round(sumB2/cnt);
          newMask[y*W+x] = 0; // mark as filled
        }
      }
      // Update mask from this pass
      for (let x = 0; x < W*H; x++) mask[x] = newMask[x];
    }
  }

  // Remaining unfilled: use background color
  for (let y = 0; y < H; y++) {
    if (y >= logoYEnd && y < textYStart) continue;
    for (let x = 0; x < W; x++) {
      if (!mask[y*W+x]) continue;
      const i = (y*W+x)*C;
      buf[i] = Math.round(bgR); buf[i+1] = Math.round(bgG); buf[i+2] = Math.round(bgB);
    }
  }

  const tmpPath = dest.replace('.jpg','_tmp.jpg');
  await sharp(buf, { raw: { width: W, height: H, channels: C } })
    .jpeg({ quality: 95 })
    .toFile(tmpPath);

  const { unlinkSync, renameSync } = await import('fs');
  try { unlinkSync(dest); } catch(e) {}
  renameSync(tmpPath, dest);

  console.log(`C${idx}: saved`);
}

(async () => {
  for (let i = 1; i <= 5; i++) await processImage(i);
  console.log('Done.');
})();
