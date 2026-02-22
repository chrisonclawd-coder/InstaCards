# Privacy Policy

**Article-to-Flashcards**
**Version:** 1.0.0
**Last Updated:** February 22, 2026

---

## Introduction

We value your privacy and are committed to protecting your personal data. This privacy policy explains how our Chrome extension collects, uses, and safeguards your information.

**Effective Date:** February 22, 2026
**App Name:** Article-to-Flashcards
**App ID:** kimahdiiopfklhcciaiknnfcobamjeki

---

## 1. Information We Collect

### 1.1 Local Storage Data
We only store data locally on your device using the following methods:

- **IndexedDB:** Stores flashcards you create
  - Question and answer text
  - Difficulty level
  - Tags
  - Schedule for spaced repetition
  - Source URL of the article

- **Chrome Storage API:** Stores your preferences
  - OpenRouter API key
  - User settings

### 1.2 No Data Collection
**We do NOT collect:**
- ✅ No user accounts or sign-ups
- ✅ No personal identifiable information (PII)
- ✅ No usage analytics or tracking
- ✅ No analytics or telemetry
- ✅ No third-party cookies
- ✅ No sale of your data

### 1.3 API Calls
When you use the extension, it may make the following API calls:

**OpenRouter API:**
- **Purpose:** Generate flashcards using AI
- **Data sent:** Article title and content (truncated to 5000 characters)
- **Data received:** Flashcards (question, answer, tags)
- **Key stored:** Your OpenRouter API key (stored locally in Chrome storage)
- **Example call:** `POST https://api.openrouter.ai/api/v1/chat/completions`

**No other external API calls are made.**

---

## 2. How We Use Your Data

### 2.1 Local Data Usage
Data stored in IndexedDB and Chrome storage is used for:

- **Flashcard storage:** Save generated flashcards locally
- **Spaced repetition:** Track when to review flashcards
- **Progress tracking:** Show statistics (total flashcards, review queue)
- **Export functionality:** Generate CSV files for your use

### 2.2 API Usage
Your OpenRouter API key is used **only** to:
- Authenticate with OpenRouter API
- Generate flashcards from article content
- **Never** shared with any third party except OpenRouter

### 2.3 No Data Sharing
We do not share your data with:
- ✅ Advertisers
- ✅ Third-party companies
- ✅ Marketing partners
- ✅ Data brokers

---

## 3. Data Security

### 3.1 Local Storage Security
- **Chrome Storage:** Data is encrypted by Chrome's storage system
- **IndexedDB:** Data is stored locally on your device
- **No cloud sync:** Your data stays on your device

### 3.2 API Key Security
- **Local storage only:** Your API key is never sent to our servers
- **Encrypted:** Chrome encrypts local storage data
- **Access:** Only accessible by this extension

### 3.3 Content Security Policy
- The extension uses a strict Content Security Policy
- No eval() or dangerous JavaScript execution
- Sanitized input handling

---

## 4. User Controls

### 4.1 Manage Your Data
You can control your data by:

- **View flashcards:** Click the extension icon to see your flashcards
- **Export flashcards:** Download as CSV at any time
- **Delete flashcards:** Use the settings page to delete all flashcards
- **Remove API key:** Delete your OpenRouter API key in settings

### 4.2 Delete Data Completely
To delete all data:
1. Open the extension settings
2. Click "Clear All Flashcards"
3. Confirm deletion

To uninstall the extension:
- Go to `chrome://extensions`
- Find "Article-to-Flashcards"
- Click "Remove"

This will delete all stored data.

---

## 5. Third-Party Services

### 5.1 OpenRouter API
- **Service:** https://openrouter.ai
- **Purpose:** AI-powered flashcard generation
- **Data sent:** Article title and content (5000 char limit)
- **Data received:** Flashcard data (question, answer, tags)
- **Data stored:** None (temporary during API call)
- **Privacy Policy:** https://openrouter.ai/privacy

### 5.2 No Third-Party Cookies
We do not use third-party cookies or tracking pixels.

---

## 6. Children's Privacy

This extension is **not** designed for children under 13 years of age. We do not knowingly collect personal information from children.

If you believe we have inadvertently collected information from a child under 13, please contact us.

---

## 7. Your Rights

Under applicable data protection laws (GDPR, CCPA, etc.), you have the right to:

- **Access** your data
- **Correct** inaccurate data
- **Delete** your data
- **Object** to processing (data deletion)
- **Portability:** Export your data (CSV export)

---

## 8. Changes to This Privacy Policy

We may update this privacy policy periodically. We will notify you of any changes by:

- Updating the "Last Updated" date
- Releasing a new version of the extension

We recommend reviewing this policy periodically.

---

## 9. Contact Us

If you have questions about this privacy policy:

**Email:** [your-email@example.com]

**Chrome Web Store:** https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki

**GitHub:** [repository-url]/issues

---

## 10. Data Retention

- **Flashcards:** Stored until you delete them
- **API key:** Stored until you delete it
- **Settings:** Stored until you delete them
- **No automatic deletion:** We do not automatically delete your data

---

## 11. Compliance

This extension complies with:

- **Google Chrome Web Store Policies**
- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **CCPA** (California Privacy Rights Act)

---

## 12. Acknowledgments

### Data Sources

- **Article content:** Extracted from webpages you visit
- **Flashcards:** Generated by OpenRouter API using GPT-4
- **Schedule:** Calculated using SM-2 algorithm

### Third-Party Libraries

- **OpenRouter API:** https://openrouter.ai
- **IndexedDB:** W3C Web Standards
- **Chrome Storage API:** Google Chrome

---

## 13. Statement

**We do not sell your data.** Our only revenue comes from potential future subscription model (optional Pro features), which would be free for basic use.

**Your data stays on your device.** We never collect, store, or share your personal information.

---

**Last Updated:** February 22, 2026
**Version:** 1.0.0
**App ID:** kimahdiiopfklhcciaiknnfcobamjeki

---

**By using this extension, you agree to the terms of this privacy policy.**