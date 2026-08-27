import React from 'react';
import { Bot, Sparkles, Zap, MessageSquareText, ArrowRight } from 'lucide-react';

export const AISectionUI: React.FC = () => {
  return (
    <section className="w-full my-6 bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 rounded-2xl overflow-hidden shadow-xl border border-indigo-700/50 relative group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Text and CTA */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-200 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>New Feature Available</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Shahnawaz AI</span> Assistant
          </h2>
          
          <p className="text-indigo-100/90 text-sm sm:text-base max-w-xl mx-auto md:mx-0 font-medium">
            Get instant answers to your questions about government jobs, online forms, admit cards, and eligibility criteria. Our new AI assistant is available 24/7.
          </p>
          
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => {
                // Find and click the floating chat button to open it
                const chatBtn = document.querySelector('button[aria-label="Toggle AI Assistant"]') as HTMLButtonElement;
                if (chatBtn) chatBtn.click();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Try AI Chat Now</span>
            </button>
            <a href="#table-latest-jobs" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-800/50 hover:bg-indigo-800 text-white border border-indigo-600/50 rounded-xl font-bold text-sm transition-all">
              <span>View Latest Jobs</span>
              <ArrowRight className="w-4 h-4 text-indigo-300" />
            </a>
          </div>
        </div>

        {/* Right Side: Features / Visuals */}
        <div className="w-full md:w-auto flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Instant Answers</h4>
              <p className="text-indigo-200 text-xs mt-0.5">No waiting. Get immediate responses about eligibility and deadlines.</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
              <MessageSquareText className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Form Assistance</h4>
              <p className="text-indigo-200 text-xs mt-0.5">Need help understanding what documents are required? Just ask.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
