import { Discovery, WarrenType } from '../types/game';

export const discoveries: Discovery[] = [
  {
    id: 'temporal_loop',
    name: 'Temporal Loop',
    description: 'You notice the same moment repeating. A glitch in the Time Warren\'s fabric.',
    warrenType: 'time',
    requiresStats: { memory: 6 }
  },
  {
    id: 'echo_origin',
    name: 'The First Voice',
    description: 'Among all the echoes, you find the original sound that started it all.',
    warrenType: 'echo',
    requiresStats: { perception: 7 }
  },
  {
    id: 'void_entity',
    name: 'The Watcher in Nothing',
    description: 'Something that shouldn\'t exist notices you in the Void. It nods approvingly.',
    warrenType: 'void',
    requiresStats: { sanity: 8 }
  },
  {
    id: 'memory_core',
    name: 'Core Memory',
    description: 'A memory that isn\'t yours but feels familiar. It belongs to someone else who walked these paths.',
    warrenType: 'memory',
    requiresStats: { memory: 5, perception: 5 }
  },
  {
    id: 'shadow_truth',
    name: 'Shadow\'s Secret',
    description: 'In the deepest darkness, you glimpse the true nature of light.',
    warrenType: 'shadow',
    requiresStats: { perception: 6, sanity: 4 }
  },
  {
    id: 'pain_transcendence',
    name: 'Beyond Suffering',
    description: 'You discover that pain can be a doorway to understanding.',
    warrenType: 'pain',
    requiresStats: { sanity: 7 }
  },
  {
    id: 'dream_lucidity',
    name: 'Lucid Dreaming',
    description: 'You realize you can control the impossible logic of this place.',
    warrenType: 'dream',
    requiresStats: { perception: 5, memory: 4 }
  },
  {
    id: 'entropy_pattern',
    name: 'Order in Chaos',
    description: 'Within the corruption, you detect a hidden pattern. Someone designed this decay.',
    warrenType: 'entropy',
    requiresStats: { perception: 8, memory: 6 }
  }
];

export const checkDiscoveries = (warrenType: WarrenType, stats: { sanity: number; memory: number; perception: number }): Discovery[] => {
  return discoveries.filter(discovery => {
    if (discovery.warrenType !== warrenType) return false;
    
    if (discovery.requiresStats) {
      for (const [stat, value] of Object.entries(discovery.requiresStats)) {
        if (stats[stat as keyof typeof stats] < value) return false;
      }
    }
    
    return true;
  });
};