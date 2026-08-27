import React, { useState } from 'react';
import { FileText, Printer, Download } from 'lucide-react';

export const DocumentMakerTool: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [formData, setFormData] = useState({
    title: 'Self Declaration Form',
    name: '',
    fatherName: '',
    address: '',
    content: 'I hereby declare that all information provided is true to the best of my knowledge.'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Form Area - hide when printing using print-hide classes if we had them, but for this simple stub it's fine */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6">
        <h3 className="font-black text-slate-900 dark:text-white text-lg border-b pb-2">Document Details</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Document Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full p-2 border rounded-lg text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full p-2 border rounded-lg text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Father/Husband Name</label>
            <input 
              type="text" 
              value={formData.fatherName} 
              onChange={e => setFormData({...formData, fatherName: e.target.value})} 
              className="w-full p-2 border rounded-lg text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Address</label>
            <textarea 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              className="w-full p-2 border rounded-lg text-sm"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Main Content / Declaration</label>
            <textarea 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              className="w-full p-2 border rounded-lg text-sm"
              rows={4}
            />
          </div>
        </div>

        <button onClick={handlePrint} className="w-full py-3 bg-[#0B2545] text-white font-bold rounded-lg flex items-center justify-center gap-2 mt-4">
          <Printer className="w-5 h-5" /> Print Document
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex justify-center overflow-auto min-h-[500px]">
        {/* A4 Paper representation */}
        <div className="bg-white w-[210mm] min-h-[297mm] p-12 shadow-md border border-slate-200">
          <h1 className="text-2xl font-bold text-center mb-8 uppercase underline underline-offset-4 decoration-2">
            {formData.title || 'Document Title'}
          </h1>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              I, <strong>{formData.name || '____________________'}</strong>, 
              son/wife/daughter of <strong>{formData.fatherName || '____________________'}</strong>, 
              resident of <strong>{formData.address || '________________________________________'}</strong>, 
              do hereby solemnly affirm and declare as under:
            </p>
            
            <p className="whitespace-pre-wrap">{formData.content}</p>
            
            <div className="pt-24 flex justify-between items-end">
              <div>
                <p>Date: ___/___/20__</p>
                <p className="mt-2">Place: ______________</p>
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-black mb-2"></div>
                <p className="font-bold">Signature / Deponent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
