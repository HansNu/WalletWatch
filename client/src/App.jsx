import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { routes } from './constants/navigationRoutes.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalletDashboard from './components/dashboard/WalletDashboard.jsx';
import Login from './components/account/loginRegister.jsx';

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('');

  useEffect(() =>{
    fetch('http://localhost:4000/api/message')
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch((err) => console.error('Error fetching data:', err));
  })

  
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
