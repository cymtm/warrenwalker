import { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({ 
  text, 
  speed = 30, 
  onComplete, 
  className = '',
  style = {}
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // Reset when text changes
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
};