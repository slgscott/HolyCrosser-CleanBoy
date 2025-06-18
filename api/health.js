// Holy Crosser v2.9.2 - Domain deployment release
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.9.2',
    environment: 'production',
    deploymentId: `${Date.now()}-v292`
  });
}