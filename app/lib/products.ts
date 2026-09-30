// ─────────────────────────────────────────────────────────
//  CMMN. 商品データ
//  商品名は code（"CORE / 01"）のみ。個別名なし。
//  画像: brand-site/public/products/ に配置
//        image: null → "Photo coming soon" プレースホルダー
// ─────────────────────────────────────────────────────────

export type Series = "ALL" | "AXON" | "CORE" | "KOVA" | "VOID";

export interface SpecRow {
  label: string;
  value: string;
}

export interface ColorVariant {
  label: string;       // "C1" | "C2" | "C3" | "C4"
  name: string;        // "Black Frame / Black-Grey Lens"
  image: string | null;
  soldOut?: boolean;   // true = 在庫なし（表示はするが購入不可）
  // 複数オプション商品（例：Frame Color × Eye Prescription）で使用
  // 設定時は variantIndex による位置探索を行わず、このIDを直接使用する
  shopifyVariantId?: string;
}

export interface Product {
  id: string;
  series: Series;
  number: string;              // "01" | "02" ...
  code: string;                // "CORE / 01" — 商品名として使用
  tagline: string;
  taglineJa?: string;          // Japanese tagline
  price: string;
  defaultVariantIndex: number;
  variants: ColorVariant[];
  description: string;
  descriptionJa?: string;      // Japanese description
  detailRows: SpecRow[];
  detailRowsJa?: SpecRow[];    // Japanese detail rows
  sizeRows: SpecRow[];
  sizeRowsJa?: SpecRow[];      // Japanese size rows
  shopifyId?: string;
}

// ─────────────────────────────────────────────────────────
//  未発売商品のプレースホルダー
// ─────────────────────────────────────────────────────────
function tbd(id: string, series: Series, number: string, tagline: string, price: string): Product {
  return {
    id, series, number,
    code: `${series} / ${number}`,
    tagline, price,
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "—", image: null },
      { label: "C2", name: "—", image: null },
      { label: "C3", name: "—", image: null },
      { label: "C4", name: "—", image: null },
    ],
    description: "Details coming soon.",
    detailRows: [],
    sizeRows: [],
  };
}

