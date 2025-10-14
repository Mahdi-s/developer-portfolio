'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { PageBackground } from '@/components/PageBackground'

interface TeamMember {
  id: string
  name: string
  role: string
  biography: string
  profileImage: string
  scholarUrl?: string
  createdAt: string
  updatedAt: string
}

interface Publication {
  id: string
  title: string
  authors: string[]
  year?: number
  journal: string
  citationCount?: number | null
  url: string
  teamMemberId: string
  isVisible: boolean
}

// Bento Grid Component
const BentoGrid = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`grid auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  )
}

// Bento Grid Item Component
const BentoGridItem = ({ 
  children, 
  className = "", 
  onClick 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  return (
    <div 
      className={`row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-white/10 backdrop-blur-sm border border-white/20 justify-between flex flex-col space-y-4 cursor-pointer hover:bg-white/15 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Modal Component
const TeamMemberModal = ({ 
  member, 
  publications, 
  isOpen, 
  onClose 
}: { 
  member: TeamMember | null
  publications: Publication[]
  isOpen: boolean
  onClose: () => void
}) => {
  if (!member) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
            >
              ×
            </button>

            {/* Member Info */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-shrink-0">
                {member.profileImage ? (
                  <Image
                    src={member.profileImage}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-full border-4 border-white/30"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                    <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-white mb-2">{member.name}</h2>
                <p className="text-xl text-blue-300 font-medium mb-4">{member.role}</p>
                <p className="text-white/80 leading-relaxed mb-6">{member.biography}</p>
                
                {member.scholarUrl && (
                  <a
                    href={member.scholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 bg-white/10 px-6 py-3 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                    </svg>
                    <span>View Google Scholar Profile</span>
                  </a>
                )}
              </div>
            </div>

            {/* Publications */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Publications</h3>
              {publications.length > 0 ? (
                <div className="space-y-4">
                  {publications.map((pub) => (
                    <div key={pub.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        <a 
                          href={pub.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-300 transition-colors"
                        >
                          {pub.title}
                        </a>
                      </h4>
                      <p className="text-white/70 mb-2">
                        <span className="font-medium">Authors:</span> {pub.authors.join(', ')}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                        {pub.year && <span><span className="font-medium">Year:</span> {pub.year}</span>}
                        <span><span className="font-medium">Journal:</span> {pub.journal}</span>
                        {pub.citationCount !== null && pub.citationCount !== undefined && (
                          <span><span className="font-medium">Citations:</span> {pub.citationCount}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No publications found for this member.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [memberPublications, setMemberPublications] = useState<Publication[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingPublications, setLoadingPublications] = useState(false)

  useEffect(() => {
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

    fetchTeamMembers()
  }, [])

  const handleMemberClick = async (member: TeamMember) => {
    setSelectedMember(member)
    setLoadingPublications(true)
    setIsModalOpen(true)

    try {
      const response = await fetch(`/api/publications?teamMemberId=${member.id}`)
      if (response.ok) {
        const publications = await response.json()
        setMemberPublications(publications.filter((pub: Publication) => pub.isVisible))
      } else {
        console.error('Failed to fetch publications')
        setMemberPublications([])
      }
    } catch (error) {
      console.error('Error fetching publications:', error)
      setMemberPublications([])
    } finally {
      setLoadingPublications(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMember(null)
    setMemberPublications([])
  }

  // Generate Bento grid layout patterns
  const getBentoItemClass = (index: number) => {
    const patterns = [
      "md:col-span-2", // wide
      "md:row-span-2", // tall
      "", // normal
      "md:col-span-2 md:row-span-2", // large (every 6th item)
      "", // normal
      "" // normal
    ]
    
    // Special pattern for larger cards
    if (index % 6 === 3) return "md:col-span-2 md:row-span-2"
    if (index % 4 === 0) return "md:col-span-2"
    if (index % 5 === 2) return "md:row-span-2"
    
    return ""
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
      <div className="min-h-screen py-12 pointer-events-none">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pointer-events-none">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the Team
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Our diverse team of researchers, engineers, and scientists working together to advance the field of signals and systems.
          </p>
        </div>
      </div>

      {/* Team Members */}
      <div className="px-4 sm:px-6 lg:px-8 pointer-events-auto">
        {teamMembers.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white/20 mb-6">
              <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white/80 mb-2">Team Coming Soon</h3>
            <p className="text-white/60">We&apos;re building our team page. Check back soon to meet our researchers!</p>
          </div>
        ) : (
          <BentoGrid>
            {teamMembers.map((member, index) => (
              <BentoGridItem
                key={member.id}
                className={getBentoItemClass(index)}
                onClick={() => handleMemberClick(member)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow flex flex-col items-center text-center">
                    <div className="mb-4">
                      {member.profileImage ? (
                        <Image
                          src={member.profileImage}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-full border-4 border-white/30"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                          <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                    <p className="text-blue-300 font-medium mb-3">{member.role}</p>
                    
                    <div className="flex-grow flex items-center">
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                        {member.biography}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <div className="inline-flex items-center space-x-2 text-blue-400 text-sm bg-white/10 px-4 py-2 rounded-full">
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </BentoGridItem>
            ))}
          </BentoGrid>
        )}
      </div>

      {/* Modal */}
      <TeamMemberModal
        member={selectedMember}
        publications={memberPublications}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      </div>
    </PageBackground>
  )
}
