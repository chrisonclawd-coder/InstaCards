// IndexedDB Helper Functions
class Database {
    constructor() {
        this.dbName = 'article-flashcards';
    }
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('flashcards')) {
                    db.createObjectStore('flashcards', { keyPath: 'id' });
                }
            };
        });
    }
    async addFlashcard(flashcard) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction('flashcards', 'readwrite');
                const store = transaction.objectStore('flashcards');
                store.put(flashcard);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            };
        });
    }
    async getAllFlashcards() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction('flashcards', 'readonly');
                const store = transaction.objectStore('flashcards');
                const request2 = store.getAll();
                request2.onsuccess = () => resolve(request2.result);
                request2.onerror = () => reject(request2.error);
            };
        });
    }
}
const db = new Database();
// Initialize database on service worker install
chrome.runtime.onInstalled.addListener(async () => {
    await db.init();
});
chrome.runtime.onMessage.addListener((message) => {
    // Handle different message types
    if (message.type === 'generate-flashcards') {
        generateFlashcards(message.data);
    }
    else if (message.type === 'export-flashcards') {
        exportFlashcards(message.data.format || 'csv', message.data.sendResponse);
    }
    else if (message.type === 'get-storage') {
        getStorage(message.data.sendResponse);
    }
    // Keep message channel open for async responses
    return true;
});
async function generateFlashcards(data) {
    try {
        const { url, apiKey } = data;
        if (!apiKey) {
            sendError('API key is required');
            return;
        }
        // Get page title
        const title = document.title;
        // Generate flashcards (placeholder - replace with actual AI generation)
        const flashcards = [
            {
                id: Date.now().toString(),
                question: 'What is the main topic of this page?',
                answer: data.topic || 'Based on the URL content',
                type: 'qa',
                difficulty: 3,
                tags: ['General'],
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
        // Save to IndexedDB
        for (const flashcard of flashcards) {
            await db.addFlashcard(flashcard);
        }
        sendSuccess({ flashcards });
    }
    catch (error) {
        sendError(error instanceof Error ? error.message : 'Unknown error');
    }
}
async function exportFlashcards(format, sendResponse) {
    try {
        const flashcards = await db.getAllFlashcards();
        if (format === 'csv') {
            const csv = flashcardsToCSV(flashcards);
            sendSuccess({ csv, format: 'text/csv' });
        }
        else {
            sendSuccess({ json: flashcards, format: 'application/json' });
        }
    }
    catch (error) {
        sendError(error instanceof Error ? error.message : 'Unknown error');
    }
}
async function getStorage(sendResponse) {
    try {
        const flashcards = await db.getAllFlashcards();
        sendSuccess({ flashcards, apiKey: 'stored', exportFormat: 'csv' });
    }
    catch (error) {
        sendError(error instanceof Error ? error.message : 'Unknown error');
    }
}
function flashcardsToCSV(flashcards) {
    const headers = ['Question', 'Answer', 'Type', 'Difficulty', 'Tags'];
    const rows = flashcards.map(f => [
        `"${f.question.replace(/"/g, '""')}"`,
        `"${f.answer.replace(/"/g, '""')}"`,
        f.type,
        f.difficulty.toString(),
        `"${f.tags.join(', ')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
function sendSuccess(data) {
    chrome.runtime.sendMessage({ type: 'response', success: true, data });
}
function sendError(error) {
    chrome.runtime.sendMessage({ type: 'response', success: false, error });
}
export {};
