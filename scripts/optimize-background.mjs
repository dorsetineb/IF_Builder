/**
 * optimize-background.mjs
 *
 * Converts public/background.png to an optimized WebP/JPEG.
 * Requires: npm install sharp --save-dev
 *
 * Run: node scripts/optimize-background.mjs
 */

import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('❌ sharp not installed. Run: npm install sharp --save-dev');
    process.exit(1);
  }

  const inputPath = join(ROOT, 'public', 'background.png');
  const outputPath = join(ROOT, 'public', 'background.webp');

  if (!existsSync(inputPath)) {
    console.error('❌ public/background.png not found.');
    process.exit(1);
  }

  const beforeBytes = (await import('fs')).statSync(inputPath).size;
  console.log(`📦 Original: ${(beforeBytes / 1024 / 1024).toFixed(2)} MB`);

  await sharp(inputPath)
    .webp({ quality: 82, effort: 6 })
    .toFile(outputPath);

  const afterBytes = (await import('fs')).statSync(outputPath).size;
  console.log(`✅ Optimized WebP: ${(afterBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Reduction: ${((1 - afterBytes / beforeBytes) * 100).toFixed(1)}%`);
  console.log('\n⚠️  Update any CSS/HTML references from background.png → background.webp');
}

main().catch(console.error);
