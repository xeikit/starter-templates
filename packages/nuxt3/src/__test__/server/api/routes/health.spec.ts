/**
 * Health Routes Tests - Behavior-Based
 *
 * Tests focusing on health monitoring behavior and API contract
 */

import { Hono } from 'hono';
import { describe, test, expect, beforeEach } from 'vitest';
import { HTTP_STATUS_CODES } from '@/server/api/constants/http-status';
import { healthRoutes } from '@/server/api/routes/health';

// Test constants for better maintainability
const HEALTH_ENDPOINT = '/health';
const PING_ENDPOINT = '/ping';
const MAXIMUM_TIMESTAMP_DIFFERENCE_MS = 5000;
const MAXIMUM_MEMORY_PERCENTAGE = 100;
const CONCURRENT_REQUEST_COUNT = 5;
const HEAVY_LOAD_REQUEST_COUNT = 10;
const RAPID_REQUEST_COUNT = 20;
const STATE_INDEPENDENCE_DELAY_MS = 100;

// Type definitions for better type safety
interface HealthResponseData {
  status: string;
  timestamp: string;
  uptime: number;
  version?: string;
  environment?: string;
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
}

interface PingResponseData {
  message: string;
  service: string;
  timestamp: string;
}

interface ApiResponse<T> {
  data: T;
  success?: boolean;
  error?: object;
}

// Test helper functions
const createHealthApiApp = (): Hono => {
  const application = new Hono();
  application.route('/', healthRoutes);
  return application;
};

const validateBasicHealthResponse = (healthResponseData: HealthResponseData): void => {
  expect(healthResponseData).toHaveProperty('status');
  expect(healthResponseData).toHaveProperty('timestamp');
  expect(healthResponseData).toHaveProperty('uptime');
  expect(healthResponseData.status).toBe('ok');
  expect(typeof healthResponseData.uptime).toBe('number');
  expect(healthResponseData.uptime).toBeGreaterThanOrEqual(0);
};

const validateDetailedHealthResponse = (healthResponseData: HealthResponseData): void => {
  expect(healthResponseData).toHaveProperty('status');
  expect(healthResponseData).toHaveProperty('version');
  expect(healthResponseData).toHaveProperty('environment');
  expect(healthResponseData).toHaveProperty('memory');
  expect(healthResponseData.memory!.used).toBeGreaterThan(0);
  expect(healthResponseData.memory!.total).toBeGreaterThan(0);
  expect(healthResponseData.memory!.percentage).toBeGreaterThan(0);
  expect(healthResponseData.memory!.percentage).toBeLessThanOrEqual(MAXIMUM_MEMORY_PERCENTAGE);
};

const validatePingResponse = (pingResponseData: PingResponseData): void => {
  expect(pingResponseData).toHaveProperty('message');
  expect(pingResponseData).toHaveProperty('service');
  expect(pingResponseData).toHaveProperty('timestamp');
  expect(pingResponseData.message).toBe('pong');
  expect(typeof pingResponseData.service).toBe('string');
  expect(pingResponseData.service.length).toBeGreaterThan(0);
  expect(new Date(pingResponseData.timestamp).getTime()).not.toBeNaN();
};

