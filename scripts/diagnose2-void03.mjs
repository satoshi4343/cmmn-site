import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const dir = join(__dirname, '../public/products');

// For each original: scan rows from bottom upward to find
// 1) where text starts (first row with very dark pixels from bottom)
// 2) where product ends (last row with dark pixels that's NOT text)
for (let i of [2,3,4,5]) {
  const { data, info } = await sharp(join(dir, `void-03-c${i}_original.jpg`)).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const buf = Buffer.from(data);

  // Find rows that contain dark pixels (non-background), from bottom up
  const darkRows = [];
  for (let y = H-1; y >= 0; y--) {
    let hasDark = false;
    for (let x = 0; x < W; x++) {
      const ii = (y*W+x)*C;
      if (buf[ii] < 150 && buf[ii+1] < 150 && buf[ii+2] < 150) { hasDark = true; break; }
    }
    if (hasDark) darkRows.push(y);
  }

  // The text rows are at the BOTTOM of darkRows (highest y values)
  // The product rows should be denser / more contiguous
  const maxDark = Math.min(...darkRows);
  const minDark = Math.max(...darkRows);
  console.log(`C${i} [${W}x${H}]: dark rows from y=${maxDark} to y=${minDark} (${darkRows.length} rows total)`);

  // Find the gap between text block and product block
  // Sort descending to find discontinuity
  darkRows.sort((a,b) => b-a);
  for (let j = 1; j < darkRows.length; j++) {
    if (darkRows[j-1] - darkRows[j] > 20) {
      console.log(`  GAP at y=${darkRows[j]} to y=${darkRows[j-1]} → text below y=${darkRows[j-1]}, product above y=${darkRows[j]}`);
      break;
    }
  }
}
