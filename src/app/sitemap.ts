import type { MetadataRoute } from 'next';
import { navItems, serviceItems, site } from '@/domain/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceRoutes = serviceItems.map((service) => `/${service.slug}`);
  const routes = Array.from(new Set([...navItems.map(([, href]) => href), ...serviceRoutes, '/rss.xml']));
  return routes.map((href) => ({ url: `${site.url}${href}`, lastModified: new Date(), changeFrequency: href === '/' ? 'weekly' : 'monthly', priority: href === '/' ? 1 : .7 }));
}
