"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
//  商品データ
// ─────────────────────────────────────────────────────────────
interface ProductInfo {
  id: string;
  code: string;
  desc: string;
  details: string;
  price: string;
  frameColor: number;
  lensColor: number;
  lensOpacity: number;
  spotColor: number;
  position: [number, number, number];
  rotation: number;
}

const PRODUCTS: ProductInfo[] = [
  {
    id: "core-01", code: "CORE / 01",
    desc: "Classic daily silhouette.",
    details: "Frame: Polycarbonate (PC) · Lens: Acrylic UV400 · Finish: Anti-reflective · Style: Sport fashion",
    price: "¥7,980",
    frameColor: 0x111118, lensColor: 0x060a18, lensOpacity: 0.94,
    spotColor: 0xfff0d0,
    position: [0, 0, -4.5], rotation: 0,
  },
  {
    id: "core-02", code: "CORE / 02",
    desc: "Chrome silver. Titanium arm.",
    details: "Frame: Titanium alloy · Lens: Mirror silver UV400 · Finish: PVD chrome · Fit: Unisex",
    price: "¥7,980",
    frameColor: 0x8899bb, lensColor: 0x9ab0cc, lensOpacity: 0.22,
    spotColor: 0xfff8ee,
    position: [-2.2, 0, -1.5], rotation: Math.PI / 6,
  },
  {
    id: "core-03", code: "CORE / 03",
    desc: "Gunmetal acetate. Timeless form.",
    details: "Frame: Acetate · Lens: Dark grey UV400 · Finish: Matte gunmetal · Fit: Unisex",
    price: "¥7,980",
    frameColor: 0x404858, lensColor: 0x2a3040, lensOpacity: 0.88,
    spotColor: 0xffe8cc,
    position: [2.2, 0, -1.5], rotation: -Math.PI / 6,
  },
];

// カメラプリセット
const CAM_OVERVIEW  = new THREE.Vector3(0, 1.65, 3.5);
const CAM_LOOK_OV   = new THREE.Vector3(0, 1.1, -2);

function productCamPos(p: ProductInfo)  { return new THREE.Vector3(p.position[0], 1.35, p.position[2] + 1.6); }
function productCamLook(p: ProductInfo) { return new THREE.Vector3(p.position[0], 1.15, p.position[2]); }

