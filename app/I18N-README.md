# Angular Internationalization Guide

This project is set up with Angular's built-in i18n tools to support multiple languages (currently English and Japanese).

## Project Structure

- **Source Files**: All translatable text in the app is marked with the `i18n` attribute
- **Translation Files**: Located in `src/locale/`
  - `messages.xlf` - Source file with all extracted messages
  - `messages.ja.xlf` - Japanese translations

## Development Workflow

### 1. Mark text for translation

Add the `i18n` attribute to any HTML element containing text that should be translated:

```html
<h1 i18n="@@app.title">Tokyo House Price</h1>
```

The format is: `i18n="@@namespace.key"` where:
- `namespace` helps organize translations (e.g., "app", "nav", "calculator")
- `key` is a unique identifier for the text

### 2. Extract translatable text

Run:
```
npm run extract-i18n
```

This extracts all marked text to `src/locale/messages.xlf`

### 3. Update translations

Edit the language-specific files (e.g., `messages.ja.xlf`) to provide translations:

```xml
<trans-unit id="app.title" datatype="html">
  <source>Tokyo House Price</source>
  <target>東京住宅価格</target>
  <!-- ... -->
</trans-unit>
```

### 4. Build localized versions

To build the app with all locales:

```
npm run build:localized
```

This creates separate builds for each language in the `dist/app/` directory:
- `dist/app/en-US/` - English version
- `dist/app/ja/` - Japanese version

### 5. Development testing

You can also test specific locales during development:

```
npm run start:en  # Run in English
npm run start:ja  # Run in Japanese
```

## Language Selection

The app includes a language selector component that allows users to switch between available languages. When a user selects a language:

1. The language preference is stored in localStorage
2. The app redirects to the appropriate localized route (e.g., `/ja/` for Japanese)

## Deployment

When deploying, you need to configure your web server to:

1. Serve the appropriate language version based on the URL path
2. Default to the appropriate language based on user preference or browser settings

## Adding New Languages

To add a new language:

1. Add the new locale to the `i18n.locales` object in `angular.json`
2. Create a new translation file (e.g., `messages.fr.xlf`)
3. Add configurations for the new locale in `angular.json`
4. Update the language selector component to include the new language 