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

for (const dir of Object.values(dirs)) fs.mkdirSync(dir, { recursive: true });
for (const file of fs.readdirSync(dirs.concepts)) {
  if (file.endsWith(".svg")) fs.unlinkSync(path.join(dirs.concepts, file));
}

const palette = {
  deep: "#0B2F38",
  ink: "#102E35",
  inkSoft: "#183E46",
  teal: "#0FA7A1",
  cyan: "#23C4D8",
  mint: "#8BE7C2",
  white: "#FFFFFF",
  fog: "#EAF7F5",
  steel: "#6A8187",
};

function defs(id) {
  return `<defs>
    <linearGradient id="${id}-aqua" x1="92" y1="336" x2="438" y2="262" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${palette.mint}" stop-opacity="0.94"/>
      <stop offset="0.54" stop-color="${palette.cyan}"/>
      <stop offset="1" stop-color="${palette.teal}"/>
    </linearGradient>
    <linearGradient id="${id}-edge" x1="98" y1="126" x2="430" y2="430" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${palette.mint}"/>
      <stop offset="0.48" stop-color="${palette.cyan}"/>
      <stop offset="1" stop-color="${palette.teal}"/>
    </linearGradient>
  </defs>`;
}

function brushTL({ id = "tl", tone = "dark", variant = "ink-current", framed = false } = {}) {
  const ink = tone === "light" ? palette.white : palette.ink;
  const soft = tone === "light" ? "rgba(255,255,255,0.28)" : "rgba(16,46,53,0.18)";
  const frameOpacity = tone === "light" ? "0.92" : "1";
  const frame = framed
    ? `<path d="M258 58C360 58 452 140 452 254c0 113-87 200-198 200S58 366 58 254C58 142 148 58 258 58Z"
        fill="none" stroke="url(#${id}-edge)" stroke-width="24" stroke-linecap="round"
        stroke-dasharray="604 118" stroke-dashoffset="48" opacity="${frameOpacity}"/>`
    : "";

  if (variant === "seal-brush") {
    return `<g id="icon">
      ${frame}
      <path d="M128 151C178 132 272 126 371 139C398 142 414 154 410 171C406 189 381 194 340 188C282 180 225 183 165 194C132 200 107 192 101 177C96 165 105 158 128 151Z" fill="${ink}"/>
      <path d="M226 158C256 151 280 161 279 187C277 252 278 310 291 350C303 385 334 398 384 386C416 378 435 386 435 403C435 424 407 441 360 445C292 450 235 414 224 358C215 310 223 250 220 188C219 171 220 162 226 158Z" fill="${ink}"/>
      <path d="M231 347C279 369 334 367 400 345C427 336 444 345 441 363C438 384 410 399 365 405C310 413 263 400 230 374C216 363 217 353 231 347Z" fill="${ink}"/>
      <path d="M135 322C184 284 239 281 296 305C341 324 381 315 425 279" fill="none" stroke="url(#${id}-aqua)" stroke-width="26" stroke-linecap="round"/>
      <path d="M125 232C151 204 183 188 224 185" fill="none" stroke="${soft}" stroke-width="10" stroke-linecap="round"/>
    </g>`;
  }

  if (variant === "literati-line") {
    return `<g id="icon">
      <path d="M118 160C175 136 286 132 401 149" fill="none" stroke="${ink}" stroke-width="40" stroke-linecap="round"/>
      <path d="M246 153C250 211 246 282 260 344C268 382 304 398 378 382" fill="none" stroke="${ink}" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M112 336C172 292 234 287 299 312C348 331 391 316 434 276" fill="none" stroke="url(#${id}-aqua)" stroke-width="22" stroke-linecap="round"/>
      <path d="M155 414H392" stroke="${tone === "light" ? "rgba(255,255,255,0.36)" : "rgba(16,46,53,0.22)"}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="414" cy="154" r="9" fill="${palette.mint}"/>
    </g>`;
  }

  return `<g id="icon">
    ${frame}
    <path d="M112 150C160 133 270 128 374 140C401 143 419 154 416 170C413 188 388 194 348 188C282 178 220 181 157 194C123 201 96 192 92 176C89 164 98 155 112 150Z" fill="${ink}"/>
    <path d="M236 156C267 150 290 161 288 186C284 252 284 309 296 350C306 381 337 393 391 381C421 374 440 382 440 400C439 421 412 436 364 442C294 449 237 416 226 360C217 312 226 250 224 188C223 171 225 160 236 156Z" fill="${ink}"/>
    <path d="M232 347C281 370 337 368 404 345C431 336 448 345 444 363C441 384 412 399 366 406C311 414 263 400 229 374C216 363 218 352 232 347Z" fill="${ink}"/>
    <path d="M126 323C181 284 237 282 297 306C342 325 382 317 428 280" fill="none" stroke="url(#${id}-aqua)" stroke-width="26" stroke-linecap="round"/>
    <path d="M128 231C155 206 187 190 228 187" fill="none" stroke="${soft}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="419" cy="151" r="9" fill="${palette.mint}"/>
  </g>`;
}

