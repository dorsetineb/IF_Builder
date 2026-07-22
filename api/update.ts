export default async function handler(req: any, res: any) {
  // Configurar cabeçalhos CORS para permitir chamadas do app desktop Tauri e Web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const requestedVersion = (req.query?.version || req.query?.tag || '').toString().replace(/^v/i, '').trim();
  const githubToken = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'IFBuilder-AutoUpdater'
  };

  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
  }

  try {
    let response: any = null;

    if (requestedVersion) {
      response = await fetch(`https://api.github.com/repos/dorsetineb/IF_Builder/releases/tags/v${requestedVersion}`, { headers });
      if (!response.ok) {
        response = await fetch(`https://api.github.com/repos/dorsetineb/IF_Builder/releases/tags/${requestedVersion}`, { headers });
      }
    }

    if (!response || !response.ok) {
      response = await fetch('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest', { headers });
    }

    if (!response.ok) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(response.status).send(JSON.stringify({ error: 'Failed to fetch release from GitHub' }));
    }

    const data = await response.json();
    const latestTag = data.tag_name || data.name || '';

    let downloadUrl = data.html_url;
    if (Array.isArray(data.assets) && data.assets.length > 0) {
      const installerAsset = data.assets.find((asset: any) =>
        asset.name?.endsWith('.msi') || asset.name?.endsWith('.exe') || asset.name?.endsWith('.setup.exe')
      ) || data.assets[0];
      if (installerAsset?.browser_download_url) {
        downloadUrl = installerAsset.browser_download_url;
      }
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({
      version: latestTag.replace(/^v/i, ''),
      releaseName: data.name || latestTag,
      releaseNotes: data.body || '',
      htmlUrl: data.html_url,
      downloadUrl
    }));
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).send(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = handler;
}
