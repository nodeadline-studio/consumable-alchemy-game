/**
 * Input Sanitization Utilities
 * Provides functions to sanitize and validate user inputs
 */

export class InputSanitizer {
  /**
   * Sanitize search query input
   */
  static sanitizeSearchQuery(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove dangerous content with precise patterns
    let sanitized = input
      // Remove script tags and their content first (but only if they're complete tags)
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      // Remove dangerous protocols but preserve content after colon
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      // Remove other HTML tags but preserve content
      .replace(/<[^>]*>/g, '')
      // Remove event handlers
      .replace(/on\w+\s*=\s*[^;]*/gi, '')
      // Remove dangerous functions
      .replace(/eval\s*\([^)]*\)/gi, '')
      .replace(/expression\s*\([^)]*\)/gi, '')
      // Remove shell injection characters but preserve quotes in text
      .replace(/[;|&$`]/g, '')
      // Remove dangerous HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Limit length
    if (sanitized.length > 100) {
      sanitized = sanitized.substring(0, 100);
    }

    return sanitized;
  }

  /**
   * Validate search query
   */
  static validateSearchQuery(input: string): {
    isValid: boolean;
    errors: string[];
    sanitized: string;
  } {
    const errors: string[] = [];
    const sanitized = this.sanitizeSearchQuery(input);

    if (!sanitized || sanitized.length === 0) {
      errors.push('Search query cannot be empty');
    }

    if (sanitized.length < 2) {
      errors.push('Search query must be at least 2 characters long');
    }

    if (input.length > 100) {
      errors.push('Search query cannot exceed 100 characters');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /on\w+\s*=/i, // Event handlers
      /eval\s*\(/i,
      /expression\s*\(/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(input)) {
        errors.push('Search query contains potentially dangerous content');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Sanitize consumable name
   */
  static sanitizeConsumableName(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove dangerous content with precise patterns
    let sanitized = input
      // Remove script tags and their content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      // Remove dangerous protocols
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      // Remove event handlers
      .replace(/on\w+\s*=\s*[^;]*/gi, '')
      // Remove dangerous functions
      .replace(/eval\s*\([^)]*\)/gi, '')
      .replace(/expression\s*\([^)]*\)/gi, '')
      // Remove shell injection characters but preserve quotes in text
      .replace(/[;|&$`]/g, '')
      // Remove dangerous HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Limit length
    if (sanitized.length > 200) {
      sanitized = sanitized.substring(0, 200);
    }

    return sanitized;
  }

  /**
   * Validate consumable name
   */
  static validateConsumableName(input: string): {
    isValid: boolean;
    errors: string[];
    sanitized: string;
  } {
    const errors: string[] = [];
    const sanitized = this.sanitizeConsumableName(input);

    if (!sanitized || sanitized.length === 0) {
      errors.push('Consumable name cannot be empty');
    }

    if (sanitized.length < 1) {
      errors.push('Consumable name must be at least 1 character long');
    }

    if (input.length > 200) {
      errors.push('Consumable name cannot exceed 200 characters');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /on\w+\s*=/i, // Event handlers
      /eval\s*\(/i,
      /expression\s*\(/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(input)) {
        errors.push('Consumable name contains potentially dangerous content');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumericInput(input: string | number): number | null {
    if (typeof input === 'number') {
      return isNaN(input) ? null : input;
    }

    if (typeof input !== 'string') {
      return null;
    }

    // Remove non-numeric characters except decimal point and minus sign
    const sanitized = input.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(sanitized);

    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Validate numeric input
   */
  static validateNumericInput(
    input: string | number,
    min?: number,
    max?: number
  ): {
    isValid: boolean;
    errors: string[];
    value: number | null;
  } {
    const errors: string[] = [];
    const value = this.sanitizeNumericInput(input);

    if (value === null) {
      errors.push('Invalid numeric input');
      return { isValid: false, errors, value: null };
    }

    if (min !== undefined && value < min) {
      errors.push(`Value must be at least ${min}`);
    }

    if (max !== undefined && value > max) {
      errors.push(`Value must be at most ${max}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      value,
    };
  }

  /**
   * Sanitize URL input
   */
  static sanitizeUrl(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove potentially dangerous protocols
    let sanitized = input
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '')
      .trim();

    // Only add https:// if it's not already a valid URL
    if (sanitized && !sanitized.match(/^https?:\/\//)) {
      // Check if it looks like a domain
      if (sanitized.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
        sanitized = 'https://' + sanitized;
      } else {
        // If it doesn't look like a domain, return empty
        return '';
      }
    }

    return sanitized;
  }

  /**
   * Validate URL input
   */
  static validateUrl(input: string): {
    isValid: boolean;
    errors: string[];
    sanitized: string;
  } {
    const errors: string[] = [];
    const sanitized = this.sanitizeUrl(input);

    if (!input || input.length === 0) {
      errors.push('URL cannot be empty');
      return { isValid: false, errors, sanitized };
    }

    if (!sanitized || sanitized.length === 0) {
      errors.push('Invalid URL format');
      return { isValid: false, errors, sanitized };
    }

    try {
      new URL(sanitized);
    } catch {
      errors.push('Invalid URL format');
      return { isValid: false, errors, sanitized };
    }

    // Check for allowed domains (optional)
    const allowedDomains = [
      'openfoodfacts.org',
      'world.openfoodfacts.org',
      'images.openfoodfacts.org',
      'example.com', // For testing
    ];

    if (sanitized) {
      try {
        const url = new URL(sanitized);
        if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
          errors.push('URL must be from a trusted domain');
        }
      } catch {
        // Already handled above
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove all HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    sanitized = sanitized
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/');

    return sanitized.trim();
  }

  /**
   * Validate HTML content
   */
  static validateHtml(input: string): {
    isValid: boolean;
    errors: string[];
    sanitized: string;
  } {
    const errors: string[] = [];
    const sanitized = this.sanitizeHtml(input);

    if (!sanitized || sanitized.length === 0) {
      errors.push('Content cannot be empty');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /on\w+\s*=/i, // Event handlers
      /eval\s*\(/i,
      /expression\s*\(/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(input)) {
        errors.push('Content contains potentially dangerous HTML');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
    };
  }
}
