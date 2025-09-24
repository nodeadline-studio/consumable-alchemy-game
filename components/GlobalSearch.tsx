'use client';

import { useState, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { Consumable } from '@/types';
import { apiService } from '@/lib/api/api-service';
import { useGame } from '@/contexts/GameContext';
import toast from 'react-hot-toast';

interface GlobalSearchProps {
  onSearchResult?: (consumable: Consumable) => void;
  onNavigateToLab?: () => void;
  placeholder?: string;
  showAddButton?: boolean;
}

export default function GlobalSearch({ 
  onSearchResult, 
  onNavigateToLab,
  placeholder = "Search consumables...",
  showAddButton = true 
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Consumable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const { addToInventory } = useGame();

  const searchConsumables = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    console.log('GlobalSearch: Searching for:', query);
    setIsLoading(true);
    setResults([]);

    try {
      const searchResults = await apiService.searchConsumables({
        query,
        limit: 5,
        useRealAPI: true
      });
      
      console.log(`GlobalSearch: Found ${searchResults.consumables.length} results`);
      setResults(searchResults.consumables);
      setShowResults(true);
      
    } catch (error) {
      console.error('GlobalSearch: Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleAddToInventory = (consumable: Consumable) => {
    addToInventory(consumable);
    toast.success(`Added ${consumable.name} to inventory`);
    
    // If we have a callback, call it
    if (onSearchResult) {
      onSearchResult(consumable);
    }
    
    // If we have navigation callback, call it
    if (onNavigateToLab) {
      onNavigateToLab();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchConsumables();
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
        <button
          onClick={searchConsumables}
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
        >
          {isLoading ? '...' : 'Search'}
        </button>
      </div>

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((consumable) => (
            <div
              key={consumable.id}
              className="flex items-center justify-between p-3 hover:bg-white/10 border-b border-white/10 last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {consumable.name}
                </h4>
                <p className="text-xs text-white/60 capitalize">
                  {consumable.category}
                </p>
              </div>
              
              {showAddButton && (
                <button
                  onClick={() => handleAddToInventory(consumable)}
                  className="p-1 bg-blue-500/20 hover:bg-blue-500/30 rounded transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && results.length === 0 && query.trim() && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-50 p-3">
          <p className="text-white/70 text-sm">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
