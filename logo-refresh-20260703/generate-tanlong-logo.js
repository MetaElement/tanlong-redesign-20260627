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

const palette = {
  deep: "#0B2F38",
  ink: "#102E35",
  teal: "#0FA7A1",
  cyan: "#22C5D6",
  mint: "#8BE7C2",
  white: "#FFFFFF",
  fog: "#EAF7F5",
  steel: "#6A8187",
};

function defs(id) {
  return `<defs>
    <linearGradient id="${id}-water" x1="108" y1="315" x2="438" y2="263" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${palette.mint}"/>
      <stop offset="0.52" stop-color="${palette.cyan}"/>
      <stop offset="1" stop-color="${palette.teal}"/>
    </linearGradient>
  </defs>`;
}

function dragonTL({ id = "dragon", tone = "dark", variant = "spine" } = {}) {
  const ink = tone === "light" ? palette.white : palette.ink;
  const pale = tone === "light" ? "rgba(255,255,255,0.32)" : "rgba(16,46,53,0.18)";
  const water = `url(#${id}-water)`;

  if (variant === "seal") {
    return `<g id="icon">
      <path d="M121 154C188 133 294 131 385 153" fill="none" stroke="${ink}" stroke-width="34" stroke-linecap="round"/>
      <path d="M252 151C232 215 205 277 166 349" fill="none" stroke="${ink}" stroke-width="34" stroke-linecap="round"/>
      <path d="M263 164C254 236 260 304 290 351C314 390 363 395 425 354" fill="none" stroke="${ink}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M142 367C214 407 328 404 430 331" fill="none" stroke="${ink}" stroke-width="30" stroke-linecap="round"/>
      <path d="M121 282C182 249 244 258 302 286C355 312 396 301 438 259" fill="none" stroke="${water}" stroke-width="18" stroke-linecap="round"/>
      <path d="M142 120C225 82 340 91 423 145" fill="none" stroke="${water}" stroke-width="11" stroke-linecap="round" opacity="0.76"/>
      <path d="M99 255C96 180 145 110 218 82" fill="none" stroke="${pale}" stroke-width="8" stroke-linecap="round"/>
      <path d="M391 147L425 127" stroke="${water}" stroke-width="10" stroke-linecap="round"/>
      <circle cx="381" cy="144" r="8" fill="${palette.mint}"/>
    </g>`;
  }

  if (variant === "river") {
    return `<g id="icon">
      <path d="M119 156C190 136 301 136 397 160" fill="none" stroke="${ink}" stroke-width="34" stroke-linecap="round"/>
      <path d="M251 154C232 222 207 286 171 356" fill="none" stroke="${ink}" stroke-width="32" stroke-linecap="round"/>
      <path d="M265 164C255 236 263 306 294 352C317 385 363 386 420 345" fill="none" stroke="${ink}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M137 365C220 407 332 398 435 329" fill="none" stroke="${water}" stroke-width="28" stroke-linecap="round"/>
      <path d="M121 282C185 249 245 258 304 286C354 310 394 300 433 266" fill="none" stroke="${ink}" stroke-width="13" stroke-linecap="round" opacity="0.48"/>
      <path d="M360 126C387 107 419 109 445 132" fill="none" stroke="${water}" stroke-width="10" stroke-linecap="round"/>
      <circle cx="391" cy="151" r="8" fill="${palette.mint}"/>
    </g>`;
  }

  return `<g id="icon">
    <path d="M118 155C188 134 300 133 394 159" fill="none" stroke="${ink}" stroke-width="35" stroke-linecap="round"/>
    <path d="M252 152C232 219 205 282 169 354" fill="none" stroke="${ink}" stroke-width="33" stroke-linecap="round"/>
    <path d="M265 163C255 236 262 306 293 351C316 385 363 388 422 347" fill="none" stroke="${ink}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M145 365C220 405 331 399 429 332" fill="none" stroke="${ink}" stroke-width="30" stroke-linecap="round"/>
    <path d="M122 282C184 250 244 258 304 287C354 311 397 301 437 262" fill="none" stroke="${water}" stroke-width="19" stroke-linecap="round"/>
    <path d="M358 126C385 107 418 109 443 132" fill="none" stroke="${water}" stroke-width="10" stroke-linecap="round"/>
    <path d="M126 235C154 209 188 195 227 193" fill="none" stroke="${pale}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="389" cy="151" r="8" fill="${palette.mint}"/>
  </g>`;
}

function markSvg({ tone = "dark", id = "mark", variant = "spine", background = false } = {}) {
  const bg = background ? `<rect width="512" height="512" rx="132" fill="${palette.deep}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">坦隆环境极简龙形 TL 标识</title>
  <desc id="${id}-desc">A minimalist Chinese calligraphic dragon mark that subtly integrates the letters T and L.</desc>
  ${defs(id)}
  ${bg}
  ${dragonTL({ id, tone, variant })}
</svg>`;
}

