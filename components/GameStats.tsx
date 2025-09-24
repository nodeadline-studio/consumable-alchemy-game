'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  TrendingUp,
  Clock,
  Award,
  Flame,
  Users
} from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { GamificationEngine } from '@/lib/gamification-engine';

export default function GameStats() {
  const { userProfile, experiments, achievements, getProgressionSummary, getNextMilestone } = useGame();
  
  const progressionSummary = getProgressionSummary();
  const nextMilestone = getNextMilestone();

  const stats = [
    {
      title: 'Level',
      value: userProfile.stats.level,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'Experience',
      value: userProfile.stats.experience,
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      title: 'Experiments',
      value: userProfile.stats.experiments,
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      title: 'Discoveries',
      value: userProfile.stats.discoveries,
      icon: Award,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'Achievements',
      value: achievements.length,
      icon: Trophy,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
    },
    {
      title: 'Streak',
      value: userProfile.stats.streak,
      icon: Flame,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
  ];

  const recentExperiments = experiments.slice(-5).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-white">Your Statistics</h2>
        <p className="text-xl text-white/70">Track your progress and achievements</p>
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Level Progress</h3>
          <span className="text-sm text-white/60">
            {progressionSummary.levelProgress.xpNeeded} XP to next level
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressionSummary.levelProgress.progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-sm text-white/60">
          <span>Level {progressionSummary.level}</span>
          <span>{progressionSummary.experience} XP</span>
        </div>
      </motion.div>

      {/* Next Milestone */}
      {nextMilestone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Next Milestone</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-medium text-white">{nextMilestone.description}</div>
              <div className="text-sm text-white/60">{nextMilestone.reward}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(nextMilestone.progress)}%
              </div>
              <div className="text-sm text-white/60">Progress</div>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${nextMilestone.progress}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 text-center"
            >
              <div className={`w-12 h-12 mx-auto mb-4 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.title}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Experiments */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <span>Recent Experiments</span>
          </h3>
          
          {recentExperiments.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <p className="text-white/70">No experiments yet</p>
              <p className="text-sm text-white/50">Start mixing in the lab!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentExperiments.map((experiment, index) => (
                <motion.div
                  key={experiment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {experiment.consumables.map(c => c.name).join(' + ')}
                    </h4>
                    <p className="text-xs text-white/60">
                      {experiment.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      experiment.score > 70 ? 'text-green-400' :
                      experiment.score > 40 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {experiment.score}
                    </div>
                    <div className="text-xs text-white/60">Score</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span>Achievements</span>
          </h3>
          
          {achievements.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <p className="text-white/70">No achievements yet</p>
              <p className="text-sm text-white/50">Complete challenges to earn them!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-white/60">
                      {achievement.description}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-white/60 capitalize">
                      {achievement.rarity}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
