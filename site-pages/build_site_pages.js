const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const runDir = path.resolve(__dirname, "..");
const outDir = path.resolve(__dirname);
const htmlDir = path.join(outDir, "html");
const finalDir = path.join(outDir, "final");
const assetDir = path.join(outDir, "assets");

for (const dir of [outDir, htmlDir, finalDir, assetDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const sourceAssets = {
  "tanlong-logo-full.svg": path.join(runDir, "assets/tanlong-logo-full.svg"),
  "aqua-clear-bg.png": path.join(runDir, "variants/backgrounds/aqua-clear-bg.png"),
  "morning-green-bg.png": path.join(runDir, "variants/backgrounds/morning-green-bg.png"),
  "silver-air-bg.png": path.join(runDir, "variants/backgrounds/silver-air-bg.png"),
  "tanlong-hero-mill.png": path.join(runDir, "generated/tanlong-hero-mill.png"),
  "case-hero.png": path.resolve(runDir, "../../../..", "tanlong-environment-website/assets/site/cases/case-hero.png"),
  "sol-01-slag.png": path.resolve(runDir, "../../../..", "tanlong-environment-website/assets/site/cases/sol-01-slag.png"),
  "sol-02-heat.png": path.resolve(runDir, "../../../..", "tanlong-environment-website/assets/site/cases/sol-02-heat.png"),
  "sol-03-data.png": path.resolve(runDir, "../../../..", "tanlong-environment-website/assets/site/cases/sol-03-data.png"),
  "hero-02-slag.png": path.resolve(runDir, "../../../..", "tanlong-environment-website/assets/site/hero/hero-02-slag.png"),
  "hero-03-heat.png": path.resolve(runDir, "../../../..", "tanlong-environment-website/assets/site/hero/hero-03-heat.png"),
  "high-tech-certificate.jpeg": path.resolve(runDir, "../../../..", "tanlong-environment-website/assets/site/high-tech-certificate.jpeg"),
};

for (const [name, source] of Object.entries(sourceAssets)) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing source asset: ${source}`);
  }
  fs.copyFileSync(source, path.join(assetDir, name));
}

const nav = ["网站首页", "产品方案", "核心技术", "案例中心", "关于我们", "资源中心", "联系我们"];

function header(active) {
  return `
    <header>
      <div class="brand-lockup" aria-label="坦隆环境 Tanlong Environment">
        <img class="brand-logo" src="../assets/tanlong-logo-full.svg" alt="坦隆环境 Tanlong Environment" />
        <div class="brand-slogan">
          <strong>工业绿色低碳的数智赋能者</strong>
          <span>LOW-CARBON INDUSTRIAL SYSTEMS</span>
        </div>
      </div>
      <nav aria-label="Main navigation">
        ${nav.map((item) => `<span class="${item === active ? "active" : ""}">${item}</span>`).join("")}
      </nav>
      <div class="stock">信用资质<strong>AAA</strong></div>
      <div class="search" aria-hidden="true"></div>
    </header>
  `;
}

function dots(activeIndex) {
  const labels = ["首", "方", "技", "案", "关", "资", "询"];
  return `
    <div class="side-rail" aria-hidden="true">
      ${labels.map((label, index) => `<span class="rail-dot ${index === activeIndex ? "active" : ""}">${label}</span>`).join("")}
    </div>
  `;
}

const baseCss = `
  :root {
    --white: #ffffff;
    --ink: #061923;
    --blue: #068fcf;
    --cyan: #38d7f7;
    --green: #42d596;
    --mint: #b6f2df;
    --amber: #ffc76a;
    --line: rgba(255, 255, 255, 0.28);
    --soft: rgba(255, 255, 255, 0.74);
    --muted: rgba(255, 255, 255, 0.58);
  }

  * { box-sizing: border-box; }

  html,
  body {
    margin: 0;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #061923;
    font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", Arial, sans-serif;
  }

  body {
    color: var(--white);
  }

  .page {
    position: relative;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    isolation: isolate;
  }

  .bg,
  .image-fill {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .bg { z-index: -5; }

  .shade {
    position: absolute;
    inset: 0;
    z-index: -4;
    background:
      radial-gradient(circle at 78% 18%, rgba(70, 220, 180, 0.22), transparent 27%),
      linear-gradient(90deg, rgba(4, 26, 35, 0.95) 0%, rgba(8, 45, 55, 0.84) 34%, rgba(10, 80, 76, 0.36) 62%, rgba(8, 31, 40, 0.34) 100%),
      linear-gradient(180deg, rgba(8, 25, 33, 0.16), rgba(4, 18, 24, 0.7));
  }

  .grid {
    position: absolute;
    inset: 0;
    z-index: -3;
    opacity: 0.34;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
    background-size: 96px 96px;
    mask-image: linear-gradient(90deg, #000 0%, #000 50%, transparent 82%);
  }

  .scanline {
    position: absolute;
    left: 104px;
    right: 104px;
    bottom: 88px;
    height: 1px;
    z-index: -1;
    background: linear-gradient(90deg, transparent, rgba(87, 235, 219, 0.92), transparent);
    box-shadow: 0 0 32px rgba(87, 235, 219, 0.32);
  }

  header {
    position: absolute;
    left: 104px;
    right: 104px;
    top: 38px;
    height: 76px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.24);
    z-index: 8;
  }

  .brand-lockup {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 0 0 auto;
  }

  .brand-logo {
    display: block;
    width: 330px;
    height: 56px;
    object-fit: contain;
    filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.22));
  }

  .brand-slogan {
    min-width: 218px;
    padding-left: 24px;
    border-left: 1px solid rgba(255, 255, 255, 0.48);
  }

  .brand-slogan strong,
  .brand-slogan span {
    display: block;
    white-space: nowrap;
  }

  .brand-slogan strong {
    color: rgba(255, 255, 255, 0.95);
    font-size: 15px;
    line-height: 1;
    font-weight: 560;
  }

  .brand-slogan span {
    margin-top: 9px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 10px;
    line-height: 1;
    letter-spacing: 1.2px;
  }

  nav {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 46px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.82);
    white-space: nowrap;
  }

  nav span {
    position: relative;
  }

  nav span.active {
    color: #fff;
  }

  nav span.active::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -30px;
    height: 3px;
    background: #fff;
  }

  .stock {
    margin-left: 42px;
    padding-left: 34px;
    min-width: 116px;
    border-left: 1px solid rgba(255, 255, 255, 0.54);
    font-size: 14px;
    line-height: 1.25;
    color: rgba(255, 255, 255, 0.76);
  }

  .stock strong {
    display: block;
    margin-top: 6px;
    color: #fff;
    font-size: 22px;
    letter-spacing: 1px;
  }

  .search {
    margin-left: 28px;
    width: 46px;
    height: 46px;
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 50%;
    position: relative;
  }

  .search::before {
    content: "";
    position: absolute;
    left: 15px;
    top: 13px;
    width: 12px;
    height: 12px;
    border: 2px solid #fff;
    border-radius: 50%;
  }

  .search::after {
    content: "";
    position: absolute;
    left: 27px;
    top: 27px;
    width: 10px;
    height: 2px;
    background: #fff;
    transform: rotate(45deg);
    transform-origin: left center;
  }

  .side-rail {
    position: absolute;
    left: 34px;
    top: 398px;
    display: grid;
    gap: 16px;
    z-index: 5;
  }

  .rail-dot {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: rgba(255, 255, 255, 0.86);
    font-size: 13px;
    border: 1px solid rgba(255, 255, 255, 0.54);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(14px);
  }

  .rail-dot.active {
    border-color: transparent;
    background: linear-gradient(135deg, #16bfdf, #35d18d);
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 26px;
    color: rgba(255, 255, 255, 0.76);
    font-size: 15px;
    text-transform: uppercase;
  }

  .eyebrow::before {
    content: "";
    width: 54px;
    height: 2px;
    background: linear-gradient(90deg, var(--cyan), var(--green));
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  .page-title {
    font-size: 66px;
    line-height: 1.08;
    font-weight: 650;
    letter-spacing: 0;
    text-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
  }

  .lede {
    margin-top: 28px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 20px;
    line-height: 1.78;
    font-weight: 350;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-top: 38px;
  }

  .button {
    height: 54px;
    display: inline-flex;
    align-items: center;
    padding: 0 28px;
    border: 1px solid rgba(255, 255, 255, 0.48);
    color: #fff;
    font-size: 16px;
    text-decoration: none;
  }

  .button.primary {
    border-color: transparent;
    background: linear-gradient(110deg, #00a8e8, #31cf92);
    box-shadow: 0 18px 46px rgba(0, 168, 232, 0.24);
  }

  .button.secondary {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(18px);
  }

  .glass {
    border: 1px solid rgba(255, 255, 255, 0.28);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.055));
    backdrop-filter: blur(22px);
    box-shadow: 0 30px 80px rgba(0, 24, 36, 0.24);
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
    backdrop-filter: blur(18px);
  }

  .metric {
    min-height: 122px;
    padding: 22px 28px;
    border-right: 1px solid rgba(255, 255, 255, 0.14);
  }

  .metric:last-child { border-right: 0; }

  .metric strong {
    display: block;
    color: #fff;
    font-size: 42px;
    line-height: 1;
    font-weight: 650;
  }

  .metric span {
    display: block;
    margin-top: 13px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 15px;
  }

  .section-label {
    color: rgba(255, 255, 255, 0.66);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1.8px;
  }

  .caption {
    color: rgba(255, 255, 255, 0.68);
    font-size: 15px;
    line-height: 1.65;
  }

  .small-caps {
    color: var(--cyan);
    font-size: 12px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  .page-no {
    position: absolute;
    right: 104px;
    bottom: 40px;
    color: rgba(255, 255, 255, 0.54);
    font-size: 13px;
    letter-spacing: 2px;
  }
`;

const pageSpecificCss = `
  .home-copy {
    position: absolute;
    left: 104px;
    top: 214px;
    width: 810px;
  }

  .home-copy .page-title {
    font-size: 78px;
    max-width: 780px;
  }

  .home-metrics {
    position: absolute;
    left: 104px;
    bottom: 96px;
    width: 870px;
  }

  .capability {
    position: absolute;
    right: 104px;
    bottom: 94px;
    width: 680px;
    padding: 30px;
  }

  .capability-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    color: rgba(255, 255, 255, 0.76);
    font-size: 14px;
  }

  .capability-head strong {
    color: #fff;
    font-size: 19px;
    font-weight: 600;
  }

  .services {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .service-card {
    min-height: 92px;
    padding: 18px 18px 16px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(1, 22, 32, 0.24);
  }

  .service-card strong {
    display: block;
    margin-top: 11px;
    color: #fff;
    font-size: 18px;
    font-weight: 520;
  }

  .about-copy {
    position: absolute;
    left: 104px;
    top: 184px;
    width: 720px;
  }

  .about-visual {
    position: absolute;
    right: 104px;
    top: 184px;
    width: 860px;
    height: 568px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.32);
  }

  .about-visual::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(4, 24, 32, 0.26), rgba(4, 24, 32, 0.02)), linear-gradient(0deg, rgba(4, 24, 32, 0.42), transparent 48%);
  }

  .beliefs {
    position: absolute;
    left: 104px;
    bottom: 98px;
    width: 1712px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .belief {
    min-height: 148px;
    padding: 26px 28px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(7, 35, 46, 0.42);
    backdrop-filter: blur(18px);
  }

  .belief strong {
    display: block;
    margin-top: 14px;
    font-size: 24px;
    font-weight: 560;
  }

  .belief p {
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.68);
    font-size: 15px;
    line-height: 1.62;
  }

  .proof-stack {
    position: absolute;
    right: 156px;
    top: 664px;
    width: 650px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .solution-copy {
    position: absolute;
    left: 104px;
    top: 180px;
    width: 760px;
  }

  .solution-tiles {
    position: absolute;
    left: 104px;
    right: 104px;
    bottom: 286px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }

  .solution-tile {
    position: relative;
    height: 300px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.26);
    background: #0c2d36;
  }

  .solution-tile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.04) contrast(0.96);
  }

  .solution-tile::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 26%, rgba(4, 20, 27, 0.84));
  }

  .solution-info {
    position: absolute;
    left: 26px;
    right: 26px;
    bottom: 24px;
    z-index: 1;
  }

  .solution-info strong {
    display: block;
    margin-top: 10px;
    font-size: 25px;
    font-weight: 590;
  }

  .solution-info p {
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 15px;
    line-height: 1.55;
  }

  .process-strip {
    position: absolute;
    left: 104px;
    right: 104px;
    bottom: 98px;
    min-height: 150px;
    padding: 28px 32px;
    display: grid;
    grid-template-columns: 1.1fr 4fr;
    gap: 34px;
  }

  .process-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .process-step {
    min-height: 92px;
    padding: 18px 18px;
    border-left: 1px solid rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.045);
  }

  .process-step strong {
    display: block;
    margin-top: 12px;
    font-size: 19px;
    font-weight: 560;
  }

  .tech-copy {
    position: absolute;
    left: 104px;
    top: 178px;
    width: 740px;
  }

  .tech-machine {
    position: absolute;
    right: 104px;
    top: 178px;
    width: 858px;
    height: 508px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.28);
  }

  .tech-machine::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(4, 22, 31, 0.18), transparent),
      linear-gradient(0deg, rgba(4, 22, 31, 0.5), transparent 58%);
  }

  .tech-flow {
    position: absolute;
    left: 104px;
    bottom: 102px;
    width: 1060px;
    height: 262px;
    padding: 28px;
  }

  .flow-line {
    position: absolute;
    left: 74px;
    right: 74px;
    top: 138px;
    height: 2px;
    background: linear-gradient(90deg, rgba(55, 216, 247, 0.18), rgba(55, 216, 247, 0.94), rgba(66, 213, 150, 0.94), rgba(255, 199, 106, 0.16));
    box-shadow: 0 0 26px rgba(55, 216, 247, 0.32);
  }

  .flow-items {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-top: 52px;
  }

  .flow-item {
    text-align: center;
  }

  .flow-dot {
    width: 58px;
    height: 58px;
    margin: 0 auto 18px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.46);
    background: rgba(4, 32, 42, 0.76);
    color: #fff;
    font-size: 15px;
    box-shadow: 0 0 28px rgba(55, 216, 247, 0.18);
  }

  .flow-item strong {
    display: block;
    font-size: 18px;
    font-weight: 560;
  }

  .flow-item span {
    display: block;
    margin-top: 9px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 13px;
    line-height: 1.45;
  }

  .patent-panel {
    position: absolute;
    right: 104px;
    bottom: 102px;
    width: 620px;
    height: 262px;
    padding: 28px;
  }

  .patent-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-top: 24px;
  }

  .patent {
    padding: 20px 18px;
    min-height: 120px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.045);
  }

  .patent strong {
    display: block;
    font-size: 32px;
    line-height: 1;
  }

  .patent span {
    display: block;
    margin-top: 13px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
    line-height: 1.45;
  }

  .cases-copy {
    position: absolute;
    left: 104px;
    top: 184px;
    width: 740px;
  }

  .case-list {
    position: absolute;
    left: 104px;
    bottom: 104px;
    width: 760px;
    display: grid;
    gap: 16px;
  }

  .case-card {
    min-height: 124px;
    display: grid;
    grid-template-columns: 92px 1fr 130px;
    align-items: center;
    gap: 22px;
    padding: 22px 26px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(6, 32, 43, 0.52);
    backdrop-filter: blur(18px);
  }

  .case-no {
    width: 64px;
    height: 64px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #fff;
    background: linear-gradient(135deg, #17b7dc, #42d596);
    font-size: 18px;
    font-weight: 620;
  }

  .case-card strong {
    display: block;
    font-size: 22px;
    font-weight: 560;
  }

  .case-card p {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.66);
    font-size: 15px;
    line-height: 1.5;
  }

  .case-card em {
    font-style: normal;
    color: var(--mint);
    font-size: 14px;
    line-height: 1.45;
  }

  .service-map {
    position: absolute;
    right: 104px;
    top: 196px;
    width: 800px;
    height: 680px;
    padding: 34px;
  }

  .map-canvas {
    position: relative;
    height: 500px;
    margin-top: 26px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background:
      linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px),
      linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px),
      radial-gradient(circle at 72% 34%, rgba(56, 215, 247, 0.18), transparent 28%),
      radial-gradient(circle at 36% 62%, rgba(66, 213, 150, 0.18), transparent 32%);
    background-size: 92px 92px, 92px 92px, auto, auto;
  }

  .map-line {
    position: absolute;
    left: 110px;
    right: 120px;
    top: 238px;
    height: 2px;
    background: linear-gradient(90deg, rgba(55,216,247,.2), rgba(55,216,247,.9), rgba(66,213,150,.9));
    transform: rotate(-12deg);
    box-shadow: 0 0 24px rgba(55,216,247,.34);
  }

  .site-dot {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 0 8px rgba(55, 216, 247, 0.18), 0 0 28px rgba(55, 216, 247, 0.58);
  }

  .site-label {
    position: absolute;
    padding: 8px 12px;
    border: 1px solid rgba(255, 255, 255, 0.24);
    background: rgba(4, 25, 34, 0.58);
    color: rgba(255, 255, 255, 0.78);
    font-size: 14px;
  }

  .resources-copy {
    position: absolute;
    left: 104px;
    top: 184px;
    width: 720px;
  }

  .resource-grid {
    position: absolute;
    left: 104px;
    bottom: 100px;
    width: 900px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .resource-card {
    min-height: 154px;
    padding: 26px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(7, 35, 46, 0.42);
    backdrop-filter: blur(18px);
  }

  .resource-card strong {
    display: block;
    margin-top: 14px;
    font-size: 22px;
    font-weight: 560;
  }

  .resource-card p {
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.66);
    font-size: 14px;
    line-height: 1.56;
  }

  .contact-panel {
    position: absolute;
    right: 104px;
    top: 196px;
    width: 720px;
    height: 678px;
    padding: 34px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 28px;
  }

  .field {
    min-height: 76px;
    padding: 16px 18px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.06);
  }

  .field.wide {
    grid-column: 1 / -1;
    min-height: 146px;
  }

  .field span {
    display: block;
    color: rgba(255, 255, 255, 0.52);
    font-size: 13px;
  }

  .field strong {
    display: block;
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.88);
    font-size: 17px;
    font-weight: 430;
  }

  .cycle {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    margin-top: 28px;
  }

  .cycle span {
    min-height: 56px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: rgba(255, 255, 255, 0.76);
    font-size: 13px;
    background: rgba(255, 255, 255, 0.045);
  }

  .detail-copy {
    position: absolute;
    left: 104px;
    top: 178px;
    width: 710px;
  }

  .detail-hero {
    position: absolute;
    right: 104px;
    top: 178px;
    width: 860px;
    height: 510px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .detail-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(4, 23, 31, 0.46), transparent 50%), linear-gradient(90deg, rgba(4, 23, 31, 0.18), transparent);
  }

  .detail-kpis {
    position: absolute;
    left: 104px;
    bottom: 102px;
    width: 760px;
  }

  .detail-board {
    position: absolute;
    right: 104px;
    bottom: 102px;
    width: 860px;
    height: 282px;
    padding: 30px;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 24px;
  }

  .detail-card {
    min-height: 142px;
    padding: 22px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.045);
  }

  .detail-card strong {
    display: block;
    margin-top: 12px;
    font-size: 21px;
    line-height: 1.25;
    font-weight: 560;
  }

  .detail-card p {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
    line-height: 1.5;
  }

  .route-map {
    position: absolute;
    left: 104px;
    right: 104px;
    bottom: 106px;
    height: 300px;
    padding: 30px 34px;
  }

  .route-steps {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 14px;
    margin-top: 26px;
  }

  .route-step {
    min-height: 170px;
    padding: 22px 18px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.045);
  }

  .route-step strong {
    display: block;
    margin-top: 15px;
    font-size: 20px;
    font-weight: 560;
  }

  .route-step p {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 13px;
    line-height: 1.48;
  }

  .data-dashboard {
    position: absolute;
    right: 104px;
    top: 178px;
    width: 840px;
    height: 606px;
    padding: 30px;
  }

  .dash-top {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 14px;
    margin-top: 24px;
  }

  .dash-widget {
    min-height: 132px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
  }

  .dash-widget strong {
    display: block;
    font-size: 34px;
    line-height: 1;
  }

  .dash-widget span {
    display: block;
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 14px;
  }

  .chart-slab {
    height: 260px;
    margin-top: 18px;
    padding: 22px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background:
      linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px),
      rgba(255,255,255,.04);
    background-size: 68px 52px;
  }

  .chart-line {
    position: relative;
    height: 160px;
    margin-top: 34px;
  }

  .chart-line::before {
    content: "";
    position: absolute;
    left: 20px;
    right: 20px;
    top: 82px;
    height: 3px;
    background: linear-gradient(90deg, #35d18d, #38d7f7, #ffc76a);
    transform: rotate(-7deg);
    box-shadow: 0 0 22px rgba(56, 215, 247, 0.38);
  }

  .case-detail-hero {
    position: absolute;
    left: 104px;
    top: 178px;
    width: 1712px;
    height: 360px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.28);
  }

  .case-detail-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(4, 25, 33, 0.86), rgba(4, 25, 33, 0.38), rgba(4, 25, 33, 0.18));
  }

  .case-detail-copy {
    position: absolute;
    left: 152px;
    top: 232px;
    width: 690px;
    z-index: 2;
  }

  .case-detail-grid {
    position: absolute;
    left: 104px;
    right: 104px;
    bottom: 104px;
    display: grid;
    grid-template-columns: 1.05fr 1.25fr 1fr;
    gap: 20px;
  }

  .case-detail-card {
    min-height: 332px;
    padding: 30px;
  }

  .case-detail-card h2 {
    margin-top: 14px;
    font-size: 30px;
    line-height: 1.2;
  }

  .case-detail-card p,
  .case-detail-card li {
    color: rgba(255, 255, 255, 0.68);
    font-size: 15px;
    line-height: 1.65;
  }

  .case-detail-card ul {
    margin: 22px 0 0;
    padding-left: 18px;
  }

  .article-page {
    position: absolute;
    left: 104px;
    right: 104px;
    top: 176px;
    bottom: 104px;
    display: grid;
    grid-template-columns: 680px 1fr;
    gap: 28px;
  }

  .article-aside,
  .article-body {
    padding: 34px;
  }

  .article-body h1 {
    font-size: 48px;
    line-height: 1.14;
    font-weight: 640;
  }

  .article-section {
    margin-top: 26px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.18);
  }

  .article-section strong {
    display: block;
    font-size: 22px;
    font-weight: 560;
  }

  .article-section p {
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.66);
    font-size: 15px;
    line-height: 1.65;
  }

  .service-detail-copy {
    position: absolute;
    left: 104px;
    top: 180px;
    width: 720px;
  }

  .service-detail-panel {
    position: absolute;
    right: 104px;
    top: 190px;
    width: 720px;
    height: 600px;
    padding: 34px;
  }

  .handoff-stack {
    display: grid;
    gap: 14px;
    margin-top: 28px;
  }

  .handoff-item {
    display: grid;
    grid-template-columns: 70px 1fr;
    gap: 18px;
    align-items: center;
    min-height: 82px;
    padding: 16px 18px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.045);
  }

  .handoff-item b {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #17b7dc, #42d596);
  }

  .handoff-item strong {
    display: block;
    font-size: 19px;
    font-weight: 560;
  }

  .handoff-item span {
    display: block;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 13px;
  }
