import type { Metadata } from 'next';
import { ServicePage } from '@/features/services/service-page';
import { serviceItems, site } from '@/domain/content';

const service = serviceItems.find((item) => item.slug === 'landing-pages')!;

export const metadata: Metadata = { title: service.title, description: service.description, alternates: { canonical: '/landing-pages' }, openGraph: { title: `${service.title} | ${site.name}`, description: service.description, url: `${site.url}/landing-pages` } };

export default function Page() {
  return <ServicePage slug="landing-pages" />;
}
