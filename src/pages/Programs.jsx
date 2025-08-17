import React, { useState } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { Calendar, Search, Filter, Users, MapPin, CheckCircle, Clock, XCircle, X, Eye, Award, UserCheck } from 'lucide-react'

const Programs = () => {
  const { isConnected, contract } = useWeb3()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Demo data for better display
  const demoPrograms = [
    {
      id: 101,
      parcelIds: [2, 3],
      closed: true,
      exists: true,
      applicants: [
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
      ],
      winners: [
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
      ],
      createdBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      createdAt: "2024-01-20T16:00:00Z",
      status: "completed",
      description: "Land allocation program for agricultural and residential development",
      criteria: "First-come-first-serve with fair selection",
      applicationDeadline: "2024-01-25T23:59:59Z",
      allocationDate: "2024-01-26T10:00:00Z",
      totalValue: "2000 sqm",
      programType: "Mixed Use"
    }
  ]

  const demoParcels = {
    2: { area: 800, location: "PUNE-001", landUse: "AGRI" },
    3: { area: 1200, location: "PUNE-002", landUse: "RES" }
  }

  const filteredPrograms = demoPrograms.filter(program => {
    const matchesSearch = program.id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatAddress = (address) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-active'
      case 'active':
        return 'status-pending'
      case 'cancelled':
        return 'status-blocked'
      default:
        return 'status-pending'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'active':
        return 'Active'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Active'
    }
  }

  const handleViewDetails = (program) => {
    setSelectedProgram(program)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedProgram(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Allocation Programs</h1>
        <p className="text-gray-600 mt-2">Manage land allocation programs and track applications</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs by ID..."
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
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrograms.map((program) => (
          <div key={program.id} className="card hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Program #{program.id}</h3>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(program.status)}
                <span className={`status-badge ${getStatusColor(program.status)}`}>
                  {getStatusText(program.status)}
                </span>
              </div>
            </div>

            {/* Parcel Information */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Included Parcels:</h4>
              <div className="space-y-2">
                {program.parcelIds.map((parcelId) => {
                  const parcel = demoParcels[parcelId]
                  return (
                    <div key={parcelId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Parcel #{parcelId}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {parcel.area} sqm • {parcel.location} • {parcel.landUse}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{program.applicants.length}</div>
                <div className="text-sm text-blue-600">Applicants</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{program.winners.length}</div>
                <div className="text-sm text-green-600">Winners</div>
              </div>
            </div>

            {/* Applicants */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Applicants:</h4>
              <div className="space-y-1">
                {program.applicants.map((applicant, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-gray-700">{formatAddress(applicant)}</span>
                    {program.winners.includes(applicant) && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Winners */}
            {program.winners.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Winners:</h4>
                <div className="space-y-1">
                  {program.winners.map((winner, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-mono text-green-700">{formatAddress(winner)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Program Details */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created by:</span>
                  <span className="font-mono text-gray-900">{formatAddress(program.createdBy)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created at:</span>
                  <span className="text-gray-900">{new Date(program.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-gray-900">
                    {program.closed ? 'Closed' : 'Open'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewDetails(program)}
                  className="flex-1 btn-secondary py-2"
                >
                  View Details
                </button>
                {!program.closed && (
                  <button className="flex-1 btn-primary py-2">
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <div className="card text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria'
              : 'No allocation programs have been created yet'
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
                Connect your MetaMask wallet to view real-time program data and apply for allocations
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Program Details Modal */}
      {showDetailsModal && selectedProgram && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Program #{selectedProgram.id} Details
                    </h3>
                    <p className="text-gray-600">{selectedProgram.description}</p>
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
                {/* Program Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Program Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Program ID:</span>
                      <span className="font-medium">#{selectedProgram.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedProgram.programType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-medium">{selectedProgram.totalValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`status-badge ${getStatusColor(selectedProgram.status)}`}>
                        {getStatusText(selectedProgram.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Criteria:</span>
                      <span className="font-medium">{selectedProgram.criteria}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Timeline</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-sm">{new Date(selectedProgram.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Application Deadline:</span>
                      <span className="text-sm">{new Date(selectedProgram.applicationDeadline).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allocation Date:</span>
                      <span className="text-sm">{new Date(selectedProgram.allocationDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Parcel Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Included Parcels</h4>
                  
                  <div className="space-y-3">
                    {selectedProgram.parcelIds.map((parcelId) => {
                      const parcel = demoParcels[parcelId]
                      return (
                        <div key={parcelId} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Parcel #{parcelId}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Area:</span>
                              <span className="ml-2 font-medium">{parcel.area} sqm</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Location:</span>
                              <span className="ml-2 font-medium">{parcel.location}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Land Use:</span>
                              <span className="ml-2 font-medium">{parcel.landUse}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Application Statistics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Application Statistics</h4>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedProgram.applicants.length}</div>
                        <div className="text-sm text-blue-600">Total Applicants</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedProgram.winners.length}</div>
                        <div className="text-sm text-green-600">Winners Selected</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Applicants:</h5>
                      {selectedProgram.applicants.map((applicant, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-gray-700">{formatAddress(applicant)}</span>
                          {selectedProgram.winners.includes(applicant) && (
                            <Award className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
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
                {!selectedProgram.closed && (
                  <button className="btn-primary">
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Programs