`;

function shell({ title, active, bg, body, extraClass = "", rail = 0, shade = "", pageNo = "" }) {
  const cleanBody = body.replace(/\s*<div class="page-no">[\s\S]*?<\/div>\s*/g, "\n");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>${baseCss}${pageSpecificCss}</style>
</head>
<body>
  <section class="page ${extraClass}" aria-label="${title}">
    <img class="bg" src="../assets/${bg}" alt="" />
    <div class="shade" style="${shade}" aria-hidden="true"></div>
    <div class="grid" aria-hidden="true"></div>
    <div class="scanline" aria-hidden="true"></div>
    ${header(active)}
    ${dots(rail)}
    ${cleanBody}
    <div class="page-no">${pageNo}</div>
  </section>
</body>
</html>`;
}

const pages = [
  {
    id: "00-home",
    title: "坦隆环境官网整套页面 - 首页",
    active: "网站首页",
    bg: "aqua-clear-bg.png",
    filename: "tanlong-00-home-1920x1080.png",
    label: "首页 / Home",
    caption: "首屏承接 Poten 式沉浸感，但信息改为坦隆的钢渣处理、余热回收、专利与项目证明。",
    rail: 0,
    body: `
      <main class="home-copy fit-check">
        <div class="eyebrow">TANLONG LOW-CARBON INDUSTRIAL SYSTEMS</div>
        <h1 class="page-title">工业绿色低碳的<br />数智赋能者</h1>
        <p class="lede">专注钢渣处理与余热回收，以全球首创的钢渣全流程干法余热回收利用技术，推动钢铁工业废渣与废热转化为绿色循环资源。</p>
        <div class="actions">
          <a class="button primary" href="#">预约技术交流</a>
          <a class="button secondary" href="#">查看核心工艺</a>
        </div>
      </main>
      <aside class="metric-grid home-metrics" aria-label="Core proof points">
        <div class="metric"><strong>18</strong><span>大型钢厂落地</span></div>
        <div class="metric"><strong>33</strong><span>生产线应用</span></div>
        <div class="metric"><strong>近40</strong><span>核心专利</span></div>
        <div class="metric"><strong>8亿</strong><span>累计签约</span></div>
      </aside>
      <aside class="capability glass">
        <div class="capability-head"><strong>核心业务与技术</strong><span>SLAG / HEAT / DATA / PROOF</span></div>
        <div class="services">
          <div class="service-card"><span class="small-caps">01 SLAG</span><strong>钢渣全流程干法处理</strong></div>
          <div class="service-card"><span class="small-caps">02 HEAT</span><strong>余热回收与膜式换热</strong></div>
          <div class="service-card"><span class="small-caps">03 DIGITAL</span><strong>低碳运行数据看板</strong></div>
          <div class="service-card"><span class="small-caps">04 PROOF</span><strong>专利与案例证据链</strong></div>
        </div>
      </aside>
      <div class="page-no">01 / 06</div>
    `,
  },
  {
    id: "01-about",
    title: "坦隆环境官网整套页面 - 关于我们",
    active: "关于我们",
    bg: "morning-green-bg.png",
    filename: "tanlong-01-about-1920x1080.png",
    label: "关于我们 / About",
    caption: "把品牌理念、技术领军、信用资质和落地规模前置，建立 B2B 官网的第一层可信度。",
    rail: 4,
    shade: "background: radial-gradient(circle at 72% 20%, rgba(166, 238, 188, 0.22), transparent 28%), linear-gradient(90deg, rgba(21, 52, 34, 0.94) 0%, rgba(26, 70, 49, 0.78) 36%, rgba(58, 115, 74, 0.32) 66%, rgba(10, 36, 31, 0.28) 100%), linear-gradient(180deg, rgba(15, 45, 34, 0.08), rgba(6, 27, 25, 0.72));",
    body: `
      <main class="about-copy fit-check">
        <div class="eyebrow">ABOUT TANLONG ENVIRONMENT</div>
        <h1 class="page-title">以技术让工业副产物<br />回到价值循环</h1>
        <p class="lede">坦隆环境深耕钢铁工业环保与资源循环领域，专注钢渣处理与余热回收。由范永平博士领衔，围绕全流程干法工艺、换热系统和低碳运行数据形成工程化能力。</p>
        <div class="actions">
          <a class="button primary" href="#">了解发展脉络</a>
          <a class="button secondary" href="#">查看资质能力</a>
        </div>
      </main>
      <figure class="about-visual">
        <img class="image-fill" src="../assets/case-hero.png" alt="" />
      </figure>
      <aside class="metric-grid proof-stack">
        <div class="metric"><strong>AAA</strong><span>信用单位</span></div>
        <div class="metric"><strong>18</strong><span>大型钢厂</span></div>
        <div class="metric"><strong>33</strong><span>生产线</span></div>
        <div class="metric"><strong>近40</strong><span>核心专利</span></div>
      </aside>
      <section class="beliefs">
        <article class="belief"><span class="small-caps">Integrity</span><strong>诚信为基</strong><p>面向钢铁企业的长期工程合作，重视稳定交付、运行安全和持续服务。</p></article>
        <article class="belief"><span class="small-caps">Innovation</span><strong>创新为魂</strong><p>以干法余热回收工艺解决传统湿法污染、能耗和资源浪费问题。</p></article>
        <article class="belief"><span class="small-caps">Co-value</span><strong>价值共生</strong><p>让废渣与废热转化为可计量、可运营、可复盘的绿色循环资源。</p></article>
      </section>
      <div class="page-no">02 / 06</div>
    `,
  },
  {
    id: "02-solutions",
    title: "坦隆环境官网整套页面 - 产品方案",
    active: "产品方案",
    bg: "silver-air-bg.png",
    filename: "tanlong-02-solutions-1920x1080.png",
    label: "产品方案 / Solutions",
    caption: "用三张核心业务图形成方案入口：钢渣处理、余热回收、低碳数据看板，并补足工程服务流程。",
    rail: 1,
    body: `
      <main class="solution-copy fit-check">
        <div class="eyebrow">INTEGRATED SOLUTIONS</div>
        <h1 class="page-title">钢渣处理与余热回收<br />一体化解决方案</h1>
        <p class="lede">围绕钢铁企业热态钢渣、废热资源和绿色低碳运营目标，提供从工况诊断、工艺设计、装备集成到运维复盘的项目闭环。</p>
      </main>
      <section class="solution-tiles" aria-label="Solutions">
        <article class="solution-tile">
          <img src="../assets/sol-01-slag.png" alt="" />
          <div class="solution-info"><span class="small-caps">01 SLAG</span><strong>钢渣全流程干法处理</strong><p>减少水耗与二次污染，提升钢渣资源化效率。</p></div>
        </article>
        <article class="solution-tile">
          <img src="../assets/sol-02-heat.png" alt="" />
          <div class="solution-info"><span class="small-caps">02 HEAT</span><strong>余热回收与膜式换热</strong><p>捕捉高温余热，服务厂区能源回收与低碳运行。</p></div>
        </article>
        <article class="solution-tile">
          <img src="../assets/sol-03-data.png" alt="" />
          <div class="solution-info"><span class="small-caps">03 DIGITAL</span><strong>低碳运行数据看板</strong><p>把工况、能效、减排和产线状态纳入同一套运营视图。</p></div>
        </article>
      </section>
      <section class="process-strip glass">
        <div>
          <span class="section-label">PROJECT LIFECYCLE</span>
          <p class="caption" style="margin-top:18px;">官网方案页不仅展示设备，更要给决策者看到服务路径和下一步动作。</p>
        </div>
        <div class="process-steps">
          <div class="process-step"><span class="small-caps">01 Diagnose</span><strong>工况诊断</strong></div>
          <div class="process-step"><span class="small-caps">02 Design</span><strong>工艺设计</strong></div>
          <div class="process-step"><span class="small-caps">03 Integrate</span><strong>装备集成</strong></div>
          <div class="process-step"><span class="small-caps">04 Operate</span><strong>调试运维</strong></div>
        </div>
      </section>
      <div class="page-no">03 / 06</div>
    `,
  },
  {
    id: "03-technology",
    title: "坦隆环境官网整套页面 - 核心技术",
    active: "核心技术",
    bg: "tanlong-hero-mill.png",
    filename: "tanlong-03-technology-1920x1080.png",
    label: "核心技术 / Technology",
    caption: "技术页用流程图和专利数据表达硬核能力，避免只放抽象口号。",
    rail: 2,
    shade: "background: radial-gradient(circle at 78% 22%, rgba(57, 216, 255, 0.22), transparent 27%), linear-gradient(90deg, rgba(3, 22, 31, 0.96) 0%, rgba(6, 39, 52, 0.82) 35%, rgba(12, 68, 75, 0.42) 65%, rgba(4, 22, 31, 0.28) 100%), linear-gradient(180deg, rgba(4, 19, 27, 0.18), rgba(2, 15, 22, 0.76));",
    body: `
      <main class="tech-copy fit-check">
        <div class="eyebrow">CORE TECHNOLOGY</div>
        <h1 class="page-title">全球首创钢渣全流程<br />干法余热回收利用</h1>
        <p class="lede">围绕热态钢渣的高温、粒化、换热、资源化与运行数据，形成从工艺机理到装备系统的专利组合，支撑钢铁企业降碳和资源循环。</p>
        <div class="actions">
          <a class="button primary" href="#">下载技术白皮书</a>
          <a class="button secondary" href="#">预约工艺评估</a>
        </div>
      </main>
      <figure class="tech-machine">
        <img class="image-fill" src="../assets/sol-02-heat.png" alt="" />
      </figure>
      <section class="tech-flow glass">
        <span class="section-label">DRY SLAG HEAT RECOVERY FLOW</span>
        <div class="flow-line" aria-hidden="true"></div>
        <div class="flow-items">
          <div class="flow-item"><div class="flow-dot">01</div><strong>热态钢渣</strong><span>高温物料进入干法系统</span></div>
          <div class="flow-item"><div class="flow-dot">02</div><strong>干法粒化</strong><span>降低湿法处理依赖</span></div>
          <div class="flow-item"><div class="flow-dot">03</div><strong>余热回收</strong><span>膜式换热与能源回收</span></div>
          <div class="flow-item"><div class="flow-dot">04</div><strong>资源转化</strong><span>形成高价值循环资源</span></div>
          <div class="flow-item"><div class="flow-dot">05</div><strong>数据复盘</strong><span>运行状态与低碳指标追踪</span></div>
        </div>
      </section>
      <aside class="patent-panel glass">
        <span class="section-label">PATENT & ENGINEERING PROOF</span>
        <div class="patent-grid">
          <div class="patent"><strong>28</strong><span>实用新型专利</span></div>
          <div class="patent"><strong>9</strong><span>发明专利</span></div>
          <div class="patent"><strong>近40</strong><span>核心专利组合</span></div>
        </div>
      </aside>
      <div class="page-no">04 / 06</div>
    `,
  },
  {
    id: "04-cases",
    title: "坦隆环境官网整套页面 - 案例中心",
    active: "案例中心",
    bg: "case-hero.png",
    filename: "tanlong-04-cases-1920x1080.png",
    label: "案例中心 / Cases",
    caption: "案例页不伪造客户 Logo，用应用场景、工况和落地数量建立可信但可发布的证明层。",
    rail: 3,
    shade: "background: radial-gradient(circle at 70% 18%, rgba(54, 226, 184, 0.2), transparent 26%), linear-gradient(90deg, rgba(4, 25, 33, 0.96) 0%, rgba(5, 42, 51, 0.82) 36%, rgba(16, 86, 76, 0.34) 65%, rgba(4, 24, 31, 0.3) 100%), linear-gradient(180deg, rgba(6, 28, 35, 0.14), rgba(3, 17, 22, 0.72));",
    body: `
      <main class="cases-copy fit-check">
        <div class="eyebrow">ENGINEERING CASES</div>
        <h1 class="page-title">18 家大型钢厂<br />33 条生产线验证</h1>
        <p class="lede">官网案例页以可授权信息为边界，优先呈现工况、解决方案、落地规模和可复用经验，让客户快速判断是否适配自身产线。</p>
      </main>
      <section class="case-list">
        <article class="case-card"><div class="case-no">01</div><div><strong>长流程钢铁基地应用</strong><p>面向高温钢渣连续处理工况，形成干法处理与余热回收联动方案。</p></div><em>钢渣处理<br />余热回收</em></article>
        <article class="case-card"><div class="case-no">02</div><div><strong>综合钢厂资源化改造</strong><p>围绕厂区能效、二次污染控制和资源产品质量，建立工程改造路径。</p></div><em>资源循环<br />低碳运营</em></article>
        <article class="case-card"><div class="case-no">03</div><div><strong>产线级运行数据看板</strong><p>把关键工况、能效、产线状态与运维复盘沉淀为可追踪的数据资产。</p></div><em>数据看板<br />运维复盘</em></article>
      </section>
      <aside class="service-map glass">
        <span class="section-label">SERVICE NETWORK</span>
        <p class="caption" style="margin-top:16px;">服务全国多地大型钢铁企业，具体客户名称以正式授权披露为准。</p>
        <div class="map-canvas" aria-hidden="true">
          <div class="map-line"></div>
          <span class="site-dot" style="left:150px;top:310px;"></span>
          <span class="site-label" style="left:110px;top:342px;">西南基地</span>
          <span class="site-dot" style="left:310px;top:248px;"></span>
          <span class="site-label" style="left:270px;top:280px;">华中产线</span>
          <span class="site-dot" style="left:468px;top:186px;"></span>
          <span class="site-label" style="left:426px;top:218px;">华北钢厂</span>
          <span class="site-dot" style="left:596px;top:144px;"></span>
          <span class="site-label" style="left:552px;top:176px;">沿海项目</span>
        </div>
      </aside>
      <div class="page-no">05 / 06</div>
    `,
  },
  {
    id: "05-resources-contact",
    title: "坦隆环境官网整套页面 - 资源与联系",
    active: "联系我们",
    bg: "silver-air-bg.png",
    filename: "tanlong-05-resources-contact-1920x1080.png",
    label: "资源与联系 / Resources & Contact",
    caption: "把资料下载、专家咨询、项目周期和线索表单整合成转化页，服务官网商业目标。",
    rail: 6,
    body: `
      <main class="resources-copy fit-check">
        <div class="eyebrow">RESOURCES & CONTACT</div>
        <h1 class="page-title">让技术评估更快<br />进入工程决策</h1>
        <p class="lede">面向技术、业务、财务和现场工程团队，提供可下载材料、工况诊断入口和专家咨询，让官网从展示窗口变成高质量线索入口。</p>
      </main>
      <section class="resource-grid">
        <article class="resource-card"><span class="small-caps">Whitepaper</span><strong>钢渣干法余热回收技术白皮书</strong><p>适合 CTO、工艺负责人评估技术路线和系统边界。</p></article>
        <article class="resource-card"><span class="small-caps">ROI</span><strong>项目收益与低碳价值测算</strong><p>辅助财务与业务团队判断投资回报和长期收益。</p></article>
        <article class="resource-card"><span class="small-caps">Checklist</span><strong>现场工况诊断清单</strong><p>快速梳理钢渣处理、余热利用、产线改造前置信息。</p></article>
        <article class="resource-card"><span class="small-caps">Case Kit</span><strong>典型应用场景资料包</strong><p>用可授权场景和工程事实支持内部立项沟通。</p></article>
      </section>
      <aside class="contact-panel glass">
        <span class="section-label">TALK TO TANLONG EXPERTS</span>
        <h2 style="margin-top:18px;font-size:36px;line-height:1.18;font-weight:620;">预约一次技术交流</h2>
        <p class="caption" style="margin-top:16px;">正式上线时可接入 CRM、邮箱或后端表单；效果图阶段仅展示转化布局。</p>
        <div class="form-grid" aria-label="Contact form mockup">
          <div class="field"><span>姓名</span><strong>请输入联系人</strong></div>
          <div class="field"><span>公司</span><strong>请输入企业名称</strong></div>
          <div class="field"><span>联系方式</span><strong>手机 / 邮箱</strong></div>
          <div class="field"><span>咨询方向</span><strong>钢渣处理 / 余热回收</strong></div>
          <div class="field wide"><span>项目背景</span><strong>简要描述产线工况、改造目标或资料需求</strong></div>
        </div>
        <div class="actions" style="margin-top:24px;">
          <a class="button primary" href="#">提交咨询</a>
          <a class="button secondary" href="#">下载资料包</a>
        </div>
        <div class="cycle">
          <span>需求沟通</span><span>现场调研</span><span>方案设计</span><span>商务确认</span><span>项目交付</span><span>运维复盘</span>
        </div>
      </aside>
      <div class="page-no">06 / 06</div>
    `,
  },
];

