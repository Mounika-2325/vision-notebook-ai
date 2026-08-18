import React, { useEffect, useState, useRef } from 'react'
import {
  Eye, Tag, Type, Palette, Smile, Layers,
  Send, Trash2, Info, AlertCircle, Maximize2
} from 'lucide-react'
import toast from 'react-hot-toast'
import FileUploadZone from '../components/FileUploadZone'
import LoadingSpinner from '../components/LoadingSpinner'
import { uploadImage, getImages, deleteImage, askImageQuestion } from '../api'

function AnalysisRow({ icon: Icon, label, value, color = 'violet' }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className={`w-6 h-6 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon size={12} className={`text-${color}-600 dark:text-${color}-400`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1.5">
            {value.map((v, i) => <span key={i} className={`badge badge-${color}`}>{v}</span>)}
          </div>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{value}</p>
        )}
      </div>
    </div>
  )
}

function ImageQA({ image }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [asking, setAsking] = useState(false)

  const ask = async () => {
    if (!question.trim()) return
    setAsking(true)
    setAnswer('')
    try {
      const res = await askImageQuestion(image._id || image.id, question)
      setAnswer(res.answer)
    } catch (err) {
      toast.error(err.message || 'Failed to get answer')
    } finally {
      setAsking(false)
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Ask about this image</p>
      <div className="flex gap-2">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && ask()}
          placeholder="What is in the background?"
          className="input text-sm py-2 flex-1"
        />
        <button
          id="ask-image-btn"
          onClick={ask}
          disabled={asking || !question.trim()}
          className="btn-primary px-3 py-2 disabled:opacity-50"
          aria-label="Send question"
        >
          {asking ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Send size={15} />}
        </button>
      </div>
      {answer && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed animate-slide-up">
          {answer}
        </div>
      )}
    </div>
  )
}

function ImageCard({ image, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="glass-sm overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up">
      {/* Image */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden group">
        <img
          src={image.url}
          alt={image.originalName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
            <span className="text-white text-xs font-medium truncate">{image.originalName}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(image._id || image.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center
                     text-white/80 hover:text-red-400 hover:bg-black/60 transition-all duration-150
                     opacity-0 group-hover:opacity-100"
          aria-label="Delete image"
        >
          <Trash2 size={13} />
        </button>
        {image.isAnalyzed && (
          <div className="absolute top-2 left-2 badge badge-green">
            <Eye size={9} /> Analyzed
          </div>
        )}
      </div>

      {/* Analysis */}
      <div className="p-4">
        {image.summary && (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">{image.summary}</p>
        )}

        <button
          onClick={() => setExpanded(p => !p)}
          className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1"
        >
          <Info size={11} />
          {expanded ? 'Hide' : 'Show'} full analysis
        </button>

        {expanded && (
          <div className="mt-3 space-y-0 animate-fade-in">
            <AnalysisRow icon={Layers}   label="Description" value={image.description} color="violet" />
            <AnalysisRow icon={Tag}      label="Objects"     value={image.objects}     color="cyan"   />
            <AnalysisRow icon={Type}     label="Text (OCR)"  value={image.ocrText}     color="indigo" />
            <AnalysisRow icon={Palette}  label="Colors"      value={image.colors}      color="amber"  />
            <AnalysisRow icon={Smile}    label="Mood"        value={image.mood}        color="emerald"/>
            {image.details && <AnalysisRow icon={Info} label="Details" value={image.details} color="pink" />}
          </div>
        )}

        <ImageQA image={image} />
      </div>
    </div>
  )
}

export default function ImageAnalysis() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getImages()
      .then(res => setImages(res.images || []))
      .catch(() => toast.error('Failed to load images'))
      .finally(() => setLoading(false))
  }, [])

  const handleFile = async file => {
    setUploading(true)
    setProgress(0)
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await uploadImage(fd, p => setProgress(p))
      toast.success(`🖼️ "${file.name}" analyzed!`)
      setImages(prev => [res.image, ...prev])
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this image?')) return
    try {
      await deleteImage(id)
      setImages(prev => prev.filter(i => (i._id || i.id) !== id))
      toast.success('Image deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="section-title">Image Analysis</h2>
        <p className="section-sub">Upload images to analyze with Gemini Vision AI — detect objects, read text, and describe scenes.</p>
      </div>

      {/* Upload */}
      <div className="glass p-6">
        <FileUploadZone
          accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
          onFile={handleFile}
          uploading={uploading}
          progress={progress}
          label="Upload Image for Analysis"
          sublabel="Drag & drop JPG, PNG, GIF, WebP — Max 10 MB"
          type="image"
        />
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Eye, label: 'Object Detection', color: 'violet' },
          { icon: Type, label: 'OCR Text', color: 'indigo' },
          { icon: Layers, label: 'Scene Description', color: 'cyan' },
          { icon: Tag, label: 'Image Q&A', color: 'emerald' }
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className={`glass-sm p-3 text-center`}>
            <Icon size={18} className={`text-${color}-500 mx-auto mb-1.5`} />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Images grid */}
      <div>
        <h3 className="section-title mb-4">
          Analyzed Images
          {images.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({images.length})</span>}
        </h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading images…" />
          </div>
        ) : images.length === 0 ? (
          <div className="glass p-12 text-center">
            <AlertCircle size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No images analyzed yet</p>
            <p className="text-xs text-slate-400 mt-1">Upload an image above to begin vision analysis</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(img => (
              <ImageCard key={img._id || img.id} image={img} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
