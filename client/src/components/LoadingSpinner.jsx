import React from 'react'

export default function LoadingSpinner({ size = 'md', label = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={label || 'Loading'}>
      <div className={`${sizes[size]} border-violet-200 dark:border-violet-800 border-t-violet-500 rounded-full animate-spin`} />
      {label && <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{label}</p>}
    </div>
  )
}
