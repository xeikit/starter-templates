/**
 * API Response Utilities
 *
 * Helper functions for creating standardized API responses.
 * Type definitions are located in types/api-response.ts
 */

import type {
  ApiResponse,
  SuccessApiResponse,
  ErrorApiResponse,
  MessageApiResponse,
  SuccessApiResponseWithMessage,
} from '../types/api-response';

/**
 * Success response with data
 *
 * @template TData - Type of the data being returned
 * @param data - The data to include in the response
 * @returns Formatted success response
 */
export function createSuccessApiResponse<TData>(data: TData): SuccessApiResponse<TData> {
  return { data } as const;
}

/**
 * Error response with error message
 *
 * @param errorMessage - Description of the error
 * @returns Formatted error response
 */
export function createErrorApiResponse(errorMessage: string): ErrorApiResponse {
  return { error: errorMessage } as const;
}

/**
 * Response with custom message
 *
 * @param message - Custom message to include
 * @returns Formatted message response
 */
export function createMessageApiResponse(message: string): MessageApiResponse {
  return { message } as const;
}

/**
 * Success response with both data and message
 *
 * @template TData - Type of the data being returned
 * @param data - The data to include in the response
 * @param message - Success message
 * @returns Formatted success response with message
 */
export function createSuccessApiResponseWithMessage<TData>(
  data: TData,
  message: string,
): SuccessApiResponseWithMessage<TData> {
  return { data, message } as const;
}

/**
 * Type guard to check if response is a success response
 *
 * @param response - API response to check
 * @returns True if response contains data
 */
export function isSuccessApiResponse<TData>(response: ApiResponse<TData>): response is SuccessApiResponse<TData> {
  return response.data !== undefined;
}

/**
 * Type guard to check if response is an error response
 *
 * @param response - API response to check
 * @returns True if response contains error
 */
export function isErrorApiResponse(response: ApiResponse): response is ErrorApiResponse {
  return response.error !== undefined;
}

/**
 * Type guard to check if response is a message response
 *
 * @param response - API response to check
 * @returns True if response contains message
 */
export function isMessageApiResponse(response: ApiResponse): response is MessageApiResponse {
  return response.message !== undefined;
}
