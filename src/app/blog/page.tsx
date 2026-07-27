import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Section } from '@/components/ui/section';
import { BlogExplorer } from '@/features/blog/blog-explorer';
import { site } from '@/domain/content';

export const metadata: Metadata = { title: 'Blog', description: 'Conteúdos profissionais sobre performance, CRO, analytics e crescimento previsível.', alternates: { canonical: '/blog' }, openGraph: { title: `Blog | ${site.name}`, description: site.description } };

export default function BlogPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'Blog', name: `Blog ${site.name}`, url: `${site.url}/blog` };
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><Section className="pt-28"><Breadcrumb current="Blog" /><div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[.3em] text-omega-gold">Inteligência</p><h1 className="font-display text-5xl font-semibold md:text-7xl">Estratégia, mídia, CRO e dados para líderes de crescimento.</h1></div></Section><Section><BlogExplorer /></Section></main>;
}
