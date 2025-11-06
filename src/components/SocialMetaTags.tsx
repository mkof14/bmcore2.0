import { useEffect } from 'react';

interface SocialMetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  locale?: string;
  siteName?: string;
}

const DEFAULT_VALUES = {
  siteName: 'BioMath Core',
  defaultImage: '/biomathcore_emblem_1024.png',
  twitterSite: '@biomathcore',
  locale: 'en_US',
  baseUrl: 'https://biomathcore.com'
};

export default function SocialMetaTags({
  title,
  description,
  image = DEFAULT_VALUES.defaultImage,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  twitterCard = 'summary_large_image',
  twitterSite = DEFAULT_VALUES.twitterSite,
  twitterCreator,
  locale = DEFAULT_VALUES.locale,
  siteName = DEFAULT_VALUES.siteName
}: SocialMetaTagsProps) {
  useEffect(() => {
    const fullUrl = url ? `${DEFAULT_VALUES.baseUrl}${url}` : DEFAULT_VALUES.baseUrl;
    const fullImage = image.startsWith('http') ? image : `${DEFAULT_VALUES.baseUrl}${image}`;

    const metaTags: Record<string, string> = {
      'og:site_name': siteName,
      'og:title': title,
      'og:description': description,
      'og:type': type,
      'og:url': fullUrl,
      'og:image': fullImage,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': title,
      'og:locale': locale,

      'twitter:card': twitterCard,
      'twitter:site': twitterSite,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': fullImage,
      'twitter:image:alt': title,

      'fb:app_id': '1234567890',

      'pinterest:description': description,
      'pinterest:media': fullImage,

      'linkedin:owner': siteName
    };

    if (twitterCreator) {
      metaTags['twitter:creator'] = twitterCreator;
    }

    if (type === 'article') {
      if (publishedTime) metaTags['article:published_time'] = publishedTime;
      if (modifiedTime) metaTags['article:modified_time'] = modifiedTime;
      if (author) metaTags['article:author'] = author;
      if (tags.length > 0) {
        tags.forEach((tag, index) => {
          metaTags[`article:tag:${index}`] = tag;
        });
      }
    }

    if (type === 'profile' && author) {
      metaTags['profile:username'] = author;
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      const property = name.startsWith('og:') ||
                       name.startsWith('article:') ||
                       name.startsWith('fb:') ||
                       name.startsWith('profile:')
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

    const whatsappMeta = document.createElement('meta');
    whatsappMeta.setAttribute('property', 'og:image:secure_url');
    whatsappMeta.setAttribute('content', fullImage);
    document.head.appendChild(whatsappMeta);

    return () => {
    };
  }, [title, description, image, url, type, author, publishedTime, modifiedTime, tags, twitterCard, twitterSite, twitterCreator, locale, siteName]);

  return null;
}
