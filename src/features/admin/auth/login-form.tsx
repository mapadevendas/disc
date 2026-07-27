'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  async function login() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setStatus('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'); return; }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` } });
    setStatus(error ? error.message : 'Link mágico enviado para seu e-mail.');
  }
  return <Card className="mx-auto max-w-md"><h1 className="font-display text-3xl">Acesso Admin</h1><p className="mt-3 text-white/60">Autenticação preparada com Supabase Auth via magic link.</p><input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[.04] p-4" placeholder="email@empresa.com" /><Button onClick={login} className="mt-4 w-full">Enviar magic link</Button>{status && <p className="mt-4 text-sm text-omega-gold">{status}</p>}</Card>;
}
