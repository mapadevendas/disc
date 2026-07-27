import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ current }: { current: string }) {
  return <nav aria-label="Breadcrumb" className="mb-8 flex items-center justify-center gap-2 text-sm text-white/45"><Link href="/" className="hover:text-omega-gold">Home</Link><ChevronRight className="h-4 w-4" /><span className="text-white/75">{current}</span></nav>;
}
