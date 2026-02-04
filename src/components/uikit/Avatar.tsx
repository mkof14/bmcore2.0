
import { User } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';

const avatar = tv({
  slots: {
    container: 'relative inline-block',
    image: 'object-cover border-4',
    fallback: 'flex items-center justify-center bg-gradient-to-br border-4',
  },
  variants: {
    size: {
      sm: { image: 'w-16 h-16 rounded-full', fallback: 'w-16 h-16 rounded-full' },
      md: { image: 'w-24 h-24 rounded-full', fallback: 'w-24 h-24 rounded-full' },
      lg: { image: 'w-32 h-32 rounded-full', fallback: 'w-32 h-32 rounded-full' },
    },
    color: {
        default: {
            image: 'border-gray-500/30',
            fallback: 'from-gray-600 to-gray-500 text-white'
        },
        primary: {
            image: 'border-blue-500/30',
            fallback: 'from-blue-600 to-blue-500 text-white'
        },
        accent: {
            image: 'border-orange-500/30',
            fallback: 'from-orange-600 to-orange-500 text-white'
        }
    }
  },
  defaultVariants: {
    size: 'lg',
    color: 'accent'
  }
});

interface AvatarProps extends VariantProps<typeof avatar> {
  src: string | null | undefined;
  alt: string;
  fallbackIcon?: React.ElementType;
  className?: string;
}

export function Avatar({ 
    src, 
    alt, 
    fallbackIcon: FallbackIcon = User, 
    size, 
    color,
    className 
}: AvatarProps) {
  const { container, image, fallback } = avatar({ size, color });
  const iconSizeClass = size === 'lg' ? 'h-16 w-16' : size === 'md' ? 'h-12 w-12' : 'h-8 w-8';

  return (
    <div className={container({
        class: className
    })}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={image()}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <div className={fallback()}>
          <FallbackIcon className={iconSizeClass} />
        </div>
      )}
    </div>
  );
}
