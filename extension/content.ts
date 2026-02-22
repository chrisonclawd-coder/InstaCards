import type { Flashcard } from '../types'

// Wait for page to load
function waitForContent(timeout = 10000): Promise<boolean> {
  return new Promise(resolve => {
    const check = () => {
      // Check if main content exists
      const mainContent = document.querySelector('main, article, .article, .content, .post')
      if (mainContent && mainContent.innerText.trim().length > 100) {
        resolve(true)
      } else {
        // Wait a bit more
        setTimeout(check, 500)
      }
    }

    // Check with timeout
    let elapsed = 0
    const interval = setInterval(() => {
      elapsed += 500
      if (elapsed >= timeout) {
        clearInterval(interval)
        resolve(false)
      }
      check()
    }, 500)
  })
}

// Extract article content using Readability logic
function extractArticleContent(): {
  title: string
  content: string
  url: string
  author?: string
  publishedDate?: string
  keywords: string[]
} {
  // Try to find article metadata
  const titleElement = document.querySelector('h1, .article-title, .post-title, h2')
  const title = titleElement?.innerText.trim() || document.title

  // Extract main content
  const contentSelectors = [
    'main',
    'article',
    '.article',
    '.content',
    '.post',
    'div[class*="content"]',
    'div[class*="article"]'
  ]

  let contentElement: HTMLElement | null = null
  for (const selector of contentSelectors) {
    contentElement = document.querySelector(selector)
    if (contentElement) break
  }

  // Fallback: get first paragraph and headings
  if (!contentElement) {
    contentElement = document.body
  }

  // Clean up content
  const paragraphs = contentElement.querySelectorAll('p, h2, h3, h4, li, dt, dd')
  const text = Array.from(paragraphs)
    .map(p => p.innerText.trim())
    .filter(text => text.length > 0)
    .join('\n\n')

  // Get URL
  const url = window.location.href

  // Extract author and date from metadata
  const author = document.querySelector('meta[name="author"]')?.content ||
                 document.querySelector('.author')?.innerText?.trim()

  const publishedDate = document.querySelector('meta[name="date"]')?.content ||
                        document.querySelector('time[datetime]')?.getAttribute('datetime')

  // Extract keywords
  const keywords = Array.from(document.querySelectorAll('meta[name="keywords"], meta[name="tags"]'))
    .map(m => m.content.split(',').map(k => k.trim()))
    .flat()
    .filter(k => k.length > 0)

  return {
    title,
    content: text,
    url,
    author,
    publishedDate,
    keywords: keywords.length > 0 ? keywords : [title, 'article', 'webpage']
  }
}

// Generate flashcards from article content
function generateFlashcards(article: any, apiKey: string): Promise<Flashcard[]> {
  return new Promise((resolve, reject) => {
    fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a flashcard generator. Generate 10 high-quality flashcards from the given article.
Each flashcard should have:
1. Question (clear and specific)
2. Answer (concise but complete)
3. Difficulty level (1-5: 1=Very Easy, 3=Medium, 5=Very Hard)
4. Tags (relevant topics)
Format as JSON array of objects with these fields:
{
  "question": "string",
  "answer": "string",
  "type": "qa",
  "difficulty": 1-5,
  "tags": ["string"]
}

Only return the JSON array, nothing else.`
          },
          {
            role: 'user',
            content: `Article Title: ${article.title}\n\nArticle Content:\n${article.content.substring(0, 5000)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })
    .then(response => response.json())
    .then(data => {
      try {
        const flashcards = JSON.parse(data.choices[0].message.content)
        resolve(flashcards)
      } catch (error) {
        reject(new Error('Failed to parse flashcard data'))
      }
    })
    .catch(reject)
  })
}

