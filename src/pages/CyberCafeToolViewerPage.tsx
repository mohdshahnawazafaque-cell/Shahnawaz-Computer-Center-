import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CYBER_CAFE_TOOLS } from '../data/cyberCafeData';
import { SEOHead } from '../components/SEOHead';
import { ImageEditorTool } from '../components/tools/ImageEditorTool';
import { PdfEditorTool } from '../components/tools/PdfEditorTool';
import { DocumentMakerTool } from '../components/tools/DocumentMakerTool';
import { PrintLayoutTool } from '../components/tools/PrintLayoutTool';
import { ScanOcrTool } from '../components/tools/ScanOcrTool';
import { QrBarcodeTool } from '../components/tools/QrBarcodeTool';
import { DailyUseTool } from '../components/tools/DailyUseTool';
import { FileTool } from '../components/tools/FileTool';

interface CyberCafeToolViewerPageProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const CyberCafeToolViewerPage: React.FC<CyberCafeToolViewerPageProps> = ({ onNavigate, currentPath }) => {
  const toolId = currentPath.split('/workspace/tool/')[1];
  const tool = CYBER_CAFE_TOOLS.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Tool Not Found</h1>
          <p className="text-slate-500 mb-6">The tool you are looking for does not exist or has been moved.</p>
          <button onClick={() => onNavigate('/workspace')} className="px-6 py-2 bg-[#0B2545] text-white font-bold rounded-lg shadow-sm">
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  const renderToolComponent = () => {
    switch (tool.componentKey) {
      case 'IMAGE_EDITOR':
        return <ImageEditorTool toolId={tool.id} />;
      case 'PDF_TOOL':
        return <PdfEditorTool toolId={tool.id} />;
      case 'DOCUMENT_MAKER':
        return <DocumentMakerTool toolId={tool.id} />;
      case 'PRINT_LAYOUT':
        return <PrintLayoutTool toolId={tool.id} />;
      case 'SCAN_OCR':
        return <ScanOcrTool toolId={tool.id} />;
      case 'QR_BARCODE':
        return <QrBarcodeTool toolId={tool.id} />;
      case 'DAILY_USE':
        return <DailyUseTool toolId={tool.id} />;
      case 'FILE_TOOL':
        return <FileTool toolId={tool.id} />;
      default:
        return (
          <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Component Missing</h2>
            <p className="text-slate-500">The component {tool.componentKey} is not mapped.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      <SEOHead title={`${tool.name} - Cyber Cafe Tools`} description='Cyber cafe tool' />
      
      {/* Header */}
      <div className="bg-[#0B2545] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('/workspace')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Back to Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <tool.icon className="w-5 h-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">{tool.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {renderToolComponent()}
      </div>
    </div>
  );
};
