import { UserProfile, UserStats, Achievement, Experiment, ConsumableCategory } from '@/types';
import { GamificationEngine } from './gamification-engine';

/**
 * Progression Tracker
 * Tracks user progress and handles leveling up
 */
export class ProgressionTracker {
  private static instance: ProgressionTracker;
  private callbacks: ((event: ProgressionEvent) => void)[] = [];

  static getInstance(): ProgressionTracker {
    if (!ProgressionTracker.instance) {
      ProgressionTracker.instance = new ProgressionTracker();
    }
    return ProgressionTracker.instance;
  }

  /**
   * Subscribe to progression events
   */
  subscribe(callback: (event: ProgressionEvent) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Emit progression event
   */
  private emit(event: ProgressionEvent): void {
    this.callbacks.forEach(callback => callback(event));
  }

  /**
   * Process experiment completion
   */
  processExperimentCompletion(
    userProfile: UserProfile,
    experiment: Experiment,
    allExperiments: Experiment[]
  ): {
    updatedProfile: UserProfile;
    newAchievements: Achievement[];
    levelUp: boolean;
    xpGained: number;
  } {
    const xpGained = GamificationEngine.calculateExperimentXP(experiment);
    const newXP = userProfile.stats.experience + xpGained;
    const oldLevel = userProfile.stats.level;
    const newLevel = GamificationEngine.calculateLevel(newXP);
    const levelUp = newLevel > oldLevel;

    // Update user stats
    const updatedStats: UserStats = {
      ...userProfile.stats,
      experience: newXP,
      level: newLevel,
      experiments: userProfile.stats.experiments + 1,
      totalPlayTime: userProfile.stats.totalPlayTime + this.calculateExperimentTime(experiment),
    };

    // Check for new achievements
    const newAchievements = GamificationEngine.checkAchievements(updatedStats, allExperiments);
    
    // Update favorite categories
    const categoryCounts = this.calculateCategoryCounts(allExperiments);
    updatedStats.favoriteCategories = this.getTopCategories(categoryCounts, 3);

    // Update streak
    updatedStats.streak = this.calculateStreak(allExperiments);

    const updatedProfile: UserProfile = {
      ...userProfile,
      stats: updatedStats,
    };

    // Emit events
    this.emit({
      type: 'experiment_completed',
      data: {
        experiment,
        xpGained,
        newLevel,
        levelUp,
      },
    });

    if (levelUp) {
      this.emit({
        type: 'level_up',
        data: {
          oldLevel,
          newLevel,
          rewards: GamificationEngine.getLevelRewards(newLevel),
        },
      });
    }

    if (newAchievements.length > 0) {
      this.emit({
        type: 'achievement_unlocked',
        data: {
          achievements: newAchievements,
        },
      });
    }

    return {
      updatedProfile,
      newAchievements,
      levelUp,
      xpGained,
    };
  }

  /**
   * Calculate experiment time (simplified)
   */
  private calculateExperimentTime(experiment: Experiment): number {
    // Base time: 2 minutes per experiment
    const baseTime = 2 * 60 * 1000;
    
    // Bonus time for complex experiments
    const complexityBonus = experiment.consumables.length * 30 * 1000; // 30 seconds per consumable
    
    return baseTime + complexityBonus;
  }

  /**
   * Calculate category usage counts
   */
  private calculateCategoryCounts(experiments: Experiment[]): Record<ConsumableCategory, number> {
    const counts: Record<string, number> = {};
    
    experiments.forEach(experiment => {
      experiment.consumables.forEach(consumable => {
        counts[consumable.category] = (counts[consumable.category] || 0) + 1;
      });
    });
    
    return counts as Record<ConsumableCategory, number>;
  }

  /**
   * Get top categories by usage
   */
  private getTopCategories(
    categoryCounts: Record<ConsumableCategory, number>,
    limit: number
  ): ConsumableCategory[] {
    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([category]) => category as ConsumableCategory);
  }

