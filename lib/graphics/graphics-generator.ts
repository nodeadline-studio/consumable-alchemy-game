/**
 * Graphics Generator
 * Automated graphics generation using FAL.ai and Replicate APIs
 * Optimized for high-quality, non-AI-looking graphics
 */

export interface GraphicsGenerationRequest {
  prompt: string;
  style: 'realistic' | 'cartoon' | 'minimalist' | 'scientific' | 'modern';
  size: 'small' | 'medium' | 'large' | 'hero';
  background: 'transparent' | 'solid' | 'gradient';
  quality: 'standard' | 'high' | 'ultra';
  format: 'png' | 'svg';
}

export interface GraphicsGenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    model: string;
    generationTime: number;
    cost: number;
  };
}

export class GraphicsGenerator {
  private static instance: GraphicsGenerator;
  private falApiKey: string;
  private replicateApiKey: string;

  private constructor() {
    this.falApiKey = process.env.FAL_API_KEY || '';
    this.replicateApiKey = process.env.REPLICATE_API_KEY || '';
  }

  static getInstance(): GraphicsGenerator {
    if (!GraphicsGenerator.instance) {
      GraphicsGenerator.instance = new GraphicsGenerator();
    }
    return GraphicsGenerator.instance;
  }

  /**
   * Generate UI graphics (flasks, shields, warnings)
   */
  async generateUIGraphics(): Promise<GraphicsGenerationResult[]> {
    const uiGraphics = [
      {
        id: 'flask-main',
        prompt: 'Modern alchemy flask, glass laboratory equipment, blue and purple gradient, floating particles, scientific illustration, clean lines, transparent background, high quality, professional',
        style: 'scientific' as const,
        size: 'hero' as const
      },
      {
        id: 'flask-experiment',
        prompt: 'Experiment flask with bubbling liquid, laboratory glassware, purple and blue colors, steam effects, scientific equipment, transparent background, detailed illustration',
        style: 'scientific' as const,
        size: 'large' as const
      },
      {
        id: 'safety-shield',
        prompt: 'Safety shield icon, green protective barrier, medical safety symbol, clean minimalist design, transparent background, professional healthcare icon',
        style: 'minimalist' as const,
        size: 'medium' as const
      },
      {
        id: 'danger-warning',
        prompt: 'Danger warning icon, red warning triangle, exclamation mark, safety alert symbol, clean design, transparent background, professional warning icon',
        style: 'minimalist' as const,
        size: 'medium' as const
      }
    ];

    const results: GraphicsGenerationResult[] = [];
    
    for (const graphic of uiGraphics) {
      try {
        const result = await this.generateGraphic({
          prompt: graphic.prompt,
          style: graphic.style,
          size: graphic.size,
          background: 'transparent',
          quality: 'high',
          format: 'png'
        });
        
        if (result.success) {
          // Save the generated image
          await this.saveGraphic(graphic.id, result.imageUrl!, 'ui');
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: `Failed to generate ${graphic.id}: ${error}`
        });
      }
    }

