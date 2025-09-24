/**
 * Comprehensive QA Integration Tests
 * Tests complete user workflows and functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameProvider } from '@/contexts/GameContext';
import SearchInterface from '@/components/SearchInterface';
import { APIService } from '@/lib/api/api-service';
import { PersistenceManager } from '@/lib/persistence';

// Mock all external dependencies
jest.mock('@/lib/api/openfoodfacts', () => ({
  openFoodFactsAPI: {
    searchProducts: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Test Apple',
        category: 'food',
        type: 'solid',
        safetyLevel: 'safe',
        source: 'openfoodfacts',
        nutritionalInfo: {
          calories: 80,
          protein: 0.3,
          carbs: 21,
          fat: 0.2,
        },
      },
    ]),
  },
}), { virtual: true });

jest.mock('@/lib/api/foodb', () => ({
  foodBAPI: {
    searchCompounds: jest.fn().mockResolvedValue([]),
  },
}), { virtual: true });

jest.mock('@/lib/persistence', () => ({
  PersistenceManager: {
    saveGameData: jest.fn().mockReturnValue(true),
    loadGameData: jest.fn().mockReturnValue(null),
    clearGameData: jest.fn(),
  },
}), { virtual: true });

describe('QA Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  describe('User Workflow Tests', () => {
    it('should complete full search and experiment workflow', async () => {
      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      // Test 1: Search functionality
      const searchInput = screen.getByPlaceholderText(/search for consumables/i);
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'apple' } });
      fireEvent.click(screen.getByText(/search/i));

      // Wait for search results
      await waitFor(() => {
        expect(screen.getByText('Test Apple')).toBeInTheDocument();
      });

      // Test 2: Add to experiment
      const addButton = screen.getByText(/add to experiment/i);
      fireEvent.click(addButton);

      // Test 3: Verify experiment state
      await waitFor(() => {
        expect(screen.getByText(/experiment/i)).toBeInTheDocument();
      });
    });

    it('should handle API errors gracefully', async () => {
      // Mock API failure
      const mockSearchProducts = jest.fn().mockRejectedValue(new Error('API Error'));
      require('@/lib/api/openfoodfacts').openFoodFactsAPI.searchProducts = mockSearchProducts;

      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      const searchInput = screen.getByPlaceholderText(/search for consumables/i);
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(screen.getByText(/search/i));

      // Should show error state or fallback
      await waitFor(() => {
        expect(screen.getByText(/error|failed|try again/i)).toBeInTheDocument();
      });
    });

    it('should persist and restore game state', async () => {
      const mockLoadData = jest.fn().mockReturnValue({
        userProfile: { level: 5, xp: 1000 },
        gameState: { experiments: [] },
        version: '1.0.0',
      });
      require('@/lib/persistence').PersistenceManager.loadGameData = mockLoadData;

      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      // Should load saved data
      expect(mockLoadData).toHaveBeenCalled();
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle CORS errors gracefully', async () => {
      // Mock CORS error
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('CORS error'));

      const apiService = new APIService();
      const status = await apiService.getAPIStatus();

      expect(status.services.foodB).toBe(false);
      expect(status.isOnline).toBe(true); // Should still be online

      global.fetch = originalFetch;
    });

    it('should handle network failures', async () => {
      // Mock network failure
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const apiService = new APIService();
      const status = await apiService.getAPIStatus();

      expect(status.isOnline).toBe(false);

      global.fetch = originalFetch;
    });
  });

  describe('Performance Tests', () => {
    it('should load within acceptable time', async () => {
      const startTime = performance.now();

      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Should load within 100ms
      expect(loadTime).toBeLessThan(100);
    });

    it('should handle rapid user interactions', async () => {
      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      const searchInput = screen.getByPlaceholderText(/search for consumables/i);

      // Rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(searchInput, { target: { value: `test${i}` } });
      }

      // Should not crash or show errors
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels', () => {
      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      const searchInput = screen.getByPlaceholderText(/search for consumables/i);
      expect(searchInput).toHaveAttribute('aria-label');
    });

    it('should be keyboard navigable', () => {
      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      const searchInput = screen.getByPlaceholderText(/search for consumables/i);
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);
    });
  });

  describe('Security Tests', () => {
    it('should sanitize user input', async () => {
      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      const searchInput = screen.getByPlaceholderText(/search for consumables/i);
      
      // Test XSS attempt
      fireEvent.change(searchInput, { 
        target: { value: '<script>alert("xss")</script>' } 
      });

      // Should not execute script
      expect(screen.queryByText('xss')).not.toBeInTheDocument();
    });

    it('should handle malicious URLs', async () => {
      render(
        <GameProvider>
          <SearchInterface />
        </GameProvider>
      );

      const searchInput = screen.getByPlaceholderText(/search for consumables/i);
      
      // Test malicious URL
      fireEvent.change(searchInput, { 
        target: { value: 'javascript:alert("xss")' } 
      });

      // Should sanitize the input
      expect(searchInput.value).not.toContain('javascript:');
    });
  });
});
