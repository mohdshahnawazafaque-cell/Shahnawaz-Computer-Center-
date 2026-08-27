import React from 'react';
import { Terminal, Flame, LayoutGrid, Monitor } from 'lucide-react';
import { ALL_TOOLS } from '../data/cyberCafeData';

interface CyberCafeSectionUIProps {
  onNavigate: (path: string) => void;
}

export const CyberCafeSectionUI: React.FC<CyberCafeSectionUIProps> = ({ onNavigate }) => {
  const quickTools = ALL_TOOLS.filter(t => t.isQuickTool).slice(0, 4);

  return (
    <section className="w-full mb-6 print:hidden">
      <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <Monitor className="w-4 h-4" /> Professional Dashboard
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              CYBER CAFE <span className="text-indigo-400">TOOLS</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium mb-8 max-w-lg mx-auto md:mx-0">
              साइबर कैफे के रोज़मर्रा के सभी जरूरी टूल, फोटो एडिटर, और आवेदन प्रार्थना पत्र अब एक ही जगह पर उपलब्ध।
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button 
                onClick={() => onNavigate('/workspace')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
              >
                <LayoutGrid className="w-5 h-5" />
                सभी टूल देखें (All Tools)
              </button>
              <button 
                onClick={() => onNavigate('/workspace')}
                className="bg-white dark:bg-slate-800/10 hover:bg-white dark:bg-slate-800/20 text-white border border-white/10 px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                सभी आवेदन देखें (Applications)
              </button>
            </div>
          </div>

          <div className="w-full max-w-md shrink-0">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" /> Quick Access
                 </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quickTools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <div 
                      key={`home-qt-${tool.id}`}
                      onClick={() => {
                        if (tool.toolType === 'application_form') {
                          onNavigate(`/workspace/application/${tool.id}`);
                        } else {
                          onNavigate(`/workspace/tool/${tool.id}`);
                        }
                      }}
                      className="bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500/50 p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
                    >
                      <div className="bg-slate-700 group-hover:bg-indigo-500/30 text-slate-300 group-hover:text-indigo-300 p-2 rounded-lg transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white text-xs font-bold line-clamp-1">
                        {tool.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
