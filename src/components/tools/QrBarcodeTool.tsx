import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, Wifi, Link as LinkIcon, Download } from 'lucide-react';

export const QrBarcodeTool: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [data, setData] = useState('https://example.com');
  const [type, setType] = useState('url');

  const getQRData = () => {
    return data;
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.download = "qrcode.png";
        a.href = pngFile;
        a.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Controls */}
      <div className="w-full md:w-80 space-y-4 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6">
        
        <div className="space-y-3">
           <div>
             <label className="block text-xs font-bold text-slate-500 mb-1">Enter Data</label>
             <input 
               type="text" 
               value={data} 
               onChange={e => setData(e.target.value)} 
               className="w-full p-2 border rounded-lg text-sm" 
               placeholder="Enter URL, Text, or UPI ID..."
             />
           </div>
        </div>

        <button onClick={downloadQR} className="w-full py-3 bg-[#0B2545] text-white font-bold rounded-lg flex items-center justify-center gap-2 mt-4">
          <Download className="w-5 h-5" /> Download QR Code
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center min-h-[400px]">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
           <QRCodeSVG 
             id="qr-code-svg" 
             value={getQRData()} 
             size={256} 
             level="H" 
             includeMargin={true} 
           />
           <p className="mt-4 text-xs font-bold text-slate-500 break-all max-w-[256px] mx-auto">
             {data || 'No data'}
           </p>
        </div>
      </div>

    </div>
  );
};
