import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { Experiment, Consumable, Achievement } from '@/types';

// Mock the persistence manager
jest.mock('@/lib/persistence', () => ({
  PersistenceManager: {
    saveGameData: jest.fn().mockReturnValue(true),
    loadGameData: jest.fn().mockReturnValue(null),
    clearGameData: jest.fn(),
  },
}), { virtual: true });

// Mock the progression tracker
jest.mock('@/lib/progression-tracker', () => ({
  ProgressionTracker: {
    getInstance: jest.fn(() => ({
      processExperimentCompletion: jest.fn().mockReturnValue({
        updatedProfile: {
          stats: {
            level: 1,
            experience: 100,
            experiments: 1,
            discoveries: 0,
            achievements: [],
            streak: 1,
            totalPlayTime: 1000,
            favoriteCategories: [],
          },
        },
        newAchievements: [],
        levelUp: false,
        xpGained: 50,
      }),
      getProgressionSummary: jest.fn().mockReturnValue({
        level: 1,
        experience: 100,
        levelProgress: {
          currentLevelXP: 0,
          nextLevelXP: 100,
          progress: 100,
          xpNeeded: 0,
        },
        achievements: {
          total: 12,
          unlocked: 0,
          byRarity: {},
        },
        stats: {
          experiments: 1,
          streak: 1,
          totalPlayTime: 1000,
          favoriteCategories: [],
        },
      }),
      getNextMilestone: jest.fn().mockReturnValue(null),
    })),
  },
}));

// Mock the rewards system
jest.mock('@/lib/rewards-system', () => ({
  RewardsSystem: {
    isFeatureUnlocked: jest.fn().mockReturnValue(true),
    isConsumableCategoryUnlocked: jest.fn().mockReturnValue(true),
    isTechniqueUnlocked: jest.fn().mockReturnValue(true),
  },
}));

// Test component that uses the GameContext
const TestComponent = () => {
  const {
    userProfile,
    experiments,
    achievements,
    inventory,
    updateProfile,
    addExperiment,
    addToInventory,
    removeFromInventory,
    unlockAchievement,
    processExperimentCompletion,
    getProgressionSummary,
    getNextMilestone,
    isFeatureUnlocked,
    isConsumableCategoryUnlocked,
    isTechniqueUnlocked,
  } = useGame();

  const handleAddExperiment = () => {
    const experiment: Experiment = {
      id: '1',
      userId: '1',
      consumables: [],
      combinations: [],
      results: [],
      timestamp: new Date(),
      success: true,
      score: 100,
    };
    addExperiment(experiment);
  };

  const handleAddConsumable = () => {
    const consumable: Consumable = {
      id: '1',
      name: 'Test Food',
      category: 'food',
      type: 'solid',
      safetyLevel: 'safe',
      source: 'manual',
    };
    addToInventory(consumable);
  };

  const handleRemoveConsumable = () => {
    removeFromInventory('1');
  };

  const handleUnlockAchievement = () => {
    const achievement: Achievement = {
      id: '1',
      name: 'Test Achievement',
      description: 'Test Description',
      icon: '🏆',
      rarity: 'common',
      unlockedAt: new Date(),
      progress: 100,
      maxProgress: 100,
    };
    unlockAchievement(achievement);
  };

  const handleProcessExperiment = () => {
    const experiment: Experiment = {
      id: '2',
      userId: '1',
      consumables: [],
      combinations: [],
      results: [],
      timestamp: new Date(),
      success: true,
      score: 100,
    };
    processExperimentCompletion(experiment);
  };

  return (
    <div>
      <div data-testid="user-level">{userProfile.stats.level}</div>
      <div data-testid="user-experience">{userProfile.stats.experience}</div>
      <div data-testid="experiments-count">{experiments.length}</div>
      <div data-testid="achievements-count">{achievements.length}</div>
      <div data-testid="inventory-count">{inventory.length}</div>
      <button onClick={handleAddExperiment} data-testid="add-experiment">
        Add Experiment
      </button>
      <button onClick={handleAddConsumable} data-testid="add-consumable">
        Add Consumable
      </button>
      <button onClick={handleRemoveConsumable} data-testid="remove-consumable">
        Remove Consumable
      </button>
      <button onClick={handleUnlockAchievement} data-testid="unlock-achievement">
        Unlock Achievement
      </button>
      <button onClick={handleProcessExperiment} data-testid="process-experiment">
        Process Experiment
      </button>
      <div data-testid="progression-summary">{JSON.stringify(getProgressionSummary())}</div>
      <div data-testid="next-milestone">{JSON.stringify(getNextMilestone())}</div>
      <div data-testid="feature-unlocked">{isFeatureUnlocked('test') ? 'true' : 'false'}</div>
      <div data-testid="category-unlocked">{isConsumableCategoryUnlocked('food') ? 'true' : 'false'}</div>
      <div data-testid="technique-unlocked">{isTechniqueUnlocked('mix') ? 'true' : 'false'}</div>
    </div>
  );
};

