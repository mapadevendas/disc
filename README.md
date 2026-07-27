# Omega Performance

Landing page premium para uma agência especializada em tráfego pago, criada com Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion, Lucide Icons e componentes no padrão Shadcn UI.

## Funcionalidades

- App Router com páginas: Home, Sobre, Serviços, Google Ads, Meta Ads, Landing Pages, Consultoria, Cases, Blog e Contato.
- Home com hero premium, vídeo de fundo opcional, métricas, serviços, diferenciais, metodologia, cases, depoimentos, FAQ, CTA e rodapé completo.
- Tema dark, animações suaves, componentes reutilizáveis e paleta `#000000`, `#FFFFFF`, `#C8A95E`, `#0F3D56`.
- SEO com Metadata API, OpenGraph, Schema.org, sitemap e robots.txt.
- Preparado para Google Tag Manager, Meta Pixel, Google Analytics, RD Station, HubSpot, WhatsApp, Calendly e Supabase.
- Formulário com React Hook Form e Zod.

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

Configure em `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://omegaperformance.com.br
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_RD_STATION_ENDPOINT=https://www.rdstation.com.br/api/1.3/conversions
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=00000000
NEXT_PUBLIC_HUBSPOT_FORM_ID=00000000-0000-0000-0000-000000000000
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/omega-performance/diagnostico
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Deploy na Vercel

1. Envie o repositório para o GitHub.
2. Importe o projeto na Vercel.
3. Configure as variáveis de ambiente.
4. Faça deploy usando o preset automático para Next.js.

## Supabase

O arquivo `supabase/schema.sql` prepara as tabelas `services`, `posts`, `testimonials`, `cases`, `faqs`, `leads`, `settings`, `team_members`, `landing_pages`, `diagnostics`, `crm_deals`, `integrations` e `webhook_events` para o painel administrativo, CRM e automações.

## Plataforma comercial

Inclui área `/admin`, CRM Kanban, diagnóstico interativo, calculadoras de performance, chat IA, editor Markdown e webhooks para Meta Lead Ads, Google Ads, RD Station, HubSpot e integrações genéricas.
