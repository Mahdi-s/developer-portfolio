import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import PublicationIngester, { Publication } from '@/scripts/ingestPublications';

const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLICATIONS_FILE = path.join(DATA_DIR, 'publications.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read publications from file
async function readPublications(): Promise<Publication[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PUBLICATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write publications to file
async function writePublications(publications: Publication[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PUBLICATIONS_FILE, JSON.stringify(publications, null, 2));
}

// GET /api/publications - Fetch all publications or filter by team member
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamMemberId = searchParams.get('teamMemberId');
    
    const publications = await readPublications();
    
    // Filter by team member if specified
    const filteredPublications = teamMemberId 
      ? publications.filter(pub => pub.teamMemberId === teamMemberId)
      : publications;
    
    // Sort by year (descending) and then by title
    filteredPublications.sort((a, b) => {
      if (a.year !== b.year) {
        return (b.year || 0) - (a.year || 0);
      }
      return a.title.localeCompare(b.title);
    });
    
    return NextResponse.json(filteredPublications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}

// POST /api/publications - Trigger publication ingestion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, teamMemberId } = body;
    
    if (action !== 'ingest') {
      return NextResponse.json(
        { error: 'Invalid action. Use "ingest" to trigger publication scraping.' },
        { status: 400 }
      );
    }
    
    // Create ingester instance
    const ingester = new PublicationIngester();
    
    // Run ingestion in the background (don't await)
    const ingestionPromise = ingester.run(teamMemberId);
    
    // Return immediately with job started status
    return NextResponse.json({
      success: true,
      message: teamMemberId 
        ? `Publication ingestion started for team member: ${teamMemberId}`
        : 'Publication ingestion started for all team members',
      jobId: `ingestion-${Date.now()}`,
      status: 'started'
    });
    
  } catch (error) {
    console.error('Error triggering publication ingestion:', error);
    return NextResponse.json(
      { error: 'Failed to trigger publication ingestion' },
      { status: 500 }
    );
  }
}

// PUT /api/publications - Update a specific publication
export async function PUT(request: NextRequest) {
  try {
    const updatedPublication: Publication = await request.json();
    
    if (!updatedPublication.id) {
      return NextResponse.json(
        { error: 'Publication ID is required' },
        { status: 400 }
      );
    }
    
    const publications = await readPublications();
    const index = publications.findIndex(pub => pub.id === updatedPublication.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }
    
    // Update the publication
    publications[index] = {
      ...updatedPublication,
      updatedAt: new Date().toISOString()
    };
    
    await writePublications(publications);
    
    return NextResponse.json({
      success: true,
      publication: publications[index]
    });
    
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json(
      { error: 'Failed to update publication' },
      { status: 500 }
    );
  }
}

// DELETE /api/publications - Delete a publication
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicationId = searchParams.get('id');
    
    if (!publicationId) {
      return NextResponse.json(
        { error: 'Publication ID is required' },
        { status: 400 }
      );
    }
    
    const publications = await readPublications();
    const filteredPublications = publications.filter(pub => pub.id !== publicationId);
    
    if (filteredPublications.length === publications.length) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }
    
    await writePublications(filteredPublications);
    
    return NextResponse.json({
      success: true,
      message: 'Publication deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
}
