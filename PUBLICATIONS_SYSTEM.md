# Publications Management System

## Overview
The Publications Management System automatically ingests publications from Google Scholar profiles and stores them in a structured JSON format. The system is designed to be run server-side as a cron job or triggered from the admin panel.

## Features

### Core Functionality
- ✅ Scrapes publications from Google Scholar profiles
- ✅ Extracts title, authors, year, journal, and citation count
- ✅ Links publications to team members
- ✅ Handles scraping errors gracefully
- ✅ Rate limiting and retry mechanisms
- ✅ Comprehensive logging

### Admin Interface
- ✅ View all publications with filtering and sorting
- ✅ Trigger ingestion for all members or specific members
- ✅ Delete individual publications
- ✅ Real-time statistics dashboard
- ✅ Job status tracking

## Data Structure

### Publication Object
```json
{
  "id": "unique-publication-id",
  "title": "Publication Title",
  "authors": ["Author One", "Author Two"],
  "year": 2024,
  "journal": "Journal Name",
  "citationCount": 15,
  "url": "https://scholar.google.com/citations?view_op=view_citation&...",
  "teamMemberId": "team-member-id",
  "sourceScholarUrl": "https://scholar.google.com/citations?user=...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Data Storage
- **Publications**: `/data/publications.json`
- **Logs**: `/data/ingestion-logs.json`
- **Team Members**: `/data/team-members.json` (existing)

## Usage

### 1. Command Line (Server/Cron)

#### Ingest all publications
```bash
npm run ingest-publications
```

#### Ingest for specific team member
```bash
npm run ingest-publications:member=MEMBER_ID
```

#### Direct TypeScript execution
```bash
npx ts-node src/scripts/ingestPublications.ts
npx ts-node src/scripts/ingestPublications.ts --member=MEMBER_ID
```

### 2. Admin Interface

Navigate to `/admin/dashboard/publications` to:
- View all publications with search and filtering
- Trigger ingestion jobs
- Monitor ingestion status
- Delete publications
- View statistics

### 3. API Endpoints

#### GET `/api/publications`
Fetch publications with optional filtering:
```bash
# Get all publications
GET /api/publications

# Get publications for specific team member
GET /api/publications?teamMemberId=MEMBER_ID
```

#### POST `/api/publications`
Trigger publication ingestion:
```json
{
  "action": "ingest",
  "teamMemberId": "optional-member-id"
}
```

#### PUT `/api/publications`
Update a publication:
```json
{
  "id": "publication-id",
  "title": "Updated Title",
  "authors": ["Updated Authors"],
  ...
}
```

#### DELETE `/api/publications?id=PUBLICATION_ID`
Delete a publication.

## Configuration

### Rate Limiting
- **Delay between requests**: 2 seconds
- **Max retries**: 3 attempts
- **Request timeout**: 30 seconds
- **Exponential backoff**: Increasing delays on retries

### Browser Settings
The scraper uses Puppeteer with optimized settings:
- Headless mode for server environments
- Disabled GPU acceleration for better compatibility
- No sandbox mode for Docker/server environments

## Error Handling

### Common Issues and Solutions

#### 1. Google Scholar Blocking
**Symptoms**: "Blocked by Google Scholar" errors
**Solutions**:
- Increase delay between requests
- Use different IP addresses
- Implement user-agent rotation
- Add CAPTCHA solving (advanced)

#### 2. Missing Publications
**Symptoms**: Publications not found or incomplete data
**Solutions**:
- Check Google Scholar URL format
- Verify profile is public
- Update scraping selectors if Google changes their HTML

#### 3. Memory Issues
**Symptoms**: Browser crashes or timeouts
**Solutions**:
- Process members in smaller batches
- Increase server memory
- Optimize browser settings

### Error Logging
All errors are logged to `/data/ingestion-logs.json` with:
- Timestamp
- Team member ID
- Error messages
- Success/failure status
- Publication counts

## Cron Job Setup

### Linux/macOS Crontab
```bash
# Edit crontab
crontab -e

# Add entry to run daily at 2 AM
0 2 * * * cd /path/to/signals_lab_portal && npm run ingest-publications >> /var/log/publication-ingestion.log 2>&1

# Run weekly on Sundays at 3 AM
0 3 * * 0 cd /path/to/signals_lab_portal && npm run ingest-publications >> /var/log/publication-ingestion.log 2>&1
```

### Docker/Server Environment
```dockerfile
# In Dockerfile, install cron
RUN apt-get update && apt-get install -y cron

# Add cron job
RUN echo "0 2 * * * cd /app && npm run ingest-publications" | crontab -
```

## Performance Optimization

### Best Practices
1. **Batch Processing**: Process members in small batches to avoid overwhelming Google Scholar
2. **Caching**: Store results and only update when necessary
3. **Incremental Updates**: Only fetch new publications since last run
4. **Resource Management**: Properly close browser instances

### Monitoring
- Check `/data/ingestion-logs.json` for job status
- Monitor server resources during scraping
- Set up alerts for failed ingestions

## Security Considerations

### Data Protection
- Publications data is stored locally in JSON files
- No sensitive information is scraped
- Rate limiting prevents abuse

### Server Security
- Run with minimal privileges
- Secure file permissions on data directory
- Regular security updates for dependencies

## Troubleshooting

### Debug Mode
Set environment variable for verbose logging:
```bash
DEBUG=true npm run ingest-publications
```

### Manual Testing
Test individual components:
```bash
# Test single member
npx ts-node src/scripts/ingestPublications.ts --member=MEMBER_ID

# Check data files
cat data/publications.json | jq '.'
cat data/ingestion-logs.json | jq '.'
```

### Common Commands
```bash
# Check publication count
cat data/publications.json | jq 'length'

# Find publications by year
cat data/publications.json | jq '.[] | select(.year == 2024)'

# Count publications per member
cat data/publications.json | jq 'group_by(.teamMemberId) | map({member: .[0].teamMemberId, count: length})'
```

## Migration and Backup

### Backup Data
```bash
# Backup publications
cp data/publications.json backups/publications-$(date +%Y%m%d).json

# Backup logs
cp data/ingestion-logs.json backups/logs-$(date +%Y%m%d).json
```

### Database Migration
To migrate to a database system:
1. Install database client (Prisma, MongoDB, etc.)
2. Create publications table/collection
3. Update API routes to use database queries
4. Migrate existing JSON data
5. Update ingestion script to use database

## Support

### File Structure
```
src/
├── scripts/
│   ├── ingestPublications.ts     # Main ingestion script
│   └── runIngestion.js           # Node.js runner
├── app/
│   ├── api/
│   │   └── publications/
│   │       └── route.ts          # Publications API
│   └── admin/
│       └── dashboard/
│           └── publications/
│               └── page.tsx      # Admin interface
└── data/
    ├── publications.json         # Publications storage
    ├── ingestion-logs.json       # Logging
    └── team-members.json         # Team data (existing)
```

### Dependencies
- **puppeteer**: Web scraping and browser automation
- **cheerio**: HTML parsing and jQuery-like manipulation
- **ts-node**: TypeScript execution without compilation
- **@types/cheerio**: TypeScript definitions

### Environment Requirements
- Node.js 16+ 
- Chrome/Chromium browser (installed by Puppeteer)
- Sufficient memory for browser instances (recommend 2GB+)
- Network access to Google Scholar
