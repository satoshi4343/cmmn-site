/**
 * Install user-provided void-03 images:
 * Convert .jpg.png (PNG format) → .jpg at quality 97, preserving exact appearance.
 */
import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { unlinkSync, renameSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const dir = join(__dirname, '../public/products');

for (let i = 1; i <= 5; i++) {
  const src  = join(dir, `void-03-c${i}.jpg.png`);
  const dest = join(dir, `void-03-c${i}.jpg`);
  const tmp  = join(dir, `void-03-c${i}_new_tmp.jpg`);

  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  await sharp(src)
    .jpeg({ quality: 97, chromaSubsampling: '4:4:4' })
    .toFile(tmp);

  try { unlinkSync(dest); } catch {}
  renameSync(tmp, dest);
  console.log(`C${i}: ${W}x${H} PNG → JPEG saved as void-03-c${i}.jpg`);
}
console.log('Done.');
