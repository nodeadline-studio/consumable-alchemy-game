'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import DynamicIconLoader, { IconMetadata } from '@/lib/icons/dynamic-icon-loader';
import UserComponentStorage from '@/lib/storage/user-component-storage';

interface DynamicIconProps {
  name: string;
  context?: string; // Context for relevance matching
  size?: 'small' | 'medium' | 'large' | 'hero';
  className?: string;
  fallback?: React.ComponentType<any>;
  showRelevance?: boolean;
  onLoad?: (metadata: IconMetadata) => void;
  onError?: (error: Error) => void;
}

export default function DynamicIcon({
  name,
  context = '',
  size = 'medium',
  className = '',
  fallback: FallbackComponent,
  showRelevance = false,
  onLoad,
  onError
}: DynamicIconProps) {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null);
  const [metadata, setMetadata] = useState<IconMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const iconLoader = DynamicIconLoader.getInstance();
  const userStorage = UserComponentStorage.getInstance();

  useEffect(() => {
    loadIcon();
  }, [name, context]);

  const loadIcon = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, try to find the most relevant icon
      let iconName = name;
      if (context) {
        const relevantIcons = iconLoader.findRelevantIcons(context, 1);
        if (relevantIcons.length > 0) {
          iconName = relevantIcons[0].id;
          setMetadata(relevantIcons[0]);
        }
      }

      // Try to load the icon
      let component = await iconLoader.loadIcon(iconName);
      
      // If not found in Lucide, try user components
      if (!component) {
        const userComponent = await userStorage.getComponent(iconName);
        if (userComponent) {
          // For now, we'll use a placeholder for user components
          // In a real implementation, you'd render the actual component data
          component = () => (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-xs">
              {userComponent.name}
            </div>
          );
          setMetadata({
            id: userComponent.id,
            name: userComponent.name,
            category: userComponent.category,
            keywords: userComponent.metadata.tags,
            isUserCreated: true,
            isPremium: userComponent.metadata.isPremium
          });
        }
      }

      if (component) {
        setIconComponent(() => component);
        if (metadata) {
          onLoad?.(metadata);
        }
      } else {
        throw new Error(`Icon "${iconName}" not found`);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    const sizeMap = {
      'small': 'w-4 h-4',
      'medium': 'w-6 h-6',
      'large': 'w-8 h-8',
      'hero': 'w-12 h-12'
    };
    return sizeMap[size];
  };

  if (isLoading) {
    return (
      <div className={`${getSizeClasses()} ${className} animate-pulse`}>
        <div className="w-full h-full bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (error && FallbackComponent) {
    return <FallbackComponent className={className} />;
  }

  if (error) {
    return (
      <div className={`${getSizeClasses()} ${className} text-red-500`} title={error.message}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    );
  }

  if (!IconComponent) {
    return null;
  }

  return (
    <motion.div
      className={`${getSizeClasses()} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <IconComponent className="w-full h-full" />
      {showRelevance && metadata && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" 
             title={`Relevance: ${metadata.relevanceScore || 0}`} />
      )}
    </motion.div>
  );
}

// Hook for using dynamic icons
export function useDynamicIcon(name: string, context?: string) {
  const [icon, setIcon] = useState<React.ComponentType<any> | null>(null);
  const [metadata, setMetadata] = useState<IconMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        setIsLoading(true);
        const iconLoader = DynamicIconLoader.getInstance();
        
        let iconName = name;
        if (context) {
          const relevantIcons = iconLoader.findRelevantIcons(context, 1);
          if (relevantIcons.length > 0) {
            iconName = relevantIcons[0].id;
            setMetadata(relevantIcons[0]);
          }
        }

        const component = await iconLoader.loadIcon(iconName);
        if (component) {
          setIcon(() => component);
        } else {
          throw new Error(`Icon "${iconName}" not found`);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIcon();
  }, [name, context]);

  return { icon, metadata, isLoading, error };
}

// Component for icon search and selection
export function IconSearch({ onSelect, context = '' }: { onSelect: (icon: IconMetadata) => void; context?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IconMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const iconLoader = DynamicIconLoader.getInstance();

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
      const searchResults = iconLoader.searchIcons(query, 10);
      setResults(searchResults);
      setIsSearching(false);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search for icons..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      {isSearching && (
        <div className="text-center text-gray-500">Searching...</div>
      )}
      
      {results.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {results.map((icon) => (
            <button
              key={icon.id}
              onClick={() => onSelect(icon)}
              className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              title={`${icon.name} (${icon.category})`}
            >
              <DynamicIcon name={icon.id} size="small" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
