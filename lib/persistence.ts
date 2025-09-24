import { UserProfile, GameState, Experiment, Achievement, Consumable } from '@/types';

const STORAGE_KEY = 'consumable-alchemy-game';
const STORAGE_VERSION = '1.0.0';

interface StoredData {
  version: string;
  userProfile: UserProfile;
  gameState: GameState;
  experiments: Experiment[];
  achievements: Achievement[];
  inventory: Consumable[];
  lastSaved: number;
}

export class PersistenceManager {
  /**
   * Save game data to localStorage with validation
   */
  static saveGameData(data: {
    userProfile: UserProfile;
    gameState: GameState;
    experiments: Experiment[];
    achievements: Achievement[];
    inventory: Consumable[];
  }): boolean {
    try {
      const storedData: StoredData = {
        version: STORAGE_VERSION,
        userProfile: data.userProfile,
        gameState: data.gameState,
        experiments: data.experiments,
        achievements: data.achievements,
        inventory: data.inventory,
        lastSaved: Date.now(),
      };

      // Validate data before saving
      if (!this.validateData(storedData)) {
        console.error('Invalid data structure, not saving');
        return false;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
      console.log('Game data saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save game data:', error);
      return false;
    }
  }

  /**
   * Load game data from localStorage with validation
   */
  static loadGameData(): Partial<StoredData> | null {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) {
        console.log('No saved data found - starting fresh');
        return null;
      }

      const parsed: StoredData = JSON.parse(savedData);
      
      // Check version compatibility
      if (parsed.version !== STORAGE_VERSION) {
        console.warn(`Version mismatch: stored ${parsed.version}, expected ${STORAGE_VERSION}`);
        // Could implement migration logic here
      }

      // Validate loaded data
      if (!this.validateData(parsed)) {
        console.error('Invalid saved data structure');
        return null;
      }

      console.log('Game data loaded successfully');
      return parsed;
    } catch (error) {
      console.error('Failed to load game data:', error);
      return null;
    }
  }

  /**
   * Clear all saved data
   */
  static clearGameData(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Game data cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear game data:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const used = data ? new Blob([data]).size : 0;
      
      // Estimate available space (most browsers have 5-10MB limit)
      const available = 5 * 1024 * 1024; // 5MB estimate
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Export game data for backup
   */
  static exportGameData(): string | null {
    try {
      const data = this.loadGameData();
      if (!data) return null;
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export game data:', error);
      return null;
    }
  }

  /**
   * Import game data from backup
   */
  static importGameData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as StoredData;
      
      if (!this.validateData(data)) {
        console.error('Invalid imported data structure');
        return false;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Game data imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import game data:', error);
      return false;
    }
  }

  /**
   * Validate data structure
   */
  private static validateData(data: any): data is StoredData {
    if (!data || typeof data !== 'object') return false;
    
    // Check required fields with more lenient validation
    const requiredFields = ['version', 'userProfile', 'gameState'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }

    // Validate arrays (allow empty arrays)
    if (data.experiments && !Array.isArray(data.experiments)) return false;
    if (data.achievements && !Array.isArray(data.achievements)) return false;
    if (data.inventory && !Array.isArray(data.inventory)) return false;

    // Validate user profile structure (more lenient)
    if (!data.userProfile || typeof data.userProfile !== 'object') return false;
    if (data.userProfile.stats && typeof data.userProfile.stats !== 'object') return false;

    return true;
  }

  /**
   * Create default data structure
   */
  static createDefaultData(): StoredData {
    return {
      version: STORAGE_VERSION,
      userProfile: {
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
      },
      gameState: {
        currentLevel: 1,
        currentChallenge: null,
        inventory: [],
        labEquipment: [],
        unlockedFeatures: ['basic_search', 'basic_lab'],
        tutorialProgress: 0,
        isPaused: false,
      },
      experiments: [],
      achievements: [],
      inventory: [],
      lastSaved: Date.now(),
    };
  }
}
