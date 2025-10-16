import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { routes } from './constants/navigationRoutes.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalletDashboard from './components/dashboard/WalletDashboard.jsx';
import Login from './components/account/loginRegister.jsx';
import Cookies from 'js-cookie';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={routes.walletDashboard} element={<WalletDashboard />} />
        <Route path={routes.login} element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App
