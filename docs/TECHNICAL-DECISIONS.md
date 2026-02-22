# Technical Decisions

## 1. Chrome Extension Manifest V3

**Decision**: Use Manifest V3 over V2

**Rationale**:
- V3 is the current standard (deprecated in 2024)
- Better security (service workers instead of background pages)
- Future-proof
- Better developer experience

**Trade-offs**:
- More complex than V2
- Requires migration if using older extensions
- Less mature ecosystem

**Alternatives Considered**:
- V2: Older, simpler, but deprecated
- Electron app: More features, but heavier and harder to distribute

## 2. Content Extraction: Exa vs. Readability

**Decision**: Use Exa API for content extraction

**Rationale**:
- Exa finds key concepts, definitions, and examples
- AI-powered extraction is more accurate
- Can extract from dynamic content
- Better at handling paywalled content

**Trade-offs**:
- Requires API key and costs money
- Dependency on external service

**Alternatives Considered**:
- Readability: Built-in, free, but less accurate
- Puppeteer: More control, but slower and heavier
- Cheerio: Lightweight, but requires manual parsing

**Cost**:
- Exa: $0.005 per 3 results (as used in X Strategy)
- Expected usage: 5-10 results per article
- Cost per article: ~$0.001-0.002

## 3. AI Model: OpenRouter (GPT-4)

**Decision**: Use GPT-4 via OpenRouter for flashcard generation

**Rationale**:
- Highest quality flashcards
- Consistent output format
- Easy to integrate
- Cost-effective compared to Claude

**Trade-offs**:
- Higher cost than Llama
- No fine-tuning (not needed for this use case)

**Alternatives Considered**:
- GPT-4 directly: More expensive, no need
- Claude 3.5 Sonnet: Slightly cheaper, but more complex API
- Llama 3.1 70B: Free, but lower quality
- GPT-3.5 Turbo: Cheaper, but lower quality

**Cost**:
- GPT-4: ~$0.01 per 1000 tokens (input + output combined)
- Expected per article: ~500-1000 tokens
- Cost per article: ~$0.005-0.01

## 4. Storage: IndexedDB vs. localStorage

**Decision**: Use IndexedDB for flashcard storage

**Rationale**:
- LocalStorage has 5MB limit
- IndexedDB has 50MB+ limit
- Can store thousands of flashcards
- Better for large datasets

**Trade-offs**:
- More complex API
- Asynchronous operations
- Browser compatibility issues (older browsers)

**Alternatives Considered**:
- localStorage: Simpler, but limited
- Firebase: Cloud storage, but requires backend
- AWS DynamoDB: Cloud storage, but complex setup

## 5. Spaced Repetition: SM-2 Algorithm

**Decision**: Use SuperMemo-2 (SM-2) algorithm

**Rationale**:
- Well-tested, proven effectiveness
- Simple to implement
- Easy to understand and explain

**Trade-offs**:
- Not as adaptive as newer algorithms (SM-5, SuperMemo 3)
- Can be adjusted for this use case

**Alternatives Considered**:
- SM-5: More complex, better performance
- Leitner System: Simpler, but less accurate
- Custom algorithm: Maximum control, but more development

**Implementation**:
```typescript
function calculateReview(
  easeFactor: number,
  interval: number,
  repetition: number,
  quality: number
) {
  // SM-2 formula
  let newEF = easeFactor * (1.5 + (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newInterval: number;
  if (repetition === 0) newInterval = 1;
  else if (repetition === 1) newInterval = 6;
  else newInterval = Math.floor(interval * newEF);

  return {
    easeFactor: newEF,
    interval: newInterval,
    repetition: repetition + 1
  };
}
```

## 6. Web UI Framework: Next.js 14

**Decision**: Use Next.js 14 with App Router

**Rationale**:
- Server components for better performance
- Built-in API routes (simplify backend)
- TypeScript support out of the box
- Tailwind CSS integration
- Easy deployment to Vercel

**Trade-offs**:
- Larger bundle size than React + Vite
- Learning curve for new users

**Alternatives Considered**:
- React + Vite: Simpler, but more boilerplate
- Vue 3: Simpler, but smaller ecosystem
- Svelte: Lightweight, but smaller community

**Why Next.js?**
- Built-in API routes: Avoid separate backend
- Server components: Better performance
- Easy deployment: Vercel integration

## 7. Styling: Tailwind CSS

**Decision**: Use Tailwind CSS for all UI styling

**Rationale**:
- Utility-first approach
- Easy to maintain
- Consistent design
- Large community and plugins

