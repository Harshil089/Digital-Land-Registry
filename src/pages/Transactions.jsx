import React, { useState } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { Activity, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, X, Eye, Hash, Calendar, User, ArrowRight } from 'lucide-react'

const Transactions = () => {
  const { isConnected, contract } = useWeb3()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Demo transaction data for better display
  const demoTransactions = [
    {
      id: 1,
      type: "parcel_created",
      details: "Parcel #1 created with 1000 sqm area",
      from: "0x0000000000000000000000000000000000000000",
      to: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      blockNumber: 12345,
      timestamp: "2024-01-05T09:15:00Z",
      status: "confirmed",
      gasUsed: "150000",
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      gasPrice: "20000000000",
      nonce: 0,
      confirmations: 12,
      description: "New agricultural land parcel registered in the system",
      metadata: {
        parcelId: 1,
        area: "1000 sqm",
        location: "PUNE-001",
        landUse: "AGRI"
      }
    },
    {
      id: 2,
      type: "parcel_created",
      details: "Parcel #2 created with 800 sqm area",
      from: "0x0000000000000000000000000000000000000000",
      to: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      blockNumber: 12346,
      timestamp: "2024-01-12T11:20:00Z",
      status: "confirmed",
      gasUsed: "150000",
      hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      gasPrice: "20000000000",
      nonce: 1,
      confirmations: 8,
      description: "New agricultural land parcel registered in the system",
      metadata: {
        parcelId: 2,
        area: "800 sqm",
        location: "PUNE-001",
        landUse: "AGRI"
      }
    },
    {
      id: 3,
      type: "parcel_created",
      details: "Parcel #3 created with 1200 sqm area",
      from: "0x0000000000000000000000000000000000000000",
      to: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      blockNumber: 12347,
      timestamp: "2024-01-08T16:45:00Z",
      status: "confirmed",
      gasUsed: "150000",
      hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      gasPrice: "20000000000",
      nonce: 2,
      confirmations: 15,
      description: "New residential land parcel registered in the system",
      metadata: {
        parcelId: 3,
        area: "1200 sqm",
        location: "PUNE-002",
        landUse: "RES"
      }
    },
    {
      id: 4,
      type: "encumbrance_set",
      details: "Encumbrance set on Parcel #2",
      from: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      to: "0x0000000000000000000000000000000000000000",
      blockNumber: 12348,
      timestamp: "2024-01-19T13:10:00Z",
      status: "confirmed",
      gasUsed: "80000",
      hash: "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123",
      gasPrice: "20000000000",
      nonce: 3,
      confirmations: 6,
      description: "Bank officer set encumbrance on agricultural land for loan security",
      metadata: {
        parcelId: 2,
        encumbranceType: "Loan Security",
        bankOfficer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
      }
    },
    {
      id: 5,
      type: "ownership_transferred",
      details: "Parcel #1 ownership transferred",
      from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      to: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      blockNumber: 12349,
      timestamp: "2024-01-20T15:30:00Z",
      status: "confirmed",
      gasUsed: "120000",
      hash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
      gasPrice: "20000000000",
      nonce: 4,
      confirmations: 3,
      description: "Land ownership transferred from farmer to new owner",
      metadata: {
        parcelId: 1,
        transferReason: "Sale",
        previousOwner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
      }
    },
    {
      id: 6,
      type: "program_created",
      details: "Allocation program #101 created for parcels [2,3]",
      from: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      to: "0x0000000000000000000000000000000000000000",
      blockNumber: 12350,
      timestamp: "2024-01-20T16:00:00Z",
      status: "confirmed",
      gasUsed: "200000",
      hash: "0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345",
      gasPrice: "20000000000",
      nonce: 5,
      confirmations: 2,
      description: "New land allocation program created for agricultural and residential development",
      metadata: {
        programId: 101,
        includedParcels: [2, 3],
        totalArea: "2000 sqm",
        programType: "Mixed Use"
      }
    },
    {
      id: 7,
      type: "application_submitted",
      details: "Application submitted for program #101",
      from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      to: "0x0000000000000000000000000000000000000000",
      blockNumber: 12351,
      timestamp: "2024-01-20T16:15:00Z",
      status: "confirmed",
      gasUsed: "60000",
      hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      gasPrice: "20000000000",
      nonce: 6,
      confirmations: 1,
      description: "User submitted application for land allocation program",
      metadata: {
        programId: 101,
        applicant: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        applicationType: "Individual"
      }
    },
    {
      id: 8,
      type: "allocation_completed",
      details: "Program #101 allocation completed with 2 winners",
      from: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      to: "0x0000000000000000000000000000000000000000",
      blockNumber: 12352,
      timestamp: "2024-01-20T16:30:00Z",
      status: "confirmed",
      gasUsed: "180000",
      hash: "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567",
      gasPrice: "20000000000",
      nonce: 7,
      confirmations: 0,
      description: "Land allocation program completed successfully with winner selection",
      metadata: {
        programId: 101,
        winners: ["0x90F79bf6EB2c4f870365E785982E1f101E93b906", "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"],
        totalWinners: 2,
        selectionMethod: "First-come-first-serve"
      }
    }
  ]

  const filteredTransactions = demoTransactions.filter(tx => {
    const matchesSearch = tx.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.hash.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    return matchesSearch && matchesType
  })

  const formatAddress = (address) => {
    if (!address || address === "0x0000000000000000000000000000000000000000") return 'System'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatHash = (hash) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'parcel_created':
        return <Activity className="h-5 w-5 text-blue-500" />
      case 'ownership_transferred':
        return <Activity className="h-5 w-5 text-green-500" />
      case 'encumbrance_set':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case 'program_created':
        return <Activity className="h-5 w-5 text-purple-500" />
      case 'application_submitted':
        return <Activity className="h-5 w-5 text-indigo-500" />
      case 'allocation_completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'parcel_created':
        return 'bg-blue-100 text-blue-800'
      case 'ownership_transferred':
        return 'bg-green-100 text-green-800'
      case 'encumbrance_set':
        return 'bg-orange-100 text-orange-800'
      case 'program_created':
        return 'bg-purple-100 text-purple-800'
      case 'application_submitted':
        return 'bg-indigo-100 text-indigo-800'
      case 'allocation_completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-active'
      case 'pending':
        return 'status-pending'
      case 'failed':
        return 'status-blocked'
      default:
        return 'status-pending'
    }
  }

  const getTypeLabel = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedTransaction(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-2">View all blockchain transactions and their status</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions by details, type, or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="parcel_created">Parcel Created</option>
              <option value="ownership_transferred">Ownership Transferred</option>
              <option value="encumbrance_set">Encumbrance Set</option>
              <option value="program_created">Program Created</option>
              <option value="application_submitted">Application Submitted</option>
              <option value="allocation_completed">Allocation Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Icon and Type */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`status-badge ${getTransactionColor(tx.type)}`}>
                    {getTypeLabel(tx.type)}
                  </span>
                  <span className={`status-badge ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-gray-900 mb-2">{tx.details}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">From: </span>
                    <span className="font-mono text-gray-900">{formatAddress(tx.from)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">To: </span>
                    <span className="font-mono text-gray-900">{formatAddress(tx.to)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Block: </span>
                    <span className="font-mono text-gray-900">#{tx.blockNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Gas Used: </span>
                    <span className="text-gray-900">{tx.gasUsed}</span>
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className="mt-3">
                  <span className="text-gray-500 text-sm">Hash: </span>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 break-all mt-1">
                    {formatHash(tx.hash)}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mt-3 text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>

              {/* Status Icon and Actions */}
              <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                {getStatusIcon(tx.status)}
                <button
                  onClick={() => handleViewDetails(tx)}
                  className="btn-secondary flex items-center space-x-2 py-2 px-3"
                >
                  <Eye className="h-4 w-4" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="card text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">
            {searchTerm || typeFilter !== 'all' 
              ? 'Try adjusting your search criteria'
              : 'No transactions have been recorded yet'
            }
          </p>
        </div>
      )}

      {/* Connection Warning */}
      {!isConnected && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Wallet Not Connected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Connect your MetaMask wallet to view real-time transaction data from the blockchain
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    {getTransactionIcon(selectedTransaction.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Transaction #{selectedTransaction.id}
                    </h3>
                    <p className="text-gray-600">{selectedTransaction.description}</p>
                  </div>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Transaction Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className={`status-badge ${getTransactionColor(selectedTransaction.type)}`}>
                        {getTypeLabel(selectedTransaction.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`status-badge ${getStatusColor(selectedTransaction.status)}`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Block Number:</span>
                      <span className="font-mono text-sm">#{selectedTransaction.blockNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confirmations:</span>
                      <span className="font-medium">{selectedTransaction.confirmations}</span>
                    </div>
                  </div>
                </div>

                {/* Gas Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Gas Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gas Used:</span>
                      <span className="font-medium">{selectedTransaction.gasUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gas Price:</span>
                      <span className="font-medium">{selectedTransaction.gasPrice} wei</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nonce:</span>
                      <span className="font-medium">{selectedTransaction.nonce}</span>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Addresses</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <span className="text-gray-600">From:</span>
                      <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 break-all">
                        {selectedTransaction.from}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-gray-600">To:</span>
                      <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 break-all">
                        {selectedTransaction.to}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Transaction Hash</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <span className="text-gray-600">Hash:</span>
                      <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-700 break-all">
                        {selectedTransaction.hash}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="text-sm">{new Date(selectedTransaction.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                {selectedTransaction.metadata && (
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Transaction Metadata</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedTransaction.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">
                            {Array.isArray(value) ? value.join(', ') : value.toString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeDetailsModal}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  View on Explorer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions
