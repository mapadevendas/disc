import type React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.045] p-6 shadow-[0_24px_90px_rgba(0,0,0,.45)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-omega-gold/35 hover:bg-white/[.07]', className)} {...props} />;
}
