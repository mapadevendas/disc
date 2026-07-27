import { Bot, BrainCircuit, Building2, ChartNoAxesCombined, DatabaseZap, FileText, Layers3, LineChart, MessageCircle, Rocket, Search, ShieldCheck, Sparkles, Target, Workflow } from 'lucide-react';
import { siteConfig } from '@/config/site';
import type { BlogPost, CaseStudy, Service } from '@/types/content';

export const site = siteConfig;

export const navItems = [
  ['Home', '/'], ['Sobre', '/sobre'], ['Serviços', '/servicos'], ['Cases', '/cases'], ['Blog', '/blog'], ['Diagnóstico', '/diagnostico'], ['Calculadoras', '/calculadoras'], ['Contato', '/contato'],
] as const;

export const serviceItems: Service[] = [
  { slug: 'google-ads', title: 'Google Ads', eyebrow: 'Alta intenção', description: 'Search, Performance Max, YouTube e remarketing para capturar demanda com eficiência e previsibilidade.', icon: Search, benefits: ['Arquitetura por intenção e margem', 'Rotina de negativação e escala', 'Dashboards de receita e CAC'], process: ['Auditoria de conta e tracking', 'Reestruturação por estágio de funil', 'Experimentação semanal', 'Escala por eficiência marginal'], faqs: [['Quando Google Ads é ideal?', 'Quando existe demanda ativa e clareza de ticket, margem e conversão.'], ['Vocês operam contas existentes?', 'Sim, com auditoria, plano de migração e governança.']] },
  { slug: 'meta-ads', title: 'Meta Ads', eyebrow: 'Demanda e escala', description: 'Campanhas para Facebook e Instagram com sistema de criativos, testes e remarketing de alta qualidade.', icon: Target, benefits: ['Framework de criativos por hipótese', 'Segmentação orientada por dados', 'Remarketing com cadência premium'], process: ['Mapeamento de personas e ofertas', 'Matriz de criativos', 'Testes controlados', 'Escala com leitura de coortes'], faqs: [['Vocês criam os anúncios?', 'Criamos copies, direção criativa e roteiros para produção.'], ['Trabalham com e-commerce?', 'Sim, incluindo catálogo, Advantage+ e funis híbridos.']] },
  { slug: 'landing-pages', title: 'Landing Pages', eyebrow: 'CRO premium', description: 'Páginas rápidas, persuasivas e visualmente sofisticadas para transformar tráfego em oportunidade qualificada.', icon: Layers3, benefits: ['Design autoral e responsivo', 'Copy de conversão', 'Performance e tracking'], process: ['Pesquisa de oferta', 'Wireframe e narrativa', 'UI premium', 'Testes e otimização'], faqs: [['As páginas são rápidas?', 'Sim, priorizamos Core Web Vitals e assets otimizados.'], ['Inclui integração?', 'Preparamos eventos, CRM e ferramentas de automação.']] },
  { slug: 'seo', title: 'SEO', eyebrow: 'Crescimento composto', description: 'Estratégia orgânica, conteúdo e SEO técnico para reduzir dependência de mídia e aumentar autoridade.', icon: LineChart, benefits: ['Arquitetura de conteúdo', 'SEO técnico', 'Clusters por intenção'], process: ['Diagnóstico técnico', 'Pesquisa semântica', 'Calendário editorial', 'Otimização contínua'], faqs: [['SEO substitui tráfego pago?', 'Não; ele complementa e reduz CAC no médio prazo.'], ['Vocês produzem conteúdo?', 'Estruturamos pautas, briefs e governança editorial.']] },
  { slug: 'automacao', title: 'Automação', eyebrow: 'Operação escalável', description: 'Fluxos de nutrição, alertas e integrações para acelerar resposta comercial e reduzir perda de leads.', icon: Workflow, benefits: ['SLA comercial automatizado', 'Nutrição multicanal', 'Integrações com CRM'], process: ['Mapeamento do funil', 'Desenho de fluxos', 'Integração de ferramentas', 'Monitoramento de conversões'], faqs: [['Integra com RD Station?', 'Sim, o projeto já está preparado para RD Station.'], ['Automação ajuda vendas?', 'Sim, reduz tempo de resposta e melhora priorização.']] },
  { slug: 'crm', title: 'CRM', eyebrow: 'Receita rastreável', description: 'Pipeline, campos, fontes e relatórios para conectar mídia paga a receita real.', icon: DatabaseZap, benefits: ['Pipeline por etapa', 'UTMs preservadas', 'Relatórios de receita'], process: ['Auditoria do CRM', 'Modelagem de dados', 'Integração com mídia', 'Rotina de qualidade'], faqs: [['Qual CRM vocês usam?', 'Preparamos HubSpot, RD CRM ou stack existente.'], ['Dá para medir ROI real?', 'Sim, quando há disciplina de dados entre marketing e vendas.']] },
  { slug: 'ia', title: 'IA', eyebrow: 'Performance intelligence', description: 'Uso prático de IA para análise, priorização de hipóteses, copy, atendimento e inteligência de crescimento.', icon: Bot, benefits: ['Análise de dados mais rápida', 'Playbooks de copy e criativos', 'Assistentes de operação'], process: ['Mapeamento de casos de uso', 'Base de conhecimento', 'Prototipação', 'Governança e melhoria'], faqs: [['IA substitui estratégia?', 'Não. Ela amplia velocidade e qualidade de execução.'], ['É seguro?', 'Definimos governança e dados permitidos.']] },
  { slug: 'consultoria', title: 'Consultoria', eyebrow: 'Senioridade sob demanda', description: 'Direcionamento executivo para times que precisam de método, rituais, auditoria e plano de escala.', icon: BrainCircuit, benefits: ['Auditoria sênior', 'Roadmap de crescimento', 'Rituais e governança'], process: ['Imersão', 'Diagnóstico', 'Plano de 90 dias', 'Acompanhamento executivo'], faqs: [['É para times internos?', 'Sim, especialmente equipes que querem senioridade e método.'], ['Há execução?', 'Pode ser consultivo ou híbrido, conforme maturidade.']] },
];

