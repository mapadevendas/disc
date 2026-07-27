'use client';
import { Search, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { blogPosts } from '@/domain/content';

export function BlogExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const categories = ['Todas', ...Array.from(new Set(blogPosts.map((post) => post.category)))];
  const posts = useMemo(() => blogPosts.filter((post) => (category === 'Todas' || post.category === category) && `${post.title} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return <div><div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto]"><label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[.04] px-5 py-3 text-white/60"><Search className="h-4 w-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar artigos" className="w-full bg-transparent outline-none" /></label><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-omega-gold/50 hover:text-white">{item}</button>)}</div></div><div className="grid gap-6 md:grid-cols-3">{posts.map((post) => <Card key={post.slug}><p className="text-xs font-bold uppercase tracking-[.24em] text-omega-gold">{post.category}</p><h2 className="mt-4 font-display text-2xl">{post.title}</h2><p className="mt-3 text-sm text-white/60">{post.excerpt}</p><div className="mt-6 flex items-center justify-between text-xs text-white/40"><span>{post.date} • {post.readTime}</span><Share2 className="h-4 w-4" /></div><div className="mt-6 rounded-2xl bg-white/[.03] p-4 text-sm text-white/50">Relacionados: CRO, Analytics, Growth</div></Card>)}</div></div>;
}
