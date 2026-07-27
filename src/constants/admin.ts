import type { AdminMenuItem, CrmCard, CrmStage, DashboardMetric } from '@/types/admin';

export const adminMenu: AdminMenuItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Leads', href: '/admin/leads' },
  { label: 'CRM', href: '/admin/crm' },
  { label: 'Serviços', href: '/admin/servicos' },
  { label: 'Cases', href: '/admin/cases' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Depoimentos', href: '/admin/depoimentos' },
  { label: 'Equipe', href: '/admin/equipe' },
  { label: 'Landing Pages', href: '/admin/landing-pages' },
  { label: 'SEO', href: '/admin/seo' },
  { label: 'Configurações', href: '/admin/configuracoes' },
  { label: 'Integrações', href: '/admin/integracoes' },
];

export const dashboardMetrics: DashboardMetric[] = [
  { label: 'Leads do mês', value: '486', delta: '+18%' },
  { label: 'Taxa de conversão', value: '12.4%', delta: '+3.1%' },
  { label: 'Agendamentos', value: '74', delta: '+22%' },
  { label: 'Receita estimada', value: 'R$ 1.8M', delta: '+31%' },
];

export const leadSources = [
  { source: 'Google Ads', value: 38 }, { source: 'Meta Ads', value: 27 }, { source: 'SEO', value: 16 }, { source: 'Indicação', value: 11 }, { source: 'LinkedIn', value: 8 },
];

export const crmStages: CrmStage[] = ['Novo Lead', 'Contato', 'Reunião', 'Proposta', 'Negociação', 'Cliente', 'Perdido'];

export const initialCrmCards: CrmCard[] = [
  { id: 'lead-1', name: 'Camila Rocha', company: 'Atlas Health', value: 'R$ 42k/mês', stage: 'Novo Lead', tags: ['SaaS', 'Google Ads'], notes: ['Veio pelo diagnóstico interativo.'], tasks: [{ id: 't1', title: 'Enviar benchmark de CAC', due: 'Hoje' }] },
  { id: 'lead-2', name: 'Bruno Dias', company: 'Nexus Commerce', value: 'R$ 120k/mês', stage: 'Reunião', tags: ['E-commerce', 'Meta Ads'], notes: ['Busca redução de payback.'], tasks: [{ id: 't2', title: 'Preparar análise de criativos', due: 'Amanhã' }] },
  { id: 'lead-3', name: 'Helena Martins', company: 'Prisma Education', value: 'R$ 80k/mês', stage: 'Proposta', tags: ['Educação', 'CRM'], notes: ['Precisa integrar RD e HubSpot.'], tasks: [{ id: 't3', title: 'Revisar proposta executiva', due: 'Sexta' }] },
];
