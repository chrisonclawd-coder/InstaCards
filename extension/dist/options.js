"use strict";
// Save OpenRouter API Key
document.getElementById('save-openrouter').addEventListener('click', async () => {
    const apiKey = document.getElementById('openrouter-api-key').value.trim();
    if (!apiKey) {
        alert('Please enter an API key');
        return;
    }
    try {
        await chrome.storage.local.set({ openrouter_api_key: apiKey });
        document.getElementById('openrouter-success').style.display = 'block';
        document.getElementById('openrouter-error').style.display = 'none';
        // Clear after 3 seconds
        setTimeout(() => {
            document.getElementById('openrouter-success').style.display = 'none';
        }, 3000);
    }
    catch (error) {
        console.error('Error saving API key:', error);
        document.getElementById('openrouter-success').style.display = 'none';
        document.getElementById('openrouter-error').style.display = 'block';
        setTimeout(() => {
            document.getElementById('openrouter-error').style.display = 'none';
        }, 3000);
    }
});
// Clear all flashcards
document.getElementById('clear-data').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete all flashcards? This cannot be undone.')) {
        return;
    }
    try {
        const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open('article-flashcards', 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('flashcards')) {
                    db.createObjectStore('flashcards', { keyPath: 'id' });
                }
            };
        });
        const transaction = db.transaction(['flashcards'], 'readwrite');
        const objectStore = transaction.objectStore('flashcards');
        const request = objectStore.clear();
        request.onerror = () => {
            alert('Error clearing flashcards');
            document.getElementById('clear-error').style.display = 'block';
        };
        request.onsuccess = () => {
            alert('All flashcards have been cleared');
            document.getElementById('clear-success').style.display = 'block';
            document.getElementById('clear-error').style.display = 'none';
            setTimeout(() => {
                document.getElementById('clear-success').style.display = 'none';
            }, 3000);
        };
    }
    catch (error) {
        console.error('Error clearing flashcards:', error);
        alert('Error clearing flashcards');
        document.getElementById('clear-error').style.display = 'block';
    }
});
