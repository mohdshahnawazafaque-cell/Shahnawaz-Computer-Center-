import React, { useState } from 'react';
import { ArrowLeft, Construction, Calculator, Type, FileImage } from 'lucide-react';
import { ALL_TOOLS } from '../data/cyberCafeData';

interface CyberCafeToolViewerPageProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const CyberCafeToolViewerPage: React.FC<CyberCafeToolViewerPageProps> = ({ onNavigate, currentPath }) => {
  const toolId = currentPath.split('/workspace/tool/')[1];
  const tool = ALL_TOOLS.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tool Not Found</h1>
          <button onClick={() => onNavigate('/workspace')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderToolContent = () => {
    // Basic interactive implementations
    if (tool.id === 'age_calc') {
      return <AgeCalculator />;
    }
    
    if (tool.id === 'percentage_calc') {
      return <PercentageCalculator />;
    }

    if (tool.id === 'photo_resize') {
      return <PhotoResizeTool />;
    }

    // Default stub for other tools
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Construction className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Under Development</h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          This feature ({tool.title}) is currently being developed and will be available in a future update. 
        </p>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-700 min-h-screen pb-12">
      <div className="bg-indigo-950 text-white py-6 px-4 border-b border-indigo-900 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('/workspace')}
              className="p-2 bg-indigo-900 hover:bg-indigo-800 rounded-lg text-indigo-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <tool.icon className="w-6 h-6 text-indigo-400" />
                {tool.title}
              </h1>
              <p className="text-indigo-200 text-sm mt-0.5 font-medium">
                {tool.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {renderToolContent()}
      </div>
    </div>
  );
};


// Simple Age Calculator implementation
const AgeCalculator = () => {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<{ years: number, months: number, days: number } | null>(null);

  const calculateAge = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    setResult({ years, months, days });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="max-w-md mx-auto">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">जन्म तिथि (Date of Birth)</label>
        <input 
          type="date" 
          value={dob} 
          onChange={(e) => setDob(e.target.value)}
          className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-4 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        />
        <button 
          onClick={calculateAge}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Calculate Age
        </button>

        {result && (
          <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
            <p className="text-sm text-indigo-600 font-bold mb-2">आपकी सटीक उम्र:</p>
            <div className="flex items-center justify-center gap-4 text-indigo-950 font-black">
              <div className="text-center">
                <span className="text-3xl block">{result.years}</span>
                <span className="text-xs uppercase tracking-wider">Years</span>
              </div>
              <span className="text-2xl text-indigo-300">-</span>
              <div className="text-center">
                <span className="text-3xl block">{result.months}</span>
                <span className="text-xs uppercase tracking-wider">Months</span>
              </div>
              <span className="text-2xl text-indigo-300">-</span>
              <div className="text-center">
                <span className="text-3xl block">{result.days}</span>
                <span className="text-xs uppercase tracking-wider">Days</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Simple Percentage Calculator implementation
const PercentageCalculator = () => {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (val1 && val2) {
      setResult((parseFloat(val1) / 100) * parseFloat(val2));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input type="number" placeholder="%" value={val1} onChange={(e) => setVal1(e.target.value)} className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none" />
          </div>
          <span className="font-bold text-slate-400">of</span>
          <div className="flex-1">
            <input type="number" placeholder="Value" value={val2} onChange={(e) => setVal2(e.target.value)} className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none" />
          </div>
        </div>
        
        <button onClick={calculate} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">
          Calculate
        </button>

        {result !== null && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center font-black text-2xl text-green-700">
            = {result}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Photo Resize (UI only as actual canvas resize logic is complex for this demo, will just provide a stub)
const PhotoResizeTool = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <div className="border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 bg-slate-50 dark:bg-slate-700 cursor-pointer hover:bg-slate-100 dark:bg-slate-800/50 transition-colors">
          <FileImage className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Click to Upload Image</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">JPG, PNG supported</p>
        </div>
        <p className="text-xs text-slate-400 mt-4">(Note: Fully client-side resizing via Canvas API is available in full release)</p>
    </div>
  );
};