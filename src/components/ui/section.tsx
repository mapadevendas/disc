import type React from 'react';
import { cn } from '@/lib/utils';

export function Section({ className, id, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section id={id} className={cn('mx-auto w-full max-w-7xl px-6 py-20 md:py-28', className)} {...props} />;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="mx-auto mb-12 max-w-3xl text-center"><p className="mb-3 text-sm font-bold uppercase tracking-[.3em] text-omega-gold">{eyebrow}</p><h2 className="font-display text-3xl font-semibold md:text-5xl">{title}</h2>{description && <p className="mt-5 text-white/65">{description}</p>}</div>;
}
