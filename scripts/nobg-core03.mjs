/**
 * core-03-c1.jpg の白背景をBFS flood-fill で透明化し PNG として保存
 */
import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const dir = join(__dirname, '../public/products');

const src  = join(dir, 'core-03-c1.jpg');
const dest = join(dir, 'core-03-c1-nobg.png');

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H } = info;
const C = 4; // RGBA
const buf = Buffer.from(data);

// コーナーから背景色を推定
let sR=0,sG=0,sB=0,n=0;
for (const [cx,cy] of [[0,0],[W-8,0],[0,H-8],[W-8,H-8]]) {
  for (let dy=0;dy<8;dy++) for (let dx=0;dx<8;dx++) {
    const i=((cy+dy)*W+(cx+dx))*C;
    sR+=buf[i]; sG+=buf[i+1]; sB+=buf[i+2]; n++;
  }
}
const bgR=sR/n, bgG=sG/n, bgB=sB/n;
console.log(`bg estimate: R${Math.round(bgR)} G${Math.round(bgG)} B${Math.round(bgB)}`);

// BFS flood-fill: 四隅・全辺から背景色に近いピクセルを透明化
const THRESH = 28;
const visited = new Uint8Array(W * H);
const queue = [];

function enq(x, y) {
  if (x<0||y<0||x>=W||y>=H||visited[y*W+x]) return;
  const i=(y*W+x)*C;
  const dr=buf[i]-bgR, dg=buf[i+1]-bgG, db=buf[i+2]-bgB;
  if (Math.sqrt(dr*dr+dg*dg+db*db) <= THRESH) {
    visited[y*W+x]=1;
    queue.push(y*W+x);
  }
}

for (let x=0;x<W;x++) { enq(x,0); enq(x,H-1); }
for (let y=0;y<H;y++) { enq(0,y); enq(W-1,y); }

let qi=0, removed=0;
while (qi<queue.length) {
  const pos=queue[qi++];
  const x=pos%W, y=Math.floor(pos/W);
  buf[(y*W+x)*C+3]=0; // alpha=0 (透明)
  removed++;
  enq(x+1,y); enq(x-1,y); enq(x,y+1); enq(x,y-1);
}

await sharp(buf, { raw:{ width:W, height:H, channels:C } })
  .png({ compressionLevel:9 })
  .toFile(dest);

console.log(`透明化完了: ${removed} pixels → ${dest}`);
