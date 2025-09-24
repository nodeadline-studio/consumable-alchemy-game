'use client';

import { useState, useEffect, useRef } from 'react';

interface Consumable {
  id: string;
  name: string;
  category: string;
  safetyLevel: string;
  description: string;
  image: string;
}

export default function SearchInterfaceMinimal() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Consumable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryRef = useRef('');

  const handleSearch = (searchQuery?: string) => {
    const currentQuery = searchQuery || queryRef.current;
    console.log('Search button clicked! Query:', currentQuery);
    
    if (!currentQuery.trim()) {
      console.log('Query is empty, not searching');
      return;
    }
    
    console.log('Starting search for:', currentQuery);
    setIsLoading(true);
    setResults([]);
    
    // Simulate search with mock data
    setTimeout(() => {
      console.log('Search completed with mock data');
      const mockResults: Consumable[] = [
        {
          id: '1',
          name: 'Apple',
          category: 'food',
          safetyLevel: 'safe',
          description: 'A healthy fruit',
          image: '/placeholder.jpg'
        },
        {
          id: '2',
          name: 'Banana',
          category: 'food',
          safetyLevel: 'safe',
          description: 'A yellow fruit',
          image: '/placeholder.jpg'
        }
      ];
      setResults(mockResults);
      setIsLoading(false);
      console.log('Mock results set:', mockResults.length);
    }, 1000);
  };

  // Add event listener to handle clicks on SPAN elements that cover the button
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      console.log('Click detected on:', target.tagName, target.textContent);
      
      if (target.textContent?.includes('Search')) {
        console.log('Search element clicked, triggering search');
        // Get the current input value directly from the DOM
        const input = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (input) {
          const currentQuery = input.value;
          console.log('Current input value:', currentQuery);
          if (currentQuery.trim()) {
            queryRef.current = currentQuery;
            setQuery(currentQuery);
            handleSearch(currentQuery);
          } else {
            console.log('Input is empty, not searching');
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-white">Search Consumables</h2>
        <p className="text-xl text-white/70">Find food, drinks, supplements, and more</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name, barcode, or category..."
            className="w-full px-4 py-3 pl-12 pr-32 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-white">Searching...</div>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <div key={item.id} className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
              <p className="text-white/70 mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-400 capitalize">{item.category}</span>
                <span className="text-sm text-green-400 capitalize">{item.safetyLevel}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && results.length === 0 && query && (
        <div className="text-center py-8">
          <div className="text-white/70">No results found for "{query}"</div>
        </div>
      )}
    </div>
  );
}
