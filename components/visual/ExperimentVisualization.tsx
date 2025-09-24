'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Consumable, ExperimentResult } from '@/types';
import { GraphicsManager } from '@/lib/graphics/graphics-manager';
import AnimatedGraphic from './AnimatedGraphic';
import { FlaskConical, Zap, AlertTriangle, CheckCircle, XCircle, Sparkles } from 'lucide-react';

interface ExperimentVisualizationProps {
  consumables: Consumable[];
  result?: ExperimentResult;
  isRunning?: boolean;
  onComplete?: () => void;
}

export default function ExperimentVisualization({
  consumables,
  result,
  isRunning = false,
  onComplete
}: ExperimentVisualizationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const graphicsManager = GraphicsManager.getInstance();

  const experimentSteps = [
    'preparing',
    'mixing',
    'analyzing',
    'testing',
    'complete'
  ];

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < experimentSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setShowResult(true);
            onComplete?.();
            return prev;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, onComplete, experimentSteps.length]);

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'preparing':
        return <FlaskConical className="w-6 h-6 text-blue-400" />;
      case 'mixing':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'analyzing':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'testing':
        return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      default:
        return <FlaskConical className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStepText = (step: string) => {
    switch (step) {
      case 'preparing':
        return 'Preparing ingredients...';
      case 'mixing':
        return 'Mixing components...';
      case 'analyzing':
        return 'Analyzing interactions...';
      case 'testing':
        return 'Testing safety levels...';
      case 'complete':
        return 'Experiment complete!';
      default:
        return 'Processing...';
    }
  };

  const getResultIcon = (safetyLevel: string) => {
    switch (safetyLevel) {
      case 'safe':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case 'danger':
        return <XCircle className="w-8 h-8 text-red-400" />;
      case 'critical':
        return <XCircle className="w-8 h-8 text-red-500 animate-pulse" />;
      default:
        return <FlaskConical className="w-8 h-8 text-gray-400" />;
    }
  };

  const getResultColor = (safetyLevel: string) => {
    switch (safetyLevel) {
      case 'safe':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'danger':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'critical':
        return 'text-red-500 bg-red-500/20 border-red-500/30 animate-pulse';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Flask Container */}
      <div className="relative flex justify-center items-center min-h-[400px]">
        {/* Background Effects */}
        <div className="absolute inset-0 flex justify-center items-center">
          <AnimatedGraphic
            assetId="flask-main"
            size="hero"
            animation="float"
            className="opacity-30"
          />
        </div>

        {/* Consumables in Flask */}
        <div className="relative z-10 flex flex-col items-center space-y-4">
          {consumables.map((consumable, index) => (
            <motion.div
              key={consumable.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center space-x-2 glass rounded-lg p-3"
            >
              <AnimatedGraphic
                assetId={`${consumable.category}-main`}
                size="small"
                animation="float"
              />
              <span className="text-sm font-medium text-white">
                {consumable.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Experiment Effects */}
        {isRunning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Bubbles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: -100,
                  x: (i - 2) * 20
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                className="absolute w-2 h-2 bg-blue-400/50 rounded-full"
                style={{
                  left: '50%',
                  top: '70%',
                  transform: 'translateX(-50%)'
                }}
              />
            ))}

            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${30 + (i % 3) * 20}%`
                }}
              />
            ))}
          </div>
        )}

        {/* Result Display */}
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="glass rounded-2xl p-8 text-center max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-4"
              >
                {getResultIcon(result.safetyLevel)}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {result.safetyLevel.toUpperCase()}
              </h3>
              
              <p className="text-white/70 mb-4">
                {result.description}
              </p>
              
              <div className={`
                inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border
                ${getResultColor(result.safetyLevel)}
              `}>
                {getResultIcon(result.safetyLevel)}
                <span>Safety Score: {result.safetyScore}/100</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mt-8">
        <div className="flex justify-center space-x-4">
          {experimentSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.3,
                y: 0
              }}
              className="flex flex-col items-center space-y-2"
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${index <= currentStep ? 'bg-blue-500/20 border-2 border-blue-400' : 'bg-white/10 border border-white/20'}
                ${index === currentStep && isRunning ? 'animate-pulse' : ''}
              `}>
                {getStepIcon(step)}
              </div>
              <span className="text-xs text-white/70 text-center">
                {getStepText(step)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Warnings Display */}
      {result && result.warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-2"
        >
          {result.warnings.map((warning, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-sm text-yellow-400">{warning}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
