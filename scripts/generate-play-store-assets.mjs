import sharp from "sharp";
import { mkdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logoPath = path.join(root, "assets", "images", "logo.png");
const iconPath = path.join(root, "assets", "images", "icon.png");
const outDir = path.join(root, "assets", "play-store");

function gradientSvg(width, height) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C8F0E8"/>
      <stop offset="55%" stop-color="#8FD9CC"/>
      <stop offset="100%" stop-color="#5BC4B0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`
  );
}

function featureBannerSvg() {
  const w = 1024;
  const h = 500;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#071218"/>
      <stop offset="42%" stop-color="#0F3D45"/>
      <stop offset="100%" stop-color="#1BA89A"/>
    </linearGradient>
    <linearGradient id="glow" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#3EE8D0" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#3EE8D0" stop-opacity="0"/>
    </linearGradient>
    <filter id="tsh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.45"/>
    </filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <ellipse cx="820" cy="120" rx="220" ry="100" fill="url(#glow)"/>
  <g opacity="0.12" stroke="#fff" stroke-width="1" fill="none">
    <path d="M0 380 Q 200 340 420 360 T 1024 320"/>
    <path d="M0 420 Q 260 400 520 410 T 1024 390"/>
  </g>
  <g fill="#fff" font-family="Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif" filter="url(#tsh)">
    <text x="56" y="118" font-size="26" font-weight="700" letter-spacing="3" fill="#9FE8DC">DIETOS</text>
    <text x="56" y="200" font-size="44" font-weight="800">Organize a sua</text>
    <text x="56" y="258" font-size="44" font-weight="800">nutrição no dia a dia</text>
    <text x="56" y="318" font-size="22" font-weight="500" fill="#D4F5F0">Dietas, consultas e acompanhamento num só lugar.</text>
  </g>
  <g transform="translate(500 96)">
    <rect x="0" y="0" width="132" height="268" rx="22" fill="#0F232C" stroke="#ffffff22" stroke-width="2"/>
    <rect x="12" y="36" width="108" height="190" rx="10" fill="#0a1820"/>
    <rect x="12" y="236" width="108" height="6" rx="3" fill="#ffffff18"/>
  </g>
  <g transform="translate(658 52)">
    <rect x="0" y="0" width="210" height="398" rx="28" fill="#0F232C" stroke="#ffffff33" stroke-width="2"/>
    <rect x="14" y="52" width="182" height="300" rx="14" fill="#08151c"/>
    <rect x="14" y="360" width="182" height="8" rx="4" fill="#ffffff22"/>
  </g>
  <g transform="translate(888 118)">
    <rect x="0" y="0" width="118" height="244" rx="18" fill="#0F232C" stroke="#ffffff22" stroke-width="2"/>
    <rect x="10" y="32" width="98" height="168" rx="8" fill="#0a1820"/>
    <rect x="10" y="212" width="98" height="5" rx="2" fill="#ffffff18"/>
  </g>
  <circle cx="480" cy="96" r="10" fill="#5EEAD4" opacity="0.9"/>
  <circle cx="440" cy="160" r="6" fill="#fff" opacity="0.35"/>
  <circle cx="960" cy="400" r="8" fill="#fff" opacity="0.25"/>
</svg>`);
}

async function buildIcon() {
  const size = 512;
  return sharp(iconPath)
    .resize(size, size, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, "playstore-icon-512.png"));
}

async function buildFeature() {
  const w = 1024;
  const h = 500;
  const base = await sharp(featureBannerSvg()).ensureAlpha().png().toBuffer();
  const logoBuf = await readFile(logoPath);
  const screenW = 170;
  const screenH = 260;
  const logoOnScreen = await sharp(logoBuf)
    .resize(screenW, screenH, { fit: "contain", background: { r: 8, g: 21, b: 28, alpha: 1 } })
    .png()
    .toBuffer();
  const lm = await sharp(logoOnScreen).metadata();
  const phoneScreenLeft = 658 + 14;
  const phoneScreenTop = 52 + 52;
  const logoLeft = phoneScreenLeft + Math.round((182 - lm.width) / 2);
  const logoTop = phoneScreenTop + Math.round((300 - lm.height) / 2);
  const leftPhoneCard = await sharp(logoBuf)
    .resize(92, 124, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.88, saturation: 0.95 })
    .png()
    .toBuffer();
  const leftMeta = await sharp(leftPhoneCard).metadata();
  const lx = 500 + 12 + Math.round((108 - leftMeta.width) / 2);
  const ly = 96 + 36 + Math.round((190 - leftMeta.height) / 2);
  const rightCard = await sharp(logoBuf)
    .resize(82, 108, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.78 })
    .png()
    .toBuffer();
  const rm = await sharp(rightCard).metadata();
  const rx = 888 + 10 + Math.round((98 - rm.width) / 2);
  const ry = 118 + 32 + Math.round((168 - rm.height) / 2);
  return sharp(base)
    .composite([
      { input: leftPhoneCard, left: lx, top: ly },
      { input: logoOnScreen, left: logoLeft, top: logoTop },
      { input: rightCard, left: rx, top: ry },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, "playstore-feature-1024x500.png"));
}

await mkdir(outDir, { recursive: true });
await buildIcon();
await buildFeature();
