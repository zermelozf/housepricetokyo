# Tokyo House Price Calculator

An interactive web application for estimating property prices in Tokyo, built with Angular 19.

## Features

- Property price estimation based on multiple factors
- Interactive maps showing property locations across Tokyo
- Comprehensive articles about Tokyo real estate market
- Fully localized in English (default) and Japanese

## Development Setup

### Prerequisites

- Node.js (18+)
- npm (9+)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tokyohouseprice.git
cd tokyohouseprice/app

# Install dependencies
npm install
```

### Development Server

Run the development server with:

```bash
# Run standard development server (English)
npm start

# OR run both English and Japanese versions simultaneously
npm run dev
```

With `npm run dev`, you can access:
- English version: http://localhost:4200/
- Japanese version: http://localhost:4201/

### Code Scaffolding

```bash
# Generate a new component
ng generate component component-name

# Generate other Angular artifacts
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## Internationalization (i18n)

This application is fully localized in English and Japanese following Angular best practices.

### Extracting Translations

After adding or modifying translatable content (marked with `i18n` attribute):

```bash
npm run extract-i18n
```

This will:
1. Extract all translatable text to `src/locale/messages.xlf`
2. Update Japanese translation file if it exists

### Adding Translations

Edit `src/locale/messages.ja.xlf` to add or update Japanese translations.

### Testing Localized Versions

```bash
# Test English version
npm run start:en

# Test Japanese version
npm run start:ja
```

## Building for Production

### Standard Build

```bash
# Build with default settings
npm run build
```

### Localized Build

```bash
# Build both English and Japanese versions
npm run build:localized

# Build only English version
npm run build:default

# Build only Japanese version
npm run build:ja
```

## Deployment

The application is configured with English as the default language (no path prefix) and Japanese accessible at the `/ja` path.

### Deployment Steps

```bash
# Build and prepare for deployment
npm run deploy
```

This will:
1. Build both language versions
2. Reorganize files with English at the root and Japanese at `/ja`
3. Create a simple Express server for testing

### Testing the Deployment

```bash
# After running npm run deploy
cd dist/deploy
npm install
npm start
```

Then access:
- English version: http://localhost:3000/
- Japanese version: http://localhost:3000/ja/

### Deployment to Production

For production deployment, you can:

1. Upload the contents of `dist/deploy` to your web server
2. Configure your server to handle client-side routing:
   - Serve `index.html` for all routes except those starting with `/ja`
   - Serve `ja/index.html` for routes starting with `/ja`

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