function markSvg({ tone = "dark", id = "mark", variant = "ink-current", framed = false, background = false } = {}) {
  const bg = background ? `<rect width="512" height="512" rx="132" fill="${palette.deep}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">坦隆环境书法 TL 图形标识</title>
  <desc id="${id}-desc">A calligraphic TL monogram combining Chinese brush gesture, water current, and environmental engineering stability.</desc>
  ${defs(id)}
  ${bg}
  ${brushTL({ id, tone, variant, framed })}
</svg>`;
}

function fullLogo({ tone = "light", id = "full" } = {}) {
  const text = tone === "dark" ? palette.ink : palette.white;
  const sub = tone === "dark" ? palette.steel : "rgba(255,255,255,0.78)";
  const shadow = tone === "dark" ? "" : `<filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#001D25" flood-opacity="0.24"/>
    </filter>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 382 64" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">坦隆环境 Tanlong Environment logo</title>
  <desc id="${id}-desc">A premium Tanlong Environment logo with a Chinese calligraphic TL monogram and bilingual wordmark.</desc>
  ${defs(id)}
  <defs>${shadow}</defs>
  <g fill="none"${tone === "dark" ? "" : ` filter="url(#${id}-shadow)"`}>
    <g transform="translate(-2 1) scale(0.122)">
      ${brushTL({ id, tone, variant: "ink-current", framed: false })}
    </g>
    <g id="wordmark" font-family="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Helvetica, Arial, sans-serif">
      <text x="83" y="29" fill="${text}" font-size="29" font-weight="760" letter-spacing="0">坦隆环境</text>
      <text x="85" y="50" fill="${sub}" font-size="12.3" font-weight="650" letter-spacing="2.05">TANLONG ENVIRONMENT</text>
    </g>
  </g>
</svg>`;
}

