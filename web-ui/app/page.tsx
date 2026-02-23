'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Settings, LogOut } from 'lucide-react'

interface Task {
  id: string
  name: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  progress: number
  projectId: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'completed'
  icon: string
  tasks: Task[]
  totalTasks: number
  completedTasks: number
  startDate: string
  deadline?: string
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Article-to-Flashcards',
    description: 'AI-powered flashcard generator for any webpage',
    status: 'active',
    icon: '📖',
    tasks: [
      { id: '1-1', name: 'Create Project Repository Structure', description: 'Set up folder structure, dependencies, and configuration files', status: 'done', priority: 'high', progress: 100, projectId: '1' },
      { id: '1-2', name: 'Write README.md', description: 'Project overview, features, and getting started guide', status: 'done', priority: 'high', progress: 100, projectId: '1' },
      { id: '1-3', name: 'Document Architecture', description: 'ARCHITECTURE.md with system overview, components, data models', status: 'done', priority: 'high', progress: 100, projectId: '1' },
      { id: '1-4', name: 'Document Technical Decisions', description: 'TECHNICAL-DECISIONS.md with rationale for each choice', status: 'done', priority: 'medium', progress: 100, projectId: '1' },
      { id: '1-5', name: 'Set Up Environment Variables', description: '.env.example with all required API keys and configs', status: 'done', priority: 'medium', progress: 100, projectId: '1' },
      { id: '1-6', name: 'Build Project Dashboard UI', description: 'Main page showing task list, progress, and metrics', status: 'in-progress', priority: 'high', progress: 70, projectId: '1' },
      { id: '1-7', name: 'Implement Task Filtering & Search', description: 'Filter by status, priority, search by name', status: 'done', priority: 'medium', progress: 100, projectId: '1' },
      { id: '1-8', name: 'Add Progress Visualization', description: 'Progress bars, circular charts, completion rates', status: 'done', priority: 'medium', progress: 100, projectId: '1' },
      { id: '1-9', name: 'Deploy to Staging', description: 'Deploy to Vercel staging environment', status: 'todo', priority: 'high', progress: 0, projectId: '1' },
      { id: '1-10', name: 'Create Real Icon Files', description: 'Design and create professional PNG icons', status: 'todo', priority: 'medium', progress: 0, projectId: '1' },
      { id: '1-11', name: 'Test Extension Thoroughly', description: 'Test on real websites, verify API key handling', status: 'todo', priority: 'high', progress: 0, projectId: '1' },
      { id: '1-12', name: 'Submit to Chrome Web Store', description: 'Prepare for submission and launch', status: 'todo', priority: 'high', progress: 0, projectId: '1' },
    ],
    totalTasks: 12,
    completedTasks: 7,
    startDate: '2026-02-21',
    deadline: '2026-03-01',
  },
  {
    id: '2',
    name: 'X Strategy',
    description: '4x daily Twitter/X engagement strategy',
    status: 'active',
    icon: '🐦',
    tasks: [
      { id: '2-1', name: 'Morning Session (10am IST)', description: 'Engage with 10 posts + post 1 trending topic', status: 'done', priority: 'high', progress: 100, projectId: '2' },
      { id: '2-2', name: 'Afternoon Session (3pm IST)', description: 'Engage with 10 posts on trending tech topics', status: 'in-progress', priority: 'high', progress: 50, projectId: '2' },
      { id: '2-3', name: 'Evening Session (6pm IST)', description: 'Engage with 10 posts + post 1 trending topic', status: 'todo', priority: 'high', progress: 0, projectId: '2' },
      { id: '2-4', name: 'Night Session (9pm IST)', description: 'Engage with 10 posts + growth insights', status: 'todo', priority: 'medium', progress: 0, projectId: '2' },
    ],
    totalTasks: 4,
    completedTasks: 1,
    startDate: '2026-02-21',
  },
  {
    id: '3',
    name: 'Bookmarks',
    description: 'Manage and organize important links and resources',
    status: 'active',
    icon: '🔖',
    tasks: [
      { id: '3-1', name: 'Set Up Bookmarks Categories', description: 'Create folders for Work, Learning, Tools, Inspiration', status: 'done', priority: 'high', progress: 100, projectId: '3' },
      { id: '3-2', name: 'Add Key Bookmarks', description: 'Add most important links first', status: 'in-progress', priority: 'high', progress: 50, projectId: '3' },
      { id: '3-3', name: 'Organize by Category', description: 'Sort bookmarks into appropriate folders', status: 'todo', priority: 'medium', progress: 0, projectId: '3' },
      { id: '3-4', name: 'Add Descriptions', description: 'Include brief descriptions for each bookmark', status: 'todo', priority: 'medium', progress: 0, projectId: '3' },
    ],
    totalTasks: 4,
    completedTasks: 1,
    startDate: '2026-02-23',
    deadline: '2026-02-28',
  },
]

