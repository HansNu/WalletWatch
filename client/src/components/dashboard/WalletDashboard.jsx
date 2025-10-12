import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';

function WalletDashboard() {
  const transactions = [
    { id: 1, name: 'Transaksi di Daring Deli', category: 'Food', date: '02 Oktober 2025, 20:30', amount: 'Rp205.000' },
    { id: 2, name: 'Transaksi di Daring Deli', category: 'Food', date: '02 Oktober 2025, 20:30', amount: 'Rp205.000' },
    { id: 3, name: 'Transaksi di Daring Deli', category: 'Food', date: '02 Oktober 2025, 20:30', amount: 'Rp205.000' },
    { id: 4, name: 'Transaksi di Daring Deli', category: 'Food', date: '02 Oktober 2025, 20:30', amount: 'Rp205.000' },
    { id: 5, name: 'Transaksi di Daring Deli', category: 'Food', date: '02 Oktober 2025, 20:30', amount: 'Rp205.000' },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Container with max width for larger screens */}
      <div className="max-w mx-auto bg-white text-black">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 pb-4 text-center">
          <h1 className="text-xl font-semibold">Summary</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Total Balance Card */}
          <div className="bg-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-2">Total Balance</p>
            <p className="text-4xl font-bold">Rp125.000.000</p>
          </div>

          {/* Income and Expense Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Income Card */}
            <div className="bg-gray-200 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-2">Income</p>
              <p className="text-2xl font-bold">Rp25.000.000</p>
            </div>

            {/* Expense Card */}
            <div className="bg-gray-200 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-2">Expense</p>
              <p className="text-2xl font-bold">Rp20.000.000</p>
            </div>
          </div>

          {/* Latest Transactions */}
          <div className="bg-gray-200 rounded-2xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Latest Transactions</h2>
              <button className="flex items-center text-sm font-medium hover:opacity-70">
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
                  {/* Left side - Icon and details */}
                  <div className="flex items-center space-x-3">
                    {/* Food Icon */}
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    
                    {/* Transaction details */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-sm">{transaction.name}</p>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{transaction.category}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                  </div>

                  {/* Right side - Amount */}
                  <p className="text-lg font-bold">{transaction.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-300 transition-colors">
          <Plus className="w-6 h-6" />
        </button>

        {/* Bottom Navigation */}
        <div className="bottom-0 left-0 right-0 bg-gray-200 border-t border-gray-300">
          <div className="max-w-md mx-auto flex justify-around items-center py-4">
            {/* Home Icon */}
            <button className="flex flex-col items-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </button>

            {/* Wallet Icon */}
            <button className="flex flex-col items-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </button>

            {/* List Icon */}
            <button className="flex flex-col items-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </button>

            {/* Profile Icon */}
            <button className="flex flex-col items-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletDashboard;