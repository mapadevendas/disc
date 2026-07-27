export type AdminMenuItem = { label: string; href: string };
export type CrmStage = 'Novo Lead' | 'Contato' | 'Reunião' | 'Proposta' | 'Negociação' | 'Cliente' | 'Perdido';
export type CrmTask = { id: string; title: string; due: string };
export type CrmCard = { id: string; name: string; company: string; value: string; stage: CrmStage; tags: string[]; notes: string[]; tasks: CrmTask[] };
export type DashboardMetric = { label: string; value: string; delta: string };
