import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { TypeWriter } from './components/TypeWriter'
import { SettingsMenu } from './components/SettingsMenu'
import { AchievementNotification, AchievementsPanel } from './components/Achievements'
import { getRandomWarren, getWeightedWarren } from './data/warrens'
import { achievements, checkAchievements } from './data/achievements'
import { checkDiscoveries } from './data/discoveries'
import { GameState, Fragment, GamePhase, Achievement, Discovery, GameSettings } from './types/game'

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentLayer: 1,
    maxLayers: 6,
    fragments: [],
    stats: {
      sanity: 5,
      memory: 5,
      perception: 5
    },
    isGameOver: false,
    achievements: achievements.map(a => ({ ...a, unlocked: false })),
    discoveries: [],
    settings: {
      textSpeed: 50,
      difficulty: 'normal',
      autoAdvance: false,
      showStats: true,
      soundEnabled: false
    },
    visitedWarrens: []
  });

  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [currentText, setCurrentText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const [currentDiscoveries, setCurrentDiscoveries] = useState<Discovery[]>([]);

  const startNewGame = useCallback(() => {
    setGameState({
      currentLayer: 1,
      maxLayers: 6,
      fragments: [],
      stats: {
        sanity: 5,
        memory: 5,
        perception: 5
      },
      isGameOver: false,
      achievements: achievements.map(a => ({ ...a, unlocked: false })),
      discoveries: [],
      settings: gameState.settings, // Preserve settings
      visitedWarrens: []
    });
    setGamePhase('intro');
    setCurrentText("You wake. The world isn't yours. It never was.\n\nYou are a Warrenwalker, slipping between layers of broken reality.\nEach Warren you enter changes the rules of existence itself.\n\nThe descent begins...");
    setShowChoices(false);
    setIsTextComplete(false);
    setCurrentDiscoveries([]);
  }, [gameState.settings]);

  const enterWarren = useCallback(() => {
    const warren = gameState.currentLayer >= LAYER_WEIGHTED_WARREN_THRESHOLD ? 
      getWeightedWarren({
        stats: gameState.stats,
        currentLayer: gameState.currentLayer,
        visitedWarrens: gameState.visitedWarrens
      }) : 
      getRandomWarren();
      
    setGameState(prev => ({ 
      ...prev, 
      currentWarren: warren,
      visitedWarrens: [...prev.visitedWarrens, warren.type]
    }));
    
    setGamePhase('warren');
    setCurrentText(`[${warren.name}]\n\n${warren.description}`);
    setShowChoices(false);
    setIsTextComplete(false);
    
    // Check for discoveries in this warren
    const discoveries = checkDiscoveries(warren.type, gameState.stats);
    setCurrentDiscoveries(discoveries);
  }, [gameState.stats, gameState.currentLayer, gameState.visitedWarrens]);

  const makeChoice = useCallback((choiceIndex: number) => {
    if (!gameState.currentWarren) return;

    const choice = gameState.currentWarren.choices[choiceIndex];
    let resultText = choice.result;
    
    // Add discovery text if any were found
    if (currentDiscoveries.length > 0) {
      const discovery = currentDiscoveries[0]; // Show first discovery
      resultText += `\n\n[Discovery: ${discovery.name}]\n${discovery.description}`;
    }
    
    setGamePhase('result');
    setCurrentText(resultText);
    setShowChoices(false);
    setIsTextComplete(false);

    // Apply stat effects and potentially collect fragment
    setGameState(prev => {
      const newStats = { ...prev.stats };
      if (choice.statEffect) {
        if (choice.statEffect.sanity) newStats.sanity += choice.statEffect.sanity;
        if (choice.statEffect.memory) newStats.memory += choice.statEffect.memory;
        if (choice.statEffect.perception) newStats.perception += choice.statEffect.perception;
        
        // Apply difficulty modifiers
        if (prev.settings.difficulty === 'easy') {
          // Reduce negative effects on easy
          if (choice.statEffect.sanity && choice.statEffect.sanity < 0) newStats.sanity += 1;
          if (choice.statEffect.memory && choice.statEffect.memory < 0) newStats.memory += 1;
          if (choice.statEffect.perception && choice.statEffect.perception < 0) newStats.perception += 1;
        } else if (prev.settings.difficulty === 'hard') {
          // Increase negative effects on hard
          if (choice.statEffect.sanity && choice.statEffect.sanity < 0) newStats.sanity -= 1;
          if (choice.statEffect.memory && choice.statEffect.memory < 0) newStats.memory -= 1;
          if (choice.statEffect.perception && choice.statEffect.perception < 0) newStats.perception -= 1;
        }
      }

      // Cap stats
      newStats.sanity = Math.max(0, Math.min(10, newStats.sanity));
      newStats.memory = Math.max(0, Math.min(10, newStats.memory));
      newStats.perception = Math.max(0, Math.min(10, newStats.perception));

      const newFragments = [...prev.fragments];
      let fragmentChance = choice.fragmentChance || 0;
      
      // Apply difficulty modifiers to fragment chance
      if (prev.settings.difficulty === 'easy') {
        fragmentChance *= 1.3;
      } else if (prev.settings.difficulty === 'hard') {
        fragmentChance *= 0.7;
      }
      
      if (fragmentChance > 0 && Math.random() < fragmentChance) {
        const fragment: Fragment = {
          name: `Shard of ${prev.currentWarren!.name}`,
          source: prev.currentWarren!.name,
          layer: prev.currentLayer,
          description: `A fragment torn from the ${prev.currentWarren!.type} warren`
        };
        newFragments.push(fragment);
      }

      const newDiscoveries = [...prev.discoveries, ...currentDiscoveries];

      const updatedState = {
        ...prev,
        stats: newStats,
        fragments: newFragments,
        discoveries: newDiscoveries
      };

      // Check for achievements
      const newAchievements = checkAchievements(updatedState);
      if (newAchievements.length > 0) {
        setPendingAchievement(newAchievements[0]);
      }

      return updatedState;
    });
  }, [gameState.currentWarren, currentDiscoveries]);

  const proceedToNextLayer = useCallback(() => {
    setGameState(prev => {
      const newLayer = prev.currentLayer + 1;
      if (newLayer > prev.maxLayers) {
        return { ...prev, isGameOver: true };
      }
      return { ...prev, currentLayer: newLayer };
    });
    
    if (gameState.currentLayer + 1 > gameState.maxLayers) {
      setGamePhase('ending');
      const fragmentCount = gameState.fragments.length;
      const discoveryCount = gameState.discoveries.length;
      let endingText = '';
      
      // Multiple endings based on different criteria
      if (fragmentCount >= 6 && discoveryCount >= 3) {
        endingText = "You have become something more than human.\n\nWith fragments of reality and hidden knowledge burning in your mind, you transcend the boundaries between worlds. The Warrens bow to your will.\n\nYou are no longer a Warrenwalker. You are a Warren Master.";
      } else if (gameState.stats.sanity <= 1) {
        endingText = "Madness is just another country, and you've learned its language.\n\nYou drift through the spaces between thoughts, no longer bound by the crude concept of individual identity. The Warrens welcome their newest permanent resident.";
      } else if (fragmentCount >= 4) {
        endingText = "You have gathered enough fragments to pierce the veil.\n\nThe Warrens release their hold on you. You step back into reality, forever changed by what you've seen beyond the boundaries of the possible.\n\nYou are free... but will you stay that way?";
      } else if (fragmentCount >= 2) {
        endingText = "With precious few fragments clutched in your fading grasp, you make your choice.\n\nYou ascend, leaving the Warrens behind, but part of you remains lost in those impossible spaces. Sometimes, in the corner of your eye, you still see the shadows between worlds.";
      } else {
        endingText = "You drift, fragmentary and incomplete.\n\nThe Warrens have claimed you. You become part of their endless, shifting landscape - another voice in the Memory Warren, another shadow in the darkness.\n\nThe Warrens remember you... as they remember all the lost.";
      }
      
      setCurrentText(endingText);
      setIsTextComplete(false);
    } else {
      enterWarren();
    }
  }, [gameState.currentLayer, gameState.maxLayers, gameState.fragments.length, gameState.discoveries.length, gameState.stats.sanity, enterWarren]);

  const handleTextComplete = useCallback(() => {
    setIsTextComplete(true);
    if (gamePhase === 'intro') {
      setTimeout(() => enterWarren(), 1000);
    } else if (gamePhase === 'warren') {
      setTimeout(() => setShowChoices(true), 500);
    } else if (gamePhase === 'result') {
      if (gameState.settings.autoAdvance) {
        setTimeout(() => {
          setGamePhase('choice');
          setCurrentText('Continue deeper into the Warrens...');
          setIsTextComplete(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setGamePhase('choice');
          setCurrentText('Continue deeper into the Warrens...');
          setIsTextComplete(false);
        }, 2000);
      }
    } else if (gamePhase === 'choice') {
      setTimeout(() => proceedToNextLayer(), 1000);
    }
  }, [gamePhase, enterWarren, proceedToNextLayer, gameState.settings.autoAdvance]);

  const handleSettingsChange = useCallback((newSettings: GameSettings) => {
    setGameState(prev => ({
      ...prev,
      settings: newSettings
    }));
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const warrenStyle = gameState.currentWarren?.style;
  const warrenClass = gameState.currentWarren ? `${gameState.currentWarren.type}-warren` : '';

  return (
    <div className={`game-container ${warrenClass}`} style={{
      backgroundColor: warrenStyle?.backgroundColor || '#000',
      color: warrenStyle?.textColor || '#fff',
      fontFamily: warrenStyle?.fontFamily || 'inherit'
    }}>
      {/* Menu Buttons */}
      <div className="menu-buttons">
        <button className="menu-button" onClick={() => setShowAchievements(true)}>
          🏆
        </button>
        <button className="menu-button" onClick={() => setShowSettings(true)}>
          ⚙️
        </button>
      </div>

      {/* Achievement Notification */}
      {pendingAchievement && (
        <AchievementNotification
          achievement={pendingAchievement}
          onClose={() => setPendingAchievement(null)}
        />
      )}

      {/* Settings Menu */}
      <SettingsMenu
        settings={gameState.settings}
        onSettingsChange={handleSettingsChange}
        onClose={() => setShowSettings(false)}
        isOpen={showSettings}
      />

      {/* Achievements Panel */}
      <AchievementsPanel
        achievements={gameState.achievements}
        onClose={() => setShowAchievements(false)}
        isOpen={showAchievements}
      />

      <div className="game-header">
        <h1 className="game-title">WARRENWALKER</h1>
        {gamePhase !== 'intro' && gameState.settings.showStats && (
          <div className="game-stats">
            <div className="layer-info">Layer {gameState.currentLayer} of {gameState.maxLayers}</div>
            <div className="stats">
              <span>Sanity: {gameState.stats.sanity}</span>
              <span>Memory: {gameState.stats.memory}</span>
              <span>Perception: {gameState.stats.perception}</span>
            </div>
            <div className="fragments">
              Fragments: {gameState.fragments.length} | Discoveries: {gameState.discoveries.length}
            </div>
          </div>
        )}
      </div>

      <div className="game-content">
        <div className="text-display" style={{
          textShadow: warrenStyle?.textShadow || 'none'
        }}>
          <TypeWriter 
            text={currentText} 
            speed={gameState.settings.textSpeed} 
            onComplete={handleTextComplete}
          />
        </div>

        {showChoices && gameState.currentWarren && (
          <div className="choices-container">
            {gameState.currentWarren.choices.map((choice, index) => (
              <button
                key={index}
                className="choice-button"
                onClick={() => makeChoice(index)}
                style={{
                  borderColor: warrenStyle?.textColor || '#fff',
                  color: warrenStyle?.textColor || '#fff'
                }}
              >
                {index + 1}. {choice.text}
              </button>
            ))}
          </div>
        )}

        {gamePhase === 'ending' && isTextComplete && (
          <div className="ending-actions">
            <button className="restart-button" onClick={startNewGame}>
              Begin Another Descent
            </button>
            {gameState.fragments.length > 0 && (
              <div className="fragments-collected">
                <h3>Fragments Collected:</h3>
                <ul>
                  {gameState.fragments.map((fragment, index) => (
                    <li key={index}>
                      {fragment.name} (Layer {fragment.layer})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {gameState.discoveries.length > 0 && (
              <div className="fragments-collected">
                <h3>Discoveries Made:</h3>
                <ul>
                  {gameState.discoveries.map((discovery, index) => (
                    <li key={index}>
                      {discovery.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