  /**
   * Calculate current streak
   */
  private calculateStreak(experiments: Experiment[]): number {
    if (experiments.length === 0) return 0;
    
    // Sort experiments by timestamp (newest first)
    const sortedExperiments = [...experiments].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    
    let streak = 0;
    const now = new Date();
    let currentDate = new Date(now);
    currentDate.setHours(0, 0, 0, 0);
    
    for (const experiment of sortedExperiments) {
      const experimentDate = new Date(experiment.timestamp);
      experimentDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor(
        (currentDate.getTime() - experimentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff === 0) {
        // Same day, continue streak
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (daysDiff === 1) {
        // Next day, continue streak
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // Gap in streak, break
        break;
      }
    }
    
    return streak;
  }

  /**
   * Get progression summary
   */
  getProgressionSummary(userProfile: UserProfile): {
    level: number;
    experience: number;
    levelProgress: {
      currentLevelXP: number;
      nextLevelXP: number;
      progress: number;
      xpNeeded: number;
    };
    achievements: {
      total: number;
      unlocked: number;
      byRarity: Record<string, number>;
    };
    stats: {
      experiments: number;
      streak: number;
      totalPlayTime: number;
      favoriteCategories: ConsumableCategory[];
    };
  } {
    const levelProgress = GamificationEngine.getLevelProgress(
      userProfile.stats.experience,
      userProfile.stats.level
    );
    
    const achievements = userProfile.stats.achievements;
    const achievementCounts = achievements.reduce((acc, achievement) => {
      acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      level: userProfile.stats.level,
      experience: userProfile.stats.experience,
      levelProgress,
      achievements: {
        total: GamificationEngine['ACHIEVEMENTS'].length,
        unlocked: achievements.length,
        byRarity: achievementCounts,
      },
      stats: {
        experiments: userProfile.stats.experiments,
        streak: userProfile.stats.streak,
        totalPlayTime: userProfile.stats.totalPlayTime,
        favoriteCategories: userProfile.stats.favoriteCategories,
      },
    };
  }

  /**
   * Get next milestone
   */
  getNextMilestone(userProfile: UserProfile): {
    type: 'level' | 'achievement' | 'streak' | 'experiments';
    description: string;
    progress: number;
    maxProgress: number;
    reward: string;
  } | null {
    const levelProgress = GamificationEngine.getLevelProgress(
      userProfile.stats.experience,
      userProfile.stats.level
    );
    
    // Check level milestone
    if (levelProgress.xpNeeded > 0) {
      return {
        type: 'level',
        description: `Reach Level ${userProfile.stats.level + 1}`,
        progress: levelProgress.progress,
        maxProgress: 100,
        reward: `Unlock new techniques and ${GamificationEngine.getLevelRewards(userProfile.stats.level + 1).bonusXP} bonus XP`,
      };
    }
    
    // Check experiment milestone
    const nextExperimentMilestone = this.getNextExperimentMilestone(userProfile.stats.experiments);
    if (nextExperimentMilestone) {
      return nextExperimentMilestone;
    }
    
    // Check streak milestone
    const nextStreakMilestone = this.getNextStreakMilestone(userProfile.stats.streak);
    if (nextStreakMilestone) {
      return nextStreakMilestone;
    }
    
    return null;
  }

  /**
   * Get next experiment milestone
   */
  private getNextExperimentMilestone(experimentCount: number): any {
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    const nextMilestone = milestones.find(milestone => experimentCount < milestone);
    
    if (nextMilestone) {
      return {
        type: 'experiments' as const,
        description: `Complete ${nextMilestone} experiments`,
        progress: (experimentCount / nextMilestone) * 100,
        maxProgress: 100,
        reward: `${nextMilestone * 2} bonus XP`,
      };
    }
    
    return null;
  }

  /**
   * Get next streak milestone
   */
  private getNextStreakMilestone(streak: number): any {
    const milestones = [3, 7, 14, 30, 60, 100];
    const nextMilestone = milestones.find(milestone => streak < milestone);
    
    if (nextMilestone) {
      return {
        type: 'streak' as const,
        description: `Maintain ${nextMilestone}-day streak`,
        progress: (streak / nextMilestone) * 100,
        maxProgress: 100,
        reward: `${nextMilestone * 5} bonus XP`,
      };
    }
    
    return null;
  }
}

export interface ProgressionEvent {
  type: 'experiment_completed' | 'level_up' | 'achievement_unlocked';
  data: any;
}
