import React, { useState } from 'react';
import { ArrowLeft, Printer, CheckCircle2, Loader2, Upload } from 'lucide-react';

interface PrintServicesPageProps {
  onNavigate: (path: string) => void;
}

export const PrintServicesPage: React.FC<PrintServicesPageProps> = ({ onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState<'bw' | 'color'>('bw');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handlePrintRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setStatus('uploading');
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="w-full bg-[#f8f9fa] dark:bg-slate-900 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl border-2 border-slate-100 dark:border-slate-700">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-2">Request Received!</h2>
          <p className="text-slate-600 dark:text-slate-300 font-medium mb-8">
            Your document has been sent for free printing. Please collect it from the center shortly.
          </p>
          <button 
            onClick={() => onNavigate('/')}
            className="w-full py-4 bg-[#0B2545] text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f9fa] dark:bg-slate-900 min-h-screen py-8">
      <div className="max-w-xl mx-auto px-4">
        
        <button 
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0B2545] dark:hover:text-white transition-colors text-sm font-bold mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border-2 border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Printer className="w-8 h-8 text-rose-500" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Free Print Service</h1>
          </div>
          <p className="text-center text-slate-500 dark:text-slate-400 font-bold mb-8 text-sm">Upload your document and get it printed for free.</p>

          <form onSubmit={handlePrintRequest} className="space-y-6">
            
            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase">Document <span className="text-rose-500">*</span></label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  required
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                {file ? (
                  <p className="text-slate-900 dark:text-white font-bold">{file.name}</p>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Tap to select or drop file here</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Copies */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase">Copies</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5"
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 bg-transparent rounded-xl p-3 outline-none focus:border-rose-500 font-bold dark:text-white"
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase">Type</label>
                <select 
                  value={color}
                  onChange={(e) => setColor(e.target.value as 'bw' | 'color')}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 bg-transparent rounded-xl p-3 outline-none focus:border-rose-500 font-bold dark:text-white"
                >
                  <option value="bw">Black & White</option>
                  <option value="color">Color</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={status === 'uploading' || !file}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'uploading' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
              ) : (
                <><Printer className="w-5 h-5" /> Print for Free</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
