import React, { useState } from 'react';
import { Quiz, Student, QuizSubmission } from '../../types';
import { BookOpen, Clock, Award, CheckCircle, Play, History, FileText } from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  quizzes: Quiz[];
  submissions: QuizSubmission[];
  onStartQuiz: (quiz: Quiz) => void;
  onViewResult: (submission: QuizSubmission) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  quizzes,
  submissions,
  onStartQuiz,
  onViewResult,
}) => {
  const [tab, setTab] = useState<'available' | 'history'>('available');

  // Filter quizzes assigned to student's class
  const availableQuizzes = quizzes.filter(
    q => q.assignedClasses.includes(student.className) || q.assignedClasses.includes('ALL')
  );

  const studentSubmissions = submissions.filter(
    s => s.studentId === student.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Welcome Hero Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Cổng học sinh • Lớp {student.className}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Xin chào, {student.name}!</h1>
          <p className="text-indigo-100 text-xs">Mã học sinh: <strong className="text-white font-mono">{student.id}</strong>. Chúc bạn làm bài kiểm tra đạt kết quả cao nhất.</p>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center flex-shrink-0 min-w-[160px]">
          <span className="text-xs uppercase font-bold text-indigo-100 tracking-wider">Đã hoàn thành</span>
          <div className="text-3xl font-extrabold mt-1">{studentSubmissions.length} <span className="text-sm font-normal text-indigo-200">bài thi</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-xs border border-slate-200 max-w-md">
        <button
          onClick={() => setTab('available')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
            tab === 'available'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Đề thi hiện có ({availableQuizzes.length})</span>
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
            tab === 'history'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Lịch sử & Kết quả ({studentSubmissions.length})</span>
        </button>
      </div>

      {/* Tab 1: Available Quizzes */}
      {tab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuizzes.map((quiz) => {
            const hasDone = studentSubmissions.some(s => s.quizId === quiz.id);
            const bestSub = studentSubmissions.find(s => s.quizId === quiz.id);

            return (
              <div key={quiz.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                      {quiz.subject}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      ⏱ {quiz.durationMinutes} phút
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">{quiz.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{quiz.description || 'Không có mô tả.'}</p>
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Số câu làm:</span>
                    <strong className="text-indigo-600">{quiz.totalQuestionsToTake} câu (ngẫu nhiên)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Điểm đạt:</span>
                    <strong className="text-slate-900">&gt;= {quiz.passingScore} điểm</strong>
                  </div>
                  {hasDone && bestSub && (
                    <div className="flex justify-between items-center bg-emerald-50 p-2 rounded-xl text-emerald-800 font-semibold border border-emerald-200">
                      <span>Điểm cao nhất:</span>
                      <span className="text-sm">{bestSub.score}/10</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onStartQuiz(quiz)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{hasDone ? 'Làm lại bài kiểm tra' : 'Bắt đầu làm bài'}</span>
                  </button>
                </div>
              </div>
            );
          })}
          {availableQuizzes.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              Hiện chưa có đề thi nào được gán cho lớp {student.className}.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: History */}
      {tab === 'history' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-800">Lịch sử làm bài kiểm tra của bạn</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Tên đề kiểm tra</th>
                  <th className="p-4">Điểm số</th>
                  <th className="p-4">Số câu đúng</th>
                  <th className="p-4">Thời gian nộp</th>
                  <th className="p-4 text-right">Xem lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {studentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{sub.quizTitle}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-sm ${
                        sub.score >= 5.0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {sub.score} / 10
                      </span>
                    </td>
                    <td className="p-4 font-medium">{sub.correctCount} / {sub.totalQuestions} câu</td>
                    <td className="p-4 text-slate-500">{new Date(sub.submittedAt).toLocaleString('vi-VN')}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onViewResult(sub)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold transition-colors"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
                {studentSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Bạn chưa hoàn thành bài kiểm tra nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