function fullLogo({ tone = "light", id = "full" } = {}) {
  const text = tone === "dark" ? palette.ink : palette.white;
  const sub = tone === "dark" ? palette.steel : "rgba(255,255,255,0.78)";
  const shadow = tone === "dark" ? "" : `<filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#001D25" flood-opacity="0.22"/>
    </filter>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 64" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">坦隆环境 Tanlong Environment logo</title>
  <desc id="${id}-desc">A premium Tanlong Environment logo with a minimalist Chinese dragon-shaped TL mark and bilingual wordmark.</desc>
  ${defs(id)}
  <defs>${shadow}</defs>
  <g fill="none"${tone === "dark" ? "" : ` filter="url(#${id}-shadow)"`}>
    <g transform="translate(-5 -1) scale(0.128)">
      ${dragonTL({ id, tone, variant: "spine" })}
    </g>
    <g id="wordmark" font-family="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Helvetica, Arial, sans-serif">
      <text x="88" y="29" fill="${text}" font-size="29" font-weight="760" letter-spacing="0">坦隆环境</text>
      <text x="90" y="50" fill="${sub}" font-size="12.3" font-weight="650" letter-spacing="2.05">TANLONG ENVIRONMENT</text>
    </g>
  </g>
</svg>`;
}

function conceptSvg({ id, label, family, variant, note, recommendation }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">${label}</title>
  <desc id="${id}-desc">${note}</desc>
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1024" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#F8FCFB"/>
      <stop offset="1" stop-color="#E8F5F2"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="512" rx="38" fill="url(#${id}-bg)"/>
  <g transform="translate(82 60) scale(0.74)">${defs(id)}${dragonTL({ id, tone: "dark", variant })}</g>
  <g font-family="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Helvetica, Arial, sans-serif">
    <text x="466" y="188" fill="${palette.ink}" font-size="58" font-weight="760">坦隆环境</text>
    <text x="470" y="237" fill="${palette.steel}" font-size="22" font-weight="700" letter-spacing="4.4">TANLONG ENVIRONMENT</text>
    <text x="470" y="304" fill="${palette.teal}" font-size="20" font-weight="650" letter-spacing="3">${family}</text>
    <path d="M470 334H704" stroke="${palette.teal}" stroke-width="4" stroke-linecap="round"/>
    <path d="M722 334H778" stroke="${palette.mint}" stroke-width="4" stroke-linecap="round"/>
    <text x="92" y="438" fill="${palette.steel}" font-size="20" font-weight="650" letter-spacing="2">${label.toUpperCase()}</text>
    <text x="92" y="468" fill="${palette.steel}" font-size="15" opacity="0.78">${note}</text>
  </g>
  <text x="812" y="438" fill="${recommendation ? palette.teal : palette.steel}" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="2">${recommendation ? "RECOMMENDED" : "OPTION"}</text>
</svg>`;
}

const concepts = [
  {
    file: "concept-1-dragon-spine.svg",
    label: "Dragon Spine",
    family: "MINIMAL DRAGON TL",
    variant: "spine",
    note: "龙首横势藏 T，龙身下摆藏 L，极简且适合官网导航。",
    recommendation: true,
  },
  {
    file: "concept-2-dragon-seal.svg",
    label: "Dragon Seal",
    family: "OPEN WATER DRAGON",
    variant: "seal",
    note: "更像现代水印，龙形更完整，适合集团物料和证书。",
    recommendation: false,
  },
  {
    file: "concept-3-river-dragon.svg",
    label: "River Dragon",
    family: "WATER TAIL TL",
    variant: "river",
    note: "水色尾部更强，环境友好感最好，但品牌厚重感略弱。",
    recommendation: false,
  },
];

function write(file, content) {
  fs.writeFileSync(file, content.trim() + "\n", "utf8");
}

for (const concept of concepts) {
  write(path.join(dirs.concepts, concept.file), conceptSvg({ id: concept.file.replace(/\.svg$/, ""), ...concept }));
}

write(path.join(dirs.final, "tanlong-logo-full.svg"), fullLogo({ tone: "light", id: "tanlong-full" }));
write(path.join(dirs.final, "tanlong-logo-full-dark.svg"), fullLogo({ tone: "dark", id: "tanlong-full-dark" }));
write(path.join(dirs.final, "tanlong-logo-mark.svg"), markSvg({ tone: "dark", id: "tanlong-mark", variant: "spine" }));
write(path.join(dirs.final, "tanlong-logo-mark-on-dark.svg"), markSvg({ tone: "light", id: "tanlong-mark-dark", variant: "spine", background: true }));

const cards = concepts.map((concept, index) => `<article class="card">
  <div class="card-media"><img src="concepts/${concept.file}" alt="${concept.label}"></div>
  <div class="card-copy">
    <strong>${String(index + 1).padStart(2, "0")} ${concept.label}</strong>
    <span>${concept.recommendation ? "推荐用于官网。最极简，龙形和 T/L 融合最自然。" : "备选方向，用于比较龙形完整度和品牌厚重感。"}</span>
  </div>
</article>`).join("\n");

const previewHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>坦隆环境极简龙形 TL Logo Preview</title>
  <style>
    :root { --ink: ${palette.ink}; --deep: ${palette.deep}; --teal: ${palette.teal}; --line: rgba(16,46,53,.14); }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif; color: var(--ink); background: linear-gradient(180deg,#f7fbfa 0%,#e9f4f2 100%); }
    main { width: min(1480px, calc(100vw - 96px)); margin: 0 auto; padding: 72px 0 84px; }
    header { display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: end; margin-bottom: 42px; }
    h1 { margin: 0; font-size: 52px; line-height: 1.05; font-weight: 760; letter-spacing: 0; }
    .meta { color: #6a8187; font-size: 15px; letter-spacing: .16em; text-transform: uppercase; text-align: right; }
    .hero { display: grid; grid-template-columns: 1.05fr .95fr; gap: 28px; margin-bottom: 28px; }
    .panel { border: 1px solid var(--line); border-radius: 8px; background: rgba(255,255,255,.72); box-shadow: 0 24px 80px rgba(11,47,56,.10); overflow: hidden; }
    .hero .panel:first-child { display: flex; align-items: center; justify-content: center; min-height: 360px; background: radial-gradient(circle at 18% 20%, rgba(139,231,194,.22), transparent 34%), #092c35; }
    .hero .panel:first-child img { width: min(560px, 82%); }
    .hero .panel:last-child { padding: 46px; display: grid; align-content: center; gap: 26px; }
    .hero .panel:last-child img { width: 360px; max-width: 100%; }
    .principles { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-top: 8px; }
    .principles span { border-top: 1px solid var(--line); padding-top: 14px; color: #526b70; line-height: 1.6; font-size: 15px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 28px; }
    .card-media { background: #fff; padding: 0; }
    .card-media img { width: 100%; display: block; }
    .card-copy { display: grid; gap: 8px; padding: 18px 22px; border-top: 1px solid var(--line); color: #526b70; font-size: 15px; line-height: 1.55; }
    .card-copy strong { color: var(--ink); font-size: 16px; letter-spacing: .04em; }
    .sizes { margin-top: 28px; padding: 28px; display: flex; gap: 32px; align-items: end; flex-wrap: wrap; }
    .sizes img { display: block; }
    .sizes .chip { display: grid; justify-items: center; gap: 8px; color: #6a8187; font-size: 12px; letter-spacing: .08em; }
    @media (max-width: 1000px) { main { width: min(100vw - 36px, 760px); } header, .hero, .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>坦隆环境极简龙形 TL Logo</h1>
      <div class="meta">Minimal Long TL / 2026-07-03</div>
    </header>
    <section class="hero">
      <div class="panel"><img src="../final/tanlong-logo-full.svg" alt="坦隆环境推荐横版 logo"></div>
      <div class="panel">
        <img src="../final/tanlong-logo-full-dark.svg" alt="坦隆环境深色文字版 logo">
        <div class="principles">
          <span>远看接近书法“龙”的骨架，近看能读出 T 与 L。</span>
          <span>减少笔画堆叠，只保留横画、中轴、龙身和水色收笔。</span>
          <span>不做具象龙纹，保持官网导航和工程物料的现代感。</span>
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

write(path.join(root, "handoff.md"), `# 坦隆环境极简龙形 TL Logo

推荐方向：Dragon Spine。

设计要点：
- 远看是一个极简东方龙形，近看能读出 T 与 L 的结构。
- 龙首横势暗含 T，龙身下摆和尾部转折暗含 L。
- 水色收笔连接环境、低碳和工程交付，避免叶子、地球、水滴等模板符号。
- 造型保持可复制、可缩放，适合官网导航、favicon、工程物料和品牌提案。

注意：
- 当前版本适合原型和视觉提案。
- 正式商用前仍需要商标近似检索、字体授权确认和最终矢量制版。
`);

write(path.join(root, "manifest.json"), JSON.stringify({
  brand: "坦隆环境 / Tanlong Environment",
  date: "2026-07-03",
  selectedDirection: "concept-1-dragon-spine",
  designIntent: "Minimal Chinese calligraphic dragon shape that subtly integrates T and L.",
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
