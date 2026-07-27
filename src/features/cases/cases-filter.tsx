'use client';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { caseStudies } from '@/domain/content';

export function CasesFilter() {
  const [segment, setSegment] = useState('Todos');
  const segments = ['Todos', ...Array.from(new Set(caseStudies.map((item) => item.segment)))];
  const filtered = useMemo(() => segment === 'Todos' ? caseStudies : caseStudies.filter((item) => item.segment === segment), [segment]);
  return <div><div className="mb-8 flex flex-wrap justify-center gap-3">{segments.map((item) => <Button key={item} size="sm" variant={segment === item ? 'default' : 'outline'} onClick={() => setSegment(item)}>{item}</Button>)}</div><div className="grid gap-6 lg:grid-cols-3">{filtered.map((item) => <Card key={item.id}><p className="text-sm text-white/45">{item.segment}</p><h2 className="mt-2 font-display text-2xl">{item.company}</h2><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><span className="text-white/45">Investimento</span><strong className="text-right">{item.investment}</strong><span className="text-white/45">ROI</span><strong className="text-right text-omega-gold">{item.roi}</strong><span className="text-white/45">CAC</span><strong className="text-right">{item.cac}</strong><span className="text-white/45">Leads</span><strong className="text-right">{item.leads}</strong><span className="text-white/45">Faturamento</span><strong className="text-right">{item.revenue}</strong></div><p className="mt-6 text-white/65">“{item.testimonial}”</p><div className="mt-6 grid gap-2">{item.gallery.map((asset) => <div key={asset} className="rounded-2xl border border-white/10 bg-white/[.03] p-3 text-sm text-white/55">{asset}</div>)}</div></Card>)}</div></div>;
}
