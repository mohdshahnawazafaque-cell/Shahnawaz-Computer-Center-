import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav id="breadcrumb-navigation" aria-label="Breadcrumb" className="my-3 px-4 max-w-7xl mx-auto">
      <ol className="flex items-center flex-wrap gap-1 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
        <li className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1 font-semibold text-[#0B2545] hover:text-red-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1 min-w-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {isLast || !item.path ? (
                <span className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-md" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(item.path!)}
                  className="font-medium text-[#0B2545] hover:text-red-600 transition-colors truncate max-w-[150px] sm:max-w-xs"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
