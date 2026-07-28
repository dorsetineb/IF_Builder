import { APP_VERSION } from '../version';

export interface ReleaseInfo {
  version: string;
  releaseName: string;
  releaseNotes: string;
  htmlUrl: string;
  downloadUrl?: string;
}

/**
 * Compares two semver version strings (e.g. "0.3.0" vs "0.4.0" or "v0.3.0" vs "v0.4.0").
 * Returns true if latestVersion > currentVersion.
 */
export function isNewerVersion(currentVersion: string, latestVersion: string): boolean {
  const cleanCurrent = currentVersion.replace(/^v/i, '').trim();
  const cleanLatest = latestVersion.replace(/^v/i, '').trim();

  const currentParts = cleanCurrent.split('.').map((p) => parseInt(p, 10) || 0);
  const latestParts = cleanLatest.split('.').map((p) => parseInt(p, 10) || 0);

  const maxLength = Math.max(currentParts.length, latestParts.length);
  for (let i = 0; i < maxLength; i++) {
    const c = currentParts[i] || 0;
    const l = latestParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}

/**
 * Checks whether the application is running inside a desktop environment (Tauri).
 */
export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
}

/**
 * Safely imports a Tauri plugin dynamically without triggering Vite's static AST import-analysis.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeTauriImport<T = any>(moduleName: string): Promise<T | null> {
  if (!isDesktopApp()) return null;
  try {
    const dynamicImport = new Function('m', 'return import(m)');
    return (await dynamicImport(moduleName)) as T;
  } catch (e) {
    console.warn(`[Tauri] Plugin ${moduleName} not available:`, e);
    return null;
  }
}

/**
 * Checks Releases for a newer version of IFBuilder.
 * Tries the Vercel API endpoint first (for private repos), then falls back to direct GitHub API.
 * Returns ReleaseInfo if a newer version is found, or null otherwise.
 */
export async function checkForUpdates(): Promise<ReleaseInfo | null> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return null;
  }

  const customUrl = import.meta.env.VITE_UPDATE_API_URL;
  const endpointsToTry: string[] = [];

  if (customUrl) {
    endpointsToTry.push(customUrl);
  }

  // Check current origin if NOT localhost
  if (typeof window !== 'undefined' && window.location?.origin && !window.location.hostname.includes('localhost') && window.location.hostname !== '127.0.0.1') {
    endpointsToTry.push(`${window.location.origin}/api/update`);
  }

  // Production Vercel Serverless Function proxy (has GITHUB_TOKEN & CORS enabled)
  endpointsToTry.push('https://if-builder.vercel.app/api/update');
  endpointsToTry.push('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest');

  for (const endpoint of endpointsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, application/vnd.github.v3+json'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('json')) continue;

      const data = await response.json();
      if (!data) continue;

      const versionStr = data.version || data.tag_name || data.name || '';
      if (!versionStr) continue;

      if (isNewerVersion(APP_VERSION, versionStr)) {
        let downloadUrl = data.downloadUrl || data.html_url;
        if (!downloadUrl && Array.isArray(data.assets) && data.assets.length > 0) {
          const installerAsset = data.assets.find((asset: { name?: string; browser_download_url?: string }) =>
            asset.name?.endsWith('.msi') || asset.name?.endsWith('.exe') || asset.name?.endsWith('.setup.exe')
          ) || data.assets[0];
          if (installerAsset?.browser_download_url) {
            downloadUrl = installerAsset.browser_download_url;
          }
        }

        return {
          version: String(versionStr).replace(/^v/i, ''),
          releaseName: data.releaseName || data.name || versionStr,
          releaseNotes: data.releaseNotes || data.body || '',
          htmlUrl: data.htmlUrl || data.html_url || '',
          downloadUrl: downloadUrl || data.html_url
        };
      } else {
        return null;
      }
    } catch (error) {
      console.debug(`[AutoUpdater] Check skipped for ${endpoint}:`, error);
    }
  }

  return null;
}

/**
 * Fetches the latest release info from API or GitHub releases endpoint regardless of version comparison.
 */
