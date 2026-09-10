import fs from 'fs';
import path from 'path';

const brainDir = "C:\\Users\\Dooti's TUF A17\\.gemini\\antigravity\\brain\\f07502bd-71c1-462e-b392-8575a59da993";
const targetDir = "d:\\IJA\\public\\images";

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const map = {
    "hero_bg_1777372417749.png": "hero_bg.png",
    "idli_platter_1777372440232.png": "idli_platter.png",
    "masala_dosa_1777372461754.png": "masala_dosa.png",
    "filter_coffee_1777372484891.png": "filter_coffee.png"
};

for (const [src, dest] of Object.entries(map)) {
    const srcPath = path.join(brainDir, src);
    const destPath = path.join(targetDir, dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${src} to ${dest}`);
    } else {
        console.log(`Source not found: ${srcPath}`);
    }
}

// Move logo and menu from root
const rootDir = "d:\\IJA";
const logoSrc = path.join(rootDir, "IJ_Logo.jpeg");
const menuSrc = path.join(rootDir, "Menu.jpeg");

if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, path.join(targetDir, "logo.jpeg"));
    console.log("Moved logo.jpeg");
}
if (fs.existsSync(menuSrc)) {
    fs.copyFileSync(menuSrc, path.join(targetDir, "menu_original.jpeg"));
    console.log("Moved menu_original.jpeg");
}