// ─────────────────────────────────────────────────────────────
//  商品詳細パネル（HTML オーバーレイ）
// ─────────────────────────────────────────────────────────────
function ProductPanel({ product, onClose }: { product: ProductInfo | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (product) setTimeout(() => setMounted(true), 20);
    else setMounted(false);
  }, [product]);
  if (!product) return null;

  return (
    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"flex-end", justifyContent:"flex-end", pointerEvents:"none", zIndex:20 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", opacity:mounted?1:0, transition:"opacity 0.6s ease", pointerEvents:"all", cursor:"default" }} />
      <div style={{
        position:"relative", width:"clamp(300px,38vw,500px)", height:"100%",
        backgroundColor:"rgba(6,6,8,0.97)", borderLeft:"1px solid rgba(255,255,255,0.06)",
        backdropFilter:"blur(20px)", padding:"clamp(2.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
        display:"flex", flexDirection:"column",
        transform: mounted ? "translateX(0)" : "translateX(100%)",
        transition:"transform 0.55s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents:"all", overflowY:"auto",
      }}>
        <button onClick={onClose} style={{ position:"absolute", top:"1.5rem", right:"1.5rem", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.3)", fontSize:"1.2rem", lineHeight:1, padding:"0.5rem", transition:"color 0.3s" }}
          onMouseEnter={e=>((e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.8)")}
          onMouseLeave={e=>((e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.3)")}
        >✕</button>

        <p style={{ color:"rgba(255,255,255,0.18)", fontSize:"0.48rem", letterSpacing:"0.6em", textTransform:"uppercase", fontWeight:300, margin:"0 0 1.5rem" }}>{product.code}</p>
        <h2 style={{ color:"#fff", fontSize:"clamp(2.2rem,4vw,3.2rem)", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", lineHeight:1, margin:"0 0 0.8rem" }}>{product.code}</h2>
        <p style={{ color:"rgba(255,255,255,0.38)", fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:300, margin:"0 0 2.5rem" }}>{product.desc}</p>

        <div style={{ height:"1px", backgroundColor:"rgba(255,255,255,0.06)", margin:"0 0 2rem" }} />
        <div style={{ marginBottom:"2rem" }}>
          <p style={{ color:"rgba(255,255,255,0.16)", fontSize:"0.44rem", letterSpacing:"0.55em", textTransform:"uppercase", margin:"0 0 0.9rem" }}>Details</p>
          {product.details.split(" · ").map((line,i) => (
            <p key={i} style={{ color:"rgba(255,255,255,0.42)", fontSize:"0.6rem", letterSpacing:"0.06em", lineHeight:1.8, margin:"0 0 0.2rem" }}>{line}</p>
          ))}
        </div>
        <div style={{ height:"1px", backgroundColor:"rgba(255,255,255,0.06)", margin:"0 0 2rem" }} />

        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"1.1rem", letterSpacing:"0.08em", fontWeight:300, margin:"0 0 2rem" }}>
          {product.price}
          <span style={{ fontSize:"0.48rem", letterSpacing:"0.3em", color:"rgba(255,255,255,0.22)", marginLeft:"0.8rem" }}>TAX INCL.</span>
        </p>

        <div style={{ flex:1 }} />
        <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
          <Link href="https://cmmn-2.myshopify.com" target="_blank" rel="noopener noreferrer"
            style={{ display:"block", textAlign:"center", padding:"1rem 0", backgroundColor:"#fff", color:"#080808", fontSize:"0.55rem", letterSpacing:"0.5em", textTransform:"uppercase", fontWeight:700, textDecoration:"none", borderRadius:"1px", transition:"background-color 0.3s" }}
            onMouseEnter={e=>((e.currentTarget as HTMLElement).style.backgroundColor="rgba(255,255,255,0.88)")}
            onMouseLeave={e=>((e.currentTarget as HTMLElement).style.backgroundColor="#fff")}
          >Buy Now</Link>
          <button onClick={onClose}
            style={{ display:"block", width:"100%", padding:"0.9rem 0", backgroundColor:"transparent", color:"rgba(255,255,255,0.3)", fontSize:"0.5rem", letterSpacing:"0.48em", textTransform:"uppercase", fontWeight:300, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"1px", cursor:"pointer", transition:"border-color 0.3s, color 0.3s" }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.28)"; (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.65)"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.3)"; }}
          >Back to store</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ラベル型
// ─────────────────────────────────────────────────────────────
interface LabelState { x:number; y:number; code:string; price:string; visible:boolean; hovered:boolean; }

// ─────────────────────────────────────────────────────────────
//  メインコンポーネント
// ─────────────────────────────────────────────────────────────
export default function StoreScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [labels, setLabels] = useState<LabelState[]>([]);
  const [entryDone, setEntryDone] = useState(false);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef   = useRef<THREE.PerspectiveCamera | null>(null);
  const productGroupsRef = useRef<Array<{ group:THREE.Group; glassGroup:THREE.Group; info:ProductInfo }>>([]);

  const camTargetPos  = useRef(CAM_OVERVIEW.clone());
  const camTargetLook = useRef(CAM_LOOK_OV.clone());
  const mouseNorm     = useRef({ x:0, y:0 });
  const hoveredGroup  = useRef<THREE.Group | null>(null);

  const selectProduct = useCallback((p: ProductInfo | null) => {
    setSelectedProduct(p);
    camTargetPos.current.copy(p ? productCamPos(p) : CAM_OVERVIEW);
    camTargetLook.current.copy(p ? productCamLook(p) : CAM_LOOK_OV);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.55;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Scene ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog(0x050505, 9, 20);

    const camera = new THREE.PerspectiveCamera(68, mount.clientWidth / mount.clientHeight, 0.01, 100);
    camera.position.copy(CAM_OVERVIEW);
    camera.lookAt(CAM_LOOK_OV);
    cameraRef.current = camera;

    // ── Materials ─────────────────────────────────────────────
    // コンクリート壁（Supreme 的: ニュートラルな暗いグレー）
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.92, metalness: 0.0 });
    // ポリッシュドコンクリート床（微反射）
    const floorMat    = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.18, metalness: 0.75 });
    const ceilingMat  = new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 1.0 });
    // 台座: つや消し黒スチール
    const plinthMat   = new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.55, metalness: 0.6 });
    // トリム: ダークスチール
    const trimMat     = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.3, metalness: 0.9 });
    // ガラスケース
    const glassMat    = new THREE.MeshStandardMaterial({ color: 0xaabbcc, transparent: true, opacity: 0.06, roughness: 0.0, metalness: 0.05 });

    // ── Room geometry ─────────────────────────────────────────
    const W = 10, H = 4.0, D = 18;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    scene.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilingMat);
    ceiling.rotation.x = Math.PI / 2; ceiling.position.y = H;
    scene.add(ceiling);

    [ [0, H/2, -D/2, W, H, 0],          // 奥壁
      [0, H/2,  D/2, W, H, Math.PI],    // 手前壁
      [-W/2, H/2, 0, D, H, Math.PI/2],  // 左壁
      [ W/2, H/2, 0, D, H,-Math.PI/2],  // 右壁
    ].forEach(([x,y,z,w,h,ry]) => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(w, h), concreteMat);
      wall.position.set(x, y, z); wall.rotation.y = ry; wall.receiveShadow = true;
      scene.add(wall);
    });

    // 幅木（baseboard）– 左右壁の下部
    const baseH = 0.12;
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.5, metalness: 0.4 });
    [-W/2 + 0.01, W/2 - 0.01].forEach(wx => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.025, baseH, D - 0.2), baseMat);
      base.position.set(wx, baseH / 2, 0);
      scene.add(base);
    });
    // 奥壁の幅木
    const baseBack = new THREE.Mesh(new THREE.BoxGeometry(W, baseH, 0.025), baseMat);
    baseBack.position.set(0, baseH / 2, -D/2 + 0.01);
    scene.add(baseBack);

    // 天井スチールレール（3本）
    [-2, 0, 2].forEach(xOff => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, D - 0.8), trimMat);
      rail.position.set(xOff, H - 0.018, 0);
      scene.add(rail);
    });

    // ── 壁パネル（Wall panels / 展示プレート）─────────────────
    // Supreme 的: 左右の壁に縦長のシンプルな黒いパネルを並べる
    const wallPanelMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.85, metalness: 0.05 });
    const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.7 });

    const wallPanelDefs = [
      // 左壁: x = -W/2, ry = Math.PI/2
      { x: -W/2 + 0.04, y: 1.8, z: -3.0, ry: Math.PI/2, pw: 1.4, ph: 2.0 },
      { x: -W/2 + 0.04, y: 1.8, z:  0.5, ry: Math.PI/2, pw: 1.4, ph: 2.0 },
      // 右壁: x = W/2, ry = -Math.PI/2
      { x:  W/2 - 0.04, y: 1.8, z: -3.0, ry:-Math.PI/2, pw: 1.4, ph: 2.0 },
      { x:  W/2 - 0.04, y: 1.8, z:  0.5, ry:-Math.PI/2, pw: 1.4, ph: 2.0 },
    ];
    wallPanelDefs.forEach(({ x, y, z, ry, pw, ph }) => {
      // パネル本体
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.025, ph, pw), wallPanelMat);
      panel.position.set(x, y, z); panel.rotation.y = ry;
      scene.add(panel);
      // 外枠
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.018, ph + 0.06, pw + 0.06), panelFrameMat);
      frame.position.set(x - (ry > 0 ? 0.005 : -0.005), y, z);
      frame.rotation.y = ry;
      scene.add(frame);
      // スポット
      const wspot = new THREE.SpotLight(0xffe0b0, 12, 5, Math.PI / 9, 0.5);
      wspot.position.set(x + (ry > 0 ? 1.5 : -1.5), H - 0.1, z);
      wspot.target.position.set(x, y, z);
      scene.add(wspot); scene.add(wspot.target);
    });

    // ── 奥壁ブランドプレート ────────────────────────────────
    const backPlateMat = new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 0.8 });
    const backPlate = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.8, 0.03), backPlateMat);
    backPlate.position.set(0, 2.8, -D/2 + 0.04);
    scene.add(backPlate);
    const backFrame = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.9, 0.015), panelFrameMat);
    backFrame.position.set(0, 2.8, -D/2 + 0.025);
    scene.add(backFrame);

    // ── 中央ロングテーブル（Supreme 的）─────────────────────
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x090909, roughness: 0.3, metalness: 0.8 });
    const tableLegMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.45, metalness: 0.7 });
    // 天板
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 3.5), tableMat);
    tableTop.position.set(0, 0.88, -0.5);
    tableTop.castShadow = true; tableTop.receiveShadow = true;
    scene.add(tableTop);
    // 脚 × 4
    [[-0.6, -1.8], [-0.6, 0.8], [0.6, -1.8], [0.6, 0.8]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.88, 0.05), tableLegMat);
      leg.position.set(lx, 0.44, lz);
      leg.castShadow = true;
      scene.add(leg);
    });

    // ── 商品ディスプレイ ──────────────────────────────────────
    function buildDisplay(p: ProductInfo) {
      const group = new THREE.Group();
      group.position.set(...p.position);
      group.userData = { productId: p.id };

      // 台座
      const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.92, 0.72), plinthMat);
      pedestal.position.y = 0.46; pedestal.castShadow = true; pedestal.receiveShadow = true;
      group.add(pedestal);
      const topPlate = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.016, 0.76), trimMat);
      topPlate.position.y = 0.929;
      group.add(topPlate);

      // サングラス
      const lensM  = new THREE.MeshStandardMaterial({ color: p.lensColor, roughness: 0.04, metalness: 0.2, transparent: true, opacity: p.lensOpacity });
      const frameM = new THREE.MeshStandardMaterial({ color: p.frameColor, roughness: 0.25, metalness: 0.8 });
      const glassGroup = new THREE.Group();
      glassGroup.rotation.y = p.rotation;

      [[-0.165, 0], [0.165, 0]].forEach(([lx]) => {
        const lens  = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.135, 0.038), lensM);
        lens.position.set(lx, 0, 0); glassGroup.add(lens);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.295, 0.148, 0.022), frameM);
        frame.position.set(lx, 0, -0.01); glassGroup.add(frame);
      });
      const bridge  = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.022, 0.025), frameM);
      bridge.position.set(0, 0.008, 0); glassGroup.add(bridge);
      const templeL = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.014, 0.014), frameM);
      templeL.position.set(-0.4, 0, 0.015); templeL.rotation.y = -0.22; glassGroup.add(templeL);
      const templeR = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.014, 0.014), frameM);
      templeR.position.set(0.4, 0, 0.015); templeR.rotation.y = 0.22; glassGroup.add(templeR);

      glassGroup.position.set(0, 1.08, 0);
      group.add(glassGroup);

      // ガラスケース
      const cW = 1.1, cH = 0.72, cD = 1.1;
      const cy = 0.929 + cH / 2;
      [[0,cy,cD/2,0],[0,cy,-cD/2,Math.PI],[-cW/2,cy,0,Math.PI/2],[cW/2,cy,0,-Math.PI/2]].forEach(([px,py,pz,ry]) => {
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(cW, cH), glassMat);
        panel.position.set(px, py, pz); panel.rotation.y = ry;
        group.add(panel);
      });
      const topB = new THREE.Mesh(new THREE.BoxGeometry(cW + 0.02, 0.016, cD + 0.02), trimMat);
      topB.position.set(0, cy + cH / 2, 0); group.add(topB);
      const botB = new THREE.Mesh(new THREE.BoxGeometry(cW + 0.02, 0.012, cD + 0.02), trimMat);
      botB.position.set(0, cy - cH / 2, 0); group.add(botB);

      scene.add(group);

      // 商品スポット（白熱色）
      const spot = new THREE.SpotLight(new THREE.Color(p.spotColor), 30, 5, Math.PI / 9, 0.22, 2);
      spot.position.set(p.position[0], H - 0.05, p.position[2]);
      spot.target.position.set(p.position[0], 0.95, p.position[2]);
      spot.castShadow = true; spot.shadow.mapSize.set(512, 512);
      scene.add(spot); scene.add(spot.target);

      // 天井フィクスチャ（ドット）
      const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.035, 12),
        new THREE.MeshBasicMaterial({ color: 0xffd0a0 }));
      fixture.position.set(p.position[0], H - 0.018, p.position[2]);
      scene.add(fixture);

      productGroupsRef.current.push({ group, glassGroup, info: p });
    }

    PRODUCTS.forEach(buildDisplay);

    // ── ライティング ──────────────────────────────────────────
    // 極めて暗いアンビエント（Supreme 的: 影を殺さない）
    scene.add(new THREE.AmbientLight(0xffffff, 0.03));

    // 天井全体スポット（前方 × 2, 後方 × 2）
    [[-2.5, -5], [2.5, -5], [-2.5, 1], [2.5, 1]].forEach(([sx, sz]) => {
      const s = new THREE.SpotLight(0xfff5e0, 8, 9, Math.PI / 9, 0.55, 1.5);
      s.position.set(sx, H - 0.05, sz);
      s.target.position.set(sx, 0, sz);
      s.castShadow = true; s.shadow.mapSize.set(256, 256);
      scene.add(s); scene.add(s.target);
    });

    // 奥壁ウォッシュ（深みを出す）
    const backWash = new THREE.PointLight(0x8899cc, 3, 7);
    backWash.position.set(0, 3, -D / 2 + 1.2);
    scene.add(backWash);

    // ── 浮遊ダスト ────────────────────────────────────────────
    const dustCount = 180;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i*3]   = (Math.random() - 0.5) * W * 0.88;
      dustPos[i*3+1] = Math.random() * H;
      dustPos[i*3+2] = (Math.random() - 0.5) * D * 0.88;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo,
      new THREE.PointsMaterial({ color: 0xffeedd, size: 0.012, transparent: true, opacity: 0.35 }));
    scene.add(dust);

    // ── Raycaster ─────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();
    const getClickable = () => productGroupsRef.current.map(g => g.group.children).flat();

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseNorm.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.set(mouseNorm.current.x, mouseNorm.current.y);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(getClickable(), true);
      if (hits.length > 0) {
        mount.style.cursor = "pointer";
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData.productId) obj = obj.parent;
        hoveredGroup.current = obj as THREE.Group | null;
      } else {
        mount.style.cursor = selectedProduct ? "default" : "crosshair";
        hoveredGroup.current = null;
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(getClickable(), true);
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData.productId) obj = obj.parent;
        if (obj) {
          const p = PRODUCTS.find(x => x.id === obj!.userData.productId);
          if (p) selectProduct(p);
        }
      }
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onClick);
    window.addEventListener("resize", () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });

    // ── Render loop ───────────────────────────────────────────
    const clock  = new THREE.Clock();
    let animId: number;
    const currentPos  = camera.position.clone();
    const lerpLook    = CAM_LOOK_OV.clone();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t  = clock.getElapsedTime();
      clock.getDelta(); // consume delta

      const parallax = selectedProduct ? 0 : 0.18;
      const targetPos = camTargetPos.current.clone().add(
        new THREE.Vector3(mouseNorm.current.x * parallax, mouseNorm.current.y * 0.07, 0)
      );
      currentPos.lerp(targetPos, 0.04);
      camera.position.copy(currentPos);
      lerpLook.lerp(camTargetLook.current, 0.036);
      camera.lookAt(lerpLook);

      dust.position.y = Math.sin(t * 0.04) * 0.025;

      productGroupsRef.current.forEach(({ group, glassGroup, info }) => {
        const isHovered = hoveredGroup.current?.userData.productId === info.id;
        glassGroup.position.y = 1.08 + Math.sin(t * 0.75 + info.position[0]) * 0.016;
        glassGroup.rotation.y = info.rotation + Math.sin(t * 0.28 + info.position[2]) * 0.055;
        const ts = isHovered ? 1.016 : 1.0;
        group.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.08);
      });

      // ラベル投影
      const newLabels: LabelState[] = productGroupsRef.current.map(({ info }) => {
        const wp = new THREE.Vector3(info.position[0], 1.65, info.position[2]).project(camera);
        const x  = (wp.x * 0.5 + 0.5) * 100;
        const y  = (-wp.y * 0.5 + 0.5) * 100;
        return { x, y, code: info.code, price: info.price,
          visible: wp.z < 1 && x > 0 && x < 100 && y > 0 && y < 100,
          hovered: hoveredGroup.current?.userData.productId === info.id };
      });
      setLabels(newLabels);

      renderer.render(scene, camera);
    };

    // エントリーアニメ
    camera.position.set(0, 1.65, 7);
    currentPos.set(0, 1.65, 7);
    setTimeout(() => setEntryDone(true), 900);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    camTargetPos.current.copy(selectedProduct ? productCamPos(selectedProduct) : CAM_OVERVIEW);
    camTargetLook.current.copy(selectedProduct ? productCamLook(selectedProduct) : CAM_LOOK_OV);
  }, [selectedProduct]);

  return (
    <div ref={mountRef} className="absolute inset-0" style={{ cursor:"crosshair" }}>

      {/* 商品ラベル */}
      {!selectedProduct && labels.map((l, i) => (
        <div key={i} onClick={() => selectProduct(PRODUCTS[i])}
          style={{
            position:"absolute", left:`${l.x}%`, top:`${l.y}%`,
            transform:"translate(-50%,-100%)",
            pointerEvents: l.visible ? "all" : "none",
            opacity: l.visible ? (l.hovered ? 1 : 0.65) : 0,
            transition:"opacity 0.4s ease", cursor:"pointer",
            textAlign:"center", userSelect:"none",
          }}>
          <div style={{
            padding:"0.4rem 0.9rem",
            backgroundColor: l.hovered ? "rgba(14,14,16,0.95)" : "rgba(8,8,10,0.78)",
            border:`1px solid ${l.hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
            backdropFilter:"blur(10px)", borderRadius:"1px",
            transition:"background-color 0.3s, border-color 0.3s",
          }}>
            <p style={{ color:"#fff", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", margin:0, lineHeight:1 }}>{l.code}</p>
            <p style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.42rem", letterSpacing:"0.45em", textTransform:"uppercase", margin:"0.22rem 0 0", fontWeight:300 }}>{l.price}</p>
          </div>
          <div style={{ width:"1px", height: l.hovered ? "1.6rem" : "1rem", backgroundColor: l.hovered ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)", margin:"0 auto", transition:"height 0.3s, background-color 0.3s" }} />
        </div>
      ))}

      {/* 入場ガイド */}
      {!selectedProduct && entryDone && (
        <div style={{ position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", textAlign:"center", pointerEvents:"none" }}>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:"0.48rem", letterSpacing:"0.6em", textTransform:"uppercase", fontWeight:300, margin:0 }}>
            Click product to explore
          </p>
        </div>
      )}

      {/* 商品詳細パネル */}
      <ProductPanel product={selectedProduct} onClose={() => selectProduct(null)} />
    </div>
  );
}
