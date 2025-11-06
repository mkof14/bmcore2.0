import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypingIndicator({ text, speed = 30, onComplete }: TypingIndicatorProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className="text-sm whitespace-pre-wrap leading-relaxed">
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-4 bg-orange-500 ml-0.5 animate-pulse" />
      )}
    </div>
  );
}
