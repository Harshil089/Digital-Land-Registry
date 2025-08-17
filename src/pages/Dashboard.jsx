import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { useMembers } from '../contexts/MemberContext'
import { 
  MapPin, 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

const Dashboard = () => {
  const { isConnected, contract } = useWeb3()
  const { members, memberHistory } = useMembers()
  const [stats, setStats] = useState({
    totalParcels: 0,
    totalMembers: 0,
    activePrograms: 0,
    totalTransactions: 0
  })

  // Demo data for better display
  const demoStats = {
    totalParcels: 3,
    totalMembers: 5,
    activePrograms: 1,
    totalTransactions: 8
  }

  const demoParcels = [
    {
      id: 1,
      area: 1000,
      location: "PUNE-001",
      landUse: "AGRI",
      owner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      status: "active",
      encumbrance: false
    },
    {
      id: 2,
      area: 800,
      location: "PUNE-001",
      landUse: "AGRI",
      owner: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      status: "blocked",
      encumbrance: true
    },
    {
      id: 3,
      area: 1200,
      location: "PUNE-002",
      landUse: "RES",
      owner: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      status: "active",
      encumbrance: false
    }
  ]

  const flowSteps = [
    {
      id: 1,
      title: "Parcel Creation",
      description: "Officer creates new land parcels with geo-hash and metadata",
      status: "completed",
      icon: MapPin,
      details: "3 parcels created with unique IDs and location codes"
    },
    {
      id: 2,
      title: "Role Assignment",
      description: "Admin assigns officer and bank roles to members",
      status: "completed",
      icon: Shield,
      details: "2 officers and 1 bank officer assigned"
    },
    {
      id: 3,
      title: "Encumbrance Setting",
      description: "Bank sets encumbrance on parcels for loan security",
      status: "completed",
      icon: AlertCircle,
      details: "Parcel #2 has active encumbrance"
    },
    {
      id: 4,
      title: "Ownership Transfer",
      description: "Officer transfers parcel ownership between parties",
      status: "completed",
      icon: ArrowRight,
      details: "Parcel #1 transferred successfully"
    },
    {
      id: 5,
      title: "Allocation Program",
      description: "Create and manage land allocation programs",
      status: "completed",
      icon: Calendar,
      details: "Program #101 created for parcels [2,3]"
    },
    {
      id: 6,
      title: "Application & Selection",
      description: "Users apply and winners are selected",
      status: "completed",
      icon: CheckCircle,
      details: "3 applicants, 2 winners selected"
    }
  ]

  useEffect(() => {
    setStats(demoStats)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to LandChain - Your blockchain-based land registry system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Parcels</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalParcels}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Programs</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activePrograms}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Control Visualization */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Flow Control</h2>
        <div className="space-y-4">
          {flowSteps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {getStatusIcon(step.status)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                  <span className={`status-badge ${getStatusColor(step.status)}`}>
                    {step.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                <p className="text-xs text-gray-500 mt-1">{step.details}</p>
              </div>

              {index < flowSteps.length - 1 && (
                <div className="flex-shrink-0 mt-4">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Parcels */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Parcels</h3>
          <div className="space-y-3">
            {demoParcels.map((parcel) => (
              <div key={parcel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Parcel #{parcel.id}</p>
                    <p className="text-xs text-gray-500">{parcel.location} • {parcel.landUse}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{parcel.area} sqm</p>
                  <span className={`status-badge ${getStatusColor(parcel.status)}`}>
                    {parcel.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Members */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Members</h3>
          <div className="space-y-3">
            {members.slice(0, 3).map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{member.avatar}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role} • {member.email}</p>
                </div>
                <span className={`status-badge ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Wallet Not Connected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Connect your MetaMask wallet to interact with the blockchain
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
