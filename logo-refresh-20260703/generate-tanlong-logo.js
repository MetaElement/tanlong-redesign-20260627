const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = __dirname;
const dirs = {
  concepts: path.join(root, "logos", "concepts"),
  final: path.join(root, "final"),
  export: path.join(root, "export"),
};

for (const dir of Object.values(dirs)) fs.mkdirSync(dir, { recursive: true });
for (const file of fs.readdirSync(dirs.concepts)) {
  if (file.endsWith(".svg")) fs.unlinkSync(path.join(dirs.concepts, file));
}
for (const file of fs.readdirSync(dirs.export)) {
  if (file.endsWith(".png")) fs.unlinkSync(path.join(dirs.export, file));
}

const palette = {
  deep: "#082E35",
  ink: "#0D2D33",
  graphite: "#173E45",
  teal: "#0EA7A0",
  cyan: "#21C7D8",
  mint: "#9BEBC8",
  white: "#FFFFFF",
  fog: "#EAF7F4",
  steel: "#6D858B",
  line: "#B7D2D1",
};

function toneColors(tone) {
  const light = tone === "light";
  return {
    main: light ? palette.white : palette.ink,
    secondary: light ? "#DDF8F1" : palette.graphite,
    shadow: light ? "#78D9D0" : "#75969B",
    cut: light ? palette.deep : palette.fog,
    accent: palette.cyan,
    accent2: palette.mint,
    outline: light ? palette.white : palette.ink,
  };
}

function foldedTlMark({ tone = "dark", variant = "ribbon" } = {}) {
  const c = toneColors(tone);
  const opacity = tone === "light" ? "0.9" : "1";

  if (variant === "segments") {
    return `<g id="icon" shape-rendering="geometricPrecision">
      <polygon points="76,126 145,126 116,183 47,183" fill="${c.main}"/>
      <polygon points="212,126 319,126 289,183 190,183" fill="${c.main}"/>
      <polygon points="346,118 397,171 366,228 316,176" fill="${c.accent2}"/>
      <polygon points="207,183 280,183 239,382 166,382" fill="${c.main}"/>
      <polygon points="280,183 318,225 277,425 239,382" fill="${c.secondary}" opacity="${opacity}"/>
      <polygon points="82,382 166,382 206,430 119,430" fill="${c.main}"/>
      <polygon points="204,382 386,382 426,430 164,430" fill="${c.main}"/>
      <polygon points="386,382 426,430 462,382 424,334" fill="${c.accent}"/>
    </g>`;
  }

  if (variant === "outline") {
    return `<g id="icon" fill="none" stroke="${c.outline}" stroke-width="18" stroke-linejoin="round" stroke-linecap="round" shape-rendering="geometricPrecision">
      <path d="M88 138H337L393 193L358 247L316 192H220L178 404H392L444 350"/>
      <path d="M220 192L178 404"/>
      <path d="M337 138L393 193H328"/>
      <path d="M358 247L444 350H392"/>
      <path d="M178 404L219 450H355L392 404"/>
      <path d="M393 193L356 239" stroke="${c.accent2}"/>
      <path d="M316 192L358 247" stroke="${c.accent}"/>
    </g>`;
  }

  if (variant === "seal") {
    return `<g id="icon" shape-rendering="geometricPrecision">
      <polygon points="82,121 348,121 318,178 112,178" fill="${c.main}"/>
      <polygon points="348,121 402,175 370,232 318,178" fill="${c.secondary}" opacity="${opacity}"/>
      <polygon points="204,178 280,178 239,383 163,383" fill="${c.main}"/>
      <polygon points="280,178 320,223 279,429 239,383" fill="${c.secondary}" opacity="${opacity}"/>
      <polygon points="163,383 389,383 427,437 125,437" fill="${c.main}"/>
      <polygon points="389,383 427,437 462,391 425,337" fill="${c.accent2}"/>
      <polygon points="82,383 125,437 83,437 41,383" fill="${c.accent}"/>
      <path d="M126 98C184 72 285 68 366 95" fill="none" stroke="${c.accent}" stroke-width="15" stroke-linecap="round"/>
      <circle cx="360" cy="141" r="9" fill="${c.accent2}"/>
    </g>`;
  }

  return `<g id="icon" shape-rendering="geometricPrecision">
    <polygon points="82,126 350,126 319,183 113,183" fill="${c.main}"/>
    <polygon points="350,126 400,176 368,233 319,183" fill="${c.accent2}"/>
    <polygon points="319,183 368,233 313,233 281,183" fill="${c.secondary}" opacity="${opacity}"/>
    <polygon points="207,183 281,183 239,383 165,383" fill="${c.main}"/>
    <polygon points="281,183 321,226 279,426 239,383" fill="${c.secondary}" opacity="${opacity}"/>
    <polygon points="86,383 165,383 205,426 124,426" fill="${c.shadow}" opacity="0.75"/>
    <polygon points="165,383 388,383 426,426 205,426" fill="${c.main}"/>
    <polygon points="388,383 426,426 463,382 424,334" fill="${c.accent}"/>
    <polygon points="50,383 86,383 124,426 88,426" fill="${c.accent2}"/>
    <polygon points="82,126 113,183 48,183 18,126" fill="${c.main}" opacity="0.96"/>
  </g>`;
}

