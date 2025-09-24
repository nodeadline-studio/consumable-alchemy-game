import { Consumable, SafetyLevel, ConsumableCategory } from '@/types';

/**
 * Medical Database Service
 * Provides real medical data validation and safety information
 */
export class MedicalDatabase {
  // Known dangerous interactions
  private static dangerousInteractions = new Map<string, string[]>([
    ['alcohol', ['medication', 'supplement', 'herb']],
    ['medication', ['alcohol', 'grapefruit', 'caffeine']],
    ['caffeine', ['medication', 'alcohol']],
    ['grapefruit', ['medication']],
    ['st_johns_wort', ['medication']],
    ['ginkgo', ['medication']],
    ['garlic', ['medication']],
    ['ginger', ['medication']],
  ]);

  // Known safe combinations
  private static safeCombinations = new Map<string, string[]>([
    ['vitamin_c', ['iron']],
    ['calcium', ['vitamin_d']],
    ['omega_3', ['vitamin_e']],
    ['probiotics', ['prebiotics']],
  ]);

  // Medical safety levels based on real data
  private static medicalSafetyLevels = new Map<string, SafetyLevel>([
    // High risk substances
    ['alcohol', 'warning'],
    ['caffeine', 'caution'],
    ['nicotine', 'danger'],
    ['cocaine', 'lethal'],
    ['heroin', 'lethal'],
    ['methamphetamine', 'lethal'],
    
    // Medications (generally caution unless specified)
    ['aspirin', 'caution'],
    ['ibuprofen', 'caution'],
    ['acetaminophen', 'caution'],
    ['warfarin', 'warning'],
    ['digoxin', 'warning'],
    ['lithium', 'warning'],
    
    // Supplements (generally safe unless specified)
    ['vitamin_c', 'safe'],
    ['vitamin_d', 'safe'],
    ['vitamin_b12', 'safe'],
    ['iron', 'caution'],
    ['magnesium', 'safe'],
    ['zinc', 'caution'],
    
    // Herbs (generally caution)
    ['st_johns_wort', 'warning'],
    ['ginkgo', 'caution'],
    ['garlic', 'caution'],
    ['ginger', 'safe'],
    ['turmeric', 'safe'],
    ['echinacea', 'caution'],
  ]);

  /**
   * Get medical safety level for a consumable
   */
  static getMedicalSafetyLevel(consumable: Consumable): SafetyLevel {
    const name = consumable.name.toLowerCase();
    const category = consumable.category.toLowerCase();
    
    // Check for exact matches in name
    for (const [key, level] of Array.from(this.medicalSafetyLevels.entries())) {
      if (name.includes(key)) {
        return level;
      }
    }
    
    // Check for category-based matches
    if (category === 'alcohol' || name.includes('alcohol') || name.includes('beer') || name.includes('wine') || name.includes('whiskey') || name.includes('vodka')) {
      return 'warning';
    }
    
    if (name.includes('caffeine') || name.includes('coffee') || name.includes('tea') || name.includes('energy drink')) {
      return 'caution';
    }
    
    // Check by category
    switch (consumable.category) {
      case 'alcohol':
        return 'warning';
      case 'medication':
        return 'caution';
      case 'supplement':
        return 'safe';
      case 'herb':
        return 'caution';
      case 'food':
        return 'safe';
      default:
        return 'caution';
    }
  }

  /**
   * Check for dangerous interactions between consumables
   */
  static checkDangerousInteractions(consumables: Consumable[]): {
    hasDangerousInteraction: boolean;
    interactions: string[];
    warnings: string[];
  } {
    const interactions: string[] = [];
    const warnings: string[] = [];
    let hasDangerousInteraction = false;

    for (let i = 0; i < consumables.length; i++) {
      for (let j = i + 1; j < consumables.length; j++) {
        const consumable1 = consumables[i];
        const consumable2 = consumables[j];
        
        const interaction = this.checkInteraction(consumable1, consumable2);
        if (interaction) {
          interactions.push(interaction);
          hasDangerousInteraction = true;
          
          // Add specific warnings based on interaction type
          if (interaction.includes('alcohol') && interaction.includes('medication')) {
            warnings.push('🚨 CRITICAL: Alcohol and medication interaction can be life-threatening');
          } else if (interaction.includes('grapefruit') && interaction.includes('medication')) {
            warnings.push('⚠️ WARNING: Grapefruit can interfere with medication absorption');
          } else if (interaction.includes('caffeine') && interaction.includes('medication')) {
            warnings.push('⚠️ WARNING: Caffeine may affect medication effectiveness');
          }
        }
      }
    }

    return {
      hasDangerousInteraction,
      interactions,
      warnings,
    };
  }

  /**
   * Check interaction between two specific consumables
   */
  private static checkInteraction(consumable1: Consumable, consumable2: Consumable): string | null {
    const name1 = consumable1.name.toLowerCase();
    const name2 = consumable2.name.toLowerCase();
    const category1 = consumable1.category.toLowerCase();
    const category2 = consumable2.category.toLowerCase();
    
    // Check for dangerous interactions using both name and category matching
    for (const [substance, dangerousWith] of Array.from(this.dangerousInteractions.entries())) {
      // Check if first consumable matches the substance
      if (this.isSubstanceMatch(name1, category1, substance)) {
        const dangerousMatch = dangerousWith.find((dw: string) => this.isSubstanceMatch(name2, category2, dw));
        if (dangerousMatch) {
          return `${substance} + ${dangerousMatch}`;
        }
      }
      
      // Check reverse interaction
      if (this.isSubstanceMatch(name2, category2, substance)) {
        const dangerousMatch = dangerousWith.find((dw: string) => this.isSubstanceMatch(name1, category1, dw));
        if (dangerousMatch) {
          return `${substance} + ${dangerousMatch}`;
        }
      }
    }
    
    return null;
  }

