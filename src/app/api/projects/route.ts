import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export interface ProjectLink {
  url: string
  type: 'Code' | 'Demo' | 'Paper' | 'Dataset' | 'Documentation' | 'Other'
}

export interface ResearchProject {
  id: string
  name: string
  description: string
  images: string[]
  links: ProjectLink[]
  createdAt: string
  updatedAt: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const PROJECTS_FILE = path.join(DATA_DIR, 'research-projects.json')

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// Read research projects from file
async function readProjects(): Promise<ResearchProject[]> {
  await ensureDataDir()
  
  if (!existsSync(PROJECTS_FILE)) {
    return []
  }
  
  try {
    const data = await readFile(PROJECTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading research projects:', error)
    return []
  }
}

// Write research projects to file
async function writeProjects(projects: ResearchProject[]): Promise<void> {
  await ensureDataDir()
  await writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8')
}

// GET - Fetch all research projects
export async function GET() {
  try {
    const projects = await readProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching research projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch research projects' },
      { status: 500 }
    )
  }
}

// POST - Create a new research project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, images, links } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Validate links
    const validLinkTypes = ['Code', 'Demo', 'Paper', 'Dataset', 'Documentation', 'Other']
    if (links && Array.isArray(links)) {
      for (const link of links) {
        if (!link.url || !link.type || !validLinkTypes.includes(link.type)) {
          return NextResponse.json(
            { error: 'Invalid link format. Each link must have a valid URL and type.' },
            { status: 400 }
          )
        }
      }
    }

    const projects = await readProjects()
    const newProject: ResearchProject = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      description,
      images: images || [],
      links: links || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    projects.push(newProject)
    await writeProjects(projects)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error creating research project:', error)
    return NextResponse.json(
      { error: 'Failed to create research project' },
      { status: 500 }
    )
  }
}

// PUT - Update a research project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, images, links } = body

    if (!id || !name || !description) {
      return NextResponse.json(
        { error: 'ID, name, and description are required' },
        { status: 400 }
      )
    }

    // Validate links
    const validLinkTypes = ['Code', 'Demo', 'Paper', 'Dataset', 'Documentation', 'Other']
    if (links && Array.isArray(links)) {
      for (const link of links) {
        if (!link.url || !link.type || !validLinkTypes.includes(link.type)) {
          return NextResponse.json(
            { error: 'Invalid link format. Each link must have a valid URL and type.' },
            { status: 400 }
          )
        }
      }
    }

    const projects = await readProjects()
    const projectIndex = projects.findIndex(p => p.id === id)

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Research project not found' },
        { status: 404 }
      )
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      name,
      description,
      images: images || [],
      links: links || [],
      updatedAt: new Date().toISOString()
    }

    await writeProjects(projects)
    return NextResponse.json(projects[projectIndex])
  } catch (error) {
    console.error('Error updating research project:', error)
    return NextResponse.json(
      { error: 'Failed to update research project' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a research project
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const projects = await readProjects()
    const projectIndex = projects.findIndex(p => p.id === id)

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Research project not found' },
        { status: 404 }
      )
    }

    projects.splice(projectIndex, 1)
    await writeProjects(projects)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting research project:', error)
    return NextResponse.json(
      { error: 'Failed to delete research project' },
      { status: 500 }
    )
  }
}
