import React, { useState } from 'react';
import { FileText, Upload, Download, Layers, Scissors, Shield } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfEditorTool: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const processPDF = async () => {
    if (files.length === 0) return;
    setStatus('Processing...');
    try {
      if (toolId === 'pdf-merge') {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'merged.pdf');
        setStatus('Merge complete!');
      } else if (toolId === 'pdf-split') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        
        // Split first page as an example (since full split UI is complex for this stub)
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [0]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'split_page_1.pdf');
        setStatus('Split complete (Extracted Page 1)!');
      } else {
        setStatus('This specific PDF feature is in development. Please use Merge or Split for now.');
      }
    } catch (e: any) {
      setStatus('Error: ' + e.message);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6 flex flex-col">
        
      
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <input type="file" multiple accept=".pdf,image/*" id="pdf-upload" className="hidden" onChange={handleFileChange} />
        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Files (PDF/Images)</span>
          <span className="text-xs text-slate-500 mt-1">Select one or more files depending on the tool.</span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg max-h-40 overflow-y-auto">
            {files.map((f, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-slate-200 dark:border-slate-600 last:border-0">
                <span className="truncate max-w-[70%]">{f.name}</span>
                <span className="text-slate-500 font-bold">{(f.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>

          <button onClick={processPDF} className="w-full py-3 bg-[#990000] text-white font-bold rounded-lg flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Process & Download
          </button>

          {status && (
             <div className="text-xs text-emerald-600 font-bold mt-2 text-center">
               {status}
             </div>
          )}
        </div>
      )}
    
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="text-center text-slate-400 p-8">
          <FileText className="w-16 h-16 mx-auto mb-2 opacity-50" />
          <p>{files.length > 0 ? `${files.length} file(s) ready` : 'PDF preview will appear here'}</p>
        </div>
      </div>
    </div>
  );
};