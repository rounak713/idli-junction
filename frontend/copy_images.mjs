import fs from 'fs';
import path from 'path';

const srcDir = "C:\\Users\\Dooti's TUF A17\\.gemini\\antigravity\\brain\\9df34118-3c75-44ec-9b17-667576057fa8";
const destDir = "d:\\idli-junction-app\\public\\images";

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = {
  "hero_bg_image_1777368662011.png": "hero_bg.png",
  "masala_dosa_image_1777368700551.png": "masala_dosa.png",
  "medu_vada_image_1777368723069.png": "medu_vada.png",
  "filter_coffee_image_1777368743989.png": "filter_coffee.png",
  "chef_cooking_image_1777368768671.png": "chef_cooking.png",
  "idli_platter_image_1777368788710.png": "idli_platter.png"
};

for (const [src, dest] of Object.entries(filesToCopy)) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} to ${dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
}
