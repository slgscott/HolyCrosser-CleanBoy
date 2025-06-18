import { createHealthResponse } from '../version-utils.js';

// Holy Crosser - Dynamic version from centralized system
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json(createHealthResponse({
    deploymentId: `${Date.now()}-deploy`
  }));
}