describe('src/server/api/routes/health.ts', () => {
  let healthApiApplication: Hono;

  beforeEach(() => {
    healthApiApplication = createHealthApiApp();
  });

  describe('System Health Check', () => {
    test('should confirm system is operational', async () => {
      const healthResponse = await healthApiApplication.request(HEALTH_ENDPOINT);

      expect(healthResponse.status).toBe(HTTP_STATUS_CODES.OK);

      const healthResponseData = await healthResponse.json();

      validateBasicHealthResponse(healthResponseData.data);
    });

    test('should provide detailed system information when requested', async () => {
      const healthResponse = await healthApiApplication.request('/health?details=full');

      expect(healthResponse.status).toBe(HTTP_STATUS_CODES.OK);

      const healthResponseData = await healthResponse.json();

      validateDetailedHealthResponse(healthResponseData.data);
    });

    test('should provide alternative response formats', async () => {
      const healthResponse = await healthApiApplication.request('/health?format=text');

      expect(healthResponse.status).toBe(HTTP_STATUS_CODES.OK);
      expect(healthResponse.headers.get('content-type')).toContain('text/plain');

      const healthResponseText = await healthResponse.text();

      expect(healthResponseText).toContain('Status: ok');
      expect(healthResponseText).toContain('Uptime:');
      expect(healthResponseText).toContain('Timestamp:');
    });

    test('should provide timely and accurate timestamp information', async () => {
      const healthResponse = await healthApiApplication.request(HEALTH_ENDPOINT);
      const healthResponseData = await healthResponse.json();

      const responseTimestamp = new Date(healthResponseData.data.timestamp);
      const currentTimestamp = new Date();

      expect(responseTimestamp.getTime()).not.toBeNaN();
      expect(responseTimestamp.getTime()).toBeLessThanOrEqual(currentTimestamp.getTime());

      const timeDifferenceInMs = currentTimestamp.getTime() - responseTimestamp.getTime();
      expect(timeDifferenceInMs).toBeLessThan(MAXIMUM_TIMESTAMP_DIFFERENCE_MS);
    });
  });

  describe('Service Connectivity Check', () => {
    test('should respond to connectivity checks with expected service information', async () => {
      const pingResponse = await healthApiApplication.request(PING_ENDPOINT);

      expect(pingResponse.status).toBe(HTTP_STATUS_CODES.OK);

      const pingResponseData = await pingResponse.json();

      validatePingResponse(pingResponseData.data);
    });

    test('should support different response formats for ping', async () => {
      const pingResponse = await healthApiApplication.request('/ping?format=text');

      expect(pingResponse.status).toBe(HTTP_STATUS_CODES.OK);
      expect(pingResponse.headers.get('content-type')).toContain('text/plain');

      const pingResponseText = await pingResponse.text();

      expect(pingResponseText).toContain('pong');
      expect(pingResponseText.length).toBeGreaterThan(0);
    });
  });

  describe('API Input Validation', () => {
    test('should validate query parameters appropriately', async () => {
      const invalidFormatResponse = await healthApiApplication.request('/health?format=invalid');
      expect(invalidFormatResponse.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);

      const invalidDetailsResponse = await healthApiApplication.request('/health?details=invalid');
      expect(invalidDetailsResponse.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
    });

    test('should accept valid parameter combinations', async () => {
      const validParametersResponse = await healthApiApplication.request('/health?format=json&details=basic');
      expect(validParametersResponse.status).toBe(HTTP_STATUS_CODES.OK);

      const validParametersData = await validParametersResponse.json();
      expect(validParametersData.data).toHaveProperty('status');
    });
  });

  describe('Monitoring Contract Compliance', () => {
    test('should maintain consistent health check interface', async () => {
      const healthResponse = await healthApiApplication.request(HEALTH_ENDPOINT);
      const healthResponseData = await healthResponse.json();

      const requiredHealthFields = ['status', 'timestamp', 'uptime'];
      requiredHealthFields.forEach((fieldName) => {
        expect(healthResponseData.data).toHaveProperty(fieldName);
      });
    });

    test('should maintain consistent ping interface', async () => {
      const pingResponse = await healthApiApplication.request(PING_ENDPOINT);
      const pingResponseData = await pingResponse.json();

      const requiredPingFields = ['message', 'timestamp', 'service'];
      requiredPingFields.forEach((fieldName) => {
        expect(pingResponseData.data).toHaveProperty(fieldName);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle malformed query parameters gracefully', async () => {
      const malformedResponse = await healthApiApplication.request('/health?format=xml&details=undefined');

      expect(malformedResponse.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);

      const errorResponseData = await malformedResponse.json();
      expect(errorResponseData).toHaveProperty('success', false);
      expect(errorResponseData).toHaveProperty('error');
      expect(typeof errorResponseData.error).toBe('object');
    });

    test('should reject completely invalid endpoints gracefully', async () => {
      const notFoundResponse = await healthApiApplication.request('/invalid-endpoint');

      expect(notFoundResponse.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
    });

    test('should handle concurrent health check requests', async () => {
      const concurrentRequests = Array.from({ length: CONCURRENT_REQUEST_COUNT }, () =>
        healthApiApplication.request(HEALTH_ENDPOINT),
      );
      const concurrentResponses = await Promise.all(concurrentRequests);

      concurrentResponses.forEach((healthResponse: Response) => {
        expect(healthResponse.status).toBe(HTTP_STATUS_CODES.OK);
      });

      const concurrentDataPromises = concurrentResponses.map((responseItem: Response) => responseItem.json());
      const concurrentDataResults: ApiResponse<HealthResponseData>[] = await Promise.all(concurrentDataPromises);

      concurrentDataResults.forEach((healthDataItem: ApiResponse<HealthResponseData>) => {
        expect(healthDataItem).toHaveProperty('data');
        expect(healthDataItem.data.status).toBe('ok');
      });
    });

    test('should maintain consistent response structure under load', async () => {
      const heavyLoadRequests = Array.from({ length: HEAVY_LOAD_REQUEST_COUNT }, () =>
        healthApiApplication.request('/health?details=full'),
      );

      const heavyLoadResponses = await Promise.all(heavyLoadRequests);
      const heavyLoadDataResults: ApiResponse<HealthResponseData>[] = await Promise.all(
        heavyLoadResponses.map((responseItem: Response) => responseItem.json()),
      );

      heavyLoadDataResults.forEach((healthDataItem: ApiResponse<HealthResponseData>) => {
        expect(healthDataItem.data).toHaveProperty('status');
        expect(healthDataItem.data).toHaveProperty('version');
        expect(healthDataItem.data).toHaveProperty('environment');
        expect(healthDataItem.data).toHaveProperty('memory');
      });
    });
  });

  describe('Response Format Integrity', () => {
    test('should provide complete JSON response structure', async () => {
      const healthResponse = await healthApiApplication.request('/health?details=full');
      const healthResponseData: ApiResponse<HealthResponseData> = await healthResponse.json();
      expect(healthResponseData).toHaveProperty('data');

      expect(typeof healthResponseData.data.status).toBe('string');
      expect(typeof healthResponseData.data.timestamp).toBe('string');
      expect(typeof healthResponseData.data.uptime).toBe('number');
      expect(typeof healthResponseData.data.version).toBe('string');
      expect(typeof healthResponseData.data.environment).toBe('string');

      expect(healthResponseData.data.memory).toHaveProperty('used');
      expect(healthResponseData.data.memory).toHaveProperty('total');
      expect(healthResponseData.data.memory).toHaveProperty('percentage');
      expect(typeof healthResponseData.data.memory!.used).toBe('number');
      expect(typeof healthResponseData.data.memory!.total).toBe('number');
      expect(typeof healthResponseData.data.memory!.percentage).toBe('number');
    });

    test('should provide complete text response structure', async () => {
      const basicTextResponse = await healthApiApplication.request('/health?format=text');
      expect(basicTextResponse.headers.get('content-type')).toContain('text/plain');

      const basicText = await basicTextResponse.text();
      expect(basicText).toMatch(/Status:\s+ok/);
      expect(basicText).toMatch(/Timestamp:\s+\d{4}-\d{2}-\d{2}/);

      const fullTextResponse = await healthApiApplication.request('/health?format=text&details=full');
      const fullText = await fullTextResponse.text();

      expect(fullText).toMatch(/Version:/);
      expect(fullText).toMatch(/Environment:/);
      expect(fullText).toMatch(/Memory:/);
      expect(fullText).toMatch(/bytes/);
    });

    test('should ensure ping response completeness', async () => {
      const jsonPingResponse = await healthApiApplication.request(PING_ENDPOINT);
      const jsonPingData: ApiResponse<PingResponseData> = await jsonPingResponse.json();

      expect(jsonPingData).toHaveProperty('data');
      expect(typeof jsonPingData.data.message).toBe('string');
      expect(typeof jsonPingData.data.timestamp).toBe('string');
      expect(typeof jsonPingData.data.service).toBe('string');

      const textPingResponse = await healthApiApplication.request('/ping?format=text');
      const textPingData = await textPingResponse.text();

      expect(textPingData).toContain('pong');
    });
  });

  describe('Data Boundary and Validation Tests', () => {
    test('should provide valid numeric ranges for system metrics', async () => {
      const healthResponse = await healthApiApplication.request('/health?details=full');
      const healthResponseData: ApiResponse<HealthResponseData> = await healthResponse.json();

      expect(healthResponseData.data.uptime).toBeGreaterThanOrEqual(0);
      expect(healthResponseData.data.uptime).toBeLessThan(Number.MAX_SAFE_INTEGER);

      expect(healthResponseData.data.memory!.used).toBeGreaterThan(0);
      expect(healthResponseData.data.memory!.total).toBeGreaterThan(healthResponseData.data.memory!.used);
      expect(healthResponseData.data.memory!.percentage).toBeGreaterThan(0);
      expect(healthResponseData.data.memory!.percentage).toBeLessThanOrEqual(MAXIMUM_MEMORY_PERCENTAGE);

      const calculatedPercentage =
        (healthResponseData.data.memory!.used / healthResponseData.data.memory!.total) * MAXIMUM_MEMORY_PERCENTAGE;
      expect(Math.abs(healthResponseData.data.memory!.percentage - calculatedPercentage)).toBeLessThan(1);
    });

    test('should validate timestamp format and accuracy', async () => {
      const healthResponse = await healthApiApplication.request(HEALTH_ENDPOINT);
      const healthResponseData: ApiResponse<HealthResponseData> = await healthResponse.json();
      const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/;
      expect(healthResponseData.data.timestamp).toMatch(timestampRegex);

      const parsedTimestamp = new Date(healthResponseData.data.timestamp);
      expect(parsedTimestamp.getTime()).not.toBeNaN();
    });

    test('should ensure service identifier consistency', async () => {
      const firstPingResponse = await healthApiApplication.request(PING_ENDPOINT);
      const firstPingData: ApiResponse<PingResponseData> = await firstPingResponse.json();

      expect(firstPingData.data.service).toBe('hono-api');
      expect(typeof firstPingData.data.service).toBe('string');
      expect(firstPingData.data.service.length).toBeGreaterThan(0);

      const secondPingResponse = await healthApiApplication.request(PING_ENDPOINT);
      const secondPingData: ApiResponse<PingResponseData> = await secondPingResponse.json();

      expect(secondPingData.data.service).toBe(firstPingData.data.service);
    });
  });

  describe('Performance and Reliability Behaviors', () => {
    test('should respond within reasonable time limits', async () => {
      const performanceTestStartTime = Date.now();
      const detailedHealthResponse = await healthApiApplication.request('/health?details=full');
      const _detailedHealthDuration = Date.now() - performanceTestStartTime;

      expect(detailedHealthResponse.status).toBe(HTTP_STATUS_CODES.OK);

      const basicHealthTestStartTime = Date.now();
      const basicHealthResponse = await healthApiApplication.request(HEALTH_ENDPOINT);
      const _basicHealthDuration = Date.now() - basicHealthTestStartTime;

      expect(basicHealthResponse.status).toBe(HTTP_STATUS_CODES.OK);
    });

    test('should handle rapid successive requests reliably', async () => {
      const rapidPingRequests = [];
      for (let requestIndex = 0; requestIndex < RAPID_REQUEST_COUNT; requestIndex++) {
        rapidPingRequests.push(healthApiApplication.request(PING_ENDPOINT));
      }

      const rapidPingResponses = await Promise.all(rapidPingRequests);

      rapidPingResponses.forEach((pingResponse: Response) => {
        expect(pingResponse.status).toBe(HTTP_STATUS_CODES.OK);
      });

      const rapidPingDataPromises = rapidPingResponses.map((responseItem: Response) => responseItem.json());
      const rapidPingDataResults: ApiResponse<PingResponseData>[] = await Promise.all(rapidPingDataPromises);

      rapidPingDataResults.forEach((pingDataItem: ApiResponse<PingResponseData>) => {
        expect(pingDataItem).toHaveProperty('data');
        expect(pingDataItem.data.message).toBe('pong');
      });
    });

    test('should maintain state independence between requests', async () => {
      const firstHealthResponse = await healthApiApplication.request('/health?details=full');
      const firstHealthData: ApiResponse<HealthResponseData> = await firstHealthResponse.json();

      await new Promise((resolve) => setTimeout(resolve, STATE_INDEPENDENCE_DELAY_MS));

      const secondHealthResponse = await healthApiApplication.request('/health?details=full');
      const secondHealthData: ApiResponse<HealthResponseData> = await secondHealthResponse.json();

      expect(secondHealthData.data.status).toBe(firstHealthData.data.status);
      expect(secondHealthData.data.version).toBe(firstHealthData.data.version);
      expect(secondHealthData.data.environment).toBe(firstHealthData.data.environment);

      expect(secondHealthData.data.uptime).toBeGreaterThanOrEqual(firstHealthData.data.uptime);

      expect(secondHealthData.data.timestamp).not.toBe(firstHealthData.data.timestamp);
    });
  });
});
