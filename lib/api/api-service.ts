/**
 * Unified API Service
 * Handles all external API calls with proper error handling and fallbacks
 */

import { Consumable, ConsumableCategory, SafetyLevel } from '@/types';
import { openFoodFactsAPI } from './openfoodfacts';
import { foodBAPI } from './foodb';
import { MOCK_CONSUMABLES } from './mock-data';

export interface APISearchOptions {
  query: string;
  category?: ConsumableCategory | 'all';
  safetyLevel?: SafetyLevel | 'all';
  limit?: number;
  useRealAPI?: boolean;
}

export interface APISearchResult {
  consumables: Consumable[];
  source: 'real' | 'mock' | 'mixed';
  totalResults: number;
  hasMore: boolean;
  errors?: string[];
}

export class APIService {
  private static instance: APIService;
  private isOnline: boolean = false;
  private lastOnlineCheck: number = 0;
  private readonly ONLINE_CHECK_INTERVAL = 30000; // 30 seconds

  private constructor() {
    this.checkOnlineStatus();
  }

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  /**
   * Check if we're online and APIs are accessible
   */
  private async checkOnlineStatus(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastOnlineCheck < this.ONLINE_CHECK_INTERVAL) {
      return this.isOnline;
    }

    try {
      // Test with a simple HEAD request to OpenFoodFacts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://world.openfoodfacts.org/api/v0/product/3017620422003.json', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      this.isOnline = response.ok;
    } catch (error) {
      console.warn('⚠️ API connectivity check failed:', error);
      this.isOnline = false;
    }

