/**
 * Checks whether the application is running inside a desktop environment (Tauri).
 */
export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
}
