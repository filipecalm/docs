import sharp from "sharp";
import { rename } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imagesDir = path.join(root, "assets", "images");

const BG = { r: 15, g: 35, b: 44, alpha: 1 }; // #0F232C

function devLog(...args) {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
}

async function trimAndFill(srcPath, destPath, { size = 1024, margin = 0 } = {}) {
  const trimmed = await sharp(srcPath)
    .trim({ threshold: 15 })
    .toBuffer({ resolveWithObject: true });

  const { info } = trimmed;
  devLog(`  trimmed: ${info.width}x${info.height} (was 1024x1024)`);

  const targetContent = size - margin * 2;
  const tmpPath = destPath + ".tmp.png";

  await sharp(trimmed.data)
    .resize(targetContent, targetContent, {
      fit: "contain",
      background: BG,
    })
    .extend({
      top: margin,
      bottom: margin,
      left: margin,
      right: margin,
      background: BG,
    })
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toFile(tmpPath);

  await rename(tmpPath, destPath);
  devLog(`  -> ${path.basename(destPath)}`);
}

devLog("Fixing icon.png...");
await trimAndFill(
  path.join(imagesDir, "icon.png"),
  path.join(imagesDir, "icon.png"),
  { size: 1024, margin: 72 }
);

devLog("Fixing adaptive-icon.png...");
await trimAndFill(
  path.join(imagesDir, "adaptive-icon.png"),
  path.join(imagesDir, "adaptive-icon.png"),
  { size: 1024, margin: 52 }
);

devLog("Fixing logo.png...");
await trimAndFill(
  path.join(imagesDir, "logo.png"),
  path.join(imagesDir, "logo.png"),
  { size: 1024, margin: 72 }
);

devLog("Done.");
