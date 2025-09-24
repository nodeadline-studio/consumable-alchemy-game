'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Consumable, SafetyLevel } from '@/types';
import { GraphicsManager } from '@/lib/graphics/graphics-manager';
import AnimatedGraphic from './AnimatedGraphic';
import { Star, Shield, AlertTriangle, XCircle, Plus, Zap } from 'lucide-react';

interface ConsumableCardProps {
  consumable: Consumable;
  onClick?: () => void;
  onAdd?: () => void;
  selected?: boolean;
  interactive?: boolean;
  size?: 'small' | 'medium' | 'large';
  showEffects?: boolean;
}

export default function ConsumableCard({
  consumable,
  onClick,
  onAdd,
  selected = false,
  interactive = true,
  size = 'medium',
  showEffects = true
}: ConsumableCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const graphicsManager = GraphicsManager.getInstance();
  const consumableGraphics = graphicsManager.getConsumableGraphics(consumable.id);
  
  console.log('ConsumableCard rendered for:', consumable.name, 'onAdd:', typeof onAdd);

  const getSafetyIcon = (safetyLevel: SafetyLevel) => {
    switch (safetyLevel) {
      case 'safe':
        return <Shield className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'danger':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500 animate-pulse" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSafetyColor = (safetyLevel: SafetyLevel) => {
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

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-3 min-h-[120px]';
      case 'medium':
        return 'p-4 min-h-[160px]';
      case 'large':
        return 'p-6 min-h-[200px]';
      default:
        return 'p-4 min-h-[160px]';
    }
  };

  const getGraphicSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'medium';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { y: -5, scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      className={`
        relative glass rounded-xl border transition-all duration-300 cursor-pointer
        ${selected ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-500/10' : ''}
        ${interactive ? 'hover:shadow-xl hover:shadow-blue-500/25 hover:bg-white/15' : ''}
        ${getSizeClasses()}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Effect */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl"
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getSafetyIcon(consumable.safetyLevel)}
          <span className="text-xs font-medium text-white/70 uppercase tracking-wide">
            {consumable.category}
          </span>
        </div>
        
        {onAdd && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Add button clicked for:', consumable.name);
              onAdd();
            }}
            className="p-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
            data-testid="add-to-inventory-button"
          >
            <Plus className="w-4 h-4 text-blue-400" />
          </motion.button>
        )}
        {!onAdd && (
          <div className="p-1 bg-gray-500/20 rounded-lg">
            <span className="text-xs text-gray-400">No onAdd prop</span>
          </div>
        )}
      </div>

      {/* Main Graphic */}
      <div className="flex justify-center mb-4">
        {consumableGraphics ? (
          <AnimatedGraphic
            assetId={isHovered && consumableGraphics.graphics.hover ? 
              consumableGraphics.graphics.hover.id : 
              consumableGraphics.graphics.main.id
            }
            size={getGraphicSize()}
            animation="float"
            interactive={interactive}
            className="relative"
          />
        ) : (
          <div className={`
            w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center
            ${isHovered ? 'animate-glow' : ''}
          `}>
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
          {consumable.name}
        </h3>
        
        {consumable.description && (
          <p className="text-xs text-white/60 mb-3 line-clamp-2">
            {consumable.description}
          </p>
        )}

        {/* Safety Level Badge */}
        <div className={`
          inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border
          ${getSafetyColor(consumable.safetyLevel)}
        `}>
          {getSafetyIcon(consumable.safetyLevel)}
          <span>{consumable.safetyLevel.toUpperCase()}</span>
        </div>
      </div>

      {/* Effects Overlay */}
      {showEffects && consumableGraphics?.graphics.effect && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <AnimatedGraphic
                assetId={consumableGraphics.graphics.effect.id}
                size="small"
                animation="bounce"
                className="absolute top-2 right-2"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Selection Indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <div className="w-3 h-3 bg-white rounded-full" />
        </motion.div>
      )}

      {/* Hover Glow Effect */}
      {isHovered && interactive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 pointer-events-none"
        />
      )}
    </motion.div>
  );
}
