import React from 'react';
import { GameSettings } from '../types/game';

interface SettingsMenuProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  settings,
  onSettingsChange,
  onClose,
  isOpen
}) => {
  if (!isOpen) return null;

  const handleSettingChange = (key: keyof GameSettings, value: string | number | boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="settings-overlay">
      <div className="settings-menu">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <label>Text Speed</label>
            <div className="slider-container">
              <input
                type="range"
                min="10"
                max="100"
                value={settings.textSpeed}
                onChange={(e) => handleSettingChange('textSpeed', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">{settings.textSpeed}ms</span>
            </div>
          </div>

          <div className="setting-group">
            <label>Difficulty</label>
            <select 
              value={settings.difficulty} 
              onChange={(e) => handleSettingChange('difficulty', e.target.value)}
              className="setting-select"
            >
              <option value="easy">Easy (Higher fragment chances)</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard (Lower fragment chances)</option>
            </select>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoAdvance}
                onChange={(e) => handleSettingChange('autoAdvance', e.target.checked)}
              />
              Auto-advance after choices
            </label>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.showStats}
                onChange={(e) => handleSettingChange('showStats', e.target.checked)}
              />
              Show detailed stats
            </label>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              />
              Enable sound effects
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <button className="apply-button" onClick={onClose}>
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};