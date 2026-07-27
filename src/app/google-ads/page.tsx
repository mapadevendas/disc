import type { Metadata } from 'next';
import { ServicePage } from '@/features/services/service-page';
import { serviceItems, site } from '@/domain/content';

const service = serviceItems.find((item) => item.slug === 'google-ads')!;

export const metadata: Metadata = { title: service.title, description: service.description, alternates: { canonical: '/google-ads' }, openGraph: { title: `${service.title} | ${site.name}`, description: service.description, url: `${site.url}/google-ads` } };

export default function Page() {
  return <ServicePage slug="google-ads" />;
}
