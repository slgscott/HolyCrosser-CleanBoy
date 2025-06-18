import { createHealthResponse } from '../version-utils.js';

// Dynamic version endpoint - centralized system
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json(createHealthResponse({
    cacheBuster: Date.now()
  }));
}