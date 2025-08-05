import { Warren } from '../types/game';

export const warrens: Warren[] = [
  {
    name: "Memory Warren",
    type: "memory",
    description: "Memories swirl like smoke. Forgotten faces reach for you from the mist.",
    style: {
      backgroundColor: "#1a1a2e",
      textColor: "#e5dccf",
      textShadow: "0 0 10px rgba(229, 220, 207, 0.3)"
    },
    choices: [
      {
        text: "Recall a childhood event",
        result: "You remember a lie you told. It costs you a truth, but grants clarity.",
        fragmentChance: 0.6,
        statEffect: { memory: 1, sanity: -1 }
      },
      {
        text: "Ignore the voices",
        result: "They whisper anyway. Something precious is stolen from your mind.",
        fragmentChance: 0.3,
        statEffect: { memory: -2 }
      },
      {
        text: "Search the memories",
        result: "You find a fragment of yourself, but it doesn't fit who you are now.",
        fragmentChance: 0.8,
        statEffect: { perception: 1 }
      }
    ]
  },
  {
    name: "Shadow Warren",
    type: "shadow",
    description: "Light bends wrong here. Some choices feel real, some don't. Can you trust your eyes?",
    style: {
      backgroundColor: "#0d0d0d",
      textColor: "#8a8a8a",
      textShadow: "0 0 15px rgba(138, 138, 138, 0.5)"
    },
    choices: [
      {
        text: "Step into the darkness",
        result: "It welcomes you. You lose your sense of time, but gain understanding.",
        fragmentChance: 0.5,
        statEffect: { perception: -1, sanity: 1 }
      },
      {
        text: "Call for help",
        result: "The echo returns, but it isn't your voice. Something else answered.",
        fragmentChance: 0.4,
        statEffect: { sanity: -1 }
      },
      {
        text: "Light a match",
        result: "Shadows multiply, swallowing the flame. In the darkness, you see truth.",
        fragmentChance: 0.7,
        statEffect: { perception: 2 }
      }
    ]
  },
  {
    name: "Pain Warren",
    type: "pain",
    description: "Everything hurts. The ground is made of broken promises and sharp regrets.",
    style: {
      backgroundColor: "#2d1b1b",
      textColor: "#ff6b6b",
      textShadow: "0 0 8px rgba(255, 107, 107, 0.4)"
    },
    choices: [
      {
        text: "Endure in silence",
        result: "Pain hardens into armor. You are stronger, but colder.",
        fragmentChance: 0.6,
        statEffect: { sanity: 2, memory: -1 }
      },
      {
        text: "Cry out",
        result: "The Warren answers with another wound, but also unexpected compassion.",
        fragmentChance: 0.4,
        statEffect: { sanity: -2, perception: 1 }
      },
      {
        text: "Walk barefoot on the broken ground",
        result: "You leave a trail of blood and memory behind. Each step teaches you something.",
        fragmentChance: 0.8,
        statEffect: { memory: 2, sanity: -1 }
      }
    ]
  },
  {
    name: "Dream Warren",
    type: "dream",
    description: "Logic dissolves like sugar in rain. Words taste of colors you've never seen.",
    style: {
      backgroundColor: "#1a0d2e",
      textColor: "#dda0dd",
      fontFamily: "serif",
      textShadow: "0 0 20px rgba(221, 160, 221, 0.6)"
    },
    choices: [
      {
        text: "Dance with the impossible",
        result: "Mathematics becomes music. You understand the song of falling upward.",
        fragmentChance: 0.9,
        statEffect: { perception: 3, sanity: -2 }
      },
      {
        text: "Speak in colors",
        result: "Blue tastes like forgotten names. Red sounds like your mother's lullaby.",
        fragmentChance: 0.7,
        statEffect: { memory: 1, sanity: -1 }
      },
      {
        text: "Try to remember logic",
        result: "2+2 equals the sound of rain. Causality is just a rumor here.",
        fragmentChance: 0.3,
        statEffect: { sanity: 1 }
      }
    ]
  },
  {
    name: "Entropy Warren",
    type: "entropy",
    description: "Everything decayssss... no, everything is [ERROR]. The rules keep ch4ng1ng.",
    style: {
      backgroundColor: "#1a1a1a",
      textColor: "#00ff41",
      fontFamily: "monospace",
      textShadow: "0 0 5px rgba(0, 255, 65, 0.8)"
    },
    choices: [
      {
        text: "Embrace the c0rruption",
        result: "Y0u bec0me 0ne with the gl1tch. [FRAGMENT_OBTAINED] [ERROR] [SUCCESS]",
        fragmentChance: 1.0,
        statEffect: { perception: -3, memory: -1, sanity: 1 }
      },
      {
        text: "Fight the breakdown",
        result: "Reality reasserts itself. But at what cost? [MEMORY_CORRUPTED]",
        fragmentChance: 0.2,
        statEffect: { memory: -2, sanity: 2 }
      },
      {
        text: "0101000101000011010101",
        result: "Y3s. Y0u sp34k th3 tru3 l4ngu4g3 n0w. The Warren g1v3s y0u 1ts s3cr3t.",
        fragmentChance: 0.8,
        statEffect: { perception: 1, memory: -1 }
      }
    ]
  },
  {
    name: "Time Warren",
    type: "time",
    description: "Clocks tick backward. You see yourself arriving before you've left. Past and future blur into impossible now.",
    style: {
      backgroundColor: "#2a1810",
      textColor: "#d4af37",
      fontFamily: "serif",
      textShadow: "0 0 12px rgba(212, 175, 55, 0.4)"
    },
    choices: [
      {
        text: "Step into yesterday",
        result: "You meet yourself coming back. The other you whispers a warning you can't quite hear.",
        fragmentChance: 0.7,
        statEffect: { memory: 2, sanity: -1 }
      },
      {
        text: "Push forward to tomorrow",
        result: "The future is a book with pages torn out. You see endings without beginnings.",
        fragmentChance: 0.5,
        statEffect: { perception: 1, memory: -1 }
      },
      {
        text: "Stand still in the present",
        result: "Time flows around you like water. You become an island of now in an ocean of when.",
        fragmentChance: 0.4,
        statEffect: { sanity: 2 }
      }
    ]
  },
  {
    name: "Echo Warren",
    type: "echo",
    description: "Every word you've spoken lives here. They repeat endlessly, growing stranger with each iteration.",
    style: {
      backgroundColor: "#1a1a2e",
      textColor: "#9b8aa3",
      textShadow: "0 0 8px rgba(155, 138, 163, 0.5)"
    },
    choices: [
      {
        text: "Listen to your childhood voice",
        result: "A younger you recites a poem you forgot you knew. The words taste like summer rain.",
        fragmentChance: 0.6,
        statEffect: { memory: 3, perception: -1 }
      },
      {
        text: "Follow someone else's echo",
        result: "You hear your mother calling your name. But she's been gone for years, hasn't she?",
        fragmentChance: 0.5,
        statEffect: { sanity: -2, memory: 1 }
      },
      {
        text: "Shout into the void",
        result: "Your voice returns changed, speaking truths you never said but always knew.",
        fragmentChance: 0.8,
        statEffect: { perception: 2, sanity: 1 }
      }
    ]
  },
  {
    name: "Void Warren",
    type: "void",
    description: "Nothing. No, less than nothing. The absence of absence. It looks back at you with eyes that don't exist.",
    style: {
      backgroundColor: "#000000",
      textColor: "#ffffff",
      fontFamily: "monospace",
      textShadow: "0 0 5px rgba(255, 255, 255, 0.8)"
    },
    choices: [
      {
        text: "Embrace the emptiness",
        result: "You become nothing, and in becoming nothing, you understand everything. The void is not empty.",
        fragmentChance: 1.0,
        statEffect: { perception: 4, sanity: -3, memory: -1 }
      },
      {
        text: "Fight to remain yourself",
        result: "You cling to identity like a life raft. But what is self in a place that has no concept of existence?",
        fragmentChance: 0.3,
        statEffect: { sanity: 1, memory: 1 }
      },
      {
        text: "Ask the void a question",
        result: "It answers without words, without sound, without meaning. Yet you understand perfectly.",
        fragmentChance: 0.9,
        statEffect: { perception: 3, memory: 2, sanity: -2 }
      }
    ]
  }
];

