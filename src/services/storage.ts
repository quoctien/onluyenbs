import { Quiz, Student, QuizSubmission, CurrentUser } from '../types';
import { INITIAL_QUIZZES, INITIAL_STUDENTS, INITIAL_CLASSES, INITIAL_SUBMISSIONS } from '../mockData';

const QUIZZES_KEY = 'quizmaster_quizzes_v1';
const STUDENTS_KEY = 'quizmaster_students_v1';
const CLASSES_KEY = 'quizmaster_classes_v1';
const SUBMISSIONS_KEY = 'quizmaster_submissions_v1';
const USER_KEY = 'quizmaster_current_user_v1';

export const StorageService = {
  getQuizzes(): Quiz[] {
    const data = localStorage.getItem(QUIZZES_KEY);
    if (!data) {
      localStorage.setItem(QUIZZES_KEY, JSON.stringify(INITIAL_QUIZZES));
      return INITIAL_QUIZZES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_QUIZZES;
    }
  },

  saveQuizzes(quizzes: Quiz[]): void {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  },

  getStudents(): Student[] {
    const data = localStorage.getItem(STUDENTS_KEY);
    if (!data) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  },

  getClasses(): string[] {
    const data = localStorage.getItem(CLASSES_KEY);
    if (!data) {
      localStorage.setItem(CLASSES_KEY, JSON.stringify(INITIAL_CLASSES));
      return INITIAL_CLASSES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CLASSES;
    }
  },

  saveClasses(classes: string[]): void {
    localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
  },

  getSubmissions(): QuizSubmission[] {
    const data = localStorage.getItem(SUBMISSIONS_KEY);
    if (!data) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  saveSubmissions(submissions: QuizSubmission[]): void {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  },

  getCurrentUser(): CurrentUser {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return { role: null };
    try {
      return JSON.parse(data);
    } catch {
      return { role: null };
    }
  },

  saveCurrentUser(user: CurrentUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout(): void {
    localStorage.removeItem(USER_KEY);
  }
};
