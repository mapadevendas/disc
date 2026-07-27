import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Card } from '@/components/ui/card';
import { Section, SectionHeading } from '@/components/ui/section';
import { reasons, site } from '@/domain/content';

export const metadata: Metadata = { title: 'Sobre', description: 'Conheça a Omega Performance, agência boutique de performance para operações premium.', alternates: { canonical: '/sobre' } };

export default function AboutPage() {
  return <main><Section className="pt-28"><Breadcrumb current="Sobre" /><div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[.3em] text-omega-gold">{site.name}</p><h1 className="font-display text-5xl font-semibold md:text-7xl">Senioridade, estética e dados para negócios que compram crescimento.</h1><p className="mx-auto mt-6 max-w-2xl text-white/65">Somos uma agência boutique que combina estratégia executiva, mídia paga, CRO e analytics para empresas que precisam de previsibilidade.</p></div></Section><Section><SectionHeading eyebrow="Princípios" title="Como pensamos performance premium" /><div className="grid gap-6 md:grid-cols-3">{reasons.map((item) => <Card key={item.title}><item.icon className="mb-5 h-8 w-8 text-omega-gold" /><h2 className="font-display text-2xl">{item.title}</h2><p className="mt-3 text-white/60">{item.description}</p></Card>)}</div></Section></main>;
}
