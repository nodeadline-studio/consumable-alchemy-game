import axios from 'axios';
import { Consumable, ConsumableCategory, ConsumableType, SafetyLevel, NutritionalInfo, DataSource } from '@/types';

const FOODB_BASE_URL = 'https://foodb.ca/api/v1';

export interface FoodBCompound {
  id: number;
  name: string;
  description?: string;
  synonyms?: string[];
  molecular_formula?: string;
  molecular_weight?: number;
  cas_number?: string;
  smiles?: string;
  inchi?: string;
  inchikey?: string;
  kingdom?: string;
  super_class?: string;
  class?: string;
  sub_class?: string;
  direct_parent?: string;
  classification?: string;
  external_links?: Record<string, string>;
  foodb_id?: string;
  foodb_name?: string;
  foodb_description?: string;
  foodb_synonyms?: string[];
  foodb_molecular_formula?: string;
  foodb_molecular_weight?: number;
  foodb_cas_number?: string;
  foodb_smiles?: string;
  foodb_inchi?: string;
  foodb_inchikey?: string;
  foodb_kingdom?: string;
  foodb_super_class?: string;
  foodb_class?: string;
  foodb_sub_class?: string;
  foodb_direct_parent?: string;
  foodb_classification?: string;
  foodb_external_links?: Record<string, string>;
}

export class FoodBAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = FOODB_BASE_URL;
  }

  async searchCompounds(query: string, limit: number = 20): Promise<Consumable[]> {
    try {
      const response = await axios.get(`${this.baseURL}/compound/search`, {
        params: {
          q: query,
          limit,
        },
      });

      const compounds = response.data.compounds || [];
      return compounds.map((compound: FoodBCompound) => this.mapToConsumable(compound));
    } catch (error) {
      console.error('Error searching FoodB compounds:', error);
      throw new Error('Failed to search compounds');
    }
  }

  async getCompoundById(id: number): Promise<Consumable | null> {
    try {
      const response = await axios.get(`${this.baseURL}/compound/${id}`);
      return this.mapToConsumable(response.data.compound);
    } catch (error) {
      console.error('Error fetching compound by ID:', error);
      return null;
    }
  }

  private mapToConsumable(compound: FoodBCompound): Consumable {
    return {
      id: compound.id.toString(),
      name: compound.name || compound.foodb_name || 'Unknown Compound',
      category: this.mapCategory(compound),
      type: 'powder',
      description: compound.description || compound.foodb_description,
      ingredients: [compound.name],
      safetyLevel: this.mapSafetyLevel(compound),
      effects: this.generateEffects(compound),
      interactions: [],
      tags: this.generateTags(compound),
      source: 'foodb' as DataSource,
    };
  }

  private mapCategory(compound: FoodBCompound): ConsumableCategory {
    const classification = compound.classification || compound.foodb_classification || '';
    
    if (classification.includes('alcohol') || classification.includes('ethanol')) {
      return 'alcohol';
    }
    if (classification.includes('vitamin') || classification.includes('supplement')) {
      return 'supplement';
    }
    if (classification.includes('drug') || classification.includes('pharmaceutical')) {
      return 'medication';
    }
    if (classification.includes('herb') || classification.includes('plant')) {
      return 'herb';
    }
    
    return 'chemical';
  }

  private mapSafetyLevel(compound: FoodBCompound): SafetyLevel {
    const classification = compound.classification || compound.foodb_classification || '';
    
    if (classification.includes('toxic') || classification.includes('poison')) {
      return 'lethal';
    }
    if (classification.includes('drug') || classification.includes('pharmaceutical')) {
      return 'warning';
    }
    if (classification.includes('alcohol') || classification.includes('stimulant')) {
      return 'caution';
    }
    
    return 'safe';
  }

  private generateEffects(compound: FoodBCompound): any[] {
    const effects = [];
    const classification = compound.classification || compound.foodb_classification || '';
    
    if (classification.includes('stimulant')) {
      effects.push({
        id: 'stimulant',
        name: 'Stimulant',
        description: 'Increases alertness and energy',
        intensity: 'moderate',
        duration: 120,
        category: 'neurological',
        positive: true,
      });
    }
    
    if (classification.includes('depressant')) {
      effects.push({
        id: 'depressant',
        name: 'Depressant',
        description: 'Reduces nervous system activity',
        intensity: 'moderate',
        duration: 180,
        category: 'neurological',
        positive: false,
      });
    }

    return effects;
  }

  private generateTags(compound: FoodBCompound): string[] {
    const tags = [];
    
    if (compound.kingdom) tags.push(compound.kingdom);
    if (compound.super_class) tags.push(compound.super_class);
    if (compound.class) tags.push(compound.class);
    if (compound.sub_class) tags.push(compound.sub_class);
    
    return tags.filter(Boolean);
  }
}

export const foodBAPI = new FoodBAPI();
