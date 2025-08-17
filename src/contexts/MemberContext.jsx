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
  const [members, setMembers] = useState([])
  const [memberHistory, setMemberHistory] = useState([])
  const [loading, setLoading] = useState(false)

  // Demo data for better display purposes
  const demoMembers = [
    {
      id: 1,
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      role: "officer",
      name: "John Officer",
      email: "john.officer@landchain.gov",
      phone: "+1-555-0101",
      joinDate: "2024-01-15",
      status: "active",
      lastActivity: "2024-01-20",
      totalTransactions: 45,
      avatar: "👨‍💼"
    },
    {
      id: 2,
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      role: "bank",
      name: "Sarah Banker",
      email: "sarah.banker@citybank.com",
      phone: "+1-555-0102",
      joinDate: "2024-01-10",
      status: "active",
      lastActivity: "2024-01-19",
      totalTransactions: 23,
      avatar: "🏦"
    },
    {
      id: 3,
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      role: "user",
      name: "Mike Landowner",
      email: "mike@landowner.com",
      phone: "+1-555-0103",
      joinDate: "2024-01-05",
      status: "active",
      lastActivity: "2024-01-18",
      totalTransactions: 12,
      avatar: "👨‍🌾"
    },
    {
      id: 4,
      address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      role: "user",
      name: "Lisa Farmer",
      email: "lisa@farmland.com",
      phone: "+1-555-0104",
      joinDate: "2024-01-12",
      status: "active",
      lastActivity: "2024-01-17",
      totalTransactions: 8,
      avatar: "👩‍🌾"
    },
    {
      id: 5,
      address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      role: "user",
      name: "David Developer",
      email: "david@devland.com",
      phone: "+1-555-0105",
      joinDate: "2024-01-08",
      status: "active",
      lastActivity: "2024-01-16",
      totalTransactions: 15,
      avatar: "👨‍💻"
    }
  ]

  const demoHistory = [
    {
      id: 1,
      memberId: 1,
      action: "role_assigned",
      details: "Assigned officer role",
      timestamp: "2024-01-15T10:00:00Z",
      status: "completed"
    },
    {
      id: 2,
      memberId: 2,
      action: "role_assigned",
      details: "Assigned bank role",
      timestamp: "2024-01-10T14:30:00Z",
      status: "completed"
    },
    {
      id: 3,
      memberId: 3,
      action: "parcel_created",
      details: "Created parcel #1 (1000 sqm, AGRI)",
      timestamp: "2024-01-05T09:15:00Z",
      status: "completed"
    },
    {
      id: 4,
      memberId: 4,
      action: "parcel_created",
      details: "Created parcel #2 (800 sqm, AGRI)",
      timestamp: "2024-01-12T11:20:00Z",
      status: "completed"
    },
    {
      id: 5,
      memberId: 5,
      action: "parcel_created",
      details: "Created parcel #3 (1200 sqm, RES)",
      timestamp: "2024-01-08T16:45:00Z",
      status: "completed"
    },
    {
      id: 6,
      memberId: 2,
      action: "encumbrance_set",
      details: "Set encumbrance on parcel #2",
      timestamp: "2024-01-19T13:10:00Z",
      status: "completed"
    },
    {
      id: 7,
      memberId: 1,
      action: "ownership_transferred",
      details: "Transferred parcel #1 to 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      timestamp: "2024-01-20T15:30:00Z",
      status: "completed"
    },
    {
      id: 8,
      memberId: 1,
      action: "program_created",
      details: "Created allocation program #101 for parcels [2,3]",
      timestamp: "2024-01-20T16:00:00Z",
      status: "completed"
    }
  ]

  useEffect(() => {
    // Load demo data
    setMembers(demoMembers)
    setMemberHistory(demoHistory)
  }, [])

  const addMember = (memberData) => {
    const newMember = {
      id: members.length + 1,
      ...memberData,
      joinDate: new Date().toISOString().split('T')[0],
      status: "active",
      lastActivity: new Date().toISOString().split('T')[0],
      totalTransactions: 0,
      avatar: getAvatarForRole(memberData.role)
    }
    
    setMembers(prev => [...prev, newMember])
    
    // Add to history
    const historyEntry = {
      id: memberHistory.length + 1,
      memberId: newMember.id,
      action: "member_registered",
      details: `New member registered: ${memberData.name}`,
      timestamp: new Date().toISOString(),
      status: "completed"
    }
    
    setMemberHistory(prev => [...prev, historyEntry])
  }

  const updateMember = (id, updates) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ))
    
    // Add to history
    const historyEntry = {
      id: memberHistory.length + 1,
      memberId: id,
      action: "member_updated",
      details: `Member updated: ${Object.keys(updates).join(', ')}`,
      timestamp: new Date().toISOString(),
      status: "completed"
    }
    
    setMemberHistory(prev => [...prev, historyEntry])
  }

  const deactivateMember = (id) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, status: "inactive" } : member
    ))
    
    // Add to history
    const historyEntry = {
      id: memberHistory.length + 1,
      memberId: id,
      action: "member_deactivated",
      details: "Member deactivated",
      timestamp: new Date().toISOString(),
      status: "completed"
    }
    
    setMemberHistory(prev => [...prev, historyEntry])
  }

  const getAvatarForRole = (role) => {
    const avatars = {
      admin: "👑",
      officer: "👨‍💼",
      bank: "🏦",
      user: "👤"
    }
    return avatars[role] || "👤"
  }

  const getMemberById = (id) => {
    return members.find(member => member.id === id)
  }

  const getMembersByRole = (role) => {
    return members.filter(member => member.role === role)
  }

  const getActiveMembers = () => {
    return members.filter(member => member.status === "active")
  }

  const getMemberHistory = (memberId) => {
    return memberHistory.filter(entry => entry.memberId === memberId)
  }

  const value = {
    members,
    memberHistory,
    loading,
    addMember,
    updateMember,
    deactivateMember,
    getMemberById,
    getMembersByRole,
    getActiveMembers,
    getMemberHistory
  }

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  )
}
