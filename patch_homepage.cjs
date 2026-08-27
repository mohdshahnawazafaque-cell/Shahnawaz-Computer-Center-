const fs = require('fs');

const code = `import React from 'react';
import { PostType } from '../types';
import { ArrowRight, Printer, FileText, Briefcase, Landmark } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectPost?: (slug: string, type: PostType) => void;
  onOpenSearch?: () => void;
  onOpenTools?: (tab?: 'salary' | 'resume' | 'image' | 'age' | 'photo_name' | 'converter') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#f8f9fa] dark:bg-slate-900 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        {/* Welcome Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm text-center">
          <h1 className="text-3xl md:text-4xl font-black text-[#0B2545] dark:text-white uppercase tracking-tight mb-4">
            Welcome to Shahnawaz Computer Center
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Your one-stop destination for all online digital services, print services, and government scheme applications. Select a service category below to get started quickly and securely.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate('/print-services')}
              className="px-6 py-3 bg-[#990000] hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Printer className="w-5 h-5" /> Quick Print Services
            </button>
            <button 
              onClick={() => onNavigate('/wallet')}
              className="px-6 py-3 bg-[#0B2545] hover:bg-slate-800 text-amber-400 rounded-xl font-black uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Landmark className="w-5 h-5" /> Manage Wallet
            </button>
          </div>
        </div>

        {/* Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Print Services */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-[#990000] transition-colors p-6 flex flex-col items-start cursor-pointer group" onClick={() => onNavigate('/print-services')}>
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 text-[#990000] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#990000] group-hover:text-white transition-colors">
              <Printer className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 group-hover:text-[#990000]">Print Services</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
              Download and print Vehicle RC, Insurance Copies, Challan Receipts, and High-Quality Documents instantly.
            </p>
            <span className="text-[#990000] font-bold text-sm uppercase flex items-center gap-1 group-hover:underline">
              Access Services <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Cyber Cafe Services */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-[#0B2545] transition-colors p-6 flex flex-col items-start cursor-pointer group" onClick={() => onNavigate('/services')}>
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-[#0B2545] dark:text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0B2545] group-hover:text-amber-400 transition-colors">
              <Briefcase className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 group-hover:text-[#0B2545]">Cyber Cafe Services</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
              Online Form Filling, Document Uploads, Profile Registration, and general Cyber Cafe digital assistance.
            </p>
            <span className="text-[#0B2545] dark:text-amber-400 font-bold text-sm uppercase flex items-center gap-1 group-hover:underline">
              View Catalog <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Sarkari Yojana */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-colors p-6 flex flex-col items-start cursor-pointer group" onClick={() => onNavigate('/category/sarkari-yojana')}>
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Landmark className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 group-hover:text-emerald-600">Sarkari Yojana</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
              Apply for government welfare schemes, farmer benefits, and direct subsidy programs securely.
            </p>
            <span className="text-emerald-600 font-bold text-sm uppercase flex items-center gap-1 group-hover:underline">
              Explore Schemes <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Documents / Certificates */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 transition-colors p-6 flex flex-col items-start cursor-pointer group" onClick={() => onNavigate('/category/documents')}>
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 group-hover:text-indigo-600">Documents & Certificates</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
              Assistance with Aadhar, PAN Card, Domicile, Income, and Caste certificate applications.
            </p>
            <span className="text-indigo-600 font-bold text-sm uppercase flex items-center gap-1 group-hover:underline">
              Apply Now <ArrowRight className="w-4 h-4" />
            </span>
          </div>
          
        </div>

      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/pages/HomePage.tsx', code);
