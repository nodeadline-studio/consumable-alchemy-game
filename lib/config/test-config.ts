/**
 * Test Configuration Utility
 * Centralized test configuration using environment variables
 */

import { getQaTestUrl } from './ports';

/**
 * Get the QA test URL from environment variables
 */
export function getTestUrl(): string {
  return getQaTestUrl();
}

/**
 * Get test configuration
 */
export function getTestConfig() {
  return {
    url: getTestUrl(),
    timeout: parseInt(process.env.TEST_TIMEOUT || '30000', 10),
    viewport: {
      width: parseInt(process.env.TEST_VIEWPORT_WIDTH || '1280', 10),
      height: parseInt(process.env.TEST_VIEWPORT_HEIGHT || '720', 10),
    },
    headless: process.env.TEST_HEADLESS !== 'false',
    slowMo: parseInt(process.env.TEST_SLOW_MO || '0', 10),
  };
}
