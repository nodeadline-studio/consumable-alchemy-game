/**
 * Dynamic Icon Loader
 * Loads icons dynamically based on relevance without requiring full library
 * Supports both Lucide React icons and custom user icons
 */

import { lazy, ComponentType } from 'react';
import { InputSanitizer } from '@/lib/input-sanitization';

export interface IconMetadata {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  relevanceScore?: number;
  isUserCreated?: boolean;
  isPremium?: boolean;
}

export interface DynamicIconProps {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'hero';
  className?: string;
  fallback?: ComponentType<any>;
  onLoad?: (metadata: IconMetadata) => void;
  onError?: (error: Error) => void;
}

class DynamicIconLoader {
  private static instance: DynamicIconLoader;
  private iconCache = new Map<string, ComponentType<any>>();
  private metadataCache = new Map<string, IconMetadata>();
  private userIcons = new Map<string, ComponentType<any>>();
  private relevanceIndex = new Map<string, IconMetadata[]>();

  private constructor() {
    this.initializeIconMetadata();
  }

  static getInstance(): DynamicIconLoader {
    if (!DynamicIconLoader.instance) {
      DynamicIconLoader.instance = new DynamicIconLoader();
    }
    return DynamicIconLoader.instance;
  }

  /**
   * Initialize icon metadata for relevance matching
   */
  private initializeIconMetadata(): void {
    const iconMetadata: IconMetadata[] = [
      // Food & Consumable Icons
      { id: 'apple', name: 'Apple', category: 'food', keywords: ['fruit', 'healthy', 'snack', 'red'] },
      { id: 'coffee', name: 'Coffee', category: 'beverage', keywords: ['caffeine', 'hot', 'drink', 'energy'] },
      { id: 'wine', name: 'Wine', category: 'alcohol', keywords: ['alcohol', 'drink', 'red', 'white', 'bottle'] },
      { id: 'beer', name: 'Beer', category: 'alcohol', keywords: ['alcohol', 'drink', 'bottle', 'foam'] },
      { id: 'milk', name: 'Milk', category: 'beverage', keywords: ['dairy', 'white', 'drink', 'calcium'] },
      { id: 'bread', name: 'Bread', category: 'food', keywords: ['grain', 'brown', 'slice', 'carb'] },
      { id: 'fish', name: 'Fish', category: 'food', keywords: ['seafood', 'protein', 'omega', 'healthy'] },
      { id: 'carrot', name: 'Carrot', category: 'food', keywords: ['vegetable', 'orange', 'vitamin', 'healthy'] },
      
      // Medical & Safety Icons
      { id: 'pill', name: 'Pill', category: 'medication', keywords: ['medicine', 'drug', 'tablet', 'health'] },
      { id: 'syringe', name: 'Syringe', category: 'medication', keywords: ['injection', 'vaccine', 'medical', 'needle'] },
      { id: 'heart', name: 'Heart', category: 'health', keywords: ['cardio', 'health', 'love', 'pulse'] },
      { id: 'shield', name: 'Shield', category: 'safety', keywords: ['protection', 'safety', 'security', 'defense'] },
      { id: 'alert-triangle', name: 'Alert Triangle', category: 'warning', keywords: ['warning', 'danger', 'caution', 'alert'] },
      { id: 'check-circle', name: 'Check Circle', category: 'success', keywords: ['success', 'approved', 'safe', 'good'] },
      
      // Lab & Science Icons
      { id: 'flask-conical', name: 'Flask', category: 'lab', keywords: ['chemistry', 'experiment', 'lab', 'science'] },
      { id: 'zap', name: 'Zap', category: 'energy', keywords: ['electric', 'energy', 'power', 'lightning'] },
      { id: 'atom', name: 'Atom', category: 'science', keywords: ['chemistry', 'molecule', 'science', 'element'] },
      { id: 'microscope', name: 'Microscope', category: 'lab', keywords: ['research', 'lab', 'science', 'analysis'] },
      
      // UI & Action Icons
      { id: 'search', name: 'Search', category: 'ui', keywords: ['find', 'look', 'magnify', 'discover'] },
      { id: 'plus', name: 'Plus', category: 'ui', keywords: ['add', 'create', 'new', 'increase'] },
      { id: 'minus', name: 'Minus', category: 'ui', keywords: ['remove', 'delete', 'subtract', 'decrease'] },
      { id: 'star', name: 'Star', category: 'ui', keywords: ['favorite', 'rating', 'special', 'highlight'] },
      { id: 'settings', name: 'Settings', category: 'ui', keywords: ['config', 'preferences', 'gear', 'options'] },
      
      // Status Icons
      { id: 'check', name: 'Check', category: 'status', keywords: ['done', 'complete', 'success', 'yes'] },
      { id: 'x', name: 'X', category: 'status', keywords: ['close', 'cancel', 'no', 'error'] },
      { id: 'info', name: 'Info', category: 'status', keywords: ['information', 'help', 'details', 'about'] },
      { id: 'help-circle', name: 'Help Circle', category: 'status', keywords: ['question', 'help', 'support', 'guide'] }
    ];

    // Index by keywords for relevance matching
    iconMetadata.forEach(metadata => {
      this.metadataCache.set(metadata.id, metadata);
      
      metadata.keywords.forEach(keyword => {
        if (!this.relevanceIndex.has(keyword)) {
          this.relevanceIndex.set(keyword, []);
        }
        this.relevanceIndex.get(keyword)!.push(metadata);
      });
    });
  }

