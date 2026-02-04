
import { tv, type VariantProps } from 'tailwind-variants';
import { clsx } from 'clsx';
import React from 'react';
import { Spinner } from './Spinner';

const button = tv({
  base: 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    variant: {
      primary: 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
      ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
      destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      info: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    },
    size: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    },
    isLoading: {
        true: 'relative text-transparent',
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Omit<ButtonVariants, 'isLoading'> {
  className?: string;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, isLoading, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsx(button({ variant, size, isLoading }), className)}
      {...props}
      disabled={isLoading || props.disabled}
    >
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="sm" className="text-white"/>
            </div>
        )}
      <span className={isLoading ? 'invisible' : ''}>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';

export { Button, button };


