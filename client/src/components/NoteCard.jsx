import React, { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

// ── Short/Detailed Summary ──────────────────────────────────────
function SummaryCard({ content, type }) {
  if (type === 'short-summary') {
    return (
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-100 dark:border-violet-800/30">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm ai-prose">
            {content.summary}
          </p>
        </div>
        {content.wordCount && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            ~{content.wordCount.toLocaleString()} words in document
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {content.introduction && (
        <div className="glass-sm p-4">
          <h4 className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2">Introduction</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{content.introduction}</p>
        </div>
      )}
      {content.mainPoints?.length > 0 && (
        <div className="glass-sm p-4">
          <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">Main Points</h4>
          <ul className="space-y-2">
            {content.mainPoints.map((pt, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                {pt}
              </li>
            ))}
          </ul>
        </div>
      )}
      {content.conclusion && (
        <div className="glass-sm p-4">
          <h4 className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2">Conclusion</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{content.conclusion}</p>
        </div>
      )}
      {content.keyTakeaways?.length > 0 && (
        <div className="glass-sm p-4">
          <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">Key Takeaways</h4>
          <div className="flex flex-wrap gap-2">
            {content.keyTakeaways.map((t, i) => (
              <span key={i} className="badge badge-green">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Bullet Notes ────────────────────────────────────────────────
function BulletNotes({ content }) {
  return (
    <div className="space-y-4">
      {(content.sections || []).map((section, i) => (
        <div key={i} className="glass-sm p-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
            {section.heading}
          </h4>
          <ul className="space-y-1.5">
            {(section.points || []).map((pt, j) => (
              <li key={j} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ── Mind Map ────────────────────────────────────────────────────
function MindMap({ content }) {
  const colors = ['violet', 'indigo', 'cyan', 'emerald', 'amber', 'pink']
  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-violet-500/25">
          {content.centralTopic}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(content.branches || []).map((branch, i) => {
          const c = colors[i % colors.length]
          return (
            <div key={i} className={`p-4 rounded-2xl border bg-${c}-50 dark:bg-${c}-900/10 border-${c}-100 dark:border-${c}-800/30`}>
              <h4 className={`text-sm font-bold text-${c}-700 dark:text-${c}-300 mb-2`}>{branch.topic}</h4>
              <ul className="space-y-1">
                {(branch.subtopics || []).map((sub, j) => (
                  <li key={j} className={`text-xs text-${c}-600 dark:text-${c}-400 flex gap-1.5`}>
                    <span>→</span>{sub}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Flashcards ──────────────────────────────────────────────────
function Flashcards({ content }) {
  const cards = content.cards || []
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(new Set())

  const current = cards[idx]
  if (!current) return <p className="text-slate-400 text-sm">No flashcards generated.</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Card {idx + 1} of {cards.length}</span>
        <span>{known.size} known</span>
      </div>

      {/* Card */}
      <div
        className="cursor-pointer select-none h-52 rounded-2xl glass flex items-center justify-center p-6 text-center transition-all duration-200 hover:shadow-2xl"
        onClick={() => setFlipped(p => !p)}
      >
        <div>
          <div className={`badge mb-3 ${flipped ? 'badge-cyan' : 'badge-violet'}`}>
            {flipped ? 'Answer' : 'Question'}
          </div>
          <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {flipped ? current.back : current.front}
          </p>
          <p className="text-[11px] text-slate-400 mt-3">Click to flip</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => { setIdx(p => Math.max(0, p - 1)); setFlipped(false) }}
          disabled={idx === 0}
          className="btn-secondary px-3 py-2 disabled:opacity-40"
          aria-label="Previous card"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => { setKnown(p => new Set([...p, idx])); setIdx(p => Math.min(cards.length - 1, p + 1)); setFlipped(false) }}
          className="btn-primary py-2 text-xs"
          aria-label="Mark as known"
        >
          <CheckCircle size={14} /> Got it
        </button>
        <button
          onClick={() => { setIdx(p => Math.min(cards.length - 1, p + 1)); setFlipped(false) }}
          disabled={idx === cards.length - 1}
          className="btn-secondary px-3 py-2 disabled:opacity-40"
          aria-label="Next card"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Progress */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((idx + 1) / cards.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ── Quiz Questions ───────────────────────────────────────────────
function QuizQuestions({ content }) {
  const questions = content.questions || []
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.answer).length
    : 0

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="glass-sm p-5 space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span className="text-violet-500 mr-2">{i + 1}.</span>{q.question}
          </p>
          <div className="space-y-2">
            {(q.options || []).map((opt, j) => {
              const letter = opt.charAt(0)
              const isSelected = answers[i] === letter
              const isCorrect = submitted && q.answer === letter
              const isWrong = submitted && isSelected && !isCorrect

              return (
                <button
                  key={j}
                  onClick={() => !submitted && setAnswers(p => ({ ...p, [i]: letter }))}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-150
                             border ${!submitted ? 'cursor-pointer' : 'cursor-default'}
                             ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                               : isWrong ? 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-300'
                               : isSelected ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300'
                               : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/10'
                             }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {submitted && q.explanation && (
            <p className="text-xs text-slate-500 dark:text-slate-400 border-l-2 border-violet-300 pl-3">
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between">
        {submitted ? (
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-gradient">{score}/{questions.length}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {score === questions.length ? '🎉 Perfect score!' : score >= questions.length / 2 ? '👍 Good job!' : '💪 Keep studying!'}
            </p>
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={() => submitted
            ? (setAnswers({}), setSubmitted(false))
            : setSubmitted(true)
          }
          className="btn-primary"
        >
          {submitted ? (<><RotateCcw size={14} /> Retry</>) : 'Submit Quiz'}
        </button>
      </div>
    </div>
  )
}

// ── Main NoteCard ────────────────────────────────────────────────
export default function NoteCard({ note }) {
  const { type, content, title, documentName, createdAt } = note

  const typeLabels = {
    'short-summary': { label: 'Short Summary', color: 'badge-violet' },
    'detailed-summary': { label: 'Detailed Summary', color: 'badge-indigo' },
    'bullet-notes': { label: 'Bullet Notes', color: 'badge-cyan' },
    'mind-map': { label: 'Mind Map', color: 'badge-amber' },
    'flashcards': { label: 'Flashcards', color: 'badge-green' },
    'quiz-questions': { label: 'Quiz', color: 'badge-violet' }
  }

  const meta = typeLabels[type] || { label: type, color: 'badge-violet' }

  const renderContent = () => {
    switch (type) {
      case 'short-summary':
      case 'detailed-summary':
        return <SummaryCard content={content} type={type} />
      case 'bullet-notes':
        return <BulletNotes content={content} />
      case 'mind-map':
        return <MindMap content={content} />
      case 'flashcards':
        return <Flashcards content={content} />
      case 'quiz-questions':
        return <QuizQuestions content={content} />
      default:
        return (
          <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
            {JSON.stringify(content, null, 2)}
          </pre>
        )
    }
  }

  return (
    <div className="glass p-5 space-y-4 animate-slide-up">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={meta.color}>{meta.label}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[180px]">{documentName}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
            {title || 'Generated Notes'}
          </h3>
        </div>
        {createdAt && (
          <span className="text-[10px] text-slate-400 flex-shrink-0">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="divider" />
      {renderContent()}
    </div>
  )
}
