import { SafetyEngine } from '@/lib/safety-engine';
import { Consumable, SafetyLevel, ConsumableCategory } from '@/types';

describe('SafetyEngine', () => {
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

  describe('calculateSafetyScore', () => {
    it('should return high safety score for safe consumables', () => {
      const score = SafetyEngine.calculateSafetyScore([mockConsumable]);
      expect(score).toBeGreaterThan(80);
    });

    it('should return lower safety score for dangerous consumables', () => {
      const dangerousConsumable = { ...mockConsumable, safetyLevel: 'danger' as SafetyLevel };
      const score = SafetyEngine.calculateSafetyScore([dangerousConsumable]);
      expect(score).toBeLessThan(80);
    });

    it('should return very low safety score for lethal consumables', () => {
      const lethalConsumable = { ...mockConsumable, safetyLevel: 'lethal' as SafetyLevel };
      const score = SafetyEngine.calculateSafetyScore([lethalConsumable]);
      expect(score).toBeLessThan(50);
    });

    it('should penalize dangerous combinations', () => {
      const alcoholConsumable = { ...mockConsumable, name: 'beer', category: 'alcohol' as ConsumableCategory };
      const medicationConsumable = { ...mockConsumable, name: 'aspirin', category: 'medication' as ConsumableCategory };
      
      const score = SafetyEngine.calculateSafetyScore([alcoholConsumable, medicationConsumable]);
      expect(score).toBeLessThan(60);
    });

    it('should not penalize safe combinations', () => {
      const food1 = { ...mockConsumable, name: 'apple' };
      const food2 = { ...mockConsumable, name: 'banana' };
      
      const score = SafetyEngine.calculateSafetyScore([food1, food2]);
      expect(score).toBeGreaterThan(80);
    });

    it('should handle empty consumables array', () => {
      const score = SafetyEngine.calculateSafetyScore([]);
      expect(score).toBe(100);
    });

    it('should penalize invalid consumable data', () => {
      const invalidConsumable = { ...mockConsumable, name: '' };
      const score = SafetyEngine.calculateSafetyScore([invalidConsumable]);
      expect(score).toBeLessThan(100);
    });
  });

  describe('calculateEffectivenessScore', () => {
    it('should return moderate effectiveness score for basic consumables', () => {
      const score = SafetyEngine.calculateEffectivenessScore([mockConsumable]);
      expect(score).toBeGreaterThan(40);
      expect(score).toBeLessThan(80);
    });

    it('should return higher effectiveness score for nutritional compatibility', () => {
      const vitaminConsumable = { ...mockConsumable, name: 'vitamin c', category: 'supplement' as ConsumableCategory };
      const score = SafetyEngine.calculateEffectivenessScore([vitaminConsumable]);
      expect(score).toBeGreaterThan(50);
    });

    it('should return higher effectiveness score for synergistic effects', () => {
      const vitaminC = { ...mockConsumable, name: 'vitamin c', category: 'supplement' as ConsumableCategory };
      const iron = { ...mockConsumable, name: 'iron', category: 'supplement' as ConsumableCategory };
      
      const score = SafetyEngine.calculateEffectivenessScore([vitaminC, iron]);
      expect(score).toBeGreaterThan(50);
    });

    it('should handle empty consumables array', () => {
      const score = SafetyEngine.calculateEffectivenessScore([]);
      expect(score).toBe(50);
    });
  });

  describe('generateWarnings', () => {
    it('should include medical disclaimer', () => {
      const warnings = SafetyEngine.generateWarnings([mockConsumable]);
      expect(warnings.some(w => w.includes('DISCLAIMER'))).toBe(true);
    });

    it('should warn about dangerous consumables', () => {
      const dangerousConsumable = { ...mockConsumable, safetyLevel: 'danger' as SafetyLevel };
      const warnings = SafetyEngine.generateWarnings([dangerousConsumable]);
      expect(warnings.some(w => w.includes('DANGER'))).toBe(true);
    });

    it('should warn about lethal consumables', () => {
      const lethalConsumable = { ...mockConsumable, safetyLevel: 'lethal' as SafetyLevel };
      const warnings = SafetyEngine.generateWarnings([lethalConsumable]);
      expect(warnings.some(w => w.includes('DANGER'))).toBe(true);
    });

    it('should warn about alcohol and medication interactions', () => {
      const alcoholConsumable = { ...mockConsumable, name: 'beer', category: 'alcohol' as ConsumableCategory };
      const medicationConsumable = { ...mockConsumable, name: 'aspirin', category: 'medication' as ConsumableCategory };
      
      const warnings = SafetyEngine.generateWarnings([alcoholConsumable, medicationConsumable]);
      expect(warnings.some(w => w.includes('CRITICAL'))).toBe(true);
    });

    it('should warn about multiple stimulants', () => {
      const coffee = { ...mockConsumable, name: 'coffee' };
      const energyDrink = { ...mockConsumable, name: 'energy drink' };
      
      const warnings = SafetyEngine.generateWarnings([coffee, energyDrink]);
      expect(warnings.some(w => w.includes('Multiple stimulants'))).toBe(true);
    });

    it('should warn about unknown substances', () => {
      const unknownConsumable = { ...mockConsumable, source: 'manual' as any };
      const warnings = SafetyEngine.generateWarnings([unknownConsumable]);
      expect(warnings.some(w => w.includes('limited safety data'))).toBe(true);
    });

    it('should not generate warnings for safe combinations', () => {
      const food1 = { ...mockConsumable, name: 'apple' };
      const food2 = { ...mockConsumable, name: 'banana' };
      
      const warnings = SafetyEngine.generateWarnings([food1, food2]);
      expect(warnings.length).toBe(1); // Only the disclaimer
    });
  });

  describe('generateRecommendations', () => {
    it('should recommend caution for low safety scores', () => {
      const dangerousConsumable = { ...mockConsumable, safetyLevel: 'danger' as SafetyLevel };
      const recommendations = SafetyEngine.generateRecommendations([dangerousConsumable], 30);
      
      expect(recommendations.some(r => r.includes('low safety score'))).toBe(true);
    });

    it('should recommend safety for high safety scores', () => {
      const recommendations = SafetyEngine.generateRecommendations([mockConsumable], 90);
      expect(recommendations.some(r => r.includes('relatively safe'))).toBe(true);
    });

    it('should recommend seeking professional advice for very low scores', () => {
      const recommendations = SafetyEngine.generateRecommendations([mockConsumable], 20);
      expect(recommendations.some(r => r.includes('professional advice'))).toBe(true);
    });

    it('should recommend positive effects for high overall scores', () => {
      const recommendations = SafetyEngine.generateRecommendations([mockConsumable], 80);
      expect(recommendations.some(r => r.includes('shows promising results'))).toBe(true);
    });
  });

  describe('getSafetyPenalty', () => {
    it('should return 0 penalty for safe consumables', () => {
      const penalty = SafetyEngine['getSafetyPenalty']('safe' as SafetyLevel);
      expect(penalty).toBe(0);
    });

    it('should return 10 penalty for caution consumables', () => {
      const penalty = SafetyEngine['getSafetyPenalty']('caution' as SafetyLevel);
      expect(penalty).toBe(10);
    });

    it('should return 25 penalty for warning consumables', () => {
      const penalty = SafetyEngine['getSafetyPenalty']('warning' as SafetyLevel);
      expect(penalty).toBe(25);
    });

    it('should return 50 penalty for danger consumables', () => {
      const penalty = SafetyEngine['getSafetyPenalty']('danger' as SafetyLevel);
      expect(penalty).toBe(50);
    });

    it('should return 100 penalty for lethal consumables', () => {
      const penalty = SafetyEngine['getSafetyPenalty']('lethal' as SafetyLevel);
      expect(penalty).toBe(100);
    });
  });

  describe('checkDangerousCombinations', () => {
    it('should detect alcohol and medication combination', () => {
      const alcoholConsumable = { ...mockConsumable, name: 'beer', category: 'alcohol' as ConsumableCategory };
      const medicationConsumable = { ...mockConsumable, name: 'aspirin', category: 'medication' as ConsumableCategory };
      
      const penalty = SafetyEngine['checkDangerousCombinations']([alcoholConsumable, medicationConsumable]);
      expect(penalty).toBeGreaterThan(0);
    });

    it('should detect multiple caffeine sources', () => {
      const coffee = { ...mockConsumable, name: 'coffee' };
      const energyDrink = { ...mockConsumable, name: 'energy drink' };
      
      const penalty = SafetyEngine['checkDangerousCombinations']([coffee, energyDrink]);
      expect(penalty).toBeGreaterThan(0);
    });

    it('should not penalize safe combinations', () => {
      const food1 = { ...mockConsumable, name: 'apple' };
      const food2 = { ...mockConsumable, name: 'banana' };
      
      const penalty = SafetyEngine['checkDangerousCombinations']([food1, food2]);
      expect(penalty).toBe(0);
    });
  });

  describe('checkAlcoholInteractions', () => {
    it('should detect alcohol interactions', () => {
      const alcoholConsumable = { ...mockConsumable, category: 'alcohol' as ConsumableCategory };
      const penalty = SafetyEngine['checkAlcoholInteractions']([alcoholConsumable]);
      expect(penalty).toBeGreaterThan(0);
    });

    it('should not penalize non-alcohol consumables', () => {
      const penalty = SafetyEngine['checkAlcoholInteractions']([mockConsumable]);
      expect(penalty).toBe(0);
    });
  });

  describe('checkMedicationInteractions', () => {
    it('should detect medication interactions', () => {
      const medicationConsumable = { ...mockConsumable, category: 'medication' as ConsumableCategory };
      const penalty = SafetyEngine['checkMedicationInteractions']([medicationConsumable]);
      expect(penalty).toBeGreaterThan(0);
    });

    it('should not penalize non-medication consumables', () => {
      const penalty = SafetyEngine['checkMedicationInteractions']([mockConsumable]);
      expect(penalty).toBe(0);
    });
  });
});
