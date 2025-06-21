/**
 * Types Tests
 *
 * Tests for type utilities and helper functions
 */

import { describe, test, expect } from 'vitest';
import { HTTP_STATUS, createApiResponse, createApiError } from '../types';

describe('Types Module', () => {
  describe('HTTP_STATUS', () => {
    test('should have correct status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('API Response utilities', () => {
    describe('createApiResponse', () => {
      test('should create response with data', () => {
        const data = { id: 1, name: 'test' };
        const response = createApiResponse(data);

        expect(response.data).toEqual(data);
        expect(response.error).toBeUndefined();
        expect(response.message).toBeUndefined();
      });
    });

    describe('createApiError', () => {
      test('should create error response', () => {
        const errorMessage = 'Something went wrong';
        const response = createApiError(errorMessage);

        expect(response.error).toBe(errorMessage);
        expect(response.data).toBeUndefined();
        expect(response.message).toBeUndefined();
      });
    });
  });
});
