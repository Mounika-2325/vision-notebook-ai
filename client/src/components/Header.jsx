import React from 'react'
import { useLocation } from 'react-router-dom'
import { Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const breadcrumbs = {
  '/':          { label: 'Dashboard',       emoji: '🏠' },
  '/documents': { label: 'Document Upload', emoji: '📄' },
  '/images':    { label: 'Image Analysis',  emoji: '🖼️' },
  '/chat':      { label: 'AI Chat',         emoji: '💬' },
  '/notes':     { label: 'Notes Generator', emoji: '📝' },
  '/settings':  { label: 'Settings',        emoji: '⚙️' }
}

export default function Header() {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const page = breadcrumbs[location.pathname] || { label: 'Vision Notebook AI', emoji: '✨' }

  return (
    <header className="flex items-center justify-between h-16 px-6
                       border-b border-slate-200 dark:border-slate-800
                       bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-lg" role="img" aria-label={page.label}>{page.emoji}</span>
        <div>
          <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight">
            {page.label}
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none">
            Vision Notebook AI
          </p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        bg-emerald-50 dark:bg-emerald-900/20
                        border border-emerald-200 dark:border-emerald-800/40">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">AI Ready</span>
        </div>

        {/* Dark mode toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 flex items-center justify-center rounded-xl
                     bg-slate-100 dark:bg-slate-800
                     text-slate-500 dark:text-slate-400
                     hover:text-violet-600 dark:hover:text-violet-400
                     hover:bg-violet-50 dark:hover:bg-violet-900/20
                     border border-slate-200 dark:border-slate-700
                     transition-all duration-200"
        >
          {isDark
            ? <Sun size={17} className="text-amber-400" />
            : <Moon size={17} />
          }
        </button>
      </div>
    </header>
  )
}
