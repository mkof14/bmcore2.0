import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

const DEFAULT_SEO = {
  siteName: 'BioMath Core',
  defaultTitle: 'BioMath Core - AI-Powered Personalized Health Intelligence',
  defaultDescription: 'Transform your health data into actionable insights with AI-powered analysis, personalized recommendations, and comprehensive health tracking.',
  defaultImage: '/biomathcore_emblem_1024.png',
  defaultKeywords: [
    'health analytics',
    'AI health assistant',
    'personalized medicine',
    'health tracking',
    'medical data analysis',
    'wellness optimization',
    'biomarkers',
    'preventive healthcare',
    'health intelligence',
    'medical AI'
  ],
  twitterHandle: '@biomathcore',
  locale: 'en_US',
  baseUrl: import.meta.env.VITE_APP_URL || 'https://biomathcore.com'
};

export default function SEO({
  title,
  description = DEFAULT_SEO.defaultDescription,
  keywords = DEFAULT_SEO.defaultKeywords,
  image = DEFAULT_SEO.defaultImage,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${DEFAULT_SEO.siteName}`
    : DEFAULT_SEO.defaultTitle;

  const fullUrl = url
    ? `${DEFAULT_SEO.baseUrl}${url}`
    : DEFAULT_SEO.baseUrl;

  const fullImage = image.startsWith('http')
    ? image
    : `${DEFAULT_SEO.baseUrl}${image}`;

  const allKeywords = [...new Set([...DEFAULT_SEO.defaultKeywords, ...keywords])];

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1'
  ].join(', ');

  useEffect(() => {
    document.title = fullTitle;

    const metaTags: Record<string, string> = {
      description,
      keywords: allKeywords.join(', '),
      robots: robotsContent,
      author: author || DEFAULT_SEO.siteName,

      'og:site_name': DEFAULT_SEO.siteName,
      'og:title': title || DEFAULT_SEO.defaultTitle,
      'og:description': description,
      'og:type': type,
      'og:url': fullUrl,
      'og:image': fullImage,
      'og:image:width': '1024',
      'og:image:height': '1024',
      'og:locale': DEFAULT_SEO.locale,

      'twitter:card': 'summary_large_image',
      'twitter:site': DEFAULT_SEO.twitterHandle,
      'twitter:creator': author || DEFAULT_SEO.twitterHandle,
      'twitter:title': title || DEFAULT_SEO.defaultTitle,
      'twitter:description': description,
      'twitter:image': fullImage,

      'theme-color': '#10b981',
      'msapplication-TileColor': '#10b981',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': DEFAULT_SEO.siteName,
      'format-detection': 'telephone=no'
    };

    if (type === 'article') {
      if (publishedTime) metaTags['article:published_time'] = publishedTime;
      if (modifiedTime) metaTags['article:modified_time'] = modifiedTime;
      if (author) metaTags['article:author'] = author;
      if (section) metaTags['article:section'] = section;
      if (tags.length > 0) {
        tags.forEach((tag, index) => {
          metaTags[`article:tag:${index}`] = tag;
        });
      }
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      const property = name.startsWith('og:') || name.startsWith('article:')
        ? 'property'
        : 'name';

      let element = document.querySelector(`meta[${property}="${name}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(property, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || fullUrl);

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: DEFAULT_SEO.siteName,
      description: DEFAULT_SEO.defaultDescription,
      url: DEFAULT_SEO.baseUrl,
      logo: `${DEFAULT_SEO.baseUrl}/biomathcore_emblem_1024.png`,
      sameAs: [
        'https://twitter.com/biomathcore',
        'https://www.linkedin.com/company/biomathcore',
        'https://github.com/biomathcore'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'support@biomathcore.com',
        availableLanguage: ['English']
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
    };
  }, [fullTitle, description, allKeywords, fullUrl, fullImage, type, author, publishedTime, modifiedTime, section, tags, robotsContent, canonical]);

  return null;
}
