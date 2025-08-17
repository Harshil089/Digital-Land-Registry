import React from 'react'
import { Menu, Wallet, User, LogOut } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'

const Navbar = ({ onMenuClick }) => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3()

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">LandChain</h1>
              </div>
              <div className="hidden lg:block ml-10">
                <div className="flex space-x-8">
                  <span className="text-sm text-gray-500">Blockchain Land Registry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 font-medium">
                    Connected
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700 font-mono">
                    {formatAddress(account)}
                  </span>
                </div>
                
                <button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center space-x-2 btn-primary"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
