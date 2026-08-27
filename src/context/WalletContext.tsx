import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Transaction {
  id: string;
  amount: number;
  type: 'recharge' | 'debit' | 'refund' | 'credit';
  service?: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  balanceAfter: number;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => Promise<void>;
  deductMoney: (amount: number, serviceName: string) => Promise<boolean>;
  processServiceOrder: (amount: number, serviceName: string, orderDetails: any) => Promise<{ success: boolean; message: string; transactionId?: string }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addMoney = async (amount: number) => {
    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setBalance(prev => {
      const newBal = prev + amount;
      setTransactions(t => [{
        id: 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        amount,
        type: 'recharge',
        date: new Date().toISOString(),
        status: 'success',
        balanceAfter: newBal
      }, ...t]);
      return newBal;
    });
  };

  const deductMoney = async (amount: number, serviceName: string) => {
    if (balance < amount) return false;
    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let isSuccess = false;
    setBalance(prev => {
      if (prev < amount) {
        isSuccess = false;
        return prev;
      }
      const newBal = prev - amount;
      setTransactions(t => [{
        id: 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        amount,
        type: 'debit',
        service: serviceName,
        date: new Date().toISOString(),
        status: 'success',
        balanceAfter: newBal
      }, ...t]);
      isSuccess = true;
      return newBal;
    });
    return isSuccess;
  };

  const processServiceOrder = async (amount: number, serviceName: string, orderDetails: any) => {
    // 1. Verify Balance securely (simulated server-side check)
    if (balance < amount) {
      return { success: false, message: 'Insufficient wallet balance.' };
    }

    // 2. Simulate Service Processing (API call to fetch RC/Challan etc)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. Deduct charges only AFTER successful order confirmation
    const deductionSuccess = await deductMoney(amount, serviceName);

    if (deductionSuccess) {
      return { 
        success: true, 
        message: 'Order processed successfully. Charges deducted.', 
        transactionId: transactions[0]?.id 
      };
    } else {
      return { success: false, message: 'Transaction failed during deduction.' };
    }
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addMoney, deductMoney, processServiceOrder }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
