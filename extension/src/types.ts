// Type definitions for flashcards

export type FlashcardType = 'qa' | 'multiple-choice';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  type: FlashcardType;
  options?: string[];
  correctAnswer?: number;
  difficulty: number;
  tags: string[];
  metadata: {
    sourceUrl: string;
    sourceTitle: string;
    createdAt: string;
    updatedAt: string;
  };
  schedule: {
    nextReview: string;
    interval: number;
    repetition: number;
    easeFactor: number;
  };
}

export interface UserProgress {
  userId: string;
  totalFlashcards: number;
  masteredFlashcards: number;
  learningFlashcards: number;
  retentionRate: number;
  lastReviewDate: string;
  stats: {
    streak: number;
    totalReviews: number;
    averageAccuracy: number;
  };
}

export interface GenerateFlashcardsRequest {
  url: string;
  options?: {
    type?: FlashcardType;
    count?: number;
    includeMultipleChoice?: boolean;
  };
}

export interface GenerateFlashcardsResponse {
  flashcards: Flashcard[];
  article: {
    title: string;
    content: string;
    url: string;
  };
}

export interface SpacedRepetitionResult {
  easeFactor: number;
  interval: number;
  repetition: number;
}
