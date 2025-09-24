#!/usr/bin/env node

/**
 * Graphics Generation Script
 * Generates all required graphics for the consumable alchemy game
 */

const { GraphicsGenerator } = require('../lib/graphics/graphics-generator.ts');
const fs = require('fs');
const path = require('path');

async function generateGraphics() {
  console.log('🎨 Starting Graphics Generation for Consumable Alchemy Game');
  console.log('================================================');
  
  // Check for API keys
  if (!process.env.FAL_API_KEY) {
    console.error('❌ FAL_API_KEY not found in environment variables');
    console.log('Please set your FAL.ai API key:');
    console.log('export FAL_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  const generator = GraphicsGenerator.getInstance();
  
  try {
    // Generate all graphics
    const results = await generator.generateAllGraphics();
    
    // Print results summary
    console.log('\n📊 Generation Results Summary:');
    console.log('==============================');
    
    const categories = [
      { name: 'UI Graphics', results: results.ui },
      { name: 'Character Graphics', results: results.characters },
      { name: 'Consumable Graphics', results: results.consumables },
      { name: 'Effect Graphics', results: results.effects },
      { name: 'Background Graphics', results: results.backgrounds }
    ];
    
    let totalSuccess = 0;
    let totalFailed = 0;
    
    categories.forEach(category => {
      const success = category.results.filter(r => r.success).length;
      const failed = category.results.filter(r => !r.success).length;
      
      console.log(`\n${category.name}:`);
      console.log(`  ✅ Success: ${success}`);
      console.log(`  ❌ Failed: ${failed}`);
      
      if (failed > 0) {
        console.log('  Failed items:');
        category.results
          .filter(r => !r.success)
          .forEach(r => console.log(`    - ${r.error}`));
      }
      
      totalSuccess += success;
      totalFailed += failed;
    });
    
    console.log('\n🎯 Overall Results:');
    console.log(`  ✅ Total Success: ${totalSuccess}`);
    console.log(`  ❌ Total Failed: ${totalFailed}`);
    console.log(`  📈 Success Rate: ${((totalSuccess / (totalSuccess + totalFailed)) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
      console.log('\n🎉 All graphics generated successfully!');
      console.log('Graphics are now available in /public/graphics/');
    } else {
      console.log('\n⚠️  Some graphics failed to generate. Check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Graphics generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateGraphics();
}

module.exports = { generateGraphics };
