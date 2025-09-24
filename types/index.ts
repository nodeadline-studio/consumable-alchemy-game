export interface Consumable {
  id: string;
  name: string;
  category: ConsumableCategory;
  type: ConsumableType;
  image?: string;
  description?: string;
  ingredients: string[];
  nutritionalInfo?: NutritionalInfo;
  safetyLevel: SafetyLevel;
  effects: Effect[];
  interactions: Interaction[];
  tags: string[];
  barcode?: string;
  source: DataSource;
}

export type ConsumableCategory = 
  | 'food'
  | 'beverage'
  | 'supplement'
  | 'medication'
  | 'alcohol'
  | 'drug'
  | 'herb'
  | 'chemical'
  | 'other';

export type ConsumableType = 
  | 'solid'
  | 'liquid'
  | 'gas'
  | 'powder'
  | 'capsule'
  | 'tablet'
  | 'injection'
  | 'topical';

export type SafetyLevel = 
  | 'safe'
  | 'caution'
  | 'warning'
  | 'danger'
  | 'critical'
  | 'lethal';

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface Effect {
  id: string;
  name: string;
  description: string;
  intensity: 'mild' | 'moderate' | 'strong' | 'severe';
  duration: number; // in minutes
  category: EffectCategory;
  positive: boolean;
}

export type EffectCategory = 
  | 'physical'
  | 'mental'
  | 'emotional'
  | 'metabolic'
  | 'neurological'
  | 'cardiovascular'
  | 'digestive'
  | 'respiratory'
  | 'other';

export interface Interaction {
  id: string;
  consumableId: string;
  consumableName: string;
  type: InteractionType;
  severity: 'mild' | 'moderate' | 'severe' | 'dangerous';
  description: string;
  effects: string[];
  recommendations: string[];
}

export type InteractionType = 
  | 'synergistic'
  | 'antagonistic'
  | 'additive'
  | 'inhibitory'
  | 'toxic'
  | 'allergic'
  | 'metabolic'
  | 'pharmacokinetic'
  | 'pharmacodynamic';

export type DataSource = 
  | 'openfoodfacts'
  | 'foodb'
  | 'opendata'
  | 'manual'
  | 'user'
  | 'mock';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  medicalConditions: string[];
  allergies: string[];
  medications: string[];
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserStats {
  level: number;
  experience: number;
  experiments: number;
  discoveries: number;
  achievements: Achievement[];
  streak: number;
  totalPlayTime: number;
  favoriteCategories: ConsumableCategory[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
}

export interface Experiment {
  id: string;
  userId: string;
  consumables: Consumable[];
  combinations: Combination[];
  results: ExperimentResult[];
  timestamp: Date;
  success: boolean;
  score: number;
  notes?: string;
}

export interface Combination {
  id: string;
  consumables: Consumable[];
  ratio: Record<string, number>; // percentage of each consumable
  method: CombinationMethod;
  temperature?: number;
  time?: number;
}

export type CombinationMethod = 
  | 'mix'
  | 'blend'
  | 'heat'
  | 'cool'
  | 'ferment'
  | 'distill'
  | 'extract'
  | 'synthesize';

export interface ExperimentResult {
  id: string;
  combination: Combination;
  effects: Effect[];
  interactions: Interaction[];
  safetyScore: number;
  effectivenessScore: number;
  noveltyScore: number;
  overallScore: number;
  safetyLevel: SafetyLevel;
  description: string;
  warnings: string[];
  recommendations: string[];
}

export interface GameState {
  currentLevel: number;
  currentChallenge: Challenge | null;
  inventory: Consumable[];
  labEquipment: LabEquipment[];
  unlockedFeatures: string[];
  tutorialProgress: number;
  isPaused: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  objectives: Objective[];
  rewards: Reward[];
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: ConsumableCategory;
  requiredLevel: number;
}

export interface Objective {
  id: string;
  description: string;
  type: 'create' | 'discover' | 'analyze' | 'combine';
  target: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface Reward {
  id: string;
  type: 'experience' | 'consumable' | 'equipment' | 'achievement';
  amount: number;
  item?: Consumable | LabEquipment;
}

export interface LabEquipment {
  id: string;
  name: string;
  description: string;
  type: EquipmentType;
  level: number;
  unlocked: boolean;
  effects: EquipmentEffect[];
}

export type EquipmentType = 
  | 'mixer'
  | 'heater'
  | 'cooler'
  | 'analyzer'
  | 'extractor'
  | 'synthesizer'
  | 'microscope'
  | 'spectrometer';

export interface EquipmentEffect {
  type: 'efficiency' | 'accuracy' | 'speed' | 'safety';
  multiplier: number;
  description: string;
}

export interface MonetizationConfig {
  adNetwork: 'admob' | 'unity' | 'ironsource' | 'custom';
  adPlacements: AdPlacement[];
  premiumFeatures: PremiumFeature[];
  subscriptionTiers: SubscriptionTier[];
  inAppPurchases: InAppPurchase[];
}

export interface AdPlacement {
  id: string;
  type: 'banner' | 'interstitial' | 'rewarded' | 'native';
  position: string;
  frequency: number;
  enabled: boolean;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'one-time' | 'subscription';
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
  popular: boolean;
}

export interface InAppPurchase {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'consumable' | 'non-consumable' | 'subscription';
  productId: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  category?: ConsumableCategory;
  type?: ConsumableType;
  safetyLevel?: SafetyLevel;
  tags?: string[];
  query?: string;
  limit?: number;
  offset?: number;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
}