    this.lastOnlineCheck = now;
    return this.isOnline;
  }

  /**
   * Search for consumables with real API integration
   */
  async searchConsumables(options: APISearchOptions): Promise<APISearchResult> {
    const {
      query,
      category = 'all',
      safetyLevel = 'all',
      limit = 10,
      useRealAPI = true
    } = options;

    console.log(`🔍 API Service: Searching for "${query}" (Category: ${category}, Safety: ${safetyLevel})`);

    const errors: string[] = [];
    let consumables: Consumable[] = [];
    let source: 'real' | 'mock' | 'mixed' = 'mock';

    // Try real APIs if requested and online
    if (useRealAPI && await this.checkOnlineStatus()) {
      try {
        console.log('🌐 Attempting real API calls...');
        
        // Parallel API calls for better performance
        const [foodResults, compoundResults] = await Promise.allSettled([
          this.searchFoodProducts(query, limit),
          this.searchCompounds(query, limit)
        ]);

        // Process food results
        if (foodResults.status === 'fulfilled') {
          consumables.push(...foodResults.value);
          console.log(`✅ OpenFoodFacts: ${foodResults.value.length} results`);
        } else {
          errors.push(`OpenFoodFacts API failed: ${foodResults.reason}`);
          console.warn('❌ OpenFoodFacts failed:', foodResults.reason);
        }

        // Process compound results
        if (compoundResults.status === 'fulfilled') {
          consumables.push(...compoundResults.value);
          console.log(`✅ FoodB: ${compoundResults.value.length} results`);
        } else {
          errors.push(`FoodB API failed: ${compoundResults.reason}`);
          console.warn('❌ FoodB failed:', compoundResults.reason);
        }

        source = consumables.length > 0 ? 'real' : 'mock';
      } catch (error) {
        errors.push(`API service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('❌ API service error:', error);
      }
    }

    // Fallback to mock data if no real results or if offline
    if (consumables.length === 0) {
      console.log('🔄 Falling back to mock data...');
      consumables = this.searchMockData(query, category, safetyLevel, limit);
      source = 'mock';
    } else if (consumables.length < limit) {
      // Supplement with mock data if we don't have enough results
      const mockResults = this.searchMockData(query, category, safetyLevel, limit - consumables.length);
      consumables.push(...mockResults);
      source = 'mixed';
    }

    // Apply filters
    consumables = this.applyFilters(consumables, category, safetyLevel);

    // Remove duplicates and limit results
    consumables = this.deduplicateConsumables(consumables).slice(0, limit);

    console.log(`✅ Final results: ${consumables.length} consumables from ${source} source(s)`);

    return {
      consumables,
      source,
      totalResults: consumables.length,
      hasMore: consumables.length >= limit,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Search food products from OpenFoodFacts
   */
  private async searchFoodProducts(query: string, limit: number): Promise<Consumable[]> {
    try {
      const results = await openFoodFactsAPI.searchProducts(query, limit);
      return results;
    } catch (error) {
      console.error('OpenFoodFacts search failed:', error);
      throw error;
    }
  }

  /**
   * Search compounds from FoodB
   */
  private async searchCompounds(query: string, limit: number): Promise<Consumable[]> {
    try {
      const results = await foodBAPI.searchCompounds(query, limit);
      return results;
    } catch (error) {
      console.error('FoodB search failed:', error);
      throw error;
    }
  }

  /**
   * Search mock data as fallback
   */
  private searchMockData(
    query: string,
    category: ConsumableCategory | 'all',
    safetyLevel: SafetyLevel | 'all',
    limit: number
  ): Consumable[] {
    let results = [...MOCK_CONSUMABLES];

    // Filter by query
    if (query.trim()) {
      const queryLower = query.toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(queryLower) ||
        item.description?.toLowerCase().includes(queryLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(queryLower))
      );
    }

    // Apply category filter
    if (category !== 'all') {
      results = results.filter(item => item.category === category);
    }

    // Apply safety level filter
    if (safetyLevel !== 'all') {
      results = results.filter(item => item.safetyLevel === safetyLevel);
    }

    return results.slice(0, limit);
  }

  /**
   * Apply category and safety level filters
   */
  private applyFilters(
    consumables: Consumable[],
    category: ConsumableCategory | 'all',
    safetyLevel: SafetyLevel | 'all'
  ): Consumable[] {
    let filtered = [...consumables];

    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (safetyLevel !== 'all') {
      filtered = filtered.filter(item => item.safetyLevel === safetyLevel);
    }

    return filtered;
  }

  /**
   * Remove duplicate consumables based on name and category
   */
  private deduplicateConsumables(consumables: Consumable[]): Consumable[] {
    const seen = new Set<string>();
    return consumables.filter(item => {
      const key = `${item.name.toLowerCase()}-${item.category}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Get API status
   */
  async getAPIStatus(): Promise<{
    isOnline: boolean;
    lastCheck: number;
    services: {
      openFoodFacts: boolean;
      foodB: boolean;
    };
  }> {
    const isOnline = await this.checkOnlineStatus();
    
    // Test individual services
    const services = {
      openFoodFacts: false,
      foodB: false
    };

    if (isOnline) {
      try {
        // Quick test of OpenFoodFacts
        const response = await fetch('https://world.openfoodfacts.org/api/v0/product/3017620422003.json', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        services.openFoodFacts = response.ok;
      } catch (error) {
        console.warn('OpenFoodFacts status check failed:', error);
      }

      // Skip FoodB API check due to CORS issues in development
      if (process.env.NODE_ENV !== 'development') {
        try {
          // Quick test of FoodB - use a more reliable endpoint
          const response = await fetch('https://foodb.ca/api/v1/compound?limit=1', {
            method: 'GET',
            cache: 'no-cache',
            mode: 'cors'
          });
          services.foodB = response.ok;
        } catch (error) {
          console.warn('FoodB status check failed (CORS or network issue):', error);
          services.foodB = false; // Explicitly set to false on error
        }
      } else {
        services.foodB = false; // Disabled in development due to CORS
      }
    }

    return {
      isOnline,
      lastCheck: this.lastOnlineCheck,
      services
    };
  }
}

// Export singleton instance
export const apiService = APIService.getInstance();
