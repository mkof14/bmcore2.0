interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'avatar' | 'button';
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export default function SkeletonLoader({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  className = ''
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded';

  const variantStyles = {
    text: 'h-4 rounded',
    card: 'h-48 rounded-xl',
    avatar: 'rounded-full',
    button: 'h-10 rounded-lg'
  };

  const getHeight = () => {
    if (height) return height;
    if (variant === 'text') return '1rem';
    if (variant === 'card') return '12rem';
    if (variant === 'avatar') return width;
    if (variant === 'button') return '2.5rem';
    return '1rem';
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${variantStyles[variant]} ${className}`}
          style={{ width, height: getHeight() }}
        />
      ))}
    </>
  );
}
