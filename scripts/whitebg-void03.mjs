/**
 * Flood-fill background → white for VOID03
 * Starts from all 4 corners and spreads to connected background pixels only.
 * Pixels not reachable from corners (e.g. lens specular highlights inside the frame)
 * are left untouched.
 */

import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');

const dir = join(__dirname, '../public/products');

// How close to background a pixel must be to be considered background
const TOLERANCE = 28;

async function processImage(idx) {
  const src  = join(dir, `void-03-c${idx}.jpg`);   // already text-cleaned
  const dest = src;

  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const buf = Buffer.from(data);

  // Sample background color from corners (avg of 4 corners 5x5)
  let sumR = 0, sumG = 0, sumB = 0, n = 0;
  const cs = 5;
  const corners = [[0,0],[W-cs,0],[0,H-cs],[W-cs,H-cs]];
  for (const [cx, cy] of corners) {
    for (let dy = 0; dy < cs; dy++) {
      for (let dx = 0; dx < cs; dx++) {
        const i = ((cy+dy)*W+(cx+dx))*C;
        sumR += buf[i]; sumG += buf[i+1]; sumB += buf[i+2]; n++;
      }
    }
  }
  const bgR = sumR/n, bgG = sumG/n, bgB = sumB/n;
  console.log(`C${idx}: bg sampled R${Math.round(bgR)} G${Math.round(bgG)} B${Math.round(bgB)}`);

  // BFS flood fill from all border pixels
  const visited = new Uint8Array(W * H);
  const queue = [];

  function enqueue(x, y) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    if (visited[y*W+x]) return;
    const i = (y*W+x)*C;
    const dr = buf[i]-bgR, dg = buf[i+1]-bgG, db = buf[i+2]-bgB;
    if (Math.abs(dr) <= TOLERANCE && Math.abs(dg) <= TOLERANCE && Math.abs(db) <= TOLERANCE) {
      visited[y*W+x] = 1;
      queue.push([x, y]);
    }
  }

  // Seed from all 4 edges
  for (let x = 0; x < W; x++) { enqueue(x, 0); enqueue(x, H-1); }
  for (let y = 0; y < H; y++) { enqueue(0, y); enqueue(W-1, y); }

  let qi = 0, painted = 0;
  while (qi < queue.length) {
    const [x, y] = queue[qi++];
    const i = (y*W+x)*C;
    buf[i] = 255; buf[i+1] = 255; buf[i+2] = 255;
    painted++;
    enqueue(x+1, y); enqueue(x-1, y); enqueue(x, y+1); enqueue(x, y-1);
  }

  console.log(`C${idx}: flood-filled ${painted} background pixels → white`);

  const tmpDest = src.replace('.jpg', '_wbtmp.jpg');
  await sharp(buf, { raw: { width: W, height: H, channels: C } })
    .jpeg({ quality: 95 })
    .toFile(tmpDest);

  // Atomic replace via rename
  const { renameSync, unlinkSync } = await import('fs');
  unlinkSync(dest);
  renameSync(tmpDest, dest);

  console.log(`C${idx}: saved`);
}

(async () => {
  for (let i = 1; i <= 5; i++) await processImage(i);
  console.log('Done.');
})();
