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
    async save(flashcard) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.put(flashcard);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
    async delete(id) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
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
// Message Handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'GET_FLASHCARDS') {
        db.getAll().then(flashcards => {
            // Sort by next review date
            flashcards.sort((a, b) => new Date(a.schedule.nextReview).getTime() - new Date(b.schedule.nextReview).getTime());
            sendResponse({ flashcards });
        }).catch(error => {
            sendResponse({ error: error.message });
        });
        return true;
    }
    if (message.action === 'SAVE_FLASHCARD') {
        db.save(message.flashcard).then(() => {
            sendResponse({ success: true });
        }).catch(error => {
            sendResponse({ error: error.message });
        });
        return true;
    }
    if (message.action === 'DELETE_FLASHCARD') {
        db.delete(message.id).then(() => {
            sendResponse({ success: true });
        }).catch(error => {
            sendResponse({ error: error.message });
        });
        return true;
    }
    if (message.action === 'CLEAR_FLASHCARDS') {
        db.clear().then(() => {
            sendResponse({ success: true });
        }).catch(error => {
            sendResponse({ error: error.message });
        });
        return true;
    }
    if (message.action === 'GET_API_KEYS') {
        chrome.storage.local.get(['openrouter_api_key', 'exa_api_key'], (result) => {
            sendResponse({
                openrouter_api_key: result.openrouter_api_key,
                exa_api_key: result.exa_api_key
            });
        });
        return true;
    }
    if (message.action === 'SAVE_API_KEYS') {
        chrome.storage.local.set({
            openrouter_api_key: message.openrouter_api_key,
            exa_api_key: message.exa_api_key
        }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});
// Check for review queue
chrome.alarms.create('check-reviews', {
    periodInMinutes: 60,
    when: Date.now() + 60000
});
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'check-reviews') {
        const flashcards = await db.getAll();
        const now = new Date();
        const reviewQueue = flashcards.filter(card => {
            return new Date(card.schedule.nextReview) <= now;
        });
        if (reviewQueue.length > 0) {
            chrome.notifications.create('flashcard-review', {
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: 'Time for Flashcard Review',
                message: `You have ${reviewQueue.length} flashcards to review`,
                priority: 2
            });
        }
    }
});
// Listen for tab updates to inject content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Inject content script if needed
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.ts']
        }).catch(err => {
            console.error('Failed to inject content script:', err);
        });
    }
});
export {};
//# sourceMappingURL=background.js.map