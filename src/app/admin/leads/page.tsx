import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';

export default function Page() { return <AdminShell title="Leads"><div className="grid gap-6 md:grid-cols-3">{['Criar','Editar','Publicar'].map((action) => <Card key={action}><h2 className="font-display text-2xl">{action} Leads</h2><p className="mt-3 text-white/60">Módulo administrativo preparado para Supabase, auditoria e workflow editorial.</p></Card>)}</div></AdminShell>; }
