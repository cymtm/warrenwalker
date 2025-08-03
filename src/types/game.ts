export interface Warren {
  name: string;
  type: WarrenType;
  description: string;
  choices: Choice[];
  style?: WarrenStyle;
}

export interface Choice {
  text: string;
  result: string;
  fragmentChance?: number;
  statEffect?: StatEffect;
}

export interface StatEffect {
  sanity?: number;
  memory?: number;
  perception?: number;
}

export interface Fragment {
  name: string;
  source: string;
  layer: number;
  description?: string;
}

export interface GameState {
  currentLayer: number;
  maxLayers: number;
  fragments: Fragment[];
  stats: {
    sanity: number;
    memory: number;
    perception: number;
  };
  isGameOver: boolean;
  currentWarren?: Warren;
}

export type WarrenType = 'memory' | 'shadow' | 'pain' | 'dream' | 'entropy';

export interface WarrenStyle {
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
  textShadow?: string;
  animation?: string;
}

export type GamePhase = 'intro' | 'warren' | 'choice' | 'result' | 'ending';