export const metrics = [
  { value: '+R$ 38M', label: 'receita rastreada' }, { value: '4.8x', label: 'ROAS médio' }, { value: '120+', label: 'projetos escalados' }, { value: '-32%', label: 'redução média de CAC' },
];

export const logos = ['NOVA', 'VERTEX', 'ATLAS', 'PRISMA', 'AURORA', 'NEXUS'];
export const methodology = ['Diagnóstico de dados e unit economics', 'Arquitetura de funil e mensuração', 'Produção de páginas, copies e criativos', 'Otimização por cohorts e payback', 'Escala com governança executiva'];
export const reasons = [
  { icon: ShieldCheck, title: 'Rigor financeiro', description: 'Mídia analisada por margem, CAC, payback e receita, não apenas cliques.' },
  { icon: Sparkles, title: 'Design de alta conversão', description: 'Experiências premium que aumentam confiança e intenção de compra.' },
  { icon: ChartNoAxesCombined, title: 'Inteligência operacional', description: 'Rituais, dashboards e documentação para decisões rápidas.' },
];

export const caseStudies: CaseStudy[] = [
  { id: 'saas-b2b', company: 'Vertex Cloud', segment: 'SaaS B2B', investment: 'R$ 180 mil/mês', roi: '5.4x', cac: '-38%', leads: '2.840 MQLs', revenue: 'R$ 4.7M', testimonial: 'A Omega conectou mídia e vendas com uma clareza que nunca tivemos.', gallery: ['Pipeline executivo', 'Dashboard de cohorts', 'Landing page por segmento'] },
  { id: 'ecommerce', company: 'Aurora Goods', segment: 'E-commerce premium', investment: 'R$ 320 mil/mês', roi: '6.2x', cac: '-29%', leads: '89 mil sessões', revenue: 'R$ 11.2M', testimonial: 'A escala veio com estética, método e controle de margem.', gallery: ['Criativos UGC premium', 'Catálogo Meta', 'Relatório de margem'] },
  { id: 'educacao', company: 'Prisma Education', segment: 'Educação', investment: 'R$ 95 mil/mês', roi: '4.1x', cac: '-41%', leads: '12.400 leads', revenue: 'R$ 2.8M', testimonial: 'Reduzimos desperdício e aumentamos previsibilidade de matrículas.', gallery: ['Funil de vestibular', 'WhatsApp tracking', 'CRM por etapa'] },
];

export const testimonials = [
  { name: 'Marina Costa', role: 'CMO, ScaleCo', quote: 'A Omega trouxe clareza, cadência e previsibilidade para nosso investimento em mídia.' },
  { name: 'Rafael Lima', role: 'Founder, Vertex', quote: 'Saímos de campanhas isoladas para uma máquina de aquisição mensurável.' },
  { name: 'Bianca Torres', role: 'Head of Growth, Aurora', quote: 'O nível de detalhe em dados, design e estratégia é de consultoria premium.' },
];

export const faqs: [string, string][] = [
  ['Em quanto tempo vejo resultados?', 'Os primeiros aprendizados aparecem nas primeiras semanas; escala sustentável depende de dados, oferta, ciclo de venda e volume.'],
  ['Vocês criam landing pages?', 'Sim. Criamos páginas premium com performance, SEO, copy e tracking.'],
  ['Atendem B2B e B2C?', 'Sim. Adaptamos o método ao ticket, margem, ciclo comercial e maturidade de dados.'],
  ['Como funciona o diagnóstico?', 'Mapeamos mídia, tracking e funil para priorizar gargalos com maior impacto financeiro.'],
];

export const blogPosts: BlogPost[] = [
  { slug: 'como-reduzir-cac', title: 'Como reduzir CAC sem diminuir investimento em mídia', category: 'Performance', excerpt: 'Um framework para cortar desperdício e preservar escala.', date: '2026-07-20', readTime: '7 min' },
  { slug: 'landing-pages-premium', title: 'Landing pages premium: estética como alavanca de conversão', category: 'CRO', excerpt: 'Como design sofisticado aumenta confiança e intenção.', date: '2026-07-18', readTime: '6 min' },
  { slug: 'crm-e-roi-real', title: 'CRM e ROI real: conectando campanhas a receita', category: 'Analytics', excerpt: 'A base operacional para decisões de mídia mais inteligentes.', date: '2026-07-12', readTime: '8 min' },
];

export const pageMap = {
  '/sobre': { title: 'Sobre', icon: Rocket, text: 'Uma agência boutique para operações que buscam senioridade, método e estética premium em crescimento.' },
  '/servicos': { title: 'Serviços', icon: ChartNoAxesCombined, text: 'Um portfólio completo para mídia, conversão, dados, automação, CRM e inteligência artificial.' },
  '/cases': { title: 'Cases', icon: Building2, text: 'Resultados construídos com diagnóstico, execução consistente e melhoria contínua.' },
  '/blog': { title: 'Blog', icon: FileText, text: 'Insights sobre mídia paga, CRO, analytics, estratégia e crescimento previsível.' },
  '/contato': { title: 'Contato', icon: MessageCircle, text: 'Solicite um diagnóstico e descubra os próximos movimentos para escalar sua aquisição.' },
};
