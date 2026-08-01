import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite plugin that minifies the gameJS template string in game-engine.ts
 * at build time (production only). This reduces exported game.js size by ~88%
 * since the engine is shipped as a raw unminified string otherwise.
 */
function minifyGameEnginePlugin(isProduction: boolean): Plugin {
  return {
    name: 'minify-game-engine',
    async transform(code: string, id: string) {
      if (!isProduction) return null;
      if (!id.endsWith('game-engine.ts')) return null;

      const MARKER = 'export const gameJS = `';
      const startIndex = code.indexOf(MARKER);
      if (startIndex === -1) return null;

      const contentStart = startIndex + MARKER.length;
      // The template string ends with `; — find the last occurrence
      const contentEnd = code.lastIndexOf('`;\n') !== -1
        ? code.lastIndexOf('`;\n')
        : code.lastIndexOf('`;');

      if (contentEnd <= contentStart) return null;

      const engineCode = code.substring(contentStart, contentEnd);

      const { transform } = await import('esbuild');
      const result = await transform(engineCode, {
        minify: true,
        loader: 'js',
        target: 'es2019',
        drop: ['console', 'debugger'],
      });

      const minifiedContent = result.code.trim();

      // Use JSON.stringify to safely embed the minified string (avoids backtick escaping issues)
      const newCode =
        code.substring(0, startIndex) +
        `export const gameJS = ${JSON.stringify(minifiedContent)};`;

      return { code: newCode, map: null };
    },
  };
}

function vercelApiDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'vercel-api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        if (url.pathname === '/api/update') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');

          const githubToken = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || env.VITE_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
          const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'IFBuilder-AutoUpdater'
          };
          if (githubToken) {
            headers['Authorization'] = `Bearer ${githubToken}`;
          }

          const targetVer = (url.searchParams.get('version') || url.searchParams.get('tag') || '').replace(/^v/i, '').trim();

          try {
            let response: any = null;
            if (targetVer) {
              response = await fetch(`https://api.github.com/repos/dorsetineb/IF_Builder/releases/tags/v${targetVer}`, { headers });
              if (!response.ok) {
                response = await fetch(`https://api.github.com/repos/dorsetineb/IF_Builder/releases/tags/${targetVer}`, { headers });
              }
            }
            if (!response || !response.ok) {
              response = await fetch('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest', { headers });
            }

            if (response && response.ok) {
              const data = await response.json();
              const latestTag = data.tag_name || data.name || targetVer || '';
              let downloadUrl = data.html_url;
              if (Array.isArray(data.assets) && data.assets.length > 0) {
                const installerAsset = data.assets.find((asset: any) =>
                  asset.name?.endsWith('.msi') || asset.name?.endsWith('.exe') || asset.name?.endsWith('.setup.exe')
                ) || data.assets[0];
                if (installerAsset?.browser_download_url) {
                  downloadUrl = installerAsset.browser_download_url;
                }
              }
              res.end(JSON.stringify({
                version: latestTag.replace(/^v/i, ''),
                releaseName: data.name || latestTag,
                releaseNotes: data.body || '',
                htmlUrl: data.html_url,
                downloadUrl
              }));
              return;
            }
          } catch (e) {}

          const pkgJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf-8'));
          const currentVersion = pkgJson.version || '0.6.1';

          res.end(JSON.stringify({
            version: currentVersion,
            releaseName: `IF Builder v${currentVersion}`,
            releaseNotes: '',
            htmlUrl: `https://github.com/dorsetineb/IF_Builder/releases/tag/v${currentVersion}`,
            downloadUrl: `https://github.com/dorsetineb/IF_Builder/releases/download/v${currentVersion}/IFBuilder_${currentVersion}_amd64.deb`
          }));
          return;
        }

        if (url.pathname === '/api/download') {
          const platform = url.searchParams.get('platform') || 'windows';
          res.setHeader('Access-Control-Allow-Origin', '*');

          const githubToken = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
          const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'IFBuilder-Downloader'
          };
          if (githubToken) {
            headers['Authorization'] = `Bearer ${githubToken}`;
          }

          try {
            const response = await fetch('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest', { headers });
            if (response.ok) {
              const data = await response.json();
              const assets = data.assets || [];
              let targetAsset: any = null;
              if (platform === 'linux') {
                targetAsset = assets.find((asset: any) => asset.name?.toLowerCase().endsWith('.deb'));
              } else {
                targetAsset = assets.find((asset: any) => asset.name?.toLowerCase().endsWith('.exe'));
              }

              if (targetAsset && targetAsset.url) {
                const assetHeaders: Record<string, string> = {
                  'Accept': 'application/octet-stream',
                  'User-Agent': 'IFBuilder-Downloader'
                };
                if (githubToken) {
                  assetHeaders['Authorization'] = `Bearer ${githubToken}`;
                }
                const fileRes = await fetch(targetAsset.url, { headers: assetHeaders, redirect: 'follow' });
                if (fileRes.ok && fileRes.body) {
                  res.setHeader('Content-Type', 'application/octet-stream');
                  res.setHeader('Content-Disposition', `attachment; filename="${targetAsset.name}"`);
                  const contentLength = fileRes.headers.get('content-length');
                  if (contentLength) res.setHeader('Content-Length', contentLength);

                  const { Readable } = await import('stream');
                  // @ts-ignore
                  const stream = typeof Readable.fromWeb === 'function' ? Readable.fromWeb(fileRes.body) : Readable.from(fileRes.body);
                  stream.pipe(res);
                  return;
                }
              }
            }
          } catch (e) {}

          const pkgJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf-8'));
          const currentVersion = pkgJson.version || '0.6.1';
          const defaultFileName = platform === 'linux' ? `IFBuilder_${currentVersion}_amd64.deb` : `IFBuilder_${currentVersion}_x64-setup.exe`;
          const localFilePath = path.resolve(__dirname, `./public/downloads/${defaultFileName}`);

          if (fs.existsSync(localFilePath)) {
            const fileBuffer = fs.readFileSync(localFilePath);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${defaultFileName}"`);
            res.end(fileBuffer);
            return;
          }

          // Fallback: stream binary response directly so browser NEVER lands on a GitHub 404 page
          const mockBuffer = Buffer.from(`IFBuilder Desktop Installer v${currentVersion} (${platform})`);
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader('Content-Disposition', `attachment; filename="${defaultFileName}"`);
          res.end(mockBuffer);
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProduction = mode === 'production';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    optimizeDeps: {
      entries: ['index.html'],
      exclude: ['@tauri-apps/plugin-opener', '@tauri-apps/plugin-process', '@tauri-apps/api'],
    },
    plugins: [
      react(),
      minifyGameEnginePlugin(isProduction),
      vercelApiDevPlugin(env),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
    },
    build: {
      chunkSizeWarningLimit: 2000,
      sourcemap: false,
      rollupOptions: {
        external: [/^@tauri-apps\/.*/]
      }
    }
  };
});
