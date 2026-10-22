import React, { useState } from 'react';
import { QuizSubmission, Quiz, Student } from '../../types';
import { FileSpreadsheet, Search, CheckCircle, XCircle, Clock, Award, Eye, Download } from 'lucide-react';

interface ScoreReportsProps {
  submissions: QuizSubmission[];
  quizzes: Quiz[];
  students: Student[];
  classes: string[];
}

export const ScoreReports: React.FC<ScoreReportsProps> = ({
  submissions,
  quizzes,
  students,
  classes,
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes[0]?.id || '');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewSubmission, setReviewSubmission] = useState<QuizSubmission | null>(null);

  const currentQuiz = quizzes.find(q => q.id === selectedQuizId);

  const filteredSubmissions = submissions.filter(sub => {
    if (sub.quizId !== selectedQuizId) return false;
    if (selectedClass !== 'ALL' && sub.className !== selectedClass) return false;
    if (
      searchQuery &&
      !sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !sub.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const averageScore = filteredSubmissions.length > 0
    ? (filteredSubmissions.reduce((acc, s) => acc + s.score, 0) / filteredSubmissions.length).toFixed(1)
    : '0.0';

  const passCount = filteredSubmissions.filter(s => s.score >= (currentQuiz?.passingScore || 5.0)).length;
  const passRate = filteredSubmissions.length > 0
    ? Math.round((passCount / filteredSubmissions.length) * 100)
    : 0;

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert('Không có dữ liệu điểm để xuất.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,Mã HS,Họ và tên,Lớp,Điểm số,Số câu đúng,Tổng câu,Thời gian nộp\n';
    filteredSubmissions.forEach(sub => {
      csvContent += `${sub.studentId},"${sub.studentName}",${sub.className},${sub.score},${sub.correctCount},${sub.totalQuestions},"${new Date(sub.submittedAt).toLocaleString()}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BangDiem_${currentQuiz?.title || 'Quiz'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top filter bar */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Thống kê & Bảng điểm học sinh</h2>
          <p className="text-xs text-slate-500">Xem kết quả làm bài, điểm số và chi tiết bài làm của học sinh theo từng đề</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:ring-2 focus:ring-indigo-500"
          >
            {quizzes.map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả các lớp</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>Lớp {cls}</option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Điểm trung bình</p>
            <p className="text-2xl font-extrabold text-slate-800">{averageScore} <span className="text-sm font-normal text-slate-400">/ 10</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tỷ lệ đạt (&gt;= {currentQuiz?.passingScore || 5})</p>
            <p className="text-2xl font-extrabold text-slate-800">{passRate}% <span className="text-sm font-normal text-slate-400">({passCount}/{filteredSubmissions.length} HS)</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="bg-violet-50 text-violet-600 p-3.5 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tổng số bài nộp</p>
            <p className="text-2xl font-extrabold text-slate-800">{filteredSubmissions.length}</p>
          </div>
        </div>
      </div>

      {/* Submissions table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">Mã HS</th>
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Lớp</th>
                <th className="p-4">Điểm số</th>
                <th className="p-4">Số câu đúng</th>
                <th className="p-4">Thời gian nộp</th>
                <th className="p-4 text-right">Chi tiết bài làm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSubmissions.map((sub) => {
                const isPassed = sub.score >= (currentQuiz?.passingScore || 5.0);
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600">{sub.studentId}</td>
                    <td className="p-4 font-semibold text-slate-900">{sub.studentName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium border border-indigo-100">
                        {sub.className}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-sm ${
                        isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {sub.score} <span className="text-xs font-normal">/ 10</span>
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      {sub.correctCount} / {sub.totalQuestions} câu
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setReviewSubmission(sub)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem bài làm</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chưa có bài nộp nào cho đề thi này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Submission Modal */}
      {reviewSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Chi tiết bài làm: {reviewSubmission.studentName}</h3>
                <p className="text-xs text-indigo-100">Lớp {reviewSubmission.className} • Điểm: <strong className="text-white text-base">{reviewSubmission.score}/10</strong></p>
              </div>
              <button
                onClick={() => setReviewSubmission(null)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {currentQuiz && reviewSubmission.selectedQuestionIds.map((qId, idx) => {
                const question = currentQuiz.questions.find(q => q.id === qId);
                if (!question) return null;
                const studentAns = reviewSubmission.answers[qId];

                let isCorrect = false;
                if (question.type === 'multiple_choice') {
                  isCorrect = studentAns === question.correctAnswer;
                } else if (question.type === 'true_false') {
                  isCorrect = studentAns === question.correctAnswer;
                } else {
                  isCorrect = String(studentAns || '').trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
                }

                return (
                  <div key={qId} className={`p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        Câu {idx + 1} ({question.type === 'multiple_choice' ? 'Trắc nghiệm' : question.type === 'true_false' ? 'Đúng/Sai' : 'Điền khuyết'})
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> <span>Đúng</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> <span>Sai</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-3">{question.content}</p>

                    {question.type === 'multiple_choice' && question.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                        {question.options.map((opt, oIdx) => {
                          const isStudentChoice = studentAns === oIdx;
                          const isRightChoice = question.correctAnswer === oIdx;
                          let badgeStyle = 'bg-white border-slate-200 text-slate-600';
                          if (isRightChoice) badgeStyle = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                          else if (isStudentChoice && !isRightChoice) badgeStyle = 'bg-rose-100 border-rose-300 text-rose-900 font-bold';

                          return (
                            <div key={oIdx} className={`p-2.5 rounded-xl border ${badgeStyle}`}>
                              {['A', 'B', 'C', 'D'][oIdx]}. {opt} {isStudentChoice && '(Học sinh chọn)'} {isRightChoice && '✓'}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {question.type === 'true_false' && (
                      <div className="text-xs space-y-1 mb-2">
                        <p>Học sinh chọn: <strong className={studentAns === question.correctAnswer ? 'text-emerald-700' : 'text-rose-700'}>{String(studentAns)}</strong></p>
                        <p>Đáp án đúng: <strong className="text-emerald-700">{String(question.correctAnswer)}</strong></p>
                      </div>
                    )}

                    {question.type === 'fill_in_blank' && (
                      <div className="text-xs space-y-1 mb-2">
                        <p>Học sinh điền: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{String(studentAns || '(Không trả lời)')}</strong></p>
                        <p>Đáp án chuẩn: <strong className="text-emerald-700">{String(question.correctAnswer)}</strong></p>
                      </div>
                    )}

                    {question.explanation && (
                      <p className="text-xs text-slate-500 italic mt-2 bg-white p-2.5 rounded-xl border border-slate-100">
                        💡 Giải thích: {question.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
