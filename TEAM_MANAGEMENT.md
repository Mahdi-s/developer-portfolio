# Team Management System

## Overview
The Team Management system allows administrators to manage lab team members through a comprehensive CRUD interface. Team member data is stored in JSON files and displayed on both the admin dashboard and public team page.

## Features

### Admin Interface (`/admin/dashboard/team`)
- ✅ Add new team members with comprehensive form
- ✅ Edit existing team member information
- ✅ Delete team members with confirmation
- ✅ Image upload with validation (JPEG, PNG, WebP, max 5MB)
- ✅ Real-time form validation
- ✅ Responsive design with loading states

### Public Display (`/team`)
- ✅ Beautiful grid layout of team members
- ✅ Profile images with fallback placeholders
- ✅ Google Scholar profile links
- ✅ Responsive design

## Data Structure

### Team Member Fields
- **Name** (required): Full name of the team member
- **Role** (required): Position/title (e.g., "Principal Investigator", "PhD Student")
- **Biography** (required): Description of research interests and background
- **Profile Image** (optional): Uploaded image file
- **Google Scholar URL** (optional): Link to Google Scholar profile

### Data Storage
- **Location**: `/data/team-members.json`
- **Format**: JSON array of team member objects
- **Images**: Stored in `/public/uploads/team/`

## API Endpoints

### GET `/api/team`
Fetch all team members
```json
[
  {
    "id": "unique-id",
    "name": "John Doe",
    "role": "Principal Investigator",
    "biography": "Research interests in...",
    "profileImage": "/uploads/team/image.jpg",
    "scholarUrl": "https://scholar.google.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST `/api/team`
Create new team member
```json
{
  "name": "John Doe",
  "role": "Principal Investigator",
  "biography": "Research interests in...",
  "profileImage": "/uploads/team/image.jpg",
  "scholarUrl": "https://scholar.google.com/..."
}
```

### PUT `/api/team`
Update existing team member
```json
{
  "id": "unique-id",
  "name": "John Doe",
  "role": "Principal Investigator",
  "biography": "Updated research interests...",
  "profileImage": "/uploads/team/image.jpg",
  "scholarUrl": "https://scholar.google.com/..."
}
```

### DELETE `/api/team?id=unique-id`
Delete team member by ID

### POST `/api/upload`
Upload profile image
- **Content-Type**: `multipart/form-data`
- **Field**: `file`
- **Supported formats**: JPEG, PNG, WebP
- **Max size**: 5MB

## Security Features
- ✅ File type validation for uploads
- ✅ File size limits
- ✅ Input sanitization
- ✅ Protected admin routes (requires authentication)

## File Structure
```
src/
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │       └── team/
│   │           └── page.tsx          # Admin team management interface
│   ├── api/
│   │   ├── team/
│   │   │   └── route.ts              # Team CRUD API
│   │   └── upload/
│   │       └── route.ts              # Image upload API
│   └── team/
│       └── page.tsx                  # Public team display page
├── data/
│   └── team-members.json             # Team data storage
└── public/
    └── uploads/
        └── team/                     # Uploaded profile images
```

## Usage

### For Administrators
1. Navigate to `/admin/dashboard/team`
2. Click "Add Team Member" to create new entries
3. Use edit/delete buttons to manage existing members
4. Upload profile images using the file input

### For Public Visitors
1. Navigate to `/team` to view all team members
2. Click Google Scholar links to view researcher profiles

## Migration to Database
The current file-based storage can easily be migrated to a database:
1. Install database client (Prisma, MongoDB, etc.)
2. Create team_members table/collection
3. Update API routes to use database queries
4. Migrate existing JSON data

## Notes
- Images are stored locally in `/public/uploads/team/`
- Data is persisted in `/data/team-members.json`
- Both directories are excluded from git via `.gitignore`
- The system handles concurrent access through file locking
