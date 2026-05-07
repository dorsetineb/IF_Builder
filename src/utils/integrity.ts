/**
 * integrity.ts
 * Generates and verifies a SHA-256 hash of the exported game data to detect
 * unauthorized tampering with distributed HTML/ZIP game files.
 *
 * Strategy:
 * - At export time: hash the serialized game data JSON and embed as a meta tag.
 * - At runtime (in game-engine.ts): re-hash the embedded data and compare.
 * - If the hashes differ, the file was modified after export and a warning is shown.
 *
 * Note: This is tamper DETECTION, not tamper PREVENTION. A determined attacker
 * could recalculate the hash, but this protects against casual/accidental modifications.
 */

const IF_BUILDER_SALT = 'IF_BUILDER_v1_INTEGRITY_SALT_2025';

/**
 * Generates a SHA-256 hex digest of the game data JSON + a known salt.
 * Uses the Web Crypto API (available in all modern browsers and Node 18+).
 */
export const generateIntegrityHash = async (gameDataJson: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(gameDataJson + IF_BUILDER_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Returns the game-engine-side verification script (injected as a <script> block).
 * This runs at page load to verify the hash before the game initializes.
 */
export const getIntegrityVerificationScript = (): string => `
(function() {
    const SALT = '${IF_BUILDER_SALT}';
    const metaTag = document.querySelector('meta[name="if-integrity"]');
    const dataScript = document.getElementById('if-builder-source');
    if (!metaTag || !dataScript) return; // No integrity data — skip check

    const expectedHash = metaTag.getAttribute('content');
    const rawJson = dataScript.textContent || '';

    async function verify() {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(rawJson + SALT);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const actualHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            if (actualHash !== expectedHash) {
                console.warn('[IF Builder] Integrity check failed: file may have been modified.');
                const banner = document.createElement('div');
                banner.id = 'if-integrity-warning';
                banner.style.cssText = [
                    'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
                    'background:#7f1d1d', 'color:#fca5a5', 'font-family:monospace',
                    'font-size:12px', 'padding:8px 16px', 'text-align:center',
                    'border-top:2px solid #ef4444', 'pointer-events:none'
                ].join(';');
                banner.textContent = '⚠ Este arquivo foi modificado após a exportação e pode não ser seguro. Baixe o original no IF Builder.';
                document.body.appendChild(banner);
            }
        } catch (e) {
            // If crypto is unavailable (e.g. non-secure context), skip silently
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', verify);
    } else {
        verify();
    }
})();
`;
