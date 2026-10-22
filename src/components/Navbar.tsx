import React from 'react';
import { CurrentUser } from '../types';
import { GraduationCap, Shield, User, LogOut, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentUser: CurrentUser;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onOpenLogin, onLogout }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              QuizMaster Pro
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium border border-indigo-100">
              Hệ thống thi trắc nghiệm thông minh
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {currentUser.role ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                {currentUser.role === 'admin' ? (
                  <>
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-700">Giáo viên / Admin</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      {currentUser.student?.name} <span className="text-xs text-slate-500">({currentUser.student?.className})</span>
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-rose-50"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all transform active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
