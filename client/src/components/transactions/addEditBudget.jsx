import React, { useState } from 'react';
import { X } from 'lucide-react';
import { routes } from '../../constants/navigationRoutes';
import { NavLink } from 'react-router-dom';

function EditBudgetView() {
    const [budget, setBudget] = useState({
        amount: 5000000,
        spent: 4500000,
        period: 'Monthly',
        startDate: '2025-10-01',
        endDate: '2025-10-31',
        daysLeft: 4
    });

    const [newCategories, setNewCategories] = useState([{ name: '', allocation: '' }]);
    
    const handleAddCategory = () => {
        setNewCategories([...newCategories, { name: '', allocation: '' }]);
    };

    const handleCategoryInputChange = (index, field, value) => {
        const updated = [...newCategories];
        updated[index][field] = value;
        setNewCategories(updated);
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 text-white p-6">
                <div className="relative flex justify-center items-center">
                    <h1 className="text-xl font-semibold">Set Budget</h1>
                    <NavLink to={routes.transactionBudget} className="absolute right-0 hover:bg-gray-800 p-1 rounded transition-colors">
                        <X className="w-6 h-6" />
                    </NavLink>
                </div>
            </div>

            {/* Centered Budget Card */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-gray-200 rounded-lg p-6 space-y-4">
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
                            className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBudgetView;