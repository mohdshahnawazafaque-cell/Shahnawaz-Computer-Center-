import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Settings, Image as ImageIcon, RefreshCcw, Sun, PaintBucket } from 'lucide-react';

export const ImageEditorTool: React.FC<{ toolId: string }> = ({ toolId }) => {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [quality, setQuality] = useState(0.8);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [rotation, setRotation] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        imgRef.current = img;
        setImage(url);
      };
      img.src = url;
    }
  };

  useEffect(() => {
    if (!image || !imgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We can swap width/height if rotation is 90 or 270
    const isRotated = rotation % 180 !== 0;
    canvas.width = isRotated ? height : width;
    canvas.height = isRotated ? width : height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(imgRef.current, -width / 2, -height / 2, width, height);
    
  }, [image, width, height, brightness, contrast, grayscale, rotation]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const format = toolId === 'jpg-png' ? 'image/png' : toolId === 'jpg-webp' ? 'image/webp' : 'image/jpeg';
    const ext = format.split('/')[1];
    const dataUrl = canvasRef.current.toDataURL(format, quality);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `edited_image.${ext}`;
    a.click();
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Controls Sidebar */}
      <div className="w-full md:w-64 space-y-4 shrink-0">
        <label className="cursor-pointer block border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Upload Image</span>
        </label>

        {image && (
          <div className="space-y-4 text-sm">
            
            {['photo-resize', 'passport-maker', 'res-changer'].includes(toolId) && (
              <div className="space-y-2">
                <label className="font-bold text-slate-600 dark:text-slate-300 block">Dimensions</label>
                <div className="flex gap-2">
                  <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full p-2 border rounded-lg" placeholder="W" />
                  <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full p-2 border rounded-lg" placeholder="H" />
                </div>
              </div>
            )}

            {['photo-compress', 'kb-size'].includes(toolId) && (
              <div className="space-y-2">
                <label className="font-bold text-slate-600 dark:text-slate-300 block flex justify-between">
                  <span>Quality (Compression)</span>
                  <span>{Math.round(quality * 100)}%</span>
                </label>
                <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
              </div>
            )}

            {['img-bright', 'color-bw'].includes(toolId) && (
              <>
                <div className="space-y-2">
                  <label className="font-bold text-slate-600 dark:text-slate-300 block flex justify-between">
                    <span>Brightness</span>
                    <span>{brightness}%</span>
                  </label>
                  <input type="range" min="0" max="200" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-600 dark:text-slate-300 block flex justify-between">
                    <span>Contrast</span>
                    <span>{contrast}%</span>
                  </label>
                  <input type="range" min="0" max="200" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full" />
                </div>
              </>
            )}

            {toolId === 'color-bw' && (
              <button onClick={() => setGrayscale(100)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 font-bold rounded-lg border flex items-center justify-center gap-2">
                <PaintBucket className="w-4 h-4" /> Make Black & White
              </button>
            )}

            {['img-rotate'].includes(toolId) && (
              <button onClick={() => setRotation((r) => (r + 90) % 360)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 font-bold rounded-lg border flex items-center justify-center gap-2">
                <RefreshCcw className="w-4 h-4" /> Rotate 90°
              </button>
            )}

            <button onClick={handleDownload} className="w-full py-3 bg-[#0B2545] text-white font-bold rounded-lg flex items-center justify-center gap-2 mt-4 shadow-sm">
              <Download className="w-5 h-5" /> Download
            </button>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center min-h-[400px]">
        {!image ? (
          <div className="text-center text-slate-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p>Preview will appear here</p>
          </div>
        ) : (
          <div className="max-w-full max-h-[600px] overflow-auto p-4 flex items-center justify-center">
            <canvas ref={canvasRef} className="max-w-full h-auto shadow-sm" style={{ maxHeight: '500px' }}></canvas>
          </div>
        )}
      </div>

    </div>
  );
};
