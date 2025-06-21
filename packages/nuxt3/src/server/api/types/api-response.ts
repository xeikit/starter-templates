/**
 * API Response Types
 *
 * Type definitions for standardized API response format.
 * Functions and utilities are located in utils/api-response.ts
 */

/**
 * Standard API response structure
 *
 * @template TData - Type of the data field
 */
export interface ApiResponse<TData = unknown> {
  readonly data?: TData;
  readonly error?: string;
  readonly message?: string;
}

/**
 * Success response type (contains data)
 *
 * @template TData - Type of the data being returned
 */
export interface SuccessApiResponse<TData = unknown> extends ApiResponse<TData> {
  readonly data: TData;
}

/**
 * Error response type (contains error message)
 */
export interface ErrorApiResponse extends ApiResponse {
  readonly error: string;
}

/**
 * Message response type (contains message)
 */
export interface MessageApiResponse extends ApiResponse {
  readonly message: string;
}

/**
 * Success response with message type (contains both data and message)
 *
 * @template TData - Type of the data being returned
 */
export interface SuccessApiResponseWithMessage<TData = unknown> extends ApiResponse<TData> {
  readonly data: TData;
  readonly message: string;
}
