// Force version 2.9.1 bypass cache
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.9.1',
    environment: 'production',
    cacheBuster: Date.now()
  });
}