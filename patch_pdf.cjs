const fs = require('fs');
let code = fs.readFileSync('src/components/tools/PdfEditorTool.tsx', 'utf8');

// Replace the return statement wrapper
code = code.replace(
  /<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-6">([\s\S]*?)<\/div>\s*\);\s*\};\s*$/m,
  (match, inner) => {
    return `<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6 flex flex-col">
        ${inner}
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="text-center text-slate-400 p-8">
          <FileText className="w-16 h-16 mx-auto mb-2 opacity-50" />
          <p>{files.length > 0 ? \`\${files.length} file(s) ready\` : 'PDF preview will appear here'}</p>
        </div>
      </div>
    </div>
  );
};`;
  }
);

fs.writeFileSync('src/components/tools/PdfEditorTool.tsx', code);
