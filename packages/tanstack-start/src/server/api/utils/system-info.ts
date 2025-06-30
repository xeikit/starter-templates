/**
 * System Information Utilities
 *
 * Helper functions for gathering system and process information.
 */

import type { MemoryUsage } from '../types/health';

/**
 * Get current system uptime in seconds
 */
export function getSystemUptime(): number {
  return process.uptime();
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Get Node.js version
 */
export function getNodeVersion(): string {
  return process.version;
}

/**
 * Get current environment
 */
export function getCurrentEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Get memory usage information
 */
export function getMemoryUsageInformation(): MemoryUsage {
  const memoryUsage = process.memoryUsage();

  return {
    used: memoryUsage.heapUsed,
    total: memoryUsage.heapTotal,
    percentage: memoryUsage.heapTotal > 0 ? Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100) : 0,
  };
}

/**
 * Check if the application is running in development mode
 */
export function isDevelopmentEnvironment(): boolean {
  return getCurrentEnvironment() === 'development';
}

/**
 * Check if the application is running in production mode
 */
export function isProductionEnvironment(): boolean {
  return getCurrentEnvironment() === 'production';
}

/**
 * Get comprehensive system information
 */
export function getSystemInfo(): {
  nodeVersion: string;
  platform: string;
  arch: string;
  environment: string;
  uptime: number;
} {
  return {
    nodeVersion: getNodeVersion(),
    platform: process.platform,
    arch: process.arch,
    environment: getCurrentEnvironment(),
    uptime: getSystemUptime(),
  };
}

/**
 * Get memory information (alias for getMemoryUsageInformation)
 */
export function getMemoryInfo(): MemoryUsage {
  return getMemoryUsageInformation();
}
