import { UserProfile, UserStats, Achievement, Experiment, Consumable, ConsumableCategory, SafetyLevel } from '@/types';

/**
 * Gamification Engine
 * Handles all game progression, leveling, achievements, and rewards
 */
export class GamificationEngine {
  // Experience points required for each level
  private static readonly XP_PER_LEVEL = [
    0,    // Level 1
    100,  // Level 2
    250,  // Level 3
    450,  // Level 4
    700,  // Level 5
    1000, // Level 6
    1350, // Level 7
    1750, // Level 8
    2200, // Level 9
    2700, // Level 10
    3250, // Level 11
    3850, // Level 12
    4500, // Level 13
    5200, // Level 14
    5950, // Level 15
    6750, // Level 16
    7600, // Level 17
    8500, // Level 18
    9450, // Level 19
    10450, // Level 20
  ];

  // Achievement definitions
  private static readonly ACHIEVEMENTS: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
    // Beginner achievements
    {
      id: 'first_experiment',
      name: 'First Steps',
      description: 'Complete your first experiment',
      icon: '🧪',
      rarity: 'common',
      maxProgress: 1,
    },
    {
      id: 'safety_first',
      name: 'Safety First',
      description: 'Complete 10 experiments with safety score above 80',
      icon: '🛡️',
      rarity: 'common',
      maxProgress: 10,
    },
    {
      id: 'explorer',
      name: 'Explorer',
      description: 'Discover 50 different consumables',
      icon: '🔍',
      rarity: 'common',
      maxProgress: 50,
    },
    
    // Intermediate achievements
    {
      id: 'mix_master',
      name: 'Mix Master',
      description: 'Complete 100 experiments',
      icon: '⚗️',
      rarity: 'rare',
      maxProgress: 100,
    },
    {
      id: 'safety_expert',
      name: 'Safety Expert',
      description: 'Complete 50 experiments with perfect safety scores',
      icon: '🏆',
      rarity: 'rare',
      maxProgress: 50,
    },
    {
      id: 'category_master',
      name: 'Category Master',
      description: 'Experiment with all consumable categories',
      icon: '📚',
      rarity: 'rare',
      maxProgress: 8, // Number of categories
    },
    
    // Advanced achievements
    {
      id: 'alchemist',
      name: 'Master Alchemist',
      description: 'Complete 500 experiments',
      icon: '🧙‍♂️',
      rarity: 'epic',
      maxProgress: 500,
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Achieve 100 perfect experiment scores',
      icon: '💎',
      rarity: 'epic',
      maxProgress: 100,
    },
    {
      id: 'innovator',
      name: 'Innovator',
      description: 'Create 25 novel combinations',
      icon: '💡',
      rarity: 'epic',
      maxProgress: 25,
    },
    
