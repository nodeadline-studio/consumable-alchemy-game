/**
 * Secure User Component Storage
 * Handles secure storage and retrieval of user-created components
 * Includes validation, sanitization, and security measures
 */

import { InputSanitizer } from '@/lib/input-sanitization';
import CryptoJS from 'crypto-js';

export interface UserComponent {
  id: string;
  name: string;
  type: 'icon' | 'graphic' | 'animation' | 'layout';
  category: string;
  data: string; // Base64 encoded component data
  metadata: {
    created: Date;
    modified: Date;
    version: string;
    author: string;
    tags: string[];
    isPublic: boolean;
    isPremium: boolean;
    securityLevel: 'low' | 'medium' | 'high';
    size: number;
    checksum: string;
  };
  permissions: {
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
    allowedUsers: string[];
  };
}

export interface ComponentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData?: string;
}

class UserComponentStorage {
  private static instance: UserComponentStorage;
  private components = new Map<string, UserComponent>();
  private encryptionKey: string;
  private maxFileSize = 5 * 1024 * 1024; // 5MB
  private allowedTypes = ['icon', 'graphic', 'animation', 'layout'];
  private securityLevels = ['low', 'medium', 'high'];

  private constructor() {
    this.encryptionKey = this.generateEncryptionKey();
    this.loadStoredComponents();
  }

  static getInstance(): UserComponentStorage {
    if (!UserComponentStorage.instance) {
      UserComponentStorage.instance = new UserComponentStorage();
    }
    return UserComponentStorage.instance;
  }

  /**
   * Generate encryption key for secure storage
   */
  private generateEncryptionKey(): string {
    // In production, this should come from environment variables
    const storedKey = localStorage.getItem('user_component_encryption_key');
    if (storedKey) {
      return storedKey;
    }
    
    const newKey = CryptoJS.lib.WordArray.random(256/8).toString();
    localStorage.setItem('user_component_encryption_key', newKey);
    return newKey;
  }

  /**
   * Encrypt component data
   */
  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  /**
   * Decrypt component data
   */
  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Generate checksum for data integrity
   */
  private generateChecksum(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Validate component data
   */
  private validateComponent(component: Partial<UserComponent>): ComponentValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!component.name || component.name.trim().length === 0) {
      errors.push('Component name is required');
    }

    if (!component.type || !this.allowedTypes.includes(component.type)) {
      errors.push('Invalid component type');
    }

    if (!component.data || component.data.length === 0) {
      errors.push('Component data is required');
    }

