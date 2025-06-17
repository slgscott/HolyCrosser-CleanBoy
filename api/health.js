// Holy Crosser v2.9.1 - Stable release with Harbor Data Manager integration
export default function handler(req, res) {
  // Force no-cache headers to bypass Vercel edge caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Last-Modified', new Date().toUTCString());
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.9.1',
    environment: 'production',
    buildTime: Date.now()
  });
}