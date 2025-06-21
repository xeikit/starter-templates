/**
 * Config Tests
 *
 * Tests for API configuration
 */

import { describe, test, expect } from 'vitest';
import { apiConfig, getEnvironment, isProduction, isDevelopment } from '../config';

describe('API Config', () => {
  test('should have cors configuration', () => {
    expect(apiConfig.cors).toBeDefined();
    expect(Array.isArray(apiConfig.cors.allowMethods)).toBe(true);
    expect(Array.isArray(apiConfig.cors.allowHeaders)).toBe(true);
  });

  test('should have logging configuration', () => {
    expect(apiConfig.logging).toBeDefined();
    expect(typeof apiConfig.logging.enabled).toBe('boolean');
    expect(typeof apiConfig.logging.detailed).toBe('boolean');
  });

  test('should have errors configuration', () => {
    expect(apiConfig.errors).toBeDefined();
    expect(typeof apiConfig.errors.showDetails).toBe('boolean');
  });

  test('should have rateLimit configuration', () => {
    expect(apiConfig.rateLimit).toBeDefined();
    expect(typeof apiConfig.rateLimit.enabled).toBe('boolean');
    expect(typeof apiConfig.rateLimit.windowMs).toBe('number');
    expect(typeof apiConfig.rateLimit.max).toBe('number');
  });

  test('should have api configuration', () => {
    expect(apiConfig.api).toBeDefined();
    expect(typeof apiConfig.api.version).toBe('string');
    expect(typeof apiConfig.api.baseUrl).toBe('string');
  });

  test('should have timeouts configuration', () => {
    expect(apiConfig.timeouts).toBeDefined();
    expect(typeof apiConfig.timeouts.request).toBe('number');
    expect(typeof apiConfig.timeouts.keepAlive).toBe('number');
  });

  test('CORS should include common HTTP methods', () => {
    const methods = apiConfig.cors.allowMethods;
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
    expect(methods).toContain('PUT');
    expect(methods).toContain('DELETE');
  });

  test('CORS should include common headers', () => {
    const headers = apiConfig.cors.allowHeaders;
    expect(headers).toContain('Content-Type');
    expect(headers).toContain('Authorization');
  });

  test('request timeout should be reasonable', () => {
    expect(apiConfig.timeouts.request).toBeGreaterThan(0);
    expect(apiConfig.timeouts.request).toBeLessThanOrEqual(60000); // Max 1 minute
  });

  test('keep alive should be reasonable', () => {
    expect(apiConfig.timeouts.keepAlive).toBeGreaterThan(0);
    expect(apiConfig.timeouts.keepAlive).toBeLessThanOrEqual(30000); // Max 30 seconds
  });

  test('rate limit should have valid configuration', () => {
    expect(apiConfig.rateLimit.windowMs).toBeGreaterThan(0);
    expect(apiConfig.rateLimit.max).toBeGreaterThan(0);
  });

  test('api version should be valid', () => {
    expect(apiConfig.api.version).toMatch(/^v\d+$/);
    expect(apiConfig.api.baseUrl).toMatch(/^\/api$/);
  });

  test('environment helpers should work', () => {
    expect(typeof getEnvironment()).toBe('string');
    expect(typeof isProduction()).toBe('boolean');
    expect(typeof isDevelopment()).toBe('boolean');
  });

  test('logging should be enabled by default', () => {
    expect(apiConfig.logging.enabled).toBe(true);
  });

  test('environment helpers should return consistent types', () => {
    expect(typeof getEnvironment()).toBe('string');
    expect(typeof isProduction()).toBe('boolean');
    expect(typeof isDevelopment()).toBe('boolean');

    // Should be mutually exclusive
    expect(isProduction() && isDevelopment()).toBe(false);
  });
});
