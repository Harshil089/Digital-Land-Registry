import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const Web3Context = createContext()

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Contract ABI and address (you'll need to update this after deployment)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Update with actual address
  const contractABI = [
    // Basic ABI for LandRegistry contract
    "function admin() view returns (address)",
    "function officer(address) view returns (bool)",
    "function bankOrOfficer(address) view returns (bool)",
    "function getParcel(uint256) view returns (tuple(uint256,bytes32,uint256,string,string,bool,bool), tuple(address,uint256,address))",
    "function getApplications(uint256) view returns (address[])",
    "function getWinners(uint256) view returns (address[])",
    "function createParcel(uint256,bytes32,uint256,string,string,address)",
    "function transferOwnership(uint256,address)",
    "function setEncumbrance(uint256,bool)",
    "function createAllocation(uint256,uint256[])",
    "function applyForAllocation(uint256)",
    "function allocate(uint256)"
  ]

  const connectWallet = async () => {
    try {
      setLoading(true)
      setError(null)

      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        
        setAccount(accounts[0])
        setProvider(provider)
        setIsConnected(true)
        
        // Initialize contract
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )
        setContract(contractInstance)
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0] || null)
          if (accounts[0]) {
            const newSigner = provider.getSigner()
            const newContract = new ethers.Contract(
              contractAddress,
              contractABI,
              newSigner
            )
            setContract(newContract)
          } else {
            setContract(null)
            setIsConnected(false)
          }
        })
        
      } else {
        setError('MetaMask is not installed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setContract(null)
    setIsConnected(false)
    setError(null)
  }

  const executeTransaction = async (txFunction, ...args) => {
    try {
      setLoading(true)
      setError(null)
      
      const tx = await txFunction(...args)
      const receipt = await tx.wait()
      
      return receipt
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-connect if already authorized
    if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
      connectWallet()
    }
  }, [])

  const value = {
    account,
    provider,
    contract,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    executeTransaction
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}