function markSvg({ tone = "dark", id = "mark", variant = "ribbon", background = false } = {}) {
  const bg = background ? `<rect width="512" height="512" rx="112" fill="${palette.deep}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">坦隆环境折面 TL 标识</title>
  <desc id="${id}-desc">A folded geometric TL monogram for Tanlong Environment, inspired by architectural facets and a subtle dragon-like turning stroke.</desc>
  ${bg}
  ${foldedTlMark({ tone, variant })}
</svg>`;
}

function fullLogo({ tone = "light", id = "full", variant = "ribbon" } = {}) {
  const darkText = tone === "dark";
  const text = darkText ? palette.ink : palette.white;
  const sub = darkText ? palette.steel : "rgba(255,255,255,0.78)";
  const shadow = darkText ? "" : `<filter id="${id}-shadow" x="-20%" y="-40%" width="140%" height="180%">
      <feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#001D25" flood-opacity="0.22"/>
    </filter>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 392 64" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">坦隆环境 Tanlong Environment logo</title>
  <desc id="${id}-desc">A premium Tanlong Environment logo with a folded geometric TL monogram and bilingual wordmark.</desc>
  <defs>${shadow}</defs>
  <g id="logo-lockup"${darkText ? "" : ` filter="url(#${id}-shadow)"`}>
    <g transform="translate(-6 -1) scale(0.13)">
      ${foldedTlMark({ tone, variant })}
    </g>
    <g id="wordmark" font-family="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Helvetica, Arial, sans-serif">
      <text x="88" y="29" fill="${text}" font-size="29" font-weight="760" letter-spacing="0">坦隆环境</text>
      <text x="90" y="50" fill="${sub}" font-size="12.3" font-weight="650" letter-spacing="2.05">TANLONG ENVIRONMENT</text>
    </g>
  </g>
</svg>`;
}

