import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const dir = join(__dirname, '../public/products');

// Scan bottom 20% of each original to find min pixel value (text = darkest)
for (let i = 1; i <= 5; i++) {
  const { data, info } = await sharp(join(dir, `void-03-c${i}_original.jpg`)).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const buf = Buffer.from(data);
  const yStart = Math.floor(H * 0.80);
  let minVal = 255, minX = 0, minY = 0;
  for (let y = yStart; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i2 = (y * W + x) * C;
      const avg = (buf[i2] + buf[i2+1] + buf[i2+2]) / 3;
      if (avg < minVal) { minVal = avg; minX = x; minY = y; }
    }
  }
  const ip = (minY * W + minX) * C;
  console.log(`C${i}: darkest pixel in bottom 20% = R${buf[ip]} G${buf[ip+1]} B${buf[ip+2]} @ (${minX},${minY}) [${W}x${H}]`);
}
