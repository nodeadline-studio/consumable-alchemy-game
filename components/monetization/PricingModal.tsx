'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Zap, Shield, Crown, CreditCard, ExternalLink } from 'lucide-react';
import { PaymentManager } from '@/lib/monetization/payment-manager';
import { PremiumFeaturesManager } from '@/lib/monetization/premium-features';
import toast from 'react-hot-toast';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: string | null;
}

export default function PricingModal({ isOpen, onClose, currentTier }: PricingModalProps) {
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    const paymentManager = PaymentManager.getInstance();
    const featuresManager = PremiumFeaturesManager.getInstance();
    
    setSubscriptionTiers(paymentManager.getSubscriptionTiers());
    setFeatures(featuresManager.getFeatures());
  }, []);

  const handlePayment = async (tierId: string) => {
    if (!tierId) return;
    
    setIsProcessing(true);
    setSelectedTier(tierId);
    
    try {
      const paymentManager = PaymentManager.getInstance();
      let result;
      
      if (selectedPaymentMethod === 'paypal') {
        result = await paymentManager.processPayPalPayment(tierId);
      } else {
        result = await paymentManager.processGumroadPayment(tierId);
      }
      
      if (result.success) {
        toast.success('Payment successful! Welcome to premium!');
        onClose();
        // Refresh the page to update user state
        window.location.reload();
      } else {
        toast.error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'basic':
        return <Shield className="w-6 h-6" />;
      case 'pro':
        return <Zap className="w-6 h-6" />;
      case 'lifetime':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'basic':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'lifetime':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTierFeatures = (tierId: string) => {
    return features.filter(f => f.requiredTier === tierId);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h2>
              <p className="text-white/70">Unlock advanced features and unlimited experiments</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Choose Payment Method</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedPaymentMethod('paypal')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedPaymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>PayPal</span>
              </button>
              <button
                onClick={() => setSelectedPaymentMethod('gumroad')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedPaymentMethod === 'gumroad'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Gumroad</span>
              </button>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {subscriptionTiers.map((tier) => {
              const tierFeatures = getTierFeatures(tier.id);
              const isCurrentTier = currentTier === tier.id;
              
              return (
                <motion.div
                  key={tier.id}
                  className={`relative bg-white/5 rounded-xl p-6 border transition-all ${
                    tier.popular
                      ? 'border-purple-500 ring-2 ring-purple-500/20'
                      : 'border-white/10 hover:border-white/20'
                  } ${isCurrentTier ? 'opacity-50' : ''}`}
                  whileHover={{ scale: 1.02 }}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  {isCurrentTier && (
                    <div className="absolute -top-3 right-4">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${getTierColor(tier.id)} flex items-center justify-center text-white`}>
                      {getTierIcon(tier.id)}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="text-3xl font-bold text-white mb-1">
                      ${tier.price}
                      <span className="text-sm text-white/70">/{tier.duration === 'lifetime' ? 'one-time' : tier.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tierFeatures.slice(0, 4).map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-white/80">{feature.name}</span>
                      </div>
                    ))}
                    {tierFeatures.length > 4 && (
                      <div className="text-xs text-white/60">
                        +{tierFeatures.length - 4} more features
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handlePayment(tier.id)}
                    disabled={isProcessing || isCurrentTier}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isCurrentTier
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : tier.popular
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isProcessing && selectedTier === tier.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrentTier ? (
                      'Current Plan'
                    ) : (
                      `Choose ${tier.name}`
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/70 py-2">Feature</th>
                    <th className="text-center text-white/70 py-2">Basic</th>
                    <th className="text-center text-white/70 py-2">Pro</th>
                    <th className="text-center text-white/70 py-2">Lifetime</th>
                  </tr>
                </thead>
                <tbody>
                  {['unlimited_experiments', 'export_results', 'custom_consumables', 'api_access', 'white_label'].map((featureId) => {
                    const feature = features.find(f => f.id === featureId);
                    if (!feature) return null;
                    
                    return (
                      <tr key={featureId} className="border-b border-white/5">
                        <td className="text-white py-2">{feature.name}</td>
                        <td className="text-center py-2">
                          {feature.requiredTier === 'basic' ? (
                            <Check className="w-4 h-4 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-white/40">—</span>
                          )}
                        </td>
                        <td className="text-center py-2">
                          {['basic', 'pro'].includes(feature.requiredTier) ? (
                            <Check className="w-4 h-4 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-white/40">—</span>
                          )}
                        </td>
                        <td className="text-center py-2">
                          <Check className="w-4 h-4 text-green-400 mx-auto" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
