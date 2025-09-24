'use client';

import { FlaskConical, Zap, Shield, Star, ArrowRight, Play } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

interface HeroProps {
  onStartExperimenting?: () => void;
}

export default function Hero({ onStartExperimenting }: HeroProps) {
  const gameContext = useGame();
  const { userProfile } = gameContext;
  
  console.log('Hero: Game Context available:', !!gameContext);
  console.log('Hero: User Profile:', userProfile);

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <FlaskConical className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Welcome back, {userProfile.name}!</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text">Consumable</span>
              <br />
              <span className="text-white">Alchemy</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover the magical effects of mixing consumables in this gamified safety experience. 
              Learn about food safety, drug interactions, and chemical combinations through interactive gameplay.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{userProfile.stats.level}</div>
              <div className="text-sm text-white/60">Level</div>
            </div>
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{userProfile.stats.experience}</div>
              <div className="text-sm text-white/60">XP</div>
            </div>
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{userProfile.stats.experiments}</div>
              <div className="text-sm text-white/60">Experiments</div>
            </div>
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{userProfile.stats.achievements.length}</div>
              <div className="text-sm text-white/60">Achievements</div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-morphism rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FlaskConical className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Safe Experimentation</h3>
              <p className="text-white/70 text-sm">Learn about safe combinations through guided experiments</p>
            </div>
            
            <div className="glass-morphism rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Analysis</h3>
              <p className="text-white/70 text-sm">Get instant feedback on safety levels and interactions</p>
            </div>
            
            <div className="glass-morphism rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Safety First</h3>
              <p className="text-white/70 text-sm">Comprehensive safety guidelines and warnings</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <button
              onClick={() => {
                console.log('Start Experimenting clicked');
                onStartExperimenting?.();
              }}
              className="button-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Play className="w-5 h-5" />
              <span>Start Experimenting</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <p className="text-white/60 text-sm">
              Join thousands of alchemists discovering safe consumable combinations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}