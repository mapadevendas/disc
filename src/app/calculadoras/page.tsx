import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Section } from '@/components/ui/section';
import { CalculatorSuite } from '@/features/calculators/calculator-suite';

export const metadata: Metadata = { title: 'Calculadoras de Performance', description: 'Calculadoras de orçamento Google Ads, ROI, CAC e CPL.' };
export default function Page() { return <main><Section className="pt-28"><Breadcrumb current="Calculadoras" /><div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[.3em] text-omega-gold">Calculadoras</p><h1 className="font-display text-5xl font-semibold md:text-7xl">Simule orçamento, ROI, CAC e CPL.</h1></div></Section><Section><CalculatorSuite /></Section></main>; }
