import type { LucideIcon } from 'lucide-react';

export type ServiceSlug = 'google-ads' | 'meta-ads' | 'landing-pages' | 'seo' | 'automacao' | 'crm' | 'ia' | 'consultoria';

export type Service = {
  slug: ServiceSlug;
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  benefits: string[];
  process: string[];
  faqs: [string, string][];
};

export type CaseStudy = {
  id: string;
  company: string;
  segment: string;
  investment: string;
  roi: string;
  cac: string;
  leads: string;
  revenue: string;
  testimonial: string;
  gallery: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
};
