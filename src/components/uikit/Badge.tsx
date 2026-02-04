
import { tv, type VariantProps } from 'tailwind-variants';

const badge = tv({
  base: 'inline-block px-2 py-1 text-xs font-medium rounded-full border',
  variants: {
    color: {
      default: 'bg-gray-700/30 border-gray-600/30 text-gray-400',
      success: 'bg-green-900/30 border-green-600/30 text-green-400',
      primary: 'bg-blue-900/30 border-blue-600/30 text-blue-400',
      warning: 'bg-yellow-900/30 border-yellow-600/30 text-yellow-400',
      danger: 'bg-red-900/30 border-red-600/30 text-red-400',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badge> {}

export function Badge({ className, color, ...props }: BadgeProps) {
  return <div className={badge({ color, class: className })} {...props} />;
}
