import React, { createContext, useContext, useState, useEffect } from 'react'

const MemberContext = createContext()

export const useMembers = () => {
  const context = useContext(MemberContext)
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider')
  }
  return context
}

export const MemberProvider = ({ children }) => {
  // Initialize with demo data or load from localStorage
  const [members, setMembers] = useState(() => {
    const savedMembers = localStorage.getItem('landchain_members')
    if (savedMembers) {
      try {
        return JSON.parse(savedMembers)
      } catch (error) {
        console.error('Error parsing saved members:', error)
        return getDemoMembers()
      }
    }
    return getDemoMembers()
  })

  // Demo data for better display
  function getDemoMembers() {
    return [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1-555-0123",
        address: "123 Main St, New York, NY 10001",
        role: "ADMIN",
        status: "active",
        registrationDate: "2024-01-01T00:00:00Z",
        lastUpdated: "2024-01-01T00:00:00Z",
        kycStatus: "verified",
        documents: ["passport", "drivers_license"],
        totalTransactions: 45,
        lastActivity: "2024-01-20T15:30:00Z"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "+1-555-0124",
        address: "456 Oak Ave, Los Angeles, CA 90210",
        role: "OFFICER",
        status: "active",
        registrationDate: "2024-01-02T00:00:00Z",
        lastUpdated: "2024-01-15T10:20:00Z",
        kycStatus: "verified",
        documents: ["passport", "utility_bill"],
        totalTransactions: 32,
        lastActivity: "2024-01-19T14:15:00Z"
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "+1-555-0125",
        address: "789 Pine Rd, Chicago, IL 60601",
        role: "BANK",
        status: "active",
        registrationDate: "2024-01-03T00:00:00Z",
        lastUpdated: "2024-01-10T09:45:00Z",
        kycStatus: "verified",
        documents: ["business_license", "bank_statement"],
        totalTransactions: 28,
        lastActivity: "2024-01-18T11:30:00Z"
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "+1-555-0126",
        address: "321 Elm St, Miami, FL 33101",
        role: "USER",
        status: "active",
        registrationDate: "2024-01-04T00:00:00Z",
        lastUpdated: "2024-01-12T16:20:00Z",
        kycStatus: "pending",
        documents: ["passport"],
        totalTransactions: 15,
        lastActivity: "2024-01-17T13:45:00Z"
      },
      {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@example.com",
        phone: "+1-555-0127",
        address: "654 Maple Dr, Seattle, WA 98101",
        role: "USER",
        status: "inactive",
        registrationDate: "2024-01-05T00:00:00Z",
        lastUpdated: "2024-01-08T12:10:00Z",
        kycStatus: "rejected",
        documents: ["passport", "utility_bill"],
        totalTransactions: 8,
        lastActivity: "2024-01-08T12:10:00Z"
      },
      {
        id: 6,
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        phone: "+1-555-0128",
        address: "987 Cedar Ln, Denver, CO 80201",
        role: "OFFICER",
        status: "active",
        registrationDate: "2024-01-06T00:00:00Z",
        lastUpdated: "2024-01-14T08:30:00Z",
        kycStatus: "verified",
        documents: ["passport", "drivers_license", "background_check"],
        totalTransactions: 41,
        lastActivity: "2024-01-20T09:15:00Z"
      },
      {
        id: 7,
        name: "Robert Taylor",
        email: "robert.taylor@example.com",
        phone: "+1-555-0129",
        address: "147 Birch Way, Austin, TX 73301",
        role: "BANK",
        status: "active",
        registrationDate: "2024-01-07T00:00:00Z",
        lastUpdated: "2024-01-11T14:20:00Z",
        kycStatus: "verified",
        documents: ["business_license", "bank_statement", "regulatory_approval"],
        totalTransactions: 35,
        lastActivity: "2024-01-19T16:45:00Z"
      },
      {
        id: 8,
        name: "Jennifer Martinez",
        email: "jennifer.martinez@example.com",
        phone: "+1-555-0130",
        address: "258 Spruce St, Portland, OR 97201",
        role: "USER",
        status: "active",
        registrationDate: "2024-01-08T00:00:00Z",
        lastUpdated: "2024-01-13T11:55:00Z",
        kycStatus: "pending",
        documents: ["passport", "utility_bill"],
        totalTransactions: 12,
        lastActivity: "2024-01-16T10:30:00Z"
      }
    ]
  }

  // Save members to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('landchain_members', JSON.stringify(members))
  }, [members])

  const addMember = (member) => {
    const newMember = {
      ...member,
      id: member.id || Date.now(),
      registrationDate: member.registrationDate || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: member.status || 'active',
      kycStatus: member.kycStatus || 'pending',
      documents: member.documents || [],
      totalTransactions: member.totalTransactions || 0,
      lastActivity: new Date().toISOString()
    }
    
    setMembers(prev => [...prev, newMember])
  }

  const updateMember = (id, updatedData) => {
    setMembers(prev => prev.map(member => 
      member.id === id 
        ? { ...member, ...updatedData, lastUpdated: new Date().toISOString() }
        : member
    ))
  }

  const deactivateMember = (id) => {
    setMembers(prev => prev.map(member => 
      member.id === id 
        ? { ...member, status: 'inactive', lastUpdated: new Date().toISOString() }
        : member
    ))
  }

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(member => member.id !== id))
  }

  const getMemberById = (id) => {
    return members.find(member => member.id === id)
  }

  const getMembersByRole = (role) => {
    return members.filter(member => member.role === role)
  }

  const getActiveMembers = () => {
    return members.filter(member => member.status === 'active')
  }

  const getMembersByKycStatus = (kycStatus) => {
    return members.filter(member => member.kycStatus === kycStatus)
  }

  const resetToDemoData = () => {
    localStorage.removeItem('landchain_members')
    setMembers(getDemoMembers())
  }

  const value = {
    members,
    addMember,
    updateMember,
    deactivateMember,
    deleteMember,
    getMemberById,
    getMembersByRole,
    getActiveMembers,
    getMembersByKycStatus,
    resetToDemoData
  }

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  )
}
