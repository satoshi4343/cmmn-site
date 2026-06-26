/**
 * VOID03 quality enhancement for C1, C3, C5
 * Order: normalize+sharpen FIRST (on original), THEN white-fill + flood-fill bg
 * This ensures white background is always preserved after enhancement.
 */
import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { unlinkSync, renameSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const dir = join(__dirname, '../public/products');

const FLOOD_TOL        = 30;
const LOGO_XEND_RATIO  = 0.38;
const LOGO_YEND_RATIO  = 0.32;

const CONFIG = {
  1: { botStart: 680, normalize: false, sharpen: 1.5 },
  3: { botStart: 640, normalize: true,  sharpen: 2.0 },
  5: { botStart: 640, normalize: true,  sharpen: 2.0 },
};

async function process(idx) {
  const cfg  = CONFIG[idx];
  const src  = join(dir, `void-03-c${idx}_original.jpg`);
  const dest = join(dir, `void-03-c${idx}.jpg`);
  const tmp  = join(dir, `void-03-c${idx}_etmp.jpg`);

  // Step 1: enhance the original image first
  let pipeline = sharp(src);
  if (cfg.normalize) pipeline = pipeline.normalise();
  if (cfg.sharpen > 0) pipeline = pipeline.sharpen({ sigma: cfg.sharpen, m1: 1.5, m2: 3.0, x1: 2, y2: 15, y3: 10 });

  // Get enhanced raw buffer
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const buf = Buffer.from(data);

  // Step 2: sample background color AFTER enhancement (corners still ~bg color)
  let sR = 0, sG = 0, sB = 0, n = 0;
  for (const [cx, cy] of [[0,0],[W-8,0],[0,H-8],[W-8,H-8]]) {
    for (let dy = 0; dy < 7; dy++) for (let dx = 0; dx < 7; dx++) {
      const i = ((cy+dy)*W+(cx+dx))*C;
      sR += buf[i]; sG += buf[i+1]; sB += buf[i+2]; n++;
    }
  }
  const bgR = sR/n, bgG = sG/n, bgB = sB/n;

  // Step 3: white-fill logo + bottom text zones
  const LOGO_XEND = Math.floor(W * LOGO_XEND_RATIO);
  const LOGO_YEND = Math.floor(H * LOGO_YEND_RATIO);
  const BOT_START = cfg.botStart;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const inBottom = y >= BOT_START;
      const inLogo   = x < LOGO_XEND && y < LOGO_YEND;
      if (!inBottom && !inLogo) continue;
      const i = (y*W+x)*C;
      buf[i] = 255; buf[i+1] = 255; buf[i+2] = 255;
    }
  }

  // Step 4: flood-fill background → white
  const visited = new Uint8Array(W * H);
  const queue = [];
  function enq(x, y) {
    if (x < 0 || y < 0 || x >= W || y >= H || visited[y*W+x]) return;
    const i = (y*W+x)*C;
    const isW = buf[i] >= 250 && buf[i+1] >= 250 && buf[i+2] >= 250;
    const isBg = Math.abs(buf[i]-bgR) <= FLOOD_TOL && Math.abs(buf[i+1]-bgG) <= FLOOD_TOL && Math.abs(buf[i+2]-bgB) <= FLOOD_TOL;
    if (isW || isBg) { visited[y*W+x] = 1; queue.push(y*W+x); }
  }
  for (let x = 0; x < W; x++) { enq(x,0); enq(x,H-1); }
  for (let y = 0; y < H; y++) { enq(0,y); enq(W-1,y); }
  let qi = 0;
  while (qi < queue.length) {
    const pos = queue[qi++];
    const x = pos % W, y = Math.floor(pos / W);
    const i = (y*W+x)*C;
    buf[i] = 255; buf[i+1] = 255; buf[i+2] = 255;
    enq(x+1,y); enq(x-1,y); enq(x,y+1); enq(x,y-1);
  }

  await sharp(buf, { raw: { width: W, height: H, channels: C } })
    .jpeg({ quality: 96 })
    .toFile(tmp);

  try { unlinkSync(dest); } catch {}
  renameSync(tmp, dest);
  console.log(`C${idx}: bg after enhance=R${Math.round(bgR)},G${Math.round(bgG)},B${Math.round(bgB)} → done`);
}

for (const idx of [1, 3, 5]) await process(idx);
console.log('All done.');
