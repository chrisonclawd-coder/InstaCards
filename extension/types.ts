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

export interface ReviewCard {
  flashcard: Flashcard
  quality: number // 0-5: 0-1=Forgot, 2-3=Hard, 4-5=Good
  nextReviewDate: string
}
