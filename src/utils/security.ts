// Security utilities for input validation and sanitization
import { GameSettings } from '../types/game';

export const sanitizeText = (text: string): string => {
  // Basic XSS prevention - escape HTML entities
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validateSettings = (settings: unknown): settings is GameSettings => {
  // Validate settings object structure
  if (!settings || typeof settings !== 'object') return false;
  
  const settingsObj = settings as Record<string, unknown>;
  
  // Validate textSpeed
  if (typeof settingsObj.textSpeed !== 'number' || 
      settingsObj.textSpeed < 1 || 
      settingsObj.textSpeed > 200) return false;
      
  // Validate difficulty
  if (!['easy', 'normal', 'hard'].includes(settingsObj.difficulty as string)) return false;
  
  // Validate boolean fields
  if (typeof settingsObj.autoAdvance !== 'boolean' ||
      typeof settingsObj.showStats !== 'boolean' ||
      typeof settingsObj.soundEnabled !== 'boolean') return false;
      
  return true;
};

export const rateLimitActions = (() => {
  const actions: { [key: string]: number[] } = {};
  const WINDOW_MS = 1000; // 1 second
  const MAX_ACTIONS = 10; // Max 10 actions per second
  
  return (actionKey: string): boolean => {
    const now = Date.now();
    if (!actions[actionKey]) actions[actionKey] = [];
    
    // Clean old timestamps
    actions[actionKey] = actions[actionKey].filter(time => now - time < WINDOW_MS);
    
    // Check rate limit
    if (actions[actionKey].length >= MAX_ACTIONS) return false;
    
    // Record new action
    actions[actionKey].push(now);
    return true;
  };
})();