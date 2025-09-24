'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { Search, FlaskConical, Zap, Shield, Star, Trophy, Users, Settings } from 'lucide-react';
import { GameProvider } from '@/contexts/GameContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

// Lazy load heavy components
const SearchInterface = lazy(() => import('@/components/SearchInterface'));
const AlchemyLab = lazy(() => import('@/components/AlchemyLab'));
const GameStats = lazy(() => import('@/components/GameStats'));
const Challenges = lazy(() => import('@/components/Challenges'));

// Lazy load monetization components
const AdBanner = lazy(() => import('@/components/monetization/AdBanner'));
const PricingModal = lazy(() => import('@/components/monetization/PricingModal'));

export default function Home() {
  const [currentView, setCurrentView] = useState<'search' | 'lab' | 'challenges' | 'stats'>('search');
  const [isLoading, setIsLoading] = useState(false); // Start with false to skip loading
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAdBanner, setShowAdBanner] = useState(true);
  // Debug current view changes
  useEffect(() => {
    console.log('Current view changed to:', currentView);
  }, [currentView]);

  return (
    <ErrorBoundary>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <ErrorBoundary>
            <Header currentView={currentView} onViewChange={setCurrentView} />
          </ErrorBoundary>
          
          <main className="pt-20">
            {currentView === 'search' && (
              <div className="animate-fade-in">
                <ErrorBoundary>
                  <Hero onStartExperimenting={() => setCurrentView('lab')} />
                </ErrorBoundary>
                <ErrorBoundary>
                  <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>}>
                    <SearchInterface />
                  </Suspense>
                </ErrorBoundary>
              </div>
            )}
            
            {currentView === 'lab' && (
              <div className="animate-fade-in">
                <ErrorBoundary>
                  <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>}>
                    <AlchemyLab />
                  </Suspense>
                </ErrorBoundary>
              </div>
            )}
              
            {currentView === 'challenges' && (
              <div className="animate-fade-in">
                <ErrorBoundary>
                  <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>}>
                    <Challenges />
                  </Suspense>
                </ErrorBoundary>
              </div>
            )}
            
            {currentView === 'stats' && (
              <div className="animate-fade-in">
                <ErrorBoundary>
                  <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>}>
                    <GameStats />
                  </Suspense>
                </ErrorBoundary>
              </div>
            )}
          </main>

          {/* Ad Banner */}
          {showAdBanner && (
            <div className="px-4 py-2">
              <Suspense fallback={<div className="h-24 bg-white/5 rounded-lg animate-pulse"></div>}>
                <AdBanner 
                  containerId="ad-banner" 
                  onClose={() => setShowAdBanner(false)}
                />
              </Suspense>
            </div>
          )}
          
          <ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        </div>

        {/* Pricing Modal */}
        <Suspense fallback={null}>
          <PricingModal 
            isOpen={showPricingModal}
            onClose={() => setShowPricingModal(false)}
          />
        </Suspense>
      </GameProvider>
    </ErrorBoundary>
  );
}
