#!/usr/bin/env node
/**
 * Google Scholar Publications Ingestion Script
 * 
 * This script scrapes publications from Google Scholar profiles and stores them
 * in a structured JSON format linked to team members.
 * 
 * Usage:
 * - Server-side execution (cron job or admin trigger)
 * - Handles scraping errors gracefully
 * - Stores data in publications collection linked to team members
 */

import { promises as fs } from 'fs';
import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';

// Types
export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  journal: string | null;
  citationCount: number | null;
  url: string | null;
  teamMemberId: string;
  sourceScholarUrl: string;
  isVisible?: boolean; // For admin visibility control
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  biography: string;
  profileImage?: string;
  scholarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapingResult {
  success: boolean;
  publications: Publication[];
  errors: string[];
  teamMemberId: string;
  scholarUrl: string;
}

// Configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const TEAM_MEMBERS_FILE = path.join(DATA_DIR, 'team-members.json');
const PUBLICATIONS_FILE = path.join(DATA_DIR, 'publications.json');
const LOG_FILE = path.join(DATA_DIR, 'ingestion-logs.json');

// Rate limiting configuration
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 30000; // 30 seconds

class PublicationIngester {
  private browser: Browser | null = null;

  /**
   * Initialize the scraper
   */
  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      console.log('✅ Browser initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error);
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('✅ Browser closed successfully');
    }
  }

  /**
   * Ensure data directory exists
   */
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
      console.log('📁 Created data directory');
    }
  }

  /**
   * Read team members from JSON file
   */
  private async readTeamMembers(): Promise<TeamMember[]> {
    await this.ensureDataDir();
    try {
      const data = await fs.readFile(TEAM_MEMBERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error reading team members:', error);
      return [];
    }
  }

  /**
   * Read existing publications from JSON file
   */
  private async readPublications(): Promise<Publication[]> {
    await this.ensureDataDir();
    try {
      const data = await fs.readFile(PUBLICATIONS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('📄 Publications file does not exist, creating new one');
        return [];
      }
      console.error('❌ Error reading publications:', error);
      return [];
    }
  }

  /**
   * Write publications to JSON file
   */
  private async writePublications(publications: Publication[]): Promise<void> {
    await this.ensureDataDir();
    try {
      await fs.writeFile(PUBLICATIONS_FILE, JSON.stringify(publications, null, 2));
      console.log(`💾 Saved ${publications.length} publications to file`);
    } catch (error) {
      console.error('❌ Error writing publications:', error);
      throw error;
    }
  }

  /**
   * Log scraping results
   */
  private async logResults(results: ScrapingResult[]): Promise<void> {
    await this.ensureDataDir();
    const logEntry = {
      timestamp: new Date().toISOString(),
      results: results.map(r => ({
        teamMemberId: r.teamMemberId,
        scholarUrl: r.scholarUrl,
        success: r.success,
        publicationCount: r.publications.length,
        errors: r.errors
      }))
    };

    try {
      let logs = [];
      try {
        const existingLogs = await fs.readFile(LOG_FILE, 'utf8');
        logs = JSON.parse(existingLogs);
      } catch {
        // File doesn't exist, start with empty array
      }

      logs.push(logEntry);
      // Keep only last 100 log entries
      logs = logs.slice(-100);

      await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
      console.log('📝 Logged scraping results');
    } catch (error) {
      console.error('❌ Error logging results:', error);
    }
  }

  /**
   * Extract Google Scholar user ID from URL
   */
  private extractScholarUserId(url: string): string | null {
    const match = url.match(/[?&]user=([^&]+)/);
    return match ? match[1] : null;
  }

  /**
   * Scrape publications from a Google Scholar profile
   */
  private async scrapeScholarProfile(scholarUrl: string, teamMemberId: string): Promise<ScrapingResult> {
    const result: ScrapingResult = {
      success: false,
      publications: [],
      errors: [],
      teamMemberId,
      scholarUrl
    };

    if (!this.browser) {
      result.errors.push('Browser not initialized');
      return result;
    }

    let page: Page | null = null;

    try {
      console.log(`🔍 Scraping publications for team member ${teamMemberId}: ${scholarUrl}`);
      
      page = await this.browser.newPage();
      
      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Set timeout
      page.setDefaultTimeout(REQUEST_TIMEOUT);
      
      // Navigate to the scholar profile
      await page.goto(scholarUrl, { waitUntil: 'networkidle2' });
      
      // Wait a bit for dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get page content
      const content = await page.content();
      const $ = cheerio.load(content);
      
      // Check if we're blocked or redirected
      if ($('title').text().includes('Sorry') || $('title').text().includes('blocked')) {
        result.errors.push('Blocked by Google Scholar');
        return result;
      }

      // Extract publications
      const publications: Publication[] = [];
      
      // Google Scholar publication rows
      $('.gsc_a_tr').each((index, element) => {
        try {
          const $row = $(element);
          const $titleLink = $row.find('.gsc_a_at');
          const title = $titleLink.text().trim();
          
          if (!title) return; // Skip empty titles
          
          // Extract authors and journal from the second column
          const grayElements = $row.find('.gsc_a_t .gs_gray');
          let authorsText = '';
          let journalText = '';
          
          if (grayElements.length >= 2) {
            // First gray element is authors, second is journal/venue
            authorsText = $(grayElements[0]).text().trim();
            journalText = $(grayElements[1]).text().trim();
          } else if (grayElements.length === 1) {
            // Sometimes there's only one element with both info
            const fullText = $(grayElements[0]).text().trim();
            const parts = fullText.split(' - ');
            if (parts.length >= 2) {
              authorsText = parts[0];
              journalText = parts[1];
            } else {
              authorsText = fullText;
            }
          }
          
          // Parse authors - clean up and filter out non-author text
          let authors: string[] = [];
          if (authorsText) {
            authors = authorsText
              .split(',')
              .map(a => a.trim())
              .filter(a => a.length > 0 && !a.match(/^\d{4}$/) && !a.includes('http')); // Filter out years and URLs
          }
          
          // Extract year
          const yearText = $row.find('.gsc_a_y .gsc_a_h').text().trim();
          const year = yearText ? parseInt(yearText, 10) : null;
          
          // Extract citation count
          const citationText = $row.find('.gsc_a_c .gsc_a_ac').text().trim();
          const citationCount = citationText ? parseInt(citationText, 10) : null;
          
          // Create publication URL (if available)
          const relativeUrl = $titleLink.attr('href');
          const publicationUrl = relativeUrl ? `https://scholar.google.com${relativeUrl}` : null;
          
          // Clean up journal text
          let cleanJournal = journalText?.trim() || null;
          if (cleanJournal) {
            // Remove year from journal text if it appears at the end
            cleanJournal = cleanJournal.replace(/,?\s*\d{4}$/, '').trim();
            // Remove common prefixes/suffixes that aren't part of journal name
            cleanJournal = cleanJournal.replace(/^(.*?)\s*,\s*\d+.*$/, '$1').trim();
            if (cleanJournal.length === 0) cleanJournal = null;
          }

          const publication: Publication = {
            id: `${teamMemberId}-${Date.now()}-${index}`,
            title,
            authors,
            year,
            journal: cleanJournal,
            citationCount,
            url: publicationUrl,
            teamMemberId,
            sourceScholarUrl: scholarUrl,
            isVisible: true, // Default to visible
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          publications.push(publication);
          
        } catch (error) {
          console.error(`❌ Error parsing publication ${index}:`, error);
          result.errors.push(`Failed to parse publication ${index}: ${error}`);
        }
      });
      
      result.publications = publications;
      result.success = publications.length > 0;
      
      console.log(`✅ Successfully scraped ${publications.length} publications`);
      
    } catch (error) {
      console.error(`❌ Error scraping ${scholarUrl}:`, error);
      result.errors.push(`Scraping failed: ${error}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
    
    return result;
  }

  /**
   * Process a single team member with retries
   */
  private async processTeamMemberWithRetries(member: TeamMember): Promise<ScrapingResult> {
    let lastResult: ScrapingResult = {
      success: false,
      publications: [],
      errors: ['No attempts made'],
      teamMemberId: member.id,
      scholarUrl: member.scholarUrl || ''
    };

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`🔄 Attempt ${attempt}/${MAX_RETRIES} for ${member.name}`);
      
      lastResult = await this.scrapeScholarProfile(member.scholarUrl!, member.id);
      
      if (lastResult.success) {
        console.log(`✅ Success on attempt ${attempt} for ${member.name}`);
        break;
      }
      
      if (attempt < MAX_RETRIES) {
        const delayMs = DELAY_BETWEEN_REQUESTS * attempt; // Exponential backoff
        console.log(`⏳ Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    return lastResult;
  }

  /**
   * Ingest publications for all team members with Google Scholar URLs
   */
  async ingestAllPublications(): Promise<ScrapingResult[]> {
    console.log('🚀 Starting publication ingestion process...');
    
    const teamMembers = await this.readTeamMembers();
    const membersWithScholar = teamMembers.filter(member => 
      member.scholarUrl && member.scholarUrl.trim() !== ''
    );
    
    console.log(`👥 Found ${membersWithScholar.length} team members with Google Scholar URLs`);
    
    if (membersWithScholar.length === 0) {
      console.log('ℹ️  No team members with Google Scholar URLs found');
      return [];
    }
    
    const results: ScrapingResult[] = [];
    
    for (const member of membersWithScholar) {
      console.log(`\n👤 Processing ${member.name}...`);
      
      const result = await this.processTeamMemberWithRetries(member);
      results.push(result);
      
      // Rate limiting between members
      if (membersWithScholar.indexOf(member) < membersWithScholar.length - 1) {
        console.log(`⏳ Waiting ${DELAY_BETWEEN_REQUESTS}ms before next member...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
      }
    }
    
    return results;
  }

  /**
   * Ingest publications for a specific team member
   */
  async ingestPublicationsForMember(memberId: string): Promise<ScrapingResult | null> {
    console.log(`🚀 Starting publication ingestion for member: ${memberId}`);
    
    const teamMembers = await this.readTeamMembers();
    const member = teamMembers.find(m => m.id === memberId);
    
    if (!member) {
      console.error(`❌ Team member with ID ${memberId} not found`);
      return null;
    }
    
    if (!member.scholarUrl || member.scholarUrl.trim() === '') {
      console.error(`❌ No Google Scholar URL found for ${member.name}`);
      return null;
    }
    
    const result = await this.processTeamMemberWithRetries(member);
    return result;
  }

  /**
   * Update the publications database with new data
   */
  async updatePublicationsDatabase(results: ScrapingResult[]): Promise<void> {
    console.log('💾 Updating publications database...');
    
    const existingPublications = await this.readPublications();
    
    // Create a map of existing publications by team member for efficient lookup
    const existingByMember = new Map<string, Publication[]>();
    existingPublications.forEach(pub => {
      if (!existingByMember.has(pub.teamMemberId)) {
        existingByMember.set(pub.teamMemberId, []);
      }
      existingByMember.get(pub.teamMemberId)!.push(pub);
    });
    
    let newPublications = 0;
    let updatedPublications = 0;
    
    // Process each result
    for (const result of results) {
      if (!result.success) continue;
      
      const existingForMember = existingByMember.get(result.teamMemberId) || [];
      
      // Remove old publications for this member
      const otherMemberPublications = existingPublications.filter(
        pub => pub.teamMemberId !== result.teamMemberId
      );
      
      // Add new publications
      const allPublications = [...otherMemberPublications, ...result.publications];
      
      // Update counts
      newPublications += result.publications.length;
      if (existingForMember.length > 0) {
        updatedPublications++;
      }
      
      // Update the map for next iteration
      existingByMember.set(result.teamMemberId, result.publications);
    }
    
    // Combine all publications
    const finalPublications: Publication[] = [];
    for (const publications of Array.from(existingByMember.values())) {
      finalPublications.push(...publications);
    }
    
    // Add publications from members not in current results
    for (const pub of existingPublications) {
      if (!results.some(r => r.teamMemberId === pub.teamMemberId)) {
        finalPublications.push(pub);
      }
    }
    
    await this.writePublications(finalPublications);
    
    console.log(`✅ Database updated: ${newPublications} new publications, ${updatedPublications} members updated`);
  }

  /**
   * Main execution method
   */
  async run(memberId?: string): Promise<void> {
    try {
      await this.initialize();
      
      let results: ScrapingResult[];
      
      if (memberId) {
        const result = await this.ingestPublicationsForMember(memberId);
        results = result ? [result] : [];
      } else {
        results = await this.ingestAllPublications();
      }
      
      if (results.length > 0) {
        await this.updatePublicationsDatabase(results);
        await this.logResults(results);
        
        // Print summary
        const successCount = results.filter(r => r.success).length;
        const totalPublications = results.reduce((sum, r) => sum + r.publications.length, 0);
        const errorCount = results.reduce((sum, r) => sum + r.errors.length, 0);
        
        console.log('\n📊 SUMMARY:');
        console.log(`✅ Successful scrapes: ${successCount}/${results.length}`);
        console.log(`📚 Total publications ingested: ${totalPublications}`);
        console.log(`⚠️  Total errors: ${errorCount}`);
        
        if (errorCount > 0) {
          console.log('\n❌ ERRORS:');
          results.forEach(r => {
            if (r.errors.length > 0) {
              console.log(`  ${r.teamMemberId}: ${r.errors.join(', ')}`);
            }
          });
        }
      } else {
        console.log('ℹ️  No publications to process');
      }
      
    } catch (error) {
      console.error('💥 Fatal error during ingestion:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// CLI support
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const memberId = args.find(arg => arg.startsWith('--member='))?.split('=')[1];
  
  const ingester = new PublicationIngester();
  
  ingester.run(memberId).catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export default PublicationIngester;
