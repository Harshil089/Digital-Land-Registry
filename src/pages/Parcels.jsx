import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { MapPin, Search, Filter, Eye, Edit, Lock, Unlock, X, Calendar, User, Hash, Save } from 'lucide-react'

const Parcels = () => {
  const { isConnected, contract } = useWeb3()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingParcel, setEditingParcel] = useState(null)

  // Demo data for better display
  const demoParcels = [
    {
      id: 1,
      geoHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      area: 1000,
      locationCode: "PUNE-001",
      landUse: "AGRI",
      activeEncumbrance: false,
      owner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      prevOwner: "0x0000000000000000000000000000000000000000",
      startBlock: 12345,
      status: "active",
      description: "Agricultural land suitable for farming and cultivation",
      soilType: "Loamy",
      irrigation: "Available",
      roadAccess: "Yes",
      electricity: "No",
      createdAt: "2024-01-05T09:15:00Z",
      lastUpdated: "2024-01-20T15:30:00Z"
    },
    {
      id: 2,
      geoHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      area: 800,
      locationCode: "PUNE-001",
      landUse: "AGRI",
      activeEncumbrance: true,
      owner: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      prevOwner: "0x0000000000000000000000000000000000000000",
      startBlock: 12346,
      status: "blocked",
      description: "Agricultural land with active encumbrance for loan security",
      soilType: "Clay",
      irrigation: "Limited",
      roadAccess: "Yes",
      electricity: "Yes",
      createdAt: "2024-01-12T11:20:00Z",
      lastUpdated: "2024-01-19T13:10:00Z"
    },
    {
      id: 3,
      geoHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      area: 1200,
      locationCode: "PUNE-002",
      landUse: "RES",
      activeEncumbrance: false,
      owner: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      prevOwner: "0x0000000000000000000000000000000000000000",
      startBlock: 12347,
      status: "active",
      description: "Residential land approved for housing development",
      soilType: "Sandy",
      irrigation: "Not Required",
      roadAccess: "Yes",
      electricity: "Yes",
      createdAt: "2024-01-08T16:45:00Z",
      lastUpdated: "2024-01-08T16:45:00Z"
    }
  ]

  // Initialize parcels from localStorage or demo data
  const [parcels, setParcels] = useState(() => {
    const savedParcels = localStorage.getItem('landchain_parcels')
    if (savedParcels) {
      try {
        return JSON.parse(savedParcels)
      } catch (error) {
        console.error('Error parsing saved parcels:', error)
        return demoParcels
      }
    }
    return demoParcels
  })

  // Save parcels to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('landchain_parcels', JSON.stringify(parcels))
  }, [parcels])

  const filteredParcels = parcels.filter(parcel => {
    const matchesSearch = parcel.id.toString().includes(searchTerm) ||
                         parcel.locationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcel.landUse.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || parcel.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatAddress = (address) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatGeoHash = (hash) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'blocked':
        return 'status-blocked'
      default:
        return 'status-active'
    }
  }

  const getLandUseColor = (landUse) => {
    switch (landUse) {
      case 'AGRI':
        return 'bg-green-100 text-green-800'
      case 'RES':
        return 'bg-blue-100 text-blue-800'
      case 'COM':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewDetails = (parcel) => {
    setSelectedParcel(parcel)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedParcel(null)
  }

  const handleEditParcel = (parcel) => {
    setEditingParcel({ ...parcel })
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingParcel(null)
  }

  const handleEditChange = (field, value) => {
    setEditingParcel(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveEdit = () => {
    if (editingParcel) {
      const updatedParcel = {
        ...editingParcel,
        lastUpdated: new Date().toISOString()
      }
      
      setParcels(prev => prev.map(parcel => 
        parcel.id === updatedParcel.id ? updatedParcel : parcel
      ))
      
      // Update the selected parcel if it's the same one
      if (selectedParcel && selectedParcel.id === updatedParcel.id) {
        setSelectedParcel(updatedParcel)
      }
      
      closeEditModal()
    }
  }

  const handleTransferOwnership = () => {
    if (editingParcel && editingParcel.newOwner) {
      const updatedParcel = {
        ...editingParcel,
        prevOwner: editingParcel.owner,
        owner: editingParcel.newOwner,
        newOwner: '',
        lastUpdated: new Date().toISOString()
      }
      
      setParcels(prev => prev.map(parcel => 
        parcel.id === updatedParcel.id ? updatedParcel : parcel
      ))
      
      if (selectedParcel && selectedParcel.id === updatedParcel.id) {
        setSelectedParcel(updatedParcel)
      }
      
      setEditingParcel(updatedParcel)
    }
  }

  const handleToggleEncumbrance = () => {
    if (editingParcel) {
      const updatedParcel = {
        ...editingParcel,
        activeEncumbrance: !editingParcel.activeEncumbrance,
        status: !editingParcel.activeEncumbrance ? 'blocked' : 'active',
        lastUpdated: new Date().toISOString()
      }
      
      setEditingParcel(updatedParcel)
    }
  }

  const resetToDemoData = () => {
    if (window.confirm('This will reset all parcels to the original demo data. Are you sure?')) {
      localStorage.removeItem('landchain_parcels')
      setParcels(demoParcels)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Land Parcels</h1>
          <p className="text-gray-600 mt-2">View and manage land parcel information</p>
        </div>
        <button
          onClick={resetToDemoData}
          className="btn-secondary flex items-center space-x-2"
        >
          <Hash className="h-4 w-4" />
          <span>Reset to Demo</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search parcels by ID, location, or land use..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parcels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredParcels.map((parcel) => (
          <div key={parcel.id} className="card hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Parcel #{parcel.id}</h3>
              </div>
              <span className={`status-badge ${getStatusColor(parcel.status)}`}>
                {parcel.status}
              </span>
            </div>

            {/* Main Info */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Area:</span>
                <span className="text-sm font-medium text-gray-900">{parcel.area} sqm</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Location:</span>
                <span className="text-sm font-medium text-gray-900">{parcel.locationCode}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Land Use:</span>
                <span className={`status-badge ${getLandUseColor(parcel.landUse)}`}>
                  {parcel.landUse}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Encumbrance:</span>
                <div className="flex items-center space-x-2">
                  {parcel.activeEncumbrance ? (
                    <Lock className="h-4 w-4 text-red-500" />
                  ) : (
                    <Unlock className="h-4 w-4 text-green-500" />
                  )}
                  <span className={`text-sm ${parcel.activeEncumbrance ? 'text-red-600' : 'text-green-600'}`}>
                    {parcel.activeEncumbrance ? 'Active' : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Current Owner:</span>
                  <span className="text-sm font-mono text-gray-900">
                    {formatAddress(parcel.owner)}
                  </span>
                </div>
                
                {parcel.prevOwner !== "0x0000000000000000000000000000000000000000" && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Previous Owner:</span>
                    <span className="text-sm font-mono text-gray-900">
                      {formatAddress(parcel.prevOwner)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Block:</span>
                  <span className="text-sm font-mono text-gray-900">#{parcel.startBlock}</span>
                </div>
              </div>
            </div>

            {/* Geo Hash */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <span className="text-sm text-gray-500">Geo Hash:</span>
                <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 break-all">
                  {formatGeoHash(parcel.geoHash)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewDetails(parcel)}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
                <button 
                  onClick={() => handleEditParcel(parcel)}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredParcels.length === 0 && (
        <div className="card text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parcels found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria'
              : 'No parcels have been created yet'
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
                Connect your MetaMask wallet to view real-time parcel data from the blockchain
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Parcel Details Modal */}
      {showDetailsModal && selectedParcel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Parcel #{selectedParcel.id} Details
                    </h3>
                    <p className="text-gray-600">{selectedParcel.description}</p>
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
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parcel ID:</span>
                      <span className="font-medium">#{selectedParcel.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{selectedParcel.area} sqm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location Code:</span>
                      <span className="font-medium">{selectedParcel.locationCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land Use:</span>
                      <span className={`status-badge ${getLandUseColor(selectedParcel.landUse)}`}>
                        {selectedParcel.landUse}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`status-badge ${getStatusColor(selectedParcel.status)}`}>
                        {selectedParcel.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Land Characteristics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Land Characteristics</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Soil Type:</span>
                      <span className="font-medium">{selectedParcel.soilType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Irrigation:</span>
                      <span className="font-medium">{selectedParcel.irrigation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Road Access:</span>
                      <span className="font-medium">{selectedParcel.roadAccess}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Electricity:</span>
                      <span className="font-medium">{selectedParcel.electricity}</span>
                    </div>
                  </div>
                </div>

                {/* Ownership Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Ownership Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Owner:</span>
                      <span className="font-mono text-sm">{selectedParcel.owner}</span>
                    </div>
                    {selectedParcel.prevOwner !== "0x0000000000000000000000000000000000000000" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Previous Owner:</span>
                        <span className="font-mono text-sm">{selectedParcel.prevOwner}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Block:</span>
                      <span className="font-mono text-sm">#{selectedParcel.startBlock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Encumbrance:</span>
                      <div className="flex items-center space-x-2">
                        {selectedParcel.activeEncumbrance ? (
                          <Lock className="h-4 w-4 text-red-500" />
                        ) : (
                          <Unlock className="h-4 w-4 text-green-500" />
                        )}
                        <span className={`text-sm ${selectedParcel.activeEncumbrance ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedParcel.activeEncumbrance ? 'Active' : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blockchain Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Blockchain Information</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <span className="text-gray-600">Geo Hash:</span>
                      <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-700 break-all">
                        {selectedParcel.geoHash}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-sm">{new Date(selectedParcel.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-sm">{new Date(selectedParcel.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeDetailsModal}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    closeDetailsModal()
                    handleEditParcel(selectedParcel)
                  }}
                  className="btn-primary"
                >
                  Edit Parcel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Parcel Modal */}
      {showEditModal && editingParcel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <Edit className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Edit Parcel #{editingParcel.id}
                    </h3>
                    <p className="text-gray-600">Modify parcel information and settings</p>
                  </div>
                </div>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Edit Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqm)</label>
                      <input
                        type="number"
                        value={editingParcel.area}
                        onChange={(e) => handleEditChange('area', parseInt(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Code</label>
                      <input
                        type="text"
                        value={editingParcel.locationCode}
                        onChange={(e) => handleEditChange('locationCode', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Land Use</label>
                      <select
                        value={editingParcel.landUse}
                        onChange={(e) => handleEditChange('landUse', e.target.value)}
                        className="input-field"
                      >
                        <option value="AGRI">Agricultural</option>
                        <option value="RES">Residential</option>
                        <option value="COM">Commercial</option>
                        <option value="IND">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editingParcel.description}
                        onChange={(e) => handleEditChange('description', e.target.value)}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Land Characteristics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Land Characteristics</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                      <select
                        value={editingParcel.soilType}
                        onChange={(e) => handleEditChange('soilType', e.target.value)}
                        className="input-field"
                      >
                        <option value="Loamy">Loamy</option>
                        <option value="Clay">Clay</option>
                        <option value="Sandy">Sandy</option>
                        <option value="Silty">Silty</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation</label>
                      <select
                        value={editingParcel.irrigation}
                        onChange={(e) => handleEditChange('irrigation', e.target.value)}
                        className="input-field"
                      >
                        <option value="Available">Available</option>
                        <option value="Limited">Limited</option>
                        <option value="Not Required">Not Required</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Road Access</label>
                      <select
                        value={editingParcel.roadAccess}
                        onChange={(e) => handleEditChange('roadAccess', e.target.value)}
                        className="input-field"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Limited">Limited</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Electricity</label>
                      <select
                        value={editingParcel.electricity}
                        onChange={(e) => handleEditChange('electricity', e.target.value)}
                        className="input-field"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Available">Available</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ownership Management */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Ownership Management</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Owner</label>
                      <input
                        type="text"
                        value={editingParcel.owner}
                        onChange={(e) => handleEditChange('owner', e.target.value)}
                        className="input-field"
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Owner (for transfer)</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editingParcel.newOwner || ''}
                          onChange={(e) => handleEditChange('newOwner', e.target.value)}
                          className="input-field flex-1"
                          placeholder="0x..."
                        />
                        <button
                          onClick={handleTransferOwnership}
                          className="btn-warning px-3"
                          disabled={!editingParcel.newOwner}
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Encumbrance Status</span>
                      <button
                        onClick={handleToggleEncumbrance}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          editingParcel.activeEncumbrance 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {editingParcel.activeEncumbrance ? 'Active' : 'None'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Blockchain Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Blockchain Information</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Geo Hash</label>
                      <input
                        type="text"
                        value={editingParcel.geoHash}
                        onChange={(e) => handleEditChange('geoHash', e.target.value)}
                        className="input-field font-mono text-xs"
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Block</label>
                      <input
                        type="number"
                        value={editingParcel.startBlock}
                        onChange={(e) => handleEditChange('startBlock', parseInt(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-500">
                        <strong>Note:</strong> Some blockchain properties cannot be modified after creation.
                        Ownership transfers and encumbrance changes are recorded on the blockchain.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeEditModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Parcels
