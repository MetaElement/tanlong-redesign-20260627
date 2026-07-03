const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = __dirname;
const dirs = {
  logos: path.join(root, "logos"),
  concepts: path.join(root, "logos", "concepts"),
  final: path.join(root, "final"),
  export: path.join(root, "export"),
};

for (const dir of Object.values(dirs)) {
  fs.mkdirSync(dir, { recursive: true });
}

const palette = {
  deep: "#0B2F38",
  ink: "#102E35",
  teal: "#0FA7A1",
  cyan: "#23C4D8",
  mint: "#8BE7C2",
  white: "#FFFFFF",
  fog: "#EAF7F5",
  steel: "#6A8187",
};

function markDefs(idPrefix = "tl") {
  return `
  <defs>
    <linearGradient id="${idPrefix}-edge" x1="78" y1="96" x2="424" y2="416" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${palette.mint}"/>
      <stop offset="0.42" stop-color="${palette.cyan}"/>
      <stop offset="1" stop-color="${palette.teal}"/>
    </linearGradient>
    <linearGradient id="${idPrefix}-flow" x1="104" y1="338" x2="420" y2="278" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${palette.white}" stop-opacity="0.72"/>
      <stop offset="0.5" stop-color="${palette.mint}"/>
      <stop offset="1" stop-color="${palette.cyan}"/>
    </linearGradient>
  </defs>`;
}

function premiumMark({ idPrefix = "tl", tone = "light", bg = false } = {}) {
  const main = tone === "dark" ? palette.ink : palette.white;
  const soft = tone === "dark" ? palette.teal : palette.white;
  const bgNode = bg
    ? `<rect x="26" y="26" width="460" height="460" rx="138" fill="${palette.deep}"/>`
    : "";

  return `
  <g id="icon">
    ${bgNode}
    <path d="M256 58C360 58 454 140 454 253c0 112-86 201-198 201S58 365 58 253C58 142 147 58 256 58Z"
      fill="none" stroke="url(#${idPrefix}-edge)" stroke-width="30" stroke-linecap="round"
      stroke-dasharray="690 132" stroke-dashoffset="36"/>
    <path d="M156 168H356" stroke="${main}" stroke-width="42" stroke-linecap="square"/>
    <path d="M256 168V344H360" stroke="${main}" stroke-width="42" stroke-linecap="square" stroke-linejoin="miter"/>
    <path d="M132 330C180 292 235 284 296 309c48 20 90 14 132-24"
      fill="none" stroke="url(#${idPrefix}-flow)" stroke-width="24" stroke-linecap="round"/>
    <path d="M122 214C145 150 198 111 267 108" fill="none" stroke="${soft}" stroke-width="10" stroke-linecap="round" opacity="${tone === "dark" ? "0.2" : "0.22"}"/>
    <circle cx="395" cy="144" r="10" fill="${palette.mint}" opacity="0.92"/>
  </g>`;
}

function fullLogo({ tone = "light", idPrefix = "full" } = {}) {
  const text = tone === "dark" ? palette.ink : palette.white;
  const sub = tone === "dark" ? palette.steel : "rgba(255,255,255,0.78)";
  const shadow = tone === "dark" ? "" : `
    <filter id="${idPrefix}-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#001D25" flood-opacity="0.28"/>
    </filter>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 64" role="img" aria-labelledby="${idPrefix}-title ${idPrefix}-desc">
  <title id="${idPrefix}-title">坦隆环境 Tanlong Environment logo</title>
  <desc id="${idPrefix}-desc">A premium environmental engineering logo combining a water-loop mark, precise TL monogram, and bilingual Tanlong Environment wordmark.</desc>
  ${markDefs(idPrefix)}
  <defs>${shadow}</defs>
  <g fill="none"${tone === "dark" ? "" : ` filter="url(#${idPrefix}-shadow)"`}>
    <g transform="translate(0 1) scale(0.121)">
      ${premiumMark({ idPrefix, tone })}
    </g>
    <g id="wordmark" font-family="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Helvetica, Arial, sans-serif">
      <text x="82" y="29" fill="${text}" font-size="29" font-weight="760" letter-spacing="0">坦隆环境</text>
      <text x="84" y="50" fill="${sub}" font-size="12.3" font-weight="650" letter-spacing="2.05">TANLONG ENVIRONMENT</text>
    </g>
  </g>
</svg>`;
}

function markSvg({ tone = "dark", idPrefix = "mark", bg = false } = {}) {
  const background = bg ? `<rect width="512" height="512" rx="132" fill="${palette.deep}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="${idPrefix}-title ${idPrefix}-desc">
  <title id="${idPrefix}-title">坦隆环境图形标识</title>
  <desc id="${idPrefix}-desc">Water loop and TL engineering monogram for Tanlong Environment.</desc>
  ${markDefs(idPrefix)}
  ${background}
  ${premiumMark({ idPrefix, tone, bg: false })}
</svg>`;
}

function conceptSvg({ id, label, family, mark, wordmark, note }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">${label}</title>
  <desc id="${id}-desc">${note}</desc>
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1024" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#F6FBFA"/>
      <stop offset="1" stop-color="#E7F5F2"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="512" rx="38" fill="url(#${id}-bg)"/>
  <g transform="translate(92 92)">
    ${mark}
  </g>
  <g font-family="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Helvetica, Arial, sans-serif">
    ${wordmark}
    <text x="92" y="438" fill="${palette.steel}" font-size="20" font-weight="650" letter-spacing="2">${family}</text>
    <text x="92" y="468" fill="${palette.steel}" font-size="15" opacity="0.78">${note}</text>
  </g>
</svg>`;
}

function conceptOne() {
  return conceptSvg({
    id: "concept-1",
    label: "Concept 1 Water Gate",
    family: "WATER GATE / RECOMMENDED",
    note: "水脉环绕，工程门架式 TL，适合官网导航和正式物料。",
    mark: `<g transform="scale(0.62)">${markDefs("c1")}${premiumMark({ idPrefix: "c1", tone: "dark" })}</g>`,
    wordmark: `
      <text x="422" y="194" fill="${palette.ink}" font-size="58" font-weight="760" letter-spacing="0">坦隆环境</text>
      <text x="426" y="242" fill="${palette.steel}" font-size="22" font-weight="700" letter-spacing="4">TANLONG ENVIRONMENT</text>
      <path d="M426 282H746" stroke="${palette.teal}" stroke-width="4" stroke-linecap="round"/>
    `,
  });
}

function conceptTwo() {
  return conceptSvg({
    id: "concept-2",
    label: "Concept 2 Contour Rise",
    family: "CONTOUR RISE",
    note: "山水等高线与上升的工程基座，气质更东方、更留白。",
    mark: `
      <g transform="translate(24 28) scale(0.62)">
        <path d="M42 246C74 165 138 104 226 70C302 100 363 160 402 244" fill="none" stroke="${palette.teal}" stroke-width="28" stroke-linecap="round"/>
        <path d="M80 256C134 215 190 200 250 211C303 221 349 205 392 166" fill="none" stroke="${palette.cyan}" stroke-width="22" stroke-linecap="round"/>
        <path d="M98 312C158 274 220 266 282 288C330 305 374 300 420 268" fill="none" stroke="${palette.mint}" stroke-width="18" stroke-linecap="round"/>
        <path d="M194 122H310M252 122V330H344" stroke="${palette.ink}" stroke-width="40" stroke-linecap="square" stroke-linejoin="miter"/>
      </g>`,
    wordmark: `
      <text x="456" y="190" fill="${palette.ink}" font-size="56" font-weight="720">坦隆环境</text>
      <text x="460" y="238" fill="${palette.steel}" font-size="21" font-weight="680" letter-spacing="4.2">TANLONG ENVIRONMENT</text>
      <text x="460" y="302" fill="${palette.teal}" font-size="20" font-weight="650" letter-spacing="3">LOW-CARBON WATER SYSTEMS</text>
    `,
  });
}

function conceptThree() {
  return conceptSvg({
    id: "concept-3",
    label: "Concept 3 Engineering Axis",
    family: "ENGINEERING AXIS",
    note: "更工业、更上市公司式的轴线标识，强调可靠交付。",
    mark: `
      <g transform="translate(28 34) scale(0.62)">
        <rect x="62" y="56" width="316" height="316" rx="56" fill="${palette.deep}"/>
        <path d="M118 138H320M220 138V306H318" stroke="${palette.white}" stroke-width="44" stroke-linecap="square" stroke-linejoin="miter"/>
        <path d="M86 302C152 264 210 259 270 283C316 302 356 294 402 250" fill="none" stroke="${palette.mint}" stroke-width="24" stroke-linecap="round"/>
        <path d="M82 84H158M286 372H382" stroke="${palette.cyan}" stroke-width="12" stroke-linecap="round"/>
      </g>`,
    wordmark: `
      <text x="456" y="188" fill="${palette.ink}" font-size="57" font-weight="800">坦隆环境</text>
      <text x="460" y="238" fill="${palette.steel}" font-size="22" font-weight="680" letter-spacing="4.6">TANLONG ENVIRONMENT</text>
      <rect x="460" y="276" width="194" height="8" rx="4" fill="${palette.teal}"/>
      <rect x="670" y="276" width="72" height="8" rx="4" fill="${palette.mint}"/>
    `,
  });
}

function conceptFour() {
  return conceptSvg({
    id: "concept-4",
    label: "Concept 4 Institutional Seal",
    family: "INSTITUTIONAL SEAL",
    note: "更稳重的机构图章方向，适合证书、工程铭牌和集团物料。",
    mark: `
      <g transform="translate(36 22) scale(0.62)">
        <circle cx="220" cy="220" r="176" fill="none" stroke="${palette.teal}" stroke-width="24"/>
        <circle cx="220" cy="220" r="134" fill="none" stroke="${palette.mint}" stroke-width="8" opacity="0.85"/>
        <path d="M120 176H320M220 176V296H302" stroke="${palette.ink}" stroke-width="42" stroke-linecap="square" stroke-linejoin="miter"/>
        <path d="M104 282C154 248 204 241 258 260C300 275 340 270 380 238" fill="none" stroke="${palette.cyan}" stroke-width="18" stroke-linecap="round"/>
        <text x="220" y="104" text-anchor="middle" fill="${palette.steel}" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="4">TANLONG</text>
      </g>`,
    wordmark: `
      <text x="456" y="188" fill="${palette.ink}" font-size="55" font-weight="760">坦隆环境</text>
      <text x="460" y="237" fill="${palette.steel}" font-size="22" font-weight="700" letter-spacing="4">TANLONG ENVIRONMENT</text>
      <text x="460" y="302" fill="${palette.teal}" font-size="20" font-weight="650" letter-spacing="2">ENVIRONMENTAL ENGINEERING</text>
    `,
  });
}

function write(file, content) {
  fs.writeFileSync(file, content.trim() + "\n", "utf8");
}

const conceptFiles = [
  ["concept-1-water-gate.svg", conceptOne()],
  ["concept-2-contour-rise.svg", conceptTwo()],
  ["concept-3-engineering-axis.svg", conceptThree()],
  ["concept-4-institutional-seal.svg", conceptFour()],
];

for (const [name, svg] of conceptFiles) {
  write(path.join(dirs.concepts, name), svg);
}

write(path.join(dirs.final, "tanlong-logo-full.svg"), fullLogo({ tone: "light", idPrefix: "tanlong-full" }));
write(path.join(dirs.final, "tanlong-logo-full-dark.svg"), fullLogo({ tone: "dark", idPrefix: "tanlong-full-dark" }));
write(path.join(dirs.final, "tanlong-logo-mark.svg"), markSvg({ tone: "dark", idPrefix: "tanlong-mark" }));
write(path.join(dirs.final, "tanlong-logo-mark-on-dark.svg"), markSvg({ tone: "light", idPrefix: "tanlong-mark-dark", bg: true }));

const previewCards = conceptFiles
  .map(([name], index) => {
    const label = ["01 Water Gate", "02 Contour Rise", "03 Engineering Axis", "04 Institutional Seal"][index];
    return `<article class="card">
      <div class="card-media"><img src="concepts/${name}" alt="${label}"></div>
      <div class="card-copy">
        <strong>${label}</strong>
        <span>${index === 0 ? "推荐用于官网。轮廓最稳，导航栏识别度最高。" : "备选方向，用于比较气质和使用场景。"}</span>
      </div>
    </article>`;
  })
  .join("\n");

const previewHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>坦隆环境 Logo Preview</title>
  <style>
    :root {
      --ink: ${palette.ink};
      --deep: ${palette.deep};
      --teal: ${palette.teal};
      --fog: ${palette.fog};
      --line: rgba(16, 46, 53, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
      color: var(--ink);
      background: linear-gradient(180deg, #f7fbfa 0%, #e9f4f2 100%);
    }
    main {
      width: min(1480px, calc(100vw - 96px));
      margin: 0 auto;
      padding: 72px 0 84px;
    }
    header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 40px;
      align-items: end;
      margin-bottom: 42px;
    }
    h1 {
      margin: 0;
      font-size: 52px;
      line-height: 1.05;
      font-weight: 760;
      letter-spacing: 0;
    }
    .meta {
      color: #6a8187;
      font-size: 15px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      text-align: right;
    }
    .hero {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 28px;
      margin-bottom: 28px;
    }
    .panel {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255,255,255,0.72);
      box-shadow: 0 24px 80px rgba(11,47,56,0.10);
      overflow: hidden;
    }
    .hero .panel:first-child {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 360px;
      background: radial-gradient(circle at 18% 20%, rgba(139,231,194,0.22), transparent 34%), #092c35;
    }
    .hero .panel:first-child img { width: min(520px, 80%); }
    .hero .panel:last-child {
      padding: 46px;
      display: grid;
      align-content: center;
      gap: 26px;
    }
    .hero .panel:last-child img { width: 340px; max-width: 100%; }
    .principles {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 8px;
    }
    .principles span {
      border-top: 1px solid var(--line);
      padding-top: 14px;
      color: #526b70;
      line-height: 1.6;
      font-size: 15px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px;
    }
    .card-media {
      background: #fff;
      padding: 0;
    }
    .card-media img {
      width: 100%;
      display: block;
    }
    .card-copy {
      display: flex;
      justify-content: space-between;
      gap: 28px;
      padding: 18px 22px;
      border-top: 1px solid var(--line);
      color: #526b70;
      font-size: 15px;
    }
    .card-copy strong {
      color: var(--ink);
      font-size: 16px;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }
    .sizes {
      margin-top: 28px;
      padding: 28px;
      display: flex;
      gap: 32px;
      align-items: end;
      flex-wrap: wrap;
    }
    .sizes img { display: block; }
    .sizes .chip {
      display: grid;
      justify-items: center;
      gap: 8px;
      color: #6a8187;
      font-size: 12px;
      letter-spacing: 0.08em;
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>坦隆环境 Logo 方向</h1>
      <div class="meta">Logo refresh / 2026-07-03</div>
    </header>
    <section class="hero">
      <div class="panel"><img src="../final/tanlong-logo-full.svg" alt="坦隆环境推荐横版 logo"></div>
      <div class="panel">
        <img src="../final/tanlong-logo-full-dark.svg" alt="坦隆环境深色文字版 logo">
        <div class="principles">
          <span>减少装饰，保留水环境与工程交付的核心语义。</span>
          <span>标识在官网首屏、favicon 和工程物料上都能成立。</span>
          <span>颜色从亮蓝转为深水蓝、清透青绿和留白。</span>
        </div>
      </div>
    </section>
    <section class="grid">
      ${previewCards}
    </section>
    <section class="panel sizes">
      <div class="chip"><img src="../final/tanlong-logo-mark.svg" width="96" height="96" alt="96px mark"><span>96px</span></div>
      <div class="chip"><img src="../final/tanlong-logo-mark.svg" width="64" height="64" alt="64px mark"><span>64px</span></div>
      <div class="chip"><img src="../final/tanlong-logo-mark.svg" width="32" height="32" alt="32px mark"><span>32px</span></div>
      <div class="chip"><img src="../final/tanlong-logo-mark.svg" width="16" height="16" alt="16px mark"><span>16px</span></div>
    </section>
  </main>
</body>
</html>`;

write(path.join(dirs.logos, "preview.html"), previewHtml);
write(path.join(root, "review-board.html"), previewHtml.replace(/src="concepts\//g, 'src="logos/concepts/').replace(/src="\.\.\/final\//g, 'src="final/'));

const handoff = `# 坦隆环境 Logo Refresh

推荐方向：Concept 1 Water Gate。

设计要点：
- 图形用水脉环、工程门架和 TL 组合，避免常见叶子、地球、水滴模板感。
- 横版 logo 专门为当前官网透明导航设计，白色字标在大图首屏上更稳。
- 深色文字版用于白底物料，图形标识可作为 favicon、社媒头像、工程铭牌辅助标。

注意：
- 当前版本是可直接用于原型和视觉提案的 SVG/PNG 资产。
- 正式商用前仍需要商标近似检索、字体授权确认和最终矢量制版。
`;

write(path.join(root, "handoff.md"), handoff);

const manifest = {
  brand: "坦隆环境 / Tanlong Environment",
  date: "2026-07-03",
  installedSkill: {
    name: "logo-designer",
    source: "https://github.com/neonwatty/logo-designer-skill",
    installedPath: "/Users/RenChengyuan/.codex/skills/logo-designer",
  },
  selectedDirection: "concept-1-water-gate",
  palette,
  files: {
    preview: "logos/preview.html",
    reviewBoard: "review-board.html",
    concepts: conceptFiles.map(([name]) => `logos/concepts/${name}`),
    final: [
      "final/tanlong-logo-full.svg",
      "final/tanlong-logo-full-dark.svg",
      "final/tanlong-logo-mark.svg",
      "final/tanlong-logo-mark-on-dark.svg",
    ],
  },
};
write(path.join(root, "manifest.json"), JSON.stringify(manifest, null, 2));

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
