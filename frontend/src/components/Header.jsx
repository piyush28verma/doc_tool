import React from "react";

function Header() {
  return (
    <header className="w-full border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect x="6" y="4" width="22" height="28" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              <line x1="11" y1="12" x2="23" y2="12" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="17" x2="20" y2="17" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="12" y="8" width="22" height="28" rx="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="17" y1="16" x2="29" y2="16" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="17" y1="21" x2="26" y2="21" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="17" y1="26" x2="23" y2="26" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Doc<span className="text-blue-400">Merge</span>
            </h1>
            <p className="text-xs text-dark-400 -mt-0.5 hidden sm:block">Document Combiner Tool</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-xs text-dark-400 bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
            PDF • DOCX • DOC
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
