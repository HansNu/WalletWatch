import React, { useState, useEffect } from 'react';
import { Plus, Edit2, User, Wallet, List, LayoutGrid, Trash2, X, Clock } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { routes } from '../../constants/navigationRoutes';
import { urlconstant } from '../../constants/urlConstant';
import { supabase } from '../../supabaseClient';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const BudgetApp = () => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [budget, setBudget] = useState({
        amount: 0,
        spent: 0,
        period: 'Monthly',
        startDate: '',
        endDate: '',
        daysLeft: 0,
        budgetId: '',
        userId: ''
    });
    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState(null);

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        allocated: '',
        period: 'Monthly',
        startDate: '',
        endDate: '',
        categoryId: 0
    });
    const navigate = useNavigate();

    const navLinkClass = ({ isActive }) => `flex flex-col items-center px-2 py-1 rounded transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`;

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserId(user.id);

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
            daysLeft: daysLeft,
            budgetId: getBudget.data.budget_id,
            userId: user.id
        });

        const getCategories = await axios.post(urlconstant.getTransactionCategoryByBudgetId, { budgetId: getBudget.data.budget_id });
        const getTransactionAmt = await axios.post(urlconstant.getLatestTransactionRecord, { userId: user.id });
        const transaction = getTransactionAmt.data;
        const categoryTotals = transaction.reduce((acc, tx) => {
            acc[tx.transaction_category] = (acc[tx.transaction_category] || 0) + tx.transaction_amount;
            return acc;
        }, {});

        const formattedCategories = getCategories.data.map(cat => ({
            categoryId: cat.transaction_category_id,
            name: cat.category_name,
            allocated: cat.budget_allocation,
            spent: categoryTotals[cat.category_name] || 0,
            daysLeft: daysLeft
        }));

        setCategories(formattedCategories);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return;

        try {
            //update cateogry detail
            if (isEditing && editingCategory) {
                const res = await axios.post(urlconstant.updateTransactionCategory, {
                    categoryName: categoryForm.name,
                    categoryAllocation: categoryForm.allocated,
                    categoryId: categoryForm.categoryId

                });
                toast.success('Category updated successfully!');

            } else {
                // add new category
                console.log('isi cat', categories);
                let currAllocated = 0;
                for (let i = 0; i < categories.length; i++) {
                    currAllocated += categories[i].allocated;
                }

                let totalAllocated = currAllocated + parseFloat(categoryForm.allocated);
                if (totalAllocated > budget.amount) {
                    toast.error(`Total allocated can't exceed ${budget.amount}`);
                    setShowModal(false);
                    return;
                }
                const res = await axios.post(urlconstant.addTransactionCategory, {
                    categoryName: categoryForm.name,
                    budgetAllocation: categoryForm.allocated,
                    budgetId: budget.budgetId
                });
                toast.success('Category added successfully!');
            }

            setCategoryForm({
                name: '',
                budget: '',
                period: 'Monthly',
                startDate: '',
                endDate: ''
            });
            setShowModal(false);
            setIsEditing(false);
            setEditingCategory(null);
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(isEditing ? 'Failed to update category' : 'Failed to add category');
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const res = await axios.post(urlconstant.deleteTransactionCategory, {
                categoryId: categoryId
            });
            if (res.data.message === 'Category deleted successfully') {
            } else {
                toast.error(res.data.message);
            }
            toast.success('Category deleted successfully!');

            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete category');
        }
    };

    return (
        <div className="relative">
            <div className="min-h-screen bg-gray-800">
                <div className="top bg-gray-900 text-white p-6 text-center">
                    <h1 className="text-xl font-semibold">Budget</h1>
                </div>

                <div className='max-w-3xl mx-auto text-black py-9'>
                    <NavLink to={routes.addEditBudget} state={{ budget }}>
                        <div className='p-5 space-y-4'>
                            <div className="bg-gray-200 rounded-2xl mx-auto text-black p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Budget</p>
                                        <p className="text-3xl font-bold">{(budget.amount).toLocaleString('in')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Days Left</p>
                                        <div className="bg-blue-200 rounded-lg px-4 py-2">
                                            <p className="text-3xl font-bold">{budget.daysLeft}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <p className="text-gray-600">Spent: {(budget.spent).toLocaleString('in')}</p>
                                    <p className="text-gray-600">{((budget.spent / budget.amount) * 100).toFixed(1)}%</p>
                                </div>
                                <div className="w-full bg-gray-300 rounded-full h-3">
                                    <div
                                        className="bg-blue-300 h-3 rounded-full transition-all"
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
                                                {(category.spent).toLocaleString('in')}/{(category.allocated).toLocaleString('in')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm text-gray-600">{category.daysLeft}d Left</p>
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditingCategory(category);
                                                setCategoryForm({
                                                    name: category.name,
                                                    allocated: category.allocated,
                                                    period: budget.period,
                                                    startDate: budget.startDate,
                                                    endDate: budget.endDate,
                                                    categoryId: category.categoryId
                                                });
                                                setShowModal(true);
                                            }}
                                            className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category.categoryId)}
                                            className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`${routes.transactionHistory}?category=${encodeURIComponent(category.name)}`, {state: {userId}})}
                                            className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                                        >
                                            <Clock className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setShowModal(true);
                                setIsEditing(false);
                                setEditingCategory(null);
                                setCategoryForm({
                                    name: '',
                                    budget: '',
                                    period: 'Monthly',
                                    startDate: '',
                                    endDate: ''
                                });
                            }}
                            className="w-full mt-4 bg-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Add New Category</span>
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold mb-6">
                            {isEditing ? 'Edit Category' : 'Add New Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={categoryForm.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Allocation</label>
                                <input
                                    type="number"
                                    name="allocated"
                                    value={categoryForm.allocated}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
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

            <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700">
                <div className="max-w-md mx-auto flex justify-around items-center py-6">

                    <NavLink to={routes.walletDashboard} className={navLinkClass}>
                        <button className="flex flex-col items-center text-gray-500 hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                            <LayoutGrid className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" />
                        </button>
                    </NavLink>

                    <NavLink to={routes.userWallet} className={navLinkClass}>
                        <button className="flex flex-col items-center text-gray-500 hover:text-white transition-colors">
                            <Wallet className="w-7 h-7" />
                        </button>
                    </NavLink>

                    <NavLink to={routes.transactionBudget} className={navLinkClass}>
                        <button className="flex flex-col items-center text-gray-600 hover:text-white transition-colors">
                            <List className="w-7 h-7" />
                        </button>
                    </NavLink>

                    <NavLink to={routes.profile} className={navLinkClass}>
                        <button className="flex flex-col items-center text-gray-500 hover:text-white transition-colors">
                            <User className="w-7 h-7" />
                        </button>
                    </NavLink>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default BudgetApp;