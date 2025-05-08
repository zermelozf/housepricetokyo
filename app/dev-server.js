#!/usr/bin/env node

/**
 * Development server script that runs both English and Japanese versions
 * of the app simultaneously on different ports.
 * 
 * Usage: node dev-server.js
 */

const { spawn } = require('child_process');
const process = require('process');

// Define ports
const EN_PORT = 4200;
const JA_PORT = 4201;

console.log('Starting development servers for English and Japanese versions...');

// Start English version (default, no locale prefix)
const enProcess = spawn('npm', ['run', 'start:en', '--', `--port=${EN_PORT}`, '--serve-path=/'], {
  stdio: 'inherit',
  shell: true
});

// Start Japanese version (with /ja prefix)
const jaProcess = spawn('npm', ['run', 'start:ja', '--', `--port=${JA_PORT}`, '--serve-path=/'], {
  stdio: 'inherit',
  shell: true
});

console.log(`
============================================================
Development servers started:
- English version (default): http://localhost:${EN_PORT}/
- Japanese version: http://localhost:${JA_PORT}/
============================================================
Press Ctrl+C to stop both servers.
`);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down development servers...');
  enProcess.kill();
  jaProcess.kill();
  process.exit(0);
});

// Handle child process errors
enProcess.on('error', (error) => {
  console.error('English server error:', error);
});

jaProcess.on('error', (error) => {
  console.error('Japanese server error:', error);
});

// Handle child process exit
enProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`English server process exited with code ${code}`);
  }
});

jaProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Japanese server process exited with code ${code}`);
  }
}); 