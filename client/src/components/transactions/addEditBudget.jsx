import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { routes } from '../../constants/navigationRoutes';
import { urlconstant } from '../../constants/urlConstant';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { supabase } from '../../supabaseClient';

function EditBudgetView() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState(null);

    function formatDt(isoString) {
        if (!isoString) return '';
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    }

    const startDt = formatDt(location.state.budget.startDate);
    const endDt = formatDt(location.state.budget.endDate);

    const [budget, setBudget] = useState(
        location.state.budget ?
            {
                ...location.state.budget,
                startDate: startDt,
                endDate: endDt
            }
            :
            {
                amount: 0,
                period: 'weekly',
                startDate: '',
                endDate: ''
            }
    );

    const fetchAll = async () => {
        const { data } = await supabase.auth.getUser();
        if (!data) return;
        setUserId(data.user.id);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const calculateDates = (period, startDate) => {
        const start = startDate ? new Date(startDate) : new Date();
        let end = new Date(start);

        switch (period.toLowerCase()) {
            case 'daily':
                end = new Date(start);
                break;
            case 'weekly':
                end.setDate(start.getDate() + 7);
                break;
            case 'monthly':
                end.setMonth(start.getMonth() + 1);
                break;
            default:
                return {
                    startDate: start.toISOString().split('T')[0],
                    endDate: start.toISOString().split('T')[0]
                };
        }

        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    };

    const handlePeriodChange = (newPeriod) => {
        const dates = calculateDates(newPeriod, budget.startDate || new Date());
        setBudget({
            ...budget,
            period: newPeriod,
            startDate: dates.startDate,
            endDate: dates.endDate
        });
    };

    const handleStartDateChange = (newStartDate) => {
        const dates = calculateDates(budget.period, newStartDate);
        setBudget({
            ...budget,
            startDate: newStartDate,
            endDate: dates.endDate
        });
    };

    const addUpdateBudget = async (e) => {
        e.preventDefault();
        const user = userId;
        if (!userId) {
            toast.error('User not authenticated');
            return;
        }

        if (!budget.amount || budget.amount <= 0) {
            toast.error('Please enter a valid amount greater than 0');
            return;
        }

        if (!budget.period) {
            toast.error('Please select a period');
            return;
        }

        if (!budget.startDate || !budget.endDate) {
            toast.error('Please select start and end dates');
            return;
        }

        setIsLoading(true);

        try {
            const budgetReq = {
                amount: parseFloat(budget.amount),
                period: budget.period.toLowerCase(),
                startDate: budget.startDate,
                endDate: budget.endDate,
                userId: userId
            };

            const response = await axios.post(urlconstant.addNewBudget, budgetReq);

            toast.success(response.data.message || 'Budget created successfully');

            setTimeout(() => {
                navigate(routes.transactionBudget);
            }, 1500);

        } catch (error) {
            console.error('Error creating budget:', error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create budget';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(routes.transactionBudget);
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="bg-gray-900 text-white p-6">
                <div className="relative flex justify-center items-center">
                    <h1 className="text-xl font-semibold">Set Budget</h1>
                    <NavLink
                        to={routes.transactionBudget}
                        className="absolute right-0 hover:bg-gray-800 p-1 rounded transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </NavLink>
                </div>
            </div>

            {/* Centered Budget Card */}
            <div className="flex-1 flex items-center justify-center p-4">
                <form onSubmit={addUpdateBudget} className="w-full max-w-2xl">
                    <div className="bg-gray-200 rounded-lg p-6 space-y-4">
                        <div>
                            <label className="block font-semibold mb-2">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={budget.amount}
                                onChange={(e) => setBudget({ ...budget, amount: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Period</label>
                            <select
                                value={budget.period}
                                onChange={(e) => handlePeriodChange(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={budget.startDate}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={budget.endDate}
                                    onChange={(e) => setBudget({ ...budget, endDate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBudgetView;