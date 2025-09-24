'use client';

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { UserProfile, GameState, Experiment, Consumable, Achievement, Challenge } from '@/types';
import { PersistenceManager } from '@/lib/persistence';
import { ProgressionTracker } from '@/lib/progression-tracker';
import { RewardsSystem } from '@/lib/rewards-system';
import { PaymentManager } from '@/lib/monetization/payment-manager';
import { PremiumFeaturesManager } from '@/lib/monetization/premium-features';

interface GameContextType {
  userProfile: UserProfile;
  gameState: GameState;
  experiments: Experiment[];
  achievements: Achievement[];
  challenges: Challenge[];
  inventory: Consumable[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  addExperiment: (experiment: Experiment) => void;
  updateGameState: (state: Partial<GameState>) => void;
  addToInventory: (consumable: Consumable) => void;
  removeFromInventory: (consumableId: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  completeChallenge: (challengeId: string) => void;
  // Gamification methods
  processExperimentCompletion: (experiment: Experiment) => void;
  getProgressionSummary: () => any;
  getNextMilestone: () => any;
  isFeatureUnlocked: (feature: string) => boolean;
  isConsumableCategoryUnlocked: (category: string) => boolean;
  isTechniqueUnlocked: (technique: string) => boolean;
  // Monetization methods
  hasPremiumAccess: () => boolean;
  getCurrentTier: () => string | null;
  checkFeatureAccess: (featureId: string) => any;
  showUpgradePrompt: (featureId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameAction = 
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_EXPERIMENT'; payload: Experiment }
  | { type: 'UPDATE_GAME_STATE'; payload: Partial<GameState> }
  | { type: 'ADD_TO_INVENTORY'; payload: Consumable }
  | { type: 'REMOVE_FROM_INVENTORY'; payload: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'COMPLETE_CHALLENGE'; payload: string };

interface GameReducerState {
  userProfile: UserProfile;
  gameState: GameState;
  experiments: Experiment[];
  achievements: Achievement[];
  challenges: Challenge[];
  inventory: Consumable[];
}

function gameReducer(state: GameReducerState, action: GameAction): GameReducerState {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };
    case 'ADD_EXPERIMENT':
      return {
        ...state,
        experiments: [...state.experiments, action.payload],
        userProfile: {
          ...state.userProfile,
          stats: {
            ...state.userProfile.stats,
            experiments: state.userProfile.stats.experiments + 1,
            experience: state.userProfile.stats.experience + action.payload.score,
          },
        },
      };
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        gameState: { ...state.gameState, ...action.payload },
      };
    case 'ADD_TO_INVENTORY':
      return {
        ...state,
        inventory: [...state.inventory, action.payload],
      };
    case 'REMOVE_FROM_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.filter((item: Consumable) => item.id !== action.payload),
      };
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
        userProfile: {
          ...state.userProfile,
          stats: {
            ...state.userProfile.stats,
            achievements: [...state.userProfile.stats.achievements, action.payload],
          },
        },
      };
    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map((challenge: Challenge) =>
          challenge.id === action.payload
            ? { ...challenge, completed: true }
            : challenge
        ),
      };
    default:
      return state;
  }
}

const initialUserProfile: UserProfile = {
  id: '1',
  name: 'Alchemist',
  age: 25,
  weight: 70,
  height: 175,
  gender: 'other',
  medicalConditions: [],
  allergies: [],
  medications: [],
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true,
    soundEffects: true,
    hapticFeedback: true,
    difficulty: 'beginner',
  },
  stats: {
    level: 1,
    experience: 0,
    experiments: 0,
    discoveries: 0,
    achievements: [],
    streak: 0,
    totalPlayTime: 0,
    favoriteCategories: [],
  },
};

const initialGameState: GameState = {
  currentLevel: 1,
  currentChallenge: null,
  inventory: [],
  labEquipment: [],
  unlockedFeatures: ['basic_search', 'basic_lab'],
  tutorialProgress: 0,
  isPaused: false,
};

const initialChallenges: Challenge[] = [
  {
    id: '1',
    title: 'First Discovery',
    description: 'Mix your first two consumables and discover their effects',
    objectives: [
      {
        id: '1-1',
        description: 'Select two consumables',
        type: 'create',
        target: '2',
        completed: false,
        progress: 0,
        maxProgress: 2,
      },
      {
        id: '1-2',
        description: 'Mix them in the lab',
        type: 'combine',
        target: '1',
        completed: false,
        progress: 0,
        maxProgress: 1,
      },
    ],
    rewards: [
      {
        id: '1-1',
        type: 'experience',
        amount: 100,
      },
      {
        id: '1-2',
        type: 'achievement',
        amount: 1,
      },
    ],
    difficulty: 'easy',
    category: 'food',
    requiredLevel: 1,
  },
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    userProfile: initialUserProfile,
    gameState: initialGameState,
    experiments: [],
    achievements: [],
    challenges: initialChallenges,
    inventory: [],
  });
  
  console.log('GameProvider: State initialized:', state);

  const updateProfile = (profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const addExperiment = (experiment: Experiment) => {
    dispatch({ type: 'ADD_EXPERIMENT', payload: experiment });
  };

  const updateGameState = (gameState: Partial<GameState>) => {
    dispatch({ type: 'UPDATE_GAME_STATE', payload: gameState });
  };

  const addToInventory = (consumable: Consumable) => {
    dispatch({ type: 'ADD_TO_INVENTORY', payload: consumable });
  };

  const removeFromInventory = (consumableId: string) => {
    dispatch({ type: 'REMOVE_FROM_INVENTORY', payload: consumableId });
  };

  const unlockAchievement = (achievement: Achievement) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement });
  };

  const completeChallenge = (challengeId: string) => {
    dispatch({ type: 'COMPLETE_CHALLENGE', payload: challengeId });
  };

  // Load data from localStorage on mount (only once)
  useEffect(() => {
    // Only run on client-side to prevent hydration issues
    if (typeof window === 'undefined') return;
    
    const loadGameData = () => {
      const savedData = PersistenceManager.loadGameData();
      if (savedData) {
        console.log('Loading saved game data...');
        
        // Restore state from localStorage
        if (savedData.userProfile) {
          updateProfile(savedData.userProfile);
          console.log('User profile loaded');
        }
        if (savedData.gameState) {
          updateGameState(savedData.gameState);
          console.log('Game state loaded');
        }
        if (savedData.experiments && savedData.experiments.length > 0) {
          savedData.experiments.forEach((exp: Experiment) => addExperiment(exp));
          console.log(`Loaded ${savedData.experiments.length} experiments`);
        }
        if (savedData.achievements && savedData.achievements.length > 0) {
          savedData.achievements.forEach((ach: Achievement) => unlockAchievement(ach));
          console.log(`Loaded ${savedData.achievements.length} achievements`);
        }
        if (savedData.inventory && savedData.inventory.length > 0) {
          savedData.inventory.forEach((item: Consumable) => addToInventory(item));
          console.log(`Loaded ${savedData.inventory.length} inventory items`);
        }
      } else {
        console.log('No saved data found, starting fresh');
      }
    };

    // Load immediately to prevent multiple loads
    loadGameData();
  }, []); // Empty dependency array ensures this runs only once

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const success = PersistenceManager.saveGameData({
      userProfile: state.userProfile,
      gameState: state.gameState,
      experiments: state.experiments,
      achievements: state.achievements,
      inventory: state.inventory,
    });
    
    if (!success) {
      console.error('Failed to save game data');
    }
  }, [state]);

  // Gamification methods
  const processExperimentCompletion = (experiment: Experiment) => {
    const progressionTracker = ProgressionTracker.getInstance();
    const result = progressionTracker.processExperimentCompletion(
      state.userProfile,
      experiment,
      state.experiments
    );

    // Update profile with new stats
    updateProfile({ stats: result.updatedProfile.stats });

    // Add new achievements
    result.newAchievements.forEach(achievement => {
      unlockAchievement(achievement);
    });

    // Add experiment to list
    addExperiment(experiment);

    // Show level up notification if applicable
    if (result.levelUp) {
      console.log(`Level up! New level: ${result.updatedProfile.stats.level}`);
      // You could emit a toast notification here
    }
  };

  const getProgressionSummary = () => {
    const progressionTracker = ProgressionTracker.getInstance();
    return progressionTracker.getProgressionSummary(state.userProfile);
  };

  const getNextMilestone = () => {
    const progressionTracker = ProgressionTracker.getInstance();
    return progressionTracker.getNextMilestone(state.userProfile);
  };

  const isFeatureUnlocked = (feature: string) => {
    return RewardsSystem.isFeatureUnlocked(state.userProfile.stats.level, feature);
  };

  const isConsumableCategoryUnlocked = (category: string) => {
    return RewardsSystem.isConsumableCategoryUnlocked(state.userProfile.stats.level, category as any);
  };

  const isTechniqueUnlocked = (technique: string) => {
    return RewardsSystem.isTechniqueUnlocked(state.userProfile.stats.level, technique);
  };

  // Monetization methods
  const hasPremiumAccess = () => {
    const paymentManager = PaymentManager.getInstance();
    return paymentManager.hasActiveSubscription();
  };

  const getCurrentTier = () => {
    const paymentManager = PaymentManager.getInstance();
    const subscription = paymentManager.getCurrentSubscription();
    return subscription?.tierId || null;
  };

  const checkFeatureAccess = (featureId: string) => {
    const featuresManager = PremiumFeaturesManager.getInstance();
    const currentTier = getCurrentTier();
    return featuresManager.hasAccess(featureId, currentTier);
  };

  const showUpgradePrompt = (featureId: string) => {
    // This would trigger the pricing modal
    // For now, we'll just scroll to a pricing section
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const value: GameContextType = useMemo(() => ({
    userProfile: state.userProfile,
    gameState: state.gameState,
    experiments: state.experiments,
    achievements: state.achievements,
    challenges: state.challenges,
    inventory: state.inventory,
    updateProfile,
    addExperiment,
    updateGameState,
    addToInventory,
    removeFromInventory,
    unlockAchievement,
    completeChallenge,
    // Gamification methods
    processExperimentCompletion,
    getProgressionSummary,
    getNextMilestone,
    isFeatureUnlocked,
    isConsumableCategoryUnlocked,
    isTechniqueUnlocked,
    // Monetization methods
    hasPremiumAccess,
    getCurrentTier,
    checkFeatureAccess,
    showUpgradePrompt,
  }), [state, updateProfile, addExperiment, updateGameState, addToInventory, removeFromInventory, unlockAchievement, completeChallenge, processExperimentCompletion, getProgressionSummary, getNextMilestone, isFeatureUnlocked, isConsumableCategoryUnlocked, isTechniqueUnlocked, hasPremiumAccess, getCurrentTier, checkFeatureAccess, showUpgradePrompt]);

  console.log('GameProvider: Rendering with value:', value);
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
