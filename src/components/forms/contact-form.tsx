'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

const schema = z.object({ name: z.string().min(2), email: z.string().email(), company: z.string().min(2), budget: z.string().min(1), message: z.string().min(10) });
type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitSuccessful } } = useForm<FormData>();
  async function onSubmit(data: FormData) {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => setError(issue.path[0] as keyof FormData, { message: issue.message }));
      return;
    }
    await Promise.allSettled([
      fetch(process.env.NEXT_PUBLIC_RD_STATION_ENDPOINT || '/api/rd-station', { method: 'POST', body: JSON.stringify(data) }),
      fetch('/api/hubspot', { method: 'POST', body: JSON.stringify(data) }),
    ]);
  }
  return <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4"><div className="grid gap-4 md:grid-cols-2"><Field label="Nome" error={errors.name?.message}><input {...register('name')} /></Field><Field label="E-mail" error={errors.email?.message}><input {...register('email')} /></Field></div><Field label="Empresa" error={errors.company?.message}><input {...register('company')} /></Field><Field label="Investimento mensal em mídia" error={errors.budget?.message}><select {...register('budget')}><option value="">Selecione</option><option>Até R$ 10 mil</option><option>R$ 10 mil a R$ 50 mil</option><option>Acima de R$ 50 mil</option></select></Field><Field label="Desafio atual" error={errors.message?.message}><textarea {...register('message')} rows={4} /></Field><Button type="submit" size="lg">Solicitar Diagnóstico Gratuito</Button>{isSubmitSuccessful && <p className="text-sm text-omega-gold">Recebemos sua solicitação. Em breve entraremos em contato.</p>}</form>;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactElement }) { return <label className="grid gap-2 text-sm text-white/70"><span>{label}</span>{children && <div className="[&_input]:w-full [&_input]:rounded-2xl [&_input]:border [&_input]:border-white/10 [&_input]:bg-white/5 [&_input]:p-4 [&_select]:w-full [&_select]:rounded-2xl [&_select]:border [&_select]:border-white/10 [&_select]:bg-black [&_select]:p-4 [&_textarea]:w-full [&_textarea]:rounded-2xl [&_textarea]:border [&_textarea]:border-white/10 [&_textarea]:bg-white/5 [&_textarea]:p-4">{children}</div>}{error && <span className="text-xs text-red-300">Campo obrigatório ou inválido.</span>}</label>; }
