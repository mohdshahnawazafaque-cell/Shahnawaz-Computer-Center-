import React, { useState } from 'react';
import { Calculator, Divide, Type, Scissors, AlignLeft, Receipt, Clock } from 'lucide-react';

export const DailyUseTool: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculateAge = () => {
    if (!input1 || !input2) return;
    const d1 = new Date(input1);
    const d2 = new Date(input2);
    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    setResult(`${years} Years, ${months} Months, ${days} Days`);
  };

  const wordCount = () => {
    const text = input1.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    setResult(`${words} Words, ${chars} Characters`);
  };

  const toCase = (type: 'upper' | 'lower' | 'title') => {
    if (type === 'upper') setResult(input1.toUpperCase());
    if (type === 'lower') setResult(input1.toLowerCase());
    if (type === 'title') setResult(input1.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()));
  };

  const textClean = () => {
    let text = input1.replace(/\s+/g, ' ').trim();
    setResult(text);
  };

  const gstCalc = (type: 'add' | 'remove') => {
    const amt = parseFloat(input1);
    const pct = parseFloat(input2);
    if (isNaN(amt) || isNaN(pct)) return;
    if (type === 'add') {
      const gst = (amt * pct) / 100;
      setResult(`GST: ₹${gst.toFixed(2)} | Total: ₹${(amt + gst).toFixed(2)}`);
    } else {
      const base = amt / (1 + pct / 100);
      const gst = amt - base;
      setResult(`Base: ₹${base.toFixed(2)} | GST: ₹${gst.toFixed(2)}`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6 flex flex-col">
        
      
      {['age-calc', 'date-diff'].includes(toolId) && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Start Date / DOB</label>
              <input type="date" value={input1} onChange={e => setInput1(e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">End Date / As on Date</label>
              <input type="date" value={input2} onChange={e => setInput2(e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <button onClick={calculateAge} className="w-full py-2 bg-[#0B2545] text-white font-bold rounded-lg">Calculate Difference</button>
        </div>
      )}

      {['word-count'].includes(toolId) && (
        <div className="space-y-4">
          <textarea value={input1} onChange={e => setInput1(e.target.value)} rows={5} placeholder="Paste text here..." className="w-full p-2 border rounded-lg"></textarea>
          <button onClick={wordCount} className="w-full py-2 bg-[#0B2545] text-white font-bold rounded-lg">Count Words</button>
        </div>
      )}

      {['case-conv', 'text-clean'].includes(toolId) && (
        <div className="space-y-4">
          <textarea value={input1} onChange={e => setInput1(e.target.value)} rows={5} placeholder="Paste text here..." className="w-full p-2 border rounded-lg"></textarea>
          {toolId === 'case-conv' ? (
            <div className="flex gap-2">
              <button onClick={() => toCase('upper')} className="flex-1 py-2 bg-slate-100 font-bold rounded-lg border">UPPERCASE</button>
              <button onClick={() => toCase('lower')} className="flex-1 py-2 bg-slate-100 font-bold rounded-lg border">lowercase</button>
              <button onClick={() => toCase('title')} className="flex-1 py-2 bg-slate-100 font-bold rounded-lg border">Title Case</button>
            </div>
          ) : (
            <button onClick={textClean} className="w-full py-2 bg-[#0B2545] text-white font-bold rounded-lg">Clean Extra Spaces</button>
          )}
        </div>
      )}

      {['gst-calc', 'percent-calc'].includes(toolId) && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Amount (₹)</label>
              <input type="number" value={input1} onChange={e => setInput1(e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Percentage (%)</label>
              <input type="number" value={input2} onChange={e => setInput2(e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => gstCalc('add')} className="flex-1 py-2 bg-[#0B2545] text-white font-bold rounded-lg">Add % (GST)</button>
            <button onClick={() => gstCalc('remove')} className="flex-1 py-2 bg-[#990000] text-white font-bold rounded-lg">Remove % (GST)</button>
          </div>
        </div>
      )}

      {/* Fallback for others */}
      {!['age-calc', 'date-diff', 'word-count', 'case-conv', 'text-clean', 'gst-calc', 'percent-calc'].includes(toolId) && (
        <div className="text-center py-8">
          <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Universal Calculator Interface</p>
          <input type="text" placeholder="Enter expression (e.g. 100 * 5%)" className="mt-4 w-full p-3 border rounded-lg font-mono text-center" />
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-xs text-emerald-600 font-bold mb-1">Result</p>
          <div className="text-lg font-black text-emerald-900 whitespace-pre-wrap break-words">{result}</div>
        </div>
      )}
    
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
};