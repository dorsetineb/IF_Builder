import path from 'path';
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

          const githubToken = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
          const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'IFBuilder-AutoUpdater'
          };
          if (githubToken) {
            headers['Authorization'] = `Bearer ${githubToken}`;
          }

          try {
            const response = await fetch('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest', { headers });
            if (response.ok) {
              const data = await response.json();
              const latestTag = data.tag_name || data.name || '0.5.0';
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

          res.end(JSON.stringify({
            version: '0.5.0',
            releaseName: 'IF Builder v0.5.0',
            releaseNotes: `Atualização Automática & Downloads Diretos da Web\n\nEsta versão traz grandes melhorias na experiência de distribuição e atualização do IF Builder, integrando verificações automáticas no desktop, downloads diretos pela versão web e aprimoramentos visuais.\n\n📌 Novidades & Recursos\n• 🖥️ Sistema de Atualização Automática (Desktop): Notificação automática ao iniciar o aplicativo quando uma nova versão estiver disponível no GitHub, exibindo o resumo das notas de versão e solicitando confirmação explícita do usuário para atualizar.\n• 📥 Download Direto pela Versão Web: Modal dedicado para baixar os instaladores oficiais do Windows (.exe / .msi) e Linux (.AppImage / .deb) diretamente da página do aplicativo, sem precisar navegar pela interface do GitHub.\n• 📜 Log de Desenvolvimento Integrado: Acesso ao log de lançamentos e notas de versão diretamente na aba "Sobre o Projeto", com carregamento dinâmico dos dados oficiais do repositório.\n\n🎨 Interface & UX\n• 🏷️ Indicadores de Versão: Exibição elegante e alinhada do número da versão (v0.5.0) na tela inicial (abaixo do logo IF) e na tela de boot do editor.\n• 🌐 Internacionalização (i18n): Suporte completo em Português, Inglês e Espanhol para as telas de atualização, modais de download e logs de desenvolvimento.\n\n⚙️ Infraestrutura & Segurança\n• 🔐 Serverless Endpoints (Vercel): Rotas seguras via Vercel Serverless Functions (/api/update e /api/download) com suporte transparente a repositórios públicos e privados.\n• 🔄 Sincronização de Versões: Scripts de release mantêm package.json, tauri.conf.json e src/version.ts perfeitamente alinhados a cada atualização.`,
            htmlUrl: 'https://github.com/dorsetineb/IF_Builder/releases/tag/v0.5.0',
            downloadUrl: 'https://github.com/dorsetineb/IF_Builder/releases/tag/v0.5.0'
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

          let downloadUrl = 'https://github.com/dorsetineb/IF_Builder/releases/tag/v0.5.0';

          try {
            const response = await fetch('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest', { headers });
            if (response.ok) {
              const data = await response.json();
              const assets = data.assets || [];
              let targetAsset: any = null;
              if (platform === 'linux') {
                targetAsset = assets.find((asset: any) => asset.name?.endsWith('.AppImage') || asset.name?.endsWith('.deb'));
              } else {
                targetAsset = assets.find((asset: any) => asset.name?.endsWith('.msi') || asset.name?.endsWith('.exe') || asset.name?.endsWith('.setup.exe'));
              }
              if (!targetAsset && assets.length > 0) targetAsset = assets[0];
              if (targetAsset?.browser_download_url) downloadUrl = targetAsset.browser_download_url;
            }
          } catch (e) {}

          res.writeHead(302, { Location: downloadUrl });
          res.end();
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
    }
  };
});