pages.push(
  {
    id: "06-slag-detail",
    title: "坦隆环境官网整套页面 - 钢渣处理详情",
    active: "产品方案",
    bg: "tanlong-hero-mill.png",
    filename: "tanlong-06-slag-detail-1920x1080.png",
    label: "钢渣方案详情 / Slag Treatment",
    caption: "方案详情页把客户痛点、工艺亮点、适用场景和可量化证明集中到一屏。",
    rail: 1,
    shade: "background: radial-gradient(circle at 72% 22%, rgba(255, 159, 61, 0.18), transparent 27%), linear-gradient(90deg, rgba(4, 24, 32, 0.96) 0%, rgba(6, 42, 52, 0.84) 36%, rgba(24, 78, 72, 0.34) 66%, rgba(4, 22, 31, 0.32) 100%), linear-gradient(180deg, rgba(4, 19, 27, 0.16), rgba(2, 15, 22, 0.76));",
    body: `
      <main class="detail-copy fit-check">
        <div class="eyebrow">SOLUTION DETAIL / SLAG</div>
        <h1 class="page-title">钢渣全流程干法处理<br />降低湿法依赖</h1>
        <p class="lede">面向热态钢渣连续处理、资源化利用和二次污染控制，构建从接渣、粒化、换热到资源产品质量控制的一体化工艺。</p>
        <div class="actions"><a class="button primary" href="#">申请工况诊断</a><a class="button secondary" href="#">查看工艺边界</a></div>
      </main>
      <figure class="detail-hero"><img class="image-fill" src="../assets/sol-01-slag.png" alt="" /></figure>
      <aside class="metric-grid detail-kpis">
        <div class="metric"><strong>少水</strong><span>减少湿法处理依赖</span></div>
        <div class="metric"><strong>稳产</strong><span>适配连续产线工况</span></div>
        <div class="metric"><strong>回热</strong><span>与余热系统联动</span></div>
        <div class="metric"><strong>资源化</strong><span>提高副产物价值</span></div>
      </aside>
      <section class="detail-board glass">
        <span class="section-label">CUSTOMER VALUE</span>
        <div class="detail-grid">
          <article class="detail-card"><span class="small-caps">Pain 01</span><strong>水耗与二次污染</strong><p>弱化传统湿法处理带来的水耗、排放和运行复杂度。</p></article>
          <article class="detail-card"><span class="small-caps">Pain 02</span><strong>热能浪费</strong><p>把高温钢渣热量纳入后续余热回收和厂区能效管理。</p></article>
          <article class="detail-card"><span class="small-caps">Pain 03</span><strong>资源品质波动</strong><p>围绕粒化、冷却和质量控制形成可复用工艺参数。</p></article>
        </div>
      </section>
    `,
  },
  {
    id: "07-heat-detail",
    title: "坦隆环境官网整套页面 - 余热回收详情",
    active: "产品方案",
    bg: "silver-air-bg.png",
    filename: "tanlong-07-heat-detail-1920x1080.png",
    label: "余热回收详情 / Heat Recovery",
    caption: "余热详情页突出换热系统、能源回收、运行监控和产线安全边界。",
    rail: 1,
    body: `
      <main class="detail-copy fit-check">
        <div class="eyebrow">SOLUTION DETAIL / HEAT</div>
        <h1 class="page-title">膜式换热与余热回收<br />服务低碳运行</h1>
        <p class="lede">针对高温钢渣释放过程中的热能，配置可工程化的换热、蒸汽、发电或厂区热能回用方案，降低能源损失并支撑低碳改造。</p>
        <div class="actions"><a class="button primary" href="#">预约热工评估</a><a class="button secondary" href="#">查看系统组成</a></div>
      </main>
      <figure class="detail-hero"><img class="image-fill" src="../assets/sol-02-heat.png" alt="" /></figure>
      <aside class="metric-grid detail-kpis">
        <div class="metric"><strong>换热</strong><span>膜式换热系统</span></div>
        <div class="metric"><strong>回收</strong><span>高温余热利用</span></div>
        <div class="metric"><strong>安全</strong><span>运行边界管理</span></div>
        <div class="metric"><strong>低碳</strong><span>能效与排放复盘</span></div>
      </aside>
      <section class="detail-board glass">
        <span class="section-label">SYSTEM MODULES</span>
        <div class="detail-grid">
          <article class="detail-card"><span class="small-caps">01 Capture</span><strong>热量捕捉</strong><p>围绕高温物料释放过程进行热能捕捉与稳定导出。</p></article>
          <article class="detail-card"><span class="small-caps">02 Exchange</span><strong>换热转化</strong><p>通过换热系统把热能转化为可利用能源形态。</p></article>
          <article class="detail-card"><span class="small-caps">03 Operate</span><strong>联动运行</strong><p>与产线节拍、设备状态和安全策略形成协同。</p></article>
        </div>
      </section>
    `,
  },
  {
    id: "08-digital-detail",
    title: "坦隆环境官网整套页面 - 数字化看板详情",
    active: "核心技术",
    bg: "silver-air-bg.png",
    filename: "tanlong-08-digital-detail-1920x1080.png",
    label: "数字化看板详情 / Digital Dashboard",
    caption: "数字化详情页用仪表盘化表达能效、产线状态、运维和低碳指标，不伪造真实数据。",
    rail: 2,
    shade: "background: radial-gradient(circle at 74% 18%, rgba(56, 215, 247, 0.22), transparent 27%), linear-gradient(90deg, rgba(4, 24, 32, 0.96) 0%, rgba(8, 45, 58, 0.82) 38%, rgba(11, 84, 82, 0.32) 68%, rgba(4, 22, 31, 0.3) 100%), linear-gradient(180deg, rgba(4, 19, 27, 0.12), rgba(2, 15, 22, 0.74));",
    body: `
      <main class="detail-copy fit-check">
        <div class="eyebrow">DIGITAL OPERATIONS</div>
        <h1 class="page-title">把工况、能效和低碳指标<br />纳入同一运营视图</h1>
        <p class="lede">面向厂区运行团队和管理层，沉淀产线状态、设备运行、能效、资源化质量和低碳复盘数据，让工程系统具备持续优化能力。</p>
        <div class="actions"><a class="button primary" href="#">查看看板样例</a><a class="button secondary" href="#">咨询数据接入</a></div>
      </main>
      <aside class="data-dashboard glass">
        <span class="section-label">LOW-CARBON OPERATIONS DASHBOARD</span>
        <div class="dash-top">
          <div class="dash-widget"><strong>运行</strong><span>产线状态与关键工况</span></div>
          <div class="dash-widget"><strong>能效</strong><span>热能回收与消耗复盘</span></div>
          <div class="dash-widget"><strong>减排</strong><span>低碳指标跟踪</span></div>
        </div>
        <div class="chart-slab">
          <span class="small-caps">Trend / sample visualization</span>
          <div class="chart-line" aria-hidden="true"></div>
        </div>
        <div class="cycle" style="grid-template-columns: repeat(4, 1fr); margin-top: 18px;">
          <span>采集</span><span>分析</span><span>预警</span><span>复盘</span>
        </div>
      </aside>
      <aside class="metric-grid detail-kpis">
        <div class="metric"><strong>工况</strong><span>关键状态追踪</span></div>
        <div class="metric"><strong>能效</strong><span>回收与消耗</span></div>
        <div class="metric"><strong>运维</strong><span>问题闭环</span></div>
        <div class="metric"><strong>复盘</strong><span>项目价值沉淀</span></div>
      </aside>
    `,
  },
  {
    id: "09-case-detail",
    title: "坦隆环境官网整套页面 - 案例详情",
    active: "案例中心",
    bg: "case-hero.png",
    filename: "tanlong-09-case-detail-1920x1080.png",
    label: "案例详情 / Case Detail",
    caption: "案例详情页用“背景、方案、结果、可复用经验”组织内容，不写未授权客户名。",
    rail: 3,
    shade: "background: linear-gradient(90deg, rgba(4, 24, 32, 0.96) 0%, rgba(5, 39, 49, 0.8) 43%, rgba(8, 70, 66, 0.26) 100%), linear-gradient(180deg, rgba(4, 19, 27, 0.06), rgba(2, 15, 22, 0.72));",
    body: `
      <figure class="case-detail-hero"><img class="image-fill" src="../assets/case-hero.png" alt="" /></figure>
      <main class="case-detail-copy fit-check">
        <div class="eyebrow">CASE DETAIL</div>
        <h1 class="page-title">长流程钢铁基地<br />钢渣资源化改造</h1>
        <p class="lede">示例案例页以授权边界为前提，展示工况、方案和可复用经验，正式发布时替换为客户许可内容。</p>
      </main>
      <section class="case-detail-grid">
        <article class="case-detail-card glass"><span class="small-caps">Project Background</span><h2>高温钢渣连续处理压力</h2><p>客户需要在不影响产线节拍的前提下，降低湿法处理依赖，并提升钢渣资源化稳定性。</p><ul><li>热态物料处理窗口紧</li><li>二次污染控制要求高</li><li>资源产品质量需稳定</li></ul></article>
        <article class="case-detail-card glass"><span class="small-caps">Tanlong Solution</span><h2>干法处理 + 余热回收联动</h2><p>通过全流程干法处理、膜式换热、运行参数沉淀和项目交付管理，形成适配钢铁基地的工程闭环。</p><ul><li>工况诊断与系统设计</li><li>装备集成和现场调试</li><li>运行数据复盘</li></ul></article>
        <article class="case-detail-card glass"><span class="small-caps">Reusable Proof</span><h2>可复制的项目方法</h2><p>用工况、设备、运行和收益四类资料沉淀项目证据，为销售和技术交流提供可复用内容。</p><ul><li>适配高温连续工况</li><li>服务低碳运营目标</li><li>形成资料化案例资产</li></ul></article>
      </section>
    `,
  },
  {
    id: "10-resource-article",
    title: "坦隆环境官网整套页面 - 资源文章",
    active: "资源中心",
    bg: "morning-green-bg.png",
    filename: "tanlong-10-resource-article-1920x1080.png",
    label: "资源文章 / Resource Article",
    caption: "资源文章页服务 SEO、销售赋能和技术决策，不只是新闻列表。",
    rail: 5,
    shade: "background: radial-gradient(circle at 78% 18%, rgba(166, 238, 188, 0.18), transparent 28%), linear-gradient(90deg, rgba(12, 43, 31, 0.96) 0%, rgba(18, 62, 44, 0.82) 42%, rgba(42, 97, 67, 0.28) 100%), linear-gradient(180deg, rgba(4, 19, 27, 0.06), rgba(2, 15, 22, 0.72));",
    body: `
      <section class="article-page">
        <aside class="article-aside glass">
          <div class="eyebrow">RESOURCE CENTER</div>
          <h2 style="font-size:42px;line-height:1.16;margin:0 0 24px;">资源中心不只是新闻<br />也是销售赋能库</h2>
          <p class="caption">面向技术、业务、财务和现场工程师，拆分白皮书、工况清单、ROI 测算、典型场景和常见问题。</p>
          <div class="metric-grid" style="grid-template-columns: repeat(2,1fr); margin-top:36px;">
            <div class="metric"><strong>4</strong><span>角色内容入口</span></div>
            <div class="metric"><strong>6</strong><span>决策阶段资料</span></div>
          </div>
        </aside>
        <article class="article-body glass fit-check">
          <span class="small-caps">Whitepaper Preview</span>
          <h1>钢渣干法余热回收技术如何进入企业低碳改造议程</h1>
          <section class="article-section"><strong>一、先用工况定义技术边界</strong><p>文章开头先解释产线工况、热态钢渣处理窗口、能源回收目标和项目约束，帮助客户判断是否适配。</p></section>
          <section class="article-section"><strong>二、用流程图说明系统价值</strong><p>把接渣、干法粒化、换热、资源化、数据复盘串成闭环，降低技术沟通成本。</p></section>
          <section class="article-section"><strong>三、把下一步转化做清楚</strong><p>文章底部提供工况诊断清单、专家咨询和资料包下载，承接不同决策阶段的访客。</p></section>
        </article>
      </section>
    `,
  },
  {
    id: "11-service-process",
    title: "坦隆环境官网整套页面 - 服务流程",
    active: "联系我们",
    bg: "aqua-clear-bg.png",
    filename: "tanlong-11-service-process-1920x1080.png",
    label: "服务流程 / Service Process",
    caption: "服务流程页把咨询、调研、方案、商务、交付、运维复盘形成官网转化闭环。",
    rail: 6,
    body: `
      <main class="service-detail-copy fit-check">
        <div class="eyebrow">PROJECT SERVICE PROCESS</div>
        <h1 class="page-title">从一次技术交流<br />进入可执行项目闭环</h1>
        <p class="lede">官网转化不止靠一个表单。坦隆需要把项目服务周期讲清楚，让客户知道提交需求后会发生什么、需要准备什么、如何推进内部立项。</p>
        <div class="actions"><a class="button primary" href="#">发起项目沟通</a><a class="button secondary" href="#">下载前置信息表</a></div>
      </main>
      <aside class="service-detail-panel glass">
        <span class="section-label">HANDOFF ITEMS</span>
        <div class="handoff-stack">
          <div class="handoff-item"><b>01</b><div><strong>需求沟通</strong><span>收集产线、钢渣、热能和改造目标信息</span></div></div>
          <div class="handoff-item"><b>02</b><div><strong>现场调研</strong><span>确认工况边界、设备空间和安全约束</span></div></div>
          <div class="handoff-item"><b>03</b><div><strong>方案设计</strong><span>输出工艺路线、设备配置和项目价值测算</span></div></div>
          <div class="handoff-item"><b>04</b><div><strong>商务确认</strong><span>明确项目范围、交付计划和服务边界</span></div></div>
          <div class="handoff-item"><b>05</b><div><strong>交付复盘</strong><span>完成调试、运行培训和低碳价值复盘</span></div></div>
        </div>
      </aside>
      <section class="route-map glass">
        <span class="section-label">FULL PROJECT LIFECYCLE</span>
        <div class="route-steps">
          <article class="route-step"><span class="small-caps">01</span><strong>咨询</strong><p>官网表单、资料下载或专家交流入口。</p></article>
          <article class="route-step"><span class="small-caps">02</span><strong>诊断</strong><p>整理钢渣、热能、产线和场地信息。</p></article>
          <article class="route-step"><span class="small-caps">03</span><strong>方案</strong><p>形成工艺、装备、预算和收益框架。</p></article>
          <article class="route-step"><span class="small-caps">04</span><strong>确认</strong><p>项目范围、交付节奏和商务边界。</p></article>
          <article class="route-step"><span class="small-caps">05</span><strong>交付</strong><p>工程实施、调试、培训和验收。</p></article>
          <article class="route-step"><span class="small-caps">06</span><strong>复盘</strong><p>沉淀运行数据、案例和持续优化项。</p></article>
        </div>
      </section>
    `,
  }
);

