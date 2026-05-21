/**
 * Service to handle project export logic, specifically asset processing.
 */

export const processAsset = (
  base64String: string | undefined,
  baseName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assetsFolder: any,
  assetMap: Map<string, string>
): string | undefined => {
  if (!base64String) return undefined;
  
  // Case 1: Remote URLs or already exported paths
  if (!base64String.startsWith('data:')) {
    // If it's a URL, we still deduplicate by the URL string itself
    if (assetMap.has(base64String)) {
      return assetMap.get(base64String);
    }
    // Note: We don't download remote URLs here as that would be async,
    // they are kept as references or handled by the caller.
    return base64String;
  }

  // Case 2: Data URIs (Base64)
  const commaIndex = base64String.indexOf(',');
  if (commaIndex === -1) return base64String;

  const header = base64String.substring(0, commaIndex);
  // Normalize the data part (trimming prevents duplicate files for the same asset with different whitespace)
  const data = base64String.substring(commaIndex + 1).trim();

  // CONTENT-BASED DEDUPLICATION
  // We use the raw data string as the key to ensure that identical assets 
  // (e.g. the same 5MB music file used in two places) are exported only once.
  if (assetMap.has(data)) {
    return assetMap.get(data);
  }

  const mimeMatch = header.match(/data:([^;]+)/);
  if (!mimeMatch || !mimeMatch[1]) return base64String;

  const mimeType = mimeMatch[1];
  const extension = mimeType.split('/')[1]?.split('+')[0] || 'bin';

  const filename = `assets/${baseName}.${extension}`;
  
  // Add file to ZIP
  assetsFolder.file(`${baseName}.${extension}`, data, { base64: true });
  
  // Map the normalized data to the new filename
  assetMap.set(data, filename);
  
  return filename;
};
