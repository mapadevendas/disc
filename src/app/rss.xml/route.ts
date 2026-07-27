import { blogPosts, site } from '@/domain/content';

export function GET() {
  const items = blogPosts.map((post) => `<item><title>${post.title}</title><link>${site.url}/blog/${post.slug}</link><description>${post.excerpt}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>${site.name}</title><link>${site.url}</link><description>${site.description}</description>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml' } });
}
