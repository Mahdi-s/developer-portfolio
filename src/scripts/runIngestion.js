#!/usr/bin/env node
/**
 * Simple Node.js runner for the TypeScript ingestion script
 * This allows running the script without TypeScript compilation
 */

const { spawn } = require('child_process');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);

// Path to the TypeScript script
const scriptPath = path.join(__dirname, 'ingestPublications.ts');

// Run the script with ts-node
const child = spawn('npx', ['ts-node', scriptPath, ...args], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '../..')
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (error) => {
  console.error('Failed to start ingestion script:', error);
  process.exit(1);
});
