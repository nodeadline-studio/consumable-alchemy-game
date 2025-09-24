import { UserProfile, Consumable, ConsumableCategory } from '@/types';

/**
 * Rewards System
 * Handles rewards, unlocks, and special bonuses
 */
export class RewardsSystem {
  // Unlockable features by level
  private static readonly LEVEL_UNLOCKS = {
    1: {
      features: ['basic_mixing', 'safety_guidelines'],
      consumables: ['food', 'beverage'],
      techniques: ['mix'],
    },
    5: {
      features: ['temperature_control', 'advanced_mixing'],
      consumables: ['supplement'],
      techniques: ['blend', 'heat', 'cool'],
    },
    10: {
      features: ['complex_combinations', 'fermentation'],
      consumables: ['herb'],
      techniques: ['ferment'],
    },
    15: {
      features: ['distillation', 'extraction'],
      consumables: ['medication'],
      techniques: ['distill', 'extract'],
    },
    20: {
      features: ['synthesis', 'all_techniques'],
      consumables: ['alcohol', 'drug', 'chemical'],
      techniques: ['synthesize'],
    },
  };

  // Daily rewards
  private static readonly DAILY_REWARDS = [
    { day: 1, xp: 50, title: 'Welcome Back!', description: '50 XP bonus' },
    { day: 2, xp: 75, title: 'Getting Started', description: '75 XP bonus' },
    { day: 3, xp: 100, title: 'Building Momentum', description: '100 XP bonus' },
    { day: 7, xp: 200, title: 'Week Warrior', description: '200 XP bonus + Special consumable' },
    { day: 14, xp: 300, title: 'Two Week Champion', description: '300 XP bonus + Rare consumable' },
    { day: 30, xp: 500, title: 'Monthly Master', description: '500 XP bonus + Epic consumable' },
  ];

  /**
   * Get unlocked features for a level
   */
  static getUnlockedFeatures(level: number): {
    features: string[];
    consumables: ConsumableCategory[];
    techniques: string[];
  } {
    const unlocked = {
      features: [] as string[],
      consumables: [] as ConsumableCategory[],
      techniques: [] as string[],
    };

    for (const [requiredLevel, unlocks] of Object.entries(this.LEVEL_UNLOCKS)) {
      if (level >= parseInt(requiredLevel)) {
        unlocked.features.push(...unlocks.features);
        unlocked.consumables.push(...(unlocks.consumables as ConsumableCategory[]));
        unlocked.techniques.push(...unlocks.techniques);
      }
    }

    return unlocked;
  }

  /**
   * Check if a feature is unlocked
   */
  static isFeatureUnlocked(level: number, feature: string): boolean {
    const unlocked = this.getUnlockedFeatures(level);
    return unlocked.features.includes(feature);
  }

  /**
   * Check if a consumable category is unlocked
   */
  static isConsumableCategoryUnlocked(level: number, category: ConsumableCategory): boolean {
    const unlocked = this.getUnlockedFeatures(level);
    return unlocked.consumables.includes(category);
  }

  /**
   * Check if a technique is unlocked
   */
  static isTechniqueUnlocked(level: number, technique: string): boolean {
    const unlocked = this.getUnlockedFeatures(level);
    return unlocked.techniques.includes(technique);
  }

  /**
   * Get daily reward for streak
   */
  static getDailyReward(streak: number): {
    xp: number;
    title: string;
    description: string;
    specialReward?: string;
  } {
    // Find the highest reward the user qualifies for
    let reward = this.DAILY_REWARDS[0];
    
    for (const dailyReward of this.DAILY_REWARDS) {
      if (streak >= dailyReward.day) {
        reward = dailyReward;
      } else {
        break;
      }
    }

    // Add special rewards for milestone days
    if (streak === 7) {
      return {
        ...reward,
        specialReward: 'Rare consumable: Golden Apple',
      };
    } else if (streak === 30) {
      return {
        ...reward,
        specialReward: 'Epic consumable: Philosopher\'s Stone',
      };
    }

    return reward;
  }

  /**
   * Calculate bonus XP for various factors
   */
  static calculateBonusXP(
    baseXP: number,
    userProfile: UserProfile,
    experiment: any
  ): {
    totalXP: number;
    bonuses: Array<{ name: string; multiplier: number; description: string }>;
  } {
    let totalXP = baseXP;
    const bonuses: Array<{ name: string; multiplier: number; description: string }> = [];

    // Streak bonus
    if (userProfile.stats.streak > 1) {
      const streakMultiplier = 1 + (userProfile.stats.streak * 0.02); // 2% per day
      totalXP *= streakMultiplier;
      bonuses.push({
        name: 'Streak Bonus',
        multiplier: streakMultiplier,
        description: `${userProfile.stats.streak} day streak`,
      });
    }

    // Level bonus (higher levels get more XP)
    const levelMultiplier = 1 + (userProfile.stats.level * 0.01); // 1% per level
    totalXP *= levelMultiplier;
    bonuses.push({
      name: 'Level Bonus',
      multiplier: levelMultiplier,
      description: `Level ${userProfile.stats.level} bonus`,
    });

    // First experiment of the day bonus
    const today = new Date();
    const lastExperiment = experiment.timestamp;
    const isFirstToday = lastExperiment.toDateString() === today.toDateString();
    
    if (isFirstToday) {
      const firstTodayMultiplier = 1.5;
      totalXP *= firstTodayMultiplier;
      bonuses.push({
        name: 'First Experiment Today',
        multiplier: firstTodayMultiplier,
        description: '50% bonus for first experiment of the day',
      });
    }

    // Safety bonus
    const avgSafetyScore = experiment.results.reduce((sum: number, result: any) => sum + result.safetyScore, 0) / experiment.results.length;
    if (avgSafetyScore >= 95) {
      const safetyMultiplier = 1.3;
      totalXP *= safetyMultiplier;
      bonuses.push({
        name: 'Safety Excellence',
        multiplier: safetyMultiplier,
        description: '30% bonus for excellent safety score',
      });
    }

    // Novelty bonus
    const avgNoveltyScore = experiment.results.reduce((sum: number, result: any) => sum + result.noveltyScore, 0) / experiment.results.length;
    if (avgNoveltyScore >= 90) {
      const noveltyMultiplier = 1.25;
      totalXP *= noveltyMultiplier;
      bonuses.push({
        name: 'Innovation Bonus',
        multiplier: noveltyMultiplier,
        description: '25% bonus for novel combination',
      });
    }

    // Complexity bonus
    if (experiment.consumables.length >= 5) {
      const complexityMultiplier = 1.2;
      totalXP *= complexityMultiplier;
      bonuses.push({
        name: 'Complexity Bonus',
        multiplier: complexityMultiplier,
        description: '20% bonus for complex experiment',
      });
    }

    return {
      totalXP: Math.round(totalXP),
      bonuses,
    };
  }

