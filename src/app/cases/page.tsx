import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Section, SectionHeading } from '@/components/ui/section';
import { CasesFilter } from '@/features/cases/cases-filter';
import { site } from '@/domain/content';

export const metadata: Metadata = { title: 'Cases', description: 'Cases de performance com investimento, ROI, CAC, leads e faturamento.', alternates: { canonical: '/cases' }, openGraph: { title: `Cases | ${site.name}`, description: site.description } };

export default function CasesPage() {
  return <main><Section className="pt-28"><Breadcrumb current="Cases" /><div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[.3em] text-omega-gold">Resultados</p><h1 className="font-display text-5xl font-semibold md:text-7xl">Cases com métricas que importam para o board.</h1><p className="mx-auto mt-6 max-w-2xl text-white/65">Filtre por segmento e veja investimento, ROI, CAC, leads, faturamento, depoimentos e galeria executiva.</p></div></Section><Section><CasesFilter /></Section></main>;
}