pages.forEach((page, index) => {
  page.pageNo = `${String(index + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
});

for (const page of pages) {
  const html = shell(page);
  const htmlPath = path.join(htmlDir, `${page.id}.html`);
  fs.writeFileSync(htmlPath, html);
  page.htmlPath = htmlPath;
  page.outputPath = path.join(finalDir, page.filename);
}

fs.writeFileSync(
  path.join(outDir, "site-system.md"),
  `# 坦隆环境官网整套页面效果\n\n` +
    `生成日期：2026-06-27\n\n` +
    `## 页面范围\n\n` +
    pages.map((page, index) => `${index + 1}. ${page.label}：${page.caption}`).join("\n") +
    `\n\n## 设计规则\n\n` +
    `- 统一沿用坦隆环境新 LOGO、顶部导航、AAA 信用标识、深水蓝与清透青绿配色。\n` +
    `- 背景与业务图片仅作为视觉层，所有中文、英文、指标、CTA 均由 HTML/CSS 确定性渲染。\n` +
    `- 案例页不伪造客户名称或客户 Logo，使用“应用场景 + 工况 + 落地数量”的安全表达。\n` +
    `- 输出规格统一为 1920x1080 PNG，适合做官网视觉评审与方案汇报。\n`
);

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      title: "Tanlong Environment full website page effect set",
      date: "2026-06-27",
      target: "坦隆环境官网整套页面效果",
      format: { type: "desktop website page effect images", width: 1920, height: 1080 },
      pages: pages.map((page) => ({
        id: page.id,
        label: page.label,
        html: path.relative(outDir, page.htmlPath),
        png: path.relative(outDir, page.outputPath),
        caption: page.caption,
      })),
      deterministicLayers: [
        "Logo placement",
        "Navigation",
        "Chinese and English copy",
        "CTA labels",
        "Metrics and proof points",
        "Page structure and layout",
      ],
      visualLayers: [
        "Generated environmental backgrounds from the homepage palette exploration",
        "Tanlong PPT-derived site images copied into this run folder",
      ],
    },
    null,
    2
  )
);

