'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Star, 
  Clock, 
  CheckCircle, 
  Lock,
  Zap,
  Award,
  Flame,
  Users
} from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export default function Challenges() {
  const { challenges, userProfile, completeChallenge } = useGame();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'expert':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-white/60 bg-white/10 border-white/20';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'medium':
        return <Target className="w-5 h-5 text-yellow-400" />;
      case 'hard':
        return <Zap className="w-5 h-5 text-orange-400" />;
      case 'expert':
        return <Flame className="w-5 h-5 text-red-400" />;
      default:
        return <Target className="w-5 h-5 text-white/60" />;
    }
  };

  const isChallengeUnlocked = (challenge: any) => {
    return userProfile.stats.level >= challenge.requiredLevel;
  };

  const isChallengeCompleted = (challenge: any) => {
    return challenge.completed || false;
  };

  const handleStartChallenge = (challengeId: string) => {
    completeChallenge(challengeId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-white">Challenges</h2>
        <p className="text-xl text-white/70">Complete challenges to earn rewards and level up</p>
      </div>

      {/* Challenge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-blue-400/10 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {challenges.filter(c => isChallengeCompleted(c)).length}
          </div>
          <div className="text-sm text-white/60">Completed</div>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-purple-400/10 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {challenges.filter(c => isChallengeUnlocked(c) && !isChallengeCompleted(c)).length}
          </div>
          <div className="text-sm text-white/60">Available</div>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-yellow-400/10 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {challenges.reduce((acc, c) => acc + c.rewards.length, 0)}
          </div>
          <div className="text-sm text-white/60">Total Rewards</div>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-400/10 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round((challenges.filter(c => isChallengeCompleted(c)).length / challenges.length) * 100)}%
          </div>
          <div className="text-sm text-white/60">Completion</div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-6">
        {challenges.map((challenge, index) => {
          const isUnlocked = isChallengeUnlocked(challenge);
          const isCompleted = isChallengeCompleted(challenge);
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass rounded-xl p-6 ${
                isCompleted ? 'bg-green-400/5 border-green-400/20' :
                isUnlocked ? 'hover:bg-white/10' : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-400/20' :
                      isUnlocked ? 'bg-blue-400/20' : 'bg-white/10'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : isUnlocked ? (
                        <Trophy className="w-6 h-6 text-blue-400" />
                      ) : (
                        <Lock className="w-6 h-6 text-white/40" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {challenge.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty.toUpperCase()}
                        </div>
                        <div className="text-sm text-white/60">
                          Level {challenge.requiredLevel} required
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/70 mb-4">{challenge.description}</p>

                  {/* Objectives */}
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-white">Objectives:</h4>
                    {challenge.objectives.map((objective, objIndex) => (
                      <div key={objective.id} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          objective.completed ? 'bg-green-400' : 'bg-white/20'
                        }`}>
                          {objective.completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${
                          objective.completed ? 'text-green-400' : 'text-white/70'
                        }`}>
                          {objective.description}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Rewards:</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.rewards.map((reward, rewardIndex) => (
                        <div key={rewardIndex} className="flex items-center space-x-1 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-yellow-400">
                            {reward.amount} {reward.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ml-6">
                  {isCompleted ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : isUnlocked ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStartChallenge(challenge.id)}
                      className="button-primary flex items-center space-x-2"
                    >
                      <Zap className="w-5 h-5" />
                      <span>Start Challenge</span>
                    </motion.button>
                  ) : (
                    <div className="flex items-center space-x-2 text-white/40">
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
