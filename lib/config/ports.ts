/**
 * Port Configuration Utility
 * Centralized port management for all services
 */

export interface PortConfig {
  frontend: number;
  qa: number;
  api: number;
  backend: number;
}

/**
 * Get port configuration from environment variables
 */
export function getPortConfig(): PortConfig {
  return {
    frontend: parseInt(process.env.PORT || '3000', 10),
    qa: parseInt(process.env.QA_PORT || '3001', 10),
    api: parseInt(process.env.API_PORT || '3002', 10),
    backend: parseInt(process.env.BACKEND_PORT || '3003', 10),
  };
}

/**
 * Get the current environment's base URL
 */
export function getBaseUrl(service: keyof PortConfig = 'frontend'): string {
  const ports = getPortConfig();
  const port = ports[service];
  return `http://localhost:${port}`;
}

/**
 * Get QA test URL
 */
export function getQaTestUrl(): string {
  return getBaseUrl('qa');
}

/**
 * Get API URL
 */
export function getApiUrl(): string {
  return getBaseUrl('api');
}

/**
 * Get Backend URL
 */
export function getBackendUrl(): string {
  return getBaseUrl('backend');
}

/**
 * Get Frontend URL
 */
export function getFrontendUrl(): string {
  return getBaseUrl('frontend');
}
