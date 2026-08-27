import React, { useState, useMemo } from 'react';
import { 
  Search, ArrowLeft, Terminal, LayoutGrid, FileText, ChevronRight
} from 'lucide-react';
import { 
  ALL_TOOLS, 
  CYBER_CAFE_CATEGORIES, 
  APPLICATION_SUBCATEGORIES, 
  CategoryType, 
  ToolItem 
} from '../data/cyberCafeData';

interface CyberCafeHubPageProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const CyberCafeHubPage: React.FC<CyberCafeHubPageProps> = ({ onNavigate, currentPath }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const quickTools = ALL_TOOLS.filter(t => t.isQuickTool);

  const handleToolClick = (tool: ToolItem) => {
    if (tool.toolType === 'application_form') {
      onNavigate(`/workspace/application/${tool.id}`);
    } else {
      onNavigate(`/workspace/tool/${tool.id}`);
    }
  };

  const getToolsByCategory = (categoryId: CategoryType) => {
    return ALL_TOOLS.filter(tool => tool.category === categoryId);
  };

  const getAppsBySubcategory = (subcategoryId: string) => {
    return ALL_TOOLS.filter(tool => tool.category === 'APPLICATION_CENTER' && tool.subCategory === subcategoryId);
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-16 print:hidden font-sans">
      {/* Premium Hero Header */}
      <div className="bg-[#0f172a] text-white pt-10 pb-16 px-4 border-b border-slate-800 shadow-xl relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col gap-8 text-center">
            <div className="flex justify-center mb-2">
               <button 
                  onClick={() => onNavigate('/')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-slate-300 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Main Site
                </button>
            </div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-widest mx-auto mb-2">
                <Terminal className="w-4 h-4" /> Professional Dashboard
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
                CYBER CAFE
              </h1>
              <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
                साइबर कैफे के रोज़मर्रा के सभी जरूरी टूल और आवेदन एक ही जगह
              </p>
            </div>
            
            {/* Massive Search Bar */}
            <div className="relative max-w-3xl mx-auto w-full mt-4">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="टूल या आवेदन खोजें… (उदा. Photo Resize, जाति प्रमाणपत्र)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 focus:border-indigo-400 font-medium placeholder:text-slate-400 text-lg transition-all shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        
        {/* Quick Tools Ribbon */}
        {!searchQuery && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-200 mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 overflow-hidden">
            <div className="flex-shrink-0 text-center sm:text-left">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Frequently Used</h3>
              <p className="text-lg font-black text-slate-800">Quick Tools</p>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 hide-scrollbar w-full">
              {quickTools.map(tool => {
                const Icon = tool.icon;
                return (
                  <button
                    key={`ribbon-${tool.id}`}
                    onClick={() => handleToolClick(tool)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 rounded-xl font-bold text-sm transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                    {tool.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="space-y-12">
          
          {searchQuery ? (
             <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
               <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Search className="w-6 h-6 text-indigo-500" />
                  Search Results for "{searchQuery}"
               </h2>
               
               {(() => {
                 const q = searchQuery.toLowerCase();
                 const filtered = ALL_TOOLS.filter(tool => 
                   tool.title.toLowerCase().includes(q) || 
                   tool.description.toLowerCase().includes(q)
                 );

                 if (filtered.length === 0) {
                    return (
                      <div className="py-12 text-center text-slate-500">
                        <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-xl font-bold text-slate-700">कोई परिणाम नहीं मिला</p>
                        <p className="text-sm mt-1">कृपया कोई अन्य शब्द खोजें।</p>
                      </div>
                    );
                 }

                 return (
                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                      {filtered.map(tool => <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />)}
                   </div>
                 )
               })()}
             </div>
          ) : (
            // Category Rendering
            <>
              {CYBER_CAFE_CATEGORIES.map(category => {
                // Application Center has a custom layout
                if (category.id === 'APPLICATION_CENTER') {
                  return (
                    <div key={category.id} className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-blue-900/5 border border-slate-200 overflow-hidden relative">
                       <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                         <category.icon className="w-64 h-64" />
                       </div>
                       
                       <div className="relative z-10 mb-10 text-center sm:text-left">
                         <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                           {category.label.replace(/^\d+\.\s*/, '')}
                         </h2>
                         <p className="text-slate-500 font-medium mt-2 text-lg">
                           सभी जरूरी आवेदन और प्रार्थना पत्र एक ही जगह। जानकारी भरें → Preview → PDF बनाएं → Print
                         </p>
                       </div>

                       <div className="space-y-10 relative z-10">
                         {APPLICATION_SUBCATEGORIES.map(sub => {
                           const subApps = getAppsBySubcategory(sub.id);
                           if(subApps.length === 0) return null;
                           
                           return (
                             <div key={sub.id} className="pt-6 border-t border-slate-100 first:border-0 first:pt-0">
                               <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
                                 <sub.icon className="w-5 h-5 text-indigo-500" />
                                 {sub.label}
                               </h3>
                               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                 {subApps.map(app => (
                                    <div 
                                      key={app.id}
                                      onClick={() => handleToolClick(app)}
                                      className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl cursor-pointer transition-colors group"
                                    >
                                      <div>
                                        <p className="font-bold text-slate-800 group-hover:text-indigo-700 text-sm leading-tight">
                                          {app.title}
                                        </p>
                                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium flex items-center gap-1">
                                          आवेदन खोलें
                                        </p>
                                      </div>
                                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-200 transition-colors shrink-0">
                                        <ChevronRight className="w-4 h-4" />
                                      </div>
                                    </div>
                                 ))}
                               </div>
                             </div>
                           )
                         })}
                       </div>
                    </div>
                  );
                }

                // Standard Tools Layout
                const tools = getToolsByCategory(category.id);
                if (tools.length === 0) return null;

                return (
                  <div key={category.id} className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                        <category.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          {category.label.replace(/^\d+\.\s*/, '')}
                        </h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                      {tools.map(tool => <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />)}
                    </div>
                  </div>
                )
              })}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

// Extracted Tool Card Component for cleanliness
const ToolCard = ({ tool, onClick }: { tool: ToolItem, onClick: () => void }) => {
  const Icon = tool.icon;
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 hover:border-indigo-300 p-4 sm:p-5 rounded-2xl cursor-pointer hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center mb-4 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-700 leading-tight mb-2">
          {tool.title}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 font-bold text-[11px] text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 uppercase tracking-wider">
        Open Tool <ArrowLeft className="w-3 h-3 rotate-180" />
      </div>
    </div>
  )
}
