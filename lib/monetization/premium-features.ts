/**
 * Premium Features Manager
 * Defines and manages premium features and access control
 */

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  requiredTier: 'basic' | 'pro' | 'lifetime';
  category: 'analysis' | 'export' | 'customization' | 'api' | 'advanced';
}

export interface FeatureAccess {
  featureId: string;
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: string;
}

export class PremiumFeaturesManager {
  private static instance: PremiumFeaturesManager;
  private features: PremiumFeature[];

  private constructor() {
    this.features = [
      // Analysis Features
      {
        id: 'advanced_safety_analysis',
        name: 'Advanced Safety Analysis',
        description: 'Get detailed safety reports with medical-grade analysis',
        requiredTier: 'basic',
        category: 'analysis',
      },
      {
        id: 'interaction_prediction',
        name: 'Interaction Prediction',
        description: 'Predict potential interactions before mixing consumables',
        requiredTier: 'basic',
        category: 'analysis',
      },
      {
        id: 'custom_safety_rules',
        name: 'Custom Safety Rules',
        description: 'Create and manage your own safety rules and thresholds',
        requiredTier: 'pro',
        category: 'analysis',
      },
      {
        id: 'ai_safety_recommendations',
        name: 'AI Safety Recommendations',
        description: 'Get AI-powered safety recommendations and warnings',
        requiredTier: 'pro',
        category: 'analysis',
      },

      // Export Features
      {
        id: 'export_results',
        name: 'Export Results',
        description: 'Export experiment results to PDF, CSV, or JSON',
        requiredTier: 'basic',
        category: 'export',
      },
      {
        id: 'detailed_reports',
        name: 'Detailed Reports',
        description: 'Generate comprehensive safety and interaction reports',
        requiredTier: 'basic',
        category: 'export',
      },
      {
        id: 'batch_export',
        name: 'Batch Export',
        description: 'Export multiple experiments at once',
        requiredTier: 'pro',
        category: 'export',
      },

      // Customization Features
      {
        id: 'custom_consumables',
        name: 'Custom Consumables',
        description: 'Add your own consumables to the database',
        requiredTier: 'pro',
        category: 'customization',
      },
      {
        id: 'personal_notes',
        name: 'Personal Notes',
        description: 'Add personal notes and observations to experiments',
        requiredTier: 'basic',
        category: 'customization',
      },
      {
        id: 'white_label',
        name: 'White Label',
        description: 'Remove branding and customize the interface',
        requiredTier: 'lifetime',
        category: 'customization',
      },

      // API Features
      {
        id: 'api_access',
        name: 'API Access',
        description: 'Access the Alchemy API for integration with other apps',
        requiredTier: 'pro',
        category: 'api',
      },
      {
        id: 'webhook_support',
        name: 'Webhook Support',
        description: 'Receive real-time notifications via webhooks',
        requiredTier: 'pro',
        category: 'api',
      },

      // Advanced Features
      {
        id: 'unlimited_experiments',
        name: 'Unlimited Experiments',
        description: 'Remove the daily limit on experiments',
        requiredTier: 'basic',
        category: 'advanced',
      },
      {
        id: 'priority_support',
        name: 'Priority Support',
        description: 'Get priority customer support and faster response times',
        requiredTier: 'basic',
        category: 'advanced',
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Access detailed usage analytics and insights',
        requiredTier: 'pro',
        category: 'advanced',
      },
      {
        id: 'exclusive_features',
        name: 'Exclusive Features',
        description: 'Access to beta features and early releases',
        requiredTier: 'lifetime',
        category: 'advanced',
      },
    ];
  }

  static getInstance(): PremiumFeaturesManager {
    if (!PremiumFeaturesManager.instance) {
      PremiumFeaturesManager.instance = new PremiumFeaturesManager();
    }
    return PremiumFeaturesManager.instance;
  }

  /**
   * Get all premium features
   */
  getFeatures(): PremiumFeature[] {
    return [...this.features];
  }

  /**
   * Get features by category
   */
  getFeaturesByCategory(category: string): PremiumFeature[] {
    return this.features.filter(feature => feature.category === category);
  }

  /**
   * Get features by tier
   */
  getFeaturesByTier(tier: string): PremiumFeature[] {
    return this.features.filter(feature => feature.requiredTier === tier);
  }

  /**
   * Check if user has access to a feature
   */
  hasAccess(featureId: string, userTier: string | null): FeatureAccess {
    const feature = this.features.find(f => f.id === featureId);
    if (!feature) {
      return {
        featureId,
        hasAccess: false,
        reason: 'Feature not found',
      };
    }

    // Free tier has no access to premium features
    if (!userTier) {
      return {
        featureId,
        hasAccess: false,
        reason: 'Premium subscription required',
        upgradeRequired: feature.requiredTier,
      };
    }

    // Check tier hierarchy
    const tierHierarchy = ['basic', 'pro', 'lifetime'];
    const userTierIndex = tierHierarchy.indexOf(userTier);
    const requiredTierIndex = tierHierarchy.indexOf(feature.requiredTier);

    if (userTierIndex >= requiredTierIndex) {
      return {
        featureId,
        hasAccess: true,
      };
    }

    return {
      featureId,
      hasAccess: false,
      reason: `Upgrade to ${feature.requiredTier} tier required`,
      upgradeRequired: feature.requiredTier,
    };
  }

  /**
   * Get upgrade suggestions for user
   */
  getUpgradeSuggestions(userTier: string | null): PremiumFeature[] {
    if (!userTier) {
      // Show basic tier features for free users
      return this.getFeaturesByTier('basic');
    }

    const tierHierarchy = ['basic', 'pro', 'lifetime'];
    const userTierIndex = tierHierarchy.indexOf(userTier);
    
    if (userTierIndex >= tierHierarchy.length - 1) {
      return []; // User has highest tier
    }

    const nextTier = tierHierarchy[userTierIndex + 1];
    return this.getFeaturesByTier(nextTier);
  }

  /**
   * Get feature by ID
   */
  getFeature(featureId: string): PremiumFeature | null {
    return this.features.find(f => f.id === featureId) || null;
  }

  /**
   * Get tier benefits summary
   */
  getTierBenefits(tier: string): string[] {
    const features = this.getFeaturesByTier(tier);
    return features.map(f => f.name);
  }

  /**
   * Check if feature is available in tier
   */
  isFeatureAvailableInTier(featureId: string, tier: string): boolean {
    const feature = this.getFeature(featureId);
    if (!feature) return false;
    
    const tierHierarchy = ['basic', 'pro', 'lifetime'];
    const tierIndex = tierHierarchy.indexOf(tier);
    const requiredTierIndex = tierHierarchy.indexOf(feature.requiredTier);
    
    return tierIndex >= requiredTierIndex;
  }
}
