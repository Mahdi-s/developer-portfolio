import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Support different upload types
function getUploadDir(type: string = 'team') {
  return path.join(process.cwd(), 'public', 'uploads', type)
}

// Ensure upload directory exists
async function ensureUploadDir(uploadDir: string) {
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'team'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate upload type
    const validTypes = ['team', 'projects']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid upload type. Must be "team" or "projects".' },
        { status: 400 }
      )
    }

    // Validate file type
    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    const uploadDir = getUploadDir(type)
    await ensureUploadDir(uploadDir)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/${type}/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
