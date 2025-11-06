import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface AIAssistantButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function AIAssistantButton({ onClick, isOpen }: AIAssistantButtonProps) {
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setPulse(prev => (prev === 1 ? 1.1 : 1));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .breathing-button {
          animation: breathe 3s ease-in-out infinite;
        }

        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }

        .gradient-bg {
          background: linear-gradient(135deg, #c2410c 0%, #1e3a8a 40%, #991b1b 80%, #ea580c 100%);
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>

      {!isOpen && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-700 via-blue-900 to-red-800 pulse-ring" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-700 via-blue-900 to-red-800 pulse-ring" style={{ animationDelay: '1s' }} />
        </>
      )}

      <button
        onClick={onClick}
        className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'breathing-button'
        } flex items-center justify-center group overflow-hidden`}
        aria-label={isOpen ? 'Close AI Advisor' : 'Open AI Advisor'}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white transition-transform group-hover:rotate-90" />
        ) : (
          <img
            src="/Copilot_20251022_203134.png"
            alt="AI Health Advisor"
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        )}

        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {!isOpen && (
        <div className="absolute bottom-20 right-0 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-xl">
            AI Health Advisor
            <div className="text-xs text-gray-400 mt-1">Ask me anything about your health</div>
          </div>
        </div>
      )}
    </div>
  );
}
