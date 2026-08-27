import React from 'react';

interface ToolLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 pb-6 md:pb-0 md:pr-6 flex flex-col justify-between">
        {leftPanel}
      </div>
      
      {/* Preview / Main Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center min-h-[400px]">
        {rightPanel}
      </div>
    </div>
  );
};