**Trade-offs**:
- Learning curve for CSS
- Can be verbose
- Risk of "utility hell"

**Alternatives Considered**:
- CSS Modules: More traditional, but more code
- Styled Components: Runtime CSS-in-JS
- CSS Variables: Custom solution

## 8. State Management: React Context + Zustand

**Decision**: Use React Context + Zustand for state management

**Rationale**:
- React Context: Built-in, easy to use
- Zustand: Simpler than Redux
- Good for small to medium projects

**Trade-offs**:
- React Context: Can cause re-renders
- Zustand: Smaller than Redux

**Alternatives Considered**:
- Redux Toolkit: Industry standard, but overkill
- Jotai: Atom-based, but less common
- Recoil: Facebook, but more complex

**Why Context + Zustand?**
- Simple project: Don't need Redux
- Performance: Zustand is lightweight
- Ease of use: Familiar APIs

## 9. Export Formats: Anki, Quizlet, CSV

**Decision**: Support Anki, Quizlet, and CSV exports

**Rationale**:
- Anki: Most popular flashcard app
- Quizlet: Popular for students
- CSV: Universal format, easy to import

**Trade-offs**:
- Multiple formats require multiple parsers
- Maintenance burden

**Alternatives Considered**:
- Only CSV: Simplest, but less useful
- Only Anki: Most popular, but not universal
- Custom format: Maximum flexibility, but not useful

**Anki Format**:
```
Card 1
Front: What is X?
Back: X is Y.
```

**Quizlet Format**:
```
Question,Answer
"What is X?","X is Y."
```

**CSV Format**:
```
question,answer,difficulty
"What is X?","X is Y.",3
```

## 10. Error Handling: Try-Catch + User Feedback

**Decision**: Comprehensive error handling with user feedback

**Rationale**:
- Users need to know what went wrong
- Clear error messages
- Graceful degradation

**Trade-offs**:
- More code
- More testing required

**Implementation**:
```typescript
try {
  await generateFlashcards(url);
  showToast('Flashcards generated successfully!', 'success');
} catch (error) {
  showToast('Failed to generate flashcards. Please try again.', 'error');
  console.error(error);
}
```

## 11. Deployment: Chrome Web Store + Vercel

**Decision**: Deploy to Chrome Web Store and Vercel

**Rationale**:
- Chrome Web Store: Official extension store
- Vercel: Easy deployment, free tier available
- Both have good developer experience

**Trade-offs**:
- Chrome Web Store: Review process (1-7 days)
- Vercel: Free tier limited

**Alternatives Considered**:
- GitHub Pages: Free, but no API routes
- Netlify: Similar to Vercel, but less integrated
- Self-hosted: More control, but more maintenance

**Chrome Web Store Submission**:
1. Create developer account ($5 one-time)
2. Build extension for Chrome
3. Test on staging
4. Submit for review
5. Wait 1-7 days

**Vercel Deployment**:
1. Connect GitHub repository
2. Push to main branch
3. Automatically deploy
4. Configure environment variables

## 12. Testing: Jest + Testing Library

**Decision**: Use Jest and React Testing Library

**Rationale**:
- Jest: Popular, fast, built-in
- React Testing Library: Best practice for React
- Easy to set up and use

**Trade-offs**:
- Can be verbose
- Learning curve

**Alternatives Considered**:
- Vitest: Faster, but less mature
- Cypress: E2E testing, but heavier
- Playwright: E2E testing, but heavier

**Test Coverage Goals**:
- 70% code coverage
- All critical paths
- All user flows

## 13. Monitoring: Sentry (Future)

**Decision**: Use Sentry for error tracking and monitoring

**Rationale**:
- Easy to set up
- Detailed error reports
- User feedback integration
- Performance monitoring

**Trade-offs**:
- Requires account setup
- Can be privacy-sensitive

**Alternatives Considered**:
- LogRocket: Session replay
- Rollbar: Error tracking
- CloudWatch: AWS-native

## 14. Version Control: Git + GitHub

**Decision**: Use Git + GitHub for version control

**Rationale**:
- Industry standard
- Collaboration features
- CI/CD integration
- Free for public repos

**Alternatives Considered**:
- GitLab: Similar features
- Bitbucket: Similar features
- Mercurial: Less popular

**Branching Strategy**: GitFlow
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Emergency fixes

## Summary

All technical decisions prioritize:
1. **Quality**: Best user experience
2. **Performance**: Fast, responsive
3. **Maintainability**: Easy to understand and extend
4. **Cost**: Free tier available
5. **Future-proof**: Not locked into older tech
