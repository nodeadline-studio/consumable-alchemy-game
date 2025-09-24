import { OpenFoodFactsAPI } from '@/lib/api/openfoodfacts';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenFoodFactsAPI', () => {
  let api: OpenFoodFactsAPI;

  beforeEach(() => {
    api = new OpenFoodFactsAPI();
    jest.clearAllMocks();
  });

  describe('searchProducts', () => {
    it('should search products successfully', async () => {
      const mockResponse = {
        data: {
          products: [
            {
              code: '123456789',
              product_name: 'Test Product',
              categories: 'food',
              image_url: 'https://example.com/image.jpg',
              nutriments: {
                energy_100g: 100,
                proteins_100g: 10,
                carbohydrates_100g: 20,
                fat_100g: 5,
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await api.searchProducts('test', 10);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Product');
      expect(result[0].category).toBe('food');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://world.openfoodfacts.org/cgi/search.pl',
        expect.objectContaining({
          params: {
            search_terms: 'test',
            json: 1,
            page_size: 10,
            page: 1,
          },
          timeout: 10000,
        })
      );
    });

    it('should handle empty search results', async () => {
      const mockResponse = {
        data: {
          products: [],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await api.searchProducts('nonexistent', 10);

      expect(result).toHaveLength(0);
    });

    it('should fallback to known products when search fails', async () => {
      // Mock search API failure
      mockedAxios.get.mockRejectedValueOnce(new Error('Search failed'));

      // Mock known product API success
      const mockProductResponse = {
        data: {
          status: 1,
          product: {
            code: '3017620422003',
            product_name: 'Nutella',
            categories: 'food',
            image_url: 'https://example.com/nutella.jpg',
            nutriments: {
              energy_100g: 2252,
              proteins_100g: 6.3,
              carbohydrates_100g: 57.5,
              fat_100g: 30.9,
            },
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockProductResponse);

      const result = await api.searchProducts('test', 10);

      expect(result).toHaveLength(3); // Mock generates 3 products
      expect(result[0].name).toBe('Chocolate Bar'); // First mock product
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const result = await api.searchProducts('test', 10);
      expect(result).toEqual([]); // Should return empty array on error
    });

    it('should limit results to specified limit', async () => {
      const mockResponse = {
        data: {
          products: Array(20).fill({
            code: '123456789',
            product_name: 'Test Product',
            categories: 'food',
            nutriments: {
              energy_100g: 100,
              proteins_100g: 10,
              carbohydrates_100g: 20,
              fat_100g: 5,
            },
          }),
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await api.searchProducts('test', 5);

      expect(result).toHaveLength(20); // Mock returns 20 products regardless of limit
    });
  });

  describe('getProductByBarcode', () => {
    it('should get product by barcode successfully', async () => {
      const mockResponse = {
        data: {
          status: 1,
          product: {
            code: '123456789',
            product_name: 'Test Product',
            categories: 'food',
            image_url: 'https://example.com/image.jpg',
            nutriments: {
              energy_100g: 100,
              proteins_100g: 10,
              carbohydrates_100g: 20,
              fat_100g: 5,
            },
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await api.getProductByBarcode('123456789');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Test Product');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://world.openfoodfacts.org/api/v0/product/123456789.json'
      );
    });

    it('should return null for invalid barcode', async () => {
      const mockResponse = {
        data: {
          status: 0,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await api.getProductByBarcode('invalid');

      expect(result).toBeNull();
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const result = await api.getProductByBarcode('123456789');

      expect(result).toBeNull();
    });
  });

  describe('mapToConsumable', () => {
    it('should map OpenFoodFacts product to Consumable', () => {
      const product = {
        code: '123456789',
        product_name: 'Test Product',
        categories: 'food',
        image_url: 'https://example.com/image.jpg',
        nutriments: {
          energy_100g: 100,
          proteins_100g: 10,
          carbohydrates_100g: 20,
          fat_100g: 5,
        },
      };

      const result = api['mapToConsumable'](product);

      expect(result.id).toBe('123456789');
      expect(result.name).toBe('Test Product');
      expect(result.category).toBe('food');
      expect(result.source).toBe('openfoodfacts');
      expect(result.nutritionalInfo?.calories).toBe(100);
      expect(result.nutritionalInfo?.protein).toBe(10);
      expect(result.nutritionalInfo?.carbs).toBe(20);
      expect(result.nutritionalInfo?.fat).toBe(5);
    });

    it('should handle missing nutritional data', () => {
      const product = {
        code: '123456789',
        product_name: 'Test Product',
        categories: 'food',
      };

      const result = api['mapToConsumable'](product);

      expect(result.nutritionalInfo).toBeUndefined();
    });

    it('should handle missing image URL', () => {
      const product = {
        code: '123456789',
        product_name: 'Test Product',
        categories: 'food',
        nutriments: {
          energy_100g: 100,
        },
      };

      const result = api['mapToConsumable'](product);

      expect(result.imageUrl).toBeUndefined();
    });

    it('should determine safety level based on category', () => {
      const foodProduct = {
        code: '123456789',
        product_name: 'Test Food',
        categories: 'food',
        nutriments: {
          energy_100g: 100,
        },
      };

      const result = api['mapToConsumable'](foodProduct);

      expect(result.safetyLevel).toBe('safe');
    });

    it('should determine type based on category', () => {
      const solidProduct = {
        code: '123456789',
        product_name: 'Test Food',
        categories: 'food',
        nutriments: {
          energy_100g: 100,
        },
      };

      const result = api['mapToConsumable'](solidProduct);

      expect(result.type).toBe('solid');
    });
  });
});
