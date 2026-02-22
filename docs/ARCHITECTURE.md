# Architecture Documentation

## System Overview

Article-to-Flashcards is a Chrome extension that converts webpages into study flashcards using AI-powered content extraction and spaced repetition algorithms.

## Components

### 1. Chrome Extension

**Manifest V3** with three main scripts:

#### Content Script (`content.ts`)
- Runs on all webpages
- Extracts article content using Readability
- Sends article URL and content to background service
- Provides flashcard UI overlay

#### Background Service (`background.ts`)
- Handles API requests (OpenRouter, Exa)
- Manages flashcard storage (IndexedDB)
- Schedules spaced repetition reviews
- Handles extension lifecycle events

#### Popup UI (`popup.tsx`)
- User interface for creating flashcards
- Shows list of generated flashcards
- Export options (Anki, Quizlet, CSV)
- Progress tracking

### 2. Web UI (Next.js)

**Frontend Dashboard** for project management:

#### Features
- Task tracking and project status
- View all projects and tasks
- Filter tasks by status, priority
- Progress visualization
- Team collaboration (future)

#### Pages
- `/dashboard` - Main project management
- `/projects` - List of all projects
- `/tasks` - Task details and editing
- `/settings` - User preferences

### 3. Backend (Next.js API)

**API endpoints** for:

#### Flashcard Generation
- `POST /api/generate` - Generate flashcards from URL
- `POST /api/extract` - Extract article content

#### Flashcard Management
- `GET /api/flashcards` - Get all flashcards
- `POST /api/flashcards` - Create new flashcard
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard

#### Spaced Repetition
- `POST /api/schedule` - Calculate review schedule
- `GET /api/reviews` - Get review queue

#### Export
- `GET /api/export/anki` - Export to Anki format
- `GET /api/export/quizlet` - Export to Quizlet format
- `GET /api/export/csv` - Export to CSV

### 4. AI Services

#### Content Extraction (Exa)
- Find key concepts in article
- Extract definitions and examples
- Filter out fluff (ads, navigation)

#### Flashcard Generation (OpenRouter)
- Use GPT-4 for quality generation
- Generate Q&A pairs
- Create multiple choice questions
- Add metadata (difficulty, tags)

## Data Models

### Flashcard
```typescript
{
  id: string;
  question: string;
  answer: string;
  type: 'qa' | 'multiple-choice';
  options?: string[];
  correctAnswer?: number;
  difficulty: 1-5;
  tags: string[];
  metadata: {
    sourceUrl: string;
    sourceTitle: string;
    createdAt: string;
    updatedAt: string;
  };
  schedule: {
    nextReview: string;
    interval: number; // days
    repetition: number;
    easeFactor: number;
  };
}
```

### UserProgress
```typescript
{
  userId: string;
  totalFlashcards: number;
  masteredFlashcards: number;
  learningFlashcards: number;
  retentionRate: number;
  lastReviewDate: string;
  stats: {
    streak: number;
    totalReviews: number;
    averageAccuracy: number;
  };
}
```

## Storage Strategy

### Chrome Extension (LocalStorage + IndexedDB)
- **LocalStorage**: User preferences, API keys
- **IndexedDB**: Flashcard data, review schedule (large dataset)

### Web UI (PostgreSQL)
- User accounts and authentication
- Project and task tracking
- Analytics and statistics

## API Workflow

### Generate Flashcards
1. User pastes URL in popup
2. Content script extracts article content
3. Background service calls `/api/extract` (or Exa directly)
4. Get key concepts and definitions
5. Background service calls `/api/generate` (OpenRouter)
6. Receive flashcards
7. Store in IndexedDB
8. Calculate spaced repetition schedule
9. Show flashcards in UI

### Review Flashcard
1. Get review queue from IndexedDB
2. Display flashcard to user
3. User marks as "Easy", "Good", or "Hard"
4. Update schedule in IndexedDB
5. Calculate next review date
6. Show next flashcard

### Export Flashcards
1. User selects export format
2. Filter flashcards by criteria
3. Format data according to specification
4. Trigger download

## Spaced Repetition Algorithm (SM-2 variant)

Based on SuperMemo-2 algorithm with optimizations:

```
EasinessFactor = EF' * (1.5 + (5 - q) * (0.08 + (5 - q) * 0.02))
Interval = If repetition = 0: 1
          If repetition = 1: 6
          Else: previous_interval * EF
Repetition++
```

Where `q` is quality rating (0-5):
- 0-1: Forgot (reset)
- 2-3: Hard (decrease EF)
- 4-5: Good (normal)
- 5: Easy (increase EF)

## Security Considerations

1. **API Keys**: Never expose OpenRouter API key in client code
   - Use environment variables on backend
   - Proxy all API calls through Next.js API routes

2. **Content Script Isolation**: Sandboxed from webpage
   - Use `content_security_policy` to prevent code injection
   - Sanitize all user input

3. **Local Storage Encryption**: (Future) Encrypt flashcard data
   - Use Web Crypto API
   - Password protection for offline mode

## Performance Optimizations

1. **Lazy Loading**: Load flashcards on demand
2. **Caching**: Cache extracted content
3. **Debouncing**: Debounce user input
4. **Web Workers**: Offload heavy computation
5. **IndexedDB Transactions**: Use proper transactions

## Future Enhancements

1. **Cloud Sync**: Sync flashcards across devices
2. **Collaborative Review**: Study with friends
3. **Voice Input**: Create flashcards by speaking
4. **Image Support**: Flashcards with images
5. **Multilingual**: Support multiple languages
6. **Adaptive Learning**: AI adjusts difficulty dynamically

## Deployment Strategy

### Chrome Extension
1. Build extension for each browser
2. Test on staging environment
3. Submit to Chrome Web Store
4. Submit to Edge, Firefox stores

### Web UI
1. Deploy Next.js app to Vercel
2. Configure environment variables
3. Set up CI/CD pipeline
4. Monitor performance and errors

## Monitoring & Analytics

- **Error Tracking**: Sentry or similar
- **Usage Analytics**: Track how many flashcards created
- **Retention Analytics**: Track user progress
- **Feedback**: User rating system
