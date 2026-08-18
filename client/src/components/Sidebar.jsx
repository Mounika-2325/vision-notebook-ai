import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Image, MessageSquare,
  BookOpen, Settings, ChevronLeft, ChevronRight,
  Sparkles, Zap
} from 'lucide-react'

const navItems = [
  { path: '/',          icon: LayoutDashboard, label: 'Dashboard',        color: 'text-violet-500' },
  { path: '/documents', icon: FileText,         label: 'Documents',         color: 'text-indigo-500' },
  { path: '/images',    icon: Image,            label: 'Image Analysis',    color: 'text-cyan-500'   },
  { path: '/chat',      icon: MessageSquare,    label: 'AI Chat',           color: 'text-emerald-500'},
  { path: '/notes',     icon: BookOpen,         label: 'Notes Generator',   color: 'text-amber-500'  },
  { path: '/settings',  icon: Settings,         label: 'Settings',          color: 'text-slate-500'  }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-slate-200 dark:border-slate-800
                  bg-white dark:bg-slate-950
                  transition-all duration-300 ease-in-out flex-shrink-0
                  ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600
                        flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight whitespace-nowrap">
              Vision Notebook
            </p>
            <p className="text-[10px] font-semibold text-gradient leading-tight whitespace-nowrap">
              AI Research Assistant
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map(({ path, icon: Icon, label, color }) => {
          const isActive = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path)

          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                         transition-all duration-200 group relative
                         ${isActive
                           ? 'nav-link-active'
                           : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                         }`}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 transition-colors duration-200
                            ${isActive ? color : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}
              />
              {!collapsed && (
                <span className="whitespace-nowrap animate-fade-in">{label}</span>
              )}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg
                               bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium
                               whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
                               transition-opacity duration-150 z-50 shadow-lg">
                  {label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2
                                  border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* AI Badge */}
      {!collapsed && (
        <div className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50
                        dark:from-violet-900/20 dark:to-indigo-900/20
                        border border-violet-100 dark:border-violet-800/40">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={14} className="text-violet-500" />
            <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Gemini AI Powered</span>
          </div>
          <p className="text-[11px] text-violet-600/70 dark:text-violet-400/70 leading-relaxed">
            Vision, chat & note generation — all in one place.
          </p>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        id="sidebar-toggle"
        onClick={() => setCollapsed(p => !p)}
        className="absolute -right-3.5 top-20 w-7 h-7 rounded-full
                   bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                   shadow-md flex items-center justify-center
                   text-slate-500 hover:text-violet-600 dark:hover:text-violet-400
                   transition-colors duration-200 z-10"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}