interface WarrenSelectionCriteria {
  stats: {
    sanity: number;
    memory: number;
    perception: number;
  };
  currentLayer: number;
  visitedWarrens: string[];
}

export const getRandomWarren = (): Warren => {
  return warrens[Math.floor(Math.random() * warrens.length)];
};

export const getWeightedWarren = (criteria: WarrenSelectionCriteria): Warren => {
  const { stats, currentLayer, visitedWarrens } = criteria;
  const availableWarrens = [...warrens];
  
  // Special logic for deeper layers
  if (currentLayer >= 4) {
    // Higher chance of encountering rare warrens in deeper layers
    const rareWarrens = ['time', 'echo', 'void'];
    const rareWarrenInstances = availableWarrens.filter(w => rareWarrens.includes(w.type));
    
    if (rareWarrenInstances.length > 0 && Math.random() < RARE_WARREN_PROBABILITY) {
      return rareWarrenInstances[Math.floor(Math.random() * rareWarrenInstances.length)];
    }
  }
  
  // Stat-based warren selection
  if (stats.perception >= 7 && !visitedWarrens.includes('void')) {
    const voidWarren = availableWarrens.find(w => w.type === 'void');
    if (voidWarren && Math.random() < 0.3) return voidWarren;
  }
  
  if (stats.memory >= 6 && !visitedWarrens.includes('time')) {
    const timeWarren = availableWarrens.find(w => w.type === 'time');
    if (timeWarren && Math.random() < 0.25) return timeWarren;
  }
  
  if (stats.sanity <= 2) {
    // Low sanity increases chance of encountering disturbing warrens
    const darkWarrens = availableWarrens.filter(w => ['shadow', 'pain', 'entropy'].includes(w.type));
    if (darkWarrens.length > 0 && Math.random() < 0.5) {
      return darkWarrens[Math.floor(Math.random() * darkWarrens.length)];
    }
  }
  
  // Default random selection
  return availableWarrens[Math.floor(Math.random() * availableWarrens.length)];
};