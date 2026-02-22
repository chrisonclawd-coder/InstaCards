# Article-to-Flashcards Extension

**Convert any webpage into flashcards automatically with AI.**

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/1.0.0)]()
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

## Features

- 📖 **Smart Extraction** - Automatically extracts article content using AI
- 🤖 **AI-Powered Generation** - Creates flashcards using GPT-4
- 📊 **Flashcard UI** - Inline overlay with flashcard display
- 📤 **CSV Export** - Download flashcards as CSV files
- 🔑 **API Key Management** - Securely store your OpenRouter API key
- 📈 **Stats Tracking** - See total flashcards and review queue
- ⏰ **Review Scheduling** - Spaced repetition algorithm built-in
- 🌐 **Cross-Browser** - Works on Chrome, Edge, and Firefox

## Installation

### Chrome
1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (top right corner)
3. Click **Load unpacked** (top left)
4. Select the `extension/` directory

### Edge
1. Open Edge and navigate to `edge://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** (top left)
4. Select the `extension/` directory

### Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `extension/manifest.json`

## Configuration

### 1. Get OpenRouter API Key

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up or log in
3. Generate a new API key

### 2. Set API Key

1. Click the extension icon in your browser toolbar
2. Click **Settings** button
3. Enter your OpenRouter API key
4. Click **Save OpenRouter Key**

**Note:** Your API key is stored locally in Chrome storage and never sent anywhere except OpenRouter API.

## Usage

### Create Flashcards

1. Open any webpage (article, blog post, documentation)
2. Click the extension icon
3. Click **Create Flashcards** button
4. Wait for flashcards to be generated
5. Review flashcards in the overlay UI

### View Flashcards

1. Click the extension icon
2. View stats (total flashcards, review queue)
3. Flashcards appear in the popup

### Export Flashcards

1. After creating flashcards, click **Download as CSV**
2. The CSV file will be downloaded

### Review Flashcards

1. Review queue notifications appear when it's time
2. Click the extension icon to see available flashcards
3. Review and track your progress

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
```

## API Integration

### OpenRouter API

The extension uses OpenRouter's API with GPT-4 for flashcard generation.

**Endpoint:** `https://api.openrouter.ai/api/v1/chat/completions`

**Model:** `gpt-4`

**Prompt:** Flashcard generation with specific formatting requirements

**Pricing:** ~$0.01 per article (500-1000 tokens per article)

### API Key Storage

- **Location:** `chrome.storage.local`
- **Key:** `openrouter_api_key`
- **Security:** Stored locally, encrypted by Chrome
- **Access:** Only accessible by the extension itself

## Spaced Repetition Algorithm

The extension implements a simplified SM-2 algorithm:

```
EasinessFactor = EF' * (1.5 + (5 - quality) * (0.08 + (5 - quality) * 0.02))
Interval = If repetition = 0: 1
          If repetition = 1: 6
          Else: previous_interval * EF
Repetition++
```

**Quality Ratings (0-5):**
- 0-1: Forgot (reset repetition)
- 2-3: Hard (decrease EF)
- 4-5: Good (normal)
- 5: Easy (increase EF)

**Future Enhancement:** Full SM-2 implementation with review UI in popup

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 88+ | ✅ Full support |
| Edge | 88+ | ✅ Full support |
| Firefox | 70+ | ⚠️ Temporary add-on only |

## Troubleshooting

### Extension Not Working

**Check:**
1. Extension is enabled in `chrome://extensions`
2. Reload the extension
3. Check browser console (F12) for errors
4. Verify API key is saved

### Flashcards Not Generated

**Possible Causes:**
1. Page doesn't have article content
2. API key is not saved
3. OpenRouter API key is invalid
4. Network error

**Solutions:**
1. Open a page with clear article content
2. Check API key in settings
3. Verify OpenRouter API key at openrouter.ai/keys
4. Check network tab for errors

### Build Errors

**Common Issues:**
1. Node.js version too old (need 18+)
2. TypeScript compilation errors
3. Missing dependencies

