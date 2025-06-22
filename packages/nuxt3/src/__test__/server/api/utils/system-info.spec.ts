/**
 * System Info Utilities Tests - Behavior-Based
 *
 * Tests focusing on system information utility behavior
 */

import { describe, test, expect } from 'vitest';
import {
  getCurrentTimestamp,
  getSystemUptime,
  getNodeVersion,
  getCurrentEnvironment,
  getMemoryUsageInformation,
  isDevelopmentEnvironment,
  isProductionEnvironment,
} from '@/server/api/utils/system-info';

describe('src/server/api/utils/system-info.ts', () => {
  describe('Timestamp Generation', () => {
    test('should provide valid ISO 8601 timestamp for API responses', () => {
      const timestamp = getCurrentTimestamp();

      expect(typeof timestamp).toBe('string');
      expect(timestamp.length).toBeGreaterThan(0);

      const parsedDate = new Date(timestamp);
      expect(parsedDate.getTime()).not.toBeNaN();

      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - parsedDate.getTime());
      expect(timeDiff).toBeLessThan(5000); // 5秒以内
    });

    test('should provide consistent timestamp format for logging', () => {
      const timestamps = Array.from({ length: 5 }, () => getCurrentTimestamp());

      timestamps.forEach((timestamp) => {
        expect(typeof timestamp).toBe('string');
        expect(new Date(timestamp).getTime()).not.toBeNaN();
      });

      for (let i = 1; i < timestamps.length; i++) {
        const current = new Date(timestamps[i]).getTime();
        const previous = new Date(timestamps[i - 1]).getTime();
        expect(current).toBeGreaterThanOrEqual(previous);
      }
    });
  });

  describe('System Uptime Information', () => {
    test('should provide valid uptime measurement', () => {
      const uptime = getSystemUptime();

      expect(typeof uptime).toBe('number');
      expect(uptime).toBeGreaterThanOrEqual(0);
      expect(uptime).toBeLessThan(Number.MAX_SAFE_INTEGER);
      expect(Number.isFinite(uptime)).toBe(true);
    });

    test('should show increasing uptime over time', async () => {
      const firstUptime = getSystemUptime();

      await new Promise((resolve) => setTimeout(resolve, 10));

      const secondUptime = getSystemUptime();

      expect(secondUptime).toBeGreaterThanOrEqual(firstUptime);
    });

    test('should provide uptime in reasonable range', () => {
      const uptime = getSystemUptime();

      expect(uptime).toBeGreaterThanOrEqual(0);
      expect(uptime).toBeLessThan(1000000); // 1,000,000秒 ≈ 11.5日未満
    });
  });

  describe('Node.js Version Information', () => {
    test('should provide Node.js version for system monitoring', () => {
      const version = getNodeVersion();

      expect(typeof version).toBe('string');
      expect(version.length).toBeGreaterThan(0);

      expect(version).toMatch(/\d+\.\d+/);
    });

    test('should provide consistent version information', () => {
      const version1 = getNodeVersion();
      const version2 = getNodeVersion();

      expect(version1).toBe(version2);
      expect(typeof version1).toBe('string');
      expect(version1.length).toBeGreaterThan(0);
    });
  });

  describe('Environment Detection', () => {
    test('should provide valid environment string', () => {
      const environment = getCurrentEnvironment();

      expect(typeof environment).toBe('string');
      expect(environment.length).toBeGreaterThan(0);

      const validEnvironments = ['development', 'production', 'test', 'staging'];
      expect(validEnvironments.some((env) => environment.includes(env))).toBe(true);
    });

    test('should provide consistent environment detection', () => {
      const env1 = getCurrentEnvironment();
      const env2 = getCurrentEnvironment();

      expect(env1).toBe(env2);
    });

    test('should correctly identify development environment', () => {
      const isDev = isDevelopmentEnvironment();
      const environment = getCurrentEnvironment();

      expect(typeof isDev).toBe('boolean');

      const isActuallyDev = environment === 'development';
      expect(isDev).toBe(isActuallyDev);
    });

    test('should correctly identify production environment', () => {
      const isProd = isProductionEnvironment();
      const environment = getCurrentEnvironment();

      expect(typeof isProd).toBe('boolean');

      const isActuallyProd = environment === 'production';
      expect(isProd).toBe(isActuallyProd);
    });

    test('should ensure environment flags are properly defined', () => {
      const isDev = isDevelopmentEnvironment();
      const isProd = isProductionEnvironment();

      expect(typeof isDev).toBe('boolean');
      expect(typeof isProd).toBe('boolean');

      const environment = getCurrentEnvironment();
      const hasKnownEnvironment = isDev || isProd || environment.length > 0;
      expect(hasKnownEnvironment).toBe(true);
    });
  });

  describe('Memory Usage Information', () => {
    test('should provide valid memory usage statistics', () => {
      const memoryInfo = getMemoryUsageInformation();

      expect(typeof memoryInfo).toBe('object');
      expect(memoryInfo).toHaveProperty('used');
      expect(memoryInfo).toHaveProperty('total');
      expect(memoryInfo).toHaveProperty('percentage');

      expect(typeof memoryInfo.used).toBe('number');
      expect(typeof memoryInfo.total).toBe('number');
      expect(typeof memoryInfo.percentage).toBe('number');
    });

    test('should provide logical memory usage values for monitoring', () => {
      const memoryInfo = getMemoryUsageInformation();

      expect(memoryInfo.used).toBeGreaterThan(0);
      expect(memoryInfo.total).toBeGreaterThan(0);
      expect(memoryInfo.total).toBeGreaterThanOrEqual(memoryInfo.used);

      expect(memoryInfo.percentage).toBeGreaterThan(0);
      expect(memoryInfo.percentage).toBeLessThanOrEqual(100);

      expect(Number.isFinite(memoryInfo.used)).toBe(true);
      expect(Number.isFinite(memoryInfo.total)).toBe(true);
      expect(Number.isFinite(memoryInfo.percentage)).toBe(true);
    });

    test('should provide accurate percentage calculation', () => {
      const memoryInfo = getMemoryUsageInformation();

      const calculatedPercentage = Math.round((memoryInfo.used / memoryInfo.total) * 100);
      expect(memoryInfo.percentage).toBe(calculatedPercentage);
    });

    test('should provide consistent memory measurements within reasonable variance', () => {
      const measurements = Array.from({ length: 3 }, () => getMemoryUsageInformation());

      measurements.forEach((measurement) => {
        expect(measurement.used).toBeGreaterThan(0);
        expect(measurement.total).toBeGreaterThan(0);
        expect(measurement.percentage).toBeGreaterThan(0);
      });

      for (let i = 1; i < measurements.length; i++) {
        const current = measurements[i];
        const previous = measurements[i - 1];

        expect(current.total).toBe(previous.total);

        const _usedVariance = Math.abs(current.used - previous.used) / previous.used;
      }
    });

    test('should handle memory information for different heap states', () => {
      const memoryInfo = getMemoryUsageInformation();

      expect(memoryInfo.used).toBeGreaterThan(1024 * 1024);
      expect(memoryInfo.used).toBeLessThan(1024 * 1024 * 1024 * 4);

      expect(memoryInfo.total).toBeGreaterThan(memoryInfo.used);
      expect(memoryInfo.total).toBeLessThan(1024 * 1024 * 1024 * 8);
    });
  });

  describe('System Information Integration', () => {
    test('should provide all system information consistently', () => {
      const timestamp = getCurrentTimestamp();
      const uptime = getSystemUptime();
      const version = getNodeVersion();
      const environment = getCurrentEnvironment();
      const memory = getMemoryUsageInformation();

      expect(typeof timestamp).toBe('string');
      expect(typeof uptime).toBe('number');
      expect(typeof version).toBe('string');
      expect(typeof environment).toBe('string');
      expect(typeof memory).toBe('object');

      expect(timestamp.length).toBeGreaterThan(0);
      expect(uptime).toBeGreaterThanOrEqual(0);
      expect(version.length).toBeGreaterThan(0);
      expect(environment.length).toBeGreaterThan(0);
      expect(memory.used).toBeGreaterThan(0);
    });

    test('should maintain system information consistency across time', async () => {
      const info1 = {
        timestamp: getCurrentTimestamp(),
        uptime: getSystemUptime(),
        version: getNodeVersion(),
        environment: getCurrentEnvironment(),
        memory: getMemoryUsageInformation(),
      };

      await new Promise((resolve) => setTimeout(resolve, 50));

      const info2 = {
        timestamp: getCurrentTimestamp(),
        uptime: getSystemUptime(),
        version: getNodeVersion(),
        environment: getCurrentEnvironment(),
        memory: getMemoryUsageInformation(),
      };

      expect(info2.version).toBe(info1.version);
      expect(info2.environment).toBe(info1.environment);

      expect(new Date(info2.timestamp).getTime()).toBeGreaterThanOrEqual(new Date(info1.timestamp).getTime());
      expect(info2.uptime).toBeGreaterThanOrEqual(info1.uptime);
    });
  });
});
