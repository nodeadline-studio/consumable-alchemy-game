'use client';

import { motion } from 'framer-motion';
import { FlaskConical, Zap, Sparkles } from 'lucide-react';
import AnimatedGraphic from './AnimatedGraphic';

interface LoadingStatesProps {
  type?: 'search' | 'experiment' | 'analysis' | 'general';
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingStates({ 
  type = 'general', 
  message,
  size = 'medium'
}: LoadingStatesProps) {
  const getLoadingContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: <Search className="w-8 h-8 text-blue-400" />,
          messages: [
            'Searching consumables...',
            'Analyzing safety data...',
            'Preparing results...'
          ],
          graphic: 'flask-main'
        };
      case 'experiment':
        return {
          icon: <FlaskConical className="w-8 h-8 text-purple-400" />,
          messages: [
            'Preparing laboratory...',
            'Mixing components...',
            'Analyzing interactions...',
            'Testing safety levels...'
          ],
          graphic: 'flask-experiment'
        };
      case 'analysis':
        return {
          icon: <Zap className="w-8 h-8 text-yellow-400" />,
          messages: [
            'Processing data...',
            'Calculating safety scores...',
            'Generating recommendations...'
          ],
          graphic: 'safety-shield'
        };
      default:
        return {
          icon: <Sparkles className="w-8 h-8 text-blue-400" />,
          messages: [
            'Loading...',
            'Preparing your experience...'
          ],
          graphic: 'flask-main'
        };
    }
  };

  const { icon, messages, graphic } = getLoadingContent();
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      {/* Main Loading Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Background Glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
        />
        
        {/* Main Icon/Graphic */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`
            ${sizeClasses[size]}
            bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center
            border border-white/20 relative overflow-hidden
          `}
        >
          {/* Try to use custom graphic, fallback to icon */}
          <AnimatedGraphic
            assetId={graphic}
            size={size}
            animation="float"
            className="absolute inset-0"
          />
          <div className="relative z-10">
            {icon}
          </div>
          
          {/* Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 border-2 border-transparent border-t-blue-400 rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Loading Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.p
          key={message || messages[0]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-white/80 text-lg font-medium"
        >
          {message || messages[0]}
        </motion.p>
      </motion.div>

      {/* Progress Dots */}
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-2 h-2 bg-blue-400 rounded-full"
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200
            }}
            animate={{ 
              opacity: [0, 1, 0],
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-blue-400/50 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

// Import Search icon
import { Search } from 'lucide-react';