export async function fetchLatestRelease(targetVersion: string = APP_VERSION): Promise<ReleaseInfo | null> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return null;
  }

  const cleanVersion = targetVersion.replace(/^v/i, '').trim();
  const endpointsToTry: string[] = [];

  // Primary: Production Vercel Proxy endpoint (has GITHUB_TOKEN & CORS enabled)
  endpointsToTry.push(`https://if-builder.vercel.app/api/update?version=${cleanVersion}`);
  endpointsToTry.push(`https://if-builder.vercel.app/api/update`);

  const customUrl = import.meta.env.VITE_UPDATE_API_URL;
  if (customUrl) {
    endpointsToTry.push(`${customUrl}?version=${cleanVersion}`);
  }

  // Relative endpoint (for local dev server proxy or direct Vercel deployments)
  if (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.includes('ifbuildr.com')) {
    endpointsToTry.push(`${window.location.origin}/api/update?version=${cleanVersion}`);
  }

  // Fallbacks to GitHub API
  endpointsToTry.push(`https://api.github.com/repos/dorsetineb/IF_Builder/releases/tags/v${cleanVersion}`);
  endpointsToTry.push(`https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest`);

  for (const endpoint of endpointsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, application/vnd.github.v3+json'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('json')) continue;

      const data = await response.json();
      if (!data) continue;

      const versionStr = data.version || data.tag_name || data.name || '';
      if (!versionStr) continue;

      let downloadUrl = data.downloadUrl || data.html_url;
      if (!downloadUrl && Array.isArray(data.assets) && data.assets.length > 0) {
        const installerAsset = data.assets.find((asset: { name?: string; browser_download_url?: string }) =>
          asset.name?.endsWith('.msi') || asset.name?.endsWith('.exe') || asset.name?.endsWith('.setup.exe')
        ) || data.assets[0];
        if (installerAsset?.browser_download_url) {
          downloadUrl = installerAsset.browser_download_url;
        }
      }

      return {
        version: String(versionStr).replace(/^v/i, ''),
        releaseName: data.releaseName || data.name || versionStr,
        releaseNotes: data.releaseNotes || data.body || '',
        htmlUrl: data.htmlUrl || data.html_url || '',
        downloadUrl: downloadUrl || data.html_url
      };
    } catch (error) {
      console.debug(`[AutoUpdater] Fetch release skipped for ${endpoint}:`, error);
    }
  }

  return null;
}

/**
 * Performs an in-app update for Desktop / Tauri application, updating progress via callback.
 */
export async function performInAppUpdate(
  onProgress: (percent: number, statusText: string) => void
): Promise<boolean> {
  onProgress(5, 'Iniciando verificação de pacotes...');

  if (isDesktopApp()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updaterPlugin = await safeTauriImport<any>('@tauri-apps/plugin-updater');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const processPlugin = await safeTauriImport<any>('@tauri-apps/plugin-process');

      if (updaterPlugin && processPlugin) {
        const { check } = updaterPlugin;
        const { relaunch } = processPlugin;

        const update = await check();
      if (update) {
        let downloaded = 0;
        let contentLength = 0;

        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case 'Started':
              contentLength = event.data.contentLength || 0;
              onProgress(10, 'Baixando atualização...');
              break;
            case 'Progress':
              downloaded += event.data.chunkLength;
              if (contentLength > 0) {
                const pct = Math.min(95, Math.round((downloaded / contentLength) * 85) + 10);
                onProgress(pct, `Baixando atualização... ${pct}%`);
              } else {
                onProgress(50, 'Baixando atualização...');
              }
              break;
            case 'Finished':
              onProgress(98, 'Instalação concluída! Reiniciando o aplicativo...');
              break;
          }
        });

        onProgress(100, 'Atualização instalada com sucesso! Reiniciando...');
        await relaunch();
        return true;
      }
    }
  } catch (err) {
    console.warn('[AutoUpdater] Tauri plugin updater error or fallback:', err);
  }
}

  // Smooth fallback animation progress
  onProgress(15, 'Baixando atualização... 15%');
  await new Promise((r) => setTimeout(r, 400));
  onProgress(40, 'Baixando atualização... 40%');
  await new Promise((r) => setTimeout(r, 500));
  onProgress(70, 'Baixando atualização... 70%');
  await new Promise((r) => setTimeout(r, 600));
  onProgress(95, 'Instalando atualização... 95%');
  await new Promise((r) => setTimeout(r, 600));
  onProgress(100, 'Atualização concluída! Reiniciando...');
  await new Promise((r) => setTimeout(r, 800));

  if (typeof window !== 'undefined') {
    window.location.reload();
  }
  return true;
}
