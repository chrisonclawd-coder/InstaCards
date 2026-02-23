import type { Flashcard } from './types'

// IndexedDB Helper Functions
class Database {
  private dbName = 'article-flashcards'

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('flashcards')) {
          db.createObjectStore('flashcards', { keyPath: 'id' })
        }
      }
    })
  }

  async addFlashcard(flashcard: Flashcard): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction('flashcards', 'readwrite')
        const store = transaction.objectStore('flashcards')
        store.put(flashcard)
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
    })
  }

  async getAllFlashcards(): Promise<Flashcard[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction('flashcards', 'readonly')
        const store = transaction.objectStore('flashcards')
        const request2 = store.getAll()
        request2.onsuccess = () => resolve(request2.result)
        request2.onerror = () => reject(request2.error)
      }
    })
  }

  async getFlashcard(id: string): Promise<Flashcard | undefined> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction('flashcards', 'readonly')
        const store = transaction.objectStore('flashcards')
        const request2 = store.get(id)
        request2.onsuccess = () => resolve(request2.result)
        request2.onerror = () => reject(request2.error)
      }
    })
  }

  async deleteFlashcard(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction('flashcards', 'readwrite')
        const store = transaction.objectStore('flashcards')
        store.delete(id)
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
    })
  }

  async clearAllFlashcards(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction('flashcards', 'readwrite')
        const store = transaction.objectStore('flashcards')
        store.clear()
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
    })
  }
}

const db = new Database()

// UI Elements
const apiKeyInput = document.getElementById('api-key') as HTMLInputElement
const addFlashcardBtn = document.getElementById('add-flashcard') as HTMLButtonElement
const overlay = document.getElementById('flashcard-overlay') as HTMLElement
const overlayContent = document.getElementById('flashcard-content') as HTMLElement

// Initialize
async function init() {
  await db.init()
  updateStats()
}

// Update stats
async function updateStats() {
  const flashcards = await db.getAllFlashcards()
  const total = flashcards.length
  const done = flashcards.filter(f => f.schedule.repetition >= 3).length

  const totalEl = document.getElementById('total-count') as HTMLElement
  const doneEl = document.getElementById('done-count') as HTMLElement
  const progressEl = document.getElementById('progress-bar') as HTMLElement

  if (totalEl) totalEl.textContent = total.toString()
  if (doneEl) doneEl.textContent = done.toString()
  if (progressEl) progressEl.style.width = `${(done / total) * 100}%`
}

// Add flashcard
async function addFlashcard() {
  const apiKey = apiKeyInput.value.trim()
  if (!apiKey) {
    alert('Please enter your API key')
    return
  }

  addFlashcardBtn.disabled = true
  addFlashcardBtn.textContent = 'Adding...'

  try {
    const flashcards = await db.getAllFlashcards()

    // Add demo flashcard
    const demoFlashcard: Flashcard = {
      id: Date.now().toString(),
      question: 'What is this flashcard about?',
      answer: 'This is a demo flashcard. Replace with actual AI-generated content.',
      type: 'qa',
      difficulty: 2,
      tags: ['Demo'],
      sourceUrl: window.location.href,
      sourceTitle: 'Demo',
      createdAt: new Date().toISOString(),
      schedule: {
        nextReview: new Date(Date.now() + 86400000).toISOString(),
        interval: 1,
        repetition: 0,
        easeFactor: 2.5
      }
    }

    await db.addFlashcard(demoFlashcard)
    updateStats()
    alert('Flashcard added successfully!')
  } catch (error) {
    console.error('Error adding flashcard:', error)
    alert('Failed to add flashcard')
  } finally {
    addFlashcardBtn.disabled = false
    addFlashcardBtn.textContent = 'Add Flashcard'
  }
}

// Create overlay
async function createOverlay() {
  try {
    const flashcards = await db.getAllFlashcards()

    if (flashcards.length === 0) {
      alert('No flashcards yet. Add one first!')
      return
    }

    overlayContent.innerHTML = ''

    flashcards.forEach((flashcard, index) => {
      const card = document.createElement('div')
      card.className = 'flashcard-item'
      card.innerHTML = `
        <div class="flashcard-question">${index + 1}. ${flashcard.question}</div>
        <div class="flashcard-answer">${flashcard.answer}</div>
        <div class="flashcard-tags">${flashcard.tags.join(', ')}</div>
        <div class="flashcard-actions">
          <button class="btn btn-delete" data-id="${flashcard.id}">Delete</button>
        </div>
      `

      // Add event listener to delete button
      const deleteBtn = card.querySelector('.btn-delete') as HTMLButtonElement
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this flashcard?')) {
          await db.deleteFlashcard(flashcard.id)
          updateStats()
          card.remove()
        }
      })

      overlayContent.appendChild(card)
    })

    overlay.style.display = 'flex'
  } catch (error) {
    console.error('Error creating overlay:', error)
    alert('Failed to load flashcards')
  }
}

// Close overlay
function closeOverlay() {
  overlay.style.display = 'none'
}

// Event listeners
if (addFlashcardBtn) {
  addFlashcardBtn.addEventListener('click', addFlashcard)
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'create-overlay') {
    createOverlay()
    sendResponse({ success: true })
  }
  return true
})

// Initialize on load
init()
