import React, { useState, useMemo } from 'react';
import { ArrowLeft, Printer, FileText, FileBadge, CarFront, FileHeart, Scan, X, Loader2, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

// Predefined list of print services
const PRINT_SERVICES = [
  { id: '1', name: 'Aadhaar Card Print', desc: 'High quality color print of e-Aadhaar card on A4/PVC.', price: 0, category: 'Documents', icon: FileBadge, inputPlaceholder: 'Enter Aadhaar No. / Enrolment ID', inputLabel: 'Aadhaar Details' },
  { id: '2', name: 'PAN Card Print', desc: 'Color print of e-PAN card on A4 or PVC card.', price: 0, category: 'Documents', icon: FileText, inputPlaceholder: 'Enter PAN No. or Ack No.', inputLabel: 'PAN Details' },
  { id: '3', name: 'Vehicle RC Print', desc: 'Print of Vehicle Registration Certificate (RC).', price: 0, category: 'Vehicle', icon: CarFront, inputPlaceholder: 'Enter Vehicle Registration Number', inputLabel: 'Vehicle No.' },
  { id: '4', name: 'Ayushman Card', desc: 'Ayushman Bharat card color print out.', price: 0, category: 'Documents', icon: FileHeart, inputPlaceholder: 'Enter PMJAY ID / Mobile Number', inputLabel: 'Ayushman Details' },
  { id: '5', name: 'Standard Document Print', desc: 'Black & White or Color printing of any standard PDF/Document.', price: 0, category: 'General', icon: Printer, inputPlaceholder: 'Enter Document URL or Description', inputLabel: 'Document Details' },
  { id: '6', name: 'Photo & Document Scan', desc: 'High resolution scanning of photos and documents to PDF/JPG.', price: 0, category: 'General', icon: Scan, inputPlaceholder: 'Enter description of document to scan', inputLabel: 'Scan Details' },
];

interface PrintServicesPageProps {
  onNavigate: (path: string) => void;
}

export const PrintServicesPage: React.FC<PrintServicesPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  
  // Order Modal State
  const [selectedService, setSelectedService] = useState<any>(null);
  const [orderInput, setOrderInput] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [orderMessage, setOrderMessage] = useState('');

  const filtered = useMemo(() => {
    return PRINT_SERVICES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleUseServiceClick = (service: any) => {
    setSelectedService(service);
    setOrderInput('');
    setOrderStatus('idle');
    setOrderMessage('');
  };

  const handleCloseModal = () => {
    if (orderStatus === 'processing') return;
    setSelectedService(null);
  };

  const handleConfirmOrder = async () => {
    if (!orderInput.trim()) {
      setOrderStatus('error');
      setOrderMessage('Please provide the required details.');
      return;
    }

    setOrderStatus('processing');
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    setOrderStatus('success');
    setOrderMessage(`Your request for ${selectedService.name} has been placed successfully.`);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen">
      <SEOHead 
        title="Print Services - Shahnawaz Computer Center" 
        description="Fast and high-quality document printing services including Aadhaar, PAN, Vehicle RC, and more."
      />
      
      {/* Header */}
      <div className="bg-[#0B2545] text-white py-8 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-4">
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-bold w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">Print & Scan Services</h1>
              <p className="text-slate-300 text-sm max-w-xl">
                High-quality printing, scanning, and lamination services for documents like Aadhaar, PAN, and RC.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Available Services</h2>
          <div className="relative w-full md:w-auto">
            <Scan className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg focus:border-[#990000] outline-none font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:border-[#990000] transition-colors flex flex-col h-full group">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl text-[#0B2545] dark:text-amber-400 group-hover:bg-[#0B2545] group-hover:text-amber-400 transition-colors">
                  <s.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">{s.name}</h3>
                  <p className="text-sm font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded inline-block mt-1">Free</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1 font-medium">{s.desc}</p>
              
              <button 
                onClick={() => handleUseServiceClick(s)}
                className="w-full py-3 bg-[#0B2545] group-hover:bg-[#990000] text-white rounded-xl font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                Use Service <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-bold">
              No services found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="bg-[#0B2545] px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-white uppercase tracking-wider flex items-center gap-2">
                <selectedService.icon className="w-5 h-5 text-amber-400" />
                {selectedService.name}
              </h3>
              <button 
                onClick={handleCloseModal}
                disabled={orderStatus === 'processing'}
                className="text-slate-300 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              {orderStatus === 'success' ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2">Request Confirmed!</h4>
                  <p className="text-slate-600 dark:text-slate-300 font-medium mb-6">
                    {orderMessage}
                  </p>
                  <button 
                    onClick={handleCloseModal}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase tracking-wider transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Service Fee</p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">Free</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {selectedService.inputLabel} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={orderInput}
                      onChange={(e) => setOrderInput(e.target.value)}
                      placeholder={selectedService.inputPlaceholder}
                      disabled={orderStatus === 'processing'}
                      className="w-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg p-3 outline-none focus:border-[#0B2545] dark:focus:border-amber-400 dark:text-white font-bold disabled:opacity-50"
                    />
                  </div>
                  
                  {orderStatus === 'error' && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg">
                      <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{orderMessage}</p>
                    </div>
                  )}

                  <button 
                    onClick={handleConfirmOrder}
                    disabled={orderStatus === 'processing' || !orderInput.trim()}
                    className="w-full py-3 bg-[#990000] hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {orderStatus === 'processing' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Request
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
