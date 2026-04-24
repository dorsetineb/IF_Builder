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
