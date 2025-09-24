/**
 * Mock Data for Development
 * Provides realistic data when APIs are not available
 */

import { Consumable, ConsumableCategory, SafetyLevel, NutritionalInfo } from '@/types';

export const MOCK_CONSUMABLES: Consumable[] = [
  {
    id: 'mock_apple_001',
    name: 'Fresh Red Apple',
    category: 'food',
    type: 'solid',
    image: '/graphics/consumables/food/apple.svg',
    description: 'A crisp, juicy red apple perfect for snacking or cooking.',
    ingredients: ['Apple', 'Natural Sugars', 'Fiber'],
    nutritionalInfo: {
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19,
      vitamins: { C: 14 },
      minerals: { potassium: 195 }
    },
    safetyLevel: 'safe',
    effects: [
      {
        id: 'energy_boost',
        name: 'Energy Boost',
        description: 'Provides natural energy from natural sugars',
        intensity: 'mild',
        duration: 150, // 2.5 hours in minutes
        category: 'physical',
        positive: true
      },
      {
        id: 'digestive_health',
        name: 'Digestive Health',
        description: 'High fiber content supports digestive health',
        intensity: 'moderate',
        duration: 300, // 5 hours in minutes
        category: 'physical',
        positive: true
      }
    ],
    interactions: [],
    tags: ['fruit', 'healthy', 'natural', 'fiber-rich'],
    barcode: 'MOCK001',
    source: 'mock'
  },
  {
    id: 'mock_coffee_001',
    name: 'Premium Coffee',
    category: 'beverage',
    type: 'liquid',
    image: '/graphics/consumables/beverages/coffee-cup.svg',
    description: 'Rich, aromatic coffee with natural caffeine content.',
    ingredients: ['Coffee Beans', 'Water', 'Natural Caffeine'],
    nutritionalInfo: {
      calories: 5,
      protein: 0.3,
      carbs: 0,
      fat: 0,
      vitamins: { caffeine: 95 },
      minerals: { antioxidants: 1000 }
    },
    safetyLevel: 'caution',
    effects: [
      {
        id: 'caffeine_boost',
        name: 'Caffeine Boost',
        description: 'Increases alertness and focus',
        intensity: 'strong',
        duration: 210, // 3.5 hours in minutes
        category: 'mental',
        positive: true
      },
      {
        id: 'mood_enhancement',
        name: 'Mood Enhancement',
        description: 'May improve mood and cognitive function',
        intensity: 'moderate',
        duration: 150, // 2.5 hours in minutes
        category: 'emotional',
        positive: true
      }
    ],
    interactions: [
      {
        id: 'caffeine_medication',
        consumableId: 'mock_coffee_001',
        consumableName: 'Premium Coffee',
        type: 'additive',
        severity: 'moderate',
        description: 'May interact with certain medications',
        effects: ['Increased heart rate', 'Elevated blood pressure'],
        recommendations: ['Consult healthcare provider if taking medications']
      }
    ],
    tags: ['caffeine', 'beverage', 'energy', 'antioxidants'],
    barcode: 'MOCK002',
    source: 'mock'
  },
  {
    id: 'mock_aspirin_001',
    name: 'Aspirin 325mg',
    category: 'medication',
    type: 'tablet',
    image: '/graphics/consumables/medications/aspirin-pill.svg',
    description: 'Pain reliever and anti-inflammatory medication.',
    ingredients: ['Acetylsalicylic Acid', 'Starch', 'Cellulose'],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    safetyLevel: 'warning',
    effects: [
      {
        id: 'pain_relief',
        name: 'Pain Relief',
        description: 'Reduces pain and inflammation',
        intensity: 'strong',
        duration: 300, // 5 hours in minutes
        category: 'physical',
        positive: true
      },
      {
        id: 'blood_thinning',
        name: 'Blood Thinning',
        description: 'May increase bleeding risk',
        intensity: 'moderate',
        duration: 10080, // 7 days in minutes
        category: 'physical',
        positive: false
      }
    ],
    interactions: [
      {
        id: 'aspirin_alcohol',
        consumableId: 'mock_aspirin_001',
        consumableName: 'Aspirin 325mg',
        type: 'antagonistic',
        severity: 'severe',
        description: 'Increases risk of stomach bleeding',
        effects: ['Stomach bleeding', 'Increased bleeding risk'],
        recommendations: ['Avoid alcohol while taking aspirin']
      },
      {
        id: 'aspirin_warfarin',
        consumableId: 'mock_aspirin_001',
        consumableName: 'Aspirin 325mg',
        type: 'additive',
        severity: 'dangerous',
        description: 'Increases bleeding risk significantly',
        effects: ['Severe bleeding', 'Blood thinning effects'],
        recommendations: ['DANGER: Do not combine with blood thinners']
      }
    ],
    tags: ['medication', 'pain-relief', 'anti-inflammatory', 'prescription'],
    barcode: 'MOCK003',
    source: 'mock'
  },
  {
    id: 'mock_vitamin_c_001',
    name: 'Vitamin C Supplement',
    category: 'supplement',
    type: 'capsule',
    image: '/graphics/consumables/supplements/capsule.svg',
    description: 'High-potency vitamin C supplement for immune support.',
    ingredients: ['Ascorbic Acid', 'Gelatin', 'Vegetable Cellulose'],
    nutritionalInfo: {
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0,
      vitamins: { C: 1000, bioflavonoids: 50 }
    },
    safetyLevel: 'safe',
    effects: [
      {
        id: 'immune_support',
        name: 'Immune Support',
        description: 'Strengthens immune system function',
        intensity: 'moderate',
        duration: 600, // 10 hours in minutes
        category: 'physical',
        positive: true
      },
      {
        id: 'antioxidant_protection',
        name: 'Antioxidant Protection',
        description: 'Protects cells from oxidative damage',
        intensity: 'strong',
        duration: 420, // 7 hours in minutes
        category: 'physical',
        positive: true
      }
    ],
    interactions: [
      {
        id: 'vitamin_c_iron',
        consumableId: 'mock_vitamin_c_001',
        consumableName: 'Vitamin C Supplement',
        type: 'synergistic',
        severity: 'mild',
        description: 'Enhances iron absorption',
        effects: ['Increased iron absorption'],
        recommendations: ['May increase iron absorption - monitor iron levels']
      }
    ],
    tags: ['supplement', 'vitamin', 'immune', 'antioxidant'],
    barcode: 'MOCK004',
    source: 'mock'
  },
  {
    id: 'mock_beer_001',
    name: 'Craft Beer',
    category: 'alcohol',
    type: 'liquid',
    image: '/graphics/consumables/beverages/beer.svg',
    description: 'Premium craft beer with moderate alcohol content.',
    ingredients: ['Water', 'Malted Barley', 'Hops', 'Yeast', 'Alcohol'],
    nutritionalInfo: {
      calories: 150,
      protein: 1.5,
      carbs: 13,
      fat: 0,
      minerals: { sodium: 10, alcohol: 5.2 }
    },
    safetyLevel: 'caution',
    effects: [
      {
        id: 'alcohol_effects',
        name: 'Alcohol Effects',
        description: 'Causes relaxation and reduced inhibitions',
        intensity: 'moderate',
        duration: 150, // 2.5 hours in minutes
        category: 'mental',
        positive: false
      },
      {
        id: 'dehydration',
        name: 'Dehydration',
        description: 'May cause dehydration and hangover',
        intensity: 'moderate',
        duration: 360, // 6 hours in minutes
        category: 'physical',
        positive: false
      }
    ],
    interactions: [
      {
        id: 'alcohol_medications',
        consumableId: 'mock_beer_001',
        consumableName: 'Craft Beer',
        type: 'antagonistic',
        severity: 'severe',
        description: 'May increase medication side effects',
        effects: ['Increased medication side effects', 'Reduced medication effectiveness'],
        recommendations: ['Avoid alcohol with most medications']
      },
      {
        id: 'alcohol_aspirin',
        consumableId: 'mock_beer_001',
        consumableName: 'Craft Beer',
        type: 'additive',
        severity: 'dangerous',
        description: 'Increases risk of stomach bleeding',
        effects: ['Severe bleeding', 'Stomach irritation'],
        recommendations: ['DANGER: Do not combine with aspirin']
      }
    ],
    tags: ['alcohol', 'beverage', 'craft', 'social'],
    barcode: 'MOCK005',
    source: 'mock'
  }
];

export const MOCK_CATEGORIES: ConsumableCategory[] = [
  'food', 'beverage', 'supplement', 'medication', 'alcohol', 'herb', 'chemical'
];

export const MOCK_SAFETY_LEVELS: SafetyLevel[] = [
  'safe', 'caution', 'warning', 'danger', 'critical', 'lethal'
];

export const MOCK_INTERACTIONS = [
  {
    id: 'caffeine_alcohol',
    name: 'Caffeine + Alcohol',
    description: 'Caffeine masks alcohol effects, increasing intoxication risk',
    severity: 'high',
    warning: 'May lead to dangerous overconsumption'
  },
  {
    id: 'grapefruit_medications',
    name: 'Grapefruit + Medications',
    description: 'Grapefruit can interfere with medication metabolism',
    severity: 'critical',
    warning: 'DANGER: Consult healthcare provider before consuming grapefruit with medications'
  },
  {
    id: 'iron_vitamin_c',
    name: 'Iron + Vitamin C',
    description: 'Vitamin C enhances iron absorption',
    severity: 'low',
    warning: 'May increase iron absorption - monitor iron levels'
  }
];

export const MOCK_EFFECTS = [
  {
    id: 'energy_boost',
    name: 'Energy Boost',
    description: 'Increases energy levels and alertness',
    intensity: 'moderate',
    duration: 180, // 3 hours in minutes
    positive: true
  },
  {
    id: 'relaxation',
    name: 'Relaxation',
    description: 'Promotes calmness and reduces stress',
    intensity: 'mild',
    duration: 90, // 1.5 hours in minutes
    positive: true
  },
  {
    id: 'digestive_upset',
    name: 'Digestive Upset',
    description: 'May cause stomach discomfort or nausea',
    intensity: 'moderate',
    duration: 240, // 4 hours in minutes
    positive: false
  },
  {
    id: 'allergic_reaction',
    name: 'Allergic Reaction',
    description: 'May trigger allergic response in sensitive individuals',
    intensity: 'severe',
    duration: 720, // 12 hours in minutes
    positive: false
  }
];