function conceptSvg({ id, label, family, variant, note, recommendation }) {
  const isOutline = variant === "outline";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">${label}</title>
  <desc id="${id}-desc">${note}</desc>
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1024" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#F8FCFB"/>
      <stop offset="1" stop-color="#E6F4F1"/>
    </linearGradient>
    <filter id="${id}-soft" x="-12%" y="-16%" width="124%" height="132%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#082E35" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="1024" height="512" rx="38" fill="url(#${id}-bg)"/>
  <g filter="url(#${id}-soft)">
    <rect x="74" y="58" width="364" height="396" rx="22" fill="${isOutline ? "#FFFFFF" : palette.deep}"/>
    <g transform="translate(0 0)">
      ${foldedTlMark({ tone: isOutline ? "dark" : "light", variant })}
    </g>
  </g>
  <g font-family="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Helvetica, Arial, sans-serif">
    <text x="510" y="184" fill="${palette.ink}" font-size="58" font-weight="760">坦隆环境</text>
    <text x="514" y="233" fill="${palette.steel}" font-size="22" font-weight="700" letter-spacing="4.4">TANLONG ENVIRONMENT</text>
    <text x="514" y="296" fill="${palette.teal}" font-size="20" font-weight="650" letter-spacing="3">${family}</text>
    <path d="M514 326H748" stroke="${palette.teal}" stroke-width="4" stroke-linecap="round"/>
    <path d="M766 326H822" stroke="${palette.mint}" stroke-width="4" stroke-linecap="round"/>
    <text x="92" y="478" fill="${palette.steel}" font-size="15" font-weight="650" letter-spacing="1.5">${note}</text>
  </g>
  <text x="822" y="438" fill="${recommendation ? palette.teal : palette.steel}" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="2">${recommendation ? "RECOMMENDED" : "OPTION"}</text>
</svg>`;
}

const concepts = [
  {
    file: "concept-1-folded-dragon-tl.svg",
    label: "Folded Dragon TL",
    family: "FOLDED GEOMETRIC TL",
    variant: "ribbon",
    note: "采用附件的折面字母逻辑，T 的横势、L 的底座和龙身转折合成一个工程感标识。",
    recommendation: true,
  },
  {
    file: "concept-2-prism-line-tl.svg",
    label: "Prism Line TL",
    family: "AXONOMETRIC OUTLINE",
    variant: "outline",
    note: "更接近参考图右侧的立体线框，适合品牌规范页，但官网小尺寸稍弱。",
    recommendation: false,
  },
  {
    file: "concept-3-segmented-tl.svg",
    label: "Segmented TL",
    family: "BROKEN FOLD SYSTEM",
    variant: "segments",
    note: "更接近参考图左侧的断裂块面，识别度强，但整体气质更锋利。",
    recommendation: false,
  },
  {
    file: "concept-4-seal-fold-tl.svg",
    label: "Seal Fold TL",
    family: "DRAGON SEAL FOLD",
    variant: "seal",
    note: "在折面 TL 上加入更明显的龙形上扬线，适合高端物料和品牌提案。",
    recommendation: false,
  },
];

function write(file, content) {
  fs.writeFileSync(file, content.trim() + "\n", "utf8");
}

for (const concept of concepts) {
  write(path.join(dirs.concepts, concept.file), conceptSvg({ id: concept.file.replace(/\.svg$/, ""), ...concept }));
}

write(path.join(dirs.final, "tanlong-logo-full.svg"), fullLogo({ tone: "light", id: "tanlong-full", variant: "ribbon" }));
write(path.join(dirs.final, "tanlong-logo-full-dark.svg"), fullLogo({ tone: "dark", id: "tanlong-full-dark", variant: "ribbon" }));
write(path.join(dirs.final, "tanlong-logo-mark.svg"), markSvg({ tone: "dark", id: "tanlong-mark", variant: "ribbon" }));
write(path.join(dirs.final, "tanlong-logo-mark-on-dark.svg"), markSvg({ tone: "light", id: "tanlong-mark-dark", variant: "ribbon", background: true }));

const cards = concepts.map((concept, index) => `<article class="card">
  <div class="card-media"><img src="concepts/${concept.file}" alt="${concept.label}"></div>
  <div class="card-copy">
    <strong>${String(index + 1).padStart(2, "0")} ${concept.label}</strong>
    <span>${concept.recommendation ? "推荐用于官网。最接近附件的折面逻辑，同时在导航小尺寸下仍能读出 TL。" : "备选方向，用于比较线框感、断裂感和龙形意象的强弱。"}</span>
  </div>
</article>`).join("\n");

const previewHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>坦隆环境折面 TL Logo Preview</title>
  <style>
    :root { --ink: ${palette.ink}; --deep: ${palette.deep}; --teal: ${palette.teal}; --line: rgba(16,46,53,.14); }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif; color: var(--ink); background: linear-gradient(180deg,#f8fcfb 0%,#e6f4f1 100%); }
    main { width: min(1480px, calc(100vw - 96px)); margin: 0 auto; padding: 72px 0 84px; }
    header { display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: end; margin-bottom: 42px; }
    h1 { margin: 0; font-size: 52px; line-height: 1.05; font-weight: 760; letter-spacing: 0; }
    .meta { color: #6a8187; font-size: 15px; letter-spacing: .16em; text-transform: uppercase; text-align: right; }
    .hero { display: grid; grid-template-columns: 1.05fr .95fr; gap: 28px; margin-bottom: 28px; }
    .panel { border: 1px solid var(--line); border-radius: 8px; background: rgba(255,255,255,.76); box-shadow: 0 24px 80px rgba(11,47,56,.10); overflow: hidden; }
    .hero .panel:first-child { display: flex; align-items: center; justify-content: center; min-height: 360px; background: radial-gradient(circle at 18% 20%, rgba(155,235,200,.24), transparent 34%), #082e35; }
    .hero .panel:first-child img { width: min(560px, 82%); }
    .hero .panel:last-child { padding: 46px; display: grid; align-content: center; gap: 26px; }
    .hero .panel:last-child img { width: 360px; max-width: 100%; }
    .principles { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-top: 8px; }
    .principles span { border-top: 1px solid var(--line); padding-top: 14px; color: #526b70; line-height: 1.6; font-size: 15px; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 22px; }
    .card-media { background: #fff; padding: 0; }
    .card-media img { width: 100%; display: block; }
    .card-copy { display: grid; gap: 8px; padding: 18px 20px; border-top: 1px solid var(--line); color: #526b70; font-size: 14px; line-height: 1.55; }
    .card-copy strong { color: var(--ink); font-size: 16px; letter-spacing: .04em; }
    .sizes { margin-top: 28px; padding: 28px; display: flex; gap: 32px; align-items: end; flex-wrap: wrap; }
    .sizes img { display: block; }
    .sizes .chip { display: grid; justify-items: center; gap: 8px; color: #6a8187; font-size: 12px; letter-spacing: .08em; }
    @media (max-width: 1180px) { .grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
    @media (max-width: 1000px) { main { width: min(100vw - 36px, 760px); } header, .hero { grid-template-columns: 1fr; } .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>坦隆环境折面 TL Logo</h1>
      <div class="meta">Folded Geometry / 2026-07-04</div>
    </header>
    <section class="hero">
      <div class="panel"><img src="../final/tanlong-logo-full.svg" alt="坦隆环境推荐横版 logo"></div>
      <div class="panel">
        <img src="../final/tanlong-logo-full-dark.svg" alt="坦隆环境深色文字版 logo">
        <div class="principles">
          <span>参考附件的斜向骨架、折纸切面和立体块面，但不复制原图字形。</span>
          <span>远看是稳定工程标识，近看能读出 T 的横势和 L 的底座。</span>
          <span>青绿切面保留环境、水务和低碳科技感，适合深色官网 Hero。</span>
        </div>
      </div>
    </section>
    <section class="grid">${cards}</section>
    <section class="panel sizes">
      <div class="chip"><img src="../final/tanlong-logo-mark.svg" width="96" height="96" alt="96px mark"><span>96px</span></div>
      <div class="chip"><img src="../final/tanlong-logo-mark.svg" width="64" height="64" alt="64px mark"><span>64px</span></div>
      <div class="chip"><img src="../final/tanlong-logo-mark.svg" width="32" height="32" alt="32px mark"><span>32px</span></div>
      <div class="chip"><img src="../final/tanlong-logo-mark.svg" width="16" height="16" alt="16px mark"><span>16px</span></div>
    </section>
  </main>
</body>
</html>`;

write(path.join(root, "logos", "preview.html"), previewHtml);
write(path.join(root, "review-board.html"), previewHtml.replace(/src="concepts\//g, 'src="logos/concepts/').replace(/src="\.\.\/final\//g, 'src="final/'));

write(path.join(root, "handoff.md"), `# 坦隆环境折面 TL Logo

推荐方向：Folded Dragon TL。

设计要点：
- 参考附件中的几何折面、斜向骨架和负形切口，但不复制原图造型。
- 主体由 T 的横势、倾斜龙身和 L 形底座构成，兼顾英文首字母和中文“龙”的转折意象。
- 标识使用实心块面而不是细线，保证官网导航、favicon 和工程物料小尺寸可读。
- 青绿折面连接水务、环境科技和低碳业务，整体比上一版书法曲线更现代、更硬朗。

注意：
- 当前版本适合官网原型、视觉提案和内部评审。
- 正式商用前仍需要商标近似检索、字体授权确认和最终矢量制版。
`);

write(path.join(root, "manifest.json"), JSON.stringify({
  brand: "坦隆环境 / Tanlong Environment",
  date: "2026-07-04",
  selectedDirection: "concept-1-folded-dragon-tl",
  designIntent: "Folded geometric TL monogram inspired by architectural facets and a subtle dragon-like turning stroke.",
  reference: "/Users/RenChengyuan/Downloads/original-a7f88a8bedaaf3964c6123a47f5fbceb.webp",
  palette,
  files: {
    preview: "logos/preview.html",
    reviewBoard: "review-board.html",
    concepts: concepts.map((concept) => `logos/concepts/${concept.file}`),
    final: [
      "final/tanlong-logo-full.svg",
      "final/tanlong-logo-full-dark.svg",
      "final/tanlong-logo-mark.svg",
      "final/tanlong-logo-mark-on-dark.svg",
    ],
  },
}, null, 2));

async function exportPng(svgPath, outPath, width) {
  await sharp(svgPath).resize({ width, withoutEnlargement: false }).png().toFile(outPath);
}

async function exportAll() {
  const exports = [
    ["final/tanlong-logo-full.svg", "tanlong-logo-full-2048.png", 2048],
    ["final/tanlong-logo-full.svg", "tanlong-logo-full-1024.png", 1024],
    ["final/tanlong-logo-full-dark.svg", "tanlong-logo-full-dark-2048.png", 2048],
    ["final/tanlong-logo-mark.svg", "tanlong-logo-mark-1024.png", 1024],
    ["final/tanlong-logo-mark.svg", "tanlong-logo-mark-512.png", 512],
    ["final/tanlong-logo-mark.svg", "tanlong-logo-mark-192.png", 192],
    ["final/tanlong-logo-mark.svg", "tanlong-logo-mark-48.png", 48],
    ["final/tanlong-logo-mark.svg", "tanlong-logo-mark-32.png", 32],
    ["final/tanlong-logo-mark.svg", "tanlong-logo-mark-16.png", 16],
  ];
  for (const [input, output, width] of exports) {
    await exportPng(path.join(root, input), path.join(dirs.export, output), width);
  }
}

exportAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
