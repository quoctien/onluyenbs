import React, { useState, useEffect } from 'react';
import { Quiz, Question, Student, QuizSubmission } from '../../types';
import { Clock, AlertTriangle, Send, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface QuizTakerProps {
  quiz: Quiz;
  student: Student;
  onFinishSubmission: (submission: QuizSubmission) => void;
  onCancel: () => void;
}

export const QuizTaker: React.FC<QuizTakerProps> = ({
  quiz,
  student,
  onFinishSubmission,
  onCancel,
}) => {
  // Select randomized subset of questions if configured, and shuffle if enabled
  const [selectedQuestions] = useState<Question[]>(() => {
    let pool = [...quiz.questions];
    if (quiz.shuffleQuestions) {
      pool.sort(() => Math.random() - 0.5);
    }
    const count = Math.min(quiz.totalQuestionsToTake || pool.length, pool.length);
    return pool.slice(0, count);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(quiz.durationMinutes * 60);
  const [startTime] = useState(Date.now());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: string, val: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: val
    }));
  };

  const handleSubmit = (isAuto = false) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // Calculate score
    let correctCount = 0;
    let totalPointsEarned = 0;
    let totalPossiblePoints = 0;

    selectedQuestions.forEach(q => {
      const studentAns = answers[q.id];
      const pts = q.points || 2;
      totalPossiblePoints += pts;

      let isCorrect = false;
      if (q.type === 'multiple_choice') {
        if (studentAns === q.correctAnswer) isCorrect = true;
      } else if (q.type === 'true_false') {
        if (studentAns === q.correctAnswer) isCorrect = true;
      } else if (q.type === 'fill_in_blank') {
        if (String(studentAns || '').trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        correctCount++;
        totalPointsEarned += pts;
      }
    });

    // Scale to 10 points
    const finalScore = totalPossiblePoints > 0
      ? Number(((totalPointsEarned / totalPossiblePoints) * 10).toFixed(1))
      : 0;

    const submission: QuizSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      answers,
      score: finalScore,
      correctCount,
      totalQuestions: selectedQuestions.length,
      timeSpentSeconds: timeSpent,
      submittedAt: new Date().toISOString(),
      status: 'completed',
      selectedQuestionIds: selectedQuestions.map(q => q.id)
    };

    if (isAuto) {
      alert('Đã hết thời gian làm bài! Hệ thống tự động nộp bài.');
    }

    onFinishSubmission(submission);
  };

  const currentQ = selectedQuestions[currentIndex];
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Top Header bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-16 z-20">
        <div>
          <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
            {quiz.subject}
          </span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{quiz.title}</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${
            timeLeftSeconds < 120 ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold text-base">{formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Nộp bài</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Câu hỏi {currentIndex + 1} / {selectedQuestions.length}
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              ({currentQ.points || 2} điểm)
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.content}
            </h2>

            {/* Multiple Choice 4 options */}
            {currentQ.type === 'multiple_choice' && currentQ.options && (
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleAnswerChange(currentQ.id, oIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-3 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {['A', 'B', 'C', 'D'][oIdx]}
                      </span>
                      <span className="text-sm font-medium">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* True / False */}
            {currentQ.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleAnswerChange(currentQ.id, true)}
                  className={`p-5 rounded-2xl border text-center font-bold text-sm transition-all ${
                    answers[currentQ.id] === true
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  ✓ Đúng (True)
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerChange(currentQ.id, false)}
                  className={`p-5 rounded-2xl border text-center font-bold text-sm transition-all ${
                    answers[currentQ.id] === false
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                  }`}
                >
                  ✕ Sai (False)
                </button>
              </div>
            )}

            {/* Fill in blank */}
            {currentQ.type === 'fill_in_blank' && (
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Câu trả lời của bạn</label>
                <input
                  type="text"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Nhập đáp án..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                />
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <button
              type="button"
              disabled={currentIndex === selectedQuestions.length - 1}
              onClick={() => setCurrentIndex(prev => Math.min(selectedQuestions.length - 1, prev + 1))}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-40"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Danh sách câu hỏi ({answeredCount}/{selectedQuestions.length} đã trả lời)
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {selectedQuestions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                const isCurrent = currentIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-indigo-600 ring-offset-2 bg-indigo-600 text-white shadow-md'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></div>
                <span>Đã trả lời</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>
                <span>Chưa trả lời</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-slate-800">Xác nhận nộp bài kiểm tra</h3>
            </div>
            <p className="text-xs text-slate-600">
              Bạn đã trả lời <strong className="text-indigo-600">{answeredCount} / {selectedQuestions.length}</strong> câu hỏi. Bạn có chắc chắn muốn nộp bài ngay bây giờ không?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSubmit(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
