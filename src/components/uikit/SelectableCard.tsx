
import { tv, type VariantProps } from 'tailwind-variants';
import { clsx } from 'clsx';
import React from 'react';
import { CheckCircle } from 'lucide-react';

const card = tv({
  base: 'p-4 rounded-lg border-2 transition-all text-left w-full',
  variants: {
    selected: {
      true: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
      false: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
    },
  },
  defaultVariants: {
    selected: false,
  },
});

type CardVariants = VariantProps<typeof card>;

export interface SelectableCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CardVariants {
  className?: string;
  children: React.ReactNode;
}

const SelectableCard = React.forwardRef<HTMLButtonElement, SelectableCardProps>(({ className, selected, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsx(card({ selected }), className)}
      {...props}
    >
        <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded flex items-center justify-center ${selected ? 'bg-orange-500' : 'border-2 border-gray-300 dark:border-gray-600'}`}>
                {selected && <CheckCircle className="w-4 h-4 text-white" />}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
                {children}
            </span>
        </div>
    </button>
  );
});

SelectableCard.displayName = 'SelectableCard';

export { SelectableCard };
