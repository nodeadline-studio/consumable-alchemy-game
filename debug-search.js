const puppeteer = require('puppeteer');

async function debugSearch() {
  console.log('🔍 DEBUGGING SEARCH FUNCTIONALITY');
  console.log('==================================');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        console.log(`📱 Console: ${msg.text()}`);
      }
    });
    
    console.log('📱 Loading application...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test search functionality
    console.log('\n🔍 Testing Search Functionality');
    
    // Type in search
    const searchInput = await page.$('input[type="text"]');
    if (searchInput) {
      await searchInput.type('apple');
      console.log('✅ Typed search query: apple');
      
      // Click search button
      const searchButton = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Search')
        );
      });
      
      if (searchButton.asElement()) {
        await searchButton.asElement().click();
        console.log('✅ Clicked search button');
        
        // Wait for results
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check what's in the DOM
        const domInfo = await page.evaluate(() => {
          const allText = document.body.textContent;
          const results = document.querySelectorAll('[class*="grid"], [class*="space-y"]');
          const consumableCards = document.querySelectorAll('[data-testid="consumable-card"]');
          const plusButtons = document.querySelectorAll('button svg[data-lucide="plus"]');
          
          return {
            hasApple: allText.includes('Apple'),
            hasResults: allText.includes('results') || allText.includes('found'),
            resultsContainers: results.length,
            consumableCards: consumableCards.length,
            plusButtons: plusButtons.length,
            allText: allText.substring(0, 1000) // First 1000 chars
          };
        });
        
        console.log(`✅ DOM Info: ${JSON.stringify(domInfo, null, 2)}`);
      }
    }
    
    console.log('\n🎯 DEBUG COMPLETE');
    console.log('=================');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugSearch().catch(console.error);