// ─────────────────────────────────────────────────────────
//  AXON SERIES
// ─────────────────────────────────────────────────────────
const AXON: Product[] = [
  {
    id: "axon-01",
    series: "AXON",
    number: "01",
    code: "AXON / 01",
    tagline: "A narrow rectangular frame with a low-profile silhouette, designed for a sharp everyday look.",
    taglineJa: "狭い矩形フレームと低プロファイルのシルエットで、鋭いエッジの日常を演出。",
    price: "¥2,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Black",         image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/d4d2a05a-d24e-4f48-957b-1a83b5695237.png" },
      { label: "C2", name: "Leopard Brown", image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/AXON01_tortoise_white_background.png" },
      { label: "C3", name: "Clear Blue",    image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/AXON01_Blue_square_unchanged.png" },
      { label: "C4", name: "Leopard Black", image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/AXON01_tortoise_darklens_white_background.png" },
      { label: "C5", name: "Clear Pink",    image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/AXON01_Pink_square_unchanged.png" },
    ],
    description: "A narrow rectangular frame with a low-profile silhouette, designed for a sharp everyday look.",
    descriptionJa: "狭い矩形フレームと低プロファイルのシルエットで、鋭いエッジの日常を演出。",
    detailRows: [
      { label: "Frame",         value: "Plastic" },
      { label: "Lens Material", value: "Polycarbonate" },
      { label: "Lens",          value: "Gradient / UV400" },
      { label: "Style",         value: "Rectangle" },
      { label: "Fit",           value: "Unisex" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "プラスチック" },
      { label: "レンズ素材",   value: "ポリカーボネート" },
      { label: "レンズ",       value: "グラデーション / UV400" },
      { label: "スタイル",     value: "矩形" },
      { label: "フィット感",   value: "ユニセックス" },
    ],
    sizeRows: [
      { label: "Lens Width",  value: "65 mm" },
      { label: "Lens Height", value: "39 mm" },
    ],
    sizeRowsJa: [
      { label: "レンズ幅",     value: "65 mm" },
      { label: "レンズ高さ",   value: "39 mm" },
    ],
    shopifyId: "9347880452329",
  },
  {
    id: "axon-02",
    series: "AXON",
    number: "02",
    code: "AXON / 02",
    tagline: "A bold rectangular frame with a wide, structured silhouette, designed for a sharp everyday look.",
    taglineJa: "大胆な矩形フレームと広く構造化されたシルエットで、シャープな日常を演出。",
    price: "¥2,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Black / Gray",   image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/S23a60eebb14245feb94f1f3a4dc1ab0aT.webp" },
      { label: "C2", name: "Black / Brown",  image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/S78f14ea359f943d4a6feb6433d9c0504L.webp" },
      { label: "C3", name: "Black / Orange", image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/S6f0b7834b9994038bb15691fac8096f69.webp" },
    ],
    description: "A bold rectangular frame with a structured polycarbonate construction and UV400 lenses. Available in C1 Black / Gray, C2 Black / Brown, and C3 Black / Orange.",
    descriptionJa: "大胆な矩形フレームと構造化されたポリカーボネート素材、UV400レンズ搭載。C1ブラック/グレー、C2ブラック/ブラウン、C3ブラック/オレンジから選べます。",
    detailRows: [
      { label: "Frame",         value: "Polycarbonate" },
      { label: "Lens Material", value: "Polycarbonate" },
      { label: "Lens",          value: "UV400" },
      { label: "Structure",     value: "Full frame" },
      { label: "Style",         value: "Rectangle" },
      { label: "Fit",           value: "Unisex" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "ポリカーボネート" },
      { label: "レンズ素材",   value: "ポリカーボネート" },
      { label: "レンズ",       value: "UV400" },
      { label: "構造",         value: "フルフレーム" },
      { label: "スタイル",     value: "矩形" },
      { label: "フィット感",   value: "ユニセックス" },
    ],
    sizeRows: [
      { label: "Total Width",    value: "146 mm" },
      { label: "Lens Width",     value: "67 mm" },
      { label: "Lens Height",    value: "39 mm" },
      { label: "Bridge",         value: "13 mm" },
      { label: "Temple Length",  value: "155 mm" },
    ],
    sizeRowsJa: [
      { label: "総幅",           value: "146 mm" },
      { label: "レンズ幅",       value: "67 mm" },
      { label: "レンズ高さ",     value: "39 mm" },
      { label: "ブリッジ",       value: "13 mm" },
      { label: "テンプル長",     value: "155 mm" },
    ],
    shopifyId: "9346524807401",
  },
  {
    id: "axon-03",
    series: "AXON",
    number: "03",
    code: "AXON / 03",
    tagline: "A rimless rectangular frame with a refined metal construction and decorative temple detailing.",
    taglineJa: "洗練されたメタル製のリムレス矩形フレーム、装飾的なテンプルディテール付き。",
    price: "¥2,980",
    defaultVariantIndex: 0,
    variants: [
      {
        label: "C1",
        name: "Gold / Black",
        image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/0b4b1d58-5e9d-4559-9f5c-109973dbe8dd.png",
        shopifyVariantId: "51526891864297",
      },
      {
        label: "C2",
        name: "Silver / Black",
        image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/AXON03_Silver_1200x1200_cb612e80-5df4-463e-b3bb-74690a1de469.jpg",
        shopifyVariantId: "51526892060905",
      },
    ],
    description: "A rimless rectangular frame with a refined metal construction and decorative temple detailing.",
    descriptionJa: "洗練されたメタル素材のリムレス矩形フレーム、装飾的なテンプルディテール付き。",
    detailRows: [
      { label: "Frame",         value: "Copper" },
      { label: "Lens Material", value: "Plastic" },
      { label: "Structure",     value: "Rimless" },
      { label: "Style",         value: "Rectangle" },
      { label: "Lens Color",    value: "Clear" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "銅" },
      { label: "レンズ素材",   value: "プラスチック" },
      { label: "構造",         value: "リムレス" },
      { label: "スタイル",     value: "矩形" },
      { label: "レンズカラー", value: "クリア" },
    ],
    sizeRows: [
      { label: "Total Width",   value: "150 mm" },
      { label: "Lens Width",    value: "53 mm" },
      { label: "Lens Height",   value: "34 mm" },
      { label: "Bridge",        value: "18 mm" },
      { label: "Temple Length", value: "148 mm" },
    ],
    sizeRowsJa: [
      { label: "総幅",         value: "150 mm" },
      { label: "レンズ幅",     value: "53 mm" },
      { label: "レンズ高さ",   value: "34 mm" },
      { label: "ブリッジ",     value: "18 mm" },
      { label: "テンプル長",   value: "148 mm" },
    ],
    shopifyId: "9346524479721",
  },
  {
    id: "axon-04",
    series: "AXON",
    number: "04",
    code: "AXON / 04",
    tagline: "A compact cat-eye frame with a sharp, sculpted silhouette, designed for a distinctive everyday look.",
    taglineJa: "コンパクトなキャットアイフレーム、鋭く彫刻的なシルエットで独特な日常を演出。",
    price: "¥2,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "White / Red",    image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/Sf8518a2f754244999658b5ee3b8cc466m.webp?v=1784608136" },
      { label: "C2", name: "Black / Red",    image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/S5fe7432b6c404be298c4bc02df6bfbdc8.webp?v=1784608136" },
      { label: "C3", name: "Blue / Gray",    image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/S56262cd3a2f24da6aa7c71c1e439cd08P.webp?v=1784608136" },
      { label: "C4", name: "Silver / Black", image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/S4e52319060ad4622a46071e6e94ff6ed6.webp?v=1784608136" },
      { label: "C5", name: "White / Gray",   image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/Sb7938477a3464a24a0b433127fb67e889.webp?v=1784608136" },
      { label: "C6", name: "Gunmetal / Black", image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/S55cb4c89c1774f75ad25eb63d4b0dcabs.webp?v=1784608136" },
      { label: "C7", name: "Gray / Silver",  image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/Sf732987b47214a23ab0ef1b3c69d025bu.webp?v=1784608136" },
      { label: "C8", name: "Black / Blue",   image: "https://cdn.shopify.com/s/files/1/0805/2047/8953/files/S69ea6e5497da4720a21dba1a76cf027f5.webp?v=1784608136" },
    ],
    description: "A compact cat-eye frame with an alloy construction, plastic lenses, and a sharp sculpted silhouette. Available in selected CMMN. colorways.",
    descriptionJa: "コンパクトなキャットアイフレーム、合金素材とプラスチックレンズ、鋭く彫刻的なシルエット。選定されたCMMN.カラーウェイで利用可能。",
    detailRows: [
      { label: "Frame",         value: "Alloy" },
      { label: "Lens Material", value: "Plastic" },
      { label: "Style",         value: "Cat Eye" },
      { label: "Fit",           value: "Unisex" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "合金" },
      { label: "レンズ素材",   value: "プラスチック" },
      { label: "スタイル",     value: "キャットアイ" },
      { label: "フィット感",   value: "ユニセックス" },
    ],
    sizeRows: [
      { label: "Total Width",  value: "148 mm" },
      { label: "Lens Width",   value: "50 mm" },
      { label: "Lens Height",  value: "40 mm" },
      { label: "Bridge",       value: "22 mm" },
      // Temple Length 未確認のため非表示
    ],
    shopifyId: "9350207701225",
  },
];

// ─────────────────────────────────────────────────────────
//  CORE SERIES
// ─────────────────────────────────────────────────────────
const CORE: Product[] = [
  {
    id: "core-01",
    series: "CORE",
    number: "01",
    code: "CORE / 01",
    tagline: "Classic daily sunglasses with a clean, sharp silhouette.",
    taglineJa: "クラシックな日常用サングラス、クリーンで鋭いシルエット。",
    price: "¥4,980",
    defaultVariantIndex: 0,    // C1 をデフォルト表示
    variants: [
      { label: "C1", name: "Black Frame / Black-Grey Lens",  image: "/products/core-01-c1.jpg" },
      { label: "C2", name: "Green Frame / Black-Grey Lens",  image: "/products/core-01-c2.jpg" },
      { label: "C3", name: "Silver Frame / Grey Lens",       image: "/products/core-01-c3.jpg" },
      { label: "C4", name: "Black Frame / Clear Lens",       image: "/products/core-01-c4.jpg" },
    ],
    description: "Classic daily sunglasses with a clean, sharp silhouette.",
    descriptionJa: "クラシックな日常用サングラス、クリーンで鋭いシルエット。",
    detailRows: [
      { label: "Frame",   value: "Polycarbonate (PC)" },
      { label: "Lens",    value: "Acrylic (AC) / UV400 protection" },
      { label: "Finish",  value: "Anti-reflective coating" },
      { label: "Style",   value: "Special-shaped fashion sunglasses" },
      { label: "Fit",     value: "Adult / Unisex" },
      { label: "Package", value: "1 pair of sunglasses" },
    ],
    detailRowsJa: [
      { label: "フレーム",   value: "ポリカーボネート (PC)" },
      { label: "レンズ",     value: "アクリル (AC) / UV400保護" },
      { label: "仕上げ",     value: "反射防止コーティング" },
      { label: "スタイル",   value: "特殊形状ファッションサングラス" },
      { label: "フィット感", value: "大人用 / ユニセックス" },
      { label: "パッケージ", value: "サングラス1ペア" },
    ],
    sizeRows: [
      { label: "Total Width",   value: "150 mm" },
      { label: "Lens Width",    value: "63 mm" },
      { label: "Lens Height",   value: "32 mm" },
      { label: "Bridge",        value: "18 mm" },
      { label: "Temple Length", value: "126 mm" },
    ],
    shopifyId: "9262952513769",
  },
  {
    id: "core-02",
    series: "CORE",
    number: "02",
    code: "CORE / 02",
    tagline: "Sleek wrap-style silhouette with lightweight performance fit.",
    taglineJa: "洗練されたラップスタイルシルエット、軽量パフォーマンスフィット。",
    price: "¥4,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Jet Black Frame / Black Lens",          image: "/products/core-02-c1.jpg" },
      { label: "C2", name: "Black Frame / Blue Lens",               image: "/products/core-02-c2.jpg" },
      { label: "C3", name: "Matte Silver Frame / Grey Lens",        image: "/products/core-02-c3.jpg" },
      { label: "C4", name: "Black Frame / Gradient Purple Lens",    image: "/products/core-02-c4.jpg" },
      { label: "C5", name: "Black Frame / Light Brown Lens",        image: "/products/core-02-c5.jpg" },
      { label: "C6", name: "Black Frame / Brown Lens",              image: "/products/core-02-c6.jpg" },
    ],
    description: "Sleek wrap-style sunglasses with a lightweight fit and sharp modern look.",
    descriptionJa: "洗練されたラップスタイルサングラス、軽量フィットとシャープなモダンルック。",
    detailRows: [
      { label: "Frame",   value: "Lightweight resin (PC)" },
      { label: "Lens",    value: "Acrylic / UV400 protection" },
      { label: "Finish",  value: "Anti-reflective coating" },
      { label: "Style",   value: "Wraparound sports sunglasses" },
      { label: "Fit",     value: "Adult / Unisex" },
    ],
    detailRowsJa: [
      { label: "フレーム",   value: "軽量樹脂 (PC)" },
      { label: "レンズ",     value: "アクリル / UV400保護" },
      { label: "仕上げ",     value: "反射防止コーティング" },
      { label: "スタイル",   value: "ラップアラウンドスポーツサングラス" },
      { label: "フィット感", value: "大人用 / ユニセックス" },
    ],
    sizeRows: [
      { label: "Total Width",   value: "138 mm" },
      { label: "Lens Width",    value: "68 mm" },
      { label: "Lens Height",   value: "35 mm" },
      { label: "Bridge",        value: "19 mm" },
      { label: "Temple Length", value: "140 mm" },
    ],
    shopifyId: "9262952644841",
  },
  {
    id: "core-03",
    series: "CORE",
    number: "03",
    code: "CORE / 03",
    tagline: "Sleek geometric frames with bold Y2K attitude.",
    taglineJa: "幾何学模様のスリークなフレーム、大胆なY2Kアティテュード。",
    price: "¥4,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Black Frame / Black Lens", image: "/products/core-03-c1.jpg", soldOut: true },
      { label: "C2", name: "Clear Frame / Light Blue Lens", image: "/products/core-03-c2.jpg", soldOut: true },
      { label: "C3", name: "Tortoise Frame / Brown Lens", image: "/products/core-03-c3.jpg", soldOut: true },
    ],
    description: "Details coming soon.",
    descriptionJa: "詳細は近日公開。",
    detailRows: [],
    detailRowsJa: [],
    sizeRows: [],
    shopifyId: "9262952382697",
  },
  {
    id: "core-04",
    series: "CORE",
    number: "04",
    code: "CORE / 04",
    tagline: "Bold square sunglasses designed for sports, driving, and everyday outdoor style.",
    taglineJa: "スポーツ、ドライブ、日常的なアウトドアスタイル向けに設計された大胆なスクエアサングラス。",
    price: "¥4,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Silver Frame / Clear Silver Lens", image: "/products/core-04-c1.jpg" },
      { label: "C2", name: "Black Frame / Grey Lens",          image: "/products/core-04-c2.jpg" },
      { label: "C3", name: "Pink Frame / Grey Lens",           image: "/products/core-04-c3.jpg" },
      { label: "C4", name: "Gunmetal Frame / Clear Silver Lens", image: "/products/core-04-c4.jpg" },
    ],
    description: "Bold square sunglasses designed for sports, driving, and everyday outdoor style.",
    descriptionJa: "スポーツ、ドライブ、日常的なアウトドアスタイル向けに設計された大胆なスクエアサングラス。",
    detailRows: [
      { label: "Frame",    value: "Polycarbonate (PC)" },
      { label: "Lens",     value: "Acrylic (AC) / UV protection" },
      { label: "Function", value: "Anti-glare and impact-resistant design" },
      { label: "Style",    value: "Square sport sunglasses" },
      { label: "Use",      value: "Cycling, driving, fishing, running, travel, beach, and outdoor activities" },
      { label: "Fit",      value: "Adult / Unisex" },
      { label: "Weight",   value: "37.7g" },
      { label: "Package",  value: "1 pair of sunglasses" },
    ],
    detailRowsJa: [
      { label: "フレーム",   value: "ポリカーボネート (PC)" },
      { label: "レンズ",     value: "アクリル (AC) / UV保護" },
      { label: "機能",       value: "グレア低減と衝撃耐性設計" },
      { label: "スタイル",   value: "スクエアスポーツサングラス" },
      { label: "用途",       value: "サイクリング、ドライブ、フィッシング、ランニング、旅行、ビーチ、アウトドア活動" },
      { label: "フィット感", value: "大人用 / ユニセックス" },
      { label: "重量",       value: "37.7g" },
      { label: "パッケージ", value: "サングラス1ペア" },
    ],
    sizeRows: [
      { label: "Total Width",   value: "150 mm" },
      { label: "Lens Width",    value: "60 mm" },
      { label: "Lens Height",   value: "34 mm" },
      { label: "Bridge",        value: "20 mm" },
      { label: "Temple Length", value: "123 mm" },
    ],
    shopifyId: "9258033119465",
  },
];

// ─────────────────────────────────────────────────────────
//  KOVA SERIES
// ─────────────────────────────────────────────────────────
const KOVA: Product[] = [
  {
    id: "kova-01",
    series: "KOVA",
    number: "01",
    code: "KOVA / 01",
    tagline: "Slim rectangle sunglasses with a sharp outdoor-ready Y2K look.",
    taglineJa: "シャープなアウトドア対応Y2Kルック、スリムな矩形サングラス。",
    price: "¥2,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Black Frame / Grey Lens",   image: "/products/kova-01-c1.jpg", soldOut: true },
      { label: "C2", name: "Black Frame / Silver Lens", image: "/products/kova-01-c2.jpg", soldOut: true },
    ],
    description: "Slim rectangle sunglasses with a sharp outdoor-ready Y2K look.",
    descriptionJa: "シャープなアウトドア対応Y2Kルック、スリムな矩形サングラス。",
    detailRows: [
      { label: "Frame",        value: "Polycarbonate" },
      { label: "Lens",         value: "Polycarbonate / UV400 protection" },
      { label: "Lens Feature", value: "Mirror and gradient lens" },
      { label: "Style",        value: "Slim rectangle fashion sunglasses" },
      { label: "Use",          value: "Outdoor wear and daily styling" },
      { label: "Fit",          value: "Adult / Women" },
      { label: "Package",      value: "1 pair of sunglasses" },
    ],
    detailRowsJa: [
      { label: "フレーム",       value: "ポリカーボネート" },
      { label: "レンズ",         value: "ポリカーボネート / UV400保護" },
      { label: "レンズ機能",     value: "ミラーとグラデーションレンズ" },
      { label: "スタイル",       value: "スリムな矩形ファッションサングラス" },
      { label: "用途",           value: "アウトドアウェアと日常的なスタイリング" },
      { label: "フィット感",     value: "大人用 / レディース" },
      { label: "パッケージ",     value: "サングラス1ペア" },
    ],
    sizeRows: [
      { label: "Total Width",   value: "145 mm" },
      { label: "Lens Width",    value: "70 mm" },
      { label: "Lens Height",   value: "25 mm" },
      { label: "Bridge",        value: "19 mm" },
      { label: "Temple Length", value: "120 mm" },
    ],
    shopifyId: "9258038788329",
  },
  {
    id: "kova-02",
    series: "KOVA",
    number: "02",
    code: "KOVA / 02",
    tagline: "Slim oval sunglasses with a clean vintage-inspired fashion look.",
    taglineJa: "クリーンでヴィンテージインスパイアされたファッションルック、スリムなオーバルサングラス。",
    price: "¥2,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Pale Pink Frame / Light Beige Lens", image: "/products/kova-02-c1.jpg", soldOut: true },
      { label: "C2", name: "Black Frame / Yellow Lens",           image: "/products/kova-02-c2.jpg", soldOut: true },
      { label: "C3", name: "Black Frame / Light Beige Lens",      image: "/products/kova-02-c3.jpg", soldOut: true },
      { label: "C4", name: "Black Frame / Grey Lens",             image: "/products/kova-02-c4.jpg", soldOut: true },
    ],
    description: "Slim oval sunglasses with a clean vintage-inspired fashion look.",
    descriptionJa: "クリーンでヴィンテージインスパイアされたファッションルック、スリムなオーバルサングラス。",
    detailRows: [
      { label: "Frame", value: "Acetate" },
      { label: "Lens",  value: "Plastic / UV400 protection" },
      { label: "Style", value: "Oval sunglasses" },
      { label: "Fit",   value: "Adult / Women" },
    ],
    detailRowsJa: [
      { label: "フレーム", value: "アセテート" },
      { label: "レンズ",   value: "プラスチック / UV400保護" },
      { label: "スタイル", value: "オーバルサングラス" },
      { label: "フィット感", value: "大人用 / レディース" },
    ],
    sizeRows: [
      { label: "Total Width",   value: "142 mm" },
      { label: "Lens Width",    value: "53 mm" },
      { label: "Lens Height",   value: "31 mm" },
      { label: "Bridge",        value: "19 mm" },
      { label: "Temple Length", value: "143 mm" },
    ],
    shopifyId: "9260466766057",
  },
  {
    id: "kova-03",
    series: "KOVA",
    number: "03",
    code: "KOVA / 03",
    tagline: "Y2K retro wrap-around sunglasses built for streetwear, driving, and outdoor style.",
    taglineJa: "ストリートウェア、ドライビング、アウトドアスタイル向けに設計されたY2Kレトロラップアラウンドサングラス。",
    price: "¥2,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Black Tea Frame / Brown Lens",    image: "/products/kova-03-c1.jpg" },
      { label: "C2", name: "Black Frame / Grey Lens",         image: "/products/kova-03-c2.jpg" },
      { label: "C3", name: "Clear Frame / Grey Lens",         image: "/products/kova-03-c3.jpg" },
      { label: "C4", name: "Leopard Print Frame / Grey Lens", image: "/products/kova-03-c4.jpg" },
    ],
    description: "Y2K retro wrap-around sunglasses built for streetwear, driving, and outdoor style.",
    descriptionJa: "ストリートウェア、ドライビング、アウトドアスタイル向けに設計されたY2Kレトロラップアラウンドサングラス。",
    detailRows: [
      { label: "Frame",    value: "Plastic / Polycarbonate-style lightweight frame" },
      { label: "Lens",     value: "Polycarbonate / UV400 protection" },
      { label: "Lens Feature", value: "Gradient mirror lens" },
      { label: "Design",   value: "Y2K retro wrap-around rectangle frame" },
      { label: "Function", value: "Windproof, glare-reducing, and outdoor-ready" },
      { label: "Fit",      value: "Adult / Unisex" },
      { label: "Use",      value: "Daily wear, cycling, driving, beach, travel, and outdoor activities" },
      { label: "Package",  value: "Sunglasses only" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "プラスチック / ポリカーボネートスタイル軽量フレーム" },
      { label: "レンズ",       value: "ポリカーボネート / UV400保護" },
      { label: "レンズ機能",   value: "グラデーションミラーレンズ" },
      { label: "デザイン",     value: "Y2Kレトロラップアラウンド矩形フレーム" },
      { label: "機能",         value: "防風、グレア低減、アウトドア対応" },
      { label: "フィット感",   value: "大人用 / ユニセックス" },
      { label: "用途",         value: "日常的な着用、サイクリング、ドライブ、ビーチ、旅行、アウトドア活動" },
      { label: "パッケージ",   value: "サングラスのみ" },
    ],
    sizeRows: [
      { label: "Lens Width",  value: "66 mm" },
      { label: "Lens Height", value: "40 mm" },
    ],
    shopifyId: "9258034561257",
  },
  {
    id: "kova-04",
    series: "KOVA",
    number: "04",
    code: "KOVA / 04",
    tagline: "Cat eye sunglasses with a sweet, party-ready look.",
    taglineJa: "甘くてパーティー対応ルック、キャットアイサングラス。",
    price: "¥2,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Leopard Frame / Brown Lens",    image: "/products/kova-04-c1.jpg", soldOut: true },
      { label: "C2", name: "Black Frame / Black-Grey Lens", image: "/products/kova-04-c2.jpg", soldOut: true },
    ],
    description: "Cat eye sunglasses with a sweet, party-ready look.",
    descriptionJa: "甘くてパーティー対応ルック、キャットアイサングラス。",
    detailRows: [
      { label: "Frame", value: "Polycarbonate" },
      { label: "Lens",  value: "Polycarbonate / UV400 protection" },
      { label: "Style", value: "Cat Eye" },
      { label: "Fit",   value: "Adult / Women" },
      { label: "Use",   value: "Party / Daily styling" },
    ],
    detailRowsJa: [
      { label: "フレーム",   value: "ポリカーボネート" },
      { label: "レンズ",     value: "ポリカーボネート / UV400保護" },
      { label: "スタイル",   value: "キャットアイ" },
      { label: "フィット感", value: "大人用 / レディース" },
      { label: "用途",       value: "パーティー / 日常的なスタイリング" },
    ],
    sizeRows: [
      { label: "Lens Width",    value: "50 mm" },
      { label: "Lens Height",   value: "23 mm" },
      { label: "Bridge",        value: "15 mm" },
      { label: "Temple Length", value: "138 mm" },
      { label: "Weight",        value: "19 g" },
    ],
    shopifyId: "9266077237481",
  },
];

