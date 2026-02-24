// IndexedDB Helper Functions
class Database {
    dbName = 'article-flashcards';
    storeName = 'flashcards';
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    objectStore.createIndex('nextReview', 'schedule.nextReview', { unique: false });
                }
            };
        });
    }
    async getAll() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }
    async getReviewQueue() {
        const db = await this.open();
        const now = new Date();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const index = objectStore.index('nextReview');
            const range = IDBKeyRange.lowerBound(now.toISOString());
            const request = index.getAll(range);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const results = request.result;
                results.sort((a, b) => new Date(a.schedule.nextReview).getTime() - new Date(b.schedule.nextReview).getTime());
                resolve(results);
            };
        });
    }
    async count() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.count();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }
    async clear() {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
}
const db = new Database();
// Load stats
async function loadStats() {
    const total = await db.count();
    const reviewQueue = await db.getReviewQueue();
    document.getElementById('total-flashcards').textContent = total.toString();
    document.getElementById('review-queue').textContent = reviewQueue.length.toString();
}
// Show flashcards in a new tab
async function showFlashcards() {
    const flashcards = await db.getAll();
    if (flashcards.length === 0) {
        alert('No flashcards yet. Create some first!');
        return;
    }
    // Sort by next review date
    flashcards.sort((a, b) => new Date(a.schedule.nextReview).getTime() - new Date(b.schedule.nextReview).getTime());
    // Generate HTML
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Flashcards - Article-to-Flashcards</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f9fafb;
          padding: 20px;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
        }

        h1 {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: 700;
        }

        .flashcard {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .question {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .answer {
          font-size: 14px;
          color: #6b7280;
          padding-left: 16px;
          border-left: 3px solid #667eea;
        }

        .tags {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }

        .tag {
          padding: 4px 8px;
          background: #e5e7eb;
          border-radius: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        .controls {
          margin-top: 20px;
          display: flex;
          gap: 12px;
        }

        button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📖 Flashcards</h1>
        ${flashcards.map(card => `
          <div class="flashcard">
            <div class="question">${card.question}</div>
            <div class="answer">${card.answer}</div>
            <div class="tags">
              ${card.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
        `).join('')}
        <div class="controls">
          <button class="btn-primary" onclick="window.close()">Close</button>
          <button class="btn-danger" onclick="window.location.href='chrome://extensions'">Manage</button>
        </div>
      </div>
    </body>
    </html>
  `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    chrome.tabs.create({ url });
}
// Create flashcards
async function createFlashcards() {
    const btn = document.getElementById('create-flashcards');
    btn.disabled = true;
    btn.textContent = '⏳ Creating...';
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url) {
        alert('Please open a webpage first');
        btn.disabled = false;
        btn.textContent = '✨ Create Flashcards';
        return;
    }
    // Show loading
    btn.innerHTML = '<div class="spinner"></div><div class="loading">Creating flashcards...</div>';
    try {
        // Create flashcards in current tab
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.ts']
        });
        // Wait a moment for flashcards to be generated
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('✨ Flashcards created! Check the webpage for the flashcards UI.');
        // Refresh stats
        await loadStats();
        btn.disabled = false;
        btn.textContent = '✨ Create Flashcards';
    }
    catch (error) {
        alert('Error creating flashcards. Please check your API key.');
        btn.disabled = false;
        btn.textContent = '✨ Create Flashcards';
    }
}
// Open settings
function openSettings() {
    chrome.runtime.openOptionsPage();
}
// Event listeners
document.getElementById('create-flashcards').addEventListener('click', createFlashcards);
document.getElementById('open-settings').addEventListener('click', openSettings);
// Load stats on load
loadStats();
export {};
//# sourceMappingURL=popup.js.map