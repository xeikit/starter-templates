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
export function formatAsJsonString(data: unknown, indentation: number = 2): string {
  return JSON.stringify(data, null, indentation);
}
