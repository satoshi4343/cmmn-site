/**
 * VOID03 final clean v3
 * Diagnosis confirmed: product ends ~y=610, text starts ~y=757, gap in between.
 * Strategy:
 *   1. Paint top 60px + below y=640 → white (removes logo and color text for sure)
 *   2. Flood-fill background from corners (preserves lens highlights inside frame)
 */
import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { unlinkSync, renameSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const dir = join(__dirname, '../public/products');

const FLOOD_TOL = 30;

async function process(idx) {
  const src  = join(dir, `void-03-c${idx}_original.jpg`);
  const dest = join(dir, `void-03-c${idx}.jpg`);
  const tmp  = join(dir, `void-03-c${idx}_ftmp.jpg`);

  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const buf = Buffer.from(data);

  // Sample background from corners
  let sR = 0, sG = 0, sB = 0, n = 0;
  for (const [cx, cy] of [[0,0],[W-8,0],[0,H-8],[W-8,H-8]]) {
    for (let dy = 0; dy < 7; dy++) for (let dx = 0; dx < 7; dx++) {
      const i = ((cy+dy)*W+(cx+dx))*C;
      sR += buf[i]; sG += buf[i+1]; sB += buf[i+2]; n++;
    }
  }
  const bgR = sR/n, bgG = sG/n, bgB = sB/n;

  // Step 1: white-fill text/logo zones
  const BOT_START  = 640;              // y≥640 → bottom text zone (text starts y≈757)
  const LOGO_XEND  = Math.floor(W * 0.38); // left 38% for CMMN. logo (x<365 for W=960)
  const LOGO_YEND  = Math.floor(H * 0.32); // top 32% for CMMN. logo (y<304 for H=950)

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const inBottom = y >= BOT_START;
      const inLogo   = x < LOGO_XEND && y < LOGO_YEND;
      if (!inBottom && !inLogo) continue;
      const i = (y*W+x)*C;
      buf[i] = 255; buf[i+1] = 255; buf[i+2] = 255;
    }
  }

  // Step 2: flood-fill remaining background → white
  const visited = new Uint8Array(W * H);
  const queue = [];

  function enq(x, y) {
    if (x < 0 || y < 0 || x >= W || y >= H || visited[y*W+x]) return;
    const i = (y*W+x)*C;
    const isW = buf[i] >= 253 && buf[i+1] >= 253 && buf[i+2] >= 253;
    const isBg = Math.abs(buf[i]-bgR) <= FLOOD_TOL &&
                 Math.abs(buf[i+1]-bgG) <= FLOOD_TOL &&
                 Math.abs(buf[i+2]-bgB) <= FLOOD_TOL;
    if (isW || isBg) { visited[y*W+x] = 1; queue.push(y*W+x); }
  }

  for (let x = 0; x < W; x++) { enq(x,0); enq(x,H-1); }
  for (let y = 0; y < H; y++) { enq(0,y); enq(W-1,y); }

  let qi = 0, painted = 0;
  while (qi < queue.length) {
    const pos = queue[qi++];
    const x = pos % W, y = Math.floor(pos / W);
    const i = (y*W+x)*C;
    buf[i] = 255; buf[i+1] = 255; buf[i+2] = 255;
    painted++;
    enq(x+1,y); enq(x-1,y); enq(x,y+1); enq(x,y-1);
  }

  await sharp(buf, { raw: { width: W, height: H, channels: C } })
    .jpeg({ quality: 96 })
    .toFile(tmp);

  try { unlinkSync(dest); } catch {}
  renameSync(tmp, dest);
  console.log(`C${idx} [${W}x${H}]: bg=${Math.round(bgR)}, flood=${painted}px → done`);
}

for (let i = 1; i <= 5; i++) await process(i);
console.log('All done.');