function conceptSvg({ id, label, family, mark, note, recommendation }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">${label}</title>
  <desc id="${id}-desc">${note}</desc>
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1024" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#F7FBFA"/>
      <stop offset="1" stop-color="#E8F5F2"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="512" rx="38" fill="url(#${id}-bg)"/>
  <g transform="translate(94 72) scale(0.7)">${mark}</g>
  <g font-family="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, Helvetica, Arial, sans-serif">
    <text x="458" y="188" fill="${palette.ink}" font-size="58" font-weight="760" letter-spacing="0">坦隆环境</text>
    <text x="462" y="237" fill="${palette.steel}" font-size="22" font-weight="700" letter-spacing="4.4">TANLONG ENVIRONMENT</text>
    <text x="462" y="304" fill="${palette.teal}" font-size="20" font-weight="650" letter-spacing="3">${family}</text>
    <path d="M462 334H706" stroke="${palette.teal}" stroke-width="4" stroke-linecap="round"/>
    <path d="M724 334H778" stroke="${palette.mint}" stroke-width="4" stroke-linecap="round"/>
    <text x="92" y="438" fill="${palette.steel}" font-size="20" font-weight="650" letter-spacing="2">${label.toUpperCase()}</text>
    <text x="92" y="468" fill="${palette.steel}" font-size="15" opacity="0.78">${note}</text>
  </g>
  <text x="812" y="438" fill="${recommendation ? palette.teal : palette.steel}" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="2">${recommendation ? "RECOMMENDED" : "OPTION"}</text>
</svg>`;
}

const concepts = [
  {
    file: "concept-1-ink-current.svg",
    label: "Ink Current",
    family: "CALLIGRAPHIC TL MONOGRAM",
    note: "T 与 L 合为一笔，水流收笔，官网导航识别最稳。",
    recommendation: true,
    mark: `${defs("c1")}${brushTL({ id: "c1", tone: "dark", variant: "ink-current" })}`,
  },
  {
    file: "concept-2-seal-brush.svg",
    label: "Seal Brush",
    family: "MODERN WATER SEAL",
    note: "书法 TL 置于开放水印中，更机构化，适合证书和工程铭牌。",
    recommendation: false,
    mark: `${defs("c2")}${brushTL({ id: "c2", tone: "dark", variant: "seal-brush", framed: true })}`,
  },
  {
    file: "concept-3-literati-line.svg",
    label: "Literati Line",
    family: "HORIZON BRUSH MARK",
    note: "更通透、更留白，适合品牌传播，但小尺寸需要更强轮廓。",
    recommendation: false,
    mark: `${defs("c3")}${brushTL({ id: "c3", tone: "dark", variant: "literati-line" })}`,
  },
];

function write(file, content) {
  fs.writeFileSync(file, content.trim() + "\n", "utf8");
}

for (const concept of concepts) {
  write(path.join(dirs.concepts, concept.file), conceptSvg(concept));
}

write(path.join(dirs.final, "tanlong-logo-full.svg"), fullLogo({ tone: "light", id: "tanlong-full" }));
write(path.join(dirs.final, "tanlong-logo-full-dark.svg"), fullLogo({ tone: "dark", id: "tanlong-full-dark" }));
write(path.join(dirs.final, "tanlong-logo-mark.svg"), markSvg({ tone: "dark", id: "tanlong-mark", variant: "ink-current" }));
write(path.join(dirs.final, "tanlong-logo-mark-on-dark.svg"), markSvg({ tone: "light", id: "tanlong-mark-dark", variant: "ink-current", background: true }));

const cards = concepts.map((concept, index) => `<article class="card">
  <div class="card-media"><img src="concepts/${concept.file}" alt="${concept.label}"></div>
  <div class="card-copy">
    <strong>${String(index + 1).padStart(2, "0")} ${concept.label}</strong>
    <span>${concept.recommendation ? "推荐用于官网。笔势强、轮廓稳、中文和英文锁定关系最好。" : "备选方向，用于比较书法感和品牌气质。"}</span>
  </div>
</article>`).join("\n");

const previewHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>坦隆环境书法 TL Logo Preview</title>
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
    .hero .panel:first-child img { width: min(540px, 82%); }
    .hero .panel:last-child { padding: 46px; display: grid; align-content: center; gap: 26px; }
    .hero .panel:last-child img { width: 352px; max-width: 100%; }
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
      <h1>坦隆环境书法 TL Logo</h1>
      <div class="meta">Calligraphic TL / 2026-07-03</div>
    </header>
    <section class="hero">
      <div class="panel"><img src="../final/tanlong-logo-full.svg" alt="坦隆环境推荐横版 logo"></div>
      <div class="panel">
        <img src="../final/tanlong-logo-full-dark.svg" alt="坦隆环境深色文字版 logo">
        <div class="principles">
          <span>T 与 L 以中式书法的起笔、转折、收笔合成一个标。</span>
          <span>不做毛笔纹理，保留企业官网需要的清爽和可复制性。</span>
          <span>水流作为 L 的收笔，连接环境、低碳和工程交付。</span>
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

write(path.join(dirs.logos, "preview.html"), previewHtml);
write(path.join(root, "review-board.html"), previewHtml.replace(/src="concepts\//g, 'src="logos/concepts/').replace(/src="\.\.\/final\//g, 'src="final/'));

write(path.join(root, "handoff.md"), `# 坦隆环境书法 TL Logo

推荐方向：Ink Current。

设计要点：
- T 与 L 做成一个书法化合体字母标，使用起笔、顿挫、转折和收笔表达中式气质。
- 水流作为 L 的收笔，避免叶子、地球、水滴等模板化环保符号。
- 造型保持可复制、可缩放，适合官网导航、favicon、工程物料和品牌提案。

注意：
- 当前版本适合原型和视觉提案。
- 正式商用前仍需要商标近似检索、字体授权确认和最终矢量制版。
`);

write(path.join(root, "manifest.json"), JSON.stringify({
  brand: "坦隆环境 / Tanlong Environment",
  date: "2026-07-03",
  selectedDirection: "concept-1-ink-current",
  designIntent: "Chinese calligraphy inspired T/L monogram with environmental water-flow finishing stroke.",
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
