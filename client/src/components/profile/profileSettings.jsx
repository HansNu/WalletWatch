import React, { useState, useEffect } from 'react';
import { Wallet, User, Lock, LogOut, Trash2, Eye, EyeOff, Edit2, Check, X, LayoutGrid, List } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { routes } from '../../constants/navigationRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { urlconstant } from '../../constants/urlConstant';
import { supabase } from '../../supabaseClient';
import axios from 'axios';

export default function ProfileSettings() {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        userCode: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);

    const navLinkClass = ({ isActive }) => `flex flex-col items-center px-2 py-1 rounded transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`;

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        const { data } = await supabase.auth.getUser();
        if (!data) return;

        setUserId(data.user.id);

        const userData = await axios.post(urlconstant.getUserByUserId, { userId: data.user.id});
        const currUser = userData.data;
        setUserInfo({
            firstName: currUser.first_name,
            lastName : currUser.last_name,
            userCode : currUser.user_id
        });
    }

    const handleSave = () => {
        setIsEditing(false);
        // Save logic here
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset fields logic here
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-900 py-6 border-b border-slate-700 text-center">
                <h1 className="text-xl font-semibold">Profile Settings</h1>
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-4">
                {/* Personal Information Card */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-900" />
                            </div>
                            <h2 className="text-lg font-medium">Personal Information</h2>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">First Name</label>
                            <input
                                type="text"
                                value={userInfo.firstName}
                                onChange={userInfo.firstName}
                                disabled={!isEditing}
                                className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                placeholder="Enter first name"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Last Name</label>
                            <input
                                type="text"
                                value={userInfo.lastName}
                                onChange={userInfo.lastName}
                                disabled={!isEditing}
                                className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                placeholder="Enter last name"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">User Code</label>
                            <input
                                type="text"
                                value={userInfo.userCode}
                                onChange={userInfo.userCode}
                                disabled 
                                className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                placeholder="Enter user code"
                            />
                        </div>

                        {isEditing && (
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Card */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                            <Lock className="w-5 h-5 text-slate-900" />
                        </div>
                        <h2 className="text-lg font-medium">Security</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Password</p>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-300">
                                    {showPassword ? 'mypassword123' : '••••••••••••'}
                                </span>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-slate-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-3 shadow-lg">
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>

                    <button className="w-full bg-slate-800 hover:bg-red-900 text-red-400 hover:text-red-300 py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-3 shadow-lg">
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
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
}