'use client';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { site } from '@/domain/content';
import { useScrollPosition } from '@/hooks/use-scroll-position';

export function FloatingActions() {
  const scrolled = useScrollPosition(520);
  const whatsapp = `https://wa.me/${site.whatsapp}?text=Quero%20solicitar%20um%20diagn%C3%B3stico%20premium`;
  return <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"><Button asChild size="sm" className="h-12 w-12 p-0 shadow-glow"><a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"><MessageCircle className="h-5 w-5" /></a></Button>{scrolled && <Button variant="outline" size="sm" className="h-12 w-12 p-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo"><ArrowUp className="h-5 w-5" /></Button>}</div>;
}
