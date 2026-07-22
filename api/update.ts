import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const requestedVersion = (
    (req.query?.version as string) || (req.query?.tag as string) || ''
  ).replace(/^v/i, '').trim();

  const githubToken = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'IFBuilder-AutoUpdater'
  };

  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
  }

  try {
    let ghResponse: Response | null = null;

    if (requestedVersion) {
      ghResponse = await fetch(
        `https://api.github.com/repos/dorsetineb/IF_Builder/releases/tags/v${requestedVersion}`,
        { headers }
      );
      if (!ghResponse.ok) {
        ghResponse = await fetch(
          `https://api.github.com/repos/dorsetineb/IF_Builder/releases/tags/${requestedVersion}`,
          { headers }
        );
      }
    }

    if (!ghResponse || !ghResponse.ok) {
      ghResponse = await fetch(
        'https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest',
        { headers }
      );
    }

    if (!ghResponse.ok) {
      return res.status(ghResponse.status).json({
        error: 'Failed to fetch release from GitHub',
        status: ghResponse.status
      });
    }

    const data = await ghResponse.json();
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

    return res.status(200).json({
      version: latestTag.replace(/^v/i, ''),
      releaseName: data.name || latestTag,
      releaseNotes: data.body || '',
      htmlUrl: data.html_url,
      downloadUrl
    });
  } catch (error: any) {
    console.error('[Update API Error]:', error?.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
