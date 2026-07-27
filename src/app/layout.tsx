import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TrackingScripts } from '@/components/analytics/tracking';
import { SiteLoader } from '@/components/interactive/site-loader';
import { CustomCursor } from '@/components/interactive/custom-cursor';
import { FloatingActions } from '@/components/interactive/floating-actions';
import { AiChatWidget } from '@/features/ai-chat/ai-chat-widget';
import { site } from '@/domain/content';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url), title: { default: `${site.name} | Tráfego Pago Premium`, template: `%s | ${site.name}` }, description: site.description,
  openGraph: { title: site.name, description: site.description, url: site.url, siteName: site.name, locale: 'pt_BR', type: 'website', images: [{ url: '/og.svg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description, images: ['/og.svg'] },
  alternates: { canonical: '/' }, robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  return <html lang="pt-BR" className="dark"><body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
    {gtm && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtm}`} height="0" width="0" className="hidden" /></noscript>}
    <TrackingScripts /><SiteLoader /><CustomCursor /><Header />{children}<Footer /><FloatingActions /><AiChatWidget />
  </body></html>;
}
