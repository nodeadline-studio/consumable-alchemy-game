/**
 * Fallback Graphics Generator
 * Creates simple SVG graphics as placeholders when AI generation is not available
 * These are high-quality, professional-looking graphics that don't look AI-generated
 */

export interface FallbackGraphic {
  id: string;
  svg: string;
  width: number;
  height: number;
}

export class FallbackGraphicsGenerator {
  private static instance: FallbackGraphicsGenerator;

  private constructor() {}

  static getInstance(): FallbackGraphicsGenerator {
    if (!FallbackGraphicsGenerator.instance) {
      FallbackGraphicsGenerator.instance = new FallbackGraphicsGenerator();
    }
    return FallbackGraphicsGenerator.instance;
  }

  /**
   * Generate all fallback graphics
   */
  generateAllGraphics(): FallbackGraphic[] {
    return [
      ...this.generateUIGraphics(),
      ...this.generateCharacterGraphics(),
      ...this.generateConsumableGraphics(),
      ...this.generateEffectGraphics(),
      ...this.generateBackgroundGraphics()
    ];
  }

  /**
   * Generate UI graphics
   */
  private generateUIGraphics(): FallbackGraphic[] {
    return [
      {
        id: 'flask-main',
        width: 128,
        height: 128,
        svg: `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flaskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M64 20 L64 40 L80 40 L80 60 L88 60 L88 100 C88 110 80 118 70 118 L58 118 C48 118 40 110 40 100 L40 60 L48 60 L48 40 L64 40 Z" fill="url(#flaskGradient)" filter="url(#glow)"/>
          <circle cx="64" cy="50" r="4" fill="#E0E7FF" opacity="0.8"/>
          <circle cx="64" cy="70" r="3" fill="#E0E7FF" opacity="0.6"/>
          <circle cx="64" cy="85" r="2" fill="#E0E7FF" opacity="0.4"/>
        </svg>`
      },
      {
        id: 'flask-experiment',
        width: 96,
        height: 96,
        svg: `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="experimentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
            </linearGradient>
            <filter id="bubble">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M48 16 L48 32 L60 32 L60 48 L68 48 L68 80 C68 88 62 94 54 94 L42 94 C34 94 28 88 28 80 L28 48 L36 48 L36 32 L48 32 Z" fill="url(#experimentGradient)"/>
          <circle cx="48" cy="40" r="3" fill="#E0E7FF" opacity="0.9" filter="url(#bubble)"/>
          <circle cx="48" cy="55" r="2" fill="#E0E7FF" opacity="0.7" filter="url(#bubble)"/>
          <circle cx="48" cy="68" r="1.5" fill="#E0E7FF" opacity="0.5" filter="url(#bubble)"/>
          <path d="M44 20 L52 20 M44 24 L52 24" stroke="#E0E7FF" stroke-width="1" opacity="0.6"/>
        </svg>`
      },
      {
        id: 'safety-shield',
        width: 64,
        height: 64,
        svg: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
            </linearGradient>
            <filter id="shieldGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M32 8 L48 16 L48 32 C48 40 44 48 32 56 C20 48 16 40 16 32 L16 16 Z" fill="url(#shieldGradient)" filter="url(#shieldGlow)"/>
          <path d="M28 32 L30 34 L36 28" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      },
      {
        id: 'danger-warning',
        width: 64,
        height: 64,
        svg: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
            </linearGradient>
            <filter id="warningGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M32 8 L56 48 L8 48 Z" fill="url(#warningGradient)" filter="url(#warningGlow)"/>
          <path d="M32 20 L32 36 M32 40 L32 44" stroke="white" stroke-width="3" stroke-linecap="round"/>
        </svg>`
      }
    ];
  }

  /**
   * Generate character graphics
   */
  private generateCharacterGraphics(): FallbackGraphic[] {
    return [
      {
        id: 'alchemist-avatar',
        width: 64,
        height: 64,
        svg: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="alchemistGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="24" r="12" fill="#FBBF24"/>
          <path d="M20 40 L44 40 L40 56 L24 56 Z" fill="url(#alchemistGradient)"/>
          <circle cx="28" cy="20" r="2" fill="#1F2937"/>
          <circle cx="36" cy="20" r="2" fill="#1F2937"/>
          <path d="M28 28 Q32 32 36 28" stroke="#1F2937" stroke-width="2" fill="none"/>
          <rect x="30" y="8" width="4" height="8" fill="#8B5CF6"/>
          <circle cx="32" cy="12" r="6" fill="none" stroke="#8B5CF6" stroke-width="2"/>
        </svg>`
      },
      {
        id: 'lab-assistant',
        width: 48,
        height: 48,
        svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="assistantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#E0E7FF;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#C7D2FE;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="18" r="10" fill="url(#assistantGradient)"/>
          <rect x="18" y="28" width="12" height="16" rx="2" fill="url(#assistantGradient)"/>
          <circle cx="20" cy="16" r="2" fill="#3B82F6"/>
          <circle cx="28" cy="16" r="2" fill="#3B82F6"/>
          <path d="M20 22 Q24 26 28 22" stroke="#3B82F6" stroke-width="1.5" fill="none"/>
          <rect x="22" y="6" width="4" height="6" fill="#8B5CF6"/>
        </svg>`
      }
    ];
  }

  /**
   * Generate consumable graphics
   */
  private generateConsumableGraphics(): FallbackGraphic[] {
    return [
      {
        id: 'apple',
        width: 64,
        height: 64,
        svg: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M32 8 C28 8 24 12 24 16 C24 20 28 24 32 24 C36 24 40 20 40 16 C40 12 36 8 32 8 Z M32 24 C32 32 36 40 40 48 C40 52 36 56 32 56 C28 56 24 52 24 48 C28 40 32 32 32 24 Z" fill="url(#appleGradient)"/>
          <path d="M30 8 L32 4 L34 8" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
        </svg>`
      },
      {
        id: 'apple-glow',
        width: 64,
        height: 64,
        svg: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="appleGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
            </linearGradient>
            <filter id="appleGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M32 8 C28 8 24 12 24 16 C24 20 28 24 32 24 C36 24 40 20 40 16 C40 12 36 8 32 8 Z M32 24 C32 32 36 40 40 48 C40 52 36 56 32 56 C28 56 24 52 24 48 C28 40 32 32 32 24 Z" fill="url(#appleGlowGradient)" filter="url(#appleGlow)"/>
          <path d="M30 8 L32 4 L34 8" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
        </svg>`
      },
      {
        id: 'coffee-cup',
        width: 64,
        height: 64,
        svg: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#92400E;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#78350F;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M16 16 L16 40 C16 44 20 48 24 48 L32 48 C36 48 40 44 40 40 L40 16 Z" fill="url(#coffeeGradient)"/>
          <path d="M40 20 L44 20 L44 24 L40 24 Z" fill="url(#coffeeGradient)"/>
          <path d="M18 18 L38 18 L38 38 L18 38 Z" fill="#F59E0B" opacity="0.3"/>
          <circle cx="28" cy="28" r="2" fill="#92400E" opacity="0.6"/>
          <circle cx="32" cy="32" r="1.5" fill="#92400E" opacity="0.4"/>
        </svg>`
      },
      {
        id: 'aspirin-pill',
        width: 32,
        height: 32,
        svg: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F9FAFB;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#E5E7EB;stop-opacity:1" />
            </linearGradient>
          </defs>
          <ellipse cx="16" cy="16" rx="12" ry="6" fill="url(#pillGradient)"/>
          <path d="M8 16 L24 16" stroke="#9CA3AF" stroke-width="1"/>
          <circle cx="12" cy="16" r="1" fill="#9CA3AF"/>
          <circle cx="20" cy="16" r="1" fill="#9CA3AF"/>
        </svg>`
      },
      {
        id: 'aspirin-glow',
        width: 32,
        height: 32,
        svg: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pillGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F9FAFB;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#E5E7EB;stop-opacity:1" />
            </linearGradient>
            <filter id="pillGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <ellipse cx="16" cy="16" rx="12" ry="6" fill="url(#pillGlowGradient)" filter="url(#pillGlow)"/>
          <path d="M8 16 L24 16" stroke="#3B82F6" stroke-width="1"/>
          <circle cx="12" cy="16" r="1" fill="#3B82F6"/>
          <circle cx="20" cy="16" r="1" fill="#3B82F6"/>
        </svg>`
      }
    ];
  }

  /**
   * Generate effect graphics
   */
  private generateEffectGraphics(): FallbackGraphic[] {
    return [
      {
        id: 'sparkle',
        width: 32,
        height: 32,
        svg: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="sparkleGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M16 4 L18 14 L28 16 L18 18 L16 28 L14 18 L4 16 L14 14 Z" fill="#FBBF24" filter="url(#sparkleGlow)"/>
          <circle cx="16" cy="16" r="2" fill="#F59E0B"/>
        </svg>`
      },
      {
        id: 'smoke',
        width: 64,
        height: 64,
        svg: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="smokeBlur">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="32" cy="48" r="8" fill="#E5E7EB" opacity="0.6" filter="url(#smokeBlur)"/>
          <circle cx="28" cy="40" r="6" fill="#E5E7EB" opacity="0.4" filter="url(#smokeBlur)"/>
          <circle cx="36" cy="36" r="4" fill="#E5E7EB" opacity="0.3" filter="url(#smokeBlur)"/>
          <circle cx="32" cy="32" r="3" fill="#E5E7EB" opacity="0.2" filter="url(#smokeBlur)"/>
        </svg>`
      },
      {
        id: 'explosion',
        width: 96,
        height: 96,
        svg: `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="explosionGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M48 8 L56 24 L72 16 L64 32 L80 24 L72 40 L88 32 L80 48 L88 56 L72 48 L80 64 L72 56 L64 72 L56 64 L48 80 L40 64 L32 72 L24 64 L32 48 L16 56 L24 48 L16 40 L24 32 L16 24 L32 16 L24 24 L32 8 Z" fill="#F59E0B" filter="url(#explosionGlow)"/>
          <path d="M48 8 L56 24 L72 16 L64 32 L80 24 L72 40 L88 32 L80 48 L88 56 L72 48 L80 64 L72 56 L64 72 L56 64 L48 80 L40 64 L32 72 L24 64 L32 48 L16 56 L24 48 L16 40 L24 32 L16 24 L32 16 L24 24 L32 8 Z" fill="#EF4444" opacity="0.7"/>
        </svg>`
      },
      {
        id: 'steam',
        width: 32,
        height: 32,
        svg: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="steamBlur">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="16" cy="24" r="4" fill="#E5E7EB" opacity="0.6" filter="url(#steamBlur)"/>
          <circle cx="14" cy="20" r="3" fill="#E5E7EB" opacity="0.4" filter="url(#steamBlur)"/>
          <circle cx="18" cy="18" r="2" fill="#E5E7EB" opacity="0.3" filter="url(#steamBlur)"/>
        </svg>`
      }
    ];
  }

  /**
   * Generate background graphics
   */
  private generateBackgroundGraphics(): FallbackGraphic[] {
    return [
      {
        id: 'lab-background',
        width: 512,
        height: 512,
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="labBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1E293B;stop-opacity:0.1" />
              <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0.05" />
            </linearGradient>
          </defs>
          <rect width="512" height="512" fill="url(#labBgGradient)"/>
          <circle cx="128" cy="128" r="2" fill="#3B82F6" opacity="0.3"/>
          <circle cx="384" cy="192" r="1.5" fill="#8B5CF6" opacity="0.4"/>
          <circle cx="256" cy="320" r="1" fill="#3B82F6" opacity="0.2"/>
          <circle cx="96" cy="384" r="2.5" fill="#8B5CF6" opacity="0.3"/>
          <circle cx="416" cy="96" r="1" fill="#3B82F6" opacity="0.4"/>
        </svg>`
      },
      {
        id: 'particle-bg',
        width: 512,
        height: 512,
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="particleGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="64" cy="64" r="1" fill="#3B82F6" opacity="0.6" filter="url(#particleGlow)"/>
          <circle cx="192" cy="128" r="1.5" fill="#8B5CF6" opacity="0.5" filter="url(#particleGlow)"/>
          <circle cx="320" cy="96" r="1" fill="#3B82F6" opacity="0.4" filter="url(#particleGlow)"/>
          <circle cx="448" cy="160" r="1.5" fill="#8B5CF6" opacity="0.6" filter="url(#particleGlow)"/>
          <circle cx="128" cy="256" r="1" fill="#3B82F6" opacity="0.3" filter="url(#particleGlow)"/>
          <circle cx="256" cy="320" r="1.5" fill="#8B5CF6" opacity="0.5" filter="url(#particleGlow)"/>
          <circle cx="384" cy="384" r="1" fill="#3B82F6" opacity="0.4" filter="url(#particleGlow)"/>
          <circle cx="96" cy="416" r="1.5" fill="#8B5CF6" opacity="0.6" filter="url(#particleGlow)"/>
          <circle cx="320" cy="448" r="1" fill="#3B82F6" opacity="0.3" filter="url(#particleGlow)"/>
        </svg>`
      }
    ];
  }

  /**
   * Save graphics to file system
   */
  async saveGraphics(): Promise<void> {
    const graphics = this.generateAllGraphics();
    const fs = require('fs');
    const path = require('path');

    for (const graphic of graphics) {
      try {
        // Determine category from ID
        let category = 'ui';
        if (graphic.id.includes('alchemist') || graphic.id.includes('assistant')) {
          category = 'characters';
        } else if (graphic.id.includes('apple') || graphic.id.includes('coffee') || graphic.id.includes('aspirin')) {
          category = 'consumables/food';
        } else if (graphic.id.includes('sparkle') || graphic.id.includes('smoke') || graphic.id.includes('explosion') || graphic.id.includes('steam')) {
          category = 'effects';
        } else if (graphic.id.includes('background')) {
          category = 'backgrounds';
        }

        const dir = path.join(process.cwd(), 'public', 'graphics', category);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, `${graphic.id}.svg`);
        fs.writeFileSync(filePath, graphic.svg);
        
        console.log(`✅ Saved fallback graphic: ${filePath}`);
      } catch (error) {
        console.error(`❌ Failed to save graphic ${graphic.id}:`, error);
      }
    }
  }
}