    return results;
  }

  /**
   * Generate character graphics
   */
  async generateCharacterGraphics(): Promise<GraphicsGenerationResult[]> {
    const characterGraphics = [
      {
        id: 'alchemist-avatar',
        prompt: 'Friendly alchemist character, modern scientist, lab coat, goggles, holding flask, blue and purple theme, cartoon style, transparent background, professional illustration',
        style: 'cartoon' as const,
        size: 'medium' as const
      },
      {
        id: 'lab-assistant',
        prompt: 'Lab assistant character, helpful robot assistant, modern design, blue and white colors, friendly expression, transparent background, clean illustration',
        style: 'modern' as const,
        size: 'small' as const
      }
    ];

    const results: GraphicsGenerationResult[] = [];
    
    for (const graphic of characterGraphics) {
      try {
        const result = await this.generateGraphic({
          prompt: graphic.prompt,
          style: graphic.style,
          size: graphic.size,
          background: 'transparent',
          quality: 'high',
          format: 'png'
        });
        
        if (result.success) {
          await this.saveGraphic(graphic.id, result.imageUrl!, 'characters');
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: `Failed to generate ${graphic.id}: ${error}`
        });
      }
    }

    return results;
  }

  /**
   * Generate consumable graphics
   */
  async generateConsumableGraphics(): Promise<GraphicsGenerationResult[]> {
    const consumableGraphics = [
      {
        id: 'apple',
        prompt: 'Fresh red apple, realistic food photography, clean white background, high quality, professional food image, transparent background',
        style: 'realistic' as const,
        size: 'medium' as const,
        category: 'food'
      },
      {
        id: 'apple-glow',
        prompt: 'Glowing red apple, magical effect, blue and purple glow, fantasy food, transparent background, high quality illustration',
        style: 'cartoon' as const,
        size: 'medium' as const,
        category: 'food'
      },
      {
        id: 'coffee-cup',
        prompt: 'Coffee cup with steam, realistic beverage, ceramic mug, warm colors, transparent background, professional food photography',
        style: 'realistic' as const,
        size: 'medium' as const,
        category: 'beverages'
      },
      {
        id: 'aspirin-pill',
        prompt: 'Aspirin pill, white medical tablet, pharmaceutical drug, clean design, transparent background, medical illustration',
        style: 'minimalist' as const,
        size: 'small' as const,
        category: 'medications'
      },
      {
        id: 'aspirin-glow',
        prompt: 'Glowing aspirin pill, blue medical glow, pharmaceutical drug with magical effect, transparent background, medical illustration',
        style: 'cartoon' as const,
        size: 'small' as const,
        category: 'medications'
      }
    ];

    const results: GraphicsGenerationResult[] = [];
    
    for (const graphic of consumableGraphics) {
      try {
        const result = await this.generateGraphic({
          prompt: graphic.prompt,
          style: graphic.style,
          size: graphic.size,
          background: 'transparent',
          quality: 'high',
          format: 'png'
        });
        
        if (result.success) {
          await this.saveGraphic(graphic.id, result.imageUrl!, `consumables/${graphic.category}`);
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: `Failed to generate ${graphic.id}: ${error}`
        });
      }
    }

    return results;
  }

  /**
   * Generate effect graphics
   */
  async generateEffectGraphics(): Promise<GraphicsGenerationResult[]> {
    const effectGraphics = [
      {
        id: 'sparkle',
        prompt: 'Sparkle effect, magical particles, golden sparkles, transparent background, clean effect, high quality',
        style: 'minimalist' as const,
        size: 'small' as const
      },
      {
        id: 'smoke',
        prompt: 'Smoke effect, laboratory steam, white smoke particles, transparent background, scientific effect',
        style: 'realistic' as const,
        size: 'medium' as const
      },
      {
        id: 'explosion',
        prompt: 'Explosion effect, chemical reaction, colorful burst, transparent background, scientific illustration',
        style: 'scientific' as const,
        size: 'large' as const
      },
      {
        id: 'steam',
        prompt: 'Steam effect, hot vapor, white steam particles, transparent background, clean effect',
        style: 'realistic' as const,
        size: 'small' as const
      }
    ];

    const results: GraphicsGenerationResult[] = [];
    
    for (const graphic of effectGraphics) {
      try {
        const result = await this.generateGraphic({
          prompt: graphic.prompt,
          style: graphic.style,
          size: graphic.size,
          background: 'transparent',
          quality: 'high',
          format: 'png'
        });
        
        if (result.success) {
          await this.saveGraphic(graphic.id, result.imageUrl!, 'effects');
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: `Failed to generate ${graphic.id}: ${error}`
        });
      }
    }

    return results;
  }

  /**
   * Generate background graphics
   */
  async generateBackgroundGraphics(): Promise<GraphicsGenerationResult[]> {
    const backgroundGraphics = [
      {
        id: 'lab-background',
        prompt: 'Laboratory background, scientific equipment, subtle design, blue and purple tones, professional lab setting, high quality',
        style: 'scientific' as const,
        size: 'hero' as const
      },
      {
        id: 'particle-bg',
        prompt: 'Particle background, floating particles, magical atmosphere, blue and purple particles, transparent background, subtle effect',
        style: 'minimalist' as const,
        size: 'hero' as const
      }
    ];

    const results: GraphicsGenerationResult[] = [];
    
    for (const graphic of backgroundGraphics) {
      try {
        const result = await this.generateGraphic({
          prompt: graphic.prompt,
          style: graphic.style,
          size: graphic.size,
          background: 'transparent',
          quality: 'high',
          format: 'png'
        });
        
        if (result.success) {
          await this.saveGraphic(graphic.id, result.imageUrl!, 'backgrounds');
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: `Failed to generate ${graphic.id}: ${error}`
        });
      }
    }

    return results;
  }

  /**
   * Generate a single graphic using FAL.ai
   */
  private async generateGraphic(request: GraphicsGenerationRequest): Promise<GraphicsGenerationResult> {
    try {
      // Use FAL.ai for high-quality generation
      const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.falApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: this.optimizePrompt(request),
          image_size: this.getImageSize(request.size),
          num_inference_steps: request.quality === 'ultra' ? 50 : 25,
          guidance_scale: 7.5,
          num_images: 1,
          enable_safety_checker: true,
          seed: Math.floor(Math.random() * 1000000)
        })
      });

      if (!response.ok) {
        throw new Error(`FAL.ai API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        imageUrl: data.images[0].url,
        metadata: {
          model: 'flux-schnell',
          generationTime: data.timings?.total || 0,
          cost: 0.01 // Estimated cost
        }
      };
    } catch (error) {
      console.error('Graphics generation failed:', error);
      return {
        success: false,
        error: `Generation failed: ${error}`
      };
    }
  }

  /**
   * Optimize prompt for better results
   */
  private optimizePrompt(request: GraphicsGenerationRequest): string {
    let optimizedPrompt = request.prompt;
    
    // Add quality modifiers
    optimizedPrompt += ', professional quality, high resolution, detailed, clean';
    
    // Add style-specific modifiers
    switch (request.style) {
      case 'realistic':
        optimizedPrompt += ', photorealistic, natural lighting, professional photography';
        break;
      case 'cartoon':
        optimizedPrompt += ', cartoon style, friendly, approachable, clean lines';
        break;
      case 'minimalist':
        optimizedPrompt += ', minimalist design, clean, simple, modern';
        break;
      case 'scientific':
        optimizedPrompt += ', scientific illustration, technical drawing, precise';
        break;
      case 'modern':
        optimizedPrompt += ', modern design, contemporary, sleek, professional';
        break;
    }
    
    // Add background specification
    if (request.background === 'transparent') {
      optimizedPrompt += ', transparent background, no background, isolated object';
    }
    
    // Add anti-AI modifiers to avoid common artifacts
    optimizedPrompt += ', no text, no watermarks, no signatures, no artifacts, no distortions, perfect composition';
    
    return optimizedPrompt;
  }

  /**
   * Get image size for API
   */
  private getImageSize(size: string): string {
    switch (size) {
      case 'small': return '512x512';
      case 'medium': return '768x768';
      case 'large': return '1024x1024';
      case 'hero': return '1024x1024';
      default: return '768x768';
    }
  }

  /**
   * Save generated graphic to file system
   */
  private async saveGraphic(id: string, imageUrl: string, category: string): Promise<void> {
    try {
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      
      const fs = require('fs');
      const path = require('path');
      
      const dir = path.join(process.cwd(), 'public', 'graphics', category);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const filePath = path.join(dir, `${id}.png`);
      fs.writeFileSync(filePath, Buffer.from(buffer));
      
      console.log(`Saved graphic: ${filePath}`);
    } catch (error) {
      console.error(`Failed to save graphic ${id}:`, error);
    }
  }

  /**
   * Generate all graphics
   */
  async generateAllGraphics(): Promise<{
    ui: GraphicsGenerationResult[];
    characters: GraphicsGenerationResult[];
    consumables: GraphicsGenerationResult[];
    effects: GraphicsGenerationResult[];
    backgrounds: GraphicsGenerationResult[];
  }> {
    console.log('Starting graphics generation...');
    
    const [ui, characters, consumables, effects, backgrounds] = await Promise.all([
      this.generateUIGraphics(),
      this.generateCharacterGraphics(),
      this.generateConsumableGraphics(),
      this.generateEffectGraphics(),
      this.generateBackgroundGraphics()
    ]);

    console.log('Graphics generation completed!');
    
    return {
      ui,
      characters,
      consumables,
      effects,
      backgrounds
    };
  }
}
