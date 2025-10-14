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

export default function ArticlesPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [yearFilter, setYearFilter] = useState<string>('')
  const [authorFilter, setAuthorFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

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
        
        // Only show visible publications
        const visiblePublications = publicationsData.filter((pub: Publication) => pub.isVisible !== false)
        
        setPublications(visiblePublications)
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
        const hasAuthor = pub.authors.some(author => 
          author.toLowerCase().includes(authorFilter.toLowerCase())
        )
        if (!hasAuthor) {
          return false
        }
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const titleMatch = pub.title.toLowerCase().includes(query)
        const authorMatch = pub.authors.some(author => 
          author.toLowerCase().includes(query)
        )
        const journalMatch = pub.journal?.toLowerCase().includes(query)
        const teamMemberMatch = teamMemberMap.get(pub.teamMemberId)?.toLowerCase().includes(query)
        
        if (!titleMatch && !authorMatch && !journalMatch && !teamMemberMatch) {
          return false
        }
      }
      
      return true
    })
  }, [publications, yearFilter, authorFilter, searchQuery, teamMemberMap])

  // Get unique years for filter dropdown
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    publications.forEach(pub => {
      if (pub.year) years.add(pub.year)
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [publications])

  // Get unique authors for filter dropdown
  const availableAuthors = useMemo(() => {
    const authors = new Set<string>()
    publications.forEach(pub => {
      pub.authors.forEach(author => {
        authors.add(author.trim())
      })
    })
    return Array.from(authors).sort()
  }, [publications])

  // Group publications by year for better display
  const publicationsByYear = useMemo(() => {
    const grouped = new Map<number, Publication[]>()
    
    filteredPublications.forEach(pub => {
      const year = pub.year || 0
      if (!grouped.has(year)) {
        grouped.set(year, [])
      }
      grouped.get(year)!.push(pub)
    })
    
    // Sort publications within each year by title
    grouped.forEach(pubs => {
      pubs.sort((a, b) => a.title.localeCompare(b.title))
    })
    
    // Convert to array and sort by year (descending)
    return Array.from(grouped.entries())
      .sort(([a], [b]) => {
        if (a === 0) return 1 // Put "Unknown year" at the end
        if (b === 0) return -1
        return b - a
      })
  }, [filteredPublications])

  if (loading) {
    return (
      <PageBackground>
        <div className="min-h-screen pointer-events-none">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-500/10 backdrop-blur-sm shadow-lg rounded-lg border border-red-500/20 p-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
                <p className="text-red-300">{error}</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Publications</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Explore our research publications and academic contributions to the field of signals and systems.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20 p-6 mb-8 pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Search Publications
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or journal..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            
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
                Filter by Author
              </label>
              <select
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                <option value="">All Authors</option>
                {availableAuthors.map(author => (
                  <option key={author} value={author} className="bg-gray-800">
                    {author}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Info */}
          <div className="mt-4 text-sm text-white/70">
            Showing {filteredPublications.length} of {publications.length} publications
            {yearFilter && ` • Year: ${yearFilter}`}
            {authorFilter && ` • Author: ${authorFilter}`}
            {searchQuery && ` • Search: "${searchQuery}"`}
          </div>
        </div>

        {/* Publications */}
        {publicationsByYear.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20 p-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-white/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-medium text-white/80 mb-2">No Publications Found</h3>
              <p className="text-white/60">
                {publications.length === 0 
                  ? 'No publications are currently available.' 
                  : 'No publications match your current search criteria.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {publicationsByYear.map(([year, pubs]) => (
              <div key={year} className="bg-white/10 backdrop-blur-sm shadow-lg rounded-lg border border-white/20 overflow-hidden">
                <div className="bg-white/5 px-6 py-4 border-b border-white/20">
                  <h2 className="text-xl font-semibold text-white">
                    {year === 0 ? 'Year Unknown' : year}
                  </h2>
                  <p className="text-sm text-white/60">{pubs.length} publication{pubs.length !== 1 ? 's' : ''}</p>
                </div>
                
                <div className="divide-y divide-white/10">
                  {pubs.map((publication) => (
                    <div key={publication.id} className="p-6 hover:bg-white/5 transition-colors duration-200">
                      <div className="flex flex-col space-y-3">
                        {/* Title */}
                        <h3 className="text-lg font-medium text-white leading-tight">
                          {publication.url ? (
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-300 transition-colors duration-200 underline decoration-blue-300/50 hover:decoration-blue-300 pointer-events-auto"
                            >
                              {publication.title}
                            </a>
                          ) : (
                            publication.title
                          )}
                        </h3>
                        
                        {/* Authors */}
                        <div className="text-white/80">
                          <span className="text-sm font-medium text-white/60">Authors: </span>
                          {publication.authors.join(', ')}
                        </div>
                        
                        {/* Journal */}
                        {publication.journal && (
                          <div className="text-white/80">
                            <span className="text-sm font-medium text-white/60">Published in: </span>
                            {publication.journal}
                          </div>
                        )}
                        
                        {/* Team Member */}
                        <div className="text-white/80">
                          <span className="text-sm font-medium text-white/60">Team Member: </span>
                          {teamMemberMap.get(publication.teamMemberId) || 'Unknown'}
                        </div>
                        
                        {/* Citations */}
                        {publication.citationCount && publication.citationCount > 0 && (
                          <div className="text-white/80">
                            <span className="text-sm font-medium text-white/60">Citations: </span>
                            {publication.citationCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </PageBackground>
  )
}
