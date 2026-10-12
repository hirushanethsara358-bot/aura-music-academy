export type CurriculumLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CurriculumCategory =
  | 'music-foundations'
  | 'music-theory'
  | 'composition'
  | 'arrangement'
  | 'production'
  | 'audio-engineering'
  | 'mixing'
  | 'mastering'
  | 'advanced-practice';

export interface LessonSection {
  id: string;
  headingSi: string;
  headingEn: string;
  bodySi: string;
  /** Optional glossary terms attached to this section. */
  keyTerms?: Array<{
    termEn: string;
    termSi: string;
    definitionSi: string;
  }>;
  formulaOrDiagram?: string;
  bulletPointsSi?: string[];
}

export interface LessonExample {
  id: string;
  titleSi: string;
  titleEn: string;
  descriptionSi: string;
  notationOrSteps: string;
  synthPreviewNotes?: number[]; // MIDI numbers for runtime Web Audio synthesis
  synthType?: 'melody' | 'chord';
}

export interface PracticalExercise {
  id: string;
  titleSi: string;
  instructionsSi: string;
  stepsSi: string[];
  linkedLabTab?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  courseId: string;
  titleSi: string;
  titleEn: string;
  descriptionSi: string;
  category: CurriculumCategory;
  level: CurriculumLevel;
  prerequisites: string[]; // lesson slugs
  estimatedMinutes: number;
  learningObjectives: string[];
  sections: LessonSection[];
  examples: LessonExample[];
  exercises: PracticalExercise[];
  exerciseIds: string[];
  quizIds: string[];
  summarySi: string;
  furtherPracticeSi: string[];
  published: boolean;
  order: number;
  updatedAt: string;
}

export interface Course {
  id: string;
  slug: string;
  titleSi: string;
  titleEn: string;
  descriptionSi: string;
  category: CurriculumCategory;
  level: CurriculumLevel;
  lessonIds: string[];
  plannedTotalLessons: number;
  outcomesSi: string[];
  published: boolean;
  order: number;
  updatedAt: string;
}

export type QuestionType =
  | 'single-choice'
  | 'multiple-choice'
  | 'note-identification'
  | 'chord-identification'
  | 'interval-identification'
  | 'rhythm-recognition'
  | 'numeric'
  | 'checklist';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  promptSi: string;
  promptEn: string;
  options?: Array<{
    id: string;
    labelSi: string;
    labelEn?: string;
  }>;
  correctOptionId?: string;
  correctOptionIds?: string[];
  correctNumber?: number;
  numericTolerance?: number;
  numericUnit?: string;
  checklistItems?: Array<{
    id: string;
    labelSi: string;
  }>;
  audioPreviewMidi?: number[];
  audioPreviewMode?: 'single' | 'interval' | 'chord' | 'rhythm';
  explanationSi: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  titleSi: string;
  titleEn: string;
  descriptionSi: string;
  passingPercentage: number;
  questions: QuizQuestion[];
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  uid: string;
  quizId: string;
  lessonId: string;
  answers: Record<string, string | string[] | number>;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  createdAt: string;
}

export interface LessonProgress {
  uid: string;
  lessonId: string;
  completed: boolean;
  lastVisitedAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface BookmarkItem {
  uid: string;
  lessonId: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  lastVisitedLessonSlug: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GlossaryTerm {
  id: string;
  termEn: string;
  termSi: string;
  category: CurriculumCategory;
  definitionSi: string;
  exampleSi: string;
}
