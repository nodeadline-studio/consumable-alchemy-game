import { MedicalDatabase } from '@/lib/medical-database';
import { Consumable, SafetyLevel, ConsumableCategory } from '@/types';

describe('MedicalDatabase', () => {
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

  describe('getMedicalSafetyLevel', () => {
    it('should return safe for food category', () => {
      const safetyLevel = MedicalDatabase.getMedicalSafetyLevel(mockConsumable);
      expect(safetyLevel).toBe('safe');
    });

    it('should return warning for alcohol category', () => {
      const alcoholConsumable = { ...mockConsumable, category: 'alcohol' as ConsumableCategory };
      const safetyLevel = MedicalDatabase.getMedicalSafetyLevel(alcoholConsumable);
      expect(safetyLevel).toBe('warning');
    });

    it('should return caution for medication category', () => {
      const medicationConsumable = { ...mockConsumable, category: 'medication' as ConsumableCategory };
      const safetyLevel = MedicalDatabase.getMedicalSafetyLevel(medicationConsumable);
      expect(safetyLevel).toBe('caution');
    });

    it('should return safe for supplement category', () => {
      const supplementConsumable = { ...mockConsumable, category: 'supplement' as ConsumableCategory };
      const safetyLevel = MedicalDatabase.getMedicalSafetyLevel(supplementConsumable);
      expect(safetyLevel).toBe('safe');
    });

    it('should return caution for herb category', () => {
      const herbConsumable = { ...mockConsumable, category: 'herb' as ConsumableCategory };
      const safetyLevel = MedicalDatabase.getMedicalSafetyLevel(herbConsumable);
      expect(safetyLevel).toBe('caution');
    });

    it('should return warning for alcohol by name', () => {
      const alcoholConsumable = { ...mockConsumable, name: 'beer' };
      const safetyLevel = MedicalDatabase.getMedicalSafetyLevel(alcoholConsumable);
      expect(safetyLevel).toBe('warning');
    });

    it('should return caution for caffeine by name', () => {
      const caffeineConsumable = { ...mockConsumable, name: 'coffee' };
      const safetyLevel = MedicalDatabase.getMedicalSafetyLevel(caffeineConsumable);
      expect(safetyLevel).toBe('caution');
    });

    it('should return safe for vitamin C by name', () => {
      const vitaminConsumable = { ...mockConsumable, name: 'vitamin c' };
      const safetyLevel = MedicalDatabase.getMedicalSafetyLevel(vitaminConsumable);
      expect(safetyLevel).toBe('safe');
    });
  });

  describe('checkDangerousInteractions', () => {
    it('should detect alcohol and medication interaction', () => {
      const alcoholConsumable = { ...mockConsumable, name: 'beer', category: 'alcohol' as ConsumableCategory };
      const medicationConsumable = { ...mockConsumable, name: 'aspirin', category: 'medication' as ConsumableCategory };
      
      const result = MedicalDatabase.checkDangerousInteractions([alcoholConsumable, medicationConsumable]);
      
      expect(result.hasDangerousInteraction).toBe(true);
      expect(result.interactions.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should detect caffeine and medication interaction', () => {
      const caffeineConsumable = { ...mockConsumable, name: 'coffee' };
      const medicationConsumable = { ...mockConsumable, name: 'aspirin', category: 'medication' as ConsumableCategory };
      
      const result = MedicalDatabase.checkDangerousInteractions([caffeineConsumable, medicationConsumable]);
      
      expect(result.hasDangerousInteraction).toBe(true);
      expect(result.interactions.length).toBeGreaterThan(0);
    });

    it('should detect grapefruit and medication interaction', () => {
      const grapefruitConsumable = { ...mockConsumable, name: 'grapefruit' };
      const medicationConsumable = { ...mockConsumable, name: 'aspirin', category: 'medication' as ConsumableCategory };
      
      const result = MedicalDatabase.checkDangerousInteractions([grapefruitConsumable, medicationConsumable]);
      
      expect(result.hasDangerousInteraction).toBe(true);
      expect(result.interactions.length).toBeGreaterThan(0);
    });

    it('should not detect dangerous interaction for safe foods', () => {
      const food1 = { ...mockConsumable, name: 'apple' };
      const food2 = { ...mockConsumable, name: 'banana' };
      
      const result = MedicalDatabase.checkDangerousInteractions([food1, food2]);
      
      expect(result.hasDangerousInteraction).toBe(false);
      expect(result.interactions.length).toBe(0);
    });

    it('should not detect dangerous interaction for single consumable', () => {
      const result = MedicalDatabase.checkDangerousInteractions([mockConsumable]);
      
      expect(result.hasDangerousInteraction).toBe(false);
      expect(result.interactions.length).toBe(0);
    });
  });

  describe('getMedicalRecommendations', () => {
    it('should include medical disclaimer', () => {
      const recommendations = MedicalDatabase.getMedicalRecommendations([mockConsumable]);
      
      expect(recommendations).toContain('⚠️ MEDICAL DISCLAIMER: This information is for educational purposes only. Always consult with a healthcare professional before combining substances.');
    });

    it('should warn about alcohol interactions', () => {
      const alcoholConsumable = { ...mockConsumable, category: 'alcohol' as ConsumableCategory };
      const recommendations = MedicalDatabase.getMedicalRecommendations([alcoholConsumable]);
      
      expect(recommendations.some(rec => rec.includes('ALCOHOL WARNING'))).toBe(true);
    });

    it('should warn about medication interactions', () => {
      const medicationConsumable = { ...mockConsumable, category: 'medication' as ConsumableCategory };
      const recommendations = MedicalDatabase.getMedicalRecommendations([medicationConsumable]);
      
      expect(recommendations.some(rec => rec.includes('MEDICATION WARNING'))).toBe(true);
    });

    it('should inform about supplement interactions', () => {
      const supplementConsumable = { ...mockConsumable, category: 'supplement' as ConsumableCategory };
      const recommendations = MedicalDatabase.getMedicalRecommendations([supplementConsumable]);
      
      expect(recommendations.some(rec => rec.includes('SUPPLEMENT INFO'))).toBe(true);
    });

    it('should warn about dangerous interactions', () => {
      const alcoholConsumable = { ...mockConsumable, name: 'beer', category: 'alcohol' as ConsumableCategory };
      const medicationConsumable = { ...mockConsumable, name: 'aspirin', category: 'medication' as ConsumableCategory };
      
      const recommendations = MedicalDatabase.getMedicalRecommendations([alcoholConsumable, medicationConsumable]);
      
      expect(recommendations.some(rec => rec.includes('CRITICAL'))).toBe(true);
    });
  });

  describe('validateConsumableData', () => {
    it('should validate correct consumable data', () => {
      const validation = MedicalDatabase.validateConsumableData(mockConsumable);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should detect missing name', () => {
      const invalidConsumable = { ...mockConsumable, name: '' };
      const validation = MedicalDatabase.validateConsumableData(invalidConsumable);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Consumable name is required');
    });

    it('should detect missing category', () => {
      const invalidConsumable = { ...mockConsumable, category: undefined as any };
      const validation = MedicalDatabase.validateConsumableData(invalidConsumable);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Consumable category is required');
    });

    it('should warn about suspicious safety levels for food', () => {
      const suspiciousConsumable = { ...mockConsumable, safetyLevel: 'lethal' as SafetyLevel };
      const validation = MedicalDatabase.validateConsumableData(suspiciousConsumable);
      
      expect(validation.warnings.some(w => w.includes('should not be marked as lethal'))).toBe(true);
    });

    it('should warn about missing nutritional data for food', () => {
      const foodWithoutNutrition = { ...mockConsumable, nutritionalInfo: undefined };
      const validation = MedicalDatabase.validateConsumableData(foodWithoutNutrition);
      
      expect(validation.warnings.some(w => w.includes('should have nutritional information'))).toBe(true);
    });

    it('should warn about unrealistic calorie count', () => {
      const highCalorieConsumable = {
        ...mockConsumable,
        nutritionalInfo: { ...mockConsumable.nutritionalInfo!, calories: 2000 }
      };
      const validation = MedicalDatabase.validateConsumableData(highCalorieConsumable);
      
      expect(validation.warnings.some(w => w.includes('unusually high'))).toBe(true);
    });

    it('should warn about unrealistic protein content', () => {
      const highProteinConsumable = {
        ...mockConsumable,
        nutritionalInfo: { ...mockConsumable.nutritionalInfo!, protein: 200 }
      };
      const validation = MedicalDatabase.validateConsumableData(highProteinConsumable);
      
      expect(validation.warnings.some(w => w.includes('unusually high'))).toBe(true);
    });

    it('should warn about unrealistic carbohydrate content', () => {
      const highCarbConsumable = {
        ...mockConsumable,
        nutritionalInfo: { ...mockConsumable.nutritionalInfo!, carbs: 200 }
      };
      const validation = MedicalDatabase.validateConsumableData(highCarbConsumable);
      
      expect(validation.warnings.some(w => w.includes('unusually high'))).toBe(true);
    });

    it('should warn about unrealistic fat content', () => {
      const highFatConsumable = {
        ...mockConsumable,
        nutritionalInfo: { ...mockConsumable.nutritionalInfo!, fat: 200 }
      };
      const validation = MedicalDatabase.validateConsumableData(highFatConsumable);
      
      expect(validation.warnings.some(w => w.includes('unusually high'))).toBe(true);
    });
  });
});
