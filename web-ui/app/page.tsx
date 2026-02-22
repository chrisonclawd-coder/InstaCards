'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

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
      { id: '1-6', name: 'Build Project Dashboard UI', description: 'Main page showing task list, progress, and metrics', status: 'in-progress', priority: 'high', progress: 30, projectId: '1' },
      { id: '1-7', name: 'Implement Task Filtering & Search', description: 'Filter by status, priority, search by name', status: 'todo', priority: 'medium', progress: 0, projectId: '1' },
      { id: '1-8', name: 'Add Progress Visualization', description: 'Progress bars, circular charts, completion rates', status: 'todo', priority: 'medium', progress: 0, projectId: '1' },
      { id: '1-9', name: 'Deploy to Staging', description: 'Deploy to Vercel staging environment', status: 'todo', priority: 'high', progress: 0, projectId: '1' },
      { id: '1-10', name: 'Create Real Icon Files', description: 'Design and create professional PNG icons', status: 'todo', priority: 'medium', progress: 0, projectId: '1' },
      { id: '1-11', name: 'Test Extension Thoroughly', description: 'Test on real websites, verify API key handling', status: 'todo', priority: 'high', progress: 0, projectId: '1' },
      { id: '1-12', name: 'Submit to Chrome Web Store', description: 'Prepare for submission and launch', status: 'todo', priority: 'high', progress: 0, projectId: '1' },
    ],
    totalTasks: 12,
    completedTasks: 5,
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
    name: 'Personal Blog',
    description: 'Build and grow personal blog with content strategy',
    status: 'paused',
    icon: '📝',
    tasks: [
      { id: '3-1', name: 'Define Content Strategy', description: 'Identify niche, topics, and posting schedule', status: 'done', priority: 'high', progress: 100, projectId: '3' },
      { id: '3-2', name: 'Set Up WordPress/Ghost', description: 'Choose platform and configure hosting', status: 'done', priority: 'high', progress: 100, projectId: '3' },
      { id: '3-3', name: 'Design Theme', description: 'Create custom theme or choose template', status: 'todo', priority: 'medium', progress: 0, projectId: '3' },
      { id: '3-4', name: 'Write First 10 Posts', description: 'Prepare content for launch', status: 'todo', priority: 'high', progress: 0, projectId: '3' },
      { id: '3-5', name: 'Setup SEO', description: 'Configure sitemap, meta tags, and keywords', status: 'todo', priority: 'medium', progress: 0, projectId: '3' },
    ],
    totalTasks: 5,
    completedTasks: 2,
    startDate: '2026-02-20',
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

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  const getAllTasks = (): Task[] => {
    return projects.flatMap(project => project.tasks)
  }

  const selectedProjectData = selectedProject === 'all'
    ? projects
    : projects.filter(p => p.id === selectedProject)

  const filteredTasks = getAllTasks().filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const totalProgress = getAllTasks().reduce((sum, task) => sum + task.progress, 0) / getAllTasks().length

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">📊 Project Dashboard</h1>
          <p className="text-xl text-gray-400">Track all your projects in one place</p>
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

        {/* Project Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedProject('all')}
              className={`p-6 rounded-xl border-2 transition ${
                selectedProject === 'all'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="text-3xl mb-2">📁</div>
              <div className="font-bold text-lg">All Projects</div>
              <div className="text-gray-400 text-sm">
                {getAllTasks().length} total tasks
              </div>
            </button>

            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`p-6 rounded-xl border-2 transition ${
                  selectedProject === project.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="text-3xl mb-2">{project.icon}</div>
                <div className="font-bold text-lg">{project.name}</div>
                <div className="text-gray-400 text-sm">{project.description}</div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{project.completedTasks}/{project.totalTasks}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
          >
            <div className="text-4xl font-bold mb-2">{projects.filter(p => p.status === 'active').length}</div>
            <div className="text-gray-400">Active Projects</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
          >
            <div className="text-4xl font-bold mb-2">{getAllTasks().filter(t => t.status === 'done').length}</div>
            <div className="text-gray-400">Tasks Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
          >
            <div className="text-4xl font-bold mb-2 text-blue-500">{totalProgress.toFixed(0)}%</div>
            <div className="text-gray-400">Overall Progress</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
          >
            <div className="text-4xl font-bold mb-2">{getAllTasks().length}</div>
            <div className="text-gray-400">Total Tasks</div>
          </motion.div>
        </div>

        {/* Task List */}
        {selectedProject === 'all' ? (
          /* Show all projects */
          <div className="space-y-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Project Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{project.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{project.name}</h2>
                      <p className="text-gray-400 text-sm">{project.description}</p>
                    </div>
                    <div className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${projectStatusColors[project.status]}`}>
                      {project.status}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>{project.completedTasks}/{project.totalTasks} tasks completed</span>
                      <span>{((project.completedTasks / project.totalTasks) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${project.completedTasks === project.totalTasks ? 'bg-green-500' : project.completedTasks >= project.totalTasks * 0.5 ? 'bg-blue-500' : 'bg-gray-500'}`}
                        style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Project Tasks */}
                <div className="grid gap-3">
                  {project.tasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`w-3 h-3 rounded-full ${statusColors[task.status]}`} />
                            <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
                              {task.priority.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">{task.status}</span>
                          </div>

                          <h3 className="text-lg font-bold mb-2">{task.name}</h3>
                          <p className="text-gray-400 text-sm">{task.description}</p>
                        </div>

                        {task.progress === 100 && (
                          <span className="text-green-500 text-3xl">✅</span>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
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
            ))}
          </div>
        ) : (
          /* Show filtered tasks for selected project */
          <div className="space-y-4">
            {filteredTasks.map((task, index) => {
              const project = projects.find(p => p.id === task.projectId)
              return (
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
                        <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">{task.status}</span>
                      </div>

                      <h3 className="text-lg font-bold mb-2">{task.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{task.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>Project: {project?.icon} {project?.name}</span>
                      </div>
                    </div>

                    {task.progress === 100 && (
                      <span className="text-green-500 text-3xl">✅</span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${task.progress === 100 ? 'bg-green-500' : task.progress >= 50 ? 'bg-blue-500' : 'bg-gray-500'}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>Project Dashboard • Track all your projects in one place</p>
          <p className="text-sm mt-2">Made with ❤️ for productivity</p>
        </div>
      </div>
    </div>
  )
}
