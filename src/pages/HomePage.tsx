import React from 'react';
import { PostType } from '../types';
import { Printer, Briefcase, Landmark, FileText, Wrench } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectPost?: any;
  onOpenSearch?: any;
  onOpenTools?: any;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#f8f9fa] dark:bg-slate-900 min-h-screen py-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full mx-auto px-4">
        
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-[#0B2545] dark:text-white uppercase tracking-tight mb-2">
            Shahnawaz Computer Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
            Quick Digital Services & Free Print
          </p>
        </div>

        {/* Minimal Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* Free Print */}
          <button 
            onClick={() => onNavigate('/print-services')}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border-2 border-slate-100 dark:border-slate-700 hover:border-rose-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 text-center group"
          >
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Printer className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight group-hover:text-rose-500">Free Print</h2>
          </button>

          {/* Cyber Cafe Services */}
          <button 
            onClick={() => onNavigate('/services')}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 text-center group"
          >
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight group-hover:text-blue-500">Cyber Cafe</h2>
          </button>

          {/* Cyber Cafe Tools */}
          <button 
            onClick={() => onNavigate('/workspace/hub')}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border-2 border-slate-100 dark:border-slate-700 hover:border-amber-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 text-center group"
          >
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight group-hover:text-amber-500">Tools</h2>
          </button>

          {/* Sarkari Yojana */}
          <button 
            onClick={() => onNavigate('/category/sarkari-yojana')}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 text-center group"
          >
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Landmark className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight group-hover:text-emerald-500">Yojana</h2>
          </button>

          {/* Documents */}
          <button 
            onClick={() => onNavigate('/category/documents')}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 text-center group"
          >
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight group-hover:text-indigo-500">Documents</h2>
          </button>

        </div>
      </div>
    </div>
  );
};
