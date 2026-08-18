/**
 * Checks whether the application is running inside a desktop environment (Tauri).
 */
export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
}

/**
 * Safely opens an external URL either via Tauri opener plugin (in Desktop app) or window.open (in Web).
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (isDesktopApp()) {
    try {
      const pluginName = '@tauri-apps/plugin-opener';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const openerPlugin = await import(/* @vite-ignore */ pluginName) as any;
      if (openerPlugin && openerPlugin.openUrl) {
        await openerPlugin.openUrl(url);
        return;
      }
    } catch (e) {
      console.warn('[Platform] Failed to open URL via plugin-opener:', e);
    }
  }
  window.open(url, '_blank');
}