const reviewManifest = pages.map((page) => ({
  id: page.id,
  title: page.label,
  label: page.label,
  src: `final/${page.filename}`,
  href: `final/${page.filename}`,
  caption: page.caption,
  prompt: `Desktop 1920x1080 Tanlong Environment website page effect. Deterministic Chinese copy and brand layers; visual style: fresh environmental technology, industrial low-carbon credibility, transparent glass overlays.`,
  route: "Tanlong full website effect",
}));

fs.writeFileSync(path.join(outDir, "review-manifest.json"), JSON.stringify(reviewManifest, null, 2));

async function exportPages() {
  const browser = await chromium.launch();
  const validations = [];

  for (const pageSpec of pages) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const consoleMessages = [];
    const pageErrors = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleMessages.push({ type: message.type(), text: message.text() });
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(pathToFileURL(pageSpec.htmlPath).href, { waitUntil: "networkidle" });
    await page.screenshot({ path: pageSpec.outputPath, fullPage: false });

    const validation = await page.evaluate(() => {
      const badImages = Array.from(document.images)
        .filter((img) => !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0)
        .map((img) => img.getAttribute("src"));
      const overflow = Array.from(document.querySelectorAll(".fit-check, .page-title, header, nav, .glass, .resource-card, .case-card"))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            selector: element.className || element.tagName,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
          };
        })
        .filter((rect) => rect.left < -1 || rect.top < -1 || rect.right > 1921 || rect.bottom > 1081);
      const header = document.querySelector("header").getBoundingClientRect();
      const titleElement = document.querySelector(".page-title") || document.querySelector(".article-body h1");
      const title = titleElement ? titleElement.getBoundingClientRect() : { top: 9999, bottom: 9999, left: 9999, right: 9999 };
      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        badImages,
        overflow,
        headerTitleOverlap: !(header.bottom <= title.top || header.top >= title.bottom || header.right <= title.left || header.left >= title.right),
      };
    });

    validations.push({
      id: pageSpec.id,
      html: path.relative(outDir, pageSpec.htmlPath),
      png: path.relative(outDir, pageSpec.outputPath),
      consoleMessages,
      pageErrors,
      ...validation,
    });
    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(finalDir, "site-pages-validation-summary.json"), JSON.stringify(validations, null, 2));
}

exportPages().catch((error) => {
  console.error(error);
  process.exit(1);
});
