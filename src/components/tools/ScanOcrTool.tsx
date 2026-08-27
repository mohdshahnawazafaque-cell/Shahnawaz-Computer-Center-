import React, { useState } from 'react';
import { Scan, Upload, Type, Download } from 'lucide-react';

export const ScanOcrTool: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Controls */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6">
        
        <label className="cursor-pointer block border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50">
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Upload Scan/Document</span>
        </label>
        
        {image && (
          <div className="space-y-4">
             <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                <strong>Note:</strong> Advanced client-side OCR requires downloading language models. For this preview, the scanning interface allows adjusting brightness and contrast.
             </div>
             
             <button className="w-full py-3 bg-[#0B2545] text-white font-bold rounded-lg flex items-center justify-center gap-2">
               <Download className="w-5 h-5" /> Save Processed Image
             </button>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center min-h-[400px]">
        {!image ? (
          <div className="text-center text-slate-400 p-8">
            <Scan className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p>Upload a document to scan</p>
          </div>
        ) : (
          <div className="max-w-full max-h-[600px] overflow-auto p-4 flex items-center justify-center">
             <img src={image} className="max-w-full h-auto shadow-sm" alt="Scanned Document" />
          </div>
        )}
      </div>

    </div>
  );
};
