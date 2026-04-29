import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shrink-0">
      <div className="flex items-center justify-between h-16 px-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <img
            src="/sify-logo.png"
            alt="SIFY Logo"
            className="h-7 w-auto shrink-0"
          />

          <div className="h-6 w-px bg-slate-200 shrink-0"></div>

          <h1 className="text-base font-bold text-slate-800 tracking-tight truncate">
            Asset Management - <span className="text-slate-500">iTest Content Team</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
              Cloud Connected
            </span>
          </div>

          <button
            onClick={onLogout}
            className="h-9 px-3 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
