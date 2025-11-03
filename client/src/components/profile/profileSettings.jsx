import React, { useState, useEffect } from 'react';
import { Wallet, User, Lock, LogOut, Trash2, Eye, EyeOff, Edit2, Check, X, LayoutGrid, List } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { routes } from '../../constants/navigationRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { urlconstant } from '../../constants/urlConstant';
import { supabase } from '../../supabaseClient';
import axios from 'axios';

export default function ProfileSettings() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        userCode: ''
    });
    const [originalUserInfo, setOriginalUserInfo] = useState({
        firstName: '',
        lastName: '',
        userCode: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const navLinkClass = ({ isActive }) => `flex flex-col items-center px-2 py-1 rounded transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`;

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        const { data } = await supabase.auth.getUser();
        if (!data) return;

        setUserId(data.user.id);

        const userData = await axios.post(urlconstant.getUserByUserId, { userId: data.user.id });
        const currUser = userData.data;
        const userInfoData = {
            firstName: currUser.first_name,
            lastName: currUser.last_name,
            userCode: currUser.user_id
        };
        setUserInfo(userInfoData);
        setOriginalUserInfo(userInfoData);
    }

    const handleSave = async () => {
        try {
            await axios.post(urlconstant.updateUserData, {
                userId: userId,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName
            });
            setUserInfo(userInfo);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleCancel = () => {
        setUserInfo(originalUserInfo);
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setUserInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error('Please fill in both password fields');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }

        setIsChangingPassword(true);

        try {
            const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
                email: (await supabase.auth.getUser()).data.user.email,
                password: passwordData.currentPassword
            });

            if (signInError) {
                toast.error('Current password is incorrect');
                setIsChangingPassword(false);
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (updateError) {
                toast.error('Failed to change password');
                console.error('Password update error:', updateError);
            } else {
                toast.success('Password changed successfully!');
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '' });
                navigate(routes.login);
            }
        } catch (error) {
            toast.error('An error occurred while changing password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast.error('Failed to log out');
            } else {
                navigate(routes.login);
            }
        } catch (error) {
            toast.error('An error occurred while logging out');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (!confirmed) return;

        try {
            const { error } = await supabase.rpc('delete_user_account', {
                userId: userId
            });

            if (error) {
                toast.error('Failed to delete account');
                console.error('Delete account error:', error);
            } else {
                toast.success('Account deleted successfully');
                await supabase.auth.signOut();
                navigate(routes.login || '/login');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('An error occurred while deleting account');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-900 py-6 border-b border-slate-700 text-center">
                <h1 className="text-xl font-semibold">Profile Settings</h1>
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-4 pb-32">
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
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                disabled={!isEditing}
                                className="w-full bg-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                placeholder="Enter first name"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Last Name</label>
                            <input
                                type="text"
                                value={userInfo.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                disabled={!isEditing}
                                className="w-full bg-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                placeholder="Enter last name"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">User Code</label>
                            <input
                                type="text"
                                value={userInfo.userCode}
                                disabled
                                className="w-full bg-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
                            <p className="text-slate-300">••••••••••••</p>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-3 shadow-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full bg-slate-800 hover:bg-red-900 text-red-400 hover:text-red-300 py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-3 shadow-lg"
                    >
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Change Password</h2>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({ currentPassword: '', newPassword: '' });
                                }}
                                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full bg-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-400 transition-colors pr-12"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-600 rounded transition-colors"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full bg-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-400 transition-colors pr-12"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-600 rounded transition-colors"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Password must be at least 6 characters</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({ currentPassword: '', newPassword: '' });
                                    }}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors"
                                    disabled={isChangingPassword}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700">
                <div className="max-w-md mx-auto flex justify-around items-center py-6">
                    <NavLink to={routes.walletDashboard} className={navLinkClass}>
                        <LayoutGrid className="w-7 h-7" />
                    </NavLink>

                    <NavLink to={routes.userWallet} className={navLinkClass}>
                        <Wallet className="w-7 h-7" />
                    </NavLink>

                    <NavLink to={routes.transactionBudget} className={navLinkClass}>
                        <List className="w-7 h-7" />
                    </NavLink>

                    <NavLink to={routes.profile} className={navLinkClass}>
                        <User className="w-7 h-7" />
                    </NavLink>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}