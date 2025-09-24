import axios from 'axios';
import { Consumable, ConsumableCategory, ConsumableType, SafetyLevel, NutritionalInfo, DataSource } from '@/types';

const OPENFOODFACTS_BASE_URL = 'https://world.openfoodfacts.org/api/v0';

export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  product_name_en?: string;
  categories: string;
  categories_tags: string[];
  image_url?: string;
  image_small_url?: string;
  image_thumb_url?: string;
  ingredients_text?: string;
  ingredients_tags?: string[];
  nutriments?: {
    energy_100g?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
    'vitamin-a_100g'?: number;
    'vitamin-c_100g'?: number;
    'vitamin-d_100g'?: number;
    'vitamin-e_100g'?: number;
    'vitamin-k_100g'?: number;
    'vitamin-b1_100g'?: number;
    'vitamin-b2_100g'?: number;
    'vitamin-b6_100g'?: number;
    'vitamin-b12_100g'?: number;
    'folates_100g'?: number;
    'calcium_100g'?: number;
    'iron_100g'?: number;
    'magnesium_100g'?: number;
    'phosphorus_100g'?: number;
    'potassium_100g'?: number;
    'zinc_100g'?: number;
  };
  additives_tags?: string[];
  allergens_tags?: string[];
  traces_tags?: string[];
  nutrition_grade_fr?: string;
  nova_group?: number;
  ecoscore_grade?: string;
  nutriscore_grade?: string;
  labels_tags?: string[];
  brands?: string;
  countries?: string;
  stores?: string;
  packaging_tags?: string[];
  states_tags?: string[];
  last_modified_t?: number;
  created_t?: number;
}

