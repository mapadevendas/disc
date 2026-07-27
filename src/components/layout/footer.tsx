import Link from 'next/link';
import { Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { navItems, site } from '@/domain/content';

export function Footer() {
  return <footer className="border-t border-white/10 bg-black"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4"><div className="md:col-span-2"><p className="font-display text-2xl font-bold"><span className="text-omega-gold">Ω</span> Omega Performance</p><p className="mt-4 max-w-md text-white/60">Agência premium de tráfego pago, CRO e analytics para negócios que querem crescer com previsibilidade.</p><div className="mt-6 flex gap-4 text-white/60"><Linkedin /><Instagram /><Mail /></div></div><div><h3 className="font-semibold text-omega-gold">Mapa</h3><div className="mt-4 grid gap-2 text-sm text-white/60">{navItems.map(([label, href]) => <Link key={href} href={href} className="hover:text-white">{label}</Link>)}</div></div><div><h3 className="font-semibold text-omega-gold">Contato</h3><p className="mt-4 flex gap-2 text-sm text-white/60"><MapPin className="h-4 w-4" /> Atendimento remoto no Brasil</p><p className="mt-2 text-sm text-white/60">contato@omegaperformance.com.br</p><p className="mt-8 text-xs text-white/40">© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p></div></div></footer>;
}
