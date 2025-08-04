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
});

TypeWriter.displayName = 'TypeWriter';