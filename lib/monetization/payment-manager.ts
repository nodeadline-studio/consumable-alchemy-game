/**
 * Payment Manager
 * Handles PayPal and Gumroad payments for premium features
 * Designed for Israeli startup with PayPal/credit card focus
 */

export interface PaymentConfig {
  paypalClientId: string;
  gumroadProductId: string;
  currency: string;
  environment: 'sandbox' | 'production';
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  duration: 'monthly' | 'yearly' | 'lifetime';
  popular?: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  subscriptionTier?: string;
}

export class PaymentManager {
  private static instance: PaymentManager;
  private config: PaymentConfig;
  private subscriptions: SubscriptionTier[];

  private constructor() {
    this.config = {
      paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sandbox_client_id',
      gumroadProductId: process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_ID || 'premium-alchemy-tools',
      currency: 'USD',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    };

    this.subscriptions = [
      {
        id: 'basic',
        name: 'Basic',
        price: 4.99,
        currency: 'USD',
        features: [
          'Unlimited experiments',
          'Advanced safety analysis',
          'Export results',
          'Priority support'
        ],
        duration: 'monthly',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        currency: 'USD',
        features: [
          'Everything in Basic',
          'Custom consumable database',
          'Advanced analytics',
          'API access',
          'White-label options'
        ],
        duration: 'monthly',
        popular: true,
      },
      {
        id: 'lifetime',
        name: 'Lifetime',
        price: 99.99,
        currency: 'USD',
        features: [
          'Everything in Pro',
          'Lifetime updates',
          'Exclusive features',
          'Priority feature requests'
        ],
        duration: 'lifetime',
      },
    ];
  }

  static getInstance(): PaymentManager {
    if (!PaymentManager.instance) {
      PaymentManager.instance = new PaymentManager();
    }
    return PaymentManager.instance;
  }

  /**
   * Initialize payment systems
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    console.log('Payment Manager: Initializing payment systems...');
    
    // Initialize PayPal SDK
    await this.initializePayPal();
    
    console.log('Payment Manager: Payment systems initialized');
  }

  /**
   * Initialize PayPal SDK
   */
  private async initializePayPal(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.config.paypalClientId}&currency=${this.config.currency}`;
      script.async = true;
      script.onload = () => {
        console.log('PayPal SDK loaded');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load PayPal SDK');
        reject(new Error('PayPal SDK failed to load'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Get available subscription tiers
   */
  getSubscriptionTiers(): SubscriptionTier[] {
    return [...this.subscriptions];
  }

  /**
   * Process PayPal payment
   */
  async processPayPalPayment(tierId: string): Promise<PaymentResult> {
    const tier = this.subscriptions.find(t => t.id === tierId);
    if (!tier) {
      return { success: false, error: 'Invalid subscription tier' };
    }

    try {
      console.log(`Processing PayPal payment for ${tier.name} - $${tier.price}`);
      
      // Mock PayPal payment processing
      // In production, this would integrate with PayPal API
      const mockTransactionId = `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store subscription in localStorage
      this.saveSubscription({
        tierId: tier.id,
        transactionId: mockTransactionId,
        startDate: new Date().toISOString(),
        endDate: tier.duration === 'lifetime' ? null : this.calculateEndDate(tier.duration),
        status: 'active',
      });

      return {
        success: true,
        transactionId: mockTransactionId,
        subscriptionTier: tier.id,
      };
    } catch (error) {
      console.error('PayPal payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  /**
   * Process Gumroad payment
   */
  async processGumroadPayment(tierId: string): Promise<PaymentResult> {
    const tier = this.subscriptions.find(t => t.id === tierId);
    if (!tier) {
      return { success: false, error: 'Invalid subscription tier' };
    }

    try {
      console.log(`Processing Gumroad payment for ${tier.name} - $${tier.price}`);
      
      // Redirect to Gumroad checkout
      const gumroadUrl = `https://gumroad.com/l/${this.config.gumroadProductId}?price=${tier.price}&currency=${tier.currency}`;
      
      // Open in new window
      window.open(gumroadUrl, '_blank');
      
      return {
        success: true,
        subscriptionTier: tier.id,
      };
    } catch (error) {
      console.error('Gumroad payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription(): boolean {
    const subscription = this.getCurrentSubscription();
    if (!subscription) return false;
    
    if (subscription.status !== 'active') return false;
    
    if (subscription.endDate) {
      return new Date(subscription.endDate) > new Date();
    }
    
    return true; // Lifetime subscription
  }

  /**
   * Get current subscription
   */
  getCurrentSubscription(): any | null {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem('subscription');
    if (!saved) return null;
    
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading subscription:', error);
      return null;
    }
  }

  /**
   * Save subscription to localStorage
   */
  private saveSubscription(subscription: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }

  /**
   * Calculate subscription end date
   */
  private calculateEndDate(duration: 'monthly' | 'yearly'): string {
    const now = new Date();
    if (duration === 'monthly') {
      now.setMonth(now.getMonth() + 1);
    } else if (duration === 'yearly') {
      now.setFullYear(now.getFullYear() + 1);
    }
    return now.toISOString();
  }

  /**
   * Get payment methods
   */
  getPaymentMethods(): string[] {
    return ['paypal', 'gumroad'];
  }

  /**
   * Get revenue data
   */
  getRevenueData(): any {
    // In production, this would fetch from your backend
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      activeSubscriptions: 0,
      conversionRate: 0,
    };
  }
}
