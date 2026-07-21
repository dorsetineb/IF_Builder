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

  if (typeof window !== 'undefined' && window.location?.origin) {
    endpointsToTry.push(`${window.location.origin}/api/update`);
  }

  endpointsToTry.push('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest');

  for (const endpoint of endpointsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

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
export async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return null;
  }

  const customUrl = import.meta.env.VITE_UPDATE_API_URL;
  const endpointsToTry: string[] = [];

  if (customUrl) {
    endpointsToTry.push(customUrl);
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    endpointsToTry.push(`${window.location.origin}/api/update`);
  }

  endpointsToTry.push('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest');

  for (const endpoint of endpointsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

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
