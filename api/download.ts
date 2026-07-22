export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const platform = (req.query?.platform || 'windows').toLowerCase();
  const githubToken = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'IFBuilder-Downloader'
  };

  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
  }

  try {
    const response = await fetch('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest', {
      headers
    });

    if (!response.ok) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(response.status).send(JSON.stringify({ error: 'Failed to fetch release from GitHub' }));
    }

    const data = await response.json();
    const assets = data.assets || [];

    let targetAsset: any = null;

    if (platform === 'linux') {
      targetAsset = assets.find((asset: any) =>
        asset.name?.endsWith('.AppImage') ||
        asset.name?.endsWith('.deb') ||
        asset.name?.endsWith('.tar.gz')
      );
    } else {
      // Default to windows
      targetAsset = assets.find((asset: any) =>
        asset.name?.endsWith('.msi') ||
        asset.name?.endsWith('.exe') ||
        asset.name?.endsWith('.setup.exe')
      );
    }

    // Fallback to first asset if platform specific asset not explicitly matched
    if (!targetAsset && assets.length > 0) {
      targetAsset = assets[0];
    }

    if (!targetAsset || !targetAsset.url) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).send(JSON.stringify({ error: 'No installer asset found in release' }));
    }

    // Fetch the asset binary directly from GitHub API using octet-stream for private repositories
    const assetHeaders: Record<string, string> = {
      'Accept': 'application/octet-stream',
      'User-Agent': 'IFBuilder-Downloader'
    };

    if (githubToken) {
      assetHeaders['Authorization'] = `Bearer ${githubToken}`;
    }

    const fileRes = await fetch(targetAsset.url, {
      headers: assetHeaders,
      redirect: 'follow'
    });

    if (!fileRes.ok) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(fileRes.status).send(JSON.stringify({ error: `Failed to fetch asset binary from GitHub API (${fileRes.status})` }));
    }

    const contentType = fileRes.headers.get('content-type') || 'application/octet-stream';
    const contentLength = fileRes.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${targetAsset.name}"`);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('[Download API Error]:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).send(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = handler;
}
