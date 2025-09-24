'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  Camera,
  Filter,
  Grid,
  List,
  Star,
  Plus,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { Consumable, ConsumableCategory, ConsumableType, SafetyLevel, DataSource } from '@/types';
import { apiService } from '@/lib/api/api-service';
import { InputSanitizer } from '@/lib/input-sanitization';
import { useGame } from '@/contexts/GameContext';
import ConsumableCard from './visual/ConsumableCard';
import toast from 'react-hot-toast';

function SearchInterface() {
  console.log('SearchInterface component rendered at:', new Date().toISOString());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Consumable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<ConsumableCategory | 'all'>('all');
  const [selectedSafetyLevel, setSelectedSafetyLevel] = useState<SafetyLevel | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    isOnline: boolean;
    services: { openFoodFacts: boolean; foodB: boolean };
  } | null>(null);

  const gameContext = useGame();
  const addToInventory = useMemo(() => gameContext.addToInventory, [gameContext.addToInventory]);

  console.log('SearchInterface: Game Context available:', !!gameContext);
  console.log('SearchInterface: addToInventory function:', typeof addToInventory);

  useEffect(() => {
    // Check API status on component mount
    const checkAPIStatus = async () => {
      try {
        const status = await apiService.getAPIStatus();
        setApiStatus(status);
      } catch (error) {
        console.warn('Failed to check API status:', error);
      }
    };

    checkAPIStatus();
  }, []);

  const categories: { value: ConsumableCategory | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All', color: 'text-white' },
    { value: 'food', label: 'Food', color: 'text-green-400' },
    { value: 'beverage', label: 'Beverage', color: 'text-blue-400' },
    { value: 'supplement', label: 'Supplement', color: 'text-purple-400' },
    { value: 'medication', label: 'Medication', color: 'text-red-400' },
  ];

  const safetyLevels: { value: SafetyLevel | 'all'; label: string; color: string; bgColor: string }[] = [
    { value: 'all', label: 'All', color: 'text-white', bgColor: 'bg-white/10' },
    { value: 'safe', label: 'Safe', color: 'text-green-400', bgColor: 'bg-green-400/10' },
    { value: 'caution', label: 'Caution', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
    { value: 'warning', label: 'Warning', color: 'text-orange-400', bgColor: 'bg-orange-400/10' },
    { value: 'danger', label: 'Danger', color: 'text-red-400', bgColor: 'bg-red-400/10' },
    { value: 'lethal', label: 'Lethal', color: 'text-red-600', bgColor: 'bg-red-600/10' },
  ];

  const searchConsumables = useCallback(async () => {
    console.log('searchConsumables function called with query:', query);
    console.log('Current state - isLoading:', isLoading, 'query:', query);

    // Simple validation
    if (!query.trim()) {
      console.log('Query is empty, not searching');
      return;
    }

    console.log('Starting search for:', query);
    setIsLoading(true);
    setResults([]);

    try {
      // Use real API service with timeout
      console.log('🔍 Calling real API service...');
      const apiPromise = apiService.searchConsumables({
        query,
        category: selectedCategory,
        safetyLevel: selectedSafetyLevel,
        limit: 20,
        useRealAPI: true
      });
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 2000)
      );
      
      const searchResults = await Promise.race([apiPromise, timeoutPromise]);
      
      console.log(`✅ API returned ${searchResults.consumables.length} results from ${searchResults.source}`);
      console.log('API errors:', searchResults.errors);
      
      setResults(searchResults.consumables);
      setIsLoading(false);
      
      // Show success message
      if (searchResults.consumables.length > 0) {
        toast.success(`Found ${searchResults.consumables.length} results from ${searchResults.source} source`);
      } else {
        toast('No results found. Try different search terms.');
      }
      
    } catch (error) {
      console.error('❌ Search failed:', error);
      toast.error('Search failed. Please try again.');
      setIsLoading(false);
      
      // Fallback to mock data on error
      console.log('🔄 Falling back to mock data...');
      const searchTerm = query.toLowerCase();
      const mockResults: Consumable[] = [
        {
          id: '1',
          name: 'Apple',
          type: 'solid' as ConsumableType,
          category: 'food' as ConsumableCategory,
          safetyLevel: 'safe' as SafetyLevel,
          description: 'A healthy fruit rich in fiber and vitamins',
          image: '/placeholder.jpg',
          ingredients: ['water', 'fiber', 'vitamins', 'antioxidants'],
          effects: [
            { id: 'e1', name: 'Energy Boost', description: 'Provides natural energy', intensity: 'mild' as const, duration: 120, category: 'metabolic' as const, positive: true },
            { id: 'e2', name: 'Digestive Health', description: 'Improves digestion', intensity: 'moderate' as const, duration: 360, category: 'digestive' as const, positive: true }
          ],
          interactions: [],
          tags: ['fruit', 'healthy', 'fiber'],
          source: 'mock' as DataSource
        },
        {
          id: '2',
          name: 'Banana',
          type: 'solid' as ConsumableType,
          category: 'food' as ConsumableCategory,
          safetyLevel: 'safe' as SafetyLevel,
          description: 'High potassium fruit with natural sugars',
          image: '/placeholder.jpg',
          ingredients: ['potassium', 'vitamin B6', 'magnesium', 'natural sugars'],
          effects: [
            { id: 'e3', name: 'Muscle Function', description: 'Supports muscle health', intensity: 'moderate' as const, duration: 240, category: 'physical' as const, positive: true },
            { id: 'e4', name: 'Heart Health', description: 'Supports cardiovascular function', intensity: 'mild' as const, duration: 480, category: 'cardiovascular' as const, positive: true }
          ],
          interactions: [],
          tags: ['fruit', 'potassium', 'energy'],
          source: 'mock' as DataSource
        },
        {
          id: '3',
          name: 'Coffee',
          type: 'liquid' as ConsumableType,
          category: 'beverage' as ConsumableCategory,
          safetyLevel: 'caution' as SafetyLevel,
          description: 'Caffeinated beverage that can affect sleep and anxiety',
          image: '/placeholder.jpg',
          ingredients: ['caffeine', 'antioxidants', 'chlorogenic acid'],
          effects: [
            { id: 'e5', name: 'Alertness', description: 'Increases mental alertness', intensity: 'strong' as const, duration: 180, category: 'mental' as const, positive: true },
            { id: 'e6', name: 'Increased Heart Rate', description: 'Elevates heart rate', intensity: 'moderate' as const, duration: 120, category: 'cardiovascular' as const, positive: false },
            { id: 'e7', name: 'Dehydration', description: 'May cause mild dehydration', intensity: 'mild' as const, duration: 240, category: 'physical' as const, positive: false }
          ],
          interactions: [
            { id: 'i1', consumableId: '6', consumableName: 'Alcohol', type: 'synergistic' as const, severity: 'moderate' as const, description: 'May increase alcohol effects', effects: ['Increased intoxication', 'Impaired judgment'], recommendations: ['Avoid mixing', 'Monitor consumption'] },
            { id: 'i2', consumableId: '4', consumableName: 'Aspirin', type: 'pharmacokinetic' as const, severity: 'mild' as const, description: 'May affect medication absorption', effects: ['Reduced effectiveness'], recommendations: ['Take separately', 'Monitor effects'] }
          ],
          tags: ['caffeine', 'stimulant', 'beverage'],
          source: 'mock' as DataSource
        },
        {
          id: '4',
          name: 'Aspirin',
          type: 'solid' as ConsumableType,
          category: 'medication' as ConsumableCategory,
          safetyLevel: 'warning' as SafetyLevel,
          description: 'Pain reliever and anti-inflammatory medication',
          image: '/placeholder.jpg',
          ingredients: ['acetylsalicylic acid'],
          effects: [
            { id: 'e8', name: 'Pain Relief', description: 'Reduces pain and inflammation', intensity: 'strong' as const, duration: 240, category: 'physical' as const, positive: true },
            { id: 'e9', name: 'Blood Thinning', description: 'Reduces blood clotting', intensity: 'moderate' as const, duration: 10080, category: 'cardiovascular' as const, positive: false }
          ],
          interactions: [
            { id: 'i3', consumableId: '6', consumableName: 'Alcohol', type: 'additive' as const, severity: 'severe' as const, description: 'Increases bleeding risk', effects: ['Excessive bleeding', 'Bruising'], recommendations: ['Avoid alcohol', 'Monitor for bleeding'] },
            { id: 'i4', consumableId: 'warfarin', consumableName: 'Warfarin', type: 'additive' as const, severity: 'dangerous' as const, description: 'Increases bleeding risk', effects: ['Life-threatening bleeding'], recommendations: ['Medical supervision required', 'Regular blood tests'] },
            { id: 'i5', consumableId: 'ibuprofen', consumableName: 'Ibuprofen', type: 'antagonistic' as const, severity: 'moderate' as const, description: 'May reduce effectiveness', effects: ['Reduced pain relief'], recommendations: ['Take separately', 'Consider alternatives'] }
          ],
          tags: ['medication', 'pain relief', 'NSAID'],
          source: 'mock' as DataSource
        },
        {
          id: '5',
          name: 'Vitamin C',
          type: 'solid' as ConsumableType,
          category: 'supplement' as ConsumableCategory,
          safetyLevel: 'safe' as SafetyLevel,
          description: 'Essential vitamin for immune system support',
          image: '/placeholder.jpg',
          ingredients: ['ascorbic acid', 'citrus bioflavonoids'],
          effects: [
            { id: 'e10', name: 'Immune Support', description: 'Boosts immune system', intensity: 'moderate' as const, duration: 720, category: 'physical' as const, positive: true },
            { id: 'e11', name: 'Antioxidant', description: 'Fights free radicals', intensity: 'mild' as const, duration: 360, category: 'metabolic' as const, positive: true },
            { id: 'e12', name: 'Collagen Synthesis', description: 'Supports skin health', intensity: 'mild' as const, duration: 1440, category: 'physical' as const, positive: true }
          ],
          interactions: [
            { id: 'i6', consumableId: 'iron', consumableName: 'Iron Supplements', type: 'synergistic' as const, severity: 'mild' as const, description: 'Enhances iron absorption', effects: ['Improved iron uptake'], recommendations: ['Take together', 'Monitor iron levels'] }
          ],
          tags: ['vitamin', 'immune', 'antioxidant'],
          source: 'mock' as DataSource
        },
        {
          id: '6',
          name: 'Alcohol',
          type: 'liquid' as ConsumableType,
          category: 'beverage' as ConsumableCategory,
          safetyLevel: 'danger' as SafetyLevel,
          description: 'Depressant that affects the central nervous system',
          image: '/placeholder.jpg',
          ingredients: ['ethanol', 'water'],
          effects: [
            { id: 'e13', name: 'Depression', description: 'Depresses central nervous system', intensity: 'strong' as const, duration: 240, category: 'neurological' as const, positive: false },
            { id: 'e14', name: 'Liver Damage', description: 'May cause liver damage with chronic use', intensity: 'severe' as const, duration: 0, category: 'physical' as const, positive: false },
            { id: 'e15', name: 'Impaired Judgment', description: 'Reduces decision-making ability', intensity: 'moderate' as const, duration: 180, category: 'mental' as const, positive: false }
          ],
          interactions: [
            { id: 'i7', consumableId: 'meds', consumableName: 'Medications', type: 'additive' as const, severity: 'severe' as const, description: 'May increase medication effects', effects: ['Enhanced drug effects', 'Increased side effects'], recommendations: ['Avoid alcohol', 'Consult doctor'] },
            { id: 'i8', consumableId: '4', consumableName: 'Aspirin', type: 'additive' as const, severity: 'severe' as const, description: 'Increases bleeding risk', effects: ['Excessive bleeding'], recommendations: ['Avoid combination', 'Monitor for bleeding'] },
            { id: 'i9', consumableId: 'sleep', consumableName: 'Sleep Aids', type: 'additive' as const, severity: 'dangerous' as const, description: 'May cause respiratory depression', effects: ['Breathing problems', 'Unconsciousness'], recommendations: ['Never combine', 'Seek medical help'] }
          ],
          tags: ['alcohol', 'depressant', 'dangerous'],
          source: 'mock' as DataSource
        }
      ].filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm)) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        item.description.toLowerCase().includes(searchTerm)
      );
      
      console.log('Setting results:', mockResults.length, 'items');
      setResults(mockResults);
      setIsLoading(false);
      console.log('Mock results set:', mockResults.length);
      console.log('State after setResults - results length:', mockResults.length);
    }
  }, [query, isLoading, selectedCategory, selectedSafetyLevel]);

  const handleAddToInventory = (consumable: Consumable) => {
    console.log('handleAddToInventory called for:', consumable.name);
    addToInventory(consumable);
    toast.success(`Added ${consumable.name} to inventory`);
  };

  const getSafetyColor = (safetyLevel: SafetyLevel) => {
    switch (safetyLevel) {
      case 'safe':
        return 'status-safe';
      case 'caution':
        return 'status-caution';
      case 'warning':
        return 'status-warning';
      case 'danger':
        return 'status-danger';
      case 'lethal':
        return 'status-lethal';
      default:
        return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  const filteredResults = results.filter(result => {
    const categoryMatch = selectedCategory === 'all' || result.category === selectedCategory;
    const safetyMatch = selectedSafetyLevel === 'all' || result.safetyLevel === selectedSafetyLevel;
    return categoryMatch && safetyMatch;
  });

  // Debug logging
  console.log('SearchInterface Debug:', {
    query,
    results: results.length,
    filteredResults: filteredResults.length,
    selectedCategory,
    selectedSafetyLevel,
    isLoading,
    resultsData: results.map(r => ({ id: r.id, name: r.name, category: r.category })),
    filteredResultsData: filteredResults.map(r => ({ id: r.id, name: r.name, category: r.category }))
  });
  
  console.log('Rendering condition check:', {
    isLoading,
    filteredResultsLength: filteredResults.length,
    willRenderResults: !isLoading && filteredResults.length > 0
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">Search Consumables</h2>
          <p className="text-xl text-white/70">Find food, drinks, supplements, and more</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  console.log('Enter key pressed, searching...');
                  searchConsumables();
                }
              }}
              placeholder="Search by name, barcode, or category..."
              className="input-field w-full pl-12 pr-32"
              aria-label="Search for consumables"
              aria-describedby="search-description"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button
                onClick={() => {/* TODO: Implement barcode scanning */}}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label="Scan barcode"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  console.log('Search button clicked! Query:', query, 'Loading:', isLoading);
                  console.log('searchConsumables function:', typeof searchConsumables);
                  if (!isLoading) {
                    console.log('Calling searchConsumables...');
                    searchConsumables();
                  } else {
                    console.log('Search blocked - loading:', isLoading);
                  }
                }}
                disabled={isLoading}
                className="button-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="search-button"
                aria-label="Search for consumables"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* API Status Indicator */}
          {apiStatus && (
            <div className="flex items-center space-x-2 text-sm bg-white/5 rounded-lg px-3 py-2">
              <div className={`w-2 h-2 rounded-full ${apiStatus.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-white/70">
                {apiStatus.isOnline ? 'APIs Online' : 'Offline Mode'}
              </span>
            </div>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="button-secondary flex items-center space-x-2 px-4 py-2"
          >
            <Filter className="w-5 h-5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="button-secondary flex items-center space-x-2 px-4 py-2"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            <span>{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="glass-morphism rounded-xl p-6 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category.value
                        ? `${category.color} bg-white/20`
                        : 'text-white/70 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Levels */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Safety Level</h3>
              <div className="flex flex-wrap gap-2">
                {safetyLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedSafetyLevel(level.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedSafetyLevel === level.value
                        ? `${level.color} ${level.bgColor}`
                        : 'text-white/70 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : filteredResults.length > 0 ? (
          <div
            className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            } mt-8`}
          >
            {filteredResults.map((consumable) => (
              <div
                key={consumable.id}
                className="animate-fade-in"
                data-testid="consumable-card"
              >
                <ConsumableCard
                  consumable={consumable}
                  onAdd={() => {
                    console.log('ConsumableCard onAdd called for:', consumable.name);
                    handleAddToInventory(consumable);
                  }}
                />
              </div>
            ))}
          </div>
        ) : query && !isLoading ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-white/70">Try searching with different keywords or check your filters</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SearchInterface;