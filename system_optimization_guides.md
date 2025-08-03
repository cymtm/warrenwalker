# System Optimization Guides for Vite + React + TypeScript Applications

This document provides comprehensive optimization strategies for React applications built with Vite, with specific focus on game applications like WARRENWALKER.

## Table of Contents

1. [Build & Bundle Optimization](#build--bundle-optimization)
2. [Runtime Performance](#runtime-performance)
3. [Memory Management](#memory-management)
4. [Development Workflow](#development-workflow)
5. [Asset Optimization](#asset-optimization)
6. [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
7. [CSS & Styling Optimization](#css--styling-optimization)
8. [Game-Specific Optimizations](#game-specific-optimizations)
9. [Production Deployment](#production-deployment)
10. [Monitoring & Debugging](#monitoring--debugging)

## Build & Bundle Optimization

### Vite Configuration Enhancements

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for better development experience
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
      // Remove prop-types in production
      babel: {
        plugins: process.env.NODE_ENV === 'production' ? ['babel-plugin-react-remove-properties'] : []
      }
    }),
    // Bundle analyzer for production builds
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ],
  
  build: {
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          vendor: ['react', 'react-dom'],
          // Game-specific chunks
          gameData: ['./src/data/warrens'],
          gameTypes: ['./src/types/game']
        }
      }
    },
    // Enable source maps for debugging in production (optional)
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Set reasonable chunk size limits
    chunkSizeWarningLimit: 1000
  },
  
  // Development optimizations
  server: {
    // Enable HMR for better development experience
    hmr: true,
    // Optimize dependency pre-bundling
    force: true
  },
  
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Enable esbuild optimizations
  esbuild: {
    // Remove unused imports
    treeShaking: true,
    // Optimize target for modern browsers
    target: 'es2020'
  }
})
```

### Package.json Scripts Enhancement

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc -b && vite build",
    "build:analyze": "ANALYZE=true npm run build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "optimize:images": "imagemin src/assets/images/* --out-dir=src/assets/images/optimized"
  }
}
```

## Runtime Performance

### React Component Optimization

#### 1. Memoization Strategies

```typescript
// Optimize TypeWriter component
import { useState, useEffect, useCallback, memo } from 'react';

interface TypeWriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TypeWriter = memo<TypeWriterProps>(({ 
  text, 
  speed = 30, 
  onComplete, 
  className = '',
  style = {}
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize the completion callback
  const handleComplete = useCallback(() => {
    if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [onComplete, currentIndex, text.length]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      handleComplete();
    }
  }, [currentIndex, text, speed, handleComplete]);

  // Reset when text changes - optimize with useMemo if text is complex
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span className={className} style={style}>
      {displayText}
      {currentIndex < text.length && (
        <span className="cursor">|</span>
      )}
    </span>
  );
});

TypeWriter.displayName = 'TypeWriter';
```

#### 2. State Management Optimization

```typescript
// Optimize App component state management
import { useState, useEffect, useCallback, useMemo, useReducer } from 'react'

// Use reducer for complex state management
interface GameAction {
  type: 'START_GAME' | 'ENTER_WARREN' | 'MAKE_CHOICE' | 'NEXT_LAYER' | 'GAME_OVER';
  payload?: any;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        currentLayer: 1,
        maxLayers: 6,
        fragments: [],
        stats: { sanity: 5, memory: 5, perception: 5 },
        isGameOver: false
      };
    case 'ENTER_WARREN':
      return { ...state, currentWarren: action.payload };
    case 'MAKE_CHOICE':
      return {
        ...state,
        stats: action.payload.newStats,
        fragments: action.payload.newFragments
      };
    case 'NEXT_LAYER':
      return { ...state, currentLayer: state.currentLayer + 1 };
    case 'GAME_OVER':
      return { ...state, isGameOver: true };
    default:
      return state;
  }
}

// Memoize expensive calculations
const memoizedWarrenStyles = useMemo(() => ({
  backgroundColor: warrenStyle?.backgroundColor || '#000',
  color: warrenStyle?.textColor || '#fff',
  fontFamily: warrenStyle?.fontFamily || 'inherit'
}), [warrenStyle]);
```

### Virtual DOM Optimization

#### 1. Key Props for Lists

```typescript
// Optimize fragment rendering
{gameState.fragments.map((fragment, index) => (
  <li key={`${fragment.source}-${fragment.layer}-${index}`}>
    {fragment.name} (Layer {fragment.layer})
  </li>
))}
```

#### 2. Conditional Rendering Optimization

```typescript
// Use early returns to avoid unnecessary renders
if (!showChoices || !gameState.currentWarren) {
  return null;
}

// Optimize conditional className application
const choiceButtonClass = useMemo(() => 
  `choice-button ${warrenStyle?.type ? `${warrenStyle.type}-warren` : ''}`,
  [warrenStyle?.type]
);
```

## Memory Management

### Game State Optimization

```typescript
// Implement state cleanup for memory efficiency
const useGameMemoryOptimization = () => {
  useEffect(() => {
    // Clean up old game states when starting new game
    const cleanupOldStates = () => {
      // Clear any cached game data
      if (window.gameHistory && window.gameHistory.length > 5) {
        window.gameHistory = window.gameHistory.slice(-5);
      }
    };

    return cleanupOldStates;
  }, []);

  // Debounced state saves to prevent memory leaks
  const debouncedSaveState = useCallback(
    debounce((state: GameState) => {
      sessionStorage.setItem('gameState', JSON.stringify(state));
    }, 1000),
    []
  );

  return { debouncedSaveState };
};
```

### Event Listener Cleanup

```typescript
// Ensure proper cleanup of event listeners
useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      // Handle escape key
    }
  };

  document.addEventListener('keydown', handleKeyPress);
  
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
}, []);
```

### Timeout and Interval Management

```typescript
// Custom hook for safe timeout management
const useSafeTimeout = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setSafeTimeout = useCallback((callback: () => void, delay: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return setSafeTimeout;
};
```

## Development Workflow

### Hot Module Replacement (HMR) Optimization

```typescript
// Enable HMR for game data
if (import.meta.hot) {
  import.meta.hot.accept('./data/warrens', (newModule) => {
    if (newModule) {
      // Hot reload warren data without losing game state
      console.log('Warren data updated');
    }
  });
}
```

### ESLint Configuration for Performance

```javascript
// eslint.config.js
export default [
  {
    rules: {
      // Performance-related rules
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
];
```

### TypeScript Performance Configuration

```json
// tsconfig.json optimizations
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./tsconfig.tsbuildinfo",
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

## Asset Optimization

### Image Optimization

```typescript
// Lazy load images with intersection observer
const useImageLazyLoading = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    
    if (imageRef && imageSrc !== src) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src, imageSrc]);

  return [imageSrc, setImageRef] as const;
};
```

### Font Optimization

```css
/* Optimize font loading */
@font-face {
  font-family: 'Courier New';
  font-display: swap; /* Improve loading performance */
  /* Preload critical fonts */
}
```

## Code Splitting & Lazy Loading

### Route-Based Code Splitting

```typescript
// Implement lazy loading for game phases
import { lazy, Suspense } from 'react';

