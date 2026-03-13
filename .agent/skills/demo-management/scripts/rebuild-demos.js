/**
 * Rebuild Demos Script
 * This script automates the synchronization and fixing of demo games in the `public` folder.
 * 
 * Usage:
 * node .agent/skills/demo-management/scripts/rebuild-demos.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Define __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const ENGINE_FILE = path.join(PROJECT_ROOT, 'src', 'components', 'game-engine.ts');

const demos = ['fuja_da_masmorra', 'escape_the_dungeon', 'escapa_la_mazmorra'];

// 1. Get current engine code
function getEngineCode() {
    const engineSource = fs.readFileSync(ENGINE_FILE, 'utf-8');
    // Extract gameJS constant content
    const gameJSMatch = engineSource.match(/export const gameJS = `([\s\S]*?)`;/);
    if (!gameJSMatch) {
        throw new Error('Could not find gameJS constant in game-engine.ts');
    }
    return gameJSMatch[1];
}

// 2. Fix CSS frame selectors
function fixCssSelectors(cssContent) {
    const frameCssFixes = [
        ['body.frame-rounded-top.game-container.image-panel', 'body.frame-rounded-top .game-container .image-panel'],
        ['body.frame-rounded-top.game-container.image-container', 'body.frame-rounded-top .game-container .image-container'],
        ['body.frame-book-cover.game-container.image-panel', 'body.frame-book-cover .game-container .image-panel'],
        ['body.frame-book-cover.game-container.image-container', 'body.frame-book-cover .game-container .image-container'],
        ['body.frame-trading-card.image-panel', 'body.frame-trading-card .image-panel'],
        ['body.frame-trading-card.game-container:not(.layout-image-last).image-panel', 'body.frame-trading-card .game-container:not(.layout-image-last) .image-panel'],
        ['body.frame-trading-card.game-container.layout-image-last.image-panel', 'body.frame-trading-card .game-container.layout-image-last .image-panel'],
        ['body.frame-trading-card.image-container', 'body.frame-trading-card .image-container'],
        ['body.frame-none.main-wrapper', 'body.frame-none .main-wrapper'],
        ['body.frame-none.game-container {', 'body.frame-none .game-container {'],
        ['body.frame-none.image-panel', 'body.frame-none .image-panel'],
        ['body.frame-none.game-container.layout-horizontal.image-panel', 'body.frame-none .game-container.layout-horizontal .image-panel'],
        ['body.frame-none.game-container.layout-image-last.image-panel', 'body.frame-none .game-container.layout-image-last .image-panel'],
    ];

    let fixedContent = cssContent;
    for (const [from, to] of frameCssFixes) {
        fixedContent = fixedContent.split(from).join(to);
    }
    return fixedContent;
}

// Main execution loop
async function rebuild() {
    try {
        const gameJS = getEngineCode();
        console.log('--- Starting Demo Rebuild ---');

        for (const demoName of demos) {
            const demoPath = path.join(PUBLIC_DIR, demoName);
            console.log(`\nProcessing demo: ${demoName}`);

            if (!fs.existsSync(demoPath)) {
                console.log(`  [SKIP] Demo folder not found: ${demoName}`);
                continue;
            }

            // A. Rebuild game.js
            const gameJsPath = path.join(demoPath, 'game.js');
            if (fs.existsSync(gameJsPath)) {
                const currentJs = fs.readFileSync(gameJsPath, 'utf-8');
                const dataMatch = currentJs.match(/window\.embeddedGameData = ({[\s\S]*?});/);

                if (dataMatch) {
                    const embeddedData = dataMatch[1];
                    const newJs = `window.embeddedGameData = ${embeddedData};\n\n${gameJS}`;
                    fs.writeFileSync(gameJsPath, newJs);
                    console.log(`  [OK] Updated game.js (with latest engine)`);
                } else {
                    console.log(`  [WARN] window.embeddedGameData not found in ${demoName}/game.js`);
                }
            }

            // B. Fix style.css
            const styleCssPath = path.join(demoPath, 'style.css');
            if (fs.existsSync(styleCssPath)) {
                const cssContent = fs.readFileSync(styleCssPath, 'utf-8');
                const fixedCss = fixCssSelectors(cssContent);
                fs.writeFileSync(styleCssPath, fixedCss);
                console.log(`  [OK] Sanitized style.css (fixed frames)`);
            }

            // B2. Cache Busting in index.html
            const indexHtmlPath = path.join(demoPath, 'index.html');
            if (fs.existsSync(indexHtmlPath)) {
                let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
                const timestamp = Date.now();
                // Replace style.css and game.js with versioned versions
                // Using regex to handle various quoting styles or existing queries
                htmlContent = htmlContent.replace(/href=["']style\.css(\?v=[0-9]+)?["']/g, `href="style.css?v=${timestamp}"`);
                htmlContent = htmlContent.replace(/src=["']game\.js(\?v=[0-9]+)?["']/g, `src="game.js?v=${timestamp}"`);

                // B3. Add is-demo class to body
                if (!htmlContent.includes('is-demo')) {
                    htmlContent = htmlContent.replace(/<body([^>]+)class=["']([^"']+)["']/, '<body$1class="$2 is-demo"');
                }

                fs.writeFileSync(indexHtmlPath, htmlContent);
                console.log(`  [OK] Added cache busting and is-demo class to index.html (v=${timestamp})`);
            }

            // C. Update ZIP file (Using tar)
            const zipPath = path.join(PUBLIC_DIR, `${demoName}.zip`);
            console.log(`  [ZIP] Updating ${demoName}.zip...`);

            try {
                const absZipPath = path.resolve(zipPath);
                const absDemoPath = path.resolve(demoPath);

                // Remove existing ZIP first
                if (fs.existsSync(absZipPath)) fs.unlinkSync(absZipPath);

                // Use tar -a (auto-determine format by extension)
                // -c (create), -f (file), -C (change directory to demo folder), "." (include all files in demo folder)
                const tarCommand = `tar -a -c -f "${absZipPath}" -C "${absDemoPath}" .`;
                execSync(tarCommand, { stdio: 'inherit' });

                console.log(`  [OK] ZIP updated successfully via tar`);
            } catch (err) {
                console.error(`  [ERROR] Failed to update ZIP via tar: ${err.message}`);

                // Fallback to simpler method if tar fails (though tar is standard on modern Windows)
                console.log(`  [FALLBACK] Attempting PowerShell Compress-Archive...`);
                try {
                    const absZipPath = path.resolve(zipPath);
                    const absDemoPath = path.resolve(demoPath);
                    const psCommand = `powershell -Command "Compress-Archive -Path '${absDemoPath}\\*' -DestinationPath '${absZipPath}' -Force"`;
                    execSync(psCommand, { stdio: 'inherit' });
                    console.log(`  [OK] ZIP updated successfully via fallback`);
                } catch (fallbackErr) {
                    console.error(`  [FATAL] All ZIP methods failed for ${demoName}`);
                }
            }
        }

        console.log('\n--- Demo Rebuild Complete ---');
    } catch (err) {
        console.error(`\nFatal error: ${err.message}`);
        process.exit(1);
    }
}

rebuild();
