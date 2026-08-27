import React, { useState } from 'react';
import { Upload, Printer, GripHorizontal, Settings } from 'lucide-react';

export const PrintLayoutTool: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [images, setImages] = useState<string[]>([]);
  const [cols, setCols] = useState(4);
  const [rows, setRows] = useState(6);
  const [gap, setGap] = useState(5);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const urls = Array.from(e.target.files).map(f => URL.createObjectURL(f));
      setImages(prev => [...prev, ...urls]);
    }
  };

  const clearImages = () => {
    setImages([]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Settings */}
      <div className="w-full md:w-64 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6">
        
        <label className="cursor-pointer block border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50">
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Add Photos</span>
        </label>
        
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">
              <span>Columns</span><span>{cols}</span>
            </label>
            <input type="range" min="1" max="8" value={cols} onChange={e => setCols(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">
              <span>Rows</span><span>{rows}</span>
            </label>
            <input type="range" min="1" max="10" value={rows} onChange={e => setRows(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">
              <span>Gap (mm)</span><span>{gap}</span>
            </label>
            <input type="range" min="0" max="20" value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
           <button onClick={clearImages} className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-sm">Clear</button>
           <button onClick={() => window.print()} className="flex-1 py-2 bg-[#0B2545] text-white font-bold rounded-lg text-sm flex items-center justify-center gap-1">
             <Printer className="w-4 h-4" /> Print
           </button>
        </div>
      </div>

      {/* A4 Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex justify-center overflow-auto min-h-[500px]">
        
        {/* A4 Sheet - 210x297mm */}
        <div 
          className="bg-white shadow-md border border-slate-200"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '10mm',
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, auto)`,
            gap: `${gap}mm`,
            alignContent: 'start'
          }}
        >
          {images.map((src, idx) => (
             <div key={idx} className="border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 aspect-[3/4]">
                <img src={src} className="w-full h-full object-cover" alt={`Print ${idx}`} />
             </div>
          ))}
          {/* Fill empty spots with dashed outlines if not enough images for the first page */}
          {images.length < (cols * rows) && Array.from({length: (cols * rows) - images.length}).map((_, i) => (
            <div key={`empty-${i}`} className="border border-dashed border-slate-300 flex items-center justify-center bg-slate-50/50 aspect-[3/4]">
              <span className="text-slate-300 text-xs">Empty</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
