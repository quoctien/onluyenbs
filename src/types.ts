export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_in_blank';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[]; // for multiple_choice (4 options)
  correctAnswer: number | boolean | string; // index 0-3 for multiple_choice, boolean for true_false, string for fill_in_blank
  explanation?: string;
  points?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  durationMinutes: number;
  passingScore: number;
  totalQuestionsToTake: number; // Random subset count (e.g., 15 out of 30)
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  assignedClasses: string[]; // e.g. ['10A1', '10A2'] or ['ALL']
  startDate: string; // ISO string
  endDate: string; // ISO string
  questions: Question[]; // Question bank
  createdAt: string;
  createdBy: string;
}

export interface Student {
  id: string; // student code / username (e.g., 'HS001')
  name: string;
  className: string; // e.g., '10A1'
  password: string; // PIN or password
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  className: string;
  answers: Record<string, any>; // questionId -> student answer
  score: number; // out of 10
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  submittedAt: string;
  status: 'completed' | 'in_progress';
  selectedQuestionIds: string[]; // Randomized questions assigned to this student attempt
}

export type UserRole = 'admin' | 'student' | null;

export interface CurrentUser {
  role: UserRole;
  student?: Student;
  adminName?: string;
}
