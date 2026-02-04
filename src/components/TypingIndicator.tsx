import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  text?: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypingIndicator({ text, speed = 30, onComplete }: TypingIndicatorProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (text && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete && text && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  if (!text) {
    return (
      <div className="flex items-center space-x-1.5">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
      </div>
    );
  }

  return (
    <div className="text-sm whitespace-pre-wrap leading-relaxed">
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-4 bg-orange-500 ml-0.5 animate-pulse" />
      )}
    </div>
  );
}
