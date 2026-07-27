'use client';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const questions = [
  { key: 'segmento', label: 'Segmento', options: ['B2B', 'E-commerce', 'Educação', 'Serviços'] },
  { key: 'faturamento', label: 'Faturamento', options: ['Até R$ 100k', 'R$ 100k a R$ 500k', 'R$ 500k a R$ 2M', 'Acima de R$ 2M'] },
  { key: 'investimento', label: 'Investimento atual', options: ['Até R$ 10k', 'R$ 10k a R$ 50k', 'R$ 50k a R$ 200k', 'Acima de R$ 200k'] },
  { key: 'equipe', label: 'Equipe', options: ['Sem time', 'Marketing interno', 'Vendas estruturado', 'Growth completo'] },
  { key: 'objetivo', label: 'Objetivo', options: ['Gerar leads', 'Reduzir CAC', 'Escalar receita', 'Organizar dados'] },
  { key: 'prazo', label: 'Prazo', options: ['30 dias', '60 dias', '90 dias', '6 meses'] },
];

export function DiagnosticWizard() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const score = useMemo(() => Object.keys(answers).length * 12 + (answers.investimento?.includes('Acima') ? 18 : 0) + (answers.faturamento?.includes('Acima') ? 10 : 0), [answers]);
  async function submit() { await fetch('/api/diagnostic', { method: 'POST', body: JSON.stringify({ answers, score }) }); }
  return <Card><div className="grid gap-6">{questions.map((question) => <div key={question.key}><p className="mb-3 font-semibold">{question.label}</p><div className="grid gap-2 md:grid-cols-4">{question.options.map((option) => <button key={option} onClick={() => setAnswers((current) => ({ ...current, [question.key]: option }))} className={`rounded-2xl border p-3 text-sm transition ${answers[question.key] === option ? 'border-omega-gold bg-omega-gold/10 text-omega-gold' : 'border-white/10 bg-white/[.03] text-white/60 hover:border-white/25'}`}>{option}</button>)}</div></div>)}<div className="rounded-3xl border border-white/10 bg-white/[.035] p-6"><p className="text-sm text-white/50">Pontuação estimada</p><p className="font-display text-5xl text-omega-gold">{Math.min(score, 100)}</p><p className="mt-2 text-white/60">Quanto maior a pontuação, maior a prontidão para escala com mídia paga, CRM e CRO.</p></div><Button onClick={submit}>Salvar diagnóstico no Supabase</Button></div></Card>;
}
