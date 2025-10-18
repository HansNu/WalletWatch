import React, { useState } from 'react';
import { Edit2, Trash2, MoreVertical, Plus, CreditCard, Wallet, TrendingUp, DollarSign } from 'lucide-react';

const FinanceAccountsApp = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'mBCA', type: 'Debit', balance: 5000000, icon: '💳' },
    { id: 2, name: 'Blu Savings', type: 'Debit', balance: 5000000, icon: '💰' },
    { id: 3, name: 'Credit Card HSBC', type: 'Credit', balance: 5000000, icon: '💳' }
  ]);

  const [showMenu, setShowMenu] = useState(null);

  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  const calculateBalance = () => {
    return accounts
      .filter(acc => acc.type !== 'Credit')
      .reduce((sum, acc) => sum + acc.balance, 0);
  };

  const calculateLiabilities = () => {
    return accounts
      .filter(acc => acc.type === 'Credit')
      .reduce((sum, acc) => sum + acc.balance, 0);
  };

  const calculateTotalBalance = () => {
    return calculateBalance() - calculateLiabilities();
  };

  const handleDelete = (id) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
    setShowMenu(null);
  };

  const getCategoryIcon = (type) => {
    switch(type) {
      case 'Debit': return <DollarSign className="w-5 h-5" />;
      case 'Credit': return <CreditCard className="w-5 h-5" />;
      case 'E-Wallet': return <Wallet className="w-5 h-5" />;
      case 'Investments': return <TrendingUp className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const groupedAccounts = accounts.reduce((groups, account) => {
    if (!groups[account.type]) {
      groups[account.type] = [];
    }
    groups[account.type].push(account);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-400">Accounts</h1>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gray-200 rounded-lg p-6 mb-4">
        <div className="text-gray-700 text-sm mb-1">Total Balance</div>
        <div className="text-gray-900 text-4xl font-bold">
          {formatCurrency(calculateTotalBalance())}
        </div>
      </div>

      {/* Balance and Liabilities */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-200 rounded-lg p-4">
          <div className="text-gray-700 text-sm mb-1">Balance</div>
          <div className="text-gray-900 text-xl font-semibold">
            {formatCurrency(calculateBalance())}
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg p-4">
          <div className="text-gray-700 text-sm mb-1">Liabilities</div>
          <div className="text-gray-900 text-xl font-semibold">
            {formatCurrency(calculateLiabilities())}
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="mb-6">
        <h2 className="text-gray-400 text-sm mb-3">Accounts</h2>
        
        {Object.entries(groupedAccounts).map(([type, accs]) => (
          <div key={type} className="mb-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2 px-2">
              {getCategoryIcon(type)}
              <span>{type}</span>
            </div>
            
            {accs.map((account) => (
              <div key={account.id} className="bg-gray-200 rounded-lg p-4 mb-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{account.icon}</div>
                    <div>
                      <div className="text-gray-900 font-medium">{account.name}</div>
                      <div className={`text-xl font-semibold ${account.type === 'Credit' ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-300 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5 text-gray-700" />
                    </button>
                    <button 
                      onClick={() => handleDelete(account.id)}
                      className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-gray-700" />
                    </button>
                    <button 
                      onClick={() => setShowMenu(showMenu === account.id ? null : account.id)}
                      className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-medium">Recent Activities</h2>
          <button className="text-gray-400 text-sm">View All →</button>
        </div>
        
        <div className="bg-pink-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📈</div>
            <div>
              <div className="text-gray-900 font-medium">Transaksi di Daring Deli</div>
              <div className="text-gray-600 text-xs">02 Oktober 2025, 20:30</div>
            </div>
          </div>
          <div className="text-gray-900 font-semibold">Rp205.000</div>
        </div>
      </div>

      {/* Add New Account Button */}
      <button className="w-full bg-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 text-gray-900 font-medium hover:bg-gray-300 transition-colors">
        <Plus className="w-5 h-5" />
        Add New Accounts
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around items-center py-4">
        <button className="p-3">
          <div className="grid grid-cols-2 gap-1 w-6 h-6">
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
          </div>
        </button>
        <button className="p-3">
          <Wallet className="w-6 h-6" />
        </button>
        <button className="p-3">
          <div className="w-6 h-6 border-2 border-white rounded"></div>
        </button>
        <button className="p-3">
          <div className="w-6 h-6 border-2 border-white rounded-full"></div>
        </button>
      </div>
    </div>
  );
};

export default FinanceAccountsApp;