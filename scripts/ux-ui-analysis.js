#!/usr/bin/env node

/**
 * UX/UI Functionality Analysis
 * Tests actual vs claimed functionality
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class UXUIAnalyzer {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:4173';
    this.analysis = {
      claims: {
        searchFunctionality: 'Search for consumables by name or barcode',
        safetyAnalysis: 'Real-time safety scoring and warnings',
        gamification: 'XP, levels, achievements, and progression',
        medicalDatabase: 'Comprehensive substance interaction checking',
        responsiveDesign: 'Works on all devices',
        performance: 'Fast loading and smooth interactions',
        security: 'Robust input sanitization and validation',
        pwa: 'Progressive Web App capabilities',
        seo: 'Search engine optimization',
        accessibility: 'WCAG compliance'
      },
      actual: {},
      issues: [],
      recommendations: []
    };
  }

  async init() {
    console.log('🔍 Starting UX/UI Analysis...');
    this.browser = await puppeteer.launch({
      headless: false, // Show browser for visual inspection
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set viewport for desktop
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.analysis.issues.push({
          type: 'console_error',
          message: msg.text(),
          severity: 'high'
        });
      }
    });

    // Monitor network requests
    this.page.on('requestfailed', request => {
      this.analysis.issues.push({
        type: 'network_error',
        url: request.url(),
        errorText: request.failure().errorText,
        severity: 'medium'
      });
    });
  }

  async testPageLoad() {
    console.log('📄 Testing page load...');
    try {
      const startTime = Date.now();
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
      const loadTime = Date.now() - startTime;
      
      this.analysis.actual.pageLoadTime = loadTime;
      
      if (loadTime < 3000) {
        console.log(`✅ Fast load time: ${loadTime}ms`);
      } else {
        console.log(`⚠️ Slow load time: ${loadTime}ms`);
        this.analysis.issues.push({
          type: 'performance',
          message: `Slow page load: ${loadTime}ms`,
          severity: 'medium'
        });
      }
    } catch (error) {
      this.analysis.issues.push({
        type: 'page_load',
        message: error.message,
        severity: 'high'
      });
    }
  }

  async testSearchFunctionality() {
    console.log('🔍 Testing search functionality...');
    try {
      // Wait for page to fully load
      await this.page.waitForTimeout(3000);
      
      // Look for search input
      const searchInput = await this.page.$('input[placeholder*="search"], input[type="search"], input[placeholder*="Search"]');
      
      if (searchInput) {
        this.analysis.actual.searchFunctionality = 'Present';
        console.log('✅ Search input found');
        
        // Test search functionality
        await searchInput.type('apple');
        await this.page.keyboard.press('Enter');
        
        // Wait for results
        await this.page.waitForTimeout(2000);
        
        // Check for search results or loading state
        const hasResults = await this.page.$('[data-testid="search-results"], .search-results, .results') !== null;
        const hasLoading = await this.page.$('.loading, [data-testid="loading"]') !== null;
        const hasError = await this.page.$('.error, [data-testid="error"]') !== null;
        
        if (hasResults || hasLoading || hasError) {
          console.log('✅ Search functionality working');
        } else {
          console.log('❌ Search functionality not responding');
          this.analysis.issues.push({
            type: 'search_functionality',
            message: 'Search input found but no response to search',
            severity: 'high'
          });
        }
      } else {
        this.analysis.actual.searchFunctionality = 'Missing';
        console.log('❌ Search input not found');
        this.analysis.issues.push({
          type: 'search_functionality',
          message: 'Search input not found on page',
          severity: 'high'
        });
      }
    } catch (error) {
      this.analysis.issues.push({
        type: 'search_test',
        message: error.message,
        severity: 'high'
      });
    }
  }

  async testGamification() {
    console.log('🎮 Testing gamification...');
    try {
      // Look for gamification elements
      const xpElement = await this.page.$('[data-testid="xp"], .xp, .experience');
      const levelElement = await this.page.$('[data-testid="level"], .level, .user-level');
      const achievementsElement = await this.page.$('[data-testid="achievements"], .achievements, .badges');
      
      const gamificationElements = [xpElement, levelElement, achievementsElement].filter(el => el !== null);
      
      if (gamificationElements.length > 0) {
        this.analysis.actual.gamification = 'Present';
        console.log(`✅ Gamification elements found: ${gamificationElements.length}/3`);
      } else {
        this.analysis.actual.gamification = 'Missing';
        console.log('❌ No gamification elements found');
        this.analysis.issues.push({
          type: 'gamification',
          message: 'No gamification elements (XP, levels, achievements) found',
          severity: 'medium'
        });
      }
    } catch (error) {
      this.analysis.issues.push({
        type: 'gamification_test',
        message: error.message,
        severity: 'medium'
      });
    }
  }

  async testResponsiveDesign() {
    console.log('📱 Testing responsive design...');
    try {
      const viewports = [
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1280, height: 720, name: 'Desktop' }
      ];
      
      const responsiveResults = [];
      
      for (const viewport of viewports) {
        await this.page.setViewport(viewport);
        await this.page.waitForTimeout(1000);
        
        // Check if content is visible and properly sized
        const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = viewport.width;
        
        const isResponsive = bodyWidth <= viewportWidth + 50; // Allow some margin
        
        responsiveResults.push({
          viewport: viewport.name,
          responsive: isResponsive,
          bodyWidth,
          viewportWidth
        });
        
        console.log(`${viewport.name}: ${isResponsive ? '✅' : '❌'} (body: ${bodyWidth}px, viewport: ${viewportWidth}px)`);
      }
      
      const responsiveCount = responsiveResults.filter(r => r.responsive).length;
      this.analysis.actual.responsiveDesign = `${responsiveCount}/${viewports.length} viewports responsive`;
      
      if (responsiveCount < viewports.length) {
        this.analysis.issues.push({
          type: 'responsive_design',
          message: `Only ${responsiveCount}/${viewports.length} viewports are responsive`,
          severity: 'medium'
        });
      }
    } catch (error) {
      this.analysis.issues.push({
        type: 'responsive_test',
        message: error.message,
        severity: 'medium'
      });
    }
  }

  async testAccessibility() {
    console.log('♿ Testing accessibility...');
    try {
      // Check for proper heading structure
      const headings = await this.page.$$eval('h1, h2, h3, h4, h5, h6', els => 
        els.map(el => ({ tag: el.tagName, text: el.textContent.trim(), hasId: !!el.id }))
      );
      
      this.analysis.actual.headings = headings.length;
      
      if (headings.length > 0) {
        console.log(`✅ Found ${headings.length} headings`);
      } else {
        console.log('❌ No headings found');
        this.analysis.issues.push({
          type: 'accessibility',
          message: 'No proper heading structure found',
          severity: 'high'
        });
      }
      
      // Check for alt text on images
      const images = await this.page.$$eval('img', els => 
        els.map(el => ({ src: el.src, alt: el.alt, hasAlt: !!el.alt && el.alt.trim() !== '' }))
      );
      
      const imagesWithAlt = images.filter(img => img.hasAlt).length;
      this.analysis.actual.imagesWithAlt = `${imagesWithAlt}/${images.length} images have alt text`;
      
      if (imagesWithAlt < images.length) {
        console.log(`⚠️ ${images.length - imagesWithAlt} images missing alt text`);
        this.analysis.issues.push({
          type: 'accessibility',
          message: `${images.length - imagesWithAlt} images missing alt text`,
          severity: 'medium'
        });
      }
      
      // Check for ARIA labels
      const ariaElements = await this.page.$$eval('[aria-label], [aria-labelledby]', els => els.length);
      this.analysis.actual.ariaElements = ariaElements;
      
      console.log(`✅ Found ${ariaElements} ARIA elements`);
      
    } catch (error) {
      this.analysis.issues.push({
        type: 'accessibility_test',
        message: error.message,
        severity: 'medium'
      });
    }
  }

  async testPWAFeatures() {
    console.log('📱 Testing PWA features...');
    try {
      // Check for manifest
      const manifestLink = await this.page.$('link[rel="manifest"]');
      if (manifestLink) {
        console.log('✅ Manifest link found');
        this.analysis.actual.manifest = 'Present';
      } else {
        console.log('❌ Manifest link not found');
        this.analysis.issues.push({
          type: 'pwa',
          message: 'Manifest link not found',
          severity: 'medium'
        });
      }
      
      // Check for service worker
      const hasServiceWorker = await this.page.evaluate(() => 'serviceWorker' in navigator);
      this.analysis.actual.serviceWorker = hasServiceWorker ? 'Supported' : 'Not supported';
      
      // Check for app icons
      const appleTouchIcon = await this.page.$('link[rel="apple-touch-icon"]');
      const favicon = await this.page.$('link[rel="icon"]');
      
      if (appleTouchIcon && favicon) {
        console.log('✅ App icons found');
        this.analysis.actual.appIcons = 'Present';
      } else {
        console.log('❌ App icons missing');
        this.analysis.issues.push({
          type: 'pwa',
          message: 'App icons missing',
          severity: 'low'
        });
      }
      
    } catch (error) {
      this.analysis.issues.push({
        type: 'pwa_test',
        message: error.message,
        severity: 'medium'
      });
    }
  }

  async testSecurity() {
    console.log('🛡️ Testing security...');
    try {
      // Test XSS protection
      const searchInput = await this.page.$('input[type="text"], input[type="search"]');
      if (searchInput) {
        await searchInput.click();
        await searchInput.type('<script>alert("xss")</script>');
        await this.page.keyboard.press('Enter');
        
        // Check if alert was triggered
        const alertTriggered = await this.page.evaluate(() => {
          return window.alert.toString().includes('native code');
        });
        
        if (!alertTriggered) {
          console.log('✅ XSS protection working');
          this.analysis.actual.xssProtection = 'Working';
        } else {
          console.log('❌ XSS protection failed');
          this.analysis.issues.push({
            type: 'security',
            message: 'XSS protection failed',
            severity: 'high'
          });
        }
      }
      
      // Check for security headers
      const response = await this.page.goto(this.baseUrl);
      const headers = response.headers();
      
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection'
      ];
      
      const presentHeaders = securityHeaders.filter(header => headers[header]);
      this.analysis.actual.securityHeaders = `${presentHeaders.length}/${securityHeaders.length} present`;
      
      console.log(`✅ Security headers: ${presentHeaders.length}/${securityHeaders.length}`);
      
    } catch (error) {
      this.analysis.issues.push({
        type: 'security_test',
        message: error.message,
        severity: 'high'
      });
    }
  }

  async testPerformance() {
    console.log('⚡ Testing performance...');
    try {
      const metrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.navigationStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
      });
      
      this.analysis.actual.performance = metrics;
      
      console.log(`✅ Performance metrics:`);
      console.log(`   Total time: ${metrics.totalTime}ms`);
      console.log(`   DOM loaded: ${metrics.domContentLoaded}ms`);
      console.log(`   First paint: ${metrics.firstPaint}ms`);
      
      if (metrics.totalTime > 5000) {
        this.analysis.issues.push({
          type: 'performance',
          message: `Slow total load time: ${metrics.totalTime}ms`,
          severity: 'medium'
        });
      }
      
    } catch (error) {
      this.analysis.issues.push({
        type: 'performance_test',
        message: error.message,
        severity: 'medium'
      });
    }
  }

  generateReport() {
    console.log('\n📊 UX/UI Analysis Report');
    console.log('========================');
    
    // Compare claims vs actual
    console.log('\n🔍 Claims vs Reality:');
    Object.keys(this.analysis.claims).forEach(key => {
      const claim = this.analysis.claims[key];
      const actual = this.analysis.actual[key] || 'Not tested';
      const status = actual !== 'Not tested' && actual !== 'Missing' ? '✅' : '❌';
      console.log(`${status} ${key}: ${claim}`);
      console.log(`   Actual: ${actual}`);
    });
    
    // Issues summary
    console.log('\n🚨 Issues Found:');
    const issuesBySeverity = {
      high: this.analysis.issues.filter(i => i.severity === 'high'),
      medium: this.analysis.issues.filter(i => i.severity === 'medium'),
      low: this.analysis.issues.filter(i => i.severity === 'low')
    };
    
    Object.keys(issuesBySeverity).forEach(severity => {
      const issues = issuesBySeverity[severity];
      if (issues.length > 0) {
        console.log(`\n${severity.toUpperCase()} (${issues.length}):`);
        issues.forEach((issue, index) => {
          console.log(`  ${index + 1}. ${issue.type}: ${issue.message}`);
        });
      }
    });
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (issuesBySeverity.high.length > 0) {
      console.log('1. Fix high severity issues immediately');
    }
    if (issuesBySeverity.medium.length > 0) {
      console.log('2. Address medium severity issues for better UX');
    }
    if (this.analysis.actual.searchFunctionality === 'Missing') {
      console.log('3. Implement search functionality - core feature missing');
    }
    if (this.analysis.actual.gamification === 'Missing') {
      console.log('4. Add gamification elements - key differentiator');
    }
    
    // Overall assessment
    const totalIssues = this.analysis.issues.length;
    const highIssues = issuesBySeverity.high.length;
    
    console.log('\n🎯 Overall Assessment:');
    if (highIssues === 0 && totalIssues < 3) {
      console.log('🟢 EXCELLENT - Application meets all claims');
    } else if (highIssues === 0 && totalIssues < 5) {
      console.log('🟡 GOOD - Minor issues need attention');
    } else if (highIssues < 2) {
      console.log('🟠 FAIR - Several issues need fixing');
    } else {
      console.log('🔴 POOR - Major issues need immediate attention');
    }
    
    // Save detailed report
    const reportPath = path.join(__dirname, '../qa-reports', `ux-ui-analysis-${Date.now()}.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(this.analysis, null, 2));
    console.log(`\n📄 Detailed report saved: ${reportPath}`);
    
    return this.analysis;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runAnalysis() {
    try {
      await this.init();
      await this.testPageLoad();
      await this.testSearchFunctionality();
      await this.testGamification();
      await this.testResponsiveDesign();
      await this.testAccessibility();
      await this.testPWAFeatures();
      await this.testSecurity();
      await this.testPerformance();
      
      const report = this.generateReport();
      return report;
    } catch (error) {
      console.error('❌ Analysis Error:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new UXUIAnalyzer();
  analyzer.runAnalysis().then(report => {
    const highIssues = report.issues.filter(i => i.severity === 'high').length;
    process.exit(highIssues > 0 ? 1 : 0);
  });
}

module.exports = UXUIAnalyzer;