  /**
   * Get special consumables that can be unlocked
   */
  static getSpecialConsumables(): Array<{
    id: string;
    name: string;
    description: string;
    rarity: 'rare' | 'epic' | 'legendary';
    unlockCondition: string;
    category: ConsumableCategory;
  }> {
    return [
      {
        id: 'golden_apple',
        name: 'Golden Apple',
        description: 'A mythical fruit that enhances all combinations',
        rarity: 'rare',
        unlockCondition: '7-day streak',
        category: 'food',
      },
      {
        id: 'philosophers_stone',
        name: 'Philosopher\'s Stone',
        description: 'The ultimate alchemical ingredient',
        rarity: 'legendary',
        unlockCondition: '30-day streak',
        category: 'chemical',
      },
      {
        id: 'elixir_of_life',
        name: 'Elixir of Life',
        description: 'A potion that grants perfect safety scores',
        rarity: 'epic',
        unlockCondition: 'Level 15',
        category: 'beverage',
      },
      {
        id: 'mystical_herb',
        name: 'Mystical Herb',
        description: 'A rare herb with unknown properties',
        rarity: 'rare',
        unlockCondition: '100 experiments',
        category: 'herb',
      },
      {
        id: 'crystal_powder',
        name: 'Crystal Powder',
        description: 'A crystalline substance that amplifies effects',
        rarity: 'epic',
        unlockCondition: 'Level 10',
        category: 'chemical',
      },
    ];
  }

  /**
   * Check if user qualifies for special consumable
   */
  static checkSpecialConsumableUnlock(
    userProfile: UserProfile,
    experiments: any[]
  ): Array<{
    consumable: any;
    reason: string;
  }> {
    const specialConsumables = this.getSpecialConsumables();
    const unlocked: Array<{ consumable: any; reason: string }> = [];

    for (const consumable of specialConsumables) {
      let shouldUnlock = false;
      let reason = '';

      switch (consumable.unlockCondition) {
        case '7-day streak':
          if (userProfile.stats.streak >= 7) {
            shouldUnlock = true;
            reason = '7-day streak achieved!';
          }
          break;
        case '30-day streak':
          if (userProfile.stats.streak >= 30) {
            shouldUnlock = true;
            reason = '30-day streak achieved!';
          }
          break;
        case 'Level 15':
          if (userProfile.stats.level >= 15) {
            shouldUnlock = true;
            reason = 'Reached Level 15!';
          }
          break;
        case 'Level 10':
          if (userProfile.stats.level >= 10) {
            shouldUnlock = true;
            reason = 'Reached Level 10!';
          }
          break;
        case '100 experiments':
          if (userProfile.stats.experiments >= 100) {
            shouldUnlock = true;
            reason = 'Completed 100 experiments!';
          }
          break;
      }

      if (shouldUnlock) {
        unlocked.push({ consumable, reason });
      }
    }

    return unlocked;
  }

  /**
   * Get level-up rewards
   */
  static getLevelUpRewards(level: number): {
    xp: number;
    consumables: string[];
    features: string[];
    techniques: string[];
  } {
    const rewards = {
      xp: level * 10, // 10 XP per level
      consumables: [] as string[],
      features: [] as string[],
      techniques: [] as string[],
    };

    // Special rewards for milestone levels
    if (level === 5) {
      rewards.consumables.push('Rare consumable: Energy Elixir');
    } else if (level === 10) {
      rewards.consumables.push('Epic consumable: Wisdom Potion');
    } else if (level === 20) {
      rewards.consumables.push('Legendary consumable: Master\'s Brew');
    }

    return rewards;
  }

  /**
   * Get achievement rewards
   */
  static getAchievementRewards(achievement: any): {
    xp: number;
    consumables: string[];
    title: string;
  } {
    const baseXP = {
      common: 25,
      rare: 50,
      epic: 100,
      legendary: 250,
    };

    return {
      xp: baseXP[achievement.rarity as keyof typeof baseXP] || 25,
      consumables: achievement.rarity === 'legendary' ? ['Special consumable'] : [],
      title: achievement.name,
    };
  }
}
