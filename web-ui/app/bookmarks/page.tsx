'use client'

import { motion } from 'framer-motion'
import { Folder, Link as LinkIcon, Search, BookOpen } from 'lucide-react'

interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  category: string
  notes?: string
  addedDate: string
}

const categories = [
  'all',
  'work',
  'learning',
  'tools',
  'inspiration'
]

const bookmarks: Bookmark[] = [
  // Work
  {
    id: '1',
    title: 'Project Manager Dashboard',
    url: 'https://web-ui-jade.vercel.app',
    description: 'Project management and X Strategy tracking',
    category: 'work',
    notes: 'Main dashboard for tracking all projects',
    addedDate: '2026-02-20'
  },
  {
    id: '2',
    title: 'Project Manager Repo',
    url: 'https://github.com/chrisonclawd-coder/project-manager.git',
    description: 'Source code for Project Manager',
    category: 'work',
    notes: 'Stores session templates and metrics',
    addedDate: '2026-02-20'
  },
  {
    id: '3',
    title: 'Article-to-Flashcards',
    url: 'https://web-ui-jade.vercel.app',
    description: 'Flashcard generator app',
    category: 'work',
    notes: 'AI-powered flashcard creation from any webpage',
    addedDate: '2026-02-20'
  },
  {
    id: '4',
    title: 'InstaCards Repo',
    url: 'https://github.com/chrisonclawd-coder/InstaCards.git',
    description: 'Source code for Article-to-Flashcards',
    category: 'work',
    notes: 'Chrome extension + Web UI',
    addedDate: '2026-02-20'
  },
  // Learning
  {
    id: '5',
    title: 'Exa Web Search Docs',
    url: 'https://docs.exa.ai',
    description: 'AI-optimized web search API documentation',
    category: 'learning',
    notes: 'Used for X Strategy research',
    addedDate: '2026-02-23'
  },
  {
    id: '6',
    title: 'Twitter Algorithm Optimizer',
    url: 'https://github.com/chrisonclawd-coder',
    description: 'X Strategy post optimization skill',
    category: 'learning',
    notes: 'Provides tweet templates and engagement strategies',
    addedDate: '2026-02-23'
  },
  // Tools
  {
    id: '7',
    title: 'OpenRouter API',
    url: 'https://openrouter.ai/api/docs',
    description: 'AI model API documentation',
    category: 'tools',
    notes: 'Used for extension AI flashcard generation',
    addedDate: '2026-02-23'
  },
  {
    id: '8',
    title: 'Next.js Docs',
    url: 'https://nextjs.org/docs',
    description: 'Next.js 14 documentation',
    category: 'tools',
    notes: 'Used for web UI development',
    addedDate: '2026-02-23'
  }
]

export default function BookmarksPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categoryCounts = {
    all: bookmarks.length,
    work: bookmarks.filter(b => b.category === 'work').length,
    learning: bookmarks.filter(b => b.category === 'learning').length,
    tools: bookmarks.filter(b => b.category === 'tools').length,
    inspiration: bookmarks.filter(b => b.category === 'inspiration').length
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">🔖 Bookmarks</h1>
          <p className="text-gray-400">Manage and organize your important links</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="text-3xl font-bold mb-2">{bookmarks.length}</div>
            <div className="text-gray-400">Total Bookmarks</div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="text-3xl font-bold mb-2 text-blue-500">4</div>
            <div className="text-gray-400">Categories</div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="text-3xl font-bold mb-2 text-green-500">8</div>
            <div className="text-gray-400">Bookmarks</div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="text-3xl font-bold mb-2 text-purple-500">0</div>
            <div className="text-gray-400">Bookmarked Today</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
                    : 'bg-gray-800 border-2 border-transparent hover:border-gray-700 text-gray-400'
                }`}
              >
                {category === 'all' ? '📁 All' : category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="ml-2 text-xs opacity-60">({categoryCounts[category as keyof typeof categoryCounts]})</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookmarks by title, description, or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
        </div>

        {/* Bookmarks Grid */}
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark, index) => (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <LinkIcon className="w-5 h-5 text-gray-400" />
                    <h3 className="text-xl font-bold">{bookmark.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{bookmark.description}</p>
                  {bookmark.notes && (
                    <p className="text-gray-500 text-xs mb-3 italic">"{bookmark.notes}"</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Folder className="w-4 h-4" />
                      {bookmark.category.charAt(0).toUpperCase() + bookmark.category.slice(1)}
                    </span>
                    <span>•</span>
                    <span>Added: {bookmark.addedDate}</span>
                  </div>
                </div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition font-medium whitespace-nowrap"
                >
                  Visit Link
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBookmarks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-medium mb-2">No bookmarks found</p>
            <p className="text-sm">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
