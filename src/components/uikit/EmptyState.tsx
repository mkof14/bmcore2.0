
import type { LucideIcon } from 'lucide-react';
import { Button, type ButtonProps } from './Button';

interface Action extends ButtonProps {
    label: string;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-6">
          {description}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap gap-3 justify-center">
            {primaryAction && (
                <Button {...primaryAction}>{primaryAction.label}</Button>
            )}
            {secondaryAction && (
                <Button variant="secondary" {...secondaryAction}>{secondaryAction.label}</Button>
            )}
        </div>
      )}
    </div>
  );
}
