/**
 * Types Tests - Behavior-Based
 *
 * Tests for type utilities focusing on API contract and behavior
 */

import { describe, test, expect } from 'vitest';
import { createApiResponse, createApiError } from '@/server/api/types';

describe('src/server/api/utils/api-response.ts', () => {
  describe('API Response Creation', () => {
    describe('Success Response Behavior', () => {
      test('should create successful API response with data', () => {
        const testCases = [{ id: 1, name: 'test' }, 'simple string', [1, 2, 3], { complex: { nested: 'data' } }];

        testCases.forEach((data) => {
          const response = createApiResponse(data);

          expect(response).toHaveProperty('data');
          expect(response.data).toEqual(data);

          expect(response).not.toHaveProperty('error');
        });
      });

      test('should handle empty and null data appropriately', () => {
        const emptyResponse = createApiResponse(null);
        expect(emptyResponse.data).toBe(null);

        const _undefinedResponse = createApiResponse(undefined);
        expect(emptyResponse).toHaveProperty('data');
      });
    });

    describe('Error Response Behavior', () => {
      test('should create error API response with message', () => {
        const errorMessages = ['Something went wrong', 'Validation failed', 'Resource not found', ''];

        errorMessages.forEach((message) => {
          const response = createApiError(message);

          expect(response).toHaveProperty('error');
          expect(response.error).toBe(message);

          expect(response).not.toHaveProperty('data');
        });
      });

      test('should handle various error message types', () => {
        const response = createApiError('User input validation failed');
        expect(typeof response.error).toBe('string');
        expect(response.error.length).toBeGreaterThan(0);
      });
    });
  });

  describe('API Contract Consistency', () => {
    test('should maintain consistent response structure', () => {
      const successResponse = createApiResponse({ test: 'data' });
      const errorResponse = createApiError('test error');

      expect(Object.keys(successResponse)).not.toContain('error');

      expect(Object.keys(errorResponse)).not.toContain('data');
    });

    test('should provide type-safe response creation', () => {
      const response = createApiResponse({ userId: 123, active: true });

      expect(response.data).toHaveProperty('userId');
      expect(response.data).toHaveProperty('active');
      expect(typeof response.data.userId).toBe('number');
      expect(typeof response.data.active).toBe('boolean');
    });
  });
});
