/**
 * Service to handle project export logic, specifically asset processing.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processAsset = (
  base64String: string | undefined,
  baseName: string,
  assetsFolder: any,
  assetMap: Map<string, string>
): string | undefined => {
  if (!base64String || !base64String.startsWith('data:')) return base64String;
  if (assetMap.has(base64String)) return assetMap.get(base64String);

  const commaIndex = base64String.indexOf(',');
  if (commaIndex === -1) return base64String;

  const header = base64String.substring(0, commaIndex);
  const data = base64String.substring(commaIndex + 1);

  const mimeMatch = header.match(/data:([^;]+)/);
  if (!mimeMatch || !mimeMatch[1]) return base64String;

  const mimeType = mimeMatch[1];
  const extension = mimeType.split('/')[1]?.split('+')[0] || 'bin';

  const filename = `assets/${baseName}.${extension}`;
  assetsFolder.file(`${baseName}.${extension}`, data, { base64: true });
  assetMap.set(base64String, filename);
  return filename;
};
