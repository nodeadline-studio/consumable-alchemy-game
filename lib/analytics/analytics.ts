/**
 * Analytics Manager
 * Handles Google Analytics, Mixpanel, and custom analytics
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    mixpanel: any;
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserProperties {
  user_id?: string;
  subscription_tier?: string;
  experiment_count?: number;
  level?: number;
  total_play_time?: number;
}

export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private isInitialized: boolean = false;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  /**
   * Initialize analytics
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined' || this.isInitialized) return;

    try {
      // Initialize Google Analytics
      await this.initializeGoogleAnalytics();
      
      // Initialize Mixpanel
      await this.initializeMixpanel();
      
      this.isInitialized = true;
      console.log('Analytics Manager: Initialized successfully');
    } catch (error) {
      console.error('Analytics Manager: Initialization failed:', error);
    }
  }

  /**
   * Initialize Google Analytics
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!measurementId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = function() {
      (window.gtag as any).q = (window.gtag as any).q || [];
      (window.gtag as any).q.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: 'Consumable Alchemy Game',
      page_location: window.location.href,
    });
  }

  /**
   * Initialize Mixpanel
   */
  private async initializeMixpanel(): Promise<void> {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    if (!token) return;

    // Load Mixpanel script
    const script = document.createElement('script');
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
    script.onload = () => {
      window.mixpanel.init(token, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage',
      });
    };
    document.head.appendChild(script);
  }

  /**
   * Track page view
   */
  trackPageView(page: string, title?: string): void {
    if (!this.isInitialized) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_title: title || page,
        page_location: window.location.href,
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track('Page View', {
        page,
        title: title || page,
        url: window.location.href,
      });
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized) return;

    this.userId = properties.user_id || null;

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        user_id: this.userId,
        custom_map: {
          subscription_tier: properties.subscription_tier,
          experiment_count: properties.experiment_count,
          level: properties.level,
        },
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.people.set(properties);
      if (this.userId) {
        window.mixpanel.identify(this.userId);
      }
    }
  }

  /**
   * Track experiment completion
   */
  trackExperiment(experiment: any): void {
    this.trackEvent({
      action: 'experiment_completed',
      category: 'gamification',
      label: experiment.safetyLevel,
      value: experiment.safetyScore,
      custom_parameters: {
        consumable_count: experiment.consumables?.length || 0,
        has_dangerous_interaction: experiment.hasDangerousInteraction || false,
        experiment_id: experiment.id,
      },
    });
  }

  /**
   * Track subscription purchase
   */
  trackSubscription(tier: string, price: number, paymentMethod: string): void {
    this.trackEvent({
      action: 'subscription_purchased',
      category: 'monetization',
      label: tier,
      value: price,
      custom_parameters: {
        payment_method: paymentMethod,
        currency: 'USD',
      },
    });
  }

  /**
   * Track ad interaction
   */
  trackAdInteraction(adType: 'banner' | 'video', action: 'impression' | 'click' | 'completion'): void {
    this.trackEvent({
      action: `ad_${action}`,
      category: 'monetization',
      label: adType,
      custom_parameters: {
        ad_type: adType,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureId: string, action: string = 'used'): void {
    this.trackEvent({
      action: `feature_${action}`,
      category: 'engagement',
      label: featureId,
      custom_parameters: {
        feature_id: featureId,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: string): void {
    this.trackEvent({
      action: 'error_occurred',
      category: 'error',
      label: error.name,
      custom_parameters: {
        error_message: error.message,
        error_stack: error.stack,
        context: context || 'unknown',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
