import React, { useState, useEffect } from 'react';
import { Quiz, Student, QuizSubmission, CurrentUser } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { QuizTaker } from './components/Student/QuizTaker';
import { QuizResult } from './components/Student/QuizResult';
import { GraduationCap, BookOpen, Shield, User, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(StorageService.getCurrentUser());
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => StorageService.getQuizzes());
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [classes, setClasses] = useState<string[]>(() => StorageService.getClasses());
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => StorageService.getSubmissions());

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Student workflow state
  const [activeQuizToTake, setActiveQuizToTake] = useState<Quiz | null>(null);
  const [activeSubmissionReview, setActiveSubmissionReview] = useState<{ quiz: Quiz; submission: QuizSubmission } | null>(null);

  // Save changes to storage
  useEffect(() => {
    StorageService.saveQuizzes(quizzes);
  }, [quizzes]);

  useEffect(() => {
    StorageService.saveStudents(students);
  }, [students]);

  useEffect(() => {
    StorageService.saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    StorageService.saveSubmissions(submissions);
  }, [submissions]);

  useEffect(() => {
    StorageService.saveCurrentUser(currentUser);
  }, [currentUser]);

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user);
    setActiveQuizToTake(null);
    setActiveSubmissionReview(null);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser({ role: null });
    setActiveQuizToTake(null);
    setActiveSubmissionReview(null);
  };

  // Admin actions
  const handleSaveQuiz = (quiz: Quiz) => {
    const exists = quizzes.some(q => q.id === quiz.id);
    if (exists) {
      setQuizzes(quizzes.map(q => q.id === quiz.id ? quiz : q));
    } else {
      setQuizzes([quiz, ...quizzes]);
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  const handleUpdateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
  };

  const handleUpdateClasses = (newClasses: string[]) => {
    setClasses(newClasses);
  };

  // Student finish quiz submission
  const handleFinishSubmission = (sub: QuizSubmission) => {
    const updated = [sub, ...submissions];
    setSubmissions(updated);
    const quiz = quizzes.find(q => q.id === sub.quizId);
    if (quiz) {
      setActiveQuizToTake(null);
      setActiveSubmissionReview({ quiz, submission: sub });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {!currentUser.role ? (
          /* Landing Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100 shadow-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Hệ thống Quản lý và Thi Trắc nghiệm thông minh tích hợp AI</span>
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Tổ chức thi trắc nghiệm và kiểm tra <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">nhanh chóng & chính xác</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg">
                Hỗ trợ 3 dạng câu hỏi: Trắc nghiệm 4 lựa chọn, Đúng/Sai, Điền khuyết. Import đề bằng AI Gemini, xáo trộn câu hỏi ngẫu nhiên và thống kê điểm số lớp học trực quan.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center space-x-2 text-sm"
                >
                  <span>Bắt đầu ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentUser({ role: 'admin', adminName: 'Giáo viên Quản trị' });
                  }}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold px-8 py-4 rounded-2xl shadow-xs transition-all flex items-center space-x-2 text-sm"
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Truy cập nhanh Cổng Giáo viên</span>
                </button>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
                  🤖
                </div>
                <h3 className="text-lg font-bold text-slate-900">Import đề thi bằng AI</h3>
                <p className="text-sm text-slate-500">
                  Dán nội dung tài liệu hoặc văn bản, trợ lý AI Gemini sẽ tự động phân tích và trích xuất hàng loạt câu hỏi chuẩn xác.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center font-bold">
                  🔀
                </div>
                <h3 className="text-lg font-bold text-slate-900">Đề thi ngẫu nhiên (Random)</h3>
                <p className="text-sm text-slate-500">
                  Cấu hình số lượng câu hỏi bốc ngẫu nhiên từ ngân hàng và xáo trộn thứ tự câu hỏi, đáp án cho từng học sinh.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                  📊
                </div>
                <h3 className="text-lg font-bold text-slate-900">Thống kê & Bảng điểm lớp</h3>
                <p className="text-sm text-slate-500">
                  Xem điểm số chi tiết từng học sinh theo lớp, tỷ lệ đạt điểm, xem lại bài làm và xuất file Excel/CSV dễ dàng.
                </p>
              </div>
            </div>
          </div>
        ) : currentUser.role === 'admin' ? (
          /* Admin Dashboard */
          <AdminDashboard
            quizzes={quizzes}
            students={students}
            classes={classes}
            submissions={submissions}
            onSaveQuiz={handleSaveQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onUpdateStudents={handleUpdateStudents}
            onUpdateClasses={handleUpdateClasses}
          />
        ) : (
          /* Student Portal */
          activeSubmissionReview ? (
            <QuizResult
              quiz={activeSubmissionReview.quiz}
              submission={activeSubmissionReview.submission}
              onBackToDashboard={() => setActiveSubmissionReview(null)}
            />
          ) : activeQuizToTake ? (
            <QuizTaker
              quiz={activeQuizToTake}
              student={currentUser.student!}
              onFinishSubmission={handleFinishSubmission}
              onCancel={() => setActiveQuizToTake(null)}
            />
          ) : (
            <StudentDashboard
              student={currentUser.student!}
              quizzes={quizzes}
              submissions={submissions}
              onStartQuiz={(quiz) => setActiveQuizToTake(quiz)}
              onViewResult={(sub) => {
                const q = quizzes.find(item => item.id === sub.quizId);
                if (q) setActiveSubmissionReview({ quiz: q, submission: sub });
              }}
            />
          )
        )}
      </main>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        students={students}
        classes={classes}
        onLogin={handleLogin}
      />
    </div>
  );
}