    // Validate data size
    if (component.data && component.data.length > this.maxFileSize) {
      errors.push(`Component data exceeds maximum size of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Validate security level
    if (component.metadata?.securityLevel && !this.securityLevels.includes(component.metadata.securityLevel)) {
      errors.push('Invalid security level');
    }

    // Sanitize name
    if (component.name) {
      const sanitizedName = InputSanitizer.sanitizeSearchQuery(component.name);
      if (sanitizedName !== component.name) {
        warnings.push('Component name was sanitized for security');
      }
    }

    // Validate data format based on type
    if (component.type === 'icon' && component.data) {
      try {
        // Check if it's valid SVG or base64
        if (!component.data.startsWith('<svg') && !this.isValidBase64(component.data)) {
          errors.push('Invalid icon data format');
        }
      } catch (error) {
        errors.push('Invalid icon data format');
      }
    }

    // Check for malicious content
    if (component.data && this.containsMaliciousContent(component.data)) {
      errors.push('Component data contains potentially malicious content');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData: component.name ? InputSanitizer.sanitizeSearchQuery(component.name) : undefined
    };
  }

  /**
   * Check if string is valid base64
   */
  private isValidBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  /**
   * Check for malicious content
   */
  private containsMaliciousContent(data: string): boolean {
    const maliciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi
    ];

    return maliciousPatterns.some(pattern => pattern.test(data));
  }

  /**
   * Store a user component securely
   */
  async storeComponent(component: Omit<UserComponent, 'id' | 'metadata'>): Promise<{ success: boolean; id?: string; errors?: string[] }> {
    try {
      // Generate unique ID
      const id = this.generateComponentId(component.name);
      
      // Validate component
      const validation = this.validateComponent(component);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      // Encrypt data
      const encryptedData = this.encryptData(component.data);
      
      // Generate checksum
      const checksum = this.generateChecksum(component.data);

      // Create component with metadata
      const userComponent: UserComponent = {
        ...component,
        id,
        data: encryptedData,
        metadata: {
          created: new Date(),
          modified: new Date(),
          version: '1.0.0',
          author: 'user', // In production, get from auth context
          tags: [],
          isPublic: false,
          isPremium: false,
          securityLevel: 'medium',
          size: component.data.length,
          checksum
        },
        permissions: {
          canEdit: true,
          canShare: false,
          canDelete: true,
          allowedUsers: ['user'] // In production, get from auth context
        }
      };

      // Store component
      this.components.set(id, userComponent);
      
      // Persist to localStorage
      this.persistComponents();

      return { success: true, id };
    } catch (error) {
      console.error('Error storing component:', error);
      return { success: false, errors: ['Failed to store component'] };
    }
  }

  /**
   * Retrieve a user component
   */
  async getComponent(id: string): Promise<UserComponent | null> {
    const component = this.components.get(id);
    if (!component) {
      return null;
    }

    try {
      // Decrypt data
      const decryptedData = this.decryptData(component.data);
      
      // Verify checksum
      const currentChecksum = this.generateChecksum(decryptedData);
      if (currentChecksum !== component.metadata.checksum) {
        console.warn('Component data integrity check failed');
        return null;
      }

      return {
        ...component,
        data: decryptedData
      };
    } catch (error) {
      console.error('Error retrieving component:', error);
      return null;
    }
  }

  /**
   * Update a user component
   */
  async updateComponent(id: string, updates: Partial<UserComponent>): Promise<{ success: boolean; errors?: string[] }> {
    const existingComponent = this.components.get(id);
    if (!existingComponent) {
      return { success: false, errors: ['Component not found'] };
    }

    try {
      // Validate updates
      const validation = this.validateComponent(updates);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      // Encrypt new data if provided
      let encryptedData = existingComponent.data;
      if (updates.data) {
        encryptedData = this.encryptData(updates.data);
      }

      // Update component
      const updatedComponent: UserComponent = {
        ...existingComponent,
        ...updates,
        data: encryptedData,
        metadata: {
          ...existingComponent.metadata,
          ...updates.metadata,
          modified: new Date(),
          size: updates.data ? updates.data.length : existingComponent.metadata.size,
          checksum: updates.data ? this.generateChecksum(updates.data) : existingComponent.metadata.checksum
        }
      };

      this.components.set(id, updatedComponent);
      this.persistComponents();

      return { success: true };
    } catch (error) {
      console.error('Error updating component:', error);
      return { success: false, errors: ['Failed to update component'] };
    }
  }

  /**
   * Delete a user component
   */
  async deleteComponent(id: string): Promise<{ success: boolean; errors?: string[] }> {
    if (!this.components.has(id)) {
      return { success: false, errors: ['Component not found'] };
    }

    try {
      this.components.delete(id);
      this.persistComponents();
      return { success: true };
    } catch (error) {
      console.error('Error deleting component:', error);
      return { success: false, errors: ['Failed to delete component'] };
    }
  }

  /**
   * List user components
   */
  listComponents(filter?: {
    type?: string;
    category?: string;
    isPublic?: boolean;
    author?: string;
  }): UserComponent[] {
    let components = Array.from(this.components.values());

    if (filter) {
      if (filter.type) {
        components = components.filter(c => c.type === filter.type);
      }
      if (filter.category) {
        components = components.filter(c => c.category === filter.category);
      }
      if (filter.isPublic !== undefined) {
        components = components.filter(c => c.metadata.isPublic === filter.isPublic);
      }
      if (filter.author) {
        components = components.filter(c => c.metadata.author === filter.author);
      }
    }

    return components;
  }

  /**
   * Generate unique component ID
   */
  private generateComponentId(name: string): string {
    const sanitizedName = InputSanitizer.sanitizeSearchQuery(name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${sanitizedName}-${timestamp}-${random}`;
  }

  /**
   * Load components from localStorage
   */
  private loadStoredComponents(): void {
    try {
      const stored = localStorage.getItem('user_components');
      if (stored) {
        const components = JSON.parse(stored);
        components.forEach((component: UserComponent) => {
          this.components.set(component.id, component);
        });
      }
    } catch (error) {
      console.error('Error loading stored components:', error);
    }
  }

  /**
   * Persist components to localStorage
   */
  private persistComponents(): void {
    try {
      const components = Array.from(this.components.values());
      localStorage.setItem('user_components', JSON.stringify(components));
    } catch (error) {
      console.error('Error persisting components:', error);
    }
  }
}

export default UserComponentStorage;
