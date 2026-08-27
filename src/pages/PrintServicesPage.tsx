import React, { useState } from 'react';
import { Search, Printer, Car, FileBadge, FileText, ArrowRight, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const PrintServicesPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { balance, processServiceOrder } = useWallet();
  const [search, setSearch] = useState('');
  
  // Modal State
  const [selectedService, setSelectedService] = useState<any>(null);
  const [orderInput, setOrderInput] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [orderMessage, setOrderMessage] = useState('');

  const services = [
    { id: 'rc', name: 'RC PDF Print', price: 50, icon: Car, desc: 'Instant vehicle RC download in PDF format using vehicle number.', inputLabel: 'Vehicle Registration Number', inputPlaceholder: 'e.g. UP32AB1234' },
    { id: 'insurance', name: 'Insurance PDF', price: 40, icon: FileBadge, desc: 'Download vehicle insurance copy instantly via fast API.', inputLabel: 'Vehicle Registration Number', inputPlaceholder: 'e.g. UP32AB1234' },
    { id: 'challan', name: 'Challan Print', price: 30, icon: FileText, desc: 'Check and print vehicle pending/paid challan receipts.', inputLabel: 'Vehicle/Challan Number', inputPlaceholder: 'e.g. UP32AB1234 or Challan ID' },
    { id: 'doc', name: 'Document Print', price: 10, icon: Printer, desc: 'High-quality color/B&W document printing service.', inputLabel: 'Document ID / Link', inputPlaceholder: 'Paste link or document reference' },
  ];

  const handleUseServiceClick = (service: any) => {
    setSelectedService(service);
    setOrderStatus('idle');
    setOrderInput('');
    setOrderMessage('');
  };

  const handleCloseModal = () => {
    if (orderStatus === 'processing') return;
    setSelectedService(null);
  };

  const handleConfirmOrder = async () => {
    if (!orderInput.trim()) {
      setOrderMessage('Please provide the required details.');
      setOrderStatus('error');
      return;
    }

    if (balance < selectedService.price) {
      setOrderMessage(`Insufficient balance. Please add at least ₹${selectedService.price - balance} to your wallet.`);
      setOrderStatus('error');
      return;
    }

    setOrderStatus('processing');
    setOrderMessage('Processing your order securely...');

    const result = await processServiceOrder(selectedService.price, selectedService.name, { input: orderInput });

    if (result.success) {
      setOrderStatus('success');
      setOrderMessage(result.message);
    } else {
      setOrderStatus('error');
      setOrderMessage(result.message);
    }
  };

  const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 py-6 min-h-screen relative">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#990000] pb-2">
          <div className="flex items-center gap-3">
            <Printer className="w-6 h-6 text-[#990000]" />
            <h1 className="text-xl md:text-2xl font-black text-[#0B2545] dark:text-white uppercase tracking-tight">
              Premium Print Services
            </h1>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg focus:border-[#990000] outline-none font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-5 py-2 bg-[#990000] text-white rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap shadow-sm">All Services</button>
          <button className="px-5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Vehicle</button>
          <button className="px-5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Documents</button>
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
                  <p className="text-sm font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded inline-block mt-1">₹{s.price.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1 font-medium">{s.desc}</p>
              <button 
                onClick={() => handleUseServiceClick(s)}
                className="w-full py-3 bg-[#0B2545] group-hover:bg-[#990000] text-white rounded-xl font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                Use Service <ArrowRight className="w-4 h-4" />
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
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2">Order Confirmed!</h4>
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
                      <p className="text-xl font-black text-slate-900 dark:text-white">₹{selectedService.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Wallet Balance</p>
                      <p className={`text-xl font-black ${balance >= selectedService.price ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ₹{balance.toFixed(2)}
                      </p>
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
                      {balance < selectedService.price && (
                        <button 
                          onClick={() => onNavigate('/wallet')}
                          className="mt-2 text-xs font-black text-rose-700 dark:text-rose-300 underline"
                        >
                          Go to Wallet to Add Money
                        </button>
                      )}
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
                        Confirm & Pay ₹{selectedService.price}
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