export class OpenFoodFactsAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = OPENFOODFACTS_BASE_URL;
  }

  async searchProducts(query: string, limit: number = 20): Promise<Consumable[]> {
    try {
      console.log(`OpenFoodFacts API: Searching for "${query}"`);
      
      // Try actual search API first
      try {
        const searchResponse = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
          params: {
            search_terms: query,
            json: 1,
            page_size: limit,
            page: 1,
          },
          timeout: 10000, // 10 second timeout
        });

        const products = searchResponse.data.products || [];
        console.log(`OpenFoodFacts API: Found ${products.length} products via search`);
        
        // Return actual results (even if empty) - don't fallback to mock data
        return products.map((product: OpenFoodFactsProduct) => this.mapToConsumable(product));
      } catch (searchError) {
        console.log('Search API failed, trying fallback...', searchError);
        
        // Only fallback to mock data if API call actually failed
        console.log('Using mock products for demonstration');
        const mockProducts = this.generateMockProducts(query, limit);
        
        console.log(`OpenFoodFacts API: Generated ${mockProducts.length} mock products`);
        return mockProducts;
      }
    } catch (error) {
      console.error('Error searching OpenFoodFacts:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }

  /**
   * Generate mock products based on search query
   */
  private generateMockProducts(query: string, limit: number): Consumable[] {
    const mockProducts: Consumable[] = [];
    const queryLower = query.toLowerCase();
    
    // Common food items that might match the query
    const commonFoods = [
      { name: 'Chocolate Bar', category: 'food', calories: 250, protein: 3, carbs: 30, fat: 15 },
      { name: 'Apple', category: 'food', calories: 80, protein: 0.3, carbs: 21, fat: 0.2 },
      { name: 'Banana', category: 'food', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
      { name: 'Orange Juice', category: 'beverage', calories: 110, protein: 2, carbs: 26, fat: 0.5 },
      { name: 'Coffee', category: 'beverage', calories: 5, protein: 0.3, carbs: 0, fat: 0.1 },
      { name: 'Milk', category: 'beverage', calories: 150, protein: 8, carbs: 12, fat: 8 },
      { name: 'Bread', category: 'food', calories: 80, protein: 3, carbs: 15, fat: 1 },
      { name: 'Rice', category: 'food', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
      { name: 'Chicken Breast', category: 'food', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { name: 'Salmon', category: 'food', calories: 208, protein: 25, carbs: 0, fat: 12 },
    ];

    // Filter foods that might match the query
    const matchingFoods = commonFoods.filter(food => 
      food.name.toLowerCase().includes(queryLower) ||
      food.category.toLowerCase().includes(queryLower) ||
      queryLower.includes(food.name.toLowerCase()) ||
      queryLower.includes(food.category.toLowerCase())
    );

    // If no matches, return some general foods
    const foodsToUse = matchingFoods.length > 0 ? matchingFoods : commonFoods.slice(0, 3);

    // Generate mock products
    for (let i = 0; i < Math.min(foodsToUse.length, limit); i++) {
      const food = foodsToUse[i];
      mockProducts.push({
        id: `mock_${Date.now()}_${i}`,
        name: food.name,
        category: food.category as any,
        type: food.category === 'beverage' ? 'liquid' : 'solid',
        safetyLevel: 'safe' as any,
        source: 'mock',
        nutritionalInfo: {
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
        },
        description: `Mock ${food.name} for demonstration purposes`,
        tags: [food.category, 'mock'],
        effects: [],
        interactions: [],
        ingredients: [],
        image: undefined,
        barcode: `MOCK${Date.now()}${i}`,
      });
    }

    return mockProducts;
  }

  async getProductByBarcode(barcode: string): Promise<Consumable | null> {
    try {
      const response = await axios.get(`${this.baseURL}/product/${barcode}.json`);
      
      if (response.data.status === 0) {
        return null;
      }

      return this.mapToConsumable(response.data.product);
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      return null;
    }
  }

  async getProductByCategory(category: string, limit: number = 20): Promise<Consumable[]> {
    try {
      const response = await axios.get(`${this.baseURL}/cgi/search.pl`, {
        params: {
          tagtype_0: 'categories',
          tag_contains_0: 'contains',
          tag_0: category,
          action: 'process',
          json: 1,
          page_size: limit,
          page: 1,
        },
      });

      const products = response.data.products || [];
      return products.map((product: OpenFoodFactsProduct) => this.mapToConsumable(product));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error('Failed to fetch products by category');
    }
  }

  private mapToConsumable(product: OpenFoodFactsProduct): Consumable {
    const category = this.mapCategory(product.categories_tags || []);
    const type = this.mapType(product);
    const safetyLevel = this.mapSafetyLevel(product);
    const nutritionalInfo = this.mapNutritionalInfo(product.nutriments);

    return {
      id: product.code,
      name: product.product_name || product.product_name_en || 'Unknown Product',
      category,
      type,
      image: product.image_url || product.image_small_url || product.image_thumb_url,
      description: this.generateDescription(product),
      ingredients: product.ingredients_tags || [],
      nutritionalInfo,
      safetyLevel,
      effects: this.generateEffects(product),
      interactions: [],
      tags: this.generateTags(product),
      barcode: product.code,
      source: 'openfoodfacts' as DataSource,
    };
  }

  private mapCategory(categories: string[]): ConsumableCategory {
    const categoryMap: Record<string, ConsumableCategory> = {
      'en:beverages': 'beverage',
      'en:alcoholic-beverages': 'alcohol',
      'en:food': 'food',
      'en:snacks': 'food',
      'en:dairy': 'food',
      'en:meat': 'food',
      'en:fish': 'food',
      'en:vegetables': 'food',
      'en:fruits': 'food',
      'en:cereals': 'food',
      'en:herbs': 'herb',
      'en:spices': 'herb',
      'en:supplements': 'supplement',
      'en:medicines': 'medication',
    };

    for (const category of categories) {
      const mapped = categoryMap[category];
      if (mapped) return mapped;
    }

    return 'food';
  }

  private mapType(product: OpenFoodFactsProduct): ConsumableType {
    const name = (product.product_name || '').toLowerCase();
    
    if (name.includes('drink') || name.includes('juice') || name.includes('water')) {
      return 'liquid';
    }
    if (name.includes('powder') || name.includes('flour')) {
      return 'powder';
    }
    if (name.includes('capsule') || name.includes('pill')) {
      return 'capsule';
    }
    if (name.includes('tablet')) {
      return 'tablet';
    }
    
    return 'solid';
  }

  private mapSafetyLevel(product: OpenFoodFactsProduct): SafetyLevel {
    const additives = product.additives_tags || [];
    const allergens = product.allergens_tags || [];
    const traces = product.traces_tags || [];
    const novaGroup = product.nova_group || 0;
    const nutritionGrade = product.nutrition_grade_fr;

    // Check for dangerous additives
    const dangerousAdditives = additives.some(additive => 
      additive.includes('en:e') && 
      ['e621', 'e951', 'e952', 'e954'].some(dangerous => additive.includes(dangerous))
    );

    // Check for allergens
    const hasAllergens = allergens.length > 0;

    // Check nutrition grade
    const isUnhealthy = nutritionGrade === 'd' || nutritionGrade === 'e';

    // Check NOVA group (ultra-processed foods)
    const isUltraProcessed = novaGroup === 4;

    if (dangerousAdditives || hasAllergens) {
      return 'warning';
    }
    if (isUnhealthy || isUltraProcessed) {
      return 'caution';
    }

    return 'safe';
  }

  private mapNutritionalInfo(nutriments: any): NutritionalInfo | undefined {
    if (!nutriments) return undefined;

    return {
      calories: nutriments.energy_100g,
      protein: nutriments.proteins_100g,
      carbs: nutriments.carbohydrates_100g,
      fat: nutriments.fat_100g,
      fiber: nutriments.fiber_100g,
      sugar: nutriments.sugars_100g,
      sodium: nutriments.sodium_100g,
      vitamins: {
        'Vitamin A': nutriments['vitamin-a_100g'],
        'Vitamin C': nutriments['vitamin-c_100g'],
        'Vitamin D': nutriments['vitamin-d_100g'],
        'Vitamin E': nutriments['vitamin-e_100g'],
        'Vitamin K': nutriments['vitamin-k_100g'],
        'Vitamin B1': nutriments['vitamin-b1_100g'],
        'Vitamin B2': nutriments['vitamin-b2_100g'],
        'Vitamin B6': nutriments['vitamin-b6_100g'],
        'Vitamin B12': nutriments['vitamin-b12_100g'],
        'Folate': nutriments['folates_100g'],
      },
      minerals: {
        'Calcium': nutriments.calcium_100g,
        'Iron': nutriments.iron_100g,
        'Magnesium': nutriments.magnesium_100g,
        'Phosphorus': nutriments.phosphorus_100g,
        'Potassium': nutriments.potassium_100g,
        'Zinc': nutriments.zinc_100g,
      },
    };
  }

  private generateDescription(product: OpenFoodFactsProduct): string {
    const parts = [];
    
    if (product.brands) {
      parts.push(`Brand: ${product.brands}`);
    }
    
    if (product.countries) {
      parts.push(`Origin: ${product.countries}`);
    }
    
    if (product.packaging_tags && product.packaging_tags.length > 0) {
      parts.push(`Packaging: ${product.packaging_tags.join(', ')}`);
    }

    return parts.join(' • ');
  }

  private generateEffects(product: OpenFoodFactsProduct): any[] {
    const effects = [];
    
    // Add effects based on nutritional content
    if (product.nutriments) {
      if (product.nutriments.energy_100g && product.nutriments.energy_100g > 300) {
        effects.push({
          id: 'high-energy',
          name: 'High Energy',
          description: 'Provides significant energy boost',
          intensity: 'moderate',
          duration: 120,
          category: 'metabolic',
          positive: true,
        });
      }
      
      if (product.nutriments.proteins_100g && product.nutriments.proteins_100g > 10) {
        effects.push({
          id: 'protein-rich',
          name: 'Protein Rich',
          description: 'High protein content for muscle support',
          intensity: 'mild',
          duration: 180,
          category: 'physical',
          positive: true,
        });
      }
    }

    return effects;
  }

  private generateTags(product: OpenFoodFactsProduct): string[] {
    const tags = [];
    
    if (product.labels_tags) {
      tags.push(...product.labels_tags.map(tag => tag.replace('en:', '')));
    }
    
    if (product.nutrition_grade_fr) {
      tags.push(`nutri-score-${product.nutrition_grade_fr}`);
    }
    
    if (product.nova_group) {
      tags.push(`nova-group-${product.nova_group}`);
    }
    
    if (product.ecoscore_grade) {
      tags.push(`ecoscore-${product.ecoscore_grade}`);
    }

    return tags;
  }
}

export const openFoodFactsAPI = new OpenFoodFactsAPI();
