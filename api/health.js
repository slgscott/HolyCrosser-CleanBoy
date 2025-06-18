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

// Holy Crosser - Dynamic version from VERSION file
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  const version = getAppVersion();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: version,
    environment: 'production',
    deploymentId: `${Date.now()}-v${version.replace('.', '')}`
  });
}