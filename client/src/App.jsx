import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { routes } from '../constants/navigationRoutes'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalletDashboard from './components/dashboard/walletDashboard'

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
      </Routes>
    </Router>
  );
}

export default App