// ─────────────────────────────────────────────────────────
//  VOID SERIES
// ─────────────────────────────────────────────────────────
const VOID: Product[] = [
  {
    id: "void-01",
    series: "VOID",
    number: "01",
    code: "VOID / 01",
    tagline: "Bold goggle-style sunglasses with a futuristic outdoor look.",
    taglineJa: "大胆なゴーグルスタイルサングラス、未来的なアウトドアルック。",
    price: "¥3,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Silver Frame / Grey Lens",      image: "/products/void-01-c1.png" },
      { label: "C2", name: "Black Frame / Yellow Lens",     image: "/products/void-01-c2.png" },
      { label: "C3", name: "Black Frame / Black-Grey Lens", image: "/products/void-01-c3.png" },
    ],
    description: "Bold goggle-style sunglasses with a futuristic outdoor look.",
    descriptionJa: "大胆なゴーグルスタイルサングラス、未来的なアウトドアルック。",
    detailRows: [
      { label: "Frame",        value: "Plastic" },
      { label: "Lens",         value: "Polycarbonate / UV400 protection" },
      { label: "Lens Feature", value: "Gradient lens" },
      { label: "Style",        value: "Goggle / punk-inspired fashion sunglasses" },
      { label: "Use",          value: "Outdoor wear and statement styling" },
      { label: "Fit",          value: "Adult / Women" },
      { label: "Package",      value: "1 pair of sunglasses" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "プラスチック" },
      { label: "レンズ",       value: "ポリカーボネート / UV400保護" },
      { label: "レンズ機能",   value: "グラデーションレンズ" },
      { label: "スタイル",     value: "ゴーグル / パンク風ファッションサングラス" },
      { label: "用途",         value: "アウトドアウェアとステートメントスタイリング" },
      { label: "フィット感",   value: "大人用 / レディース" },
      { label: "パッケージ",   value: "サングラス1ペア" },
    ],
    sizeRows: [
      { label: "Lens Width",  value: "79 mm" },
      { label: "Lens Height", value: "59 mm" },
    ],
    sizeRowsJa: [
      { label: "レンズ幅",     value: "79 mm" },
      { label: "レンズ高さ",   value: "59 mm" },
    ],
    shopifyId: "9258033414377",
  },
  {
    id: "void-02",
    series: "VOID",
    number: "02",
    code: "VOID / 02",
    tagline: "Oval Y2K sunglasses designed for outdoor style and daily protection.",
    taglineJa: "アウトドアスタイルと日常保護向けに設計されたオーバルY2Kサングラス。",
    price: "¥3,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Black Frame / Black-Grey Lens",  image: "/products/void-02-c1.jpg" },
      { label: "C2", name: "Clear Frame / Light Grey Lens",  image: "/products/void-02-c2.jpg" },
      { label: "C3", name: "Silver Frame / Black-Grey Lens", image: "/products/void-02-c3.jpg" },
    ],
    description: "Oval Y2K sunglasses designed for outdoor style and daily protection.",
    descriptionJa: "アウトドアスタイルと日常保護向けに設計されたオーバルY2Kサングラス。",
    detailRows: [
      { label: "Frame",    value: "Plastic" },
      { label: "Lens",     value: "Plastic / UV400 protection" },
      { label: "Style",    value: "Oval punk-inspired fashion sunglasses" },
      { label: "Function", value: "UV protection and glare reduction" },
      { label: "Use",      value: "Outdoor activities, cycling, and daily wear" },
      { label: "Fit",      value: "Adult / Men" },
      { label: "Package",  value: "1 pair of sunglasses" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "プラスチック" },
      { label: "レンズ",       value: "プラスチック / UV400保護" },
      { label: "スタイル",     value: "オーバル パンク風ファッションサングラス" },
      { label: "機能",         value: "UV保護とグレア低減" },
      { label: "用途",         value: "アウトドア活動、サイクリング、日常着用" },
      { label: "フィット感",   value: "大人用 / メンズ" },
      { label: "パッケージ",   value: "サングラス1ペア" },
    ],
    sizeRows: [
      { label: "Lens Width",  value: "50 mm" },
      { label: "Lens Height", value: "32 mm" },
    ],
    sizeRowsJa: [
      { label: "レンズ幅",     value: "50 mm" },
      { label: "レンズ高さ",   value: "32 mm" },
    ],
    shopifyId: "9258033447145",
  },
  {
    id: "void-03",
    series: "VOID",
    number: "03",
    code: "VOID / 03",
    tagline: "Oval Y2K sunglasses with a futuristic steampunk-inspired look.",
    taglineJa: "未来的なスチームパンク風ルック、オーバルY2Kサングラス。",
    price: "¥3,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Black Frame / Grey Lens",        image: "/products/void-03-c1.jpg" },
      { label: "C2", name: "Black Frame / Silvery Lens",     image: "/products/void-03-c2.jpg" },
      { label: "C3", name: "Grey Frame / Champagne Lens",    image: "/products/void-03-c3.jpg" },
      { label: "C4", name: "Silvery Frame / Grey Lens",      image: "/products/void-03-c4.jpg" },
      { label: "C5", name: "Silvery Frame / Light Grey Lens",image: "/products/void-03-c5.jpg" },
    ],
    description: "Oval Y2K sunglasses with a futuristic steampunk-inspired look.",
    descriptionJa: "未来的なスチームパンク風ルック、オーバルY2Kサングラス。",
    detailRows: [
      { label: "Frame",        value: "Polycarbonate (PC)" },
      { label: "Lens",         value: "Plastic / mirror gradient lens" },
      { label: "Lens Feature", value: "Anti-reflective coating" },
      { label: "Style",        value: "Oval Y2K / steampunk-inspired fashion sunglasses" },
      { label: "Use",          value: "Outdoor wear, fishing, and daily styling" },
      { label: "Fit",          value: "Adult / Unisex" },
      { label: "Weight",       value: "36 g" },
      { label: "Package",      value: "1 pair of sunglasses" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "ポリカーボネート (PC)" },
      { label: "レンズ",       value: "プラスチック / ミラーグラデーションレンズ" },
      { label: "レンズ機能",   value: "反射防止コーティング" },
      { label: "スタイル",     value: "オーバル Y2K / スチームパンク風ファッションサングラス" },
      { label: "用途",         value: "アウトドアウェア、フィッシング、日常的なスタイリング" },
      { label: "フィット感",   value: "大人用 / ユニセックス" },
      { label: "重量",         value: "36 g" },
      { label: "パッケージ",   value: "サングラス1ペア" },
    ],
    sizeRows: [
      { label: "Total Width",   value: "146 mm" },
      { label: "Lens Width",    value: "59 mm" },
      { label: "Lens Height",   value: "45 mm" },
      { label: "Bridge",        value: "21 mm" },
      { label: "Temple Length", value: "127 mm" },
    ],
    sizeRowsJa: [
      { label: "総幅",           value: "146 mm" },
      { label: "レンズ幅",       value: "59 mm" },
      { label: "レンズ高さ",     value: "45 mm" },
      { label: "ブリッジ",       value: "21 mm" },
      { label: "テンプル長",     value: "127 mm" },
    ],
    shopifyId: "9258039410921",
  },
  {
    id: "void-04",
    series: "VOID",
    number: "04",
    code: "VOID / 04",
    tagline: "Y2K goggle-style sunglasses with a bold oval frame for sporty streetwear.",
    taglineJa: "スポーティーなストリートウェア向けの大胆なオーバルフレーム、Y2Kゴーグルスタイルサングラス。",
    price: "¥3,980",
    defaultVariantIndex: 0,
    variants: [
      { label: "C1", name: "Bright Black Frame / Black Lens",      image: "/products/void-04-c1.jpg" },
      { label: "C2", name: "Matte Silver Frame / Grey Lens",       image: "/products/void-04-c2.jpg" },
      { label: "C3", name: "Black Frame / Gradient Purple Lens",   image: "/products/void-04-c3.jpg" },
      { label: "C4", name: "Black Frame / Light Brown Lens",       image: "/products/void-04-c4.jpg" },
      { label: "C5", name: "Black Frame / Purple Mirror Lens",     image: "/products/void-04-c5.jpg" },
    ],
    description: "Y2K goggle-style sunglasses with a bold oval frame, designed for sporty streetwear and daily outdoor styling.",
    descriptionJa: "スポーティーなストリートウェアと日常的なアウトドアスタイリング向けに設計された、大胆なオーバルフレームのY2Kゴーグルスタイルサングラス。",
    detailRows: [
      { label: "Frame",    value: "Polycarbonate" },
      { label: "Lens",     value: "Polycarbonate / UV400 protection" },
      { label: "Style",    value: "Y2K goggle-style oval frame" },
      { label: "Function", value: "Impact-resistant and UV-blocking" },
      { label: "Use",      value: "Sporty streetwear and daily outdoor styling" },
      { label: "Fit",      value: "Adult / Unisex" },
      { label: "Package",  value: "1 pair of sunglasses" },
    ],
    detailRowsJa: [
      { label: "フレーム",     value: "ポリカーボネート" },
      { label: "レンズ",       value: "ポリカーボネート / UV400保護" },
      { label: "スタイル",     value: "Y2Kゴーグルスタイル オーバルフレーム" },
      { label: "機能",         value: "衝撃耐性とUVブロッキング" },
      { label: "用途",         value: "スポーティーなストリートウェアと日常的なアウトドアスタイリング" },
      { label: "フィット感",   value: "大人用 / ユニセックス" },
      { label: "パッケージ",   value: "サングラス1ペア" },
    ],
    sizeRows: [
      { label: "Total Width",   value: "138 mm" },
      { label: "Lens Width",    value: "68 mm" },
      { label: "Lens Height",   value: "35 mm" },
      { label: "Bridge",        value: "19 mm" },
      { label: "Temple Length", value: "140 mm" },
    ],
    sizeRowsJa: [
      { label: "総幅",           value: "138 mm" },
      { label: "レンズ幅",       value: "68 mm" },
      { label: "レンズ高さ",     value: "35 mm" },
      { label: "ブリッジ",       value: "19 mm" },
      { label: "テンプル長",     value: "140 mm" },
    ],
    shopifyId: "9271285154025",
  },
];

// ─────────────────────────────────────────────────────────
//  エクスポート
// ─────────────────────────────────────────────────────────
export const ALL_PRODUCTS: Product[] = [...AXON, ...CORE, ...VOID, ...KOVA];
export const SERIES_LIST: Series[] = ["ALL", "AXON", "CORE", "VOID", "KOVA"];

export const SERIES_META: Record<Series, { description: string; price: string }> = {
  ALL:  { description: "All CMMN. styles.",                                                          price: "" },
  AXON: { description: "",                                                                            price: "¥2,980" },
  CORE: { description: "The essential CMMN. collection. Sport-inspired silhouettes for daily wear.", price: "¥4,980" },
  KOVA: { description: "Performance geometry meets street culture. Built for motion.",               price: "¥2,980" },
  VOID: { description: "Premium edition. Minimal hardware, maximum presence.",                       price: "¥3,980" },
};

export function getProduct(id: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.id === id);
}

export function getSeriesProducts(series: Series): Product[] {
  if (series === "ALL") return ALL_PRODUCTS;
  return ALL_PRODUCTS.filter(p => p.series === series);
}