const GameIntro = lazy(() => import('./components/GameIntro'));
const WarrenExplorer = lazy(() => import('./components/WarrenExplorer'));
const GameEnding = lazy(() => import('./components/GameEnding'));

// Use with suspense
<Suspense fallback={<div className="loading">Loading...</div>}>
  {gamePhase === 'intro' && <GameIntro />}
  {gamePhase === 'warren' && <WarrenExplorer />}
  {gamePhase === 'ending' && <GameEnding />}
</Suspense>
```

### Dynamic Imports for Game Data

```typescript
// Load warren data dynamically
const loadWarrenData = async (warrenType: WarrenType) => {
  switch (warrenType) {
    case 'memory':
      return (await import('./data/memoryWarrens')).memoryWarrens;
    case 'shadow':
      return (await import('./data/shadowWarrens')).shadowWarrens;
    case 'pain':
      return (await import('./data/painWarrens')).painWarrens;
    case 'dream':
      return (await import('./data/dreamWarrens')).dreamWarrens;
    case 'entropy':
      return (await import('./data/entropyWarrens')).entropyWarrens;
    default:
      return (await import('./data/warrens')).warrens;
  }
};
```

## CSS & Styling Optimization

### CSS-in-JS Performance

```typescript
// Use CSS modules or styled-components with performance optimizations
import styles from './App.module.css';

// Minimize style recalculations
const staticStyles = useMemo(() => ({
  container: {
    minHeight: '100vh',
    padding: '2rem',
    transition: 'all 0.8s ease-in-out'
  }
}), []);
```

### Animation Optimization

```css
/* Use GPU acceleration for animations */
.choice-button {
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}

/* Optimize keyframe animations */
@keyframes entropyGlitch {
  0% { transform: translate3d(0, 0, 0); }
  10% { transform: translate3d(-1px, -1px, 0); }
  20% { transform: translate3d(1px, 1px, 0); }
  /* ... rest of keyframes */
  100% { transform: translate3d(0, 0, 0); }
}

