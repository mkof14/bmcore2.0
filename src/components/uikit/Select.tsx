
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const select = tv({
    slots: {
        wrapper: 'relative w-full',
        select: 'w-full appearance-none bg-transparent pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2',
        icon: 'absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none',
    },
    variants: {
        color: {
            default: {
                select: 'border-gray-700/50 focus:ring-orange-500 text-white',
                icon: 'text-gray-400'
            }
        }
    },
    defaultVariants: {
        color: 'default'
    }
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, VariantProps<typeof select> {
  children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>((
    { className, color, children, ...props }, ref
) => {
  const { wrapper, select: selectStyles, icon } = select({ color });

  return (
    <div className={wrapper()}>
      <select
        ref={ref}
        className={selectStyles({
            class: className
        })}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className={icon()} />
    </div>
  );
});

Select.displayName = 'Select';

export { Select };

