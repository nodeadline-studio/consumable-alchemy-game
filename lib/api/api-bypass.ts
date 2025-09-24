/**
 * API Bypass Service
 * Provides fallback functionality when external APIs are not available
 */

import { Consumable, ConsumableCategory, SafetyLevel } from '@/types';
import { MOCK_CONSUMABLES, MOCK_CATEGORIES, MOCK_SAFETY_LEVELS } from './mock-data';

export class APIBypassService {
  private static instance: APIBypassService;
  private isOnline: boolean = false;

  private constructor() {
    this.checkOnlineStatus();
  }

  static getInstance(): APIBypassService {
    if (!APIBypassService.instance) {
      APIBypassService.instance = new APIBypassService();
    }
    return APIBypassService.instance;
  }

  private async checkOnlineStatus(): Promise<void> {
    try {
      const response = await fetch('https://world.openfoodfacts.org/api/v0/product/3017620422003.json', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      this.isOnline = true;
    } catch (error) {
      this.isOnline = false;
    }
  }

  /**
   * Search for consumables with intelligent fallback
   */
  async searchConsumables(
    query: string,
    category?: ConsumableCategory | 'all',
    safetyLevel?: SafetyLevel | 'all',
    limit: number = 10
  ): Promise<Consumable[]> {
    console.log(`🔍 Searching for: "${query}" (Category: ${category}, Safety: ${safetyLevel})`);
    
    // If online, try real API first
    if (this.isOnline) {
      try {
        // This would be the real API call
        // For now, we'll use mock data
        return this.searchMockData(query, category, safetyLevel, limit);
      } catch (error) {
        console.warn('⚠️ API failed, falling back to mock data:', error);
        return this.searchMockData(query, category, safetyLevel, limit);
      }
    }

    // Use mock data
    return this.searchMockData(query, category, safetyLevel, limit);
  }

  /**
   * Search through mock data with intelligent matching
   */
  private searchMockData(
    query: string,
    category?: ConsumableCategory | 'all',
    safetyLevel?: SafetyLevel | 'all',
    limit: number = 10
  ): Consumable[] {
    const queryLower = query.toLowerCase();
    
    let results = MOCK_CONSUMABLES.filter(consumable => {
      // Text matching
      const matchesQuery = 
        consumable.name.toLowerCase().includes(queryLower) ||
        consumable.description?.toLowerCase().includes(queryLower) ||
        consumable.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
        consumable.ingredients.some(ingredient => ingredient.toLowerCase().includes(queryLower));

      // Category filtering
      const matchesCategory = category === 'all' || consumable.category === category;

      // Safety level filtering
      const matchesSafety = safetyLevel === 'all' || consumable.safetyLevel === safetyLevel;

      return matchesQuery && matchesCategory && matchesSafety;
    });

    // If no direct matches, try fuzzy matching
    if (results.length === 0) {
      results = this.fuzzySearch(queryLower, category, safetyLevel);
    }

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === queryLower;
      const bExact = b.name.toLowerCase() === queryLower;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.name.localeCompare(b.name);
    });

