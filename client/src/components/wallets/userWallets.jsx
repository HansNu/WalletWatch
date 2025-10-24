import React, { useState, useEffect, useMemo } from 'react';
import { Edit2, Trash2, Plus, CreditCard, TrendingUp, DollarSign, User, Wallet, List, LayoutGrid } from 'lucide-react';
import { routes } from '../../constants/navigationRoutes';
import { NavLink, useNavigate } from 'react-router-dom';
import { urlconstant } from '../../constants/urlConstant';
import axios from 'axios';
import { supabase } from '../../supabaseClient';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function userWallets() {
  const getCategoryIcon = (type) => {
    switch (type) {
      case 'Debit': return <CreditCard className="w-5 h-5" />;
      case 'Cash': return <DollarSign className="w-5 h-5" />;
      case 'Credit': return <CreditCard className="w-5 h-5" />;
      case 'E-Wallet': return <Wallet className="w-5 h-5" />;
      case 'Investments': return <TrendingUp className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center px-2 py-1 rounded transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
    }`;

  const [formAccounts, setFormAccounts] = useState({
    accountName: '',
    balance: 0,
    accountCategory: '',
    userId: ''
  });

  const [showMenu, setShowMenu] = useState(null);
  const [balance, setBalance] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const fetchAll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const id = user.id;
    setUserId(id);

    const realBalance = await axios.post(urlconstant.getTotalBalanceByUserId, { userId: id });
    setBalance(realBalance.data.totalBalance);

    const realLiabilities = await axios.post(urlconstant.getLiabilitiesByUserId, { userId: id });
    setLiabilities(realLiabilities.data.liabilities);

    setTotalBalance(realBalance.data.totalBalance - realLiabilities.data.liabilities);

    const getAccount = await axios.post(urlconstant.getAccountByUserId, { userId: id });
    setAccounts(getAccount.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormAccounts(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const accountData = { ...formAccounts, userId };

    try {
      let res;
      if (isEditing && editingAccount) {
        res = await axios.post(urlconstant.updateAccount, {
          accountId: editingAccount.account_id,
          ...accountData
        });
      } else {
        res = await axios.post(urlconstant.addNewAccount, accountData);
      }

      setShowModal(false);
      toast.success(res.data.message || (isEditing ? 'Account updated!' : 'Account added!'));
      fetchAll(); // refresh the list
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? 'Failed to update account' : 'Failed to add account');
    }
  };

  const deleteAccount = async (accId, onSuccess) => {
    const id = {
      accountId: accId
    };
    const res = await axios.post(urlconstant.deleteAccountByAccountId, id);

    if (res.data.account.message == 'Account deleted successfully') {
      toast.success(res.data.account.message);
      setAccounts(prev => prev.filter(acc => acc.account_id !== accId));
    } else {
      toast.error(res.data.account.message);
    }

    fetchAll();
  };

  const updateAccount = async () => {
    setFormAccounts({
      accountName: '',
      balance: 0,
      accountCategory: '',
      userId: ''
    })
  }

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
          <h1 className='text-white'>Accounts</h1>
          {accounts.map((account) => (
            <div key={account.id} className="bg-gray-200 rounded-2xl p-4 mb-2 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {getCategoryIcon(account.account_category)}
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">{account.account_name}</div>
                    <div className={`text-xl font-semibold ${account.account_category === 'Credit' ? 'text-red-600' : 'text-gray-900'}`}>
                      {account.balance}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingAccount(account);
                      setFormAccounts({
                        accountName: account.account_name,
                        balance: account.balance,
                        accountCategory: account.account_category,
                        userId: userId,
                        accountId: account.account_id
                      });
                      setShowModal(true);
                    }}
                  >
                    <Edit2 className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={() => deleteAccount(account.account_id)}
                    className="p-2 hover:bg-gray-300 rounded-2xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Account Button */}
          <button onClick={() => {
            setShowModal(true);
            setEditingAccount(null);
            setIsEditing(false);
          }} className=" w-full bg-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-900 font-medium hover:bg-gray-300 transition-colors">
            <Plus className="w-5 h-5" />
            Add New Accounts
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold mb-6">
              {isEditing ? 'Edit Account' : 'Add New Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="accountName"
                  value={formAccounts.accountName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="balance"
                  onChange={handleInputChange}
                  value={formAccounts.balance}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="accountCategory"
                  value={formAccounts.accountCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="Debit">Debit</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Investments">Investments</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-200 border-t border-gray-300">
              <div className="max-w-md mx-auto flex justify-around items-center py-6">
      
                <NavLink to={routes.walletDashboard} className={navLinkClass}>
                  <button className="flex flex-col items-center text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                    <LayoutGrid className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" />
                  </button>
                </NavLink>
      
                <NavLink to={routes.userWallet} className={navLinkClass}>
                  <button className="flex flex-col items-center text-gray-500">
                    <Wallet className="w-6 h-6" />
                  </button>
                </NavLink>
      
                <NavLink to={routes.transactionBudget} className={navLinkClass}>
                  <button className="flex flex-col items-center text-gray-600">
                    <List className="w-6 h-6" />
                  </button>
                </NavLink>
      
                <NavLink to={''} className={navLinkClass}>
                  <button className="flex flex-col items-center text-gray-500">
                    <User className="w-6 h-6" />
                  </button>
                </NavLink>
              </div>
            </div>
      <ToastContainer />
    </div>
  );
};

export default userWallets;