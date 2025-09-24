'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FlaskConical, 
  Zap, 
  Plus, 
  X, 
  Play, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Trophy
} from 'lucide-react';
import { Consumable, Experiment, Combination, ExperimentResult, SafetyLevel } from '@/types';
import { useGame } from '@/contexts/GameContext';
import { generateExperimentResult } from '@/lib/safety-engine';
import GlobalSearch from './GlobalSearch';
import toast from 'react-hot-toast';

const AlchemyLab = memo(function AlchemyLab() {
  const { inventory, processExperimentCompletion, isFeatureUnlocked, isConsumableCategoryUnlocked } = useGame();
  const [selectedConsumables, setSelectedConsumables] = useState<Consumable[]>([]);
  const [isExperimenting, setIsExperimenting] = useState(false);
  const [experimentResult, setExperimentResult] = useState<ExperimentResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Debug logging for inventory
  console.log('AlchemyLab: Inventory length:', inventory.length);
  console.log('AlchemyLab: Inventory items:', inventory.map(item => ({ id: item.id, name: item.name })));

  const addToMix = (consumable: Consumable) => {
    console.log('addToMix called for:', consumable.name);
    console.log('Current selectedConsumables:', selectedConsumables.length);
    console.log('AlchemyLab: About to add to mix, current view should be lab');
    
    if (selectedConsumables.length >= 5) {
      toast.error('Maximum 5 consumables can be mixed at once');
      return;
    }
    
    if (selectedConsumables.find(c => c.id === consumable.id)) {
      toast.error('This consumable is already in the mix');
      return;
    }
    
    const newSelected = [...selectedConsumables, consumable];
    console.log('Setting selectedConsumables to:', newSelected.length, 'items');
    setSelectedConsumables(newSelected);
    toast.success(`Added ${consumable.name} to the mix`);
    console.log('addToMix completed successfully');
  };

  const removeFromMix = (consumableId: string) => {
    setSelectedConsumables(selectedConsumables.filter(c => c.id !== consumableId));
  };

  const runExperiment = async () => {
    if (selectedConsumables.length < 2) {
      toast.error('Select at least 2 consumables to mix');
      return;
    }

    setIsExperimenting(true);
    setExperimentResult(null);
    setShowResults(false);

    // Simulate experiment time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate experiment result using real safety engine
    console.log('Running safety analysis for:', selectedConsumables.map(c => c.name));
    const result = generateExperimentResult(selectedConsumables);
    console.log('Safety analysis complete:', {
      safetyScore: result.safetyScore,
      effectivenessScore: result.effectivenessScore,
      noveltyScore: result.noveltyScore,
      overallScore: result.overallScore
    });
    
    setExperimentResult(result);
    setShowResults(true);

    // Create experiment record
    const experiment: Experiment = {
      id: Date.now().toString(),
      userId: '1',
      consumables: selectedConsumables,
      combinations: [{
        id: '1',
        consumables: selectedConsumables,
        ratio: selectedConsumables.reduce((acc, c, i) => {
          acc[c.id] = 100 / selectedConsumables.length;
          return acc;
        }, {} as Record<string, number>),
        method: 'mix',
      }],
      results: [result],
      timestamp: new Date(),
      success: result.overallScore > 50,
      score: result.overallScore,
    };

    // Process experiment completion with gamification
    processExperimentCompletion(experiment);
    setIsExperimenting(false);
    toast.success('Experiment completed!');
  };

  const resetLab = () => {
    setSelectedConsumables([]);
    setExperimentResult(null);
    setShowResults(false);
  };

  const getSafetyIcon = (safetyLevel: SafetyLevel) => {
    switch (safetyLevel) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'caution':
        return <Info className="w-5 h-5 text-yellow-400" />;
      case 'warning':
      case 'danger':
      case 'lethal':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-white/60" />;
    }
  };

  const getSafetyColor = (safetyLevel: SafetyLevel) => {
    switch (safetyLevel) {
      case 'safe':
        return 'status-safe';
      case 'caution':
        return 'status-caution';
      case 'warning':
        return 'status-warning';
      case 'danger':
        return 'status-danger';
      case 'lethal':
        return 'status-lethal';
      default:
        return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-white">Alchemy Laboratory</h2>
        <p className="text-xl text-white/70">Mix consumables and discover their magical interactions</p>
      </div>

      {/* Global Search in Lab */}
      <div className="mb-8">
        <GlobalSearch onNavigateToLab={() => {}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <FlaskConical className="w-6 h-6 text-blue-400" />
              <span>Inventory ({inventory.length})</span>
            </h3>
            
            {inventory.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="w-16 h-16 mx-auto mb-4 text-white/40" />
                <p className="text-white/70">No consumables in inventory</p>
                <p className="text-sm text-white/50">Search and add some to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                {inventory.map((consumable) => (
                  <motion.div
                    key={consumable.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    {consumable.image && (
                      <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={consumable.image}
                          alt={consumable.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {consumable.name}
                      </h4>
                      <p className="text-xs text-white/60 capitalize">
                        {consumable.category}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getSafetyIcon(consumable.safetyLevel)}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToMix(consumable);
                        }}
                        disabled={selectedConsumables.find(c => c.id === consumable.id) !== undefined}
                        className="p-1 text-blue-400 hover:text-blue-300 disabled:text-white/30 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mixing Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mixing Bowl */}
          <div className="glass rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-6">Mixing Bowl</h3>
            
            <div className="relative">
              <motion.div
                animate={isExperimenting ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: isExperimenting ? Infinity : 0, ease: "linear" }}
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-white/20"
              >
                <FlaskConical className="w-16 h-16 text-blue-400" />
              </motion.div>

              {selectedConsumables.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-white"
                  >
                    {selectedConsumables.length}
                  </motion.div>
                </div>
              )}
            </div>

            {/* Selected Consumables */}
            <div className="space-y-4">
              {selectedConsumables.length === 0 ? (
                <p className="text-white/60">Select consumables from your inventory to start mixing</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedConsumables.map((consumable, index) => (
                    <motion.div
                      key={consumable.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative bg-white/10 rounded-lg p-3"
                    >
                      {consumable.image && (
                        <div className="w-12 h-12 mx-auto mb-2 bg-white/10 rounded-lg overflow-hidden relative">
                          <Image
                            src={consumable.image}
                            alt={consumable.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      )}
                      
                      <h4 className="text-sm font-medium text-white text-center truncate">
                        {consumable.name}
                      </h4>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromMix(consumable.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-300"
                      >
                        <X className="w-3 h-3" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runExperiment}
                disabled={selectedConsumables.length < 2 || isExperimenting}
                className="button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExperimenting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    <span>Experimenting...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Run Experiment</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetLab}
                className="button-secondary flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </motion.button>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence>
            {showResults && experimentResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass rounded-xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <span>Experiment Results</span>
                  </h3>
                  <div className="text-2xl font-bold text-white">
                    {experimentResult.overallScore}/100
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">
                      {experimentResult.safetyScore}/100
                    </div>
                    <div className="text-sm text-white/60">Safety</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">
                      {experimentResult.effectivenessScore}/100
                    </div>
                    <div className="text-sm text-white/60">Effectiveness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">
                      {experimentResult.noveltyScore}/100
                    </div>
                    <div className="text-sm text-white/60">Novelty</div>
                  </div>
                </div>

                {/* Effects */}
                {experimentResult.effects.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Effects</h4>
                    <div className="space-y-2">
                      {experimentResult.effects.map((effect, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            effect.positive ? 'status-safe' : 'status-warning'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {effect.positive ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-orange-400" />
                            )}
                            <span className="font-medium text-white">{effect.name}</span>
                            <span className="text-sm text-white/60">
                              ({effect.intensity} • {effect.duration}min)
                            </span>
                          </div>
                          <p className="text-sm text-white/70 mt-1">{effect.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {experimentResult.warnings.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span>Warnings</span>
                    </h4>
                    <div className="space-y-2">
                      {experimentResult.warnings.map((warning, index) => (
                        <div key={index} className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                          <p className="text-red-400 text-sm">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {experimentResult.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Info className="w-5 h-5 text-blue-400" />
                      <span>Recommendations</span>
                    </h4>
                    <div className="space-y-2">
                      {experimentResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                          <p className="text-blue-400 text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

export default AlchemyLab;