const statusColors = {
  'todo': 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500',
}

const priorityColors = {
  low: 'text-gray-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
}

const projectStatusColors = {
  'active': 'bg-green-500',
  'paused': 'bg-yellow-500',
  'completed': 'bg-gray-500',
}

const priorityBadges = {
  high: 'bg-red-500/20 text-red-400 border border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  low: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
}

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const getAllTasks = (): Task[] => {
    return projects.flatMap(project => project.tasks)
  }

  const getFilteredTasksForProject = (projectId: string): Task[] => {
    return projects
      .find(p => p.id === projectId)!
      .tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              task.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
        return matchesSearch && matchesStatus && matchesPriority
      })
  }

  const totalProgress = getAllTasks().reduce((sum, task) => sum + task.progress, 0) / getAllTasks().length

  const getProgressPercentage = (projectId: string): number => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return 0
    return (project.completedTasks / project.totalTasks) * 100
  }

  const getCircleProgress = (progress: number): number => {
    return 360 - (progress / 100) * 360
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed lg:static z-50 w-64 bg-gray-900 border-r border-gray-800 h-screen lg:h-auto lg:h-screen lg:flex lg:flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h1 className="text-lg font-bold">Dashboard</h1>
              <p className="text-gray-400 text-sm">Project Manager</p>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="p-4 space-y-1 overflow-y-auto flex-1">
          {/* All Projects */}
          <button
            onClick={() => {
              setSelectedProject('all')
              if (window.innerWidth < 1024) setIsSidebarOpen(false)
            }}
            className={`w-full p-3 rounded-lg text-left transition ${
              selectedProject === 'all'
                ? 'bg-blue-500/10 border-2 border-blue-500'
                : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">📁</div>
              <div className="flex-1">
                <div className="font-medium">All Projects</div>
                <div className="text-gray-400 text-xs">{getAllTasks().length} tasks</div>
              </div>
            </div>
          </button>

          {/* Individual Projects */}
          {projects.map(project => {
            const taskCount = project.tasks.length
            const completedCount = project.tasks.filter(t => t.status === 'done').length

            return (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProject(project.id)
                  if (window.innerWidth < 1024) setIsSidebarOpen(false)
                }}
                className={`w-full p-3 rounded-lg text-left transition ${
                  selectedProject === project.id
                    ? 'bg-blue-500/10 border-2 border-blue-500'
                    : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{project.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{project.name}</div>
                    <div className="text-gray-400 text-xs truncate">{completedCount}/{taskCount} done</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button className="w-full p-3 rounded-lg flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800 transition group">
            <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button className="w-full p-3 rounded-lg flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800 transition group">
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen transition-all duration-300 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-gray-900 border-b border-gray-800 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm">Project Manager</p>
          </div>
        </div>

        <div className="flex-1 p-6 lg:p-8 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name || 'Project'}
            </h1>
            <p className="text-lg text-gray-400">
              {selectedProject === 'all'
                ? 'Track all your projects in one place'
                : projects.find(p => p.id === selectedProject)?.description
              }
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-8 p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="🔍 Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-800"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-blue-500"
                      strokeDasharray={176}
                      strokeDashoffset={176 - (176 * (getAllTasks().filter(t => t.status === 'done').length / getAllTasks().length))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {getAllTasks().filter(t => t.status === 'done').length}
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">Tasks Done</div>
                  <div className="text-gray-400 text-sm">{getAllTasks().filter(t => t.status === 'done').length}/{getAllTasks().length}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-800"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-green-500"
                      strokeDasharray={176}
                      strokeDashoffset={176 - (176 * (totalProgress / 100))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-green-500">
                    {totalProgress.toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">Overall Progress</div>
                  <div className="text-gray-400 text-sm">{projects.filter(p => p.status === 'active').length} active projects</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-800"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-purple-500"
                      strokeDasharray={176}
                      strokeDashoffset={176 - (176 * (projects.filter(p => p.status === 'active').length / projects.length))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {projects.filter(p => p.status === 'active').length}
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">Active Projects</div>
                  <div className="text-gray-400 text-sm">{projects.length} total projects</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-800"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-yellow-500"
                      strokeDasharray={176}
                      strokeDashoffset={176}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {getAllTasks().length}
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">Total Tasks</div>
                  <div className="text-gray-400 text-sm">{getAllTasks().filter(t => t.status === 'in-progress').length} in progress</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Task List */}
          {selectedProject === 'all' ? (
            /* Show all projects with collapsible sections */
            <div className="space-y-6">
              {projects.map((project, index) => {
                const projectTasks = project.tasks.filter(task => {
                  const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        task.description.toLowerCase().includes(searchQuery.toLowerCase())
                  const matchesStatus = filterStatus === 'all' || task.status === filterStatus
                  const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
                  return matchesSearch && matchesStatus && matchesPriority
                })

                if (projectTasks.length === 0) return null

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-800 rounded-2xl bg-gray-900 overflow-hidden"
                  >
                    {/* Project Header */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-800">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                          {project.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">{project.name}</h2>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${projectStatusColors[project.status]} text-white`}>
                              {project.status}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm">{project.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-gray-800"
                              />
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className={project.completedTasks === project.totalTasks ? 'text-green-500' : project.completedTasks >= project.totalTasks * 0.5 ? 'text-blue-500' : 'text-gray-500'}
                                strokeDasharray={126}
                                strokeDashoffset={126 - (126 * (project.completedTasks / project.totalTasks))}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                              {((project.completedTasks / project.totalTasks) * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-bold">{((project.completedTasks / project.totalTasks) * 100).toFixed(0)}%</div>
                            <div className="text-sm text-gray-400">{project.completedTasks}/{project.totalTasks} tasks</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Progress Bar */}
                    <div className="px-6 pb-4">
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${project.completedTasks === project.totalTasks ? 'bg-green-500' : project.completedTasks >= project.totalTasks * 0.5 ? 'bg-blue-500' : 'bg-gray-500'}`}
                          style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Tasks */}
                    <div className="px-6 pb-6 space-y-3">
                      {projectTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className={`w-2.5 h-2.5 rounded-full ${statusColors[task.status]}`} />
                                <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${priorityBadges[task.priority]}`}>
                                  {task.priority}
                                </span>
                                <span className={`text-xs text-gray-500 capitalize ${task.status === 'done' ? 'text-green-500 font-medium' : ''}`}>
                                  {task.status.replace('-', ' ')}
                                </span>
                              </div>

                              <h3 className="text-base font-semibold mb-1">{task.name}</h3>
                              <p className="text-gray-400 text-sm">{task.description}</p>
                            </div>

                            {task.status === 'done' && (
                              <span className="text-green-500 text-2xl flex-shrink-0">✅</span>
                            )}
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                              <span>Progress</span>
                              <span className={task.progress === 100 ? 'text-green-500 font-medium' : ''}>{task.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${task.progress === 100 ? 'bg-green-500' : task.progress >= 50 ? 'bg-blue-500' : 'bg-gray-500'}`}
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            /* Show filtered tasks for selected project */
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-3xl">
                      {projects.find(p => p.id === selectedProject)?.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {projects.find(p => p.id === selectedProject)?.name}
                      </h2>
                      <p className="text-gray-400 text-sm mb-2">
                        {projects.find(p => p.id === selectedProject)?.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${projectStatusColors[projects.find(p => p.id === selectedProject)?.status || 'active']}`}>
                          {projects.find(p => p.id === selectedProject)?.status}
                        </span>
                        <span className="text-sm text-gray-400">
                          {getFilteredTasksForProject(selectedProject).length}/{projects.find(p => p.id === selectedProject)?.totalTasks} tasks
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="transparent"
                          className="text-gray-800"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="transparent"
                          className={getProgressPercentage(selectedProject) === 100 ? 'text-green-500' : getProgressPercentage(selectedProject) >= 50 ? 'text-blue-500' : 'text-gray-500'}
                          strokeDasharray={214}
                          strokeDashoffset={214 - (214 * (getProgressPercentage(selectedProject) / 100))}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                        {getProgressPercentage(selectedProject).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Project Progress</span>
                    <span>{getProgressPercentage(selectedProject).toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressPercentage(selectedProject) === 100 ? 'bg-green-500' : getProgressPercentage(selectedProject) >= 50 ? 'bg-blue-500' : 'bg-gray-500'}`}
                      style={{ width: `${getProgressPercentage(selectedProject)}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              {getFilteredTasksForProject(selectedProject).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-3 h-3 rounded-full ${statusColors[task.status]}`} />
                        <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${priorityBadges[task.priority]}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`text-sm text-gray-500 capitalize ${task.status === 'done' ? 'text-green-500 font-medium' : ''}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2">{task.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{task.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>Progress</span>
                        <span className={task.progress === 100 ? 'text-green-500 font-medium' : ''}>{task.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${task.progress === 100 ? 'bg-green-500' : task.progress >= 50 ? 'bg-blue-500' : 'bg-gray-500'}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    {task.status === 'done' && (
                      <span className="text-green-500 text-3xl">✅</span>
                    )}
                  </div>
                </motion.div>
              ))}
              {getFilteredTasksForProject(selectedProject).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>No tasks found for this project</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500">
            <p>Project Dashboard • Track all your projects in one place</p>
            <p className="text-sm mt-2">Made with ❤️ for productivity</p>
          </div>
        </div>
      </div>
    </div>
  )
}
