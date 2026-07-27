import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Section } from '@/components/ui/section';
import { DiagnosticWizard } from '@/features/diagnostic/diagnostic-wizard';

export const metadata: Metadata = { title: 'Diagnóstico Interativo', description: 'Diagnóstico inteligente para avaliar prontidão de escala em tráfego pago.' };
export default function Page() { return <main><Section className="pt-28"><Breadcrumb current="Diagnóstico" /><div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[.3em] text-omega-gold">Diagnóstico</p><h1 className="font-display text-5xl font-semibold md:text-7xl">Descubra sua prontidão para escala.</h1></div></Section><Section><DiagnosticWizard /></Section></main>; }
