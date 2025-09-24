/**
 * Ads Manager
 * Handles non-intrusive banner ads and rewarded video ads
 * Designed for Israeli startup with PayPal/credit card focus
 */

export interface AdConfig {
  enabled: boolean;
  bannerAdUnit: string;
  videoAdUnit: string;
  frequency: number; // Show ad every N experiments
  lastShown: number;
}

export interface AdRevenue {
  totalEarnings: number;
  bannerClicks: number;
  videoCompletions: number;
  lastUpdated: string;
}

export class AdsManager {
  private static instance: AdsManager;
  private config: AdConfig;
  private revenue: AdRevenue;
  private lastBannerShown: Map<string, number> = new Map();

  private constructor() {
    this.config = {
      enabled: true,
      bannerAdUnit: 'ca-pub-1234567890123456', // Replace with actual AdMob unit
      videoAdUnit: 'ca-pub-1234567890123457', // Replace with actual AdMob unit
      frequency: 3, // Show ad every 3 experiments
      lastShown: 0,
    };
    this.revenue = {
      totalEarnings: 0,
      bannerClicks: 0,
      videoCompletions: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  static getInstance(): AdsManager {
    if (!AdsManager.instance) {
      AdsManager.instance = new AdsManager();
    }
    return AdsManager.instance;
  }

  /**
   * Initialize ads (mock implementation for development)
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    console.log('Ads Manager: Initializing ads...');
    
    // In production, this would initialize AdMob or other ad networks
    // For now, we'll simulate ad loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Ads Manager: Ads initialized successfully');
  }

  /**
   * Show banner ad
   */
  async showBannerAd(containerId: string): Promise<boolean> {
    if (!this.config.enabled) return false;
    
    try {
      // Check if banner is already shown to prevent duplicates
      const container = document.getElementById(containerId);
      if (container && container.innerHTML.trim() !== '') {
        return true; // Already shown
      }
      
      // Check if we've already shown a banner recently
      const lastShown = this.lastBannerShown.get(containerId);
      if (lastShown && Date.now() - lastShown < 5000) { // 5 second cooldown
        return true; // Too soon to show again
      }
      
      console.log(`Ads Manager: Showing banner ad in ${containerId}`);
      
      // Mock banner ad implementation
      if (container) {
        container.innerHTML = `
          <div class="banner-ad bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center text-white">
            <div class="text-sm font-medium mb-2">🎯 Premium Alchemy Tools</div>
            <div class="text-xs opacity-80 mb-3">Unlock advanced safety analysis & unlimited experiments</div>
            <button class="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        `;
        
        // Track banner impression
        this.trackBannerImpression();
        this.lastBannerShown.set(containerId, Date.now());
        return true;
      }
    } catch (error) {
      console.error('Ads Manager: Error showing banner ad:', error);
    }
    
    return false;
  }

  /**
   * Show rewarded video ad
   */
  async showRewardedVideoAd(): Promise<{ success: boolean; reward?: string }> {
    if (!this.config.enabled) return { success: false };
    
    try {
      console.log('Ads Manager: Showing rewarded video ad...');
      
      // Mock rewarded video implementation
      // In production, this would show actual video ads
      const reward = 'bonus_xp';
      const rewardAmount = 100;
      
      // Simulate video completion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.trackVideoCompletion();
      
      return {
        success: true,
        reward: `${reward}:${rewardAmount}`,
      };
    } catch (error) {
      console.error('Ads Manager: Error showing rewarded video ad:', error);
      return { success: false };
    }
  }

  /**
   * Check if should show ad based on frequency
   */
  shouldShowAd(experimentCount: number): boolean {
    if (!this.config.enabled) return false;
    
    const experimentsSinceLastAd = experimentCount - this.config.lastShown;
    return experimentsSinceLastAd >= this.config.frequency;
  }

  /**
   * Update last shown ad count
   */
  updateLastShown(experimentCount: number): void {
    this.config.lastShown = experimentCount;
    this.saveConfig();
  }

  /**
   * Track banner impression
   */
  private trackBannerImpression(): void {
    // In production, this would send analytics to ad network
    console.log('Ads Manager: Banner impression tracked');
  }

  /**
   * Track banner click
   */
  trackBannerClick(): void {
    this.revenue.bannerClicks++;
    this.revenue.totalEarnings += 0.01; // $0.01 per click
    this.revenue.lastUpdated = new Date().toISOString();
    this.saveRevenue();
    
    console.log('Ads Manager: Banner click tracked');
  }

  /**
   * Track video completion
   */
  private trackVideoCompletion(): void {
    this.revenue.videoCompletions++;
    this.revenue.totalEarnings += 0.05; // $0.05 per completion
    this.revenue.lastUpdated = new Date().toISOString();
    this.saveRevenue();
    
    console.log('Ads Manager: Video completion tracked');
  }

  /**
   * Get revenue data
   */
  getRevenue(): AdRevenue {
    return { ...this.revenue };
  }

  /**
   * Enable/disable ads
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  /**
   * Save config to localStorage
   */
  private saveConfig(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ads_config', JSON.stringify(this.config));
  }

  /**
   * Load config from localStorage
   */
  private loadConfig(): void {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('ads_config');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Ads Manager: Error loading config:', error);
      }
    }
  }

  /**
   * Save revenue to localStorage
   */
  private saveRevenue(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ads_revenue', JSON.stringify(this.revenue));
  }

  /**
   * Load revenue from localStorage
   */
  private loadRevenue(): void {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('ads_revenue');
    if (saved) {
      try {
        this.revenue = { ...this.revenue, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Ads Manager: Error loading revenue:', error);
      }
    }
  }
}
