/**
 * Text Formatting Utilities Tests - Behavior-Based
 *
 * Tests focusing on text formatting utility behavior
 */

import { describe, test, expect } from 'vitest';
import type { BasicHealthStatus, FullHealthStatus, PingResponse } from '@/server/api/types/health';
import {
  formatBasicHealthStatusAsText,
  formatFullHealthStatusAsText,
  formatPingResponseAsText,
  formatAsJsonString,
} from '@/server/api/utils/text-formatting';

describe('src/server/api/utils/text-formatting.ts', () => {
  describe('Basic Health Status Formatting', () => {
    test('should format basic health status as readable text', () => {
      const healthStatus: BasicHealthStatus = {
        status: 'ok',
        timestamp: '2023-06-21T12:00:00.000Z',
        uptime: 12345.678,
      };

      const formatted = formatBasicHealthStatusAsText(healthStatus);

      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('Status: ok');
      expect(formatted).toContain('Uptime: 12345.678s');
      expect(formatted).toContain('Timestamp: 2023-06-21T12:00:00.000Z');
    });

    test('should handle different status values', () => {
      const statusValues = ['ok', 'error'] as const;

      statusValues.forEach((status) => {
        const healthStatus: BasicHealthStatus = {
          status,
          timestamp: '2023-06-21T12:00:00.000Z',
          uptime: 1000,
        };

        const formatted = formatBasicHealthStatusAsText(healthStatus);

        expect(formatted).toContain(`Status: ${status}`);
        expect(formatted).toContain('Uptime: 1000s');
        expect(formatted).toContain('Timestamp: 2023-06-21T12:00:00.000Z');
      });
    });

    test('should handle various uptime values', () => {
      const uptimeValues = [0, 0.123, 123.456, 999999.999];

      uptimeValues.forEach((uptime) => {
        const healthStatus: BasicHealthStatus = {
          status: 'ok',
          timestamp: '2023-06-21T12:00:00.000Z',
          uptime,
        };

        const formatted = formatBasicHealthStatusAsText(healthStatus);

        expect(formatted).toContain(`Uptime: ${uptime}s`);
      });
    });

    test('should provide readable text format with essential information', () => {
      const healthStatus: BasicHealthStatus = {
        status: 'ok',
        timestamp: '2023-06-21T12:00:00.000Z',
        uptime: 100,
      };

      const formatted = formatBasicHealthStatusAsText(healthStatus);

      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);

      expect(formatted).toContain('Status');
      expect(formatted).toContain('ok');
      expect(formatted).toContain('Uptime');
      expect(formatted).toContain('100');
      expect(formatted).toContain('Timestamp');
    });
  });

  describe('Full Health Status Formatting', () => {
    test('should format full health status with all optional fields', () => {
      const fullHealthStatus: FullHealthStatus = {
        status: 'ok',
        timestamp: '2023-06-21T12:00:00.000Z',
        uptime: 12345.678,
        version: 'v18.16.0',
        environment: 'production',
        memory: {
          used: 50000000,
          total: 100000000,
          percentage: 50,
        },
      };

      const formatted = formatFullHealthStatusAsText(fullHealthStatus);

      expect(formatted).toContain('Status: ok');
      expect(formatted).toContain('Uptime: 12345.678s');
      expect(formatted).toContain('Timestamp: 2023-06-21T12:00:00.000Z');

      expect(formatted).toContain('Version: v18.16.0');
      expect(formatted).toContain('Environment: production');
      expect(formatted).toContain('Memory: 50000000/100000000 bytes (50%)');
    });

    test('should handle partial optional fields', () => {
      const testCases = [
        {
          name: 'version only',
          status: {
            status: 'ok' as const,
            timestamp: '2023-06-21T12:00:00.000Z',
            uptime: 100,
            version: 'v18.16.0',
          },
          expectedContent: ['Version: v18.16.0'],
          notExpectedContent: ['Environment:', 'Memory:'],
        },
        {
          name: 'environment only',
          status: {
            status: 'ok' as const,
            timestamp: '2023-06-21T12:00:00.000Z',
            uptime: 100,
            environment: 'development',
          },
          expectedContent: ['Environment: development'],
          notExpectedContent: ['Version:', 'Memory:'],
        },
        {
          name: 'memory only',
          status: {
            status: 'ok' as const,
            timestamp: '2023-06-21T12:00:00.000Z',
            uptime: 100,
            memory: { used: 1000, total: 2000, percentage: 50 },
          },
          expectedContent: ['Memory: 1000/2000 bytes (50%)'],
          notExpectedContent: ['Version:', 'Environment:'],
        },
      ];

      testCases.forEach(({ status, expectedContent, notExpectedContent }) => {
        const formatted = formatFullHealthStatusAsText(status);

        expectedContent.forEach((content) => {
          expect(formatted).toContain(content);
        });

        notExpectedContent.forEach((content) => {
          expect(formatted).not.toContain(content);
        });
      });
    });

    test('should maintain basic structure when no optional fields provided', () => {
      const basicStatus: FullHealthStatus = {
        status: 'ok',
        timestamp: '2023-06-21T12:00:00.000Z',
        uptime: 100,
      };

      const formatted = formatFullHealthStatusAsText(basicStatus);
      const basicFormatted = formatBasicHealthStatusAsText(basicStatus);

      expect(formatted).toBe(basicFormatted);
    });

    test('should handle various memory usage values', () => {
      const memoryValues = [
        { used: 0, total: 1000, percentage: 0 },
        { used: 500, total: 1000, percentage: 50 },
        { used: 1000, total: 1000, percentage: 100 },
        { used: 1234567890, total: 2000000000, percentage: 62 },
      ];

      memoryValues.forEach((memory) => {
        const fullStatus: FullHealthStatus = {
          status: 'ok',
          timestamp: '2023-06-21T12:00:00.000Z',
          uptime: 100,
          memory,
        };

        const formatted = formatFullHealthStatusAsText(fullStatus);

        expect(formatted).toContain(`Memory: ${memory.used}/${memory.total} bytes (${memory.percentage}%)`);
      });
    });
  });

  describe('Ping Response Formatting', () => {
    test('should format ping response as readable text', () => {
      const pingResponse: PingResponse = {
        message: 'pong',
        timestamp: '2023-06-21T12:00:00.000Z',
        service: 'hono-api',
      };

      const formatted = formatPingResponseAsText(pingResponse);

      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('pong');
      expect(formatted).toContain('hono-api');
      expect(formatted).toContain('2023-06-21T12:00:00.000Z');
    });

    test('should maintain consistent ping format structure', () => {
      const pingResponse: PingResponse = {
        message: 'pong',
        timestamp: '2023-06-21T12:00:00.000Z',
        service: 'test-service',
      };

      const formatted = formatPingResponseAsText(pingResponse);

      expect(formatted).toBe('pong - test-service - 2023-06-21T12:00:00.000Z');
    });

    test('should handle various ping response values', () => {
      const testCases = [
        {
          message: 'pong',
          service: 'api-server',
          timestamp: '2023-01-01T00:00:00.000Z',
        },
        {
          message: 'alive',
          service: 'health-checker',
          timestamp: '2023-12-31T23:59:59.999Z',
        },
        {
          message: 'ok',
          service: 'microservice-1',
          timestamp: '2023-06-15T14:30:45.123Z',
        },
      ];

      testCases.forEach((pingData) => {
        const formatted = formatPingResponseAsText(pingData);

        expect(formatted).toContain(pingData.message);
        expect(formatted).toContain(pingData.service);
        expect(formatted).toContain(pingData.timestamp);

        const expectedFormat = `${pingData.message} - ${pingData.service} - ${pingData.timestamp}`;
        expect(formatted).toBe(expectedFormat);
      });
    });
  });

  describe('JSON String Formatting', () => {
    test('should format objects as pretty JSON string', () => {
      const testObject = {
        name: 'test',
        value: 123,
        nested: {
          array: [1, 2, 3],
          boolean: true,
        },
      };

      const formatted = formatAsJsonString(testObject);

      expect(typeof formatted).toBe('string');
      expect(() => JSON.parse(formatted)).not.toThrow();

      const parsed = JSON.parse(formatted);
      expect(parsed).toEqual(testObject);

      expect(formatted).toContain('\n');
    });

    test('should handle various data types in JSON formatting', () => {
      const testCases = [
        { name: 'string', data: 'test string' },
        { name: 'number', data: 42 },
        { name: 'boolean', data: true },
        { name: 'null', data: null },
        { name: 'array', data: [1, 'two', true, null] },
        { name: 'object', data: { key: 'value', nested: { deep: 'data' } } },
      ];

      testCases.forEach(({ data }) => {
        const formatted = formatAsJsonString(data);

        expect(typeof formatted).toBe('string');
        expect(() => JSON.parse(formatted)).not.toThrow();

        const parsed = JSON.parse(formatted);
        expect(parsed).toEqual(data);
      });
    });

    test('should support custom indentation', () => {
      const testObject = { key: 'value', nested: { data: 'test' } };

      const indentations = [0, 1, 2, 4, 8];

      indentations.forEach((indentation) => {
        const formatted = formatAsJsonString(testObject, indentation);

        expect(typeof formatted).toBe('string');
        expect(() => JSON.parse(formatted)).not.toThrow();

        const parsed = JSON.parse(formatted);
        expect(parsed).toEqual(testObject);

        const hasNewlines = formatted.includes('\n');

        expect(hasNewlines).toBe(indentation > 0);

        const expectedIndent = ' '.repeat(indentation);
        const hasExpectedIndent = indentation === 0 || formatted.includes(expectedIndent);
        expect(hasExpectedIndent).toBe(true);
      });
    });

    test('should handle complex nested structures', () => {
      const complexObject = {
        users: [
          {
            id: 1,
            profile: {
              name: 'John',
              preferences: {
                theme: 'dark',
                notifications: {
                  email: true,
                  push: false,
                },
              },
            },
          },
          {
            id: 2,
            profile: {
              name: 'Jane',
              preferences: {
                theme: 'light',
                notifications: {
                  email: false,
                  push: true,
                },
              },
            },
          },
        ],
        metadata: {
          created: '2023-06-21T12:00:00.000Z',
          version: '1.0.0',
        },
      };

      const formatted = formatAsJsonString(complexObject);

      expect(typeof formatted).toBe('string');
      expect(() => JSON.parse(formatted)).not.toThrow();

      const parsed = JSON.parse(formatted);
      expect(parsed).toEqual(complexObject);
      expect(parsed.users).toHaveLength(2);
      expect(parsed.users[0].profile.preferences.notifications.email).toBe(true);
    });

    test('should provide consistent formatting across multiple calls', () => {
      const testObject = { key: 'value', number: 123 };

      const formatted1 = formatAsJsonString(testObject);
      const formatted2 = formatAsJsonString(testObject);

      expect(formatted1).toBe(formatted2);
      expect(typeof formatted1).toBe('string');
      expect(typeof formatted2).toBe('string');

      const parsed1 = JSON.parse(formatted1);
      const parsed2 = JSON.parse(formatted2);

      expect(parsed1).toEqual(testObject);
      expect(parsed2).toEqual(testObject);
      expect(parsed1).toEqual(parsed2);
    });
  });

  describe('Text Formatting Integration', () => {
    test('should maintain character encoding consistency', () => {
      const healthStatus: BasicHealthStatus = {
        status: 'ok',
        timestamp: '2023-06-21T12:00:00.000Z',
        uptime: 100,
      };

      const formatted = formatBasicHealthStatusAsText(healthStatus);

      expect(formatted).not.toContain('undefined');
      expect(formatted).not.toContain('[object Object]');
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

    test('should handle edge cases gracefully', () => {
      const edgeCases = [
        {
          name: 'zero uptime',
          status: { status: 'ok' as const, timestamp: '2023-06-21T12:00:00.000Z', uptime: 0 },
        },
        {
          name: 'very large uptime',
          status: { status: 'ok' as const, timestamp: '2023-06-21T12:00:00.000Z', uptime: 999999.999 },
        },
        {
          name: 'error status',
          status: { status: 'error' as const, timestamp: '2023-06-21T12:00:00.000Z', uptime: 100 },
        },
      ];

      edgeCases.forEach(({ status }) => {
        const formatted = formatBasicHealthStatusAsText(status);

        expect(typeof formatted).toBe('string');
        expect(formatted.length).toBeGreaterThan(0);
        expect(formatted).toContain(`Status: ${status.status}`);
        expect(formatted).toContain(`Uptime: ${status.uptime}s`);
        expect(formatted).toContain(`Timestamp: ${status.timestamp}`);
      });
    });

    test('should provide readable output for monitoring tools', () => {
      const fullStatus: FullHealthStatus = {
        status: 'ok',
        timestamp: '2023-06-21T12:00:00.000Z',
        uptime: 3661.5, // 1 hour, 1 minute, 1.5 seconds
        version: 'v18.16.0',
        environment: 'production',
        memory: {
          used: 52428800, // 50MB
          total: 134217728, // 128MB
          percentage: 39,
        },
      };

      const formatted = formatFullHealthStatusAsText(fullStatus);

      expect(formatted).toContain('Status: ok');
      expect(formatted).toContain('Uptime: 3661.5s');
      expect(formatted).toContain('Version: v18.16.0');
      expect(formatted).toContain('Environment: production');
      expect(formatted).toContain('Memory: 52428800/134217728 bytes (39%)');

      const lines = formatted.split('\n');
      expect(lines.length).toBeGreaterThan(3);
      expect(lines.every((line) => line.trim().length > 0)).toBe(true);
    });
  });
});
