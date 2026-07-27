'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

export function CalculatorSuite() {
  const [budget, setBudget] = useState(50000);
  const [ticket, setTicket] = useState(2500);
  const [leads, setLeads] = useState(400);
  const [sales, setSales] = useState(40);
  const revenue = sales * ticket;
  const roi = budget ? ((revenue - budget) / budget) * 100 : 0;
  const cac = sales ? budget / sales : 0;
  const cpl = leads ? budget / leads : 0;
  const recommendedGoogleAds = Math.max(10000, revenue * 0.12);
  return <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><Card><h2 className="font-display text-2xl">Entradas</h2><Field label="Orçamento mensal" value={budget} onChange={setBudget} /><Field label="Ticket médio" value={ticket} onChange={setTicket} /><Field label="Leads" value={leads} onChange={setLeads} /><Field label="Vendas" value={sales} onChange={setSales} /></Card><div className="grid gap-4 md:grid-cols-2"><Metric title="Orçamento Google Ads" value={recommendedGoogleAds.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} /><Metric title="ROI" value={`${roi.toFixed(1)}%`} /><Metric title="CAC" value={cac.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} /><Metric title="CPL" value={cpl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} /></div></div>;
}
function Field({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label className="mt-4 grid gap-2 text-sm text-white/60"><span>{label}</span><input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="rounded-2xl border border-white/10 bg-white/[.04] p-4 text-white" /></label>; }
function Metric({ title, value }: { title: string; value: string }) { return <Card><p className="text-sm text-white/45">{title}</p><p className="mt-3 font-display text-4xl text-omega-gold">{value}</p></Card>; }
