'use client';
import { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const answers = [
  { match: 'google', text: 'Google Ads é indicado quando existe demanda ativa. A Omega estrutura campanhas por intenção, margem e payback.' },
  { match: 'meta', text: 'Meta Ads acelera demanda e remarketing com criativos orientados por hipóteses e leitura de coortes.' },
  { match: 'landing', text: 'Nossas landing pages unem design premium, copy, velocidade e tracking para aumentar conversão.' },
  { match: 'crm', text: 'Conectamos mídia ao CRM para medir receita real, CAC, ciclo e origem dos leads.' },
];

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Olá! Sou o assistente da Omega. Posso explicar serviços e coletar seus dados para um diagnóstico.' }]);
  const [input, setInput] = useState('');
  async function send() {
    if (!input.trim()) return;
    const userText = input;
    const found = answers.find((item) => userText.toLowerCase().includes(item.match));
    const response = found?.text || 'Posso te ajudar com Google Ads, Meta Ads, Landing Pages, CRM, Automação e IA. Qual seu investimento mensal atual?';
    setMessages((current) => [...current, { role: 'user', text: userText }, { role: 'assistant', text: response }]);
    setInput('');
    await fetch('/api/ai-chat/lead', { method: 'POST', body: JSON.stringify({ message: userText }) });
  }
  return <div className="fixed bottom-6 left-6 z-50">{open && <div className="mb-4 w-[min(380px,calc(100vw-3rem))] rounded-[2rem] border border-white/10 bg-black/90 p-4 shadow-glow backdrop-blur-2xl"><div className="mb-4 flex items-center justify-between"><p className="font-semibold text-omega-gold">Atendimento IA</p><button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div><div className="max-h-80 space-y-3 overflow-y-auto pr-1">{messages.map((message, index) => <div key={index} className={`rounded-2xl p-3 text-sm ${message.role === 'assistant' ? 'bg-white/[.06] text-white/70' : 'bg-omega-gold text-black'}`}>{message.text}</div>)}</div><div className="mt-4 flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[.04] px-4 outline-none" placeholder="Pergunte sobre serviços" /><Button onClick={send} size="sm" className="h-11 w-11 p-0"><Send className="h-4 w-4" /></Button></div></div>}<Button onClick={() => setOpen((value) => !value)} className="h-12 w-12 p-0" aria-label="Abrir atendimento IA"><Bot className="h-5 w-5" /></Button></div>;
}
