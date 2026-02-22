# Build & Installation Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Chrome/Edge/Firefox browser for testing
- OpenRouter API key (free tier available)

## Building the Extension

### Step 1: Install Dependencies

```bash
cd extension
npm install
```

### Step 2: Build TypeScript

```bash
npm run build
```

This will compile TypeScript files to the `dist/` directory.

### Step 3: Copy Static Files

```bash
# Copy HTML files
cp popup.html dist/
cp options.html dist/
cp content-ui.html dist/

# Copy icons
mkdir -p dist/icons
cp icons/icon16.png dist/icons/
cp icons/icon48.png dist/icons/
cp icons/icon128.png dist/icons/
```

Or use the build script:

```bash
chmod +x scripts/build.sh
./scripts/build.sh
```

## Installing the Extension

### Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (top right corner)
3. Click "Load unpacked" (top left)
4. Select the `extension/` directory

### Edge

1. Open Edge and navigate to `edge://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" (top left)
4. Select the `extension/` directory

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `extension/manifest.json`

## Configuring API Key

1. Click the extension icon in your browser toolbar
2. Click "Settings" button
3. Enter your OpenRouter API key
4. Click "Save OpenRouter Key"

### Get OpenRouter API Key

1. Go to https://openrouter.ai/keys
2. Sign up or log in
3. Generate a new API key
4. Copy the key

## Testing the Extension

### Test 1: Create Flashcards

1. Open any webpage (article, blog post, documentation)
2. Click the extension icon
3. Click "Create Flashcards" button
4. Wait for flashcards to be generated
5. Check the flashcards UI overlay

### Test 2: View Flashcards

1. Click the extension icon
2. View the stats (total flashcards, review queue)
3. Flashcards will appear in the popup

### Test 3: Download Flashcards

1. After creating flashcards, click "Download as CSV"
2. The CSV file will be downloaded

### Test 4: Settings

1. Click "Settings" button
2. Enter API key
3. Click "Save OpenRouter Key"
4. Verify it was saved (check UI)
5. Try "Clear All Flashcards"

## Troubleshooting

### Extension Not Working

1. Check if extension is enabled in chrome://extensions
2. Reload the extension
3. Check browser console for errors (F12)
4. Verify API key is saved

### Flashcards Not Generated

1. Make sure you're on a page with article content
2. Check if API key is saved
3. Verify OpenRouter API key is valid
4. Check browser console for errors

### Build Errors

1. Make sure Node.js 18+ is installed: `node --version`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check TypeScript errors in the console

### Icons Not Showing

1. Make sure icons are in `extension/icons/` directory
2. Check file names: `icon16.png`, `icon48.png`, `icon128.png`
3. Reload extension

## Deployment to Chrome Web Store

### Step 1: Build Complete Extension

```bash
cd extension
chmod +x scripts/build.sh
./scripts/build.sh
```

### Step 2: Create ZIP File

```bash
cd dist
zip -r ../article-to-flashcards-v1.0.0.zip *
cd ..
```

### Step 3: Upload to Chrome Web Store

1. Go to https://chrome.google.com/webstore/devconsole
2. Click "Create new item"
3. Upload the ZIP file
4. Fill in the details:
   - Title: Article-to-Flashcards
   - Description: Convert any webpage into flashcards automatically
   - Category: Productivity
   - Screenshots: Add screenshots
   - Privacy Policy: Add URL
   - Pricing: Free
5. Submit for review (1-7 days)

## Next Steps

After successful installation and testing:

1. ✅ Create real icon files (not base64 placeholders)
2. ✅ Add more tests (unit tests, integration tests)
3. ✅ Implement spaced repetition algorithm (SM-2)
4. ✅ Add multiple choice question generation
5. ✅ Add image support for flashcards
6. ✅ Implement cloud sync (optional)
7. ✅ Add collaboration features (optional)
8. ✅ Optimize performance
9. ✅ Write user documentation
10. ✅ Create marketing materials

## Development Workflow

```bash
# Development (watch mode)
cd extension
npm run watch

# Build for production
npm run build

# Clean build
npm run clean
```

## Project Structure

```
extension/
├── manifest.json          # Extension manifest (V3)
├── background.ts          # Service worker
├── content.ts             # Content script
├── popup.ts               # Popup UI logic
├── options.ts             # Options page logic
├── types.ts               # TypeScript types
├── popup.html             # Popup UI (HTML)
├── options.html           # Options page (HTML)
├── content-ui.html        # Content UI (HTML)
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── scripts/
│   └── build.sh           # Build script
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript config
└── dist/                  # Build output
    ├── background.js
    ├── content.js
    ├── popup.js
    ├── options.js
    ├── popup.html
    ├── options.html
    ├── content-ui.html
    ├── icons/
    └── manifest.json
```

## License

Proprietary

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Email: [your-email]
