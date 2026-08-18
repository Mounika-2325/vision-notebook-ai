import React, { useEffect, useState, useCallback } from 'react'
import {
  FileText, Trash2, MessageSquare, BookOpen, Download,
  CheckCircle, ChevronDown, ChevronUp, File, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import FileUploadZone from '../components/FileUploadZone'
import LoadingSpinner from '../components/LoadingSpinner'
import { uploadDocument, getDocuments, deleteDocument } from '../api'

function formatBytes(b) {
  if (!b) return '0 B'
  const k = 1024; const u = ['B','KB','MB','GB']
  const i = Math.floor(Math.log(b) / Math.log(k))
  return `${(b / Math.pow(k, i)).toFixed(1)} ${u[i]}`
}

function getMimeIcon(mime) {
  if (mime?.includes('pdf')) return '📄'
  if (mime?.includes('word') || mime?.includes('doc')) return '📝'
  return '📃'
}

function DocCard({ doc, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="glass-sm p-4 hover:shadow-lg transition-all duration-200 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{getMimeIcon(doc.mimeType)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.originalName}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatBytes(doc.size)} · {doc.wordCount?.toLocaleString() || 0} words
                · {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {doc.isProcessed
                ? <span className="badge badge-green"><CheckCircle size={10} /> Processed</span>
                : <span className="badge badge-amber"><AlertCircle size={10} /> Pending</span>
              }
              <button
                id={`delete-doc-${doc._id || doc.id}`}
                onClick={() => onDelete(doc._id || doc.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg
                           text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                           transition-colors duration-150"
                aria-label="Delete document"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Summary */}
          {doc.summary && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
              {doc.summary}
            </p>
          )}

          {/* Topics */}
          {doc.topics?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {doc.topics.map((t, i) => <span key={i} className="badge badge-violet">{t}</span>)}
            </div>
          )}

          {/* Key points expandable */}
          {doc.keyPoints?.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(p => !p)}
                className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
              >
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {expanded ? 'Hide' : 'Show'} Key Points ({doc.keyPoints.length})
              </button>
              {expanded && (
                <ul className="mt-2 space-y-1">
                  {doc.keyPoints.map((pt, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span className="text-violet-400 mt-0.5">•</span>{pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DocumentUpload() {
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadDocs = useCallback(async () => {
    try {
      const res = await getDocuments()
      setDocuments(res.documents || [])
    } catch {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadDocs() }, [loadDocs])

  const handleFile = async file => {
    setUploading(true)
    setProgress(0)
    const formData = new FormData()
    formData.append('document', file)
    try {
      const res = await uploadDocument(formData, p => setProgress(p))
      toast.success(`✅ "${file.name}" uploaded and processed!`)
      setDocuments(prev => [res.document, ...prev])
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this document?')) return
    try {
      await deleteDocument(id)
      setDocuments(prev => prev.filter(d => (d._id || d.id) !== id))
      toast.success('Document deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  const filtered = documents.filter(d =>
    !search || d.originalName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="section-title">Document Upload</h2>
        <p className="section-sub">Upload PDF, DOCX, or TXT files. AI will extract text and generate summaries automatically.</p>
      </div>

      {/* Upload zone */}
      <div className="glass p-6">
        <FileUploadZone
          accept=".pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onFile={handleFile}
          uploading={uploading}
          progress={progress}
          label="Upload Document"
          sublabel="Drag & drop PDF, DOCX, or TXT — Max 25 MB"
          type="document"
        />
      </div>

      {/* Supported formats */}
      <div className="flex flex-wrap gap-2">
        {['PDF', 'DOCX', 'DOC', 'TXT'].map(f => (
          <span key={f} className="badge badge-violet">
            <File size={10} /> {f}
          </span>
        ))}
        <span className="text-xs text-slate-400 self-center ml-1">Supported formats · Max 25 MB</span>
      </div>

      {/* Documents list */}
      <div>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h3 className="section-title">
            Your Documents
            {documents.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-400">({documents.length})</span>
            )}
          </h3>
          {documents.length > 3 && (
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="input text-xs py-2 w-48"
            />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading documents…" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass p-12 text-center">
            <FileText size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {search ? 'No documents match your search' : 'No documents uploaded yet'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Upload a document above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(doc => (
              <DocCard key={doc._id || doc.id} doc={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
