'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  Search, 
  Zap, 
  Trophy, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  User,
  Star
} from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import GlobalSearch from './GlobalSearch';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: 'search' | 'lab' | 'challenges' | 'stats') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile } = useGame();

  const navigationItems = [
    { id: 'search', label: 'Search', icon: Search, color: 'text-blue-400' },
    { id: 'lab', label: 'Lab', icon: Zap, color: 'text-purple-400' },
    { id: 'challenges', label: 'Challenges', icon: Trophy, color: 'text-yellow-400' },
    { id: 'stats', label: 'Stats', icon: BarChart3, color: 'text-green-400' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FlaskConical className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Consumable Alchemy</h1>
              <p className="text-xs text-white/60">Level {userProfile.stats.level}</p>
            </div>
          </div>

          {/* Global Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <GlobalSearch onNavigateToLab={onViewChange} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Settings */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white/70">
              <User className="w-5 h-5" />
              <span className="text-sm">{userProfile.name}</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-200 ${isMenuOpen ? 'h-auto' : 'h-0'}`}>
          <div className="py-4 space-y-2">
            {/* Mobile Global Search */}
            <div className="px-4 pb-4">
              <GlobalSearch onNavigateToLab={onViewChange} />
            </div>
            
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id as any);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center space-x-3 px-4 py-2 text-white/70">
                <User className="w-5 h-5" />
                <span className="text-sm">{userProfile.name}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
