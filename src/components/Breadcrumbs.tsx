import { ChevronRight, Home } from 'lucide-react';
import { useEffect } from 'react';
import { generateBreadcrumbs, injectStructuredData } from '../lib/structuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const fullItems = [
    { name: 'Home', url: 'https://biomathcore.com/' },
    ...items.map(item => ({
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `https://biomathcore.com${item.url}`
    }))
  ];

  useEffect(() => {
    const breadcrumbSchema = generateBreadcrumbs(fullItems);
    injectStructuredData(breadcrumbSchema);
  }, [items]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <a
        href="/"
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </a>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
          {index === items.length - 1 ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.name}
            </span>
          ) : (
            <a
              href={item.url}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.name}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
}
