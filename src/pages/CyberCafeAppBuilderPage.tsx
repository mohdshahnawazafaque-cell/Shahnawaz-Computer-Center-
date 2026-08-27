import React, { useState, useEffect } from 'react';
import { ArrowLeft, Printer, AlertCircle } from 'lucide-react';
import { CYBER_CAFE_TOOLS } from '../data/cyberCafeData';
import { getTemplate } from '../data/applicationTemplates';
import { SEOHead } from '../components/SEOHead';

interface CyberCafeAppBuilderPageProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const CyberCafeAppBuilderPage: React.FC<CyberCafeAppBuilderPageProps> = ({ onNavigate, currentPath }) => {
  const toolId = currentPath.split('/workspace/application/')[1];
  const tool = CYBER_CAFE_TOOLS.find(t => t.id === toolId);
  
  const template = tool ? getTemplate(tool.id) : null;

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template) {
      setFormData(template.defaultValues);
    }
  }, [template]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!tool || !template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-700">
        <AlertCircle className="w-16 h-16 text-slate-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Application Template Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The form you are looking for does not exist or is under construction.</p>
        <button onClick={() => onNavigate('/workspace')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors">
          Go Back to Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-700 min-h-screen pb-12">
      <SEOHead 
        title={`${tool.name} | Cyber Cafe Hub | Shahnawaz Computer Center`}
        description={'Free online tool'}
        keywords={`Apply online, ${tool.name}, Shahnawaz Computer Center, Cyber cafe form`}
        canonicalUrl={window.location.origin + currentPath}
      />
      {/* Hide header and controls when printing */}
      <div className="print:hidden">
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
                  {tool.name}
                </h1>
                <p className="text-indigo-200 text-sm mt-0.5 font-medium">
                  दस्तावेज़ में जानकारी भरें और Print करें
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print PDF
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Editor */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            <div className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700 p-4 shrink-0 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 dark:text-slate-100">1. जानकारी भरें (Fill Information)</h2>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {template.fields.map(field => {
                  const isFullWidth = field.gridCols === 2 || field.type === 'textarea';
                  
                  return (
                    <div key={field.name} className={isFullWidth ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{field.label}</label>
                      
                      {field.type === 'textarea' ? (
                        <textarea 
                          name={field.name} 
                          value={formData[field.name] || ''} 
                          onChange={handleInputChange} 
                          placeholder={field.placeholder}
                          rows={6} 
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="">-- चुनें --</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={field.type} 
                          name={field.name} 
                          value={formData[field.name] || ''} 
                          onChange={handleInputChange} 
                          placeholder={field.placeholder}
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Mobile Print Button */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 sm:hidden">
              <button 
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                <Printer className="w-5 h-5" /> Preview & Print PDF
              </button>
            </div>
          </div>

          {/* Preview Panel - Hidden on small screens unless we are printing */}
          <div className="hidden lg:flex flex-col bg-slate-200 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-600 h-[calc(100vh-140px)]">
            <div className="bg-slate-700 text-white p-3 shrink-0 flex items-center justify-between">
              <h2 className="font-medium text-sm">Live Preview (A4 Size)</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center">
              {/* Virtual A4 Paper Wrapper for Live Preview */}
              <div className="bg-white dark:bg-slate-800 shadow-xl w-[210mm] min-h-[297mm] p-[20mm] mx-auto text-black font-serif relative" style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
                 <template.renderDocument data={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actual Print Rendering (Only visible during window.print) */}
      <div className="hidden print:block w-full bg-white dark:bg-slate-800 text-black font-serif print:p-8">
        <template.renderDocument data={formData} />
      </div>
    </div>
  );
};
