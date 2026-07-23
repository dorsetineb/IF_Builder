import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const platform = ((req.query?.platform as string) || 'windows').toLowerCase();
  const githubToken = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'IFBuilder-Downloader'
  };

  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
  }

  try {
    const ghResponse = await fetch('https://api.github.com/repos/dorsetineb/IF_Builder/releases/latest', {
      headers
    });

    if (!ghResponse.ok) {
      return res.status(ghResponse.status).json({ error: 'Failed to fetch release from GitHub' });
    }

    const data = await ghResponse.json();
    const assets = data.assets || [];

    let targetAsset: any = null;

    if (data.assets && Array.isArray(data.assets)) {
      if (platform === 'linux') {
        targetAsset = assets.find((asset: any) => asset.name?.endsWith('.deb'));
      } else {
        targetAsset = assets.find((asset: any) =>
          asset.name?.endsWith('.msi') ||
          asset.name?.endsWith('.exe') ||
          asset.name?.endsWith('.setup.exe')
        );
      }
      if (!targetAsset && assets.length > 0 && platform !== 'linux') {
        targetAsset = assets[0];
      }
    }

    if (targetAsset && targetAsset.browser_download_url) {
      return res.redirect(302, targetAsset.browser_download_url);
    }

    const tag = data.tag_name || 'latest';
    const fallbackFileName = platform === 'linux' ? `IFBuilder_${tag.replace(/^v/i, '')}_amd64.deb` : `IFBuilder_${tag.replace(/^v/i, '')}_x64-setup.exe`;
    return res.redirect(302, `https://github.com/dorsetineb/IF_Builder/releases/download/${tag}/${fallbackFileName}`);
  } catch (error: any) {
    console.error('[Download API Error]:', error?.message || error);
    return res.redirect(302, 'https://github.com/dorsetineb/IF_Builder/releases/latest');
  }
}
