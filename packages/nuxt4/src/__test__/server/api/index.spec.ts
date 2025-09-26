/**
 * API Index Module Tests - Behavior-Based
 *
 * Tests focusing on the API index module export behavior
 */

import { describe, test, expect } from 'vitest';

describe('src/server/api/index.ts', () => {
  test('should export all required utilities and types', async () => {
    const module = await import('@/server/api/index');

    // HTTP Status Codes
    expect(module).toHaveProperty('HTTP_STATUS_CODES');
    expect(typeof module.HTTP_STATUS_CODES).toBe('object');

    // API Response Utilities
    expect(module).toHaveProperty('createSuccessApiResponse');
    expect(module).toHaveProperty('createErrorApiResponse');
    expect(module).toHaveProperty('createMessageApiResponse');
    expect(module).toHaveProperty('createSuccessApiResponseWithMessage');
    expect(module).toHaveProperty('isSuccessApiResponse');
    expect(module).toHaveProperty('isErrorApiResponse');
    expect(module).toHaveProperty('isMessageApiResponse');

    // System Info Utilities
    expect(module).toHaveProperty('getCurrentTimestamp');
    expect(module).toHaveProperty('getSystemUptime');
    expect(module).toHaveProperty('getNodeVersion');
    expect(module).toHaveProperty('getCurrentEnvironment');
    expect(module).toHaveProperty('getMemoryUsageInformation');
    expect(module).toHaveProperty('isDevelopmentEnvironment');
    expect(module).toHaveProperty('isProductionEnvironment');

    // Text Formatting Utilities
    expect(module).toHaveProperty('formatBasicHealthStatusAsText');
    expect(module).toHaveProperty('formatFullHealthStatusAsText');
    expect(module).toHaveProperty('formatPingResponseAsText');
    expect(module).toHaveProperty('formatAsJsonString');

    // Validation Schemas
    expect(module).toHaveProperty('ResponseFormatSchema');
    expect(module).toHaveProperty('HealthDetailsLevelSchema');
    expect(module).toHaveProperty('HealthCheckQuerySchema');
    expect(module).toHaveProperty('PingQuerySchema');
  });

  test('should provide functional exports that work correctly', async () => {
    const module = await import('@/server/api/index');

    // API Response functions
    expect(typeof module.createSuccessApiResponse).toBe('function');
    expect(typeof module.createErrorApiResponse).toBe('function');
    expect(typeof module.isSuccessApiResponse).toBe('function');

    // System Info functions
    expect(typeof module.getCurrentTimestamp).toBe('function');
    expect(typeof module.getSystemUptime).toBe('function');
    expect(typeof module.getNodeVersion).toBe('function');

    // Text Formatting functions
    expect(typeof module.formatBasicHealthStatusAsText).toBe('function');
    expect(typeof module.formatAsJsonString).toBe('function');

    const successResponse = module.createSuccessApiResponse('test');
    expect(successResponse).toHaveProperty('data', 'test');

    const timestamp = module.getCurrentTimestamp();
    expect(typeof timestamp).toBe('string');

    const jsonString = module.formatAsJsonString({ test: 'data' });
    expect(typeof jsonString).toBe('string');
  });

  test('should maintain consistent API surface', async () => {
    const module = await import('@/server/api/index');

    const exportedFunctions = [
      'createSuccessApiResponse',
      'createErrorApiResponse',
      'createMessageApiResponse',
      'createSuccessApiResponseWithMessage',
      'isSuccessApiResponse',
      'isErrorApiResponse',
      'isMessageApiResponse',
      'getCurrentTimestamp',
      'getSystemUptime',
      'getNodeVersion',
      'getCurrentEnvironment',
      'getMemoryUsageInformation',
      'isDevelopmentEnvironment',
      'isProductionEnvironment',
      'formatBasicHealthStatusAsText',
      'formatFullHealthStatusAsText',
      'formatPingResponseAsText',
      'formatAsJsonString',
    ];

    exportedFunctions.forEach((functionName) => {
      expect(module).toHaveProperty(functionName);
      const exportedFunction = (module as Record<string, unknown>)[functionName];
      expect(typeof exportedFunction).toBe('function');
    });

    const exportedSchemas = [
      'ResponseFormatSchema',
      'HealthDetailsLevelSchema',
      'HealthCheckQuerySchema',
      'PingQuerySchema',
    ];

    exportedSchemas.forEach((schemaName) => {
      expect(module).toHaveProperty(schemaName);
      const exportedSchema = (module as Record<string, unknown>)[schemaName];
      expect(typeof exportedSchema).toBe('object');
    });
  });

  test('should provide working integration between exported modules', async () => {
    const module = await import('@/server/api/index');

    const timestamp = module.getCurrentTimestamp();
    const uptime = module.getSystemUptime();
    const version = module.getNodeVersion();
    const environment = module.getCurrentEnvironment();
    const memory = module.getMemoryUsageInformation();

    const healthStatus = {
      status: 'ok' as const,
      timestamp,
      uptime,
      version,
      environment,
      memory,
    };

    const formattedText = module.formatFullHealthStatusAsText(healthStatus);
    expect(typeof formattedText).toBe('string');
    expect(formattedText).toContain('Status: ok');

    const apiResponse = module.createSuccessApiResponse(healthStatus);
    expect(module.isSuccessApiResponse(apiResponse)).toBe(true);
    expect(apiResponse.data).toEqual(healthStatus);

    const jsonString = module.formatAsJsonString(apiResponse);
    expect(typeof jsonString).toBe('string');
    const parsed = JSON.parse(jsonString);
    expect(parsed).toEqual(apiResponse);
  });

  test('should export HTTP status codes with correct structure', async () => {
    const module = await import('@/server/api/index');

    expect(module.HTTP_STATUS_CODES).toBeDefined();
    expect(typeof module.HTTP_STATUS_CODES).toBe('object');

    const expectedStatusCodes = ['OK', 'BAD_REQUEST', 'NOT_FOUND', 'INTERNAL_SERVER_ERROR'];

    expectedStatusCodes.forEach((statusCode) => {
      expect(module.HTTP_STATUS_CODES).toHaveProperty(statusCode);
      const codeValue = (module.HTTP_STATUS_CODES as Record<string, number>)[statusCode];
      expect(typeof codeValue).toBe('number');
    });

    Object.values(module.HTTP_STATUS_CODES).forEach((code) => {
      expect(typeof code).toBe('number');
      expect(code).toBeGreaterThanOrEqual(100);
      expect(code).toBeLessThan(600);
    });
  });
});
