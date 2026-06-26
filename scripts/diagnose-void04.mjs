import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const dir = join(__dirname, '../public/products');

for (let i = 1; i <= 5; i++) {
  const src = join(dir, `void-04-c${i}.jpg`);
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const buf = Buffer.from(data);

  // Corner background
  let sR=0,sG=0,sB=0,n=0;
  for (const [cx,cy] of [[0,0],[W-8,0],[0,H-8],[W-8,H-8]]) {
    for (let dy=0;dy<6;dy++) for (let dx=0;dx<6;dx++) {
      const ii=((cy+dy)*W+(cx+dx))*C;
      sR+=buf[ii]; sG+=buf[ii+1]; sB+=buf[ii+2]; n++;
    }
  }
  const bgR=sR/n, bgG=sG/n, bgB=sB/n;

  // Count non-bg pixels in logo zone (top-left 40%x25%) and text zone (bottom 20%)
  const LX=Math.floor(W*0.40), LY=Math.floor(H*0.25), TY=Math.floor(H*0.80);
  let logo=0, text=0;
  const THRESH=12;
  for (let y=0;y<LY;y++) for (let x=0;x<LX;x++) {
    const ii=(y*W+x)*C, avg=(buf[ii]+buf[ii+1]+buf[ii+2])/3;
    if (Math.abs(avg-((bgR+bgG+bgB)/3))>THRESH) logo++;
  }
  for (let y=TY;y<H;y++) for (let x=0;x<W;x++) {
    const ii=(y*W+x)*C, avg=(buf[ii]+buf[ii+1]+buf[ii+2])/3;
    if (Math.abs(avg-((bgR+bgG+bgB)/3))>THRESH) text++;
  }

  // Darkest pixel anywhere (to detect text)
  let minV=255, minX=0, minY=0;
  for (let y=0;y<H;y++) for (let x=0;x<W;x++) {
    const ii=(y*W+x)*C, avg=(buf[ii]+buf[ii+1]+buf[ii+2])/3;
    if (avg<minV) { minV=avg; minX=x; minY=y; }
  }

  console.log(`C${i}: ${W}x${H} bg=R${Math.round(bgR)},G${Math.round(bgG)},B${Math.round(bgB)} | logo-zone:${logo}px text-zone:${text}px | darkest:avg=${Math.round(minV)} at (${minX},${minY})`);
}
