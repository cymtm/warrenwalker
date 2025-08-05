import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { TypeWriter } from './components/TypeWriter'
import { getRandomWarren } from './data/warrens'
import { GameState, Fragment, GamePhase } from './types/game'
import { achievements } from './data/achievements'

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
  }, [gameState.settings]);

  const enterWarren = useCallback(() => {
    const warren = getRandomWarren();
    setGameState(prev => ({ ...prev, currentWarren: warren }));
    setGamePhase('warren');
    setCurrentText(`[${warren.name}]\n\n${warren.description}`);
    setShowChoices(false);
    setIsTextComplete(false);
  }, []);

  const makeChoice = useCallback((choiceIndex: number) => {
    if (!gameState.currentWarren) return;

    const choice = gameState.currentWarren.choices[choiceIndex];
    setGamePhase('result');
    setCurrentText(choice.result);
    setShowChoices(false);
    setIsTextComplete(false);

    // Apply stat effects and potentially collect fragment
    setGameState(prev => {
      const newStats = { ...prev.stats };
      if (choice.statEffect) {
        if (choice.statEffect.sanity) newStats.sanity += choice.statEffect.sanity;
        if (choice.statEffect.memory) newStats.memory += choice.statEffect.memory;
        if (choice.statEffect.perception) newStats.perception += choice.statEffect.perception;
      }

      const newFragments = [...prev.fragments];
      if (choice.fragmentChance && Math.random() < choice.fragmentChance) {
        const fragment: Fragment = {
          name: `Shard of ${prev.currentWarren!.name}`,
          source: prev.currentWarren!.name,
          layer: prev.currentLayer,
          description: `A fragment torn from the ${prev.currentWarren!.type} warren`
        };
        newFragments.push(fragment);
      }

      return {
        ...prev,
        stats: newStats,
        fragments: newFragments
      };
    });
  }, [gameState.currentWarren]);

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
      let endingText = '';
      
      if (fragmentCount >= 4) {
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
  }, [gameState.currentLayer, gameState.maxLayers, gameState.fragments.length, enterWarren]);

  const handleTextComplete = useCallback(() => {
    setIsTextComplete(true);
    if (gamePhase === 'intro') {
      setTimeout(() => enterWarren(), 1000);
    } else if (gamePhase === 'warren') {
      setTimeout(() => setShowChoices(true), 500);
    } else if (gamePhase === 'result') {
      setTimeout(() => {
        setGamePhase('choice');
        setCurrentText('Continue deeper into the Warrens...');
        setIsTextComplete(false);
      }, 2000);
    } else if (gamePhase === 'choice') {
      setTimeout(() => proceedToNextLayer(), 1000);
    }
  }, [gamePhase, enterWarren, proceedToNextLayer]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const warrenStyle = gameState.currentWarren?.style;

  return (
    <div className="game-container" style={{
      backgroundColor: warrenStyle?.backgroundColor || '#000',
      color: warrenStyle?.textColor || '#fff',
      fontFamily: warrenStyle?.fontFamily || 'inherit'
    }}>
      <div className="game-header">
        <h1 className="game-title">WARRENWALKER</h1>
        {gamePhase !== 'intro' && (
          <div className="game-stats">
            <div className="layer-info">Layer {gameState.currentLayer} of {gameState.maxLayers}</div>
            <div className="stats">
              <span>Sanity: {gameState.stats.sanity}</span>
              <span>Memory: {gameState.stats.memory}</span>
              <span>Perception: {gameState.stats.perception}</span>
            </div>
            <div className="fragments">Fragments: {gameState.fragments.length}</div>
          </div>
        )}
      </div>

      <div className="game-content">
        <div className="text-display" style={{
          textShadow: warrenStyle?.textShadow || 'none'
        }}>
          <TypeWriter 
            text={currentText} 
            speed={50} 
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
          </div>
        )}
      </div>
    </div>
  )
}

export default App
