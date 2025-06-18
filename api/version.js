import { readFileSync } from 'fs';
import { join } from 'path';

// Read version dynamically from VERSION file
function getAppVersion() {
  try {
    return readFileSync(join(process.cwd(), 'VERSION'), 'utf8').trim();
  } catch {
    return 'Unknown';
  }
}

// Dynamic version endpoint - reads from VERSION file
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: getAppVersion(),
    environment: 'production',
    cacheBuster: Date.now()
  });
}