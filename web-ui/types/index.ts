export interface Task {
  id: string
  name: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  progress: number
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'in-progress' | 'review' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  type: 'qa' | 'multiple-choice'
  options?: string[]
  correctAnswer?: number
  difficulty: 1 | 2 | 3 | 4 | 5
  tags: string[]
  sourceUrl: string
  sourceTitle: string
  createdAt: string
  schedule: {
    nextReview: string
    interval: number
    repetition: number
    easeFactor: number
  }
}
