import React, { useState } from 'react';
import { Quiz, Question, QuestionType } from '../../types';
import { AIImportModal } from './AIImportModal';
import { X, Plus, Trash2, Sparkles, HelpCircle, Save, Clock, BookOpen, Layers } from 'lucide-react';

interface QuizEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quiz: Quiz) => void;
  initialQuiz?: Quiz | null;
  availableClasses: string[];
}

export const QuizEditorModal: React.FC<QuizEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuiz,
  availableClasses,
}) => {
  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [subject, setSubject] = useState(initialQuiz?.subject || 'Toán học');
  const [durationMinutes, setDurationMinutes] = useState(initialQuiz?.durationMinutes || 15);
  const [passingScore, setPassingScore] = useState(initialQuiz?.passingScore || 5.0);
  const [totalQuestionsToTake, setTotalQuestionsToTake] = useState(initialQuiz?.totalQuestionsToTake || 10);
  const [shuffleQuestions, setShuffleQuestions] = useState(initialQuiz?.shuffleQuestions ?? true);
  const [shuffleOptions, setShuffleOptions] = useState(initialQuiz?.shuffleOptions ?? true);
  const [assignedClasses, setAssignedClasses] = useState<string[]>(initialQuiz?.assignedClasses || [availableClasses[0] || '10A1']);
  const [questions, setQuestions] = useState<Question[]>(initialQuiz?.questions || []);

  const [showAIModal, setShowAIModal] = useState(false);
  const [error, setError] = useState('');

  // Current editing question state
  const [editingQIndex, setEditingQIndex] = useState<number | null>(null);
  const [qType, setQType] = useState<QuestionType>('multiple_choice');
  const [qContent, setQContent] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrectMc, setQCorrectMc] = useState<number>(0);
  const [qCorrectTf, setQCorrectTf] = useState<boolean>(true);
  const [qCorrectBlank, setQCorrectBlank] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qPoints, setQPoints] = useState<number>(2);

  if (!isOpen) return null;

  const handleOpenAddQuestion = () => {
    setEditingQIndex(null);
    setQType('multiple_choice');
    setQContent('');
    setQOptions(['', '', '', '']);
    setQCorrectMc(0);
    setQCorrectTf(true);
    setQCorrectBlank('');
    setQExplanation('');
    setQPoints(2);
  };

  const handleEditQuestion = (idx: number) => {
    const q = questions[idx];
    setEditingQIndex(idx);
    setQType(q.type);
    setQContent(q.content);
    setQOptions(q.options ? [...q.options] : ['', '', '', '']);
    if (q.type === 'multiple_choice') {
      setQCorrectMc(typeof q.correctAnswer === 'number' ? q.correctAnswer : 0);
    } else if (q.type === 'true_false') {
      setQCorrectTf(Boolean(q.correctAnswer));
    } else {
      setQCorrectBlank(String(q.correctAnswer));
    }
    setQExplanation(q.explanation || '');
    setQPoints(q.points || 2);
  };

  const handleSaveQuestion = () => {
    if (!qContent.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    let correctAnswer: any = 0;
    if (qType === 'multiple_choice') correctAnswer = qCorrectMc;
    else if (qType === 'true_false') correctAnswer = qCorrectTf;
    else correctAnswer = qCorrectBlank;

    const newQ: Question = {
      id: editingQIndex !== null ? questions[editingQIndex].id : `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: qType,
      content: qContent,
      options: qType === 'multiple_choice' ? qOptions : undefined,
      correctAnswer,
      explanation: qExplanation,
      points: qPoints
    };

    if (editingQIndex !== null) {
      const updated = [...questions];
      updated[editingQIndex] = newQ;
      setQuestions(updated);
    } else {
      setQuestions([...questions, newQ]);
    }

    // Reset form
    handleOpenAddQuestion();
  };

  const handleDeleteQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài kiểm tra.');
      return;
    }
    if (questions.length === 0) {
      setError('Đề thi phải có ít nhất 1 câu hỏi.');
      return;
    }
    if (totalQuestionsToTake > questions.length) {
      setError(`Số câu random (${totalQuestionsToTake}) không được lớn hơn tổng số câu trong ngân hàng (${questions.length}).`);
      return;
    }

    const quiz: Quiz = {
      id: initialQuiz ? initialQuiz.id : `quiz-${Date.now()}`,
      title,
      description,
      subject,
      durationMinutes,
      passingScore,
      totalQuestionsToTake,
      shuffleQuestions,
      shuffleOptions,
      assignedClasses,
      startDate: initialQuiz ? initialQuiz.startDate : new Date().toISOString(),
      endDate: initialQuiz ? initialQuiz.endDate : new Date(Date.now() + 86400000 * 7).toISOString(),
      createdAt: initialQuiz ? initialQuiz.createdAt : new Date().toISOString(),
      createdBy: initialQuiz ? initialQuiz.createdBy : 'Giáo viên Admin',
      questions
    };

    onSave(quiz);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/15 hover:bg-white/25 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{initialQuiz ? 'Chỉnh sửa đề kiểm tra' : 'Tạo đề kiểm tra mới'}</h2>
              <p className="text-indigo-100 text-xs">Cấu hình thông tin đề, ngân hàng câu hỏi và xáo trộn đề ngẫu nhiên</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSaveQuiz} className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-medium border border-rose-100">
              {error}
            </div>
          )}

          {/* Section 1: Thông tin chung */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>1. Thông tin chung & Cấu hình đề</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Tiêu đề bài kiểm tra</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Kiểm tra 15 phút Toán 10 - Chương 1"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Môn học</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Toán học / Vật lý / ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Mô tả / Hướng dẫn làm bài</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghi chú cho học sinh trước khi bắt đầu..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Thời gian (phút)</label>
                <input
                  type="number"
                  min={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Điểm đạt</label>
                <input
                  type="number"
                  step={0.5}
                  min={0}
                  max={10}
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Số câu thi ngẫu nhiên</label>
                <input
                  type="number"
                  min={1}
                  value={totalQuestionsToTake}
                  onChange={(e) => setTotalQuestionsToTake(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Gán lớp học</label>
                <select
                  multiple
                  value={assignedClasses}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setAssignedClasses(values);
                  }}
                  className="w-full px-2 py-1 rounded-xl border border-slate-200 text-xs bg-white h-16 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {availableClasses.map(cls => (
                    <option key={cls} value={cls}>Lớp {cls}</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400">Giữ Ctrl để chọn nhiều lớp</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Xáo trộn thứ tự câu hỏi khi học sinh làm bài</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Xáo trộn các đáp án A, B, C, D</span>
              </label>
            </div>
          </div>

          {/* Section 2: Ngân hàng câu hỏi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  2. Ngân hàng câu hỏi ({questions.length} câu)
                </h3>
                <p className="text-xs text-slate-500">Hỗ trợ 3 dạng: Trắc nghiệm 4 lựa chọn, Đúng/Sai, Điền khuyết</p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAIModal(true)}
                  className="flex items-center space-x-1.5 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Import AI / Tạo tự động</span>
                </button>
              </div>
            </div>

            {/* Form thêm/sửa câu hỏi */}
            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                {editingQIndex !== null ? `Chỉnh sửa câu hỏi #${editingQIndex + 1}` : '➕ Thêm câu hỏi mới vào ngân hàng'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Loại câu hỏi</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="multiple_choice">Trắc nghiệm 4 lựa chọn (A, B, C, D)</option>
                    <option value="true_false">Đúng / Sai (True / False)</option>
                    <option value="fill_in_blank">Điền khuyết (Fill in the blank)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Điểm số câu</label>
                  <input
                    type="number"
                    step={0.5}
                    min={0.5}
                    value={qPoints}
                    onChange={(e) => setQPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nội dung câu hỏi</label>
                <textarea
                  rows={2}
                  value={qContent}
                  onChange={(e) => setQContent(e.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Dynamic options based on QType */}
              {qType === 'multiple_choice' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600">Các lựa chọn & Chọn đáp án đúng</label>
                  {qOptions.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctMc"
                        checked={qCorrectMc === oIdx}
                        onChange={() => setQCorrectMc(oIdx)}
                        className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        title="Đánh dấu là đáp án đúng"
                      />
                      <span className="text-xs font-bold text-slate-500 w-6">{['A', 'B', 'C', 'D'][oIdx]}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...qOptions];
                          updated[oIdx] = e.target.value;
                          setQOptions(updated);
                        }}
                        placeholder={`Lựa chọn ${['A', 'B', 'C', 'D'][oIdx]}`}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>
              )}

              {qType === 'true_false' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Đáp án đúng</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="correctTf"
                        checked={qCorrectTf === true}
                        onChange={() => setQCorrectTf(true)}
                        className="text-indigo-600 w-4 h-4"
                      />
                      <span className="text-emerald-700 font-bold">Đúng (True)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="correctTf"
                        checked={qCorrectTf === false}
                        onChange={() => setQCorrectTf(false)}
                        className="text-indigo-600 w-4 h-4"
                      />
                      <span className="text-rose-700 font-bold">Sai (False)</span>
                    </label>
                  </div>
                </div>
              )}

              {qType === 'fill_in_blank' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Đáp án chính xác</label>
                  <input
                    type="text"
                    value={qCorrectBlank}
                    onChange={(e) => setQCorrectBlank(e.target.value)}
                    placeholder="Nhập từ hoặc số đáp án chính xác..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Giải thích chi tiết (hiển thị sau khi nộp bài)</label>
                <input
                  type="text"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Giải thích vì sao đáp án đó đúng..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                {editingQIndex !== null && (
                  <button
                    type="button"
                    onClick={handleOpenAddQuestion}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Hủy sửa
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveQuestion}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingQIndex !== null ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi vào danh sách'}</span>
                </button>
              </div>
            </div>

            {/* List questions */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                        Câu {idx + 1} • {q.type === 'multiple_choice' ? 'Trắc nghiệm 4 lựa chọn' : q.type === 'true_false' ? 'Đúng/Sai' : 'Điền khuyết'}
                      </span>
                      <span className="text-[10px] text-slate-500">({q.points || 2} điểm)</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{q.content}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleEditQuestion(idx)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <p className="text-xs text-center text-slate-400 py-6">Chưa có câu hỏi nào trong đề thi.</p>
              )}
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-xs font-semibold transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu bài kiểm tra</span>
            </button>
          </div>
        </form>
      </div>

      <AIImportModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onImportQuestions={(newQs) => setQuestions([...questions, ...newQs])}
      />
    </div>
  );
};
