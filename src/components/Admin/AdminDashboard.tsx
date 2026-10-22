import React, { useState } from 'react';
import { Quiz, Student, QuizSubmission } from '../../types';
import { QuizEditorModal } from './QuizEditorModal';
import { StudentManager } from './StudentManager';
import { ScoreReports } from './ScoreReports';
import { BookOpen, Users, BarChart3, Plus, Trash2, Edit3, Sparkles, Layers } from 'lucide-react';

interface AdminDashboardProps {
  quizzes: Quiz[];
  students: Student[];
  classes: string[];
  submissions: QuizSubmission[];
  onSaveQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onUpdateStudents: (students: Student[]) => void;
  onUpdateClasses: (classes: string[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  quizzes,
  students,
  classes,
  submissions,
  onSaveQuiz,
  onDeleteQuiz,
  onUpdateStudents,
  onUpdateClasses,
}) => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'students' | 'reports'>('quizzes');
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const handleCreateNew = () => {
    setEditingQuiz(null);
    setShowEditor(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowEditor(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Navigation Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-xs border border-slate-200 max-w-xl">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'quizzes'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Quản lý Đề thi ({quizzes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Học sinh & Lớp ({students.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Thống kê Điểm số</span>
        </button>
      </div>

      {/* Tab Content 1: Quizzes */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Danh sách Đề thi trắc nghiệm</h2>
              <p className="text-xs text-slate-500">Tạo, chỉnh sửa đề thi, cấu hình random số câu hỏi và gán lớp</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo đề kiểm tra mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
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

                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Ngân hàng câu hỏi:</span>
                    <strong className="text-slate-900">{quiz.questions.length} câu</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Random đề cho HS:</span>
                    <strong className="text-indigo-600">{quiz.totalQuestionsToTake} câu / đề</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Lớp áp dụng:</span>
                    <strong className="text-slate-900">{quiz.assignedClasses.join(', ')}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(quiz)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa đề thi "${quiz.title}"?`)) {
                        onDeleteQuiz(quiz.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Xóa đề thi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Students */}
      {activeTab === 'students' && (
        <StudentManager
          students={students}
          classes={classes}
          onUpdateStudents={onUpdateStudents}
          onUpdateClasses={onUpdateClasses}
        />
      )}

      {/* Tab Content 3: Reports */}
      {activeTab === 'reports' && (
        <ScoreReports
          submissions={submissions}
          quizzes={quizzes}
          students={students}
          classes={classes}
        />
      )}

      {/* Quiz Editor Modal */}
      <QuizEditorModal
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={onSaveQuiz}
        initialQuiz={editingQuiz}
        availableClasses={classes}
      />
    </div>
  );
};
