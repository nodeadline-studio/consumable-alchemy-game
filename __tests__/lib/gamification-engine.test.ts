import { GamificationEngine } from '@/lib/gamification-engine';
import { Experiment, Consumable, SafetyLevel, ConsumableCategory } from '@/types';

describe('GamificationEngine', () => {
  const mockConsumable: Consumable = {
    id: '1',
    name: 'Test Food',
    category: 'food' as ConsumableCategory,
    type: 'solid',
    safetyLevel: 'safe' as SafetyLevel,
    source: 'openfoodfacts',
    nutritionalInfo: {
      calories: 100,
      protein: 10,
      carbs: 20,
      fat: 5,
    },
  };

  const mockExperiment: Experiment = {
    id: '1',
    userId: '1',
    consumables: [mockConsumable],
    combinations: [],
    results: [{
      id: '1',
      combination: {
        id: '1',
        consumables: [mockConsumable],
        ratio: { '1': 100 },
        method: 'mix',
      },
      effects: [],
      interactions: [],
      safetyScore: 90,
      effectivenessScore: 85,
      noveltyScore: 80,
      overallScore: 85,
      warnings: [],
      recommendations: [],
    }],
    timestamp: new Date(),
    success: true,
    score: 85,
  };

  describe('calculateExperimentXP', () => {
    it('should calculate base XP for an experiment', () => {
      const xp = GamificationEngine.calculateExperimentXP(mockExperiment);
      expect(xp).toBeGreaterThan(0);
    });

    it('should give bonus XP for high safety scores', () => {
      const highSafetyExperiment = {
        ...mockExperiment,
        results: [{
          ...mockExperiment.results[0],
          safetyScore: 95,
        }],
      };
      
      const xp = GamificationEngine.calculateExperimentXP(highSafetyExperiment);
      expect(xp).toBeGreaterThan(10); // Base XP is 10
    });

    it('should give bonus XP for high effectiveness scores', () => {
      const highEffectivenessExperiment = {
        ...mockExperiment,
        results: [{
          ...mockExperiment.results[0],
          effectivenessScore: 95,
        }],
      };
      
      const xp = GamificationEngine.calculateExperimentXP(highEffectivenessExperiment);
      expect(xp).toBeGreaterThan(10);
    });

    it('should give bonus XP for high novelty scores', () => {
      const highNoveltyExperiment = {
        ...mockExperiment,
        results: [{
          ...mockExperiment.results[0],
          noveltyScore: 95,
        }],
      };
      
      const xp = GamificationEngine.calculateExperimentXP(highNoveltyExperiment);
      expect(xp).toBeGreaterThan(10);
    });

    it('should give bonus XP for complex experiments', () => {
      const complexExperiment = {
        ...mockExperiment,
        consumables: [mockConsumable, mockConsumable, mockConsumable, mockConsumable, mockConsumable],
      };
      
      const xp = GamificationEngine.calculateExperimentXP(complexExperiment);
      expect(xp).toBeGreaterThan(10);
    });

    it('should give bonus XP for successful experiments', () => {
      const successfulExperiment = {
        ...mockExperiment,
        success: true,
      };
      
      const xp = GamificationEngine.calculateExperimentXP(successfulExperiment);
      expect(xp).toBeGreaterThan(10);
    });

    it('should give penalty XP for low safety scores', () => {
      const lowSafetyExperiment = {
        ...mockExperiment,
        results: [{
          ...mockExperiment.results[0],
          safetyScore: 30,
          effectivenessScore: 30, // Low effectiveness
          noveltyScore: 30, // Low novelty
          overallScore: 30, // Low overall
        }],
        success: false, // Failed experiment
      };
      
      const xp = GamificationEngine.calculateExperimentXP(lowSafetyExperiment);
      expect(xp).toBeLessThan(10);
    });
  });

  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(GamificationEngine.calculateLevel(0)).toBe(1);
    });

    it('should return level 2 for 100 XP', () => {
      expect(GamificationEngine.calculateLevel(100)).toBe(2);
    });

    it('should return level 3 for 250 XP', () => {
      expect(GamificationEngine.calculateLevel(250)).toBe(3);
    });

    it('should return level 10 for 2700 XP', () => {
      expect(GamificationEngine.calculateLevel(2700)).toBe(10);
    });

    it('should return level 20 for 10450 XP', () => {
      expect(GamificationEngine.calculateLevel(10450)).toBe(20);
    });

    it('should return level 20 for XP above max level', () => {
      expect(GamificationEngine.calculateLevel(20000)).toBe(20);
    });
  });

  describe('getXPForNextLevel', () => {
    it('should return 100 XP for level 1', () => {
      expect(GamificationEngine.getXPForNextLevel(1)).toBe(100);
    });

    it('should return 250 XP for level 2', () => {
      expect(GamificationEngine.getXPForNextLevel(2)).toBe(250);
    });

    it('should return 0 for max level', () => {
      expect(GamificationEngine.getXPForNextLevel(20)).toBe(0);
    });

    it('should return 0 for level above max', () => {
      expect(GamificationEngine.getXPForNextLevel(25)).toBe(0);
    });
  });

  describe('getLevelProgress', () => {
    it('should calculate progress correctly for level 1', () => {
      const progress = GamificationEngine.getLevelProgress(50, 1);
      expect(progress.currentLevelXP).toBe(0);
      expect(progress.nextLevelXP).toBe(100);
      expect(progress.progress).toBe(50);
      expect(progress.xpNeeded).toBe(50);
    });

    it('should calculate progress correctly for level 2', () => {
      const progress = GamificationEngine.getLevelProgress(175, 2);
      expect(progress.currentLevelXP).toBe(100);
      expect(progress.nextLevelXP).toBe(250);
      expect(progress.progress).toBe(50);
      expect(progress.xpNeeded).toBe(75);
    });

    it('should return 100% progress for max level', () => {
      const progress = GamificationEngine.getLevelProgress(20000, 20);
      expect(progress.progress).toBe(100);
      expect(progress.xpNeeded).toBe(0);
    });
  });

  describe('getRarityColor', () => {
    it('should return correct color for common rarity', () => {
      expect(GamificationEngine.getRarityColor('common')).toBe('text-gray-400');
    });

    it('should return correct color for rare rarity', () => {
      expect(GamificationEngine.getRarityColor('rare')).toBe('text-blue-400');
    });

    it('should return correct color for epic rarity', () => {
      expect(GamificationEngine.getRarityColor('epic')).toBe('text-purple-400');
    });

    it('should return correct color for legendary rarity', () => {
      expect(GamificationEngine.getRarityColor('legendary')).toBe('text-yellow-400');
    });

    it('should return default color for unknown rarity', () => {
      expect(GamificationEngine.getRarityColor('unknown')).toBe('text-gray-400');
    });
  });

  describe('getRarityBgColor', () => {
    it('should return correct background color for common rarity', () => {
      expect(GamificationEngine.getRarityBgColor('common')).toBe('bg-gray-400/10');
    });

    it('should return correct background color for rare rarity', () => {
      expect(GamificationEngine.getRarityBgColor('rare')).toBe('bg-blue-400/10');
    });

    it('should return correct background color for epic rarity', () => {
      expect(GamificationEngine.getRarityBgColor('epic')).toBe('bg-purple-400/10');
    });

    it('should return correct background color for legendary rarity', () => {
      expect(GamificationEngine.getRarityBgColor('legendary')).toBe('bg-yellow-400/10');
    });

    it('should return default background color for unknown rarity', () => {
      expect(GamificationEngine.getRarityBgColor('unknown')).toBe('bg-gray-400/10');
    });
  });

  describe('getLevelRewards', () => {
    it('should return rewards for level 1', () => {
      const rewards = GamificationEngine.getLevelRewards(1);
      expect(rewards.title).toBe('Novice Alchemist');
      expect(rewards.bonusXP).toBe(0);
      expect(rewards.unlocks).toContain('Basic mixing');
    });

    it('should return rewards for level 5', () => {
      const rewards = GamificationEngine.getLevelRewards(5);
      expect(rewards.title).toBe('Apprentice Alchemist');
      expect(rewards.bonusXP).toBe(50);
      expect(rewards.unlocks).toContain('Advanced mixing');
    });

    it('should return rewards for level 10', () => {
      const rewards = GamificationEngine.getLevelRewards(10);
      expect(rewards.title).toBe('Journeyman Alchemist');
      expect(rewards.bonusXP).toBe(100);
      expect(rewards.unlocks).toContain('Complex combinations');
    });

    it('should return rewards for level 20', () => {
      const rewards = GamificationEngine.getLevelRewards(20);
      expect(rewards.title).toBe('Master Alchemist');
      expect(rewards.bonusXP).toBe(500);
      expect(rewards.unlocks).toContain('Synthesis');
    });

    it('should return legendary rewards for level above 20', () => {
      const rewards = GamificationEngine.getLevelRewards(25);
      expect(rewards.title).toBe('Legendary Alchemist');
      expect(rewards.bonusXP).toBe(1000);
    });
  });
});
