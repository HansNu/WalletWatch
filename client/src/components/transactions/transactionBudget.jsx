import React, { useState, useEffect } from 'react';
import { Plus, Edit2, User, Wallet, List, LayoutGrid } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { routes } from '../../constants/navigationRoutes';
import { urlconstant } from '../../constants/urlConstant';
import { supabase } from '../../supabaseClient';
import axios from 'axios';

const BudgetApp = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [budget, setBudget] = useState({
        amount: 0,
        spent: 0,
        period: 'Monthly',
        startDate: '',
        endDate: '',
        daysLeft: 0
    });
    const [categories, setCategories] = useState([]);

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        budget: '',
        period: 'Monthly',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const getBudget = await axios.post(urlconstant.getBudgetByUserId, { userId: user.id });
        const now = new Date();
        const endDate = new Date(getBudget.data.end_dt);
        const diffMs = endDate - now;
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        const getSpending = await axios.post(urlconstant.getTransactionBasedOnUserIdAndDateRange, { userId: user.id });

        setBudget({
            amount: getBudget.data.budget_amt,
            spent: getSpending.data,
            period: getBudget.data.budget_period,
            startDate: getBudget.data.start_dt,
            endDate: getBudget.data.end_dt,
            daysLeft: daysLeft
        });

        const getCategories = await axios.post(urlconstant.getTransactionCategoryByBudgetId, { budgetId: getBudget.data.budget_id });
        const getTransactionAmt = await axios.post(urlconstant.getLatestTransactionRecord, { userId: user.id });
        const transaction = getTransactionAmt.data;
        const categoryTotals = transaction.reduce((acc, tx) => {
            acc[tx.transaction_category] = (acc[tx.transaction_category] || 0) + tx.transaction_amount;

            return acc;
        }, {});

        const formattedCategories = getCategories.data.map(cat => ({
            id: cat.transaction_category_id,
            name: cat.category_name,
            allocated: cat.budget_allocation,
            spent: categoryTotals[cat.category_name],
            daysLeft: daysLeft
        }));

        setCategories(formattedCategories);
    };

    const navLinkClass = ({ isActive }) =>
        `flex flex-col items-center px-2 py-1 rounded transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`;

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name,
            budget: category.allocated,
            period: budget.period,
            startDate: budget.startDate,
            endDate: budget.endDate
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        const updated = categories.map(cat =>
            cat.id === editingCategory.id
                ? { ...cat, name: categoryForm.name, allocated: parseFloat(categoryForm.budget) }
                : cat
        );
        setCategories(updated);
        setShowEditModal(false);
        setEditingCategory(null);
    };

    const MainView = () => (
        <div className="min-h-screen bg-gray-800">
            <div className="top bg-gray-900 text-white p-6 text-center">
                <h1 className="text-xl font-semibold">Budget</h1>
            </div>

            <div className='max-w-3xl mx-auto text-black py-9'>
                <NavLink to={routes.addEditBudget}>
                    <div className='p-5 space-y-4'>
                        <div className="bg-gray-200 rounded-2xl mx-auto text-black p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Budget</p>
                                    <p className="text-3xl font-bold">{budget.amount}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 mb-1">Days Left</p>
                                    <div className="bg-pink-200 rounded-lg px-4 py-2">
                                        <p className="text-3xl font-bold">{budget.daysLeft}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <p className="text-gray-600">Spent: {budget.spent}</p>
                                <p className="text-gray-600">{((budget.spent / budget.amount) * 100).toFixed(1)}%</p>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-3">
                                <div
                                    className="bg-red-400 h-3 rounded-full transition-all"
                                    style={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </NavLink>

                <div className="p-4">
                    <h2 className="text-xl text-white font-semibold mb-4">Categories</h2>
                    <div className="space-y-3">
                        {categories.map(category => (
                            <div key={category.id} className="bg-gray-200 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div>
                                        <p className="font-semibold text-lg">{category.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {category.spent}/{category.allocated}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-gray-600">{category.daysLeft}d Left</p>
                                    <button
                                        onClick={() => handleEditClick(category)}
                                        className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full mt-4 bg-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add New Category</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const AddCategoryModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                    <h2 className="text-xl font-semibold">Add New Category</h2>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Budget</label>
                        <input
                            type="number"
                            value={categoryForm.budget}
                            onChange={(e) => setCategoryForm({ ...categoryForm, budget: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="flex-1 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const EditCategoryModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                    <h2 className="text-xl font-semibold">Edit Category</h2>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Budget</label>
                        <input
                            type="number"
                            value={categoryForm.budget}
                            onChange={(e) => setCategoryForm({ ...categoryForm, budget: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="flex-1 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative">
            <MainView />
            {showAddModal && <AddCategoryModal />}
            {showEditModal && <EditCategoryModal />}

            <div className="fixed bottom-0 left-0 right-0 bg-gray-200 border-t border-gray-300">
                <div className="max-w-md mx-auto flex justify-around items-center py-6">
                    <NavLink to={routes.walletDashboard} className={navLinkClass}>
                        <button className="flex flex-col items-center text-gray-500">
                            <LayoutGrid className="w-6 h-6" />
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
};

export default BudgetApp;