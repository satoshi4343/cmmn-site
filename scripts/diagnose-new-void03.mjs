/**
 * Detect any non-background pixels in text zones (both darker AND lighter than bg)
 */
import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const dir = join(__dirname, '../public/products');

for (let i = 1; i <= 5; i++) {
  const src = join(dir, `void-03-c${i}.jpg.png`);
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const buf = Buffer.from(data);

  // Sample bg from center-edge strips (avoid corners where product might be)
  // Use large flat strip samples
  const samples = [];
  for (let x = 0; x < W; x++) {
    const ii = (2*W+x)*C; // row y=2
    samples.push((buf[ii]+buf[ii+1]+buf[ii+2])/3);
  }
  samples.sort((a,b)=>a-b);
  const bgEst = samples[Math.floor(samples.length/2)]; // median of top row

  // Scan logo zone: top 25% height, left 40% width
  const LX = Math.floor(W*0.40), LY = Math.floor(H*0.25);
  // Scan text zone: bottom 18% height, full width
  const TY = Math.floor(H*0.82);

  let logoPixels=[], textPixels=[];
  const THRESH = 8; // differ from bg by this amount

  for (let y=0;y<LY;y++) for (let x=0;x<LX;x++) {
    const ii=(y*W+x)*C, avg=(buf[ii]+buf[ii+1]+buf[ii+2])/3;
    if (Math.abs(avg-bgEst)>THRESH) logoPixels.push({x,y,avg});
  }
  for (let y=TY;y<H;y++) for (let x=0;x<W;x++) {
    const ii=(y*W+x)*C, avg=(buf[ii]+buf[ii+1]+buf[ii+2])/3;
    if (Math.abs(avg-bgEst)>THRESH) textPixels.push({x,y,avg});
  }

  console.log(`C${i}: bg≈${Math.round(bgEst)} | logo zone non-bg pixels: ${logoPixels.length} | text zone non-bg pixels: ${textPixels.length}`);
  if (logoPixels.length > 0 && logoPixels.length < 20) console.log('  logo:', logoPixels.slice(0,5).map(p=>`(${p.x},${p.y})avg=${Math.round(p.avg)}`).join(' '));
  if (textPixels.length > 0 && textPixels.length < 20) console.log('  text:', textPixels.slice(0,5).map(p=>`(${p.x},${p.y})avg=${Math.round(p.avg)}`).join(' '));
}
