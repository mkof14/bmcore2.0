
import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { clsx } from 'clsx';

const input = tv({
  base: 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all',
  variants: {
    state: {
      default: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500',
      error: 'border-red-500 dark:border-red-500 focus:ring-red-500',
      success: 'border-green-500 dark:border-green-500 focus:ring-green-500',
    },
  },
  defaultVariants: {
    state: 'default',
  }
});

type InputVariants = VariantProps<typeof input>;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, InputVariants {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, state, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(input({ state }), className)}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
