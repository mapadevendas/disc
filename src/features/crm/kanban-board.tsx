'use client';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { crmStages, initialCrmCards } from '@/constants/admin';
import type { CrmCard, CrmStage } from '@/types/admin';

export function KanbanBoard() {
  const [cards, setCards] = useState<CrmCard[]>(initialCrmCards);
  const grouped = useMemo(() => crmStages.map((stage) => ({ stage, cards: cards.filter((card) => card.stage === stage) })), [cards]);
  function moveCard(id: string, stage: CrmStage) { setCards((current) => current.map((card) => card.id === id ? { ...card, stage } : card)); }
  return <div className="overflow-x-auto pb-4"><div className="grid min-w-[1180px] grid-cols-7 gap-4">{grouped.map((column) => <div key={column.stage} onDragOver={(event) => event.preventDefault()} onDrop={(event) => moveCard(event.dataTransfer.getData('text/plain'), column.stage)} className="rounded-[1.75rem] border border-white/10 bg-white/[.025] p-3"><div className="mb-4 flex items-center justify-between px-2"><h2 className="text-sm font-semibold text-white/75">{column.stage}</h2><span className="rounded-full bg-white/10 px-2 py-1 text-xs">{column.cards.length}</span></div><div className="grid gap-3">{column.cards.map((card) => <Card key={card.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', card.id)} className="cursor-grab p-4 active:cursor-grabbing"><p className="font-semibold">{card.name}</p><p className="text-sm text-white/45">{card.company}</p><p className="mt-3 text-omega-gold">{card.value}</p><div className="mt-3 flex flex-wrap gap-2">{card.tags.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/60">{tag}</span>)}</div><div className="mt-4 rounded-2xl bg-white/[.04] p-3 text-xs text-white/55"><strong>Observações</strong><p className="mt-1">{card.notes[0]}</p></div><div className="mt-3 grid gap-2">{card.tasks.map((task) => <div key={task.id} className="flex items-center gap-2 text-xs text-white/55"><Plus className="h-3 w-3 text-omega-gold" />{task.title} • {task.due}</div>)}</div></Card>)}</div></div>)}</div></div>;
}