describe('GameContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial game state', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    expect(screen.getByTestId('user-level')).toHaveTextContent('1');
    expect(screen.getByTestId('user-experience')).toHaveTextContent('0');
    expect(screen.getByTestId('experiments-count')).toHaveTextContent('0');
    expect(screen.getByTestId('achievements-count')).toHaveTextContent('0');
    expect(screen.getByTestId('inventory-count')).toHaveTextContent('0');
  });

  it('should add experiment when addExperiment is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    fireEvent.click(screen.getByTestId('add-experiment'));

    expect(screen.getByTestId('experiments-count')).toHaveTextContent('1');
  });

  it('should add consumable to inventory when addToInventory is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    fireEvent.click(screen.getByTestId('add-consumable'));

    expect(screen.getByTestId('inventory-count')).toHaveTextContent('1');
  });

  it('should remove consumable from inventory when removeFromInventory is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Add a consumable first
    fireEvent.click(screen.getByTestId('add-consumable'));
    expect(screen.getByTestId('inventory-count')).toHaveTextContent('1');

    // Then remove it
    fireEvent.click(screen.getByTestId('remove-consumable'));
    expect(screen.getByTestId('inventory-count')).toHaveTextContent('0');
  });

  it('should unlock achievement when unlockAchievement is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    fireEvent.click(screen.getByTestId('unlock-achievement'));

    expect(screen.getByTestId('achievements-count')).toHaveTextContent('1');
  });

  it('should process experiment completion when processExperimentCompletion is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    fireEvent.click(screen.getByTestId('process-experiment'));

    // The experiment should be added to the list
    expect(screen.getByTestId('experiments-count')).toHaveTextContent('1');
  });

  it('should call gamification methods', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    expect(screen.getByTestId('progression-summary')).toHaveTextContent('{"level":1,"experience":100}');
    expect(screen.getByTestId('next-milestone')).toHaveTextContent('null');
    expect(screen.getByTestId('feature-unlocked')).toHaveTextContent('true');
    expect(screen.getByTestId('category-unlocked')).toHaveTextContent('true');
    expect(screen.getByTestId('technique-unlocked')).toHaveTextContent('true');
  });

  it('should handle multiple experiments', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Add multiple experiments
    fireEvent.click(screen.getByTestId('add-experiment'));
    fireEvent.click(screen.getByTestId('add-experiment'));
    fireEvent.click(screen.getByTestId('add-experiment'));

    expect(screen.getByTestId('experiments-count')).toHaveTextContent('3');
  });

  it('should handle multiple consumables', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Add multiple consumables
    fireEvent.click(screen.getByTestId('add-consumable'));
    fireEvent.click(screen.getByTestId('add-consumable'));
    fireEvent.click(screen.getByTestId('add-consumable'));

    expect(screen.getByTestId('inventory-count')).toHaveTextContent('3');
  });

  it('should handle multiple achievements', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Add multiple achievements
    fireEvent.click(screen.getByTestId('unlock-achievement'));
    fireEvent.click(screen.getByTestId('unlock-achievement'));
    fireEvent.click(screen.getByTestId('unlock-achievement'));

    expect(screen.getByTestId('achievements-count')).toHaveTextContent('3');
  });
});

describe('GameContext Error Handling', () => {
  it('should handle missing context gracefully', () => {
    // This should throw an error when useGame is called outside of GameProvider
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGame must be used within a GameProvider');
  });
});
