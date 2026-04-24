/**
 * update-demo-zips.mjs
 *
 * Regenerates the .zip files in public/ from the optimized folders.
 * This ensures the downloadable demos reflect the size optimizations.
 *
 * Run: node scripts/update-demo-zips.mjs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DEMOS = [
  'escape_the_dungeon',
  'fuja_da_masmorra',
  'escapa_la_mazmorra',
];

async function zipFolder(folderPath, zip, zipPath = '') {
  const files = readdirSync(folderPath);
  for (const file of files) {
    const filePath = join(folderPath, file);
    const stats = statSync(filePath);
    const relativePath = join(zipPath, file);
    if (stats.isDirectory()) {
      await zipFolder(filePath, zip, relativePath);
    } else {
      zip.file(relativePath, readFileSync(filePath));
    }
  }
}

async function main() {
  console.log('📦 IF Builder — Updating Demo ZIPs\n');

  for (const demo of DEMOS) {
    const folderPath = join(ROOT, 'public', demo);
    const zipPath = join(ROOT, 'public', `${demo}.zip`);

    if (!existsSync(folderPath)) {
      console.warn(`  ⚠️  Folder ${demo} not found, skipping.`);
      continue;
    }

    const zip = new JSZip();
    await zipFolder(folderPath, zip);

    const content = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    const oldSizeMB = existsSync(zipPath) ? (statSync(zipPath).size / 1024 / 1024).toFixed(2) : '0';
    writeFileSync(zipPath, content);
    const newSizeMB = (content.length / 1024 / 1024).toFixed(2);

    console.log(`✅ ${demo}.zip: ${oldSizeMB} MB → ${newSizeMB} MB`);
  }

  console.log('\n✨ All demo ZIPs updated!');
}

main().catch(console.error);
