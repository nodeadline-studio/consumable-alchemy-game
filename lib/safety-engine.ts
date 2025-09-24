import { Consumable, ExperimentResult, Effect, Interaction, SafetyLevel } from '@/types';
import { MedicalDatabase } from './medical-database';

export class SafetyEngine {
  /**
   * Calculate safety score based on consumable properties using medical database
   */
  static calculateSafetyScore(consumables: Consumable[]): number {
    let totalScore = 100; // Start with perfect score
    
    // Validate all consumables first
    for (const consumable of consumables) {
      const validation = MedicalDatabase.validateConsumableData(consumable);
      if (!validation.isValid) {
        totalScore -= 20; // Penalty for invalid data
      }
    }
    
    // Check individual safety levels using medical database and existing safety level
    for (const consumable of consumables) {
      const medicalSafetyLevel = MedicalDatabase.getMedicalSafetyLevel(consumable);
      const existingSafetyLevel = consumable.safetyLevel;
      
      // Use the more restrictive safety level
      const finalSafetyLevel = this.getMoreRestrictiveLevel(medicalSafetyLevel, existingSafetyLevel);
      const safetyPenalty = this.getSafetyPenalty(finalSafetyLevel);
      totalScore -= safetyPenalty;
    }
    
    // Check for dangerous interactions using medical database
    const { hasDangerousInteraction } = MedicalDatabase.checkDangerousInteractions(consumables);
    if (hasDangerousInteraction) {
      totalScore -= 50; // Major penalty for dangerous interactions
    }
    
    // Check for alcohol interactions
    const alcoholPenalty = this.checkAlcoholInteractions(consumables);
    totalScore -= alcoholPenalty;
    
    // Check for medication interactions
    const medicationPenalty = this.checkMedicationInteractions(consumables);
    totalScore -= medicationPenalty;
    
    return Math.max(0, Math.min(100, totalScore));
  }
  
