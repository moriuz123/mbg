import './globals.css';
import type { Metadata } from 'next';
import { getSeoSettings } from '@/app/actions/seoSettings';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const baseUrl = seo.seo_canonical_url?.replace(/\/$/, '') || 'https://mbg.lebakkab.go.id';

  const titleDefault = seo.seo_meta_title || 'Sistem Digitalisasi Supply Chain - Pemkab Lebak';
  const description = seo.seo_meta_description || 'Sistem Digitalisasi Supply Chain dan pemantauan distribusi logistik Pemerintah Kabupaten Lebak.';
  const keywords = seo.seo_meta_keywords ? seo.seo_meta_keywords.split(',').map(s => s.trim()) : [];
  const ogImage = seo.seo_og_image || '/LOGO-LEBAK.png';
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  const isNoIndex = seo.seo_robots_index?.includes('noindex');

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: titleDefault,
      template: `%s | ${titleDefault.split('-')[0].trim() || 'MBG Lebak'}`,
    },
    description,
    keywords,
    authors: [{ name: seo.seo_author || 'Pemerintah Kabupaten Lebak' }],
    creator: seo.seo_author || 'Pemerintah Kabupaten Lebak',
    publisher: seo.seo_publisher || 'Pemerintah Kabupaten Lebak',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: seo.seo_og_title || titleDefault,
      description: seo.seo_og_description || description,
      url: baseUrl,
      siteName: titleDefault,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: titleDefault,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: (seo.seo_twitter_card as any) || 'summary_large_image',
      title: seo.seo_og_title || titleDefault,
      description: seo.seo_og_description || description,
      creator: seo.seo_twitter_handle || '@pemkablebak',
      images: [ogImageUrl],
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoIndex,
      googleBot: {
        index: !isNoIndex,
        follow: !isNoIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      ...(seo.seo_google_verification ? { google: seo.seo_google_verification } : {}),
      ...(seo.seo_bing_verification ? { other: { 'msvalidate.01': seo.seo_bing_verification } } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seo = await getSeoSettings();
  const baseUrl = seo.seo_canonical_url?.replace(/\/$/, '') || 'https://mbg.lebakkab.go.id';

  // Schema.org Structured Data for Government Service & Organization
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    'name': 'Sistem Digitalisasi Supply Chain MBG Lebak',
    'alternateName': 'MBG Pemkab Lebak',
    'url': baseUrl,
    'logo': `${baseUrl}/LOGO-LEBAK.png`,
    'department': {
      '@type': 'GovernmentOrganization',
      'name': 'Dinas Ketahanan Pangan Kabupaten Lebak',
    },
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Jl. Buana / Pasir Ona No. 3',
      'addressLocality': 'Rangkasbitung',
      'addressRegion': 'Banten',
      'postalCode': '42312',
      'addressCountry': 'ID',
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+62-252-201113',
      'contactType': 'customer support',
      'availableLanguage': ['Indonesian'],
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${baseUrl}/sppg?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const gaId = seo.seo_google_analytics_id?.trim();

  return (
    <html lang="id" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    heading: ['"Plus Jakarta Sans"', 'sans-serif'],
                  },
                  colors: {
                    primary: {
                      50: '#e8f0fb',
                      100: '#d1e1f7',
                      200: '#a3c4ee',
                      300: '#75a6e5',
                      400: '#4788dc',
                      500: '#1e5ca8', // Base blue
                      600: '#184a86',
                      700: '#123765',
                      800: '#0a2463', // Dark blue
                      900: '#071840', // Very dark blue
                    },
                    accent: {
                      500: '#e8a020', // Gold/orange
                      600: '#d1901d',
                    }
                  }
                }
              }
            }
          `
        }} />

        {/* Structured Data Schema.org (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics 4 Script (if configured) */}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
