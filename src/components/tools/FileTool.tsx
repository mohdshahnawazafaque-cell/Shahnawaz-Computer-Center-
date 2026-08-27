import React, { useState } from 'react';
import { Folder, Upload, Zap, Download } from 'lucide-react';
import JSZip from 'jszip';

export const FileTool: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [renamedFiles, setRenamedFiles] = useState<{name: string, file: File}[]>([]);
  const [prefix, setPrefix] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRename = () => {
    const newFiles = files.map((f, i) => {
      const ext = f.name.split('.').pop();
      return {
        name: `${prefix}_${i + 1}.${ext}`,
        file: f
      };
    });
    setRenamedFiles(newFiles);
  };

  const createZip = async () => {
    const zip = new JSZip();
    const sourceFiles = renamedFiles.length > 0 ? renamedFiles : files.map(f => ({name: f.name, file: f}));
    
    sourceFiles.forEach(f => {
      zip.file(f.name, f.file);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "archive.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6 flex flex-col">
        
      
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <input type="file" multiple id="file-upload" className="hidden" onChange={handleFileChange} />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Files</span>
          <span className="text-xs text-slate-500 mt-1">Supports all file types. Max 50MB total recommended for browser.</span>
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

          {(toolId === 'multi-rename' || toolId === 'file-rename') && (
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="New Prefix (e.g. Photo)" 
                value={prefix} 
                onChange={e => setPrefix(e.target.value)} 
                className="flex-1 p-2 border rounded-lg text-sm" 
              />
              <button onClick={handleRename} className="px-4 py-2 bg-[#0B2545] text-white font-bold rounded-lg text-sm">Rename</button>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={createZip} className="flex-1 py-3 bg-[#990000] text-white font-bold rounded-lg flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download as ZIP
            </button>
          </div>

          {renamedFiles.length > 0 && (
             <div className="text-xs text-emerald-600 font-bold mt-2">
               Files renamed successfully! Click Download to save them.
             </div>
          )}
        </div>
      )}
    
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col min-h-[400px]">
        {files.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-slate-400">
            <div>
              <Folder className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>Uploaded files will appear here</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4">File Preview ({files.length} files)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {files.slice(0, 12).map((f, i) => (
                 <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                   <Folder className="w-8 h-8 text-blue-500 mb-2" />
                   <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate w-full">{renamedFiles[i]?.name || f.name}</span>
                   <span className="text-[10px] text-slate-500">{(f.size / 1024).toFixed(1)} KB</span>
                 </div>
               ))}
               {files.length > 12 && (
                 <div className="bg-slate-200 dark:bg-slate-700 border-none rounded-lg p-3 flex items-center justify-center text-center text-slate-500 text-xs font-bold">
                   +{files.length - 12} more
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};