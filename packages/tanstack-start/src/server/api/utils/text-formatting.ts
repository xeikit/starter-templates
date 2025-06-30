/**
 * Text Formatting Utilities
 *
 * Helper functions for formatting responses in different formats.
 */

import type { BasicHealthStatus, FullHealthStatus, PingResponse } from '../types/health';

/**
 * Format basic health status as text
 */
export function formatBasicHealthStatusAsText(healthStatus: BasicHealthStatus): string {
  return `Status: ${healthStatus.status}\nUptime: ${healthStatus.uptime}s\nTimestamp: ${healthStatus.timestamp}`;
}

/**
 * Format full health status as text
 */
export function formatFullHealthStatusAsText(healthStatus: FullHealthStatus): string {
  let textResponse = formatBasicHealthStatusAsText(healthStatus);

  if (healthStatus.version) {
    textResponse += `\nVersion: ${healthStatus.version}`;
  }

  if (healthStatus.environment) {
    textResponse += `\nEnvironment: ${healthStatus.environment}`;
  }

  if (healthStatus.memory) {
    textResponse += `\nMemory: ${healthStatus.memory.used}/${healthStatus.memory.total} bytes (${healthStatus.memory.percentage}%)`;
  }

  return textResponse;
}

/**
 * Format ping response as text
 */
export function formatPingResponseAsText(pingResponse: PingResponse): string {
  return `${pingResponse.message} - ${pingResponse.service} - ${pingResponse.timestamp}`;
}

/**
 * Format any object as pretty JSON string
 */
export function formatAsJsonString(data: unknown, indentation = 2): string {
  return JSON.stringify(data, null, indentation);
}

/**
 * Format bytes in human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration in human readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }

  return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimalPlaces = 1): string {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
}
