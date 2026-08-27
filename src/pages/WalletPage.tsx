import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet, History, ArrowRight, Activity, Printer, CheckCircle2 } from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { balance, transactions, addMoney } = useWallet();
  const [amount, setAmount] = useState<number>(100);

  const handleAdd = () => {
    addMoney(amount);
    alert('Payment gateway integration placeholder. Added ₹' + amount);
  };

  const recentActivities = transactions.filter(t => t.type === 'debit');

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 py-6 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center gap-3 border-b-2 border-[#990000] pb-2">
          <Wallet className="w-6 h-6 text-[#990000]" />
          <h1 className="text-xl md:text-2xl font-black text-[#0B2545] dark:text-white uppercase tracking-tight">
            My Dashboard & Wallet
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content (Left: 2 Columns on LG) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Balance Card */}
              <div className="bg-[#990000] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-2 text-red-100 mb-2 font-medium">
                  <Wallet className="w-5 h-5" />
                  Available Balance
                </div>
                <div className="text-5xl font-black tracking-tight">
                  ₹{balance.toFixed(2)}
                </div>
                <p className="mt-4 text-xs text-red-200">
                  Use this balance for instant print services, RC downloads, and challan payments.
                </p>
              </div>

              {/* Add Money Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Add Money</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[100, 250, 500].map(amt => (
                    <button 
                      key={amt} 
                      onClick={() => setAmount(amt)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                        amount === amt 
                          ? 'bg-red-50 border-[#990000] text-[#990000] dark:bg-red-900/20 dark:text-red-400' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Custom Amount (₹)</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full border-2 border-slate-300 dark:border-slate-600 bg-transparent rounded-lg p-3 outline-none focus:border-[#990000] dark:text-white font-bold"
                  />
                </div>
                <button 
                  onClick={handleAdd}
                  className="w-full py-3 bg-[#0B2545] hover:bg-slate-800 text-amber-400 rounded-lg font-black uppercase tracking-wider shadow-sm transition-colors flex justify-center items-center gap-2"
                >
                  Proceed to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b-2 border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-5 h-5 text-[#990000]" />
                  Recent Transactions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-wider border-b-2 border-slate-200 dark:border-slate-700">
                      <th className="p-4">Txn ID / Date</th>
                      <th className="p-4">Details</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold">
                          No transactions yet. Add money to get started.
                        </td>
                      </tr>
                    )}
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-4">
                          <div className="font-black text-slate-900 dark:text-white">{t.id}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            t.type === 'recharge' ? 'bg-emerald-100 text-emerald-700' :
                            t.type === 'debit' ? 'bg-rose-100 text-rose-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {t.type}
                          </span>
                          {t.service && <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">{t.service}</div>}
                        </td>
                        <td className={`p-4 text-right font-black ${t.type === 'recharge' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type === 'recharge' ? '+' : '-'}₹{t.amount.toFixed(2)}
                        </td>
                        <td className="p-4 text-right font-bold text-slate-700 dark:text-slate-300">
                          ₹{t.balanceAfter.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar Content (Right: 1 Column on LG) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Recent Activity
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-1 rounded-lg">
                  {recentActivities.length} Tasks
                </span>
              </div>
              
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm shrink-0 border border-slate-100 dark:border-slate-700">
                      <Printer className="w-4 h-4 text-[#0B2545] dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {activity.service || 'Service Request'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                ))}
                
                {recentActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      No recent activities.
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Your completed print and service requests will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