  /**
   * Calculate effectiveness score based on nutritional compatibility
   */
  static calculateEffectivenessScore(consumables: Consumable[]): number {
    let score = 50; // Base score
    
    // Check nutritional compatibility
    const nutritionalScore = this.checkNutritionalCompatibility(consumables);
    score += nutritionalScore;
    
    // Check for synergistic effects
    const synergyScore = this.checkSynergisticEffects(consumables);
    score += synergyScore;
    
    // Check for complementary categories
    const categoryScore = this.checkCategoryCompatibility(consumables);
    score += categoryScore;
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate novelty score based on combination uniqueness
   */
  static calculateNoveltyScore(consumables: Consumable[]): number {
    const categories = consumables.map(c => c.category);
    const uniqueCategories = new Set(categories).size;
    
    // More diverse categories = higher novelty
    let score = uniqueCategories * 15;
    
    // Check for rare combinations
    if (this.isRareCombination(consumables)) {
      score += 20;
    }
    
    // Check for unexpected pairings
    if (this.isUnexpectedPairing(consumables)) {
      score += 15;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Generate effects based on consumable properties
   */
  static generateEffects(consumables: Consumable[]): Effect[] {
    const effects: Effect[] = [];
    
    // Check for alcohol effects
    if (consumables.some(c => c.category === 'alcohol')) {
      effects.push({
        id: 'alcohol-effect',
        name: 'Intoxication',
        description: 'May cause dizziness, impaired judgment, and coordination issues',
        intensity: 'moderate' as const,
        duration: 120,
        category: 'neurological' as const,
        positive: false,
      });
    }
    
    // Check for supplement effects
    if (consumables.some(c => c.category === 'supplement')) {
      effects.push({
        id: 'supplement-effect',
        name: 'Nutrient Boost',
        description: 'Provides additional vitamins and minerals for better health',
        intensity: 'mild' as const,
        duration: 180,
        category: 'metabolic' as const,
        positive: true,
      });
    }
    
    // Check for caffeine effects
    if (consumables.some(c => c.name.toLowerCase().includes('coffee') || c.name.toLowerCase().includes('coca'))) {
      effects.push({
        id: 'caffeine-effect',
        name: 'Stimulation',
        description: 'Increases alertness and energy levels',
        intensity: 'moderate' as const,
        duration: 240,
        category: 'neurological' as const,
        positive: true,
      });
    }
    
    // Check for sugar effects
    if (consumables.some(c => c.name.toLowerCase().includes('sugar') || c.name.toLowerCase().includes('sweet'))) {
      effects.push({
        id: 'sugar-effect',
        name: 'Energy Spike',
        description: 'Provides quick energy boost followed by potential crash',
        intensity: 'mild' as const,
        duration: 60,
        category: 'metabolic' as const,
        positive: false,
      });
    }
    
    return effects;
  }
  
  /**
   * Generate warnings based on safety analysis using medical database
   */
  static generateWarnings(consumables: Consumable[]): string[] {
    const warnings: string[] = [];
    
    // Get medical recommendations
    const medicalRecommendations = MedicalDatabase.getMedicalRecommendations(consumables);
    warnings.push(...medicalRecommendations);
    
    // Check for dangerous interactions
    const { hasDangerousInteraction, warnings: interactionWarnings } = MedicalDatabase.checkDangerousInteractions(consumables);
    if (hasDangerousInteraction) {
      warnings.push(...interactionWarnings);
    }
    
    // Check for dangerous safety levels
    const dangerousConsumables = consumables.filter(c => 
      c.safetyLevel === 'danger' || c.safetyLevel === 'lethal'
    );
    
    if (dangerousConsumables.length > 0) {
      warnings.push('🚨 DANGER: Contains potentially dangerous substances - DO NOT CONSUME');
    }
    
    // Check for multiple stimulants
    const stimulants = consumables.filter(c => 
      c.name.toLowerCase().includes('caffeine') || 
      c.name.toLowerCase().includes('coffee') ||
      c.name.toLowerCase().includes('energy')
    );
    
    if (stimulants.length > 1) {
      warnings.push('⚠️ WARNING: Multiple stimulants may cause overstimulation');
    }
    
    // Check for unknown substances
    const unknownSubstances = consumables.filter(c => 
      c.safetyLevel === 'caution' || c.source === 'manual'
    );
    
    if (unknownSubstances.length > 0) {
      warnings.push('⚠️ CAUTION: Some substances have limited safety data');
    }
    
    return warnings;
  }
  
  /**
   * Generate recommendations based on analysis
   */
  static generateRecommendations(consumables: Consumable[], safetyScore: number): string[] {
    const recommendations: string[] = [];
    
    if (safetyScore < 30) {
      recommendations.push('NOT RECOMMENDED: This combination may be harmful');
      recommendations.push('This combination has a low safety score and may cause adverse effects');
    } else if (safetyScore < 60) {
      recommendations.push('CAUTION: Monitor for adverse effects');
      recommendations.push('This combination has a low safety score and may cause adverse effects');
    } else if (safetyScore >= 80) {
      recommendations.push('SAFE: This combination appears relatively safe for consumption');
      recommendations.push('This combination shows promising results and appears safe');
    }
    
    if (safetyScore < 30) {
      recommendations.push('Seek professional advice before consuming this combination');
    }
    
    // Category-specific recommendations
    const categories = consumables.map(c => c.category);
    const uniqueCategories = new Set(categories);
    
    if (uniqueCategories.has('alcohol')) {
      recommendations.push('Drink responsibly and avoid operating machinery');
    }
    
    if (uniqueCategories.has('supplement')) {
      recommendations.push('Consider consulting a healthcare provider before taking supplements');
    }
    
    if (uniqueCategories.has('medication')) {
      recommendations.push('Consult your doctor before mixing with other substances');
    }
    
    return recommendations;
  }
  
  // Helper methods
  private static getSafetyPenalty(safetyLevel: SafetyLevel): number {
    switch (safetyLevel) {
      case 'safe': return 0;
      case 'caution': return 10;
      case 'warning': return 25;
      case 'danger': return 50;
      case 'critical': return 75;
      case 'lethal': return 100;
      default: return 0;
    }
  }

  private static getMoreRestrictiveLevel(level1: SafetyLevel, level2: SafetyLevel): SafetyLevel {
    const levels = ['safe', 'caution', 'warning', 'danger', 'critical', 'lethal'];
    const index1 = levels.indexOf(level1);
    const index2 = levels.indexOf(level2);
    
    // Return the level with higher index (more restrictive)
    return index1 > index2 ? level1 : level2;
  }
  
  private static checkDangerousCombinations(consumables: Consumable[]): number {
    let penalty = 0;
    
    // Check for alcohol + depressants
    const hasAlcohol = consumables.some(c => c.category === 'alcohol');
    const hasDepressants = consumables.some(c => 
      c.name.toLowerCase().includes('sleep') || 
      c.name.toLowerCase().includes('relax')
    );
    
    if (hasAlcohol && hasDepressants) {
      penalty += 30;
    }
    
    // Check for alcohol + medication
    const hasMedication = consumables.some(c => c.category === 'medication');
    if (hasAlcohol && hasMedication) {
      penalty += 40;
    }
    
    // Check for multiple caffeine sources
    const caffeineSources = consumables.filter(c => 
      c.name.toLowerCase().includes('coffee') || 
      c.name.toLowerCase().includes('caffeine') ||
      c.name.toLowerCase().includes('energy drink') ||
      c.name.toLowerCase().includes('tea')
    );
    
    if (caffeineSources.length > 1) {
      penalty += 20;
    }
    
    return penalty;
  }
  
  private static checkAlcoholInteractions(consumables: Consumable[]): number {
    const hasAlcohol = consumables.some(c => c.category === 'alcohol');
    const hasMedication = consumables.some(c => c.category === 'medication');
    
    if (hasAlcohol && hasMedication) {
      return 40; // Major penalty for alcohol + medication
    }
    
    if (hasAlcohol) {
      return 15; // Moderate penalty for alcohol alone
    }
    
    return 0;
  }
  
  private static checkMedicationInteractions(consumables: Consumable[]): number {
    const medications = consumables.filter(c => c.category === 'medication');
    
    if (medications.length > 1) {
      return 25; // Penalty for multiple medications
    }
    
    if (medications.length === 1) {
      return 10; // Small penalty for single medication
    }
    
    return 0;
  }
  
  private static checkNutritionalCompatibility(consumables: Consumable[]): number {
    // Simple scoring based on category diversity
    const categories = consumables.map(c => c.category);
    const uniqueCategories = new Set(categories).size;
    
    return Math.min(20, uniqueCategories * 5);
  }
  
  private static checkSynergisticEffects(consumables: Consumable[]): number {
    // Check for complementary nutrients
    const hasProtein = consumables.some(c => 
      c.name.toLowerCase().includes('protein') || 
      c.name.toLowerCase().includes('meat')
    );
    const hasCarbs = consumables.some(c => 
      c.name.toLowerCase().includes('bread') || 
      c.name.toLowerCase().includes('rice')
    );
    
    if (hasProtein && hasCarbs) {
      return 15;
    }
    
    return 0;
  }
  
  private static checkCategoryCompatibility(consumables: Consumable[]): number {
    const categories = consumables.map(c => c.category);
    const uniqueCategories = new Set(categories).size;
    
    // More diverse categories = better compatibility
    return Math.min(15, uniqueCategories * 3);
  }
  
  private static isRareCombination(consumables: Consumable[]): boolean {
    // Check for unusual category combinations
    const categories = consumables.map(c => c.category);
    const hasAlcohol = categories.includes('alcohol');
    const hasSupplement = categories.includes('supplement');
    
    return hasAlcohol && hasSupplement;
  }
  
  private static isUnexpectedPairing(consumables: Consumable[]): boolean {
    // Check for unexpected food combinations
    const names = consumables.map(c => c.name.toLowerCase());
    const hasSweet = names.some(n => n.includes('sweet') || n.includes('sugar'));
    const hasSavory = names.some(n => n.includes('salt') || n.includes('spicy'));
    
    return hasSweet && hasSavory;
  }

  /**
   * Get safety level from safety score
   */
  static getSafetyLevel(safetyScore: number): SafetyLevel {
    if (safetyScore >= 80) return 'safe';
    if (safetyScore >= 60) return 'caution';
    if (safetyScore >= 40) return 'warning';
    if (safetyScore >= 20) return 'danger';
    return 'critical';
  }

  /**
   * Generate description based on safety level and effects
   */
  static generateDescription(safetyLevel: SafetyLevel, effects: Effect[], warnings: string[]): string {
    const effectDescriptions = effects.map(e => e.description).join(', ');
    const warningText = warnings.length > 0 ? ` Warning: ${warnings.join(', ')}` : '';
    
    switch (safetyLevel) {
      case 'safe':
        return `Safe combination with effects: ${effectDescriptions}.${warningText}`;
      case 'caution':
        return `Use with caution. Effects: ${effectDescriptions}.${warningText}`;
      case 'warning':
        return `Warning: This combination may cause adverse effects. ${effectDescriptions}.${warningText}`;
      case 'danger':
        return `Dangerous combination! Avoid consumption. ${effectDescriptions}.${warningText}`;
      case 'critical':
        return `CRITICAL DANGER! Do not consume this combination. ${effectDescriptions}.${warningText}`;
      default:
        return `Unknown safety level. Effects: ${effectDescriptions}.${warningText}`;
    }
  }
}

/**
 * Generate complete experiment result
 */
export function generateExperimentResult(consumables: Consumable[]): ExperimentResult {
  const safetyScore = SafetyEngine.calculateSafetyScore(consumables);
  const effectivenessScore = SafetyEngine.calculateEffectivenessScore(consumables);
  const noveltyScore = SafetyEngine.calculateNoveltyScore(consumables);
  const overallScore = Math.round((safetyScore + effectivenessScore + noveltyScore) / 3);
  
  const effects = SafetyEngine.generateEffects(consumables);
  const warnings = SafetyEngine.generateWarnings(consumables);
  const recommendations = SafetyEngine.generateRecommendations(consumables, safetyScore);
  
  const safetyLevel = SafetyEngine.getSafetyLevel(safetyScore);
  const description = SafetyEngine.generateDescription(safetyLevel, effects, warnings);

  return {
    id: Date.now().toString(),
    combination: {
      id: '1',
      consumables,
      ratio: consumables.reduce((acc, c) => {
        acc[c.id] = 100 / consumables.length;
        return acc;
      }, {} as Record<string, number>),
      method: 'mix',
    },
    effects,
    interactions: [],
    safetyScore,
    effectivenessScore,
    noveltyScore,
    overallScore,
    safetyLevel,
    description,
    warnings,
    recommendations,
  };
}