  /**
   * Check if a consumable matches a substance by name or category
   */
  private static isSubstanceMatch(name: string, category: string, substance: string): boolean {
    // Direct name match
    if (name.includes(substance)) {
      return true;
    }
    
    // Category-based matching
    const categoryMappings: Record<string, string[]> = {
      'alcohol': ['beer', 'wine', 'whiskey', 'vodka', 'rum', 'gin', 'tequila', 'brandy', 'champagne', 'cider', 'liquor', 'spirits'],
      'caffeine': ['coffee', 'tea', 'energy drink', 'soda', 'cola', 'coca', 'guarana', 'mate', 'yerba'],
      'medication': ['aspirin', 'ibuprofen', 'acetaminophen', 'paracetamol', 'tylenol', 'advil', 'motrin', 'naproxen', 'warfarin', 'coumadin', 'digoxin', 'lanoxin', 'lithium', 'prozac', 'zoloft', 'paxil', 'lexapro', 'celexa', 'wellbutrin', 'effexor', 'cymbalta', 'abilify', 'risperdal', 'zyprexa', 'seroquel', 'geodon', 'invega', 'latuda', 'vraylar', 'rexulti', 'caplyta', 'fanapt', 'clozaril', 'thorazine', 'haldol', 'navane', 'stelazine', 'trilafon', 'prolixin', 'mellaril', 'serentil', 'thioridazine', 'mesoridazine', 'perphenazine', 'fluphenazine', 'trifluoperazine', 'chlorpromazine', 'thioridazine', 'mesoridazine', 'perphenazine', 'fluphenazine', 'trifluoperazine', 'chlorpromazine'],
      'grapefruit': ['grapefruit', 'grapefruit juice', 'citrus paradisi'],
      'st_johns_wort': ['st johns wort', 'st. johns wort', 'hypericum', 'goatweed', 'klamath weed'],
      'ginkgo': ['ginkgo', 'ginkgo biloba', 'maidenhair tree'],
      'garlic': ['garlic', 'allium sativum'],
      'ginger': ['ginger', 'zingiber officinale'],
    };
    
    // Check category mapping
    if (categoryMappings[substance]) {
      return categoryMappings[substance].some(alias => name.includes(alias));
    }
    
    // Check if category matches
    if (category === substance) {
      return true;
    }
    
    return false;
  }

  /**
   * Get medical recommendations for a combination
   */
  static getMedicalRecommendations(consumables: Consumable[]): string[] {
    const recommendations: string[] = [];
    
    // Add general medical disclaimer
    recommendations.push('⚠️ MEDICAL DISCLAIMER: This information is for educational purposes only. Always consult with a healthcare professional before combining substances.');
    
    // Check for dangerous interactions
    const { hasDangerousInteraction, warnings } = this.checkDangerousInteractions(consumables);
    
    if (hasDangerousInteraction) {
      recommendations.push(...warnings);
      recommendations.push('🚨 RECOMMENDATION: Do not combine these substances. Seek immediate medical advice if you have already consumed them.');
    }
    
    // Check for alcohol content
    const hasAlcohol = consumables.some(c => c.category === 'alcohol');
    if (hasAlcohol) {
      recommendations.push('🍷 ALCOHOL WARNING: Alcohol can interact with many substances. Avoid mixing with medications or supplements.');
    }
    
    // Check for medication content
    const hasMedication = consumables.some(c => c.category === 'medication');
    if (hasMedication) {
      recommendations.push('💊 MEDICATION WARNING: Consult your doctor before combining medications with other substances.');
    }
    
    // Check for supplement content
    const hasSupplements = consumables.some(c => c.category === 'supplement');
    if (hasSupplements) {
      recommendations.push('💊 SUPPLEMENT INFO: Some supplements may interact with medications. Check with your healthcare provider.');
    }
    
    return recommendations;
  }

  /**
   * Validate consumable data for medical accuracy
   */
  static validateConsumableData(consumable: Consumable): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for required fields
    if (!consumable.name || consumable.name.trim() === '') {
      errors.push('Consumable name is required');
    }
    
    if (!consumable.category) {
      errors.push('Consumable category is required');
    }
    
    // Check for suspicious safety levels
    if (consumable.safetyLevel === 'lethal' && consumable.category === 'food') {
      warnings.push('Food items should not be marked as lethal unless they are actually poisonous');
    }
    
    // Check for missing nutritional data on food items
    if (consumable.category === 'food' && !consumable.nutritionalInfo) {
      warnings.push('Food items should have nutritional information');
    }
    
    // Check for unrealistic nutritional values
    if (consumable.nutritionalInfo) {
      const { calories, protein, carbs, fat } = consumable.nutritionalInfo;
      
      if (calories && calories > 1000) {
        warnings.push('Calorie count seems unusually high for a single serving');
      }
      
      if (protein && protein > 100) {
        warnings.push('Protein content seems unusually high');
      }
      
      if (carbs && carbs > 100) {
        warnings.push('Carbohydrate content seems unusually high');
      }
      
      if (fat && fat > 100) {
        warnings.push('Fat content seems unusually high');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
