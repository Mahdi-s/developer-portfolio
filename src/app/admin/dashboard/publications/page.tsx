'use client'

import { useState, useEffect, useMemo } from 'react'
import { Publication } from '@/scripts/ingestPublications'
import { PageBackground } from '@/components/PageBackground'

interface TeamMember {
  id: string;
  name: string;
  role: string;
  biography: string;
  profileImage?: string;
  scholarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PublicationsManagement() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  
  // Filters
  const [yearFilter, setYearFilter] = useState<string>('')
  const [authorFilter, setAuthorFilter] = useState<string>('')
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [publicationsRes, teamRes] = await Promise.all([
          fetch('/api/publications'),
          fetch('/api/team')
        ])
        
        if (!publicationsRes.ok || !teamRes.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const publicationsData = await publicationsRes.json()
        const teamData = await teamRes.json()
        
        setPublications(publicationsData)
        setTeamMembers(teamData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Create a map of team member IDs to names for quick lookup
  const teamMemberMap = useMemo(() => {
    const map = new Map<string, string>()
    teamMembers.forEach(member => {
      map.set(member.id, member.name)
    })
    return map
  }, [teamMembers])
  
  // Filter publications
  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      // Year filter
      if (yearFilter && pub.year !== parseInt(yearFilter)) {
        return false
      }
      
      // Author filter
      if (authorFilter) {
        const authorMatch = pub.authors.some(author => 
          author.toLowerCase().includes(authorFilter.toLowerCase())
        )
        const teamMemberMatch = teamMemberMap.get(pub.teamMemberId)?.toLowerCase().includes(authorFilter.toLowerCase())
        
        if (!authorMatch && !teamMemberMatch) {
          return false
        }
      }
      
      return true
    })
  }, [publications, yearFilter, authorFilter, teamMemberMap])
  
  // Get unique years for filter dropdown
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    publications.forEach(pub => {
      if (pub.year) years.add(pub.year)
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [publications])
  
  // Toggle visibility
  const toggleVisibility = async (publicationId: string, currentVisibility: boolean) => {
    try {
      setSaving(publicationId)
      
      const publication = publications.find(p => p.id === publicationId)
      if (!publication) return
      
      const updatedPublication = {
        ...publication,
        isVisible: !currentVisibility
      }
      
      const response = await fetch('/api/publications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPublication)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update publication')
      }
      
      // Update local state
      setPublications(prev => 
        prev.map(p => p.id === publicationId ? updatedPublication : p)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update publication')
    } finally {
      setSaving(null)
    }
  }
  
  if (loading) {
    return (
      <PageBackground>
        <div className="min-h-screen pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pointer-events-auto">
          <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-3 text-white">Loading publications...</span>
            </div>
          </div>
        </div>
        </div>
      </PageBackground>
    )
  }

  if (error) {
    return (
      <PageBackground>
        <div className="min-h-screen pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pointer-events-auto">
          <div className="bg-red-500/10 backdrop-blur-sm shadow-lg rounded-lg border border-red-500/20 p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md border border-red-500/30 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        </div>
      </PageBackground>
    )
  }

  return (
    <PageBackground>
      <div className="min-h-screen pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pointer-events-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Publications Management</h1>
          <p className="text-white/70">
            Manage visibility of publications for the public articles page. Total: {publications.length} publications
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Filter by Year
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                <option value="">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year} className="bg-gray-800">
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Filter by Author Name
              </label>
              <input
                type="text"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                placeholder="Enter author or team member name..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>
          
          {/* Filter Results Info */}
          {(yearFilter || authorFilter) && (
            <div className="mt-4 text-sm text-white/70">
              Showing {filteredPublications.length} of {publications.length} publications
              {yearFilter && ` • Year: ${yearFilter}`}
              {authorFilter && ` • Author: "${authorFilter}"`}
            </div>
          )}
        </div>
        
        {/* Publications Table */}
        <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Authors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Journal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Citations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Visible
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPublications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-white/60">
                      {publications.length === 0 ? 'No publications found' : 'No publications match the current filters'}
                    </td>
                  </tr>
                ) : (
                  filteredPublications.map((publication) => (
                    <tr key={publication.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-medium">
                          {publication.url ? (
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-300 transition-colors duration-200"
                            >
                              {publication.title}
                            </a>
                          ) : (
                            publication.title
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white/80">
                          {publication.authors.slice(0, 3).join(', ')}
                          {publication.authors.length > 3 && (
                            <span className="text-white/60"> +{publication.authors.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {publication.year || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white/80 max-w-xs truncate">
                          {publication.journal || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {teamMemberMap.get(publication.teamMemberId) || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {publication.citationCount || 0}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVisibility(publication.id, publication.isVisible ?? true)}
                          disabled={saving === publication.id}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent ${
                            publication.isVisible ?? true ? 'bg-green-500' : 'bg-gray-600'
                          } ${saving === publication.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                              publication.isVisible ?? true ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        {saving === publication.id && (
                          <div className="ml-2 inline-block">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/60"></div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Back to Dashboard */}
        <div className="mt-8">
          <a
            href="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors duration-200 backdrop-blur-sm"
          >
            <svg className="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
        </div>
      </div>
      </div>
    </PageBackground>
  )
}