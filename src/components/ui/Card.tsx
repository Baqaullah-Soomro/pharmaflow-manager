
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'subtle';
  hover?: boolean;
}

const Card = ({
  className,
  variant = 'default',
  hover = false,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        variant === 'default' && 'bg-card shadow-sm border border-border/50',
        variant === 'glass' && 'glass-card',
        variant === 'subtle' && 'bg-muted/50',
        hover && 'transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = ({ className, children, ...props }: CardHeaderProps) => {
  return (
    <div
      className={cn('p-6 flex flex-col space-y-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = ({ className, children, ...props }: CardContentProps) => {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = ({ className, children, ...props }: CardFooterProps) => {
  return (
    <div
      className={cn('p-6 pt-0 flex items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = ({ className, children, ...props }: CardTitleProps) => {
  return (
    <h3
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = ({
  className,
  children,
  ...props
}: CardDescriptionProps) => {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
};

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
};
