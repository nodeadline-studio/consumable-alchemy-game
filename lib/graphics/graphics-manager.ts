/**
 * Graphics Manager
 * Manages custom transparent PNGs and visual assets
 * Designed for high engagement and visual storytelling
 */

export interface GraphicAsset {
  id: string;
  src: string;
  alt: string;
  category: 'consumable' | 'effect' | 'ui' | 'background' | 'character' | 'icon';
  size: 'small' | 'medium' | 'large' | 'hero';
  animation?: 'float' | 'pulse' | 'glow' | 'rotate' | 'bounce';
  zIndex?: number;
}

export interface ConsumableGraphic {
  id: string;
  name: string;
  category: string;
  graphics: {
    main: GraphicAsset;
    hover?: GraphicAsset;
    selected?: GraphicAsset;
    effect?: GraphicAsset;
  };
}

export class GraphicsManager {
  private static instance: GraphicsManager;
  private assets: Map<string, GraphicAsset> = new Map();
  private consumableGraphics: Map<string, ConsumableGraphic> = new Map();

  private constructor() {
    this.initializeAssets();
  }

  static getInstance(): GraphicsManager {
    if (!GraphicsManager.instance) {
      GraphicsManager.instance = new GraphicsManager();
    }
    return GraphicsManager.instance;
  }

  /**
   * Initialize all graphic assets
   */
  private initializeAssets(): void {
    // UI Graphics
    this.addAsset({
      id: 'flask-main',
      src: '/graphics/ui/flask-main.svg',
      alt: 'Main Alchemy Flask',
      category: 'ui',
      size: 'hero',
      animation: 'float'
    });

    this.addAsset({
      id: 'flask-experiment',
      src: '/graphics/ui/flask-experiment.svg',
      alt: 'Experiment Flask',
      category: 'ui',
      size: 'large',
      animation: 'pulse'
    });

    this.addAsset({
      id: 'safety-shield',
      src: '/graphics/ui/safety-shield.svg',
      alt: 'Safety Shield',
      category: 'ui',
      size: 'medium',
      animation: 'glow'
    });

    this.addAsset({
      id: 'danger-warning',
      src: '/graphics/ui/danger-warning.svg',
      alt: 'Danger Warning',
      category: 'ui',
      size: 'medium',
      animation: 'pulse'
    });

    // Effect Graphics
    this.addAsset({
      id: 'sparkle-effect',
      src: '/graphics/effects/sparkle.svg',
      alt: 'Sparkle Effect',
      category: 'effect',
      size: 'small',
      animation: 'bounce'
    });

    this.addAsset({
      id: 'smoke-effect',
      src: '/graphics/effects/smoke.svg',
      alt: 'Smoke Effect',
      category: 'effect',
      size: 'medium',
      animation: 'float'
    });

    this.addAsset({
      id: 'explosion-effect',
      src: '/graphics/effects/explosion.svg',
      alt: 'Explosion Effect',
      category: 'effect',
      size: 'large',
      animation: 'bounce'
    });

    // Character Graphics
    this.addAsset({
      id: 'alchemist-avatar',
      src: '/graphics/characters/alchemist-avatar.svg',
      alt: 'Alchemist Avatar',
      category: 'character',
      size: 'medium',
      animation: 'float'
    });

    this.addAsset({
      id: 'lab-assistant',
      src: '/graphics/characters/lab-assistant.svg',
      alt: 'Lab Assistant',
      category: 'character',
      size: 'small',
      animation: 'bounce'
    });

    // Background Graphics
    this.addAsset({
      id: 'lab-background',
      src: '/graphics/backgrounds/lab-background.svg',
      alt: 'Laboratory Background',
      category: 'background',
      size: 'hero'
    });

    this.addAsset({
      id: 'particle-bg',
      src: '/graphics/backgrounds/particle-bg.svg',
      alt: 'Particle Background',
      category: 'background',
      size: 'hero'
    });

    this.initializeConsumableGraphics();
  }

  /**
   * Initialize consumable-specific graphics
   */
  private initializeConsumableGraphics(): void {
    // Food Graphics
    this.addConsumableGraphic({
      id: 'apple',
      name: 'Apple',
      category: 'food',
      graphics: {
        main: {
          id: 'apple-main',
          src: '/graphics/consumables/food/apple.svg',
          alt: 'Apple',
          category: 'consumable',
          size: 'medium',
          animation: 'float'
        },
        hover: {
          id: 'apple-hover',
          src: '/graphics/consumables/food/apple-glow.svg',
          alt: 'Glowing Apple',
          category: 'consumable',
          size: 'medium',
          animation: 'glow'
        }
      }
    });

    this.addConsumableGraphic({
      id: 'coffee',
      name: 'Coffee',
      category: 'beverage',
      graphics: {
        main: {
          id: 'coffee-main',
          src: '/graphics/consumables/beverages/coffee-cup.svg',
          alt: 'Coffee Cup',
          category: 'consumable',
          size: 'medium',
          animation: 'float'
        },
        effect: {
          id: 'coffee-steam',
          src: '/graphics/effects/steam.svg',
          alt: 'Coffee Steam',
          category: 'effect',
          size: 'small',
          animation: 'float'
        }
      }
    });

    // Medication Graphics
    this.addConsumableGraphic({
      id: 'aspirin',
      name: 'Aspirin',
      category: 'medication',
      graphics: {
        main: {
          id: 'aspirin-main',
          src: '/graphics/consumables/medications/aspirin-pill.svg',
          alt: 'Aspirin Pill',
          category: 'consumable',
          size: 'small',
          animation: 'pulse'
        },
        selected: {
          id: 'aspirin-selected',
          src: '/graphics/consumables/medications/aspirin-glow.svg',
          alt: 'Selected Aspirin',
          category: 'consumable',
          size: 'small',
          animation: 'glow'
        }
      }
    });
  }

  /**
   * Add a graphic asset
   */
  addAsset(asset: GraphicAsset): void {
    this.assets.set(asset.id, asset);
  }

  /**
   * Add consumable graphics
   */
  addConsumableGraphic(consumable: ConsumableGraphic): void {
    this.consumableGraphics.set(consumable.id, consumable);
  }

  /**
   * Get graphic asset by ID
   */
  getAsset(id: string): GraphicAsset | null {
    return this.assets.get(id) || null;
  }

  /**
   * Get consumable graphics
   */
  getConsumableGraphics(consumableId: string): ConsumableGraphic | null {
    return this.consumableGraphics.get(consumableId) || null;
  }

  /**
   * Get all assets by category
   */
  getAssetsByCategory(category: string): GraphicAsset[] {
    return Array.from(this.assets.values()).filter(asset => asset.category === category);
  }

  /**
   * Get size classes for Tailwind
   */
  getSizeClasses(size: string): string {
    const sizeMap = {
      'small': 'w-8 h-8',
      'medium': 'w-12 h-12',
      'large': 'w-16 h-16',
      'hero': 'w-24 h-24'
    };
    return sizeMap[size as keyof typeof sizeMap] || 'w-12 h-12';
  }

  /**
   * Get animation classes for Tailwind
   */
  getAnimationClasses(animation?: string): string {
    if (!animation) return '';
    
    const animationMap = {
      'float': 'animate-float',
      'pulse': 'animate-pulse',
      'glow': 'animate-glow',
      'rotate': 'animate-spin',
      'bounce': 'animate-bounce'
    };
    return animationMap[animation as keyof typeof animationMap] || '';
  }
}