    return results.slice(0, limit);
  }

  /**
   * Fuzzy search for better results
   */
  private fuzzySearch(
    query: string,
    category?: ConsumableCategory | 'all',
    safetyLevel?: SafetyLevel | 'all'
  ): Consumable[] {
    const results: Consumable[] = [];
    
    // Common food mappings
    const foodMappings: Record<string, string[]> = {
      'fruit': ['apple', 'banana', 'orange', 'grape'],
      'vegetable': ['carrot', 'broccoli', 'spinach', 'tomato'],
      'meat': ['chicken', 'beef', 'pork', 'fish'],
      'dairy': ['milk', 'cheese', 'yogurt', 'butter'],
      'grain': ['bread', 'rice', 'pasta', 'cereal'],
      'drink': ['coffee', 'tea', 'juice', 'water'],
      'alcohol': ['beer', 'wine', 'whiskey', 'vodka'],
      'medication': ['aspirin', 'ibuprofen', 'tylenol', 'vitamin'],
      'supplement': ['vitamin', 'mineral', 'protein', 'omega']
    };

    // Find matching categories
    for (const [categoryKey, keywords] of Object.entries(foodMappings)) {
      if (keywords.some(keyword => query.includes(keyword))) {
        const categoryResults = MOCK_CONSUMABLES.filter(consumable => {
          const matchesCategory = category === 'all' || consumable.category === categoryKey as ConsumableCategory;
          const matchesSafety = safetyLevel === 'all' || consumable.safetyLevel === safetyLevel;
          return matchesCategory && matchesSafety;
        });
        results.push(...categoryResults);
      }
    }

    return results;
  }

  /**
   * Get consumable by ID
   */
  async getConsumableById(id: string): Promise<Consumable | null> {
    return MOCK_CONSUMABLES.find(consumable => consumable.id === id) || null;
  }

  /**
   * Get consumable by barcode
   */
  async getConsumableByBarcode(barcode: string): Promise<Consumable | null> {
    return MOCK_CONSUMABLES.find(consumable => consumable.barcode === barcode) || null;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<ConsumableCategory[]> {
    return MOCK_CATEGORIES;
  }

  /**
   * Get all safety levels
   */
  async getSafetyLevels(): Promise<SafetyLevel[]> {
    return MOCK_SAFETY_LEVELS;
  }

  /**
   * Get random consumables for discovery
   */
  async getRandomConsumables(limit: number = 5): Promise<Consumable[]> {
    const shuffled = [...MOCK_CONSUMABLES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  /**
   * Get trending consumables
   */
  async getTrendingConsumables(limit: number = 5): Promise<Consumable[]> {
    // Return most popular/commonly searched items
    const trending = MOCK_CONSUMABLES.filter(c => 
      c.tags.includes('healthy') || c.tags.includes('popular')
    );
    return trending.slice(0, limit);
  }

  /**
   * Get consumables by category
   */
  async getConsumablesByCategory(
    category: ConsumableCategory,
    limit: number = 10
  ): Promise<Consumable[]> {
    return MOCK_CONSUMABLES
      .filter(consumable => consumable.category === category)
      .slice(0, limit);
  }

  /**
   * Search with advanced filters
   */
  async searchWithFilters(filters: {
    query?: string;
    category?: ConsumableCategory | 'all';
    safetyLevel?: SafetyLevel | 'all';
    minCalories?: number;
    maxCalories?: number;
    hasCaffeine?: boolean;
    isVegetarian?: boolean;
    isGlutenFree?: boolean;
    limit?: number;
  }): Promise<Consumable[]> {
    let results = MOCK_CONSUMABLES;

    // Apply filters
    if (filters.query) {
      results = results.filter(consumable =>
        consumable.name.toLowerCase().includes(filters.query!.toLowerCase()) ||
        consumable.description?.toLowerCase().includes(filters.query!.toLowerCase())
      );
    }

    if (filters.category && filters.category !== 'all') {
      results = results.filter(consumable => consumable.category === filters.category);
    }

    if (filters.safetyLevel && filters.safetyLevel !== 'all') {
      results = results.filter(consumable => consumable.safetyLevel === filters.safetyLevel);
    }

    if (filters.minCalories !== undefined) {
      results = results.filter(consumable => 
        (consumable.nutritionalInfo?.calories || 0) >= filters.minCalories!
      );
    }

    if (filters.maxCalories !== undefined) {
      results = results.filter(consumable => 
        (consumable.nutritionalInfo?.calories || 0) <= filters.maxCalories!
      );
    }

    if (filters.hasCaffeine !== undefined) {
      results = results.filter(consumable => {
        const hasCaffeine = consumable.tags.includes('caffeine') || 
                           consumable.name.toLowerCase().includes('coffee') ||
                           consumable.name.toLowerCase().includes('tea');
        return filters.hasCaffeine ? hasCaffeine : !hasCaffeine;
      });
    }

    return results.slice(0, filters.limit || 10);
  }

  /**
   * Get API status
   */
  getStatus(): { online: boolean; fallback: boolean } {
    return {
      online: this.isOnline,
      fallback: !this.isOnline
    };
  }
}

// Export singleton instance
export const apiBypass = APIBypassService.getInstance();
