'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('# Novo artigo\n\nEscreva um insight premium sobre performance.');
  return <div className="grid gap-6 lg:grid-cols-2"><Card><h2 className="font-display text-2xl">Editor Markdown</h2><input className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[.04] p-4" placeholder="Título SEO" /><div className="mt-4 grid grid-cols-2 gap-3"><input className="rounded-2xl border border-white/10 bg-white/[.04] p-4" placeholder="Categoria" /><input className="rounded-2xl border border-white/10 bg-white/[.04] p-4" placeholder="Tags" /></div><input className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[.04] p-4" placeholder="Imagem destacada URL" /><textarea value={markdown} onChange={(event) => setMarkdown(event.target.value)} className="mt-4 min-h-80 w-full rounded-2xl border border-white/10 bg-white/[.04] p-4 font-mono text-sm" /><Button className="mt-4">Salvar rascunho</Button></Card><Card><h2 className="font-display text-2xl">Preview e SEO automático</h2><div className="prose prose-invert mt-5 max-w-none whitespace-pre-wrap rounded-3xl bg-white/[.035] p-5 text-white/70">{markdown}</div><div className="mt-5 rounded-2xl border border-omega-gold/20 bg-omega-gold/10 p-4 text-sm text-omega-gold">Meta title, description, canonical, OpenGraph e Twitter Cards serão gerados a partir dos campos editoriais.</div></Card></div>;
}
