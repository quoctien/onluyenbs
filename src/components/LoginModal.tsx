import React, { useState } from 'react';
import { Student, CurrentUser } from '../types';
import { Shield, User, X, Lock, KeyRound, BookOpen } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  classes: string[];
  onLogin: (user: CurrentUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  students,
  classes,
  onLogin,
}) => {
  const [tab, setTab] = useState<'student' | 'admin'>('student');

  // Student form state
  const [selectedClass, setSelectedClass] = useState(classes[0] || '10A1');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');

  // Admin form state
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const found = students.find(
      s => s.id.toLowerCase() === studentId.trim().toLowerCase() && s.className === selectedClass
    );
    if (!found) {
      setError('Không tìm thấy học sinh với mã số này trong lớp đã chọn.');
      return;
    }
    onLogin({
      role: 'student',
      student: found,
    });
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (adminPassword === 'admin123' || adminPassword === '123456' || adminPassword === '') {
      onLogin({
        role: 'admin',
        adminName: 'Giáo viên Quản trị',
      });
      onClose();
    } else {
      setAdminError('Mật khẩu quản trị không đúng (Mật khẩu mặc định: admin123)');
    }
  };

  const handleQuickStudentLogin = (st: Student) => {
    onLogin({
      role: 'student',
      student: st,
    });
    onClose();
  };

  const handleQuickAdminLogin = () => {
    onLogin({
      role: 'admin',
      adminName: 'Giáo viên Quản trị',
    });
    onClose();
  };

  const classStudents = students.filter(s => s.className === selectedClass);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Đăng nhập hệ thống</h2>
              <p className="text-indigo-100 text-xs">Chọn vai trò học sinh hoặc giáo viên</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-indigo-950/30 p-1 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => setTab('student')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                tab === 'student' ? 'bg-white text-indigo-700 shadow-md' : 'text-indigo-100 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Học sinh</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('admin')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                tab === 'admin' ? 'bg-white text-indigo-700 shadow-md' : 'text-indigo-100 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Giáo viên / Admin</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {tab === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              {error && (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-medium border border-rose-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Chọn lớp học
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudentId('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-slate-50"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Lớp {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Chọn học sinh hoặc Nhập mã số
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-slate-50"
                >
                  <option value="">-- Chọn học sinh trong lớp {selectedClass} --</option>
                  {classStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.id} - {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Mật khẩu / Mã PIN
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu (mặc định 123)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm"
              >
                Vào làm bài kiểm tra
              </button>

              {/* Quick Login Helper */}
              {classStudents.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Đăng nhập nhanh học sinh mẫu:</p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {classStudents.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleQuickStudentLogin(st)}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100 font-medium transition-colors"
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {adminError && (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-medium border border-rose-100">
                  {adminError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Mật khẩu Quản trị viên
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (admin123)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Mật khẩu demo mặc định: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono">admin123</code></p>
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Truy cập Cổng Giáo viên</span>
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  ⚡ Đăng nhập nhanh Admin (Bỏ qua mật khẩu)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