  /**
   * Calculate relevance score for icon based on context
   */
  private calculateRelevanceScore(icon: IconMetadata, context: string): number {
    const contextWords = context.toLowerCase().split(/\s+/);
    let score = 0;

    // Exact name match gets highest score
    if (icon.name.toLowerCase().includes(context.toLowerCase())) {
      score += 100;
    }

    // Category match gets high score
    if (contextWords.some(word => icon.category.includes(word))) {
      score += 50;
    }

    // Keyword matches
    icon.keywords.forEach(keyword => {
      if (contextWords.some(word => keyword.includes(word) || word.includes(keyword))) {
        score += 10;
      }
    });

    // User-created icons get slight boost
    if (icon.isUserCreated) {
      score += 5;
    }

    return score;
  }

  /**
   * Find most relevant icons for a given context
   */
  findRelevantIcons(context: string, limit: number = 5): IconMetadata[] {
    const sanitizedContext = InputSanitizer.sanitizeSearchQuery(context);
    const allIcons = Array.from(this.metadataCache.values());
    
    // Calculate relevance scores
    const scoredIcons = allIcons.map(icon => ({
      ...icon,
      relevanceScore: this.calculateRelevanceScore(icon, sanitizedContext)
    }));

    // Sort by relevance score and return top results
    return scoredIcons
      .filter(icon => icon.relevanceScore! > 0)
      .sort((a, b) => b.relevanceScore! - a.relevanceScore!)
      .slice(0, limit);
  }

  /**
   * Dynamically load an icon component
   */
  async loadIcon(iconName: string): Promise<ComponentType<any> | null> {
    // Check cache first
    if (this.iconCache.has(iconName)) {
      return this.iconCache.get(iconName)!;
    }

    // Check user icons
    if (this.userIcons.has(iconName)) {
      return this.userIcons.get(iconName)!;
    }

    try {
      // Try to load from Lucide React dynamically
      const iconModule = await import('lucide-react');
      const IconComponent = iconModule[iconName as keyof typeof iconModule] as ComponentType<any>;
      
      if (IconComponent) {
        this.iconCache.set(iconName, IconComponent);
        return IconComponent;
      }
    } catch (error) {
      console.warn(`Failed to load icon: ${iconName}`, error);
    }

    return null;
  }

  /**
   * Register a user-created icon component
   */
  registerUserIcon(name: string, component: ComponentType<any>, metadata: Partial<IconMetadata> = {}): void {
    const sanitizedName = InputSanitizer.sanitizeSearchQuery(name);
    
    this.userIcons.set(sanitizedName, component);
    
    // Add to metadata cache
    this.metadataCache.set(sanitizedName, {
      id: sanitizedName,
      name: sanitizedName,
      category: metadata.category || 'user',
      keywords: metadata.keywords || [sanitizedName.toLowerCase()],
      isUserCreated: true,
      isPremium: metadata.isPremium || false
    });
  }

  /**
   * Get icon metadata
   */
  getIconMetadata(iconName: string): IconMetadata | null {
    return this.metadataCache.get(iconName) || null;
  }

  /**
   * Get all available icons
   */
  getAllIcons(): IconMetadata[] {
    return Array.from(this.metadataCache.values());
  }

  /**
   * Search icons by query
   */
  searchIcons(query: string, limit: number = 10): IconMetadata[] {
    return this.findRelevantIcons(query, limit);
  }
}

export default DynamicIconLoader;
