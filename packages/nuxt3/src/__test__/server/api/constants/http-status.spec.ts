/**
 * HTTP Status Utility Functions Tests
 *
 * Tests focus on the behavior and contract of HTTP status utilities,
 * ensuring consistent behavior across different status codes.
 */

import { describe, expect, test } from 'vitest';
import {
  HTTP_STATUS_CODES,
  isSuccessStatusCode,
  isClientErrorStatusCode,
  isServerErrorStatusCode,
} from '@/server/api/constants/http-status';

describe('HTTP Status Utility Functions', () => {
  describe('Success Status Code Recognition Contract', () => {
    test('should correctly identify 2xx success status codes', () => {
      expect(isSuccessStatusCode(HTTP_STATUS_CODES.OK)).toBe(true);
      expect(isSuccessStatusCode(HTTP_STATUS_CODES.CREATED)).toBe(true);
      expect(isSuccessStatusCode(202)).toBe(true);
      expect(isSuccessStatusCode(204)).toBe(true);
      expect(isSuccessStatusCode(299)).toBe(true);
    });

    test('should reject non-success status codes', () => {
      expect(isSuccessStatusCode(100)).toBe(false); // Informational
      expect(isSuccessStatusCode(199)).toBe(false); // Informational
      expect(isSuccessStatusCode(300)).toBe(false); // Redirection
      expect(isSuccessStatusCode(HTTP_STATUS_CODES.BAD_REQUEST)).toBe(false); // Client Error
      expect(isSuccessStatusCode(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)).toBe(false); // Server Error
    });

    test('should handle edge cases appropriately', () => {
      expect(isSuccessStatusCode(199)).toBe(false); // Just below 2xx
      expect(isSuccessStatusCode(300)).toBe(false); // Just above 2xx
      expect(isSuccessStatusCode(0)).toBe(false); // Invalid
      expect(isSuccessStatusCode(999)).toBe(false); // High invalid
    });
  });

  describe('Client Error Status Code Recognition Contract', () => {
    test('should correctly identify 4xx client error status codes', () => {
      expect(isClientErrorStatusCode(HTTP_STATUS_CODES.BAD_REQUEST)).toBe(true);
      expect(isClientErrorStatusCode(HTTP_STATUS_CODES.UNAUTHORIZED)).toBe(true);
      expect(isClientErrorStatusCode(HTTP_STATUS_CODES.FORBIDDEN)).toBe(true);
      expect(isClientErrorStatusCode(HTTP_STATUS_CODES.NOT_FOUND)).toBe(true);
      expect(isClientErrorStatusCode(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY)).toBe(true);
      expect(isClientErrorStatusCode(499)).toBe(true);
    });

    test('should reject non-client-error status codes', () => {
      expect(isClientErrorStatusCode(HTTP_STATUS_CODES.OK)).toBe(false); // Success
      expect(isClientErrorStatusCode(300)).toBe(false); // Redirection
      expect(isClientErrorStatusCode(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)).toBe(false); // Server Error
      expect(isClientErrorStatusCode(100)).toBe(false); // Informational
    });

    test('should handle boundary conditions correctly', () => {
      expect(isClientErrorStatusCode(399)).toBe(false); // Just below 4xx
      expect(isClientErrorStatusCode(500)).toBe(false); // Just above 4xx
    });
  });

  describe('Server Error Status Code Recognition Contract', () => {
    test('should correctly identify 5xx server error status codes', () => {
      expect(isServerErrorStatusCode(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)).toBe(true);
      expect(isServerErrorStatusCode(HTTP_STATUS_CODES.BAD_GATEWAY)).toBe(true);
      expect(isServerErrorStatusCode(HTTP_STATUS_CODES.SERVICE_UNAVAILABLE)).toBe(true);
      expect(isServerErrorStatusCode(599)).toBe(true);
    });

    test('should reject non-server-error status codes', () => {
      expect(isServerErrorStatusCode(HTTP_STATUS_CODES.OK)).toBe(false); // Success
      expect(isServerErrorStatusCode(300)).toBe(false); // Redirection
      expect(isServerErrorStatusCode(HTTP_STATUS_CODES.BAD_REQUEST)).toBe(false); // Client Error
      expect(isServerErrorStatusCode(100)).toBe(false); // Informational
    });

    test('should handle boundary conditions correctly', () => {
      expect(isServerErrorStatusCode(499)).toBe(false); // Just below 5xx
      expect(isServerErrorStatusCode(600)).toBe(false); // Just above 5xx
    });
  });

  describe('Status Code Classification Contract', () => {
    test('should provide mutually exclusive classification', () => {
      const testCodes = [
        HTTP_STATUS_CODES.OK,
        HTTP_STATUS_CODES.CREATED,
        HTTP_STATUS_CODES.BAD_REQUEST,
        HTTP_STATUS_CODES.NOT_FOUND,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        100,
        300,
        502,
      ];

      for (const code of testCodes) {
        const classifications = [
          isSuccessStatusCode(code),
          isClientErrorStatusCode(code),
          isServerErrorStatusCode(code),
        ];

        // At most one classification should be true
        const trueCount = classifications.filter(Boolean).length;
        expect(trueCount).toBeLessThanOrEqual(1);
      }
    });

    test('should cover all standard HTTP status ranges', () => {
      // Success range coverage
      expect(isSuccessStatusCode(HTTP_STATUS_CODES.OK)).toBe(true);
      expect(isSuccessStatusCode(299)).toBe(true);

      // Client error range coverage
      expect(isClientErrorStatusCode(HTTP_STATUS_CODES.BAD_REQUEST)).toBe(true);
      expect(isClientErrorStatusCode(499)).toBe(true);

      // Server error range coverage
      expect(isServerErrorStatusCode(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)).toBe(true);
      expect(isServerErrorStatusCode(599)).toBe(true);
    });

    test('should provide predictable behavior for common status codes', () => {
      // Test common status codes using constants where available
      const commonTests = [
        { code: HTTP_STATUS_CODES.OK, success: true, client: false, server: false },
        { code: HTTP_STATUS_CODES.NOT_FOUND, success: false, client: true, server: false },
        { code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, success: false, client: false, server: true },
        { code: HTTP_STATUS_CODES.CREATED, success: true, client: false, server: false },
        { code: HTTP_STATUS_CODES.UNAUTHORIZED, success: false, client: true, server: false },
        { code: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE, success: false, client: false, server: true },
      ];

      commonTests.forEach(({ code, success, client, server }) => {
        expect(isSuccessStatusCode(code)).toBe(success);
        expect(isClientErrorStatusCode(code)).toBe(client);
        expect(isServerErrorStatusCode(code)).toBe(server);
      });
    });
  });
});
