import { CalendarDays, MapPin, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/forms/contact-form';
import { site } from '@/domain/content';

export function ContactPage() {
  const whatsapp = `https://wa.me/${site.whatsapp}`;
  return <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div className="grid gap-5"><Card><MessageCircle className="mb-4 h-8 w-8 text-omega-gold" /><h2 className="font-display text-2xl">WhatsApp executivo</h2><p className="mt-3 text-white/60">Fale com o time para alinhar escopo, investimento e próximos passos.</p><Button asChild className="mt-6"><a href={whatsapp} target="_blank" rel="noreferrer">Abrir WhatsApp</a></Button></Card><Card><CalendarDays className="mb-4 h-8 w-8 text-omega-gold" /><h2 className="font-display text-2xl">Calendly</h2><p className="mt-3 text-white/60">Agende uma conversa de diagnóstico em uma janela executiva.</p><Button asChild variant="outline" className="mt-6"><a href={site.calendly} target="_blank" rel="noreferrer">Agendar horário</a></Button></Card><Card><MapPin className="mb-4 h-8 w-8 text-omega-gold" /><h2 className="font-display text-2xl">Mapa</h2><div className="mt-4 grid h-52 place-items-center rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(15,61,86,.55),rgba(255,255,255,.03))]"><p className="text-center text-sm text-white/55">Atendimento remoto no Brasil<br />Operação distribuída</p></div></Card></div><Card><ContactForm /></Card></div>;
}
