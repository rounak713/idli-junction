@echo off
set "src=C:\Users\Dooti's TUF A17\.gemini\antigravity\brain\f07502bd-71c1-462e-b392-8575a59da993"
set "dest=d:\IJA\public\images"

if not exist "%dest%" mkdir "%dest%"

copy "%src%\hero_bg_1777372417749.png" "%dest%\hero_bg.png"
copy "%src%\idli_platter_1777372440232.png" "%dest%\idli_platter.png"
copy "%src%\masala_dosa_1777372461754.png" "%dest%\masala_dosa.png"
copy "%src%\filter_coffee_1777372484891.png" "%dest%\filter_coffee.png"
copy "%src%\chef_cooking_1777372736784.png" "%dest%\chef_cooking.png"

copy "d:\IJA\IJ_Logo.jpeg" "%dest%\logo.jpeg"
copy "d:\IJA\Menu.jpeg" "%dest%\menu_original.jpeg"

echo Assets ready. Please run this script to copy images if they don't appear.
pause
