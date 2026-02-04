
import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { clsx } from 'clsx';

const skeleton = tv({
  base: 'animate-pulse bg-gray-200 dark:bg-gray-700',
  variants: {
    variant: {
      text: 'h-4 rounded',
      circle: 'h-16 w-16 rounded-full',
      rect: 'h-16 rounded',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
});

type SkeletonVariants = VariantProps<typeof skeleton>;

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, SkeletonVariants {
  className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(skeleton({ variant }), className)}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export { Skeleton, skeleton };
