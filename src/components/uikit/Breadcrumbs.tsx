
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

interface BreadcrumbItemType {
  name: string;
  url?: string; // URL is optional for the last item
}

interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
  className?: string;
  // Allow for a custom Link component to be passed in
  linkComponent?: React.ElementType<any>;
}

export function Breadcrumbs({ items, className = '', linkComponent: LinkComponent = 'a' }: BreadcrumbsProps) {
  
    const allItems: BreadcrumbItemType[] = [
        { name: 'Home', url: '/' },
        ...items,
    ];

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {allItems.map((item, index) => (
        <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />}
            {index === 0 ? (
                 <LinkComponent
                    href={item.url}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Home"
                >
                    <Home className="h-4 w-4" />
                </LinkComponent>
            ) : index === allItems.length - 1 ? (
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {item.name}
                </span>
            ) : (
                <LinkComponent
                    href={item.url}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {item.name}
                </LinkComponent>
            )}
        </React.Fragment>
      ))}
    </nav>
  );
}
