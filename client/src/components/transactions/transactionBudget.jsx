import React, { useState } from 'react';
import { Plus, Edit2, Search, User, Wallet, List, LayoutGrid } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { routes } from '../../constants/navigationRoutes';


const BudgetApp = () => {
    const [currentView, setCurrentView] = useState('main'); // 'main', 'editBudget', 'allTransactions'
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Budget state
    const [budget, setBudget] = useState({
        amount: 5000000,
        spent: 4500000,
        period: 'Monthly',
        startDate: '2025-10-01',
        endDate: '2025-10-31',
        daysLeft: 4
    });

    // Categories state
    const [categories, setCategories] = useState([
        { id: 1, name: 'Food', icon: '🍴', spent: 2430000, allocated: 3000000, daysLeft: 4 },
        { id: 2, name: 'Entertainment', icon: '🎭', spent: 1430000, allocated: 2000000, daysLeft: 4 },
        { id: 3, name: 'Groceries', icon: '🛒', spent: 730000, allocated: 1000000, daysLeft: 4 }
    ]);

    // Form state for adding/editing categories
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        budget: '',
        period: 'Monthly',
        startDate: '',
        endDate: ''
    });

    // New categories for budget setup
    const [newCategories, setNewCategories] = useState([{ name: '', allocation: '' }]);

    const formatCurrency = (amount) => {
        return `Rp${amount.toLocaleString('id-ID')}`;
    };

    const navLinkClass = ({ isActive }) =>
        `flex flex-col items-center px-2 py-1 rounded transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`;

    const calculateDaysLeft = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handlePeriodChange = (period) => {
        const today = new Date();
        let endDate = new Date();

        if (period === 'Weekly') {
            endDate.setDate(today.getDate() + 7);
        } else if (period === 'Monthly') {
            endDate.setMonth(today.getMonth() + 1);
        }

        setCategoryForm({
            ...categoryForm,
            period,
            startDate: today.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
    };

    const handleCategoryInputChange = (index, field, value) => {
        const updated = [...newCategories];
        updated[index][field] = value;
        setNewCategories(updated);
    };

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

    // Main Budget View
    const MainView = () => (
        <div className="min-h-screen bg-gray-800">

            <div className="top bg-gray-900 text-white p-6 text-center">
                <h1 className="text-xl font-semibold">Budget</h1>
            </div>

            {/* Budget Card */}
            <div className='max-w-3xl mx-auto text-black py-9'>
                <NavLink to={routes.addEditBudget}>
                    <div className='p-5 space-y-4'>
                        <div
                            className="bg-gray-200 rounded-2xl mx-auto text-black p-6"
                            onClick={() => setCurrentView('editBudget')}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Budget</p>
                                    <p className="text-3xl font-bold">{formatCurrency(budget.amount)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 mb-1">Days Left</p>
                                    <div className="bg-pink-200 rounded-lg px-4 py-2">
                                        <p className="text-3xl font-bold">{budget.daysLeft}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <p className="text-gray-600">Spent: {formatCurrency(budget.spent)}</p>
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

                {/* Categories */}
                <div className="p-4">
                    <h2 className="text-xl text-white font-semibold mb-4">Categories</h2>
                    <div className="space-y-3">
                        {categories.map(category => (
                            <div key={category.id} className="bg-gray-200 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-3xl">{category.icon}</span>
                                    <div>
                                        <p className="font-semibold text-lg">{category.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {formatCurrency(category.spent)}/{formatCurrency(category.allocated)}
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

                    {/* Add New Category Button */}
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

    // Edit Budget View
    const EditBudgetView = () => (
        <div className="min-h-screen bg-gray-100 pb-20">
            <div className="bg-gray-800 text-white p-4">
                <h1 className="text-xl font-semibold">Add/Edit Budget</h1>
            </div>

            <div className="p-4 max-w-2xl mx-auto">
                <div className="bg-gray-200 rounded-lg p-6 space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">Amount</label>
                        <input
                            type="number"
                            value={budget.amount}
                            onChange={(e) => setBudget({ ...budget, amount: parseFloat(e.target.value) })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Period</label>
                        <select
                            value={budget.period}
                            onChange={(e) => setBudget({ ...budget, period: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold mb-2">Start Date</label>
                            <input
                                type="date"
                                value={budget.startDate}
                                onChange={(e) => setBudget({ ...budget, startDate: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">End Date</label>
                            <input
                                type="date"
                                value={budget.endDate}
                                onChange={(e) => setBudget({ ...budget, endDate: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-lg">Category</h3>
                        </div>

                        {newCategories.map((cat, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={cat.name}
                                        onChange={(e) => handleCategoryInputChange(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Allocation</label>
                                    <input
                                        type="number"
                                        value={cat.allocation}
                                        onChange={(e) => handleCategoryInputChange(index, 'allocation', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handleAddCategory}
                            className="w-full py-3 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300"
                        >
                            Add Category
                        </button>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setCurrentView('main')}
                            className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setCurrentView('main')}
                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Add Category Modal
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

                    <div>
                        <label className="block font-medium mb-2">Period</label>
                        <select
                            value={categoryForm.period}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Start Date</label>
                        <input
                            type="date"
                            value={categoryForm.startDate}
                            onChange={(e) => setCategoryForm({ ...categoryForm, startDate: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">End Date</label>
                        <input
                            type="date"
                            value={categoryForm.endDate}
                            onChange={(e) => setCategoryForm({ ...categoryForm, endDate: e.target.value })}
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

    // Edit Category Modal
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

                    <div>
                        <label className="block font-medium mb-2">Period</label>
                        <select
                            value={categoryForm.period}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Start Date</label>
                        <input
                            type="date"
                            value={categoryForm.startDate}
                            onChange={(e) => setCategoryForm({ ...categoryForm, startDate: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">End Date</label>
                        <input
                            type="date"
                            value={categoryForm.endDate}
                            onChange={(e) => setCategoryForm({ ...categoryForm, endDate: e.target.value })}
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
            {currentView === 'main' && <MainView />}
            {showAddModal && <AddCategoryModal />}
            {showEditModal && <EditCategoryModal />}

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
        </div>
    );
};

export default BudgetApp;