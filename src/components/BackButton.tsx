import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onNavigate: (page: string) => void;
  label?: string;
  to?: string;
}

export default function BackButton({ onNavigate, label = 'Back', to = 'home' }: BackButtonProps) {
  return (
    <button
      onClick={() => onNavigate(to)}
      className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
