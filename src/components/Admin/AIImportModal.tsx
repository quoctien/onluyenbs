import React, { useState } from 'react';
import { Question } from '../../types';
import { Sparkles, X, FileText, CheckCircle, Loader2, Bot } from 'lucide-react';

interface AIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportQuestions: (questions: Question[]) => void;
}

export const AIImportModal: React.FC<AIImportModalProps> = ({
  isOpen,
  onClose,
  onImportQuestions,
}) => {
  const [tab, setTab] = useState<'paste' | 'generate'>('paste');
  const [rawText, setRawText] = useState('');
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('10');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewQuestions, setPreviewQuestions] = useState<Question[] | null>(null);

  if (!isOpen) return null;

  const handleParseText = async () => {
    if (!rawText.trim()) {
      setError('Vui lòng nhập hoặc dán nội dung văn bản đề thi.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/parse-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Lỗi phân tích từ AI');
      }

      const formatted: Question[] = data.questions.map((q: any, idx: number) => ({
        id: `ai-q-${Date.now()}-${idx}`,
        type: q.type || 'multiple_choice',
        content: q.content || 'Câu hỏi chưa có nội dung',
        options: q.options || (q.type === 'multiple_choice' ? ['Đúng', 'Sai', 'Không rõ', 'Tất cả sai'] : undefined),
        correctAnswer: q.correctAnswer ?? 0,
        explanation: q.explanation || 'Không có giải thích',
        points: q.points || 2
      }));

      setPreviewQuestions(formatted);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối AI');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError('Vui lòng nhập chủ đề kiểm tra.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, grade, count })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Lỗi tạo đề từ AI');
      }

      const formatted: Question[] = data.questions.map((q: any, idx: number) => ({
        id: `gen-q-${Date.now()}-${idx}`,
        type: q.type || 'multiple_choice',
        content: q.content || 'Câu hỏi',
        options: q.options || (q.type === 'multiple_choice' ? ['A', 'B', 'C', 'D'] : undefined),
        correctAnswer: q.correctAnswer ?? 0,
        explanation: q.explanation || '',
        points: 2
      }));

      setPreviewQuestions(formatted);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối AI');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (previewQuestions && previewQuestions.length > 0) {
      onImportQuestions(previewQuestions);
      setPreviewQuestions(null);
      setRawText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/15 hover:bg-white/25 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Trợ lý AI tạo & phân tích câu hỏi</h2>
              <p className="text-violet-100 text-xs">Hỗ trợ tự động trích xuất đề thi từ văn bản hoặc tạo đề theo chủ đề</p>
            </div>
          </div>

          <div className="flex bg-violet-950/30 p-1 rounded-xl mt-4 max-w-xs">
            <button
              type="button"
              onClick={() => { setTab('paste'); setPreviewQuestions(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'paste' ? 'bg-white text-violet-700 shadow-md' : 'text-violet-100 hover:text-white'
              }`}
            >
              📋 Dán văn bản / tài liệu
            </button>
            <button
              type="button"
              onClick={() => { setTab('generate'); setPreviewQuestions(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'generate' ? 'bg-white text-violet-700 shadow-md' : 'text-violet-100 hover:text-white'
              }`}
            >
              ✨ Tạo đề tự động
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-medium border border-rose-100">
              {error}
            </div>
          )}

          {!previewQuestions ? (
            tab === 'paste' ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Dán nội dung đề thi (Word, ghi chú, tài liệu giáo khoa)
                </label>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`Ví dụ:\nCâu 1: Thủ đô của nước ta là gì?\nA. Hà Nội\nB. TP.HCM\nC. Đà Nẵng\nD. Hải Phòng\n(Đáp án: A)\n\nCâu 2: Trái Đất quay quanh Mặt Trời đúng hay sai?\n(Đáp án: Đúng)`}
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm font-mono bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handleParseText}
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI đang phân tích cấu trúc đề...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5" />
                      <span>Phân tích & Trích xuất câu hỏi bằng AI</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Chủ đề kiểm tra / Yêu cầu
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ví dụ: Định luật Newton và chuyển động cơ học lớp 10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Khối lớp
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm bg-slate-50"
                    >
                      <option value="10">Lớp 10</option>
                      <option value="11">Lớp 11</option>
                      <option value="12">Lớp 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Số lượng câu hỏi
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm bg-slate-50"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI đang biên soạn đề thi...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Tạo đề thi tự động bằng AI</span>
                    </>
                  )}
                </button>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-semibold">Đã trích xuất thành công {previewQuestions.length} câu hỏi!</span>
                </div>
                <button
                  onClick={() => setPreviewQuestions(null)}
                  className="text-xs text-emerald-700 hover:underline font-medium"
                >
                  Làm lại
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {previewQuestions.map((q, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
                        Câu {idx + 1} • {q.type === 'multiple_choice' ? 'Trắc nghiệm 4 lựa chọn' : q.type === 'true_false' ? 'Đúng / Sai' : 'Điền khuyết'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{q.content}</p>
                    {q.type === 'multiple_choice' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border ${
                              String(q.correctAnswer) === String(oIdx) || String(q.correctAnswer) === ['A','B','C','D'][oIdx]
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {['A', 'B', 'C', 'D'][oIdx]}. {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.type === 'true_false' && (
                      <div className="text-xs font-semibold text-emerald-700">
                        Đáp án đúng: {q.correctAnswer ? 'Đúng (True)' : 'Sai (False)'}
                      </div>
                    )}
                    {q.type === 'fill_in_blank' && (
                      <div className="text-xs font-semibold text-emerald-700">
                        Đáp án: {String(q.correctAnswer)}
                      </div>
                    )}
                    {q.explanation && (
                      <p className="text-xs text-slate-500 italic">💡 Giải thích: {q.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleConfirmImport}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all text-sm"
              >
                Xác nhận thêm {previewQuestions.length} câu hỏi vào đề thi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
