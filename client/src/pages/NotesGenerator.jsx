import React, { useEffect, useState } from 'react'
import {
  FileText, Sparkles, Zap, BookOpen, Brain,
  HelpCircle, StickyNote, Trash2, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import NoteCard from '../components/NoteCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getDocuments, generateNotes, getNotes, deleteNote } from '../api'

const NOTE_TYPES = [
  { id: 'short-summary',    label: 'Short Summary',    icon: StickyNote,  color: 'violet',  desc: '2-3 sentence overview' },
  { id: 'detailed-summary', label: 'Detailed Summary', icon: BookOpen,    color: 'indigo',  desc: 'Comprehensive breakdown' },
  { id: 'bullet-notes',     label: 'Bullet Notes',     icon: FileText,    color: 'cyan',    desc: 'Organized bullet points' },
  { id: 'mind-map',         label: 'Mind Map',         icon: Brain,       color: 'amber',   desc: 'Visual concept tree' },
  { id: 'flashcards',       label: 'Flashcards',       icon: Zap,         color: 'emerald', desc: 'Study cards with Q&A' },
  { id: 'quiz-questions',   label: 'Quiz',             icon: HelpCircle,  color: 'pink',    desc: 'Multiple choice quiz' }
]

const colorMap = {
  violet:  { btn: 'border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300',
              sel: 'border-violet-500 bg-violet-100 dark:bg-violet-800/40 text-violet-800 dark:text-violet-200 ring-2 ring-violet-400 ring-offset-1',
              icon: 'text-violet-500' },
  indigo:  { btn: 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
              sel: 'border-indigo-500 bg-indigo-100 dark:bg-indigo-800/40 text-indigo-800 dark:text-indigo-200 ring-2 ring-indigo-400 ring-offset-1',
              icon: 'text-indigo-500' },
  cyan:    { btn: 'border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300',
              sel: 'border-cyan-500 bg-cyan-100 dark:bg-cyan-800/40 text-cyan-800 dark:text-cyan-200 ring-2 ring-cyan-400 ring-offset-1',
              icon: 'text-cyan-500' },
  amber:   { btn: 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
              sel: 'border-amber-500 bg-amber-100 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 ring-2 ring-amber-400 ring-offset-1',
              icon: 'text-amber-500' },
  emerald: { btn: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
              sel: 'border-emerald-500 bg-emerald-100 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-400 ring-offset-1',
              icon: 'text-emerald-500' },
  pink:    { btn: 'border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300',
              sel: 'border-pink-500 bg-pink-100 dark:bg-pink-800/40 text-pink-800 dark:text-pink-200 ring-2 ring-pink-400 ring-offset-1',
              icon: 'text-pink-500' }
}

export default function NotesGenerator() {
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [generating, setGenerating] = useState(false)
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [notes, setNotes] = useState([])
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    getDocuments()
      .then(res => setDocuments((res.documents || []).filter(d => d.isProcessed)))
      .catch(() => toast.error('Failed to load documents'))
      .finally(() => setLoadingDocs(false))

    loadNotes()
  }, [])

  const loadNotes = async (params = {}) => {
    setLoadingNotes(true)
    try {
      const res = await getNotes(params)
      setNotes(res.notes || [])
    } catch {
      toast.error('Failed to load notes')
    } finally {
      setLoadingNotes(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedDoc || !selectedType) {
      toast.error('Please select a document and note type')
      return
    }
    setGenerating(true)
    try {
      const res = await generateNotes(selectedDoc, selectedType)
      toast.success('✨ Notes generated!')
      setNotes(prev => [res.note, ...prev])
    } catch (err) {
      toast.error(err.message || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this note?')) return
    try {
      await deleteNote(id)
      setNotes(prev => prev.filter(n => (n._id || n.id) !== id))
      toast.success('Note deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const filteredNotes = filterType ? notes.filter(n => n.type === filterType) : notes

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="section-title">Notes Generator</h2>
        <p className="section-sub">Transform documents into structured study materials with AI</p>
      </div>

      {/* Generator panel */}
      <div className="glass p-6 space-y-5">
        {/* Step 1: Select doc */}
        <div>
          <label htmlFor="notes-doc-select" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Step 1 — Select Document
          </label>
          {loadingDocs ? (
            <p className="text-xs text-slate-400">Loading…</p>
          ) : documents.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertCircle size={14} />
              No processed documents found. Upload one on the Documents page first.
            </div>
          ) : (
            <select
              id="notes-doc-select"
              value={selectedDoc}
              onChange={e => setSelectedDoc(e.target.value)}
              className="input text-sm"
            >
              <option value="">— Choose a document —</option>
              {documents.map(doc => (
                <option key={doc._id || doc.id} value={doc._id || doc.id}>
                  {doc.originalName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Step 2: Note type */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Step 2 — Choose Note Type
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NOTE_TYPES.map(({ id, label, icon: Icon, color, desc }) => {
              const c = colorMap[color]
              const isSelected = selectedType === id
              return (
                <button
                  key={id}
                  id={`note-type-${id}`}
                  onClick={() => setSelectedType(id)}
                  className={`p-3 rounded-xl border text-left transition-all duration-150
                             ${isSelected ? c.sel : c.btn}
                             hover:scale-[1.02]`}
                >
                  <Icon size={16} className={`${c.icon} mb-1.5`} />
                  <p className="text-xs font-semibold leading-tight">{label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate button */}
        <button
          id="generate-notes-btn"
          onClick={handleGenerate}
          disabled={generating || !selectedDoc || !selectedType}
          className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Generating with AI…
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Notes
            </>
          )}
        </button>
      </div>

      {/* Generated notes */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="section-title">
            Generated Notes
            {notes.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({filteredNotes.length})</span>}
          </h3>
          {notes.length > 0 && (
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="input text-xs py-1.5 w-48"
            >
              <option value="">All types</option>
              {NOTE_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          )}
        </div>

        {loadingNotes ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading notes…" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="glass p-12 text-center">
            <BookOpen size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No notes yet</p>
            <p className="text-xs text-slate-400 mt-1">Generate your first note above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <div key={note._id || note.id} className="relative">
                <NoteCard note={note} />
                <button
                  onClick={() => handleDelete(note._id || note.id)}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg
                             text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                             transition-all duration-150"
                  aria-label="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
