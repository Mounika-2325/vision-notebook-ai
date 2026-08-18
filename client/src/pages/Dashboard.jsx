import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Image, MessageSquare, BookOpen,
  Upload, ArrowRight, Clock, Sparkles, Brain, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getDocuments, getImages, getChatSessions, getNotes } from '../api'

const quickActions = [
  { label: 'Upload Document', icon: Upload, to: '/documents', color: 'from-violet-500 to-indigo-500', desc: 'PDF, DOCX, TXT' },
  { label: 'Analyze Image',   icon: Image,  to: '/images',    color: 'from-cyan-500 to-teal-500',    desc: 'JPG, PNG, WebP' },
  { label: 'Start Chat',      icon: MessageSquare, to: '/chat', color: 'from-emerald-500 to-green-500', desc: 'Ask your docs' },
  { label: 'Generate Notes',  icon: BookOpen, to: '/notes',   color: 'from-amber-500 to-orange-500', desc: 'AI-powered notes' }
]

const features = [
  { icon: Brain, label: 'Smart Summarization', desc: 'AI extracts key insights from any document instantly.' },
  { icon: Sparkles, label: 'Vision Analysis', desc: 'Detect objects, read text, and describe images with Gemini.' },
  { icon: Zap, label: 'Instant Notes', desc: 'Generate flashcards, quizzes, and summaries in seconds.' }
]

function formatBytes(b) {
  if (!b) return '0 B'
  const k = 1024
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(b) / Math.log(k))
  return `${(b / Math.pow(k, i)).toFixed(1)} ${units[i]}`
}

export default function Dashboard() {
  const [stats, setStats] = useState({ docs: 0, images: 0, chats: 0, notes: 0 })
  const [recentDocs, setRecentDocs] = useState([])
  const [recentImages, setRecentImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [docsRes, imagesRes, chatsRes, notesRes] = await Promise.allSettled([
          getDocuments(), getImages(), getChatSessions(), getNotes()
        ])
        const docs   = docsRes.status   === 'fulfilled' ? docsRes.value.documents || []   : []
        const imgs   = imagesRes.status === 'fulfilled' ? imagesRes.value.images || []    : []
        const chats  = chatsRes.status  === 'fulfilled' ? chatsRes.value.sessions || []   : []
        const nts    = notesRes.status  === 'fulfilled' ? notesRes.value.notes || []      : []

        setStats({ docs: docs.length, images: imgs.length, chats: chats.length, notes: nts.length })
        setRecentDocs(docs.slice(0, 3))
        setRecentImages(imgs.slice(0, 4))
      } catch (err) {
        toast.error('Could not load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" label="Loading dashboard…" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hero banner */}
      <div className="glass p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-cyan-500/10 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="badge badge-violet">
              <Sparkles size={10} /> AI Powered
            </div>
            <div className="badge badge-cyan">Gemini Vision</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Welcome to <span className="text-gradient">Vision Notebook AI</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg text-sm leading-relaxed mb-6">
            Your AI-powered research assistant. Upload documents, analyze images, chat with your content, and generate intelligent notes — all powered by Gemini.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/documents" className="btn-primary">
              <Upload size={16} /> Upload Document
            </Link>
            <Link to="/images" className="btn-secondary">
              <Image size={16} /> Analyze Image
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText}      label="Documents"     value={stats.docs}   color="violet" />
        <StatCard icon={Image}         label="Images"        value={stats.images} color="cyan"   />
        <StatCard icon={MessageSquare} label="Chat Sessions" value={stats.chats}  color="emerald"/>
        <StatCard icon={BookOpen}      label="Notes"         value={stats.notes}  color="amber"  />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="section-title mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ label, icon: Icon, to, color, desc }) => (
            <Link
              key={to}
              to={to}
              className="glass p-5 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-0.5 block"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              <div className="mt-3 flex items-center gap-1 text-violet-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Open <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Documents</h3>
            <Link to="/documents" className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentDocs.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No documents yet</p>
              <Link to="/documents" className="text-xs text-violet-500 hover:underline mt-1 block">Upload your first document →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDocs.map(doc => (
                <div key={doc._id || doc.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText size={15} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{doc.originalName}</p>
                    <p className="text-xs text-slate-400">{formatBytes(doc.size)} · {doc.wordCount?.toLocaleString()} words</p>
                  </div>
                  {doc.isProcessed && <span className="badge badge-green flex-shrink-0">Processed</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Images */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Images</h3>
            <Link to="/images" className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentImages.length === 0 ? (
            <div className="text-center py-8">
              <Image size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No images analyzed yet</p>
              <Link to="/images" className="text-xs text-violet-500 hover:underline mt-1 block">Upload your first image →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {recentImages.map(img => (
                <div key={img._id || img.id} className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 group">
                  <img
                    src={img.url}
                    alt={img.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                    <p className="text-white text-[10px] font-medium truncate">{img.summary || img.originalName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="glass-sm p-4 flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 dark:from-violet-500/20 dark:to-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
