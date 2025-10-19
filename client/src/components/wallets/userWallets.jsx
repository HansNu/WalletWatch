import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, MoreVertical, Plus, CreditCard, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { routes } from '../../constants/navigationRoutes';
import { NavLink } from 'react-router-dom';
import { urlconstant } from '../../constants/urlConstant';
import axios from 'axios';
import { supabase } from '../../supabaseClient';

const FinanceAccountsApp = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'mBCA', type: 'Debit', balance: 5000000, icon: '💳' },
    { id: 2, name: 'Blu Savings', type: 'Debit', balance: 5000000, icon: '💰' },
    { id: 3, name: 'Credit Card HSBC', type: 'Credit', balance: 5000000, icon: '💳' }
  ]);

  const [showMenu, setShowMenu] = useState(null);
  const [balance, setBalance] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const reqIncome = {
        userId: user.id,
        transactionType: 'Income'
      }

      const reqExpense = {
        userId: user.id,
        transactionType: 'Expense'
      }

      const realBalance = await axios.post(urlconstant.getTotalBalanceByUserId, { userId: user.id });
      setBalance(realBalance.data.totalBalance);

      const realLiabilities = await axios.post(urlconstant.getLiabilitiesByUserId, { userId: user.id});
      setLiabilities(realLiabilities.data.liabilities);

      const total = realBalance.data.totalBalance - realLiabilities.data.liabilities;
      setTotalBalance(total);
    }
    catch (err) {
      console.error('Error:', err);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center px-2 py-1 rounded transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
    }`;

  // const handleDelete = (id) => {
  //   setAccounts(accounts.filter(acc => acc.id !== id));
  //   setShowMenu(null);
  // };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'Debit': return <CreditCard className="w-5 h-5" />;
      case 'Cash' : return <DollarSign className="w-5 h-5" />;
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
    <div className="min-h-screen bg-gray-800">
      {/* Header */}
      <div className="top bg-gray-900 text-white p-6 text-center">
        <h1 className="text-xl font-semibold">Accounts</h1>
      </div>

      {/* Total Balance Card */}
      <div className="max-w-3xl mx-auto text-black py-9">
        <div className="p-5 space-y-4">

          <div className="bg-gray-200 rounded-2xl p-6 mb-4">
            <div className="text-gray-700 text-sm mb-1">Total Balance</div>
            <div className="text-gray-900 text-4xl font-bold">
              {(totalBalance).toLocaleString('in')}
            </div>
          </div>

          {/* Balance and Liabilities */}
          <div className=" grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-200 rounded-2xl p-4">
              <div className="text-gray-700 text-sm mb-1">Balance</div>
              <div className="text-gray-900 text-xl font-semibold">
                {(balance).toLocaleString('in')}
              </div>
            </div>
            <div className="bg-gray-200 rounded-2xl p-4">
              <div className="text-gray-700 text-sm mb-1">Liabilities</div>
              <div className="text-gray-900 text-xl font-semibold">
                {(liabilities).toLocaleString('in')}
              </div>
            </div>
          </div>

          {/* Accounts List */}
          <div className="mb-6">

            {Object.entries(groupedAccounts).map(([type, accs]) => (
              <div key={type} className=" mb-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2 px-2">
                  {getCategoryIcon(type)}
                  <span>{type}</span>
                </div>

                {accs.map((account) => (
                  <div key={account.id} className="bg-gray-200 rounded-2xl p-4 mb-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{account.icon}</div>
                        <div>
                          <div className="text-gray-900 font-medium">{account.name}</div>
                          <div className={`text-xl font-semibold ${account.type === 'Credit' ? 'text-red-600' : 'text-gray-900'}`}>
                            {account.balance}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-300 rounded-2xl transition-colors">
                          <Edit2 className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="p-2 hover:bg-gray-300 rounded-2xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => setShowMenu(showMenu === account.id ? null : account.id)}
                          className="p-2 hover:bg-gray-300 rounded-2xl transition-colors"
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

          {/* Add New Account Button */}
          <button className=" w-full bg-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-900 font-medium hover:bg-gray-300 transition-colors">
            <Plus className="w-5 h-5" />
            Add New Accounts
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-200 border-t border-gray-300">
        <div className="max-w-md mx-auto flex justify-around items-center py-6">

          <NavLink to={routes.walletDashboard} className={navLinkClass}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </NavLink>

          <NavLink to={routes.userWallet} className={navLinkClass}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </NavLink>

          <button className="flex flex-col items-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
          </button>


          <button className="flex flex-col items-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceAccountsApp;