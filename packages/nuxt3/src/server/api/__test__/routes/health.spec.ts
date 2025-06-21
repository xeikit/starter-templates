/**
 * Health Routes Tests
 *
 * Comprehensive tests for health monitoring endpoints.
 */

import { Hono } from 'hono';
import { describe, test, expect, beforeEach } from 'vitest';
import { healthRoutes } from '../../routes/health';

describe('Health Routes', () => {
  let testApplication: Hono;

  beforeEach(() => {
    testApplication = new Hono();
    testApplication.route('/', healthRoutes);
  });

  describe('GET /health', () => {
    test('returns basic health status by default', async () => {
      const response = await testApplication.request('/health');

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.data.status).toBe('ok');
      expect(typeof responseData.data.timestamp).toBe('string');
      expect(typeof responseData.data.uptime).toBe('number');
      expect(responseData.data.uptime).toBeGreaterThanOrEqual(0);
    });

    test('returns full system details when requested', async () => {
      const response = await testApplication.request('/health?details=full');

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.data.status).toBe('ok');
      expect(responseData.data.version).toBeDefined();
      expect(responseData.data.environment).toBeDefined();
      expect(responseData.data.memory).toBeDefined();
      expect(responseData.data.memory.used).toBeGreaterThan(0);
      expect(responseData.data.memory.total).toBeGreaterThan(0);
      expect(responseData.data.memory.percentage).toBeGreaterThan(0);
    });

    test('returns text format when requested', async () => {
      const response = await testApplication.request('/health?format=text');

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/plain');

      const textContent = await response.text();
      expect(textContent).toContain('Status: ok');
      expect(textContent).toContain('Uptime:');
      expect(textContent).toContain('Timestamp:');
    });

    test('returns valid ISO timestamp', async () => {
      const response = await testApplication.request('/health');
      const responseData = await response.json();

      const parsedTimestamp = new Date(responseData.data.timestamp);
      expect(parsedTimestamp.getTime()).not.toBeNaN();
      expect(parsedTimestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('GET /ping', () => {
    test('returns pong response', async () => {
      const response = await testApplication.request('/ping');

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.data.message).toBe('pong');
      expect(responseData.data.service).toBe('hono-api');
      expect(typeof responseData.data.timestamp).toBe('string');
    });

    test('returns text format when requested', async () => {
      const response = await testApplication.request('/ping?format=text');

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/plain');

      const textContent = await response.text();
      expect(textContent).toContain('pong');
      expect(textContent).toContain('hono-api');
    });

    test('has correct response structure', async () => {
      const response = await testApplication.request('/ping');
      const responseData = await response.json();

      expect(Object.keys(responseData.data)).toContain('message');
      expect(Object.keys(responseData.data)).toContain('timestamp');
      expect(Object.keys(responseData.data)).toContain('service');
    });
  });

  describe('Request Validation', () => {
    test('validates invalid format parameter', async () => {
      const response = await testApplication.request('/health?format=invalid');
      expect(response.status).toBe(400);
    });

    test('validates invalid details parameter', async () => {
      const response = await testApplication.request('/health?details=invalid');
      expect(response.status).toBe(400);
    });

    test('accepts valid query combinations', async () => {
      const response = await testApplication.request('/health?format=json&details=basic');
      expect(response.status).toBe(200);
    });
  });
});
