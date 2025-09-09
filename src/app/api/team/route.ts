import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export interface TeamMember {
  id: string
  name: string
  role: string
  biography: string
  profileImage: string
  scholarUrl?: string
  createdAt: string
  updatedAt: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const TEAM_FILE = path.join(DATA_DIR, 'team-members.json')

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// Read team members from file
async function readTeamMembers(): Promise<TeamMember[]> {
  await ensureDataDir()
  
  if (!existsSync(TEAM_FILE)) {
    return []
  }
  
  try {
    const data = await readFile(TEAM_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading team members:', error)
    return []
  }
}

// Write team members to file
async function writeTeamMembers(members: TeamMember[]): Promise<void> {
  await ensureDataDir()
  await writeFile(TEAM_FILE, JSON.stringify(members, null, 2), 'utf-8')
}

// GET - Fetch all team members
export async function GET() {
  try {
    const members = await readTeamMembers()
    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, biography, profileImage, scholarUrl } = body

    if (!name || !role || !biography) {
      return NextResponse.json(
        { error: 'Name, role, and biography are required' },
        { status: 400 }
      )
    }

    const members = await readTeamMembers()
    const newMember: TeamMember = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      role,
      biography,
      profileImage: profileImage || '',
      scholarUrl: scholarUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    members.push(newMember)
    await writeTeamMembers(members)

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}

// PUT - Update a team member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, role, biography, profileImage, scholarUrl } = body

    if (!id || !name || !role || !biography) {
      return NextResponse.json(
        { error: 'ID, name, role, and biography are required' },
        { status: 400 }
      )
    }

    const members = await readTeamMembers()
    const memberIndex = members.findIndex(m => m.id === id)

    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    members[memberIndex] = {
      ...members[memberIndex],
      name,
      role,
      biography,
      profileImage: profileImage || '',
      scholarUrl: scholarUrl || '',
      updatedAt: new Date().toISOString()
    }

    await writeTeamMembers(members)
    return NextResponse.json(members[memberIndex])
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a team member
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

    const members = await readTeamMembers()
    const memberIndex = members.findIndex(m => m.id === id)

    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    members.splice(memberIndex, 1)
    await writeTeamMembers(members)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
