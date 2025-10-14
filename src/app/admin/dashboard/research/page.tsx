'use client'

import { useState, useEffect } from 'react'
import { ResearchProject, ProjectLink } from '../../../api/projects/route'
import { PageBackground } from '@/components/PageBackground'

interface FormData {
  id?: string
  name: string
  description: string
  images: string[]
  links: ProjectLink[]
}

const initialFormData: FormData = {
  name: '',
  description: '',
  images: [],
  links: []
}

const linkTypes = ['Code', 'Demo', 'Paper', 'Dataset', 'Documentation', 'Other'] as const

export default function ResearchProjectsManagement() {
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        console.error('Failed to fetch research projects')
      }
    } catch (error) {
      console.error('Error fetching research projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadedImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'projects')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          uploadedImages.push(data.url)
        } else {
          const error = await response.json()
          alert(error.error || 'Failed to upload image')
          break
        }
      }

      if (uploadedImages.length > 0) {
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, ...uploadedImages] 
        }))
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }))
  }

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { url: '', type: 'Code' }]
    }))
  }

  const updateLink = (index: number, field: 'url' | 'type', value: string) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = '/api/projects'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchProjects()
        setFormData(initialFormData)
        setIsEditing(false)
        setShowForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save research project')
      }
    } catch (error) {
      console.error('Error saving research project:', error)
      alert('Failed to save research project')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (project: ResearchProject) => {
    setFormData({
      id: project.id,
      name: project.name,
      description: project.description,
      images: project.images,
      links: project.links
    })
    setIsEditing(true)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research project?')) return

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchProjects()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete research project')
      }
    } catch (error) {
      console.error('Error deleting research project:', error)
      alert('Failed to delete research project')
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
          <div className="text-white text-xl">Loading research projects...</div>
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
              <h1 className="text-3xl font-bold text-white">Research Projects Management</h1>
              <p className="text-sm text-white/80 mt-1">
                Manage research projects and their information
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
                {isEditing ? 'Edit Research Project' : 'Add New Research Project'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter project name"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-vertical"
                  placeholder="Enter project description"
                />
              </div>

              {/* Project Images */}
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-white/90 mb-2">
                  Project Images
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white/20 file:text-white hover:file:bg-white/30 backdrop-blur-sm"
                  />
                  {uploading && <p className="text-sm text-blue-300">Uploading images...</p>}
                  
                  {/* Image Preview Grid */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md border-2 border-white/30"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(imageUrl)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Project Links */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-white/90">
                    Project Links
                  </label>
                  <button
                    type="button"
                    onClick={addLink}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors duration-200 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Link</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.links.map((link, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white/5 rounded-md border border-white/20">
                      <div className="md:col-span-2">
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          placeholder="Enter URL"
                          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={link.type}
                          onChange={(e) => updateLink(index, 'type', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        >
                          {linkTypes.map((type) => (
                            <option key={type} value={type} className="bg-gray-800">
                              {type}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
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

        {/* Projects List */}
        <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20">
          <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Research Projects ({projects.length})
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Research Project</span>
            </button>
          </div>
          
          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-2">No research projects yet</h3>
              <p className="text-white/60 mb-4">Get started by adding your first research project.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/20">
              {projects.map((project) => (
                <div key={project.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                      <p className="text-white/70 mb-4 leading-relaxed">{project.description}</p>
                      
                      {/* Images */}
                      {project.images.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-white/90 mb-2">Images:</h4>
                          <div className="flex space-x-2 overflow-x-auto">
                            {project.images.map((imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`${project.name} image ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-md border-2 border-white/30 flex-shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Links */}
                      {project.links.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-white/90 mb-2">Links:</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.links.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-sm rounded-full border border-blue-400/30 transition-colors duration-200"
                              >
                                <span>{link.type}</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-md transition-colors duration-200"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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
              ))}
            </div>
          )}
        </div>
      </main>
      </div>
    </PageBackground>
  )
}
