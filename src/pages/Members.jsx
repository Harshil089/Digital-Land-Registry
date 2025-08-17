import React, { useState } from 'react'
import { useMembers } from '../contexts/MemberContext'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Shield,
  Building,
  User
} from 'lucide-react'

const Members = () => {
  const { 
    members, 
    memberHistory, 
    addMember, 
    updateMember, 
    deactivateMember,
    getMemberHistory 
  } = useMembers()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [editingMember, setEditingMember] = useState(null)

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    address: ''
  })

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.role) {
      addMember(newMember)
      setNewMember({ name: '', email: '', phone: '', role: 'user', address: '' })
      setShowAddModal(false)
    }
  }

  const handleUpdateMember = () => {
    if (editingMember && editingMember.name && editingMember.email) {
      updateMember(editingMember.id, {
        name: editingMember.name,
        email: editingMember.email,
        phone: editingMember.phone
      })
      setEditingMember(null)
    }
  }

  const handleDeactivateMember = (id) => {
    if (window.confirm('Are you sure you want to deactivate this member?')) {
      deactivateMember(id)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-purple-600" />
      case 'officer':
        return <Shield className="h-4 w-4 text-blue-600" />
      case 'bank':
        return <Building className="h-4 w-4 text-green-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'officer':
        return 'bg-blue-100 text-blue-800'
      case 'bank':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
          <p className="text-gray-600 mt-2">Manage system members and track their activities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Member</span>
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
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="officer">Officer</option>
              <option value="bank">Bank</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{member.avatar}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500 font-mono">
                          {member.address.slice(0, 10)}...{member.address.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <span className={`status-badge ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${
                      member.status === 'active' ? 'status-active' : 'status-blocked'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.totalTransactions} transactions</div>
                    <div className="text-sm text-gray-500">Last: {member.lastActivity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member)
                          setShowHistoryModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingMember(member)}
                        className="text-warning-600 hover:text-warning-900 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivateMember(member.id)}
                        className="text-danger-600 hover:text-danger-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Member</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="input-field"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="input-field"
                />
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="officer">Officer</option>
                  <option value="bank">Bank</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="Wallet Address (optional)"
                  value={newMember.address}
                  onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="btn-primary"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Member</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                  className="input-field"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={editingMember.phone}
                  onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingMember(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMember}
                  className="btn-primary"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member History Modal */}
      {showHistoryModal && selectedMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Activity History - {selectedMember.name}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {getMemberHistory(selectedMember.id).map((entry) => (
                    <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{entry.action.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">{entry.details}</p>
                        <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                      </div>
                      <span className={`status-badge ${getRoleColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members
