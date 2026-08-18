import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Send, MessageSquare, FileText, Plus, Clock, Bot } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatBubble from '../components/ChatBubble'
import LoadingSpinner from '../components/LoadingSpinner'
import { getDocuments, sendChatMessage, getChatSession } from '../api'

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <Bot size={15} className="text-white" />
      </div>
      <div className="glass-sm px-4 py-3 flex items-center gap-1.5">
        {[0,1,2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Chat() {
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingDocs, setLoadingDocs] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    getDocuments()
      .then(res => setDocuments((res.documents || []).filter(d => d.isProcessed)))
      .catch(() => toast.error('Failed to load documents'))
      .finally(() => setLoadingDocs(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const handleDocChange = (docId) => {
    const doc = documents.find(d => (d._id || d.id) === docId)
    setSelectedDoc(doc)
    setSessionId(null)
    setMessages([])
    inputRef.current?.focus()
  }

  const sendMessage = async () => {
    if (!input.trim() || !selectedDoc || sending) return

    const userMsg = { role: 'user', content: input.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const res = await sendChatMessage(selectedDoc._id || selectedDoc.id, userMsg.content, sessionId)
      setSessionId(res.sessionId)
      setMessages(res.messages || [])
    } catch (err) {
      toast.error(err.message || 'Failed to send message')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setSending(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const newChat = () => {
    setMessages([])
    setSessionId(null)
    inputRef.current?.focus()
  }

  const suggestedQuestions = [
    'What is this document about?',
    'Summarize the key points',
    'What are the main conclusions?',
    'List the most important facts'
  ]

  return (
    <div className="max-w-4xl mx-auto animate-fade-in h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="section-title">AI Chat</h2>
          <p className="section-sub">Chat with your documents using Gemini AI</p>
        </div>
        {messages.length > 0 && (
          <button onClick={newChat} className="btn-secondary text-xs">
            <Plus size={14} /> New Chat
          </button>
        )}
      </div>

      {/* Document selector */}
      <div className="glass p-4 flex items-center gap-3">
        <FileText size={18} className="text-violet-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <label htmlFor="doc-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Select Document
          </label>
          {loadingDocs ? (
            <div className="text-xs text-slate-400">Loading documents…</div>
          ) : documents.length === 0 ? (
            <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Clock size={12} />
              No processed documents found. Upload and process a document first.
            </div>
          ) : (
            <select
              id="doc-select"
              value={selectedDoc?._id || selectedDoc?.id || ''}
              onChange={e => handleDocChange(e.target.value)}
              className="input py-1.5 text-sm"
            >
              <option value="">— Choose a document —</option>
              {documents.map(doc => (
                <option key={doc._id || doc.id} value={doc._id || doc.id}>
                  {doc.originalName} ({doc.wordCount?.toLocaleString()} words)
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 glass overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {!selectedDoc ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-violet-400" />
              </div>
              <p className="text-slate-500 font-medium mb-1">Select a document to start chatting</p>
              <p className="text-xs text-slate-400">Ask questions, get summaries, explore your content with AI</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center mb-4">
                <Bot size={24} className="text-emerald-500" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Ready to chat about "{selectedDoc.originalName}"
              </p>
              <p className="text-xs text-slate-400 mb-6">Ask me anything about this document</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                {suggestedQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus() }}
                    className="px-3 py-1.5 rounded-full text-xs border border-violet-200 dark:border-violet-800
                               text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20
                               transition-colors duration-150"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}
              {sending && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-3 sm:p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={selectedDoc ? `Ask about "${selectedDoc.originalName}"…` : 'Select a document to start chatting'}
              disabled={!selectedDoc || sending}
              className="input text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              id="send-message-btn"
              onClick={sendMessage}
              disabled={!input.trim() || !selectedDoc || sending}
              className="btn-primary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Send size={16} />
              }
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
