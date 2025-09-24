import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchInterface from '@/components/SearchInterface';
import { GameProvider } from '@/contexts/GameContext';

// Mock the API services
jest.mock('@/lib/api/openfoodfacts', () => ({
  openFoodFactsAPI: {
    searchProducts: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Test Food',
        category: 'food',
        type: 'solid',
        safetyLevel: 'safe',
        source: 'openfoodfacts',
        nutritionalInfo: {
          calories: 100,
          protein: 10,
          carbs: 20,
          fat: 5,
        },
      },
    ]),
  },
}), { virtual: true });

jest.mock('@/lib/api/foodb', () => ({
  foodBAPI: {
    searchCompounds: jest.fn().mockResolvedValue([
      {
        id: '2',
        name: 'Test Compound',
        category: 'supplement',
        type: 'powder',
        safetyLevel: 'safe',
        source: 'foodb',
      },
    ]),
  },
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

describe('SearchInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search interface', () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    expect(screen.getByPlaceholderText(/search for consumables/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should handle search input', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });
  });

  it('should show loading state during search', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.click(searchButton);

    // Should show loading state
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('should handle empty search query', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // Should not perform search
    expect(screen.queryByText('Test Food')).not.toBeInTheDocument();
  });

  it('should handle search errors', async () => {
    const { openFoodFactsAPI } = require('@/lib/api/openfoodfacts');
    openFoodFactsAPI.searchProducts.mockRejectedValueOnce(new Error('API Error'));

    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Food')).not.toBeInTheDocument();
    });
  });

  it('should filter results by safety level', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });

    // Test safety level filter
    const safetyFilter = screen.getByRole('button', { name: /safe/i });
    fireEvent.click(safetyFilter);

    // Results should be filtered
    expect(screen.getByText('Test Food')).toBeInTheDocument();
  });

  it('should filter results by category', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });

    // Test category filter
    const categoryFilter = screen.getByRole('button', { name: /food/i });
    fireEvent.click(categoryFilter);

    // Results should be filtered
    expect(screen.getByText('Test Food')).toBeInTheDocument();
  });

  it('should add consumable to inventory', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });

    // Click add to inventory button
    const addButton = screen.getByRole('button', { name: /add to inventory/i });
    fireEvent.click(addButton);

    // Should show success message
    expect(screen.getByText(/added to inventory/i)).toBeInTheDocument();
  });

  it('should toggle view mode', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });

    // Toggle to list view
    const listViewButton = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listViewButton);

    // Should show list view
    expect(screen.getByText('Test Food')).toBeInTheDocument();
  });

  it('should clear search results', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.click(searchButton);

    // Results should be cleared
    expect(screen.queryByText('Test Food')).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);

    // Test Enter key
    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });
  });

  it('should show no results message when no results found', async () => {
    const { openFoodFactsAPI } = require('@/lib/api/openfoodfacts');
    openFoodFactsAPI.searchProducts.mockResolvedValueOnce([]);

    render(
      <GameProvider>
        <SearchInterface />
      </GameProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search for consumables/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });
});
