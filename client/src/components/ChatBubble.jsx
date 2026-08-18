import React from 'react'
import { Bot, User } from 'lucide-react'

export default function ChatBubble({ role, content, timestamp }) {
  const isUser = role === 'user'

  const formatTime = ts => {
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 self-end
                       ${isUser
                         ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                         : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                       } shadow-md`}>
        {isUser
          ? <User size={15} className="text-white" />
          : <Bot size={15} className="text-white" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] space-y-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${isUser
                          ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                        }`}>
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
        {timestamp && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1">
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  )
}
