/**
 * API Response Utilities Tests - Behavior-Based
 *
 * Tests focusing on API response utility behavior and type safety
 */

import {
  createErrorApiResponse,
  createMessageApiResponse,
  createSuccessApiResponse,
  createSuccessApiResponseWithMessage,
  isErrorApiResponse,
  isMessageApiResponse,
  isSuccessApiResponse,
} from '@/server/api/utils/api-response';
import { describe, expect, test } from 'vitest';

describe('src/server/api/utils/api-response.ts', () => {
  describe('Success Response Creation', () => {
    test('should create valid success response with data', () => {
      const testData = { id: 1, name: 'test', active: true };
      const response = createSuccessApiResponse(testData);

      expect(response).toHaveProperty('data');
      expect(response.data).toEqual(testData);
    });

    test('should handle various data types in success responses', () => {
      const testCases = [
        { name: 'string', data: 'test string' },
        { name: 'number', data: 42 },
        { name: 'boolean', data: true },
        { name: 'array', data: [1, 2, 3] },
        { name: 'object', data: { key: 'value' } },
        { name: 'null', data: null },
      ];

      for (const { data } of testCases) {
        const response = createSuccessApiResponse(data);

        expect(response).toHaveProperty('data');
        expect(response.data).toEqual(data);
      }
    });

    test('should create success response with message', () => {
      const testData = { result: 'completed' };
      const testMessage = 'Operation successful';

      const response = createSuccessApiResponseWithMessage(testData, testMessage);

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('message');
      expect(response.data).toEqual(testData);
      expect(response.message).toBe(testMessage);
    });

    test('should handle empty data in success responses', () => {
      const emptyData = {};
      const response = createSuccessApiResponse(emptyData);

      expect(response).toHaveProperty('data');
      expect(response.data).toEqual(emptyData);
      expect(typeof response.data).toBe('object');
    });
  });

  describe('Error Response Creation', () => {
    test('should create valid error response with message', () => {
      const errorMessage = 'Something went wrong';
      const response = createErrorApiResponse(errorMessage);

      expect(response).toHaveProperty('error');
      expect(response.error).toBe(errorMessage);
      expect(typeof response.error).toBe('string');
    });

    test('should handle various error message types', () => {
      const errorMessages = [
        'Simple error',
        'Error with special characters: @#$%^&*()',
        'Very long error message that contains multiple sentences and detailed information about what went wrong.',
        'Error with unicode: こんにちは',
        '',
      ];

      for (const message of errorMessages) {
        const response = createErrorApiResponse(message);

        expect(response).toHaveProperty('error');
        expect(response.error).toBe(message);
      }
    });

    test('should create identifiable error response', () => {
      const errorMessage = 'Test error';
      const response = createErrorApiResponse(errorMessage);

      expect(isErrorApiResponse(response)).toBe(true);
      expect(isSuccessApiResponse(response)).toBe(false);
      expect(isMessageApiResponse(response)).toBe(false);

      expect(response.error).toBe(errorMessage);
    });
  });

  describe('Message Response Creation', () => {
    test('should create valid message response', () => {
      const testMessage = 'Operation completed successfully';
      const response = createMessageApiResponse(testMessage);

      expect(response).toHaveProperty('message');
      expect(response.message).toBe(testMessage);
      expect(typeof response.message).toBe('string');
    });

    test('should handle various message types', () => {
      const messages = [
        'Info message',
        'Warning: This is a warning',
        'Success: Everything is fine',
        'Debug: Additional information',
        'Status update',
      ];

      for (const message of messages) {
        const response = createMessageApiResponse(message);

        expect(response).toHaveProperty('message');
        expect(response.message).toBe(message);
      }
    });

    test('should create identifiable message response', () => {
      const message = 'Test message';
      const response = createMessageApiResponse(message);

      expect(isMessageApiResponse(response)).toBe(true);
      expect(isSuccessApiResponse(response)).toBe(false);
      expect(isErrorApiResponse(response)).toBe(false);

      expect(response.message).toBe(message);
    });
  });

  describe('Response Type Guards', () => {
    test('should maintain response type exclusivity', () => {
      const successResponse = createSuccessApiResponse({ test: 'data' });
      const errorResponse = createErrorApiResponse('test error');
      const messageResponse = createMessageApiResponse('test message');

      expect(isSuccessApiResponse(successResponse)).toBe(true);
      expect(isErrorApiResponse(successResponse)).toBe(false);
      expect(isMessageApiResponse(successResponse)).toBe(false);

      expect(isErrorApiResponse(errorResponse)).toBe(true);
      expect(isSuccessApiResponse(errorResponse)).toBe(false);
      expect(isMessageApiResponse(errorResponse)).toBe(false);

      expect(isMessageApiResponse(messageResponse)).toBe(true);
      expect(isSuccessApiResponse(messageResponse)).toBe(false);
      expect(isErrorApiResponse(messageResponse)).toBe(false);
    });

    test('should correctly identify error responses', () => {
      const successResponse = createSuccessApiResponse({ test: 'data' });
      const errorResponse = createErrorApiResponse('test error');
      const messageResponse = createMessageApiResponse('test message');

      expect(isErrorApiResponse(successResponse)).toBe(false);
      expect(isErrorApiResponse(errorResponse)).toBe(true);
      expect(isErrorApiResponse(messageResponse)).toBe(false);
    });

    test('should correctly identify message responses', () => {
      const successResponse = createSuccessApiResponse({ test: 'data' });
      const errorResponse = createErrorApiResponse('test error');
      const messageResponse = createMessageApiResponse('test message');

      expect(isMessageApiResponse(successResponse)).toBe(false);
      expect(isMessageApiResponse(errorResponse)).toBe(false);
      expect(isMessageApiResponse(messageResponse)).toBe(true);
    });

    test('should handle edge cases in type guards', () => {
      const responseWithData = { data: null };
      const responseWithError = { error: '' };
      const responseWithMessage = { message: '' };
      const emptyResponse = {};

      expect(isSuccessApiResponse(responseWithData)).toBe(true);
      expect(isErrorApiResponse(responseWithError)).toBe(true);
      expect(isMessageApiResponse(responseWithMessage)).toBe(true);

      expect(isSuccessApiResponse(emptyResponse)).toBe(false);
      expect(isErrorApiResponse(emptyResponse)).toBe(false);
      expect(isMessageApiResponse(emptyResponse)).toBe(false);
    });

    test('should provide type safety for response identification', () => {
      const successResponse = createSuccessApiResponse({ id: 1 });
      const errorResponse = createErrorApiResponse('error');
      const messageResponse = createMessageApiResponse('message');
      const successWithMessageResponse = createSuccessApiResponseWithMessage({ id: 2 }, 'success');

      expect(isSuccessApiResponse(successResponse)).toBe(true);
      expect(successResponse).toHaveProperty('data');

      expect(isErrorApiResponse(errorResponse)).toBe(true);
      expect(errorResponse).toHaveProperty('error');

      expect(isMessageApiResponse(messageResponse)).toBe(true);
      expect(messageResponse).toHaveProperty('message');

      expect(isSuccessApiResponse(successWithMessageResponse)).toBe(true);
      expect(isMessageApiResponse(successWithMessageResponse)).toBe(true);
      expect(successWithMessageResponse).toHaveProperty('data');
      expect(successWithMessageResponse).toHaveProperty('message');
    });
  });

  describe('Response Consistency and Immutability', () => {
    test('should create immutable response objects', () => {
      const testData = { original: true };
      createSuccessApiResponse(testData);

      testData.original = false;

      const newData = { value: 'test' };
      const newResponse = createSuccessApiResponse(newData);
      expect(newResponse.data).toBe(newData);
    });

    test('should maintain consistent type identification across different data types', () => {
      const successResponses = [
        createSuccessApiResponse('string'),
        createSuccessApiResponse(123),
        createSuccessApiResponse({}),
        createSuccessApiResponse([]),
      ];

      for (const response of successResponses) {
        expect(isSuccessApiResponse(response)).toBe(true);
        expect(isErrorApiResponse(response)).toBe(false);
        expect(isMessageApiResponse(response)).toBe(false);
      }

      const errorResponses = [createErrorApiResponse('error1'), createErrorApiResponse('error2')];

      for (const response of errorResponses) {
        expect(isErrorApiResponse(response)).toBe(true);
        expect(isSuccessApiResponse(response)).toBe(false);
        expect(isMessageApiResponse(response)).toBe(false);
      }

      const messageResponses = [createMessageApiResponse('message1'), createMessageApiResponse('message2')];

      for (const response of messageResponses) {
        expect(isMessageApiResponse(response)).toBe(true);
        expect(isSuccessApiResponse(response)).toBe(false);
        expect(isErrorApiResponse(response)).toBe(false);
      }
    });

    test('should handle complex data structures in responses', () => {
      const complexData = {
        user: {
          id: 1,
          profile: {
            name: 'John Doe',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        permissions: ['read', 'write'],
        metadata: {
          created: new Date().toISOString(),
          version: '1.0.0',
        },
      };

      const response = createSuccessApiResponse(complexData);

      expect(response.data).toEqual(complexData);
      expect(response.data.user.profile.name).toBe('John Doe');
      expect(response.data.permissions).toHaveLength(2);
      expect(response.data.metadata.version).toBe('1.0.0');
    });

    test('should provide consistent behavior across multiple calls', () => {
      const testData = { test: 'data' };
      const testError = 'test error';
      const testMessage = 'test message';

      const responses1 = [
        createSuccessApiResponse(testData),
        createErrorApiResponse(testError),
        createMessageApiResponse(testMessage),
      ];

      const responses2 = [
        createSuccessApiResponse(testData),
        createErrorApiResponse(testError),
        createMessageApiResponse(testMessage),
      ];

      for (const [index, response1] of responses1.entries()) {
        const response2 = responses2[index];
        expect(response1).toEqual(response2);
      }
    });
  });
});
