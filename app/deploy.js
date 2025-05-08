#!/usr/bin/env node

/**
 * Deployment script for handling localized Angular app
 * This script reorganizes the localized build output to:
 * - Move English (en-US) content to the root directory as the default
 * - Keep Japanese (ja) content at the /ja path
 *
 * Usage: node deploy.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_DIR = path.join(__dirname, 'dist/app');
const DEPLOY_DIR = path.join(__dirname, 'dist/deploy');
const EN_DIR = path.join(SOURCE_DIR, 'en-US');
const JA_DIR = path.join(SOURCE_DIR, 'ja');

console.log('Preparing localized app for deployment...');

// Create deployment directory if it doesn't exist
if (!fs.existsSync(DEPLOY_DIR)) {
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });
}

// Create ja directory in deployment folder
const DEPLOY_JA_DIR = path.join(DEPLOY_DIR, 'ja');
if (!fs.existsSync(DEPLOY_JA_DIR)) {
  fs.mkdirSync(DEPLOY_JA_DIR, { recursive: true });
}

// Copy English content (default) to root
console.log('Copying English (default) content to root directory...');
execSync(`cp -R ${EN_DIR}/* ${DEPLOY_DIR}/`);

// Copy Japanese content to /ja directory
console.log('Copying Japanese content to /ja directory...');
execSync(`cp -R ${JA_DIR}/* ${DEPLOY_JA_DIR}/`);

// Create a simple server.js for testing
const serverJs = `
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Handle routes for both language versions
app.get('*', (req, res) => {
  // Check if the path starts with /ja
  if (req.path.startsWith('/ja/') || req.path === '/ja') {
    res.sendFile(path.join(__dirname, 'ja/index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}/\`);
  console.log(\`Japanese version available at http://localhost:\${port}/ja/\`);
});
`;

fs.writeFileSync(path.join(DEPLOY_DIR, 'server.js'), serverJs);

// Create a package.json for the deployment
const packageJson = {
  name: "tokyo-house-price-app",
  version: "1.0.0",
  description: "Tokyo House Price Calculator",
  main: "server.js",
  scripts: {
    "start": "node server.js"
  },
  dependencies: {
    "express": "^4.18.2"
  }
};

fs.writeFileSync(
  path.join(DEPLOY_DIR, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

console.log(`
============================================================
Deployment preparation complete!

The localized app has been organized with:
- English (default) at the root level
- Japanese at /ja path

To test the deployment locally:
1. cd dist/deploy
2. npm install
3. npm start
4. Visit http://localhost:3000/ for English
5. Visit http://localhost:3000/ja/ for Japanese
============================================================
`);