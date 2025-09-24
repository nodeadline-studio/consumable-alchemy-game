#!/usr/bin/env node

/**
 * Fallback Graphics Generation Script
 * Generates high-quality SVG graphics as placeholders
 */

const { FallbackGraphicsGenerator } = require('../lib/graphics/fallback-graphics.ts');

async function generateFallbackGraphics() {
  console.log('🎨 Generating Fallback Graphics for Consumable Alchemy Game');
  console.log('=======================================================');
  
  const generator = FallbackGraphicsGenerator.getInstance();
  
  try {
    await generator.saveGraphics();
    console.log('\n🎉 All fallback graphics generated successfully!');
    console.log('Graphics are now available in /public/graphics/');
    console.log('\n📁 Generated graphics:');
    console.log('  - UI Graphics: flasks, shields, warnings');
    console.log('  - Character Graphics: alchemist, lab assistant');
    console.log('  - Consumable Graphics: apple, coffee, aspirin');
    console.log('  - Effect Graphics: sparkles, smoke, explosions');
    console.log('  - Background Graphics: lab background, particles');
  } catch (error) {
    console.error('❌ Fallback graphics generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateFallbackGraphics();
}

module.exports = { generateFallbackGraphics };
