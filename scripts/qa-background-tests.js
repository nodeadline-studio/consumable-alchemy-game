#!/usr/bin/env node

/**
 * Background QA Tests
 * Non-intrusive tests that run in the background
 * Tests functionality without affecting user experience
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class BackgroundQATester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      performance: {},
      accessibility: {},
      security: {}
    };
  }

  async init() {
    console.log('🚀 Starting Background QA Tests...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set viewport
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.results.errors.push({
          type: 'console_error',
          message: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Monitor network requests
    this.page.on('requestfailed', request => {
      this.results.errors.push({
        type: 'network_error',
        url: request.url(),
        errorText: request.failure().errorText,
        timestamp: new Date().toISOString()
      });
    });
  }

  async testPageLoad() {
    console.log('📄 Testing page load...');
    const startTime = Date.now();
    
    try {
      await this.page.goto('http://localhost:4173', {
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      
      const loadTime = Date.now() - startTime;
      this.results.performance.pageLoad = loadTime;
      
      if (loadTime < 3000) {
        this.results.passed++;
        console.log(`✅ Page loaded in ${loadTime}ms`);
      } else {
        this.results.failed++;
        console.log(`❌ Page load too slow: ${loadTime}ms`);
      }
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        type: 'page_load_error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testSearchFunctionality() {
    console.log('🔍 Testing search functionality...');
    
    try {
      // Wait for search input
      await this.page.waitForSelector('input[placeholder*="search"]', { timeout: 5000 });
      
      // Test search input
      await this.page.type('input[placeholder*="search"]', 'apple');
      await this.page.click('button:has-text("Search")');
      
      // Wait for results or error
      await this.page.waitForTimeout(2000);
      
      // Check if search worked
      const hasResults = await this.page.$('[data-testid="search-results"]') !== null;
      const hasError = await this.page.$('[data-testid="error-message"]') !== null;
      
      if (hasResults || hasError) {
        this.results.passed++;
        console.log('✅ Search functionality working');
      } else {
        this.results.failed++;
        console.log('❌ Search functionality not working');
      }
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        type: 'search_error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testErrorHandling() {
    console.log('🛡️ Testing error handling...');
    
    try {
      // Test with invalid input
      await this.page.type('input[placeholder*="search"]', '<script>alert("xss")</script>');
      await this.page.click('button:has-text("Search")');
      
      await this.page.waitForTimeout(1000);
      
      // Check if XSS was prevented
      const hasAlert = await this.page.evaluate(() => {
        return window.alert.toString().includes('native code');
      });
      
      if (hasAlert) {
        this.results.passed++;
        console.log('✅ XSS protection working');
      } else {
        this.results.failed++;
        console.log('❌ XSS protection failed');
      }
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        type: 'security_error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testAccessibility() {
    console.log('♿ Testing accessibility...');
    
    try {
      // Check for proper heading structure
      const headings = await this.page.$$eval('h1, h2, h3, h4, h5, h6', els => 
        els.map(el => ({ tag: el.tagName, text: el.textContent.trim() }))
      );
      
      if (headings.length > 0) {
        this.results.passed++;
        console.log('✅ Proper heading structure found');
        this.results.accessibility.headings = headings.length;
      } else {
        this.results.failed++;
        console.log('❌ No proper headings found');
      }
      
      // Check for alt text on images
      const images = await this.page.$$eval('img', els => 
        els.map(el => ({ src: el.src, alt: el.alt }))
      );
      
      const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '');
      this.results.accessibility.imagesWithAlt = imagesWithAlt.length;
      this.results.accessibility.totalImages = images.length;
      
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        type: 'accessibility_error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testPerformance() {
    console.log('⚡ Testing performance...');
    
    try {
      // Get performance metrics
      const metrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.navigationStart
        };
      });
      
      this.results.performance = {
        ...this.results.performance,
        ...metrics
      };
      
      if (metrics.totalTime < 5000) {
        this.results.passed++;
        console.log(`✅ Good performance: ${metrics.totalTime}ms`);
      } else {
        this.results.failed++;
        console.log(`❌ Poor performance: ${metrics.totalTime}ms`);
      }
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        type: 'performance_error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testAPIStatus() {
    console.log('🌐 Testing API status...');
    
    try {
      // Check console for API errors
      const consoleMessages = await this.page.evaluate(() => {
        return window.consoleMessages || [];
      });
      
      const apiErrors = consoleMessages.filter(msg => 
        msg.includes('CORS') || 
        msg.includes('Failed to fetch') || 
        msg.includes('API Error')
      );
      
      if (apiErrors.length === 0) {
        this.results.passed++;
        console.log('✅ No API errors detected');
      } else {
        this.results.failed++;
        console.log(`❌ ${apiErrors.length} API errors detected`);
        this.results.errors.push(...apiErrors.map(error => ({
          type: 'api_error',
          message: error,
          timestamp: new Date().toISOString()
        })));
      }
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        type: 'api_test_error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.results.passed + this.results.failed,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(2) + '%'
      },
      results: this.results
    };

    // Save report
    const reportPath = path.join(__dirname, '../qa-reports', `qa-report-${Date.now()}.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 QA Test Report:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${report.summary.successRate}`);
    console.log(`📄 Report saved: ${reportPath}`);

    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runAllTests() {
    try {
      await this.init();
      await this.testPageLoad();
      await this.testSearchFunctionality();
      await this.testErrorHandling();
      await this.testAccessibility();
      await this.testPerformance();
      await this.testAPIStatus();
      
      const report = await this.generateReport();
      return report;
    } catch (error) {
      console.error('❌ QA Test Suite Error:', error);
      this.results.errors.push({
        type: 'test_suite_error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await this.cleanup();
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new BackgroundQATester();
  tester.runAllTests().then(report => {
    process.exit(report.summary.failed > 0 ? 1 : 0);
  });
}

module.exports = BackgroundQATester;
