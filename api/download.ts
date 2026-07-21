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
      return res.status(response.status).json({ error: 'Failed to fetch release from GitHub' });
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

    const downloadUrl = targetAsset?.browser_download_url || data.html_url;

    // Redirect to the direct asset download URL
    return res.redirect(302, downloadUrl);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
