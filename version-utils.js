// Central version management - single source of truth
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Reads version from VERSION file - the ONLY source of truth
 * Never hardcode version numbers anywhere else in the codebase
 */
export function getAppVersion() {
  try {
    const versionFile = join(process.cwd(), 'VERSION');
    const version = readFileSync(versionFile, 'utf8').trim();
    if (!version) {
      throw new Error('VERSION file is empty');
    }
    return version;
  } catch (error) {
    console.error('Failed to read VERSION file:', error.message);
    return 'Unknown';
  }
}

/**
 * Creates consistent health response object
 */
export function createHealthResponse(additionalFields = {}) {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: getAppVersion(),
    environment: process.env.NODE_ENV || 'production',
    ...additionalFields
  };
}