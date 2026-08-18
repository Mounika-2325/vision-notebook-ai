import React, { useState } from 'react'
import {
  Moon, Sun, Key, Server, Database, Globe,
  CheckCircle, AlertCircle, ExternalLink, Copy, Eye, EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'

function SettingSection({ title, children }) {
  return (
    <div className="glass p-5 space-y-4">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function SettingRow({ icon: Icon, label, desc, children, color = 'violet' }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon size={15} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
          {desc && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200
                 ${checked ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                        ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

const API_DOCS = [
  { method: 'POST', path: '/api/documents/upload', desc: 'Upload & process a document' },
  { method: 'GET', path: '/api/documents', desc: 'List all documents' },
  { method: 'POST', path: '/api/images/upload', desc: 'Upload & analyze an image' },
  { method: 'POST', path: '/api/images/ask', desc: 'Ask a question about an image' },
  { method: 'POST', path: '/api/chat', desc: 'Send a chat message' },
  { method: 'GET', path: '/api/chat/sessions', desc: 'Get all chat sessions' },
  { method: 'POST', path: '/api/notes/generate', desc: 'Generate notes from a document' },
  { method: 'GET', path: '/api/notes', desc: 'Get all generated notes' },
  { method: 'GET', path: '/api/health', desc: 'Server health check' }
]

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const [showKey, setShowKey] = useState(false)
  const [serverUrl] = useState('http://localhost:5000')
  const [dbUrl] = useState('mongodb://localhost:27017/vision-notebook-ai')
  const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '(Set in server/.env)')

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Copy failed'))
  }

  const maskedKey = apiKey.replace(/.(?=.{4})/g, '•')

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="section-title">Settings</h2>
        <p className="section-sub">Configure your Vision Notebook AI environment</p>
      </div>

      {/* Appearance */}
      <SettingSection title="Appearance">
        <SettingRow
          icon={isDark ? Moon : Sun}
          label="Dark Mode"
          desc="Toggle between light and dark interface theme"
          color={isDark ? 'indigo' : 'amber'}
        >
          <Toggle id="dark-mode-toggle" checked={isDark} onChange={toggleTheme} />
        </SettingRow>
      </SettingSection>

      {/* Connection */}
      <SettingSection title="Connection">
        <SettingRow icon={Server} label="API Server" desc={serverUrl} color="violet">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Connected</span>
          </div>
        </SettingRow>
        <div className="divider" />
        <SettingRow icon={Database} label="MongoDB" desc={dbUrl} color="cyan">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
          </div>
        </SettingRow>
      </SettingSection>

      {/* AI Configuration */}
      <SettingSection title="AI Configuration">
        <SettingRow
          icon={Key}
          label="Gemini API Key"
          desc="Set GEMINI_API_KEY in server/.env to configure"
          color="violet"
        >
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowKey(p => !p)}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                         text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                         hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle API key visibility"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </SettingRow>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <code className="text-xs font-mono text-slate-600 dark:text-slate-300 flex-1 truncate">
            {showKey ? apiKey : maskedKey}
          </code>
          <button
            onClick={() => copyToClipboard(apiKey)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Copy API key"
          >
            <Copy size={13} />
          </button>
        </div>
        <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/40">
          <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
            💡 Get a free Gemini API key at{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold inline-flex items-center gap-1"
            >
              Google AI Studio <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Model</p>
            <p className="text-sm font-bold text-gradient">gemini-3.6-flash</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Vision</p>
            <p className="text-sm font-bold text-gradient">Enabled ✓</p>
          </div>
        </div>
      </SettingSection>

      {/* API Reference */}
      <SettingSection title="API Reference">
        <p className="text-xs text-slate-400">All available REST API endpoints:</p>
        <div className="space-y-1.5">
          {API_DOCS.map(({ method, path, desc }) => (
            <div
              key={path}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
              onClick={() => copyToClipboard(`${serverUrl}${path}`)}
            >
              <span className={`badge flex-shrink-0 font-mono text-[10px] min-w-[38px] justify-center
                               ${method === 'GET' ? 'badge-cyan' : 'badge-violet'}`}>
                {method}
              </span>
              <code className="text-xs font-mono text-slate-600 dark:text-slate-300 flex-1 truncate">{path}</code>
              <span className="text-xs text-slate-400 hidden group-hover:block">{desc}</span>
              <Copy size={11} className="text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </SettingSection>

      {/* Info footer */}
      <div className="glass-sm p-4 flex items-start gap-3">
        <Globe size={18} className="text-violet-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vision Notebook AI v1.0.0</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Built with React, Node.js, Express, MongoDB & Google Gemini AI.
            Open source — ready for extension.
          </p>
        </div>
      </div>
    </div>
  )
}
