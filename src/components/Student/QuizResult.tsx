import React from 'react';
import { Quiz, QuizSubmission } from '../../types';
import { CheckCircle, XCircle, Award, Clock, RotateCcw, CheckSquare } from 'lucide-react';

interface QuizResultProps {
  quiz: Quiz;
  submission: QuizSubmission;
  onBackToDashboard: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  quiz,
  submission,
  onBackToDashboard,
}) => {
  const isPassed = submission.score >= quiz.passingScore;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Result Card Header */}
      <div className={`p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ${
        isPassed ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-rose-600 to-orange-600'
      }`}>
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {isPassed ? <CheckCircle className="w-4 h-4 text-emerald-200" /> : <XCircle className="w-4 h-4 text-rose-200" />}
            <span>{isPassed ? 'Đạt yêu cầu' : 'Chưa đạt yêu cầu'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{quiz.title}</h1>
          <p className="text-white/80 text-xs">Học sinh: <strong>{submission.studentName}</strong> (Lớp {submission.className})</p>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center flex-shrink-0 min-w-[180px]">
          <span className="text-xs uppercase font-bold text-white/80 tracking-wider">Điểm số của bạn</span>
          <div className="text-4xl font-extrabold mt-1">{submission.score} <span className="text-lg font-normal text-white/75">/ 10</span></div>
          <span className="text-[11px] text-white/80 mt-1 block">Đúng {submission.correctCount}/{submission.totalQuestions} câu</span>
        </div>
      </div>

      {/* Info summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Điểm đạt tối thiểu</p>
            <p className="text-base font-bold text-slate-800">{quiz.passingScore} điểm</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="bg-violet-50 text-violet-600 p-3 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Thời gian làm bài</p>
            <p className="text-base font-bold text-slate-800">
              {Math.floor(submission.timeSpentSeconds / 60)} phút {submission.timeSpentSeconds % 60} giây
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Thời điểm nộp</p>
            <p className="text-sm font-bold text-slate-800">{new Date(submission.submittedAt).toLocaleTimeString('vi-VN')}</p>
          </div>
        </div>
      </div>

      {/* Answer review list */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
        <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
          Xem chi tiết đáp án & giải thích
        </h2>

        <div className="space-y-6">
          {submission.selectedQuestionIds.map((qId, idx) => {
            const question = quiz.questions.find(q => q.id === qId);
            if (!question) return null;
            const studentAns = submission.answers[qId];

            let isCorrect = false;
            if (question.type === 'multiple_choice') {
              isCorrect = studentAns === question.correctAnswer;
            } else if (question.type === 'true_false') {
              isCorrect = studentAns === question.correctAnswer;
            } else {
              isCorrect = String(studentAns || '').trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
            }

            return (
              <div key={qId} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    Câu {idx + 1} ({question.type === 'multiple_choice' ? 'Trắc nghiệm 4 lựa chọn' : question.type === 'true_false' ? 'Đúng / Sai' : 'Điền khuyết'})
                  </span>
                  {isCorrect ? (
                    <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" /> <span>Chính xác (+{question.points || 2}đ)</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                      <XCircle className="w-4 h-4" /> <span>Chưa chính xác</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-900 mb-3">{question.content}</p>

                {question.type === 'multiple_choice' && question.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    {question.options.map((opt, oIdx) => {
                      const isStudentChoice = studentAns === oIdx;
                      const isRightChoice = question.correctAnswer === oIdx;
                      let badge = 'bg-white border-slate-200 text-slate-600';
                      if (isRightChoice) badge = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                      else if (isStudentChoice && !isRightChoice) badge = 'bg-rose-100 border-rose-300 text-rose-900 font-bold';

                      return (
                        <div key={oIdx} className={`p-3 rounded-xl border ${badge}`}>
                          {['A', 'B', 'C', 'D'][oIdx]}. {opt} {isStudentChoice && '(Bạn chọn)'} {isRightChoice && '✓ (Đáp án đúng)'}
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === 'true_false' && (
                  <div className="text-xs space-y-1 mb-3">
                    <p>Bạn chọn: <strong className={studentAns === question.correctAnswer ? 'text-emerald-700' : 'text-rose-700'}>{String(studentAns)}</strong></p>
                    <p>Đáp án đúng: <strong className="text-emerald-700">{String(question.correctAnswer)}</strong></p>
                  </div>
                )}

                {question.type === 'fill_in_blank' && (
                  <div className="text-xs space-y-1 mb-3">
                    <p>Bạn điền: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{String(studentAns || '(Không trả lời)')}</strong></p>
                    <p>Đáp án chuẩn: <strong className="text-emerald-700">{String(question.correctAnswer)}</strong></p>
                  </div>
                )}

                {question.explanation && (
                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-100">
                    💡 Giải thích: {question.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-6 flex justify-center">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Quay lại danh sách đề thi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
