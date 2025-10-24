import React from 'react';
import { ArrowRight, Plus, X, User, Wallet, List, LayoutGrid } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { urlconstant } from '../../constants/urlConstant';
import { format, parseISO } from 'date-fns';
import { routes } from '../../constants/navigationRoutes';
import { NavLink } from 'react-router-dom';

function WalletDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [formData, setFormData] = useState({
    transactionName: '',
    transactionAmount: '',
    transactionType: 'Expense',
    transactionCategory: '',
    accountId: '',
  });
  const [dropAcc, setDropAcc] = useState();


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

      const realLiabilities = await axios.post(urlconstant.getLiabilitiesByUserId, { userId: user.id });
      setLiabilities(realLiabilities.data.liabilities);

      const total = realBalance.data.totalBalance - realLiabilities.data.liabilities;
      setTotalBalance(total);

      const incomeAmt = await axios.post(urlconstant.getIncomeExpenseByUserIdAndTransactionType, reqIncome);
      setIncome(incomeAmt.data.total);

      const expenseAmt = await axios.post(urlconstant.getIncomeExpenseByUserIdAndTransactionType, reqExpense);
      setExpense(expenseAmt.data.total);

      const transactionRecord = await axios.post(urlconstant.getLatestTransactionRecord, { userId: user.id });
      setTransactions(convertKeysToCamel(transactionRecord.data));
      console.log(transactionRecord.data);
    }
    catch (err) {
      console.error('Error:', err);
    }
  };

  const formatISODate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  function convertKeysToCamel(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
      return obj.map(convertKeysToCamel);
    }

    const newObj = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      newObj[camelKey] = convertKeysToCamel(obj[key]);
    }
    return newObj;
  }

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center px-2 py-1 rounded transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
    }`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateTransaction = async (e) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const transactionData = {
        ...formData,
        userId: user.id,
        transactionAmount: parseFloat(formData.transactionAmount)
      };

      await axios.post(urlconstant.addNewTransaction, transactionData);

      setFormData({
        transactionName: '',
        transactionAmount: '',
        transactionType: '',
        transactionCategory: '',
        accountId: '',
      });

      setShowModal(false);

      const accountId = {
        accountId: formData.accountId
      }

      if (formData.transactionType == 'Income') {
        await axios.post(urlconstant.updateIncomeByAccountId, accountId);
      }

      fetchData();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">

      <div className="top bg-gray-900 text-white p-6 text-center">
        <h1 className="text-xl font-semibold">Summary</h1>
      </div>

      <div className="max-w-3xl mx-auto text-black py-9">
        <div className="p-5 space-y-4">

          <div className="bg-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-2">Total Balance</p>
            <p className="text-4xl font-bold">{(totalBalance).toLocaleString('in')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-200 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-2">Income</p>
              <p className="text-2xl font-bold">{(income).toLocaleString('in')}</p>
            </div>

            <div className="bg-gray-200 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-2">Expense</p>
              <p className="text-2xl font-bold">{(expense.toLocaleString('in'))}</p>
            </div>
          </div>

          {/* Latest Transactions */}
          <div className="bg-gray-200 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Latest Transactions</h2>
              <button className="flex items-center text-sm font-medium hover:opacity-70">
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            </div>

            <div className="h-[420px]">
              {transactions.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-xl">
                  <p>No Transactions Yet</p>
                </div>
              ) : (
                transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="bg-gray-100 rounded-xl p-4 mt-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className={`font-semibold text-sm ${transaction.transactionType === 'Expense' ? 'text-red-600' : 'text-blue-600'}`}>
                          Transaksi di {transaction.transactionName}
                        </p>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{transaction.transactionCategory}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatISODate(transaction.createdDt)}</p>
                    </div>
                    <p className={`text-lg font-bold ${transaction.transactionType === 'Expense' ? 'text-red-600' : 'text-blue-600'}`}>
                      {(transaction.transactionAmount).toLocaleString('in')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-300 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold mb-6">Add New Transaction</h2>

            <form onSubmit={updateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="transactionName"
                  value={formData.transactionName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="transactionAmount"
                  value={formData.transactionAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="transactionCategory"
                  value={formData.transactionCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account</label>
                <input
                  type="text"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
    </div>
  );
}

export default WalletDashboard;