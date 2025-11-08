import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Filter } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { urlconstant } from '../../constants/urlConstant';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TransactionHistory() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const currUser = location.state;
    const currCategory = searchParams.get('category');  

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        filterTransactions();
    }, [searchQuery, filterType, transactions]);

    const fetchTransactions = async () => {
        try {
            if (!currUser.userId) {
                toast.error('User not found');
                return;
            }

            const reqHistory = {
                userId : currUser.userId,
                categoryName : currCategory
            }

            const transactionRecord = await axios.post(urlconstant.getLatestTransactionRecordByCategory, reqHistory);

            setTransactions(transactionRecord.data);
            setFilteredTransactions(transactionRecord.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
            setLoading(false);
        }
    };

    const filterTransactions = () => {
        let filtered = [...transactions];

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(t => 
                t.transaction_type?.toLowerCase() === filterType.toLowerCase()
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t => 
                t.transaction_name?.toLowerCase().includes(query) ||
                t.transaction_type?.toLowerCase().includes(query) ||
                t.transaction_amount?.toString().includes(query) ||
                t.description?.toLowerCase().includes(query)
            );
        }

        setFilteredTransactions(filtered);
    };

    const formatAmount = (transaction_amount) => {
        return new Intl.NumberFormat('id-ID').format(transaction_amount || 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTransactionColor = (type) => {
        switch(type?.toLowerCase()) {
            case 'income':
                return 'text-blue-400';
            case 'expense':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-900 py-6 border-b border-slate-700">
                <div className="max-w-2xl mx-auto px-6 flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold">Transaction History</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search transactions..."
                        className="w-full bg-slate-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                            filterType === 'all' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('income')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                            filterType === 'income' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        Income
                    </button>
                    <button
                        onClick={() => setFilterType('expense')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                            filterType === 'expense' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        Expense
                    </button>
                </div>

                {/* Results Count */}
                <div className="text-sm text-slate-400">
                    {loading ? 'Loading...' : `${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? 's' : ''} found`}
                </div>

                {/* Transaction List */}
                <div className="space-y-3 pb-6">
                    {loading ? (
                        <div className="text-center py-12 text-slate-400">
                            Loading transactions...
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            No transactions found
                        </div>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <div 
                                key={transaction.id}
                                className="bg-slate-800 rounded-xl p-4 hover:bg-slate-750 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-white mb-1">
                                            {transaction.transaction_name || 'Transaksi di BCA'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span className={getTransactionColor(transaction.transaction_type)}>
                                                {transaction.transaction_type}
                                            </span>
                                            <span>•</span>
                                            <span>{formatDate(transaction.created_dt)}</span>
                                        </div>
                                        {transaction.description && (
                                            <p className="text-sm text-slate-500 mt-1">
                                                {transaction.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`text-lg font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
                                        {formatAmount(transaction.transaction_amount)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}