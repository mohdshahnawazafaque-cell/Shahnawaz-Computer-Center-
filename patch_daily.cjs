const fs = require('fs');
let code = fs.readFileSync('src/components/tools/DailyUseTool.tsx', 'utf8');

code = code.replace(
  /<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-6">([\s\S]*?)<\/div>\s*\);\s*\};\s*$/m,
  (match, inner) => {
    // Extract the result rendering block from inner
    let newInner = inner.replace(/\{result && \([\s\S]*?\}\)/m, '');
    
    return `<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6 flex flex-col">
        ${newInner}
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center min-h-[400px]">
        {result ? (
          <div className="text-center w-full max-w-lg">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-3 uppercase tracking-wider">Result</p>
            <div className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              {result}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400">
             <Calculator className="w-16 h-16 mx-auto mb-2 opacity-50" />
             <p>Results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};`;
  }
);

fs.writeFileSync('src/components/tools/DailyUseTool.tsx', code);
