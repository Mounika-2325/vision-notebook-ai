import React, { useRef, useState } from 'react'
import { Upload, File, Image, X, CheckCircle, AlertCircle } from 'lucide-react'

export default function FileUploadZone({
  accept,
  onFile,
  uploading,
  progress,
  label = 'Upload File',
  sublabel = 'Drag and drop or click to browse',
  type = 'document' // 'document' | 'image'
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [dragError, setDragError] = useState('')

  const Icon = type === 'image' ? Image : File

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    setDragError('')
    const file = e.dataTransfer.files[0]
    if (file) validateAndSend(file)
  }

  const validateAndSend = file => {
    if (accept) {
      const exts = accept.split(',').map(a => a.trim())
      const mime = file.type
      const name = file.name.toLowerCase()
      const ok = exts.some(ext => {
        if (ext.startsWith('.')) return name.endsWith(ext)
        return mime.includes(ext.replace('*', ''))
      })
      if (!ok) {
        setDragError(`Invalid file type. Accepted: ${accept}`)
        return
      }
    }
    onFile(file)
  }

  const handleChange = e => {
    const file = e.target.files[0]
    if (file) validateAndSend(file)
    e.target.value = ''
  }

  return (
    <div
      className={`upload-zone rounded-2xl p-8 text-center cursor-pointer select-none
                  ${dragging ? 'active' : ''}
                  ${uploading ? 'pointer-events-none opacity-70' : ''}`}
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="File upload zone"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        aria-label="File input"
      />

      {/* Icon area */}
      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4
                       transition-all duration-300
                       ${dragging
                         ? 'bg-violet-100 dark:bg-violet-900/30 scale-110'
                         : 'bg-slate-100 dark:bg-slate-800'
                       }`}>
        {uploading ? (
          <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Icon size={28} className={dragging ? 'text-violet-500' : 'text-slate-400 dark:text-slate-500'} />
        )}
      </div>

      {/* Text */}
      {uploading ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {progress < 100 ? `Uploading… ${progress}%` : 'Processing with AI…'}
          </p>
          <div className="w-full max-w-xs mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">This may take a moment…</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{sublabel}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                          bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold
                          transition-colors duration-200 shadow-md shadow-violet-500/20">
            <Upload size={13} />
            Browse Files
          </div>
        </>
      )}

      {/* Error */}
      {dragError && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-500">
          <AlertCircle size={13} />
          {dragError}
        </div>
      )}
    </div>
  )
}
