import type { Metadata } from 'next';
import { ServicePage } from '@/features/services/service-page';
import { serviceItems, site } from '@/domain/content';

const service = serviceItems.find((item) => item.slug === 'automacao')!;

export const metadata: Metadata = { title: service.title, description: service.description, alternates: { canonical: '/automacao' }, openGraph: { title: `${service.title} | ${site.name}`, description: service.description, url: `${site.url}/automacao` } };

export default function Page() {
  return <ServicePage slug="automacao" />;
}
