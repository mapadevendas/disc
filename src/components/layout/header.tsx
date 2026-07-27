'use client';
import Link from 'next/link';
import { ChevronDown, Menu, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navItems, serviceItems, site } from '@/domain/content';
import { useScrollPosition } from '@/hooks/use-scroll-position';

export function Header() {
  const scrolled = useScrollPosition(12);
  const whatsapp = `https://wa.me/${site.whatsapp}?text=Quero%20solicitar%20um%20diagn%C3%B3stico%20gratuito`;
  return <header className={cn('sticky top-0 z-50 transition-all duration-500', scrolled ? 'border-b border-white/10 bg-black/80 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-2xl' : 'border-b border-transparent bg-transparent')}><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6"><Link href="/" className="font-display text-xl font-bold tracking-tight"><span className="text-omega-gold">Ω</span> Omega Performance</Link><nav className="hidden items-center gap-6 text-sm text-white/70 lg:flex">{navItems.map(([label, href]) => label === 'Serviços' ? <div key={href} className="group/mega relative"><Link href={href} className="flex items-center gap-1 hover:text-omega-gold">Serviços <ChevronDown className="h-4 w-4" /></Link><div className="pointer-events-none absolute left-1/2 top-8 w-[760px] -translate-x-1/2 translate-y-3 rounded-[2rem] border border-white/10 bg-black/85 p-4 opacity-0 shadow-glow backdrop-blur-2xl transition group-hover/mega:pointer-events-auto group-hover/mega:translate-y-0 group-hover/mega:opacity-100"><div className="grid grid-cols-2 gap-2">{serviceItems.map((service) => <Link key={service.slug} href={`/${service.slug}`} className="rounded-3xl p-4 transition hover:bg-white/10"><service.icon className="mb-3 h-5 w-5 text-omega-gold" /><p className="font-semibold text-white">{service.title}</p><p className="mt-1 text-xs leading-5 text-white/50">{service.description}</p></Link>)}</div></div></div> : <Link key={href} href={href} className="hover:text-omega-gold">{label}</Link>)}</nav><div className="flex items-center gap-3"><Button asChild size="sm" className="hidden md:inline-flex"><Link href="/contato">Diagnóstico</Link></Button><Button asChild variant="outline" size="sm"><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp</a></Button><Menu className="h-6 w-6 lg:hidden" /></div></div></header>;
}
