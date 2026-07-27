import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Section } from '@/components/ui/section';
import { ContactPage } from '@/features/contact/contact-page';
import { site } from '@/domain/content';

export const metadata: Metadata = { title: 'Contato', description: 'Fale com a Omega Performance por formulário, WhatsApp ou Calendly.', alternates: { canonical: '/contato' }, openGraph: { title: `Contato | ${site.name}`, description: site.description } };

export default function Page() {
  return <main><Section className="pt-28"><Breadcrumb current="Contato" /><div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[.3em] text-omega-gold">Contato</p><h1 className="font-display text-5xl font-semibold md:text-7xl">Vamos avaliar sua operação de aquisição?</h1><p className="mx-auto mt-6 max-w-2xl text-white/65">Conte sobre seu momento e receba um diagnóstico com prioridades para mídia, páginas, CRM e dados.</p></div></Section><Section><ContactPage /></Section></main>;
}
