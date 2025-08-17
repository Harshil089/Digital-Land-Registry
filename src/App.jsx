import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Parcels from './pages/Parcels'
import Members from './pages/Members'
import Programs from './pages/Programs'
import Transactions from './pages/Transactions'
import { Web3Provider } from './contexts/Web3Context'
import { MemberProvider } from './contexts/MemberContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Web3Provider>
      <MemberProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="lg:pl-64">
              <main className="py-6 px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/parcels" element={<Parcels />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/transactions" element={<Transactions />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </MemberProvider>
    </Web3Provider>
  )
}

export default App
