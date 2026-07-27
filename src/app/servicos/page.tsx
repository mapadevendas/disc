import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Card } from '@/components/ui/card';
import { Section, SectionHeading } from '@/components/ui/section';
import { serviceItems, site } from '@/domain/content';

export const metadata: Metadata = { title: 'Serviços', description: 'Serviços premium de performance, mídia paga, CRO, CRM, automação e IA.', alternates: { canonical: '/servicos' }, openGraph: { title: `Serviços | ${site.name}`, description: site.description } };

export default function ServicesPage() {
  return <main><Section className="pt-28"><Breadcrumb current="Serviços" /><div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[.3em] text-omega-gold">Portfólio</p><h1 className="font-display text-5xl font-semibold md:text-7xl">Serviços para operações que precisam escalar com controle.</h1><p className="mx-auto mt-6 max-w-2xl text-white/65">Da geração de demanda ao CRM: uma stack integrada para aumentar receita, reduzir desperdício e acelerar decisão.</p></div></Section><Section><SectionHeading eyebrow="Especialidades" title="Escolha sua alavanca de crescimento" /><div className="grid gap-5 md:grid-cols-4">{serviceItems.map((service) => <Link href={`/${service.slug}`} key={service.slug}><Card className="h-full"><service.icon className="mb-5 h-9 w-9 text-omega-gold" /><p className="text-xs font-bold uppercase tracking-[.24em] text-white/35">{service.eyebrow}</p><h2 className="mt-3 font-display text-2xl">{service.title}</h2><p className="mt-3 text-sm text-white/60">{service.description}</p><p className="mt-6 flex items-center gap-2 text-sm text-omega-gold">Ver serviço <ArrowRight className="h-4 w-4" /></p></Card></Link>)}</div></Section></main>;
}
