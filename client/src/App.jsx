import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { routes } from './constants/navigationRoutes.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalletDashboard from './components/dashboard/WalletDashboard.jsx';
import Login from './components/account/loginRegister.jsx';
import UserWallet from './components/wallets/userWallets.jsx';
import TransactionBudget from './components/transactions/transactionBudget.jsx';
import AddEditBudget from './components/transactions/addEditBudget.jsx';
import ProfileSettings from './components/profile/profileSettings.jsx';
import TransactionHistory from './components/transactionDetail/allTransactionHistory.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path={routes.walletDashboard} element={<WalletDashboard />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.userWallet} element={<UserWallet />} />
        <Route path={routes.transactionBudget} element={<TransactionBudget/>} />
        <Route path={routes.addEditBudget} element={<AddEditBudget/>} />
        <Route path={routes.profile} element={<ProfileSettings/>} />
        <Route path={routes.transactionHistory} element={<TransactionHistory/>} />
      </Routes>
    </Router>
  );
}

export default App
