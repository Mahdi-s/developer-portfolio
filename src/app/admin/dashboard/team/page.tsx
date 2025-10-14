'use client'

import { useState, useEffect } from 'react'
import { TeamMember } from '../../../api/team/route'
import { PageBackground } from '@/components/PageBackground'

interface FormData {
  id?: string
  name: string
  role: string
  biography: string
  profileImage: string
  scholarUrl: string
}

const initialFormData: FormData = {
  name: '',
  role: '',
  biography: '',
  profileImage: '',
  scholarUrl: ''
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      } else {
        console.error('Failed to fetch team members')
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, profileImage: data.url }))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = '/api/team'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchTeamMembers()
        setFormData(initialFormData)
        setIsEditing(false)
        setShowForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save team member')
      }
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Failed to save team member')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setFormData({
      id: member.id,
      name: member.name,
      role: member.role,
      biography: member.biography,
      profileImage: member.profileImage,
      scholarUrl: member.scholarUrl || ''
    })
    setIsEditing(true)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const response = await fetch(`/api/team?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchTeamMembers()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete team member')
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
      alert('Failed to delete team member')
    }
  }

  const handleCancel = () => {
    setFormData(initialFormData)
    setIsEditing(false)
    setShowForm(false)
  }

  if (loading) {
    return (
      <PageBackground>
        <div className="min-h-screen flex items-center justify-center pointer-events-none">
          <div className="text-white text-xl">Loading team members...</div>
        </div>
      </PageBackground>
    )
  }

  return (
    <PageBackground>
      <div className="min-h-screen pointer-events-none">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm shadow-lg border border-white/20 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Team Management</h1>
              <p className="text-sm text-white/80 mt-1">
                Manage lab team members and their profiles
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20 mb-8">
            <div className="px-6 py-4 border-b border-white/20">
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-white/90 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="e.g., Principal Investigator, PhD Student"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="biography" className="block text-sm font-medium text-white/90 mb-2">
                  Biography *
                </label>
                <textarea
                  id="biography"
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-vertical"
                  placeholder="Enter biography and research interests"
                />
              </div>

              <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-white/90 mb-2">
                  Profile Image
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white/20 file:text-white hover:file:bg-white/30 backdrop-blur-sm"
                  />
                  {uploading && <p className="text-sm text-blue-300">Uploading...</p>}
                  {formData.profileImage && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={formData.profileImage}
                        alt="Profile preview"
                        className="w-16 h-16 object-cover rounded-full border-2 border-white/30"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="scholarUrl" className="block text-sm font-medium text-white/90 mb-2">
                  Google Scholar Profile URL
                </label>
                <input
                  type="url"
                  id="scholarUrl"
                  name="scholarUrl"
                  value={formData.scholarUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="https://scholar.google.com/citations?user=..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-white/20">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-white/30 text-white rounded-md hover:bg-white/10 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-md transition-colors duration-200 flex items-center space-x-2"
                >
                  {submitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isEditing ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Team Members List */}
        <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20">
          <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Team Members ({teamMembers.length})
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Team Member</span>
            </button>
          </div>
          
          {teamMembers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-2">No team members yet</h3>
              <p className="text-white/60 mb-4">Get started by adding your first team member.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/20">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {member.profileImage ? (
                        <img
                          src={member.profileImage}
                          alt={member.name}
                          className="w-16 h-16 object-cover rounded-full border-2 border-white/30"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                          <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                          <p className="text-blue-300 font-medium">{member.role}</p>
                          <p className="text-white/70 mt-2 text-sm leading-relaxed">{member.biography}</p>
                          {member.scholarUrl && (
                            <a
                              href={member.scholarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm mt-2"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                              </svg>
                              <span>Google Scholar</span>
                            </a>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-md transition-colors duration-200"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-md transition-colors duration-200"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      </div>
    </PageBackground>
  )
}
