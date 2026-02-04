
import React from 'react';
import { Check } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';

const checkbox = tv({
  slots: {
    wrapper: 'flex items-center gap-2 cursor-pointer',
    indicator: 'w-4 h-4 rounded border flex items-center justify-center transition-colors',
    label: 'text-sm',
  },
  variants: {
    color: {
      default: {
        indicator: 'border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 text-white',
        label: 'text-gray-300',
      },
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof checkbox> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((
    { className, color, label, ...props }, ref
) => {
  const { wrapper, indicator, label: labelStyle } = checkbox({ color });

  return (
    <label className={wrapper()}>
      <input ref={ref} type="checkbox" className="sr-only" {...props} />
      <div className={indicator()} data-state={props.checked ? 'checked' : 'unchecked'}>
        {props.checked && <Check className="h-3 w-3" />}
      </div>
      {label && <span className={labelStyle()}>{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };

