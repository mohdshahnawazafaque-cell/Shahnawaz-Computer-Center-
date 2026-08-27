import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Link, Smartphone, Loader2 } from 'lucide-react';

export const QRCodeGeneratorTab: React.FC = () => {
  const [mode, setMode] = useState<'upi' | 'link'>('upi');
  
  // UPI State
  const [upiId, setUpiId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [amount, setAmount] = useState('');
  
  // Link State
  const [urlLink, setUrlLink] = useState('');

  const qrRef = useRef<SVGSVGElement>(null);

  const getQRValue = () => {
    if (mode === 'upi') {
      if (!upiId) return '';
      let upiString = `upi://pay?pa=${encodeURIComponent(upiId)}`;
      if (payeeName) upiString += `&pn=${encodeURIComponent(payeeName)}`;
      if (amount) upiString += `&am=${encodeURIComponent(amount)}`;
      upiString += '&cu=INR';
      return upiString;
    } else {
      return urlLink;
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if(ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr_code_${Date.now()}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const qrValue = getQRValue();

  return (
    <div className="space-y-5">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold">🔳 QR Code Generator:</span> Create custom QR codes for UPI payments (Google Pay, PhonePe, Paytm) or website links. Scan to pay or visit.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setMode('upi')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${mode === 'upi' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <Smartphone className="w-4 h-4" /> UPI Payment
            </button>
            <button
              onClick={() => setMode('link')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${mode === 'link' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <Link className="w-4 h-4" /> Website Link
            </button>
          </div>

          {mode === 'upi' ? (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1 text-xs">UPI ID (VPA) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210@ybl"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-emerald-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1 text-xs">Payee Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Shahnawaz Computer Center"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-emerald-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1 text-xs">Fixed Amount (₹) (Optional)</label>
                <input
                  type="number"
                  placeholder="Leave empty for open amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-emerald-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1 text-xs">Website URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={urlLink}
                  onChange={(e) => setUrlLink(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-blue-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col items-center justify-center min-h-[300px]">
          {qrValue ? (
            <div className="space-y-6 flex flex-col items-center w-full">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="M"
                  includeMargin={true}
                  ref={qrRef}
                />
              </div>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0B2545] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR Code PNG
              </button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto border-2 border-dashed border-slate-300 dark:border-slate-600">
                <Smartphone className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Enter {mode === 'upi' ? 'UPI ID' : 'URL'} to generate QR
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
