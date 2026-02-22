# Article-to-Flashcards

Convert any webpage into flashcards automatically. Extract key concepts, definitions, and examples — then export to Anki, Quizlet, or CSV for spaced repetition learning.

## Features

- **Smart Extraction**: Automatically reads articles and finds key concepts, definitions, examples
- **Multiple Formats**: Q&A flashcards + multiple choice questions
- **Spaced Repetition**: Auto-schedule review for optimal memory retention
- **Offline Mode**: Study flashcards without internet after extraction
- **Multi-Platform Export**: Anki (.apkg), Quizlet (.csv), Google Sheets
- **Progress Tracking**: Track which cards you remember and retention rates
- **Browser Integration**: Works on Chrome, Edge, Firefox, Safari

## Problem Solved

**Reading 10 articles a day but forgetting 90% of it.**

This extension turns passive reading into active learning — you remember more because flashcards force you to recall information.

## Use Cases

**Students**: Study lecture notes and articles before exams
**Researchers**: Convert research papers into review cards
**Learners**: Build knowledge from documentation and tutorials
**Professionals**: Remember technical concepts and best practices

## Project Status

- [x] Project planning complete
- [ ] Web UI development (Phase 2)
- [ ] Chrome extension development (Phase 3)

## Getting Started

### Development Setup

```bash
# Clone repository
git clone <repo-url>
cd article-to-flashcards

# Install dependencies (for web UI)
cd web-ui
npm install

# Build Chrome extension
cd ../extension
npm install
npm run build
```

### API Keys Required

- OpenRouter API (for AI flashcard generation)
- (Optional) Exa for content extraction

## Tech Stack

- **Web UI**: Next.js + TypeScript + Tailwind CSS
- **Chrome Extension**: Manifest V3 + React + TypeScript
- **Backend**: Next.js API routes (serverless)
- **Storage**: LocalStorage + IndexedDB
- **AI**: OpenRouter (GPT-4, Claude, or Llama)

## License

Proprietary

## Author

Created for learning and productivity.
