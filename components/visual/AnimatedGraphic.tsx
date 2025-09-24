'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GraphicsManager } from '@/lib/graphics/graphics-manager';

interface AnimatedGraphicProps {
  assetId: string;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  selected?: boolean;
  size?: 'small' | 'medium' | 'large' | 'hero';
  animation?: 'float' | 'pulse' | 'glow' | 'rotate' | 'bounce';
  delay?: number;
  interactive?: boolean;
}

export default function AnimatedGraphic({
  assetId,
  className = '',
  onClick,
  hover = false,
  selected = false,
  size = 'medium',
  animation,
  delay = 0,
  interactive = false
}: AnimatedGraphicProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const graphicsManager = GraphicsManager.getInstance();
  
  const asset = graphicsManager.getAsset(assetId);
  
  if (!asset) {
    console.warn(`Graphic asset not found: ${assetId}`);
    return null;
  }

  const sizeClasses = graphicsManager.getSizeClasses(size);
  const animationClasses = animation ? graphicsManager.getAnimationClasses(animation) : '';
  
  const baseClasses = `
    ${sizeClasses}
    ${animationClasses}
    ${interactive ? 'cursor-pointer transition-all duration-300' : ''}
    ${interactive && hover ? 'hover:scale-110 hover:drop-shadow-lg' : ''}
    ${selected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
    ${className}
  `.trim();

  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
    }
  };

  return (
    <motion.div
      className={baseClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isLoaded ? 1 : 0, 
        scale: isLoaded ? 1 : 0.8,
        y: isHovered && interactive ? -5 : 0
      }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: "easeOut"
      }}
      whileHover={interactive ? { scale: 1.1 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
    >
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              className="object-contain"
              onLoad={() => setIsLoaded(true)}
              priority={size === 'hero'}
            />
            
            {/* Hover Effect Overlay */}
            {interactive && isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-400/20 rounded-lg"
              />
            )}
            
            {/* Selection Indicator */}
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading State */}
      {!isLoaded && (
        <div className="w-full h-full bg-white/10 rounded-lg animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 bg-white/30 rounded-full animate-bounce" />
        </div>
      )}
    </motion.div>
  );
}
