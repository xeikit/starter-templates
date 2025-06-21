/**
 * API Configuration
 *
 * Centralized configuration for the Hono API integration.
 *
 * 💡 Why separate configuration?
 * - Makes it easy to adjust settings without touching core logic
 * - Allows different settings for development vs production
 * - Provides a single place to understand all API behaviors
 *
 * 🔧 Configuration sections:
 * - cors: Cross-Origin Resource Sharing settings
 * - logging: Request/response logging options
 * - rateLimit: Protection against excessive requests
 * - errors: How much error detail to show
 * - timeouts: Request processing limits
 */

// Environment helpers
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const IS_DEVELOPMENT = NODE_ENV === 'development';

export const apiConfig = {
  cors: {
    origin: IS_PRODUCTION ? (process.env.ALLOWED_ORIGINS?.split(',') ?? ['https://localhost:3000']) : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] as string[],
    allowHeaders: ['Content-Type', 'Authorization'] as string[],
  },

  logging: {
    enabled: true,
    detailed: IS_DEVELOPMENT,
  },

  rateLimit: {
    enabled: IS_PRODUCTION,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },

  errors: {
    showDetails: IS_DEVELOPMENT,
  },

  api: {
    version: 'v1',
    baseUrl: '/api',
  },

  timeouts: {
    request: 30000, // 30 seconds
    keepAlive: 5000, // 5 seconds
  },
};

// Export types for external usage
export type ApiConfig = typeof apiConfig;

// Environment helpers
export const getEnvironment = () => NODE_ENV;
export const isProduction = () => IS_PRODUCTION;
export const isDevelopment = () => IS_DEVELOPMENT;
