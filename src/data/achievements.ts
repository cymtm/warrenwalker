import { Achievement, GameState } from '../types/game';
import { WARREN_TYPES } from '../constants/gameConstants';

export const achievements: Achievement[] = [
  {
    id: 'first_descent',
    name: 'First Descent',
    description: 'Begin your journey into the Warrens',
    unlocked: false,
    condition: (gameState: GameState) => gameState.currentLayer > 1
  },
  {
    id: 'fragment_collector',
    name: 'Fragment Collector',
    description: 'Collect your first reality fragment',
    unlocked: false,
    condition: (gameState: GameState) => gameState.fragments.length > 0
  },
  {
    id: 'memory_keeper',
    name: 'Memory Keeper',
    description: 'Reach maximum memory stat',
    unlocked: false,
    condition: (gameState: GameState) => gameState.stats.memory >= 8
  },
  {
    id: 'void_walker',
    name: 'Void Walker',
    description: 'Survive an encounter with the Void Warren',
    unlocked: false,
    hidden: true,
    condition: (gameState: GameState) => gameState.visitedWarrens.includes('void')
  },
  {
    id: 'time_paradox',
    name: 'Temporal Paradox',
    description: 'Experience all possible times at once',
    unlocked: false,
    hidden: true,
    condition: (gameState: GameState) => 
      gameState.visitedWarrens.includes('time') && gameState.stats.memory >= 6
  },
  {
    id: 'echo_chamber',
    name: 'Echo Chamber',
    description: 'Find yourself in the reflections of sound',
    unlocked: false,
    condition: (gameState: GameState) => gameState.visitedWarrens.includes('echo')
  },
  {
    id: 'perfect_balance',
    name: 'Perfect Balance',
    description: 'Maintain equal stats across all three attributes',
    unlocked: false,
    hidden: true,
    condition: (gameState: GameState) => {
      const { sanity, memory, perception } = gameState.stats;
      return sanity === memory && memory === perception && sanity >= 5;
    }
  },
  {
    id: 'madness_incarnate',
    name: 'Madness Incarnate',
    description: 'Lose yourself completely to the Warrens',
    unlocked: false,
    hidden: true,
    condition: (gameState: GameState) => gameState.stats.sanity <= 0
  },
  {
    id: 'warren_master',
    name: 'Warren Master',
    description: 'Visit all types of Warrens in a single descent',
    unlocked: false,
    hidden: true,
    condition: (gameState: GameState) => {
      const uniqueWarrens = new Set(gameState.visitedWarrens);
      return uniqueWarrens.size >= WARREN_TYPES.length;
    }
  },
  {
    id: 'fragment_hoarder',
    name: 'Fragment Hoarder',
    description: 'Collect 6 or more fragments in a single run',
    unlocked: false,
    condition: (gameState: GameState) => gameState.fragments.length >= 6
  }
];

export const checkAchievements = (gameState: GameState): Achievement[] => {
  const newlyUnlocked: Achievement[] = [];
  
  gameState.achievements.forEach(achievement => {
    if (!achievement.unlocked && achievement.condition(gameState)) {
      achievement.unlocked = true;
      newlyUnlocked.push(achievement);
    }
  });
  
  return newlyUnlocked;
};