// Show UI
function showUI(flashcards: Flashcard[]) {
  const existingUI = document.getElementById('flashcards-ui')
  if (existingUI) {
    existingUI.remove()
  }

  const container = document.createElement('div')
  container.id = 'flashcards-ui'
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    z-index: 2147483647;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `

  const header = document.createElement('div')
  header.style.cssText = `
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `
  header.innerHTML = `
    <h2 style="margin: 0; font-size: 18px; font-weight: 600;">📖 Generated Flashcards</h2>
    <button id="close-ui" style="background: none; border: none; color: white; cursor: pointer; font-size: 24px; padding: 0; margin: 0;">×</button>
  `

  const content = document.createElement('div')
  content.style.cssText = `
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  `

  flashcards.forEach((flashcard, index) => {
    const card = document.createElement('div')
    card.style.cssText = `
      margin-bottom: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    `

    const question = document.createElement('h3')
    question.style.cssText = 'margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;'
    question.textContent = flashcard.question

    const answer = document.createElement('p')
    answer.style.cssText = 'margin: 0; font-size: 14px; color: #6b7280;'
    answer.textContent = flashcard.answer

    const tags = document.createElement('div')
    tags.style.cssText = 'margin-top: 12px; display: flex; gap: 8px;'
    flashcard.tags.forEach(tag => {
      const tagEl = document.createElement('span')
      tagEl.style.cssText = `
        padding: 4px 8px;
        background: #e5e7eb;
        border-radius: 4px;
        font-size: 12px;
        color: #6b7280;
      `
      tagEl.textContent = tag
      tags.appendChild(tagEl)
    })

    card.appendChild(question)
    card.appendChild(answer)
    card.appendChild(tags)
    content.appendChild(card)
  })

  const footer = document.createElement('div')
  footer.style.cssText = `
    padding: 16px 20px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  `

  const closeButton = document.createElement('button')
  closeButton.id = 'close-ui-btn'
  closeButton.style.cssText = `
    padding: 10px 24px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  `
  closeButton.textContent = 'Close'

  const downloadButton = document.createElement('button')
  downloadButton.style.cssText = `
    padding: 10px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  `
  downloadButton.textContent = 'Download as CSV'

  footer.appendChild(downloadButton)
  footer.appendChild(closeButton)

  container.appendChild(header)
  container.appendChild(content)
  container.appendChild(footer)
  document.body.appendChild(container)

  // Close button handler
  document.getElementById('close-ui')?.addEventListener('click', () => container.remove())
  document.getElementById('close-ui-btn')?.addEventListener('click', () => container.remove())

  // Download button handler
  downloadButton.addEventListener('click', () => {
    const csv = generateCSV(flashcards)
    downloadCSV(csv, 'flashcards.csv')
  })
}

function generateCSV(flashcards: Flashcard[]): string {
  const headers = ['Question', 'Answer', 'Difficulty', 'Tags']
  const rows = flashcards.map(card => [
    `"${card.question.replace(/"/g, '""')}"`,
    `"${card.answer.replace(/"/g, '""')}"`,
    card.difficulty,
    `"${card.tags.join(', ')}"`
  ])

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// Main execution
async function main() {
  try {
    // Wait for content to load
    const hasContent = await waitForContent()
    if (!hasContent) {
      console.log('No article content detected')
      return
    }

    // Extract article content
    const article = extractArticleContent()

    // Get API key
    const result = await new Promise<{ openrouter_api_key: string }>((resolve) => {
      chrome.runtime.sendMessage({ action: 'GET_API_KEYS' }, (response) => {
        resolve(response || { openrouter_api_key: '' })
      })
    })

    if (!result.openrouter_api_key) {
      // No API key - show error message
      const existingError = document.getElementById('flashcards-error')
      if (!existingError) {
        const errorDiv = document.createElement('div')
        errorDiv.id = 'flashcards-error'
        errorDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          z-index: 2147483647;
          padding: 24px;
        `
        errorDiv.innerHTML = `
          <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1f2937;">⚠️ No API Key</h2>
          <p style="margin: 0 0 20px 0; color: #6b7280;">Please set your OpenRouter API key in the extension settings.</p>
          <button id="open-settings" style="
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">Open Settings</button>
        `
        document.body.appendChild(errorDiv)

        document.getElementById('open-settings')?.addEventListener('click', () => {
          chrome.runtime.openOptionsPage()
          errorDiv.remove()
        })
      }
      return
    }

    // Generate flashcards
    const flashcards = await generateFlashcards(article, result.openrouter_api_key)

    // Save flashcards
    for (const flashcard of flashcards) {
      flashcard.id = crypto.randomUUID()
      flashcard.sourceUrl = article.url
      flashcard.sourceTitle = article.title
      flashcard.createdAt = new Date().toISOString()
      flashcard.schedule = calculateSchedule(5) // Default difficulty 5

      chrome.runtime.sendMessage({ action: 'SAVE_FLASHCARD', flashcard }, (response) => {
        if (response?.error) {
          console.error('Failed to save flashcard:', response.error)
        }
      })
    }

    // Show UI
    showUI(flashcards)

  } catch (error) {
    console.error('Error in content script:', error)
  }
}

// Calculate schedule using SM-2 algorithm
function calculateSchedule(difficulty: number): {
  nextReview: string
  interval: number
  repetition: number
  easeFactor: number
} {
  const easinessFactor = 2.5
  const interval = 1
  const repetition = 0

  return {
    nextReview: new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString(),
    interval,
    repetition,
    easeFactor
  }
}

// Start main function when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main)
} else {
  main()
}