    // Legendary achievements
    {
      id: 'legend',
      name: 'Legendary Alchemist',
      description: 'Complete 1000 experiments',
      icon: '👑',
      rarity: 'legendary',
      maxProgress: 1000,
    },
    {
      id: 'guardian',
      name: 'Safety Guardian',
      description: 'Prevent 100 dangerous combinations',
      icon: '🛡️👑',
      rarity: 'legendary',
      maxProgress: 100,
    },
    {
      id: 'genius',
      name: 'Scientific Genius',
      description: 'Achieve 500 perfect experiment scores',
      icon: '🧠👑',
      rarity: 'legendary',
      maxProgress: 500,
    },
  ];

  /**
   * Calculate experience points for an experiment
   */
  static calculateExperimentXP(experiment: Experiment): number {
    let baseXP = 10; // Base XP for any experiment
    
    // Bonus for safety score
    const avgSafetyScore = experiment.results.reduce((sum, result) => sum + result.safetyScore, 0) / experiment.results.length;
    if (avgSafetyScore >= 90) baseXP += 20;
    else if (avgSafetyScore >= 80) baseXP += 10;
    else if (avgSafetyScore < 50) baseXP -= 20; // More significant penalty for low safety
    else if (avgSafetyScore < 30) baseXP -= 35; // Even more penalty for very low safety
    
    // Bonus for effectiveness score
    const avgEffectivenessScore = experiment.results.reduce((sum, result) => sum + result.effectivenessScore, 0) / experiment.results.length;
    if (avgEffectivenessScore >= 90) baseXP += 15;
    else if (avgEffectivenessScore >= 80) baseXP += 8;
    
    // Bonus for novelty score
    const avgNoveltyScore = experiment.results.reduce((sum, result) => sum + result.noveltyScore, 0) / experiment.results.length;
    if (avgNoveltyScore >= 90) baseXP += 15;
    else if (avgNoveltyScore >= 80) baseXP += 8;
    
    // Bonus for number of consumables used
    const consumableCount = experiment.consumables.length;
    if (consumableCount >= 5) baseXP += 10;
    else if (consumableCount >= 3) baseXP += 5;
    
    // Bonus for successful experiment
    if (experiment.success) baseXP += 5;
    
    // Bonus for high overall score
    const avgOverallScore = experiment.results.reduce((sum, result) => sum + result.overallScore, 0) / experiment.results.length;
    if (avgOverallScore >= 90) baseXP += 25;
    else if (avgOverallScore >= 80) baseXP += 15;
    else if (avgOverallScore >= 70) baseXP += 10;
    
    return Math.max(1, baseXP); // Minimum 1 XP
  }

  /**
   * Calculate level from experience points
   */
  static calculateLevel(experience: number): number {
    for (let i = this.XP_PER_LEVEL.length - 1; i >= 0; i--) {
      if (experience >= this.XP_PER_LEVEL[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Calculate experience needed for next level
   */
  static getXPForNextLevel(currentLevel: number): number {
    if (currentLevel >= this.XP_PER_LEVEL.length) {
      return 0; // Max level reached
    }
    return this.XP_PER_LEVEL[currentLevel];
  }

  /**
   * Calculate progress to next level
   */
  static getLevelProgress(currentXP: number, currentLevel: number): {
    currentLevelXP: number;
    nextLevelXP: number;
    progress: number;
    xpNeeded: number;
  } {
    const currentLevelXP = this.XP_PER_LEVEL[currentLevel - 1] || 0;
    const nextLevelXP = this.getXPForNextLevel(currentLevel);
    
    if (nextLevelXP === 0) {
      return {
        currentLevelXP,
        nextLevelXP: currentLevelXP,
        progress: 100,
        xpNeeded: 0,
      };
    }
    
    const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    const xpNeeded = nextLevelXP - currentXP;
    
    return {
      currentLevelXP,
      nextLevelXP,
      progress: Math.min(100, Math.max(0, progress)),
      xpNeeded,
    };
  }

  /**
   * Check and unlock achievements
   */
  static checkAchievements(userStats: UserStats, experiments: Experiment[]): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    for (const achievementDef of this.ACHIEVEMENTS) {
      // Skip if already unlocked
      if (userStats.achievements.some(ach => ach.id === achievementDef.id)) {
        continue;
      }
      
      let progress = 0;
      
      switch (achievementDef.id) {
        case 'first_experiment':
          progress = experiments.length >= 1 ? 1 : 0;
          break;
          
        case 'safety_first':
          progress = experiments.filter(exp => 
            exp.results.some(result => result.safetyScore > 80)
          ).length;
          break;
          
        case 'explorer':
          const uniqueConsumables = new Set(experiments.flatMap(exp => exp.consumables.map(c => c.id)));
          progress = uniqueConsumables.size;
          break;
          
        case 'mix_master':
          progress = experiments.length;
          break;
          
        case 'safety_expert':
          progress = experiments.filter(exp => 
            exp.results.every(result => result.safetyScore === 100)
          ).length;
          break;
          
        case 'category_master':
          const usedCategories = new Set(experiments.flatMap(exp => exp.consumables.map(c => c.category)));
          progress = usedCategories.size;
          break;
          
        case 'alchemist':
          progress = experiments.length;
          break;
          
        case 'perfectionist':
          progress = experiments.filter(exp => 
            exp.results.every(result => result.overallScore === 100)
          ).length;
          break;
          
        case 'innovator':
          progress = experiments.filter(exp => 
            exp.results.some(result => result.noveltyScore >= 90)
          ).length;
          break;
          
        case 'legend':
          progress = experiments.length;
          break;
          
        case 'guardian':
          progress = experiments.filter(exp => 
            exp.results.some(result => result.safetyScore < 30)
          ).length;
          break;
          
        case 'genius':
          progress = experiments.filter(exp => 
            exp.results.every(result => result.overallScore === 100)
          ).length;
          break;
      }
      
      if (progress >= achievementDef.maxProgress) {
        newAchievements.push({
          ...achievementDef,
          unlockedAt: new Date(),
          progress: achievementDef.maxProgress,
        });
      }
    }
    
    return newAchievements;
  }

  /**
   * Calculate streak bonus
   */
  static calculateStreakBonus(currentStreak: number): number {
    if (currentStreak < 2) return 0;
    if (currentStreak < 7) return 1.1; // 10% bonus
    if (currentStreak < 30) return 1.25; // 25% bonus
    return 1.5; // 50% bonus for 30+ days
  }

  /**
   * Calculate daily bonus
   */
  static calculateDailyBonus(lastExperimentDate: Date): number {
    const now = new Date();
    const daysSinceLastExperiment = Math.floor((now.getTime() - lastExperimentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastExperiment === 0) return 1.2; // 20% bonus for same day
    if (daysSinceLastExperiment === 1) return 1.1; // 10% bonus for next day
    return 1.0; // No bonus
  }

  /**
   * Get level rewards
   */
  static getLevelRewards(level: number): {
    title: string;
    description: string;
    unlocks: string[];
    bonusXP: number;
  } {
    const rewards: Record<number, any> = {
      1: {
        title: 'Novice Alchemist',
        description: 'Welcome to the world of consumable alchemy!',
        unlocks: ['Basic mixing', 'Safety guidelines'],
        bonusXP: 0,
      },
      5: {
        title: 'Apprentice Alchemist',
        description: 'You\'re getting the hang of this!',
        unlocks: ['Advanced mixing', 'Temperature control'],
        bonusXP: 50,
      },
      10: {
        title: 'Journeyman Alchemist',
        description: 'Your skills are growing!',
        unlocks: ['Complex combinations', 'Fermentation'],
        bonusXP: 100,
      },
      15: {
        title: 'Expert Alchemist',
        description: 'You\'ve mastered the basics!',
        unlocks: ['Distillation', 'Extraction'],
        bonusXP: 200,
      },
      20: {
        title: 'Master Alchemist',
        description: 'You are a true master!',
        unlocks: ['Synthesis', 'All techniques'],
        bonusXP: 500,
      },
    };
    
    return rewards[level] || {
      title: 'Legendary Alchemist',
      description: 'You have reached the pinnacle!',
      unlocks: ['All techniques mastered'],
      bonusXP: 1000,
    };
  }

  /**
   * Get rarity color for achievements
   */
  static getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  }

  /**
   * Get rarity background color for achievements
   */
  static getRarityBgColor(rarity: string): string {
    switch (rarity) {
      case 'common': return 'bg-gray-400/10';
      case 'rare': return 'bg-blue-400/10';
      case 'epic': return 'bg-purple-400/10';
      case 'legendary': return 'bg-yellow-400/10';
      default: return 'bg-gray-400/10';
    }
  }

  /**
   * Calculate total play time bonus
   */
  static calculatePlayTimeBonus(totalPlayTime: number): number {
    const hours = totalPlayTime / (1000 * 60 * 60);
    if (hours < 1) return 1.0;
    if (hours < 10) return 1.05; // 5% bonus
    if (hours < 50) return 1.1; // 10% bonus
    if (hours < 100) return 1.15; // 15% bonus
    return 1.2; // 20% bonus for 100+ hours
  }
}
