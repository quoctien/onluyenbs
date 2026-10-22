import React, { useState } from 'react';
import { Student } from '../../types';
import { Users, Plus, Trash2, KeyRound, Search, Upload, Shield } from 'lucide-react';

interface StudentManagerProps {
  students: Student[];
  classes: string[];
  onUpdateStudents: (students: Student[]) => void;
  onUpdateClasses: (classes: string[]) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  classes,
  onUpdateStudents,
  onUpdateClasses,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0] || '10A1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newClassInput, setNewClassInput] = useState('');

  // Add student form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('123');

  // Bulk import modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newClassInput.trim().toUpperCase();
    if (!trimmed) return;
    if (classes.includes(trimmed)) {
      alert('Lớp học này đã tồn tại.');
      return;
    }
    const updated = [...classes, trimmed];
    onUpdateClasses(updated);
    setNewClassInput('');
    setSelectedClass(trimmed);
  };

  const handleDeleteClass = (cls: string) => {
    if (confirm(`Bạn có chắc muốn xóa lớp ${cls}? Học sinh thuộc lớp này có thể bị ảnh hưởng.`)) {
      const updatedClasses = classes.filter(c => c !== cls);
      onUpdateClasses(updatedClasses);
      if (selectedClass === cls) {
        setSelectedClass(updatedClasses[0] || '');
      }
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim()) {
      alert('Vui lòng nhập đầy đủ mã học sinh và họ tên.');
      return;
    }
    if (students.some(s => s.id.toLowerCase() === newId.trim().toLowerCase())) {
      alert('Mã học sinh này đã tồn tại trong hệ thống.');
      return;
    }

    const newStudent: Student = {
      id: newId.trim(),
      name: newName.trim(),
      className: selectedClass,
      password: newPassword.trim() || '123'
    };

    onUpdateStudents([...students, newStudent]);
    setNewId('');
    setNewName('');
    setShowAddModal(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa học sinh này khỏi hệ thống?')) {
      onUpdateStudents(students.filter(s => s.id !== id));
    }
  };

  const handleResetPassword = (id: string) => {
    const updated = students.map(s => {
      if (s.id === id) return { ...s, password: '123' };
      return s;
    });
    onUpdateStudents(updated);
    alert(`Đã đặt lại mật khẩu cho học sinh ${id} thành: 123`);
  };

  const handleBulkImport = () => {
    if (!importText.trim()) return;
    const lines = importText.split('\n');
    const added: Student[] = [];
    let count = 0;

    for (const line of lines) {
      const parts = line.split(/[,\t;|]/);
      if (parts.length >= 2) {
        const id = parts[0].trim();
        const name = parts[1].trim();
        const pwd = parts[2] ? parts[2].trim() : '123';
        if (id && name && !students.some(s => s.id.toLowerCase() === id.toLowerCase())) {
          added.push({
            id,
            name,
            className: selectedClass,
            password: pwd
          });
          count++;
        }
      }
    }

    if (count > 0) {
      onUpdateStudents([...students, ...added]);
      setImportText('');
      setShowImportModal(false);
      alert(`Đã import thành công ${count} học sinh vào lớp ${selectedClass}!`);
    } else {
      alert('Không tìm thấy dòng hợp lệ. Định dạng yêu cầu: MãHS, Họ Tên, MậtKhẩu');
    }
  };

  const filteredStudents = students.filter(
    s => s.className === selectedClass &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top bar classes */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Quản lý Lớp học & Danh sách Học sinh</h2>
          <p className="text-xs text-slate-500">Quản lý tài khoản học sinh đăng nhập vào hệ thống làm bài</p>
        </div>

        <form onSubmit={handleAddClass} className="flex items-center space-x-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Tên lớp mới (VD: 10A3)"
            value={newClassInput}
            onChange={(e) => setNewClassInput(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm lớp</span>
          </button>
        </form>
      </div>

      {/* Class tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        {classes.map(cls => (
          <div key={cls} className="flex items-center">
            <button
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2 ${
                selectedClass === cls
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Lớp {cls}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedClass === cls ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {students.filter(s => s.className === cls).length}
              </span>
            </button>
            {classes.length > 1 && (
              <button
                onClick={() => handleDeleteClass(cls)}
                className="ml-1 text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                title="Xóa lớp"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Students list container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã HS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Import danh sách</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">Mã học sinh</th>
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Lớp</th>
                <th className="p-4">Mật khẩu / PIN</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-600">{st.id}</td>
                  <td className="p-4 font-semibold text-slate-900">{st.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium border border-indigo-100">
                      {st.className}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{st.password}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleResetPassword(st.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      title="Reset mật khẩu thành 123"
                    >
                      Reset PIN
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(st.id)}
                      className="text-rose-600 hover:text-rose-800 font-medium px-2 py-1 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Không tìm thấy học sinh nào trong lớp {selectedClass}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Thêm học sinh vào lớp {selectedClass}</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mã học sinh (ID)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: HS010"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mật khẩu / PIN</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  Thêm học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Bulk Import */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Import danh sách học sinh vào lớp {selectedClass}</h3>
            <p className="text-xs text-slate-500">
              Dán danh sách theo định dạng mỗi dòng: <code className="bg-slate-100 text-indigo-600 px-1 py-0.5 rounded font-mono">MãHS, Họ Tên, MậtKhẩu</code>
            </p>
            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`HS101, Nguyễn Văn An, 123\nHS102, Trần Thị Bình, 123\nHS103, Lê Hoàng Cường, 123`}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                Xác nhận Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
