import { InputSanitizer } from '@/lib/input-sanitization';

describe('InputSanitizer', () => {
  describe('sanitizeSearchQuery', () => {
    it('should sanitize basic search query', () => {
      const input = 'chocolate';
      const result = InputSanitizer.sanitizeSearchQuery(input);
      expect(result).toBe('chocolate');
    });

    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>chocolate';
      const result = InputSanitizer.sanitizeSearchQuery(input);
      expect(result).toBe('chocolate');
    });

    it('should remove shell injection characters', () => {
      const input = 'chocolate; rm -rf /';
      const result = InputSanitizer.sanitizeSearchQuery(input);
      expect(result).toBe('chocolate rm -rf /');
    });

    it('should remove javascript protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = InputSanitizer.sanitizeSearchQuery(input);
      expect(result).toBe('alert("xss")');
    });

    it('should remove data protocol', () => {
      const input = 'data:text/html,<script>alert("xss")</script>';
      const result = InputSanitizer.sanitizeSearchQuery(input);
      expect(result).toBe('text/html,'); // Script content should be removed for security
    });

    it('should limit length to 100 characters', () => {
      const input = 'a'.repeat(150);
      const result = InputSanitizer.sanitizeSearchQuery(input);
      expect(result.length).toBe(100);
    });

    it('should handle empty input', () => {
      const result = InputSanitizer.sanitizeSearchQuery('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = InputSanitizer.sanitizeSearchQuery(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = InputSanitizer.sanitizeSearchQuery(undefined as any);
      expect(result).toBe('');
    });

    it('should trim whitespace', () => {
      const input = '  chocolate  ';
      const result = InputSanitizer.sanitizeSearchQuery(input);
      expect(result).toBe('chocolate');
    });
  });

  describe('validateSearchQuery', () => {
    it('should validate correct search query', () => {
      const result = InputSanitizer.validateSearchQuery('chocolate');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.sanitized).toBe('chocolate');
    });

    it('should reject empty search query', () => {
      const result = InputSanitizer.validateSearchQuery('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query cannot be empty');
    });

    it('should reject too short search query', () => {
      const result = InputSanitizer.validateSearchQuery('a');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query must be at least 2 characters long');
    });

    it('should reject too long search query', () => {
      const result = InputSanitizer.validateSearchQuery('a'.repeat(150));
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query cannot exceed 100 characters');
    });

    it('should detect script tags', () => {
      const result = InputSanitizer.validateSearchQuery('<script>alert("xss")</script>');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query contains potentially dangerous content');
    });

    it('should detect javascript protocol', () => {
      const result = InputSanitizer.validateSearchQuery('javascript:alert("xss")');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query contains potentially dangerous content');
    });

    it('should detect data protocol', () => {
      const result = InputSanitizer.validateSearchQuery('data:text/html,<script>alert("xss")</script>');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query contains potentially dangerous content');
    });

    it('should detect event handlers', () => {
      const result = InputSanitizer.validateSearchQuery('onclick=alert("xss")');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query contains potentially dangerous content');
    });

    it('should detect eval function', () => {
      const result = InputSanitizer.validateSearchQuery('eval(alert("xss"))');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query contains potentially dangerous content');
    });

    it('should detect expression function', () => {
      const result = InputSanitizer.validateSearchQuery('expression(alert("xss"))');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query contains potentially dangerous content');
    });
  });

  describe('sanitizeConsumableName', () => {
    it('should sanitize basic consumable name', () => {
      const input = 'Chocolate Bar';
      const result = InputSanitizer.sanitizeConsumableName(input);
      expect(result).toBe('Chocolate Bar');
    });

    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Chocolate Bar';
      const result = InputSanitizer.sanitizeConsumableName(input);
      expect(result).toBe('Chocolate Bar');
    });

    it('should remove shell injection characters', () => {
      const input = 'Chocolate Bar; rm -rf /';
      const result = InputSanitizer.sanitizeConsumableName(input);
      expect(result).toBe('Chocolate Bar rm -rf /');
    });

    it('should limit length to 200 characters', () => {
      const input = 'a'.repeat(250);
      const result = InputSanitizer.sanitizeConsumableName(input);
      expect(result.length).toBe(200);
    });

    it('should handle empty input', () => {
      const result = InputSanitizer.sanitizeConsumableName('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = InputSanitizer.sanitizeConsumableName(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = InputSanitizer.sanitizeConsumableName(undefined as any);
      expect(result).toBe('');
    });
  });

  describe('validateConsumableName', () => {
    it('should validate correct consumable name', () => {
      const result = InputSanitizer.validateConsumableName('Chocolate Bar');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.sanitized).toBe('Chocolate Bar');
    });

    it('should reject empty consumable name', () => {
      const result = InputSanitizer.validateConsumableName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Consumable name cannot be empty');
    });

    it('should reject too long consumable name', () => {
      const result = InputSanitizer.validateConsumableName('a'.repeat(250));
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Consumable name cannot exceed 200 characters');
    });

    it('should detect script tags', () => {
      const result = InputSanitizer.validateConsumableName('<script>alert("xss")</script>Chocolate');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Consumable name contains potentially dangerous content');
    });
  });

  describe('sanitizeNumericInput', () => {
    it('should sanitize valid number string', () => {
      const result = InputSanitizer.sanitizeNumericInput('123.45');
      expect(result).toBe(123.45);
    });

    it('should sanitize valid number', () => {
      const result = InputSanitizer.sanitizeNumericInput(123.45);
      expect(result).toBe(123.45);
    });

    it('should remove non-numeric characters', () => {
      const result = InputSanitizer.sanitizeNumericInput('123abc456');
      expect(result).toBe(123456);
    });

    it('should handle decimal numbers', () => {
      const result = InputSanitizer.sanitizeNumericInput('123.45');
      expect(result).toBe(123.45);
    });

    it('should handle negative numbers', () => {
      const result = InputSanitizer.sanitizeNumericInput('-123.45');
      expect(result).toBe(-123.45);
    });

    it('should return null for invalid input', () => {
      const result = InputSanitizer.sanitizeNumericInput('abc');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = InputSanitizer.sanitizeNumericInput('');
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      const result = InputSanitizer.sanitizeNumericInput(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = InputSanitizer.sanitizeNumericInput(undefined);
      expect(result).toBeNull();
    });
  });

  describe('validateNumericInput', () => {
    it('should validate correct numeric input', () => {
      const result = InputSanitizer.validateNumericInput('123.45');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.value).toBe(123.45);
    });

    it('should validate with min constraint', () => {
      const result = InputSanitizer.validateNumericInput('50', 0);
      expect(result.isValid).toBe(true);
    });

    it('should validate with max constraint', () => {
      const result = InputSanitizer.validateNumericInput('50', 0, 100);
      expect(result.isValid).toBe(true);
    });

    it('should reject input below minimum', () => {
      const result = InputSanitizer.validateNumericInput('50', 100);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value must be at least 100');
    });

    it('should reject input above maximum', () => {
      const result = InputSanitizer.validateNumericInput('150', 0, 100);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value must be at most 100');
    });

    it('should reject invalid numeric input', () => {
      const result = InputSanitizer.validateNumericInput('abc');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid numeric input');
      expect(result.value).toBeNull();
    });
  });

  describe('sanitizeUrl', () => {
    it('should sanitize valid URL', () => {
      const input = 'https://example.com';
      const result = InputSanitizer.sanitizeUrl(input);
      expect(result).toBe('https://example.com');
    });

    it('should add https protocol if missing', () => {
      const input = 'example.com';
      const result = InputSanitizer.sanitizeUrl(input);
      expect(result).toBe('https://example.com');
    });

    it('should remove javascript protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = InputSanitizer.sanitizeUrl(input);
      expect(result).toBe('');
    });

    it('should remove data protocol', () => {
      const input = 'data:text/html,<script>alert("xss")</script>';
      const result = InputSanitizer.sanitizeUrl(input);
      expect(result).toBe('');
    });

    it('should remove vbscript protocol', () => {
      const input = 'vbscript:msgbox("xss")';
      const result = InputSanitizer.sanitizeUrl(input);
      expect(result).toBe('');
    });

    it('should handle empty input', () => {
      const result = InputSanitizer.sanitizeUrl('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = InputSanitizer.sanitizeUrl(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = InputSanitizer.sanitizeUrl(undefined as any);
      expect(result).toBe('');
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URL', () => {
      const result = InputSanitizer.validateUrl('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.sanitized).toBe('https://example.com');
    });

    it('should reject empty URL', () => {
      const result = InputSanitizer.validateUrl('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URL cannot be empty');
    });

    it('should reject invalid URL format', () => {
      const result = InputSanitizer.validateUrl('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid URL format');
    });

    it('should reject untrusted domains', () => {
      const result = InputSanitizer.validateUrl('https://malicious.com');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URL must be from a trusted domain');
    });

    it('should accept trusted domains', () => {
      const result = InputSanitizer.validateUrl('https://openfoodfacts.org');
      expect(result.isValid).toBe(true);
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove HTML tags', () => {
      const input = '<p>Hello <strong>world</strong>!</p>';
      const result = InputSanitizer.sanitizeHtml(input);
      expect(result).toBe('Hello world!');
    });

    it('should decode HTML entities', () => {
      const input = 'Hello &lt;world&gt;!';
      const result = InputSanitizer.sanitizeHtml(input);
      expect(result).toBe('Hello <world>!');
    });

    it('should handle empty input', () => {
      const result = InputSanitizer.sanitizeHtml('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = InputSanitizer.sanitizeHtml(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = InputSanitizer.sanitizeHtml(undefined as any);
      expect(result).toBe('');
    });

    it('should trim whitespace', () => {
      const input = '  Hello world!  ';
      const result = InputSanitizer.sanitizeHtml(input);
      expect(result).toBe('Hello world!');
    });
  });

  describe('validateHtml', () => {
    it('should validate clean HTML content', () => {
      const result = InputSanitizer.validateHtml('Hello world!');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.sanitized).toBe('Hello world!');
    });

    it('should reject empty content', () => {
      const result = InputSanitizer.validateHtml('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content cannot be empty');
    });

    it('should detect script tags', () => {
      const result = InputSanitizer.validateHtml('<script>alert("xss")</script>');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content contains potentially dangerous HTML');
    });

    it('should detect javascript protocol', () => {
      const result = InputSanitizer.validateHtml('javascript:alert("xss")');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content contains potentially dangerous HTML');
    });

    it('should detect event handlers', () => {
      const result = InputSanitizer.validateHtml('onclick=alert("xss")');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Content contains potentially dangerous HTML');
    });
  });
});
