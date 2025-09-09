'use client'

import { motion } from 'framer-motion'
import { HiMail, HiUsers, HiOfficeBuilding, HiAcademicCap, HiBriefcase } from 'react-icons/hi'
import { PageBackground } from '@/components/PageBackground'

export default function ContactPage() {
  return (
    <PageBackground>
      <div className="min-h-screen text-white pointer-events-none">
        <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're a student looking to join our research or a company interested in collaboration, 
            we'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Sections */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Prospective Students Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 pointer-events-auto"
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                <HiAcademicCap className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-blue-400">Prospective Students</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed">
                Are you passionate about cutting-edge research in signal processing, machine learning, 
                and data science? Join our dynamic research team and contribute to groundbreaking projects.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">How to Get Involved:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Undergraduate Students:</strong> Apply for research assistant positions or independent study opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Graduate Students:</strong> Explore thesis and dissertation research opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>PhD Candidates:</strong> Join our collaborative research environment with access to state-of-the-art resources</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <h4 className="font-semibold text-blue-300 mb-2">What We Offer:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Mentorship from experienced researchers</li>
                  <li>• Access to cutting-edge technology and datasets</li>
                  <li>• Opportunities to publish and present research</li>
                  <li>• Collaborative, interdisciplinary environment</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Corporate Sponsors Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 pointer-events-auto"
          >
            <div className="flex items-center mb-6">
              <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                <HiOfficeBuilding className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-purple-400">Corporate Sponsors</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed">
                Partner with us to drive innovation and solve real-world challenges. Our research lab 
                offers unique opportunities for industry collaboration and knowledge transfer.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Collaboration Opportunities:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Research Partnerships:</strong> Joint projects addressing industry-specific challenges</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Technology Transfer:</strong> Licensing and commercialization of research innovations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Talent Pipeline:</strong> Access to top-tier students and researchers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Sponsored Research:</strong> Funding opportunities for targeted research initiatives</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                <h4 className="font-semibold text-purple-300 mb-2">Benefits of Partnership:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Early access to cutting-edge research</li>
                  <li>• Custom solutions for industry challenges</li>
                  <li>• Networking with academic and industry leaders</li>
                  <li>• Enhanced corporate innovation capabilities</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto pointer-events-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-lg mr-4">
                <HiMail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ready to Connect?
              </h2>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              For inquiries about research collaboration, sponsorship opportunities, or student positions, 
              please reach out to us directly.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-lg">
                <HiMail className="w-5 h-5 text-blue-400" />
                <a 
                  href="mailto:signals.lab@university.edu" 
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                >
                  signals.lab@university.edu
                </a>
              </div>
              
              <p className="text-sm text-gray-400">
                We typically respond within 2-3 business days
              </p>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </PageBackground>
  )
}