/* Use contain for better performance */
.game-container {
  contain: layout style paint;
}
```

### Critical CSS Inlining

```html
<!-- index.html optimizations -->
<style>
  /* Inline critical CSS for above-the-fold content */
  body { margin: 0; background: #000; font-family: 'Courier New', monospace; }
  .game-title { font-size: 2.5rem; text-align: center; color: #fff; }
</style>
```

## Game-Specific Optimizations

### State Persistence

```typescript
// Implement efficient save/load system
const useGamePersistence = () => {
  const saveGame = useCallback((gameState: GameState) => {
    try {
      const serializedState = JSON.stringify({
        ...gameState,
        timestamp: Date.now()
      });
      localStorage.setItem('warrenwalker_save', serializedState);
    } catch (error) {
      console.warn('Failed to save game state:', error);
    }
  }, []);

  const loadGame = useCallback((): GameState | null => {
    try {
      const saved = localStorage.getItem('warrenwalker_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate saved state structure
        if (parsed.currentLayer && parsed.stats) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load game state:', error);
    }
    return null;
  }, []);

  return { saveGame, loadGame };
};
```

### Text Animation Performance

```typescript
// Optimize TypeWriter for better performance
const useOptimizedTypeWriter = (text: string, speed: number = 30) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    let currentIndex = 0;
    setDisplayText('');
    setIsComplete(false);

    const animateText = () => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        currentIndex++;
        animationRef.current = setTimeout(animateText, speed);
      } else {
        setIsComplete(true);
      }
    };

    animationRef.current = setTimeout(animateText, speed);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [text, speed]);

  return { displayText, isComplete };
};
```

### Warren Data Optimization

```typescript
// Optimize warren data structure for better performance
interface OptimizedWarren extends Omit<Warren, 'choices'> {
  choices: Choice[];
  // Pre-computed values for performance
  choiceCount: number;
  hasFragmentChance: boolean;
  maxStatEffect: number;
}

// Pre-process warren data at build time
export const optimizedWarrens: OptimizedWarren[] = warrens.map(warren => ({
  ...warren,
  choiceCount: warren.choices.length,
  hasFragmentChance: warren.choices.some(choice => choice.fragmentChance && choice.fragmentChance > 0),
  maxStatEffect: Math.max(...warren.choices.map(choice => 
    Math.max(...Object.values(choice.statEffect || {}))
  ))
}));
```

## Production Deployment

### Build Output Optimization

```bash
# Build analysis commands
npm run build:analyze  # Analyze bundle size
npm run build && npx serve dist  # Test production build locally

# Compress assets
gzip -k dist/assets/*.js
gzip -k dist/assets/*.css
```

### Environment Variable Management

```typescript
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_ANALYTICS_ID: string;
  readonly VITE_DEBUG_MODE: boolean;
}

// Use environment variables for optimization flags
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
```

### Service Worker for Caching

```typescript
// Register service worker for better caching
if ('serviceWorker' in navigator && isProduction) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

## Monitoring & Debugging

### Performance Monitoring

```typescript
// Add performance monitoring
const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor component render times
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`${entry.name}: ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);

  const measurePerformance = useCallback((name: string, fn: () => void) => {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }, []);

  return { measurePerformance };
};
```

### Error Boundary for Debugging

```typescript
// Error boundary component
class GameErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean; error?: Error }
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game error:', error, errorInfo);
    // Send to monitoring service in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong in the Warrens...</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
          <button onClick={() => window.location.reload()}>
            Restart Journey
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Debug Tools

```typescript
// Development debug tools
if (isDevelopment) {
  // Add game state to window for debugging
  (window as any).gameDebug = {
    getState: () => gameState,
    setState: setGameState,
    triggerWarren: (warrenType: WarrenType) => {
      const warren = warrens.find(w => w.type === warrenType);
      if (warren) setGameState(prev => ({ ...prev, currentWarren: warren }));
    },
    addFragment: (name: string) => {
      setGameState(prev => ({
        ...prev,
        fragments: [...prev.fragments, {
          name,
          source: 'debug',
          layer: prev.currentLayer
        }]
      }));
    }
  };
}
```

## Performance Checklist

### Development
- [ ] Enable React DevTools Profiler
- [ ] Use TypeScript strict mode
- [ ] Implement proper key props for lists
- [ ] Memoize expensive calculations
- [ ] Use useCallback for event handlers
- [ ] Implement proper cleanup in useEffect

### Build & Bundle
- [ ] Analyze bundle size with visualizer
- [ ] Implement code splitting for routes
- [ ] Optimize chunk splitting strategy
- [ ] Remove console.log in production
- [ ] Enable tree shaking
- [ ] Minify CSS and JS

### Runtime Performance
- [ ] Minimize re-renders with React.memo
- [ ] Use proper dependency arrays in hooks
- [ ] Implement virtual scrolling for long lists
- [ ] Optimize image loading with lazy loading
- [ ] Use GPU acceleration for animations
- [ ] Implement proper error boundaries

### Memory Management
- [ ] Clean up event listeners
- [ ] Cancel ongoing requests on unmount
- [ ] Implement proper timeout cleanup
- [ ] Monitor memory leaks in DevTools
- [ ] Use WeakMap/WeakSet where appropriate

### Production
- [ ] Enable gzip compression
- [ ] Implement caching strategy
- [ ] Monitor Core Web Vitals
- [ ] Set up error tracking
- [ ] Implement performance budgets
- [ ] Test on various devices and connections

## Conclusion

These optimization strategies will help ensure your React + Vite + TypeScript game runs efficiently across different devices and network conditions. Regular profiling and monitoring will help identify performance bottlenecks and guide further optimizations.

Remember to:
1. Profile before optimizing to identify actual bottlenecks
2. Measure the impact of optimizations
3. Balance optimization with code maintainability
4. Test on various devices and network conditions
5. Monitor performance in production

The key to successful optimization is to measure, optimize, and measure again. Focus on the optimizations that provide the most significant impact for your specific use case.