#!/usr/bin/env node

/**
 * Script to update all test files to use environment-based port configuration
 */

const fs = require('fs');
const path = require('path');

const testFiles = [
  'test-api-search.js',
  'test-search-display.js', 
  'test-complete-functionality.js',
  'test-full-game-flow.js',
  'test-lab-functionality.js',
  'test-simple-lab.js',
  'test-core-functionality.js',
  'test-navigation.js',
  'e2e-test.js'
];

const oldPattern = /const puppeteer = require\('puppeteer'\);/;
const newPattern = `const puppeteer = require('puppeteer');
const { getTestConfig } = require('./lib/config/test-config');`;

const oldBrowserPattern = /const browser = await puppeteer\.launch\(\{[\s\S]*?\}\);/;
const newBrowserPattern = `const testConfig = getTestConfig();
  console.log(\`📱 Using test URL: \${testConfig.url}\`);
  
  const browser = await puppeteer.launch({ 
    headless: testConfig.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: testConfig.slowMo
  });`;

const oldPagePattern = /await page\.setViewport\(\{ width: \d+, height: \d+ \}\);/;
const newPagePattern = `await page.setViewport(testConfig.viewport);`;

const oldGotoPattern = /await page\.goto\('http:\/\/localhost:\d+', \{[\s\S]*?\}\);/;
const newGotoPattern = `await page.goto(testConfig.url, { waitUntil: 'domcontentloaded', timeout: testConfig.timeout });`;

function updateTestFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update imports
    if (content.includes("const puppeteer = require('puppeteer');") && !content.includes('getTestConfig')) {
      content = content.replace(oldPattern, newPattern);
    }
    
    // Update browser launch
    if (content.includes('puppeteer.launch({')) {
      content = content.replace(oldBrowserPattern, newBrowserPattern);
    }
    
    // Update viewport
    if (content.includes('setViewport({ width:')) {
      content = content.replace(oldPagePattern, newPagePattern);
    }
    
    // Update goto
    if (content.includes('page.goto(\'http://localhost:')) {
      content = content.replace(oldGotoPattern, newGotoPattern);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🔄 Updating test files to use environment-based port configuration...');

testFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    updateTestFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('✅ Test files updated successfully!');
console.log('\n📝 Usage:');
console.log('  Set QA_PORT=3001 in your environment');
console.log('  Run: QA_PORT=3001 node test-api-search.js');
console.log('  Or: npm run dev:qa (uses QA_PORT env var)');
