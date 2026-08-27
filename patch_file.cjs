const fs = require('fs');
let code = fs.readFileSync('src/components/tools/FileTool.tsx', 'utf8');

code = code.replace(
  /<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-6">([\s\S]*?)<\/div>\s*\);\s*\};\s*$/m,
  (match, inner) => {
    return `<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6 flex flex-col">
        ${inner}
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
};`;
  }
);

fs.writeFileSync('src/components/tools/FileTool.tsx', code);
