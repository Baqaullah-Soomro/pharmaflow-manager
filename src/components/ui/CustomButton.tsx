
import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        premium: 'bg-gradient-to-r from-medical to-medical-dark text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300',
        outline3D: 'border border-input bg-background shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 active:translate-y-0',
        ghost3D: 'hover:bg-accent/50 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0',
      },
      size: {
        icon: 'h-9 w-9',
        lg: 'h-11 px-8 rounded-md',
        sm: 'h-9 rounded-md px-3',  // Added 'sm' size to match button.tsx
        default: 'h-10 px-4 py-2',  // Added 'default' size to match button.tsx
      },
    },
    defaultVariants: {
      size: "default",
    }
  }
);

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (variant && ['premium', 'outline3D', 'ghost3D'].includes(variant)) {
      return (
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    // For default shadcn button variants
    return <ShadcnButton className={className} size={size} ref={ref} {...props} />;
  }
);
CustomButton.displayName = 'CustomButton';

export { CustomButton };
