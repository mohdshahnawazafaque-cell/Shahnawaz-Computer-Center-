import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, LayoutGrid, FileText, ChevronRight, X } from 'lucide-react';
import { CYBER_CAFE_CATEGORIES, CYBER_CAFE_TOOLS, CategoryId, ToolItem } from '../data/cyberCafeData';
import { SEOHead } from '../components/SEOHead';


interface CyberCafeHubPageProps { onNavigate: (path: string) => void; currentPath?: string; }
export const CyberCafeHubPage: React.FC<CyberCafeHubPageProps> = ({ onNavigate }) => {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'ALL'>('ALL');

  const filteredTools = useMemo(() => {
    return CYBER_CAFE_TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || tool.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen">
      <SEOHead 
        title="Cyber Cafe Tools - Shahnawaz Computer Center" 
        description="All-in-one tools for cyber cafe owners. Photo resize, PDF tools, Document makers, and more."
      />
      
      {/* Header */}
      <div className="bg-[#0B2545] text-white py-8 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col gap-4 relative z-10">
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-bold w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">Cyber Cafe Tools</h1>
              <p className="text-slate-300 text-sm max-w-xl">
                A complete suite of free, client-side tools designed for fast daily operations. 
                All files process directly in your browser.
              </p>
            </div>
            
            <div className="relative w-full md:w-96 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search tools (e.g., Photo Resize, Merge PDF)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner text-sm font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Grid - High Contrast for Mobile & Desktop */}
        <div className="mb-8 overflow-hidden relative">
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`shrink-0 snap-start flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all w-32 h-32 ${
                selectedCategory === 'ALL'
                  ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-xl scale-105'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#990000] hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedCategory === 'ALL' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <LayoutGrid className={`w-6 h-6 ${selectedCategory === 'ALL' ? 'text-amber-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <span className="text-xs font-black uppercase text-center leading-tight">All Tools</span>
            </button>
            {CYBER_CAFE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 snap-start flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all w-32 h-32 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-xl scale-105'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#990000] hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <cat.icon className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-amber-400' : 'text-slate-500 dark:text-slate-400'}`} />
                </div>
                <span className="text-xs font-black uppercase text-center leading-tight">{cat.name.replace(' TOOLS', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="flex-1">
          {filteredTools.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-sm transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Group by category if 'ALL' is selected, else just show the grid */}
              {(selectedCategory === 'ALL' ? CYBER_CAFE_CATEGORIES : CYBER_CAFE_CATEGORIES.filter(c => c.id === selectedCategory)).map(category => {
                const toolsInCategory = filteredTools.filter(t => t.categoryId === category.id);
                if (toolsInCategory.length === 0) return null;
                
                return (
                  <div key={category.id} className="space-y-4">
                    <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
                      <category.icon className="w-5 h-5 text-[#990000] dark:text-amber-400" />
                      <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{category.name}</h2>
                      <span className="ml-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {toolsInCategory.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {toolsInCategory.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => onNavigate(`/workspace/tool/${tool.id}`)}
                          className="group bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#990000] dark:hover:border-amber-400 transition-all text-left flex flex-col cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:bg-red-50 dark:group-hover:bg-amber-400/10 transition-colors">
                            <tool.icon className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-[#990000] dark:group-hover:text-amber-400 transition-colors" />
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-[#990000] dark:group-hover:text-amber-400 transition-colors">
                            {tool.name}
                          </h3>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};
