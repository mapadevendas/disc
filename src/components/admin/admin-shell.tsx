import type React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { adminMenu } from '@/constants/admin';
import { Card } from '@/components/ui/card';

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-black"><div className="grid min-h-screen lg:grid-cols-[280px_1fr]"><aside className="border-r border-white/10 bg-white/[.025] p-6"><Link href="/admin/dashboard" className="font-display text-xl font-bold"><span className="text-omega-gold">Ω</span> Admin</Link><div className="mt-8 grid gap-2">{adminMenu.map((item) => <Link key={item.href} href={item.href} className="rounded-2xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/[.06] hover:text-white">{item.label}</Link>)}</div><Card className="mt-8"><ShieldCheck className="mb-3 h-6 w-6 text-omega-gold" /><p className="text-sm text-white/60">Área preparada para autenticação Supabase e políticas RLS.</p></Card></aside><section className="p-6 md:p-10"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-bold uppercase tracking-[.28em] text-omega-gold">Omega Platform</p><h1 className="mt-2 font-display text-4xl font-semibold">{title}</h1></div><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">Auth Supabase ready</span></div>{children}</section></div></main>;
}
