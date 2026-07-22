import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    if (platform === 'linux') {
      targetAsset = assets.find((asset: any) =>
        asset.name?.endsWith('.AppImage') ||
        asset.name?.endsWith('.deb') ||
        asset.name?.endsWith('.tar.gz')
      );
    } else {
      targetAsset = assets.find((asset: any) =>
        asset.name?.endsWith('.msi') ||
        asset.name?.endsWith('.exe') ||
        asset.name?.endsWith('.setup.exe')
      );
    }

    if (!targetAsset && assets.length > 0) {
      targetAsset = assets[0];
    }

    if (!targetAsset || !targetAsset.url) {
      return res.status(404).json({ error: 'No installer asset found in release' });
    }

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
      return res.status(fileRes.status).json({
        error: `Failed to fetch asset binary from GitHub API (${fileRes.status})`
      });
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
  } catch (error: any) {
    console.error('[Download API Error]:', error?.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
