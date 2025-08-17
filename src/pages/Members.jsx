import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { useMembers } from '../contexts/MemberContext'
import { UserPlus, Search, Filter, Eye, Edit, UserX, Plus, X, Save, Trash2, User, Mail, Phone, MapPin, Calendar, Shield, Building } from 'lucide-react'

const Members = () => {
  const { isConnected, contract } = useWeb3()
  const { members, addMember, updateMember, deactivateMember } = useMembers()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [editingMember, setEditingMember] = useState(null)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'USER',
    status: 'active',
    registrationDate: new Date().toISOString().split('T')[0],
    kycStatus: 'pending',
    documents: []
  })

  // Load members from localStorage on component mount
  useEffect(() => {
    const savedMembers = localStorage.getItem('landchain_members')
    if (savedMembers) {
      try {
        const parsedMembers = JSON.parse(savedMembers)
        // Update the context with saved members
        if (parsedMembers.length > 0) {
          // We need to update the context, but since we can't directly modify it,
          // we'll use the localStorage as our source of truth
        }
      } catch (error) {
        console.error('Error parsing saved members:', error)
      }
    }
  }, [])

  // Save members to localStorage whenever members change
  useEffect(() => {
    if (members.length > 0) {
      localStorage.setItem('landchain_members', JSON.stringify(members))
    }
  }, [members])

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm)
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'OFFICER':
        return 'bg-blue-100 text-blue-800'
      case 'BANK':
        return 'bg-purple-100 text-purple-800'
      case 'USER':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'inactive':
        return 'status-blocked'
      case 'suspended':
        return 'status-pending'
      default:
        return 'status-active'
    }
  }

  const getKycColor = (kycStatus) => {
    switch (kycStatus) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const memberToAdd = {
        ...newMember,
        id: Date.now(), // Generate unique ID
        registrationDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString()
      }
      
      addMember(memberToAdd)
      
      // Reset form
      setNewMember({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'USER',
        status: 'active',
        registrationDate: new Date().toISOString().split('T')[0],
        kycStatus: 'pending',
        documents: []
      })
      
      setShowAddModal(false)
    }
  }

  const handleEditMember = (member) => {
    setEditingMember({ ...member })
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingMember(null)
  }

  const handleEditChange = (field, value) => {
    setEditingMember(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveEdit = () => {
    if (editingMember) {
      const updatedMember = {
        ...editingMember,
        lastUpdated: new Date().toISOString()
      }
      
      updateMember(updatedMember.id, updatedMember)
      closeEditModal()
    }
  }

  const handleViewDetails = (member) => {
    setSelectedMember(member)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedMember(null)
  }

  const handleDeactivateMember = (memberId) => {
    if (window.confirm('Are you sure you want to deactivate this member?')) {
      deactivateMember(memberId)
    }
  }

  const handleDeleteMember = (memberId) => {
    if (window.confirm('Are you sure you want to permanently delete this member? This action cannot be undone.')) {
      // Remove from localStorage
      const updatedMembers = members.filter(member => member.id !== memberId)
      localStorage.setItem('landchain_members', JSON.stringify(updatedMembers))
      
      // Force re-render by updating state
      window.location.reload()
    }
  }

  const resetToDemoData = () => {
    if (window.confirm('This will reset all members to the original demo data. Are you sure?')) {
      localStorage.removeItem('landchain_members')
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-2">Manage system members and their roles</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetToDemoData}
            className="btn-secondary flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset to Demo</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending KYC</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.kycStatus === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Officers</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.role === 'OFFICER').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name, email, or phone..."
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
              <option value="ADMIN">Admin</option>
              <option value="OFFICER">Officer</option>
              <option value="BANK">Bank</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="card hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`status-badge ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
                <span className={`status-badge ${getKycColor(member.kycStatus)}`}>
                  {member.kycStatus}
                </span>
              </div>
            </div>

            {/* Main Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{member.email}</span>
              </div>
              
              {member.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{member.phone}</span>
                </div>
              )}
              
              {member.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{member.address}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Role:</span>
                <span className={`status-badge ${getRoleColor(member.role)}`}>
                  {member.role}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Registered:</span>
                <span className="text-sm text-gray-600">
                  {new Date(member.registrationDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewDetails(member)}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => handleEditMember(member)}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDeactivateMember(member.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Deactivate Member"
                >
                  <UserX className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteMember(member.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="card text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-500">
            {searchTerm || roleFilter !== 'all' 
              ? 'Try adjusting your search criteria'
              : 'No members have been added yet'
            }
          </p>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <UserPlus className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Add New Member</h3>
                    <p className="text-gray-600">Create a new member account</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Add Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field"
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                    className="input-field"
                  >
                    <option value="USER">User</option>
                    <option value="OFFICER">Officer</option>
                    <option value="BANK">Bank</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newMember.address}
                    onChange={(e) => setNewMember(prev => ({ ...prev, address: e.target.value }))}
                    className="input-field"
                    placeholder="Full Address"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={!newMember.name || !newMember.email}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <Edit className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Edit Member</h3>
                    <p className="text-gray-600">Modify member information</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingMember.phone}
                    onChange={(e) => handleEditChange('phone', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editingMember.role}
                    onChange={(e) => handleEditChange('role', e.target.value)}
                    className="input-field"
                  >
                    <option value="USER">User</option>
                    <option value="OFFICER">Officer</option>
                    <option value="BANK">Bank</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) => handleEditChange('status', e.target.value)}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
                  <select
                    value={editingMember.kycStatus}
                    onChange={(e) => handleEditChange('kycStatus', e.target.value)}
                    className="input-field"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editingMember.address}
                    onChange={(e) => handleEditChange('address', e.target.value)}
                    className="input-field"
                  />
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

      {/* Member Details Modal */}
      {showDetailsModal && selectedMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h3>
                    <p className="text-gray-600">Member Details & History</p>
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
                      <span className="text-gray-600">Member ID:</span>
                      <span className="font-medium">#{selectedMember.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedMember.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedMember.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedMember.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">{selectedMember.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Status</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className={`status-badge ${getRoleColor(selectedMember.role)}`}>
                        {selectedMember.role}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`status-badge ${getStatusColor(selectedMember.status)}`}>
                        {selectedMember.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">KYC Status:</span>
                      <span className={`status-badge ${getKycColor(selectedMember.kycStatus)}`}>
                        {selectedMember.kycStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Date:</span>
                      <span className="font-medium">
                        {new Date(selectedMember.registrationDate).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedMember.lastUpdated && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">
                          {new Date(selectedMember.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity History */}
                <div className="space-y-4 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Activity History</h4>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Account Created</span>
                        <span className="font-medium">
                          {new Date(selectedMember.registrationDate).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedMember.lastUpdated && selectedMember.lastUpdated !== selectedMember.registrationDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Modified</span>
                          <span className="font-medium">
                            {new Date(selectedMember.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current Status</span>
                        <span className={`status-badge ${getStatusColor(selectedMember.status)}`}>
                          {selectedMember.status}
                        </span>
                      </div>
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
                    handleEditMember(selectedMember)
                  }}
                  className="btn-primary"
                >
                  Edit Member
                </button>
              </div>
            </div>
          </div>
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
                Connect your MetaMask wallet to view real-time member data from the blockchain
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members
