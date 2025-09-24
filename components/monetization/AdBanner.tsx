'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Zap, Shield } from 'lucide-react';
import { AdsManager } from '@/lib/monetization/ads-manager';

interface AdBannerProps {
  containerId: string;
  onClose?: () => void;
  className?: string;
}

export default function AdBanner({ containerId, onClose, className = '' }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const showAd = async () => {
      const adsManager = AdsManager.getInstance();
      const success = await adsManager.showBannerAd(containerId);
      setIsVisible(success);
      setIsLoading(false);
    };

    showAd();
  }, [containerId]);

  const handleUpgradeClick = () => {
    // Track banner click
    const adsManager = AdsManager.getInstance();
    adsManager.trackBannerClick();
    
    // Scroll to pricing section or open upgrade modal
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (isLoading) {
    return (
      <div className={`w-full h-24 bg-white/5 rounded-lg animate-pulse ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg p-4 text-white ${className}`}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Ad content */}
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-yellow-300" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Premium Alchemy Tools</span>
          </div>
          <p className="text-xs text-white/80 mb-2">
            Unlock advanced safety analysis, unlimited experiments & exclusive features
          </p>
          <div className="flex items-center space-x-2">
            <Shield className="w-3 h-3 text-green-300" />
            <span className="text-xs text-white/70">Trusted by 10,000+ users</span>
          </div>
        </div>

        <button
          onClick={handleUpgradeClick}
          className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors flex-shrink-0"
        >
          Upgrade Now
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-2 translate-x-2"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-2 -translate-x-2"></div>
    </motion.div>
  );
}
