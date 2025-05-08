const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DIST_DIR = path.join(__dirname, 'dist/app');
const EN_DIR = path.join(DIST_DIR, 'en-US');
const JA_DIR = path.join(DIST_DIR, 'ja');

console.log('🚀 Starting localized build process...');

// Step 1: Build the application with localization
console.log('📦 Building application with localization...');
try {
  execSync('ng build --localize', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Step 2: Update the base href in the English index.html
console.log('🔄 Updating base href in English index.html...');
try {
  let enIndexContent = fs.readFileSync(path.join(EN_DIR, 'index.html'), 'utf8');
  enIndexContent = enIndexContent.replace('<base href="/en-US/">', '<base href="/">');
  fs.writeFileSync(path.join(EN_DIR, 'index.html'), enIndexContent);
  console.log('✅ Base href updated!');
} catch (error) {
  console.error('❌ Failed to update base href:', error);
  process.exit(1);
}

// Step 3: Copy English files to root
console.log('📂 Copying English files to root...');
try {
  const files = fs.readdirSync(EN_DIR);
  for (const file of files) {
    const srcPath = path.join(EN_DIR, file);
    const destPath = path.join(DIST_DIR, file);
    
    // Skip directories for simple copy
    if (fs.statSync(srcPath).isDirectory()) {
      console.log(`⏩ Skipping directory: ${file}`);
      continue;
    }
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`📄 Copied: ${file}`);
  }
  console.log('✅ English files copied to root!');
} catch (error) {
  console.error('❌ Failed to copy files:', error);
  process.exit(1);
}

// Step 4: Create language router
console.log('🔄 Creating language router...');
try {
  const languageRouterContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tokyo House Price Calculator | 東京住宅価格計算機</title>
  <script>
    // Language detection and redirect with infinite loop prevention
    (function() {
      var userLang = navigator.language || navigator.userLanguage;
      var currentPath = window.location.pathname;
      
      // Prevent infinite redirects by checking current path
      if (currentPath === '/detect-language' || currentPath === '/language-router.html') {
        if (userLang.toLowerCase().startsWith('ja')) {
          // Only redirect if not already on Japanese path
          if (!window.location.pathname.startsWith('/ja')) {
            window.location.href = '/ja/';
          }
        } else {
          // Only redirect if not already on root
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
      }
    })();
  </script>
</head>
<body>
  <h1>Redirecting to the appropriate language version...</h1>
  <p>If you are not redirected automatically, please click one of the links below:</p>
  <ul>
    <li><a href="/">English</a></li>
    <li><a href="/ja/">日本語</a></li>
  </ul>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, 'language-router.html'), languageRouterContent);
  console.log('✅ Language router created!');
} catch (error) {
  console.error('❌ Failed to create language router:', error);
  process.exit(1);
}

console.log('🎉 Build process completed! The files are ready for deployment.');
console.log('📝 To deploy, run: firebase deploy --only hosting'); 