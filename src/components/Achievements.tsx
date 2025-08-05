import React from 'react';
import { Achievement } from '../types/game';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="achievement-notification">
      <div className="achievement-icon">🏆</div>
      <div className="achievement-content">
        <div className="achievement-title">Achievement Unlocked!</div>
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-description">{achievement.description}</div>
      </div>
    </div>
  );
};

interface AchievementsPanelProps {
  achievements: Achievement[];
  onClose: () => void;
  isOpen: boolean;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  achievements,
  onClose,
  isOpen
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const visibleAchievements = achievements.filter(a => a.unlocked || !a.hidden);

  return (
    <div className="achievements-overlay">
      <div className="achievements-panel">
        <div className="achievements-header">
          <h2>Achievements</h2>
          <div className="achievement-progress">
            {unlockedCount} / {achievements.length} Unlocked
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="achievements-list">
          {visibleAchievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon-small">
                {achievement.unlocked ? '🏆' : '🔒'}
              </div>
              <div className="achievement-details">
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-description">
                  {achievement.unlocked ? achievement.description : '???'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};