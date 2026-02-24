// Wait for page to load
function waitForContent(timeout = 10000) {
    return new Promise(resolve => {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const mainContent = document.querySelector('main, article, .content, .post, .article');
            if (mainContent && (mainContent.textContent?.trim().length ?? 0) > 100) {
                clearInterval(checkInterval);
                resolve(true);
            }
            else if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                resolve(false);
            }
        }, 500);
    });
}
// Extract page title
function extractTitle() {
    const titleElement = document.querySelector('h1, h2');
    return titleElement?.textContent?.trim() || document.title;
}
// Extract page content
function extractContent() {
    const mainContent = document.querySelector('main, article, .content, .post, .article');
    if (mainContent) {
        // Get all paragraphs and headings
        const paragraphs = Array.from(mainContent.querySelectorAll('p, h1, h2, h3, h4'))
            .map(p => p.textContent?.trim())
            .filter(Boolean);
        return paragraphs.join('\n\n');
    }
    return '';
}
// Extract URL
function extractUrl() {
    return window.location.href;
}
// Generate flashcards
async function generateFlashcards() {
    try {
        const content = extractContent();
        if (!content) {
            throw new Error('Could not extract content from page');
        }
        const title = extractTitle();
        const url = extractUrl();
        // This is a placeholder - replace with actual AI generation
        const flashcards = [
            {
                id: Date.now().toString(),
                question: `What is the main topic of "${title}"?`,
                answer: 'Generated from page content',
                type: 'qa',
                difficulty: 2,
                tags: ['Knowledge', 'Summary'],
                sourceUrl: url,
                sourceTitle: title,
                createdAt: new Date().toISOString(),
                schedule: {
                    nextReview: new Date(Date.now() + 86400000).toISOString(),
                    interval: 1,
                    repetition: 0,
                    easeFactor: 2.5
                }
            }
        ];
        return flashcards;
    }
    catch (error) {
        console.error('Error generating flashcards:', error);
        throw error;
    }
}
// Create UI overlay
function createOverlay(flashcards) {
    // Remove existing overlay
    const existing = document.getElementById('flashcards-overlay');
    if (existing)
        existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'flashcards-overlay';
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
    const container = document.createElement('div');
    container.style.cssText = `
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
  `;
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #3b82f6;
  `;
    const title = document.createElement('h2');
    title.textContent = 'Flashcards';
    title.style.cssText = 'font-size: 2rem; color: white; margin: 0;';
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
    background: #ef4444;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
  `;
    closeButton.onclick = () => overlay.remove();
    header.appendChild(title);
    header.appendChild(closeButton);
    container.appendChild(header);
    // Flashcards list
    flashcards.forEach((flashcard, index) => {
        const card = document.createElement('div');
        card.style.cssText = `
      background: #1f2937;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
      border: 1px solid #374151;
    `;
        const question = document.createElement('h3');
        question.textContent = flashcard.question;
        question.style.cssText = 'font-size: 1.25rem; color: #60a5fa; margin-bottom: 12px;';
        const answer = document.createElement('p');
        answer.textContent = flashcard.answer;
        answer.style.cssText = 'font-size: 1.1rem; color: #e5e7eb;';
        const footer = document.createElement('div');
        footer.style.cssText = 'margin-top: 16px; display: flex; gap: 8px;';
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export CSV';
        exportButton.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    `;
        exportButton.onclick = () => exportFlashcards(flashcard);
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.cssText = `
      background: #10b981;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    `;
        copyButton.onclick = () => {
            navigator.clipboard.writeText(flashcard.question + '\n\n' + flashcard.answer);
            copyButton.textContent = 'Copied!';
            setTimeout(() => copyButton.textContent = 'Copy', 2000);
        };
        footer.appendChild(exportButton);
        footer.appendChild(copyButton);
        card.appendChild(question);
        card.appendChild(answer);
        card.appendChild(footer);
        container.appendChild(card);
    });
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    // Send message to background script
    chrome.runtime.sendMessage({
        type: 'generate-flashcards',
        data: {
            url: window.location.href,
            title: extractTitle()
        }
    });
}
// Export flashcards to CSV
function exportFlashcards(flashcard) {
    const csvContent = `Question,Answer,Type,Difficulty,Tags\n` +
        `"${flashcard.question.replace(/"/g, '""')}","${flashcard.answer.replace(/"/g, '""')}",${flashcard.type},${flashcard.difficulty},"${flashcard.tags.join(', ')}"`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${flashcard.sourceTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flashcards.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'create-overlay') {
        generateFlashcards()
            .then(flashcards => {
            createOverlay(flashcards);
            sendResponse({ success: true });
        })
            .catch(error => {
            sendResponse({ success: false, error: error.message });
        });
        return true; // Keep message channel open
    }
});
// Initialize
waitForContent(10000)
    .then(() => {
    console.log('Content loaded, ready to generate flashcards');
})
    .catch(error => {
    console.error('Error waiting for content:', error);
});
export {};