export const MOCK_RECIPES = [
  {
    id: 'healthy_smoothie',
    name: 'Healthy Green Smoothie',
    ingredients: ['Apple', 'Spinach', 'Banana', 'Almond Milk'],
    description: 'A nutritious smoothie packed with vitamins and minerals',
    safetyLevel: 'safe' as SafetyLevel,
    effects: ['Energy Boost', 'Digestive Health', 'Immune Support'],
    instructions: 'Blend all ingredients until smooth. Serve immediately.',
    prepTime: '5 minutes',
    servings: 2
  },
  {
    id: 'dangerous_mix',
    name: 'Dangerous Medication Mix',
    ingredients: ['Aspirin', 'Alcohol', 'Grapefruit Juice'],
    description: 'A potentially dangerous combination',
    safetyLevel: 'critical' as SafetyLevel,
    effects: ['Severe Bleeding Risk', 'Liver Damage', 'Stomach Ulcers'],
    instructions: 'DO NOT ATTEMPT - This combination is dangerous',
    prepTime: '0 minutes',
    servings: 0
  }
];

export const MOCK_ACHIEVEMENTS = [
  {
    id: 'first_experiment',
    name: 'First Experiment',
    description: 'Complete your first alchemy experiment',
    icon: '🧪',
    points: 100,
    unlocked: false
  },
  {
    id: 'safety_expert',
    name: 'Safety Expert',
    description: 'Identify 10 dangerous interactions',
    icon: '🛡️',
    points: 500,
    unlocked: false
  },
  {
    id: 'master_alchemist',
    name: 'Master Alchemist',
    description: 'Complete 50 successful experiments',
    icon: '👑',
    points: 1000,
    unlocked: false
  }
];

export const MOCK_CHALLENGES = [
  {
    id: 'daily_safety_check',
    name: 'Daily Safety Check',
    description: 'Check 5 consumables for safety today',
    type: 'daily',
    reward: { points: 50, xp: 25 },
    progress: 0,
    target: 5,
    completed: false
  },
  {
    id: 'interaction_master',
    name: 'Interaction Master',
    description: 'Learn about 20 different interactions this week',
    type: 'weekly',
    reward: { points: 200, xp: 100 },
    progress: 0,
    target: 20,
    completed: false
  }
];

export const MOCK_USER_PROFILE = {
  id: 'user_001',
  name: 'Alchemy Student',
  email: 'student@alchemy.com',
  level: 1,
  xp: 0,
  totalXp: 0,
  achievements: [],
  preferences: {
    theme: 'dark',
    notifications: true,
    language: 'en'
  },
  stats: {
    experimentsCompleted: 0,
    consumablesAnalyzed: 0,
    interactionsDiscovered: 0,
    daysActive: 1
  }
};

export const MOCK_GAME_STATE = {
  currentLevel: 1,
  currentChallenge: null,
  totalXp: 0,
  coins: 100,
  streak: 0,
  lastActiveDate: new Date().toISOString(),
  unlockedFeatures: ['basic_search', 'safety_analysis'],
  unlockedConsumables: ['food', 'beverage'],
  unlockedTechniques: ['basic_mixing']
};
