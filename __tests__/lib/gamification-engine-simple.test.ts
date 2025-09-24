import { GamificationEngine } from '../../lib/gamification-engine';

describe('GamificationEngine', () => {
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
  });
});
