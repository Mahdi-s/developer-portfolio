'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { PageBackground } from '@/components/PageBackground';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaGithub, 
  FaExternalLinkAlt, 
  FaFileAlt, 
  FaDatabase, 
  FaBook, 
  FaEllipsisH,
  FaSpinner 
} from 'react-icons/fa';

interface ProjectLink {
  url: string;
  type: 'Code' | 'Demo' | 'Paper' | 'Dataset' | 'Documentation' | 'Other';
}

interface ResearchProject {
  id: string;
  name: string;
  description: string;
  images: string[];
  links: ProjectLink[];
  createdAt: string;
  updatedAt: string;
}

// Function to get icon and styling for each link type
const getLinkStyle = (type: string) => {
  switch (type) {
    case 'Code':
      return {
        icon: <FaGithub className="inline mr-2" />,
        className: 'bg-gray-800 hover:bg-gray-700 text-white',
      };
    case 'Demo':
      return {
        icon: <FaExternalLinkAlt className="inline mr-2" />,
        className: 'bg-blue-600 hover:bg-blue-700 text-white',
      };
    case 'Paper':
      return {
        icon: <FaFileAlt className="inline mr-2" />,
        className: 'bg-red-600 hover:bg-red-700 text-white',
      };
    case 'Dataset':
      return {
        icon: <FaDatabase className="inline mr-2" />,
        className: 'bg-green-600 hover:bg-green-700 text-white',
      };
    case 'Documentation':
      return {
        icon: <FaBook className="inline mr-2" />,
        className: 'bg-purple-600 hover:bg-purple-700 text-white',
      };
    default:
      return {
        icon: <FaEllipsisH className="inline mr-2" />,
        className: 'bg-gray-600 hover:bg-gray-700 text-white',
      };
  }
};

export default function ResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch research projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <PageBackground>
        <div className="h-screen w-full flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-white mb-4 mx-auto" />
            <p className="text-white text-lg">Loading research projects...</p>
          </div>
        </div>
      </PageBackground>
    );
  }

  if (error) {
    return (
      <PageBackground>
        <div className="h-screen w-full flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors pointer-events-auto"
            >
              Retry
            </button>
          </div>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <div className="w-full min-h-screen py-12 px-4 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Research & Projects
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore our latest research projects, publications, and innovative solutions
            </p>
          </motion.div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-400 text-lg">No research projects available yet.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full pointer-events-auto"
                >
                  <CardContainer className="inter-var h-full w-full">
                    <CardBody className="bg-[#c7cbd4] relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-[40px] p-6 border hover:shadow-2xl hover:shadow-neutral-400/50 dark:hover:shadow-neutral-900/50 transition-shadow duration-300">
                      <div className="flex flex-col h-full">
                        {/* Project Title */}
                        <CardItem
                          translateZ="50"
                          className="text-xl font-bold text-neutral-600 dark:text-white mb-4"
                        >
                          {project.name}
                        </CardItem>

                        {/* Project Description */}
                        <CardItem
                          as="p"
                          translateZ="40"
                          className="text-sm font-mono text-neutral-500 dark:text-neutral-300 mb-6 flex-grow"
                        >
                          {project.description}
                        </CardItem>

                        {/* Project Images */}
                        {project.images && project.images.length > 0 && (
                          <CardItem
                            translateZ="60"
                            className="w-full h-48 relative mb-6"
                          >
                            <Image
                              src={project.images[0]}
                              fill
                              className="object-cover rounded-[20px] group-hover/card:shadow-xl"
                              alt={`${project.name} preview`}
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                e.currentTarget.src = '/images/logo_solo.png';
                              }}
                            />
                          </CardItem>
                        )}

                        {/* Project Links */}
                        {project.links && project.links.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {project.links.map((link, linkIndex) => {
                              const linkStyle = getLinkStyle(link.type);
                              return (
                                <CardItem
                                  key={linkIndex}
                                  translateZ={40}
                                  as={Link}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${linkStyle.className}`}
                                >
                                  {linkStyle.icon}
                                  {link.type}
                                </CardItem>
                              );
                            })}
                          </div>
                        )}

                        {/* Creation Date */}
                        <CardItem
                          translateZ="30"
                          className="text-xs text-neutral-400 dark:text-neutral-500 mt-4"
                        >
                          Created: {new Date(project.createdAt).toLocaleDateString()}
                        </CardItem>
                      </div>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageBackground>
  );
}