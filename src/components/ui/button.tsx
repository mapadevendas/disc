import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-omega-gold disabled:pointer-events-none disabled:opacity-50', {
  variants: { variant: { default: 'bg-gold-gradient text-black hover:scale-[1.02]', outline: 'border border-white/15 bg-white/5 text-white hover:border-omega-gold/60 hover:bg-white/10', ghost: 'text-white hover:text-omega-gold' }, size: { default: 'h-12 px-6', sm: 'h-10 px-4', lg: 'h-14 px-8 text-base' } },
  defaultVariants: { variant: 'default', size: 'default' },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export function Button({ className, variant, size, asChild = false, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));
  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, { className: cn(classes, children.props.className) });
  }
  return <button className={classes} {...props}>{children}</button>;
}
