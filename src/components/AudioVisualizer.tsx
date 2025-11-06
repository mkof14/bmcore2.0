import { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  type: 'microphone' | 'speaker';
  intensity?: number;
}

export default function AudioVisualizer({ isActive, type, intensity = 0.5 }: AudioVisualizerProps) {
  const barsCount = 8;
  const [barHeights, setBarHeights] = useState<number[]>(Array(barsCount).fill(20));

  useEffect(() => {
    if (!isActive) {
      setBarHeights(Array(barsCount).fill(20));
      return;
    }

    const interval = setInterval(() => {
      setBarHeights(
        Array.from({ length: barsCount }, () =>
          Math.random() * 60 * intensity + 20
        )
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, intensity, barsCount]);

  const getBarColor = (index: number) => {
    if (!isActive) return 'bg-gray-700';

    if (type === 'microphone') {
      const colors = [
        'bg-orange-600',
        'bg-orange-500',
        'bg-orange-400',
        'bg-yellow-500',
        'bg-yellow-400',
        'bg-orange-400',
        'bg-orange-500',
        'bg-orange-600',
      ];
      return colors[index];
    } else {
      const colors = [
        'bg-blue-600',
        'bg-blue-500',
        'bg-cyan-500',
        'bg-teal-400',
        'bg-teal-400',
        'bg-cyan-500',
        'bg-blue-500',
        'bg-blue-600',
      ];
      return colors[index];
    }
  };

  return (
    <div className="flex items-center gap-0.5 h-6">
      {barHeights.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full transition-all duration-100 ${getBarColor(index)} ${
            isActive ? 'shadow-lg' : ''
          }`}
          style={{
            height: `${height}%`,
            boxShadow: isActive
              ? type === 'microphone'
                ? '0 0 8px rgba(251, 146, 60, 0.6)'
                : '0 0 8px rgba(59, 130, 246, 0.6)'
              : 'none',
          }}
        />
      ))}
    </div>
  );
}