**Solutions:**
1. Update Node.js: `node --version` should be 18+
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check TypeScript errors in console

## Development

### Building the Extension

```bash
cd extension

# Install dependencies
npm install

# Build TypeScript
npm run build

# Copy HTML and icon files
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

### Testing

1. Load unpacked extension in Chrome
2. Open a webpage with article content
3. Click extension icon
4. Click "Create Flashcards"
5. Review generated flashcards
6. Test CSV export
7. Test settings page

### Debugging

**Chrome:**
1. Open DevTools (F12)
2. Go to Console tab
3. Check for errors
4. Use `chrome.runtime.sendMessage()` for debugging

**Content Script:**
1. Open webpage with article
2. Right-click → Inspect
3. Go to Console tab
4. Check for errors

## Contributing

This is a proprietary project. Pull requests are not accepted.

## Roadmap

### Phase 1 (Current) ✅
- [x] Article extraction
- [x] AI flashcard generation
- [x] Inline UI overlay
- [x] CSV export
- [x] API key management
- [x] Stats tracking

### Phase 2 (Next)
- [ ] Full SM-2 spaced repetition with review UI
- [ ] Multiple choice question generation
- [ ] Review quality ratings
- [ ] Review queue in popup
- [ ] Performance optimizations

### Phase 3 (Future)
- [ ] Image support for flashcards
- [ ] Anki export (.apkg)
- [ ] Quizlet export
- [ ] Cloud sync
- [ ] Collaboration features
- [ ] Dark mode for UI
- [ ] Browser background performance

### Phase 4 (Long-term)
- [ ] iOS app
- [ ] Android app
- [ ] Web app
- [ ] Premium features
- [ ] API for developers

## Security

### API Key Security

- **Stored locally** in Chrome storage
- **Never sent** to third parties
- **Encrypted** by Chrome
- **Accessible only** by this extension

### Content Script Isolation

- **Sandboxed** from webpage
- **Content Security Policy** configured
- **No code injection** possible
- **Sanitized input** before use

### Data Privacy

- **Local storage only** (IndexedDB)
- **No data collection**
- **No analytics**
- **No tracking**

## Performance

### Optimization Strategies

1. **Lazy Loading**: Load flashcards on demand
2. **Debouncing**: Debounce user input
3. **IndexedDB**: Use database instead of localStorage
4. **Efficient Queries**: Use indexes properly

### Known Performance Issues

1. **Initial Load**: API calls take time (need loading states)
2. **Large Articles**: Slow extraction on long articles
3. **Multiple Tabs**: Content script may run multiple times

### Future Optimizations

1. **Web Workers**: Offload heavy computation
2. **Caching**: Cache extracted content
3. **Background Processing**: Process in background worker

## Browser Extensions Best Practices

### Manifest V3 Compliance

- ✅ Service workers instead of background pages
- ✅ Content Security Policy
- ✅ Permissions are explicit
- ✅ Storage API for data persistence

### Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels where needed
- ⚠️ Color contrast needs improvement (WCAG 2.1 AA)

### Security

- ✅ Input sanitization
- ✅ No eval() usage
- ✅ No dangerous features
- ✅ HTTPS only for APIs

## License

Proprietary - All rights reserved

## Support

For issues and questions:
- **GitHub Issues**: [repository-url]/issues
- **Email**: [your-email]
- **Documentation**: See `docs/BUILD-GUIDE.md`

## Changelog

### Version 1.0.0 (2026-02-22)
- ✅ Initial release
- ✅ Article extraction
- ✅ AI flashcard generation
- ✅ Inline UI overlay
- ✅ CSV export
- ✅ API key management
- ✅ Stats tracking

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for the AI API
- [Chrome](https://www.google.com/chrome/) for the browser platform
- [IndexDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for storage
- [SM-2 Algorithm](https://www.supermemo.com/en/articles/sm2) for spaced repetition

## Version History

### v1.0.0 (2026-02-22)
- Initial release
- Article extraction
- AI flashcard generation
- Inline UI overlay
- CSV export
- API key management
- Stats tracking
