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
  }
];

export const getRandomWarren = (): Warren => {
  return warrens[Math.floor(Math.random() * warrens.length)];
};