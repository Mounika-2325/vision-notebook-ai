import React from 'react'
import { TrendingUp } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, color = 'violet', trend, sub }) {
  const gradients = {
    violet: 'from-violet-500 to-indigo-500',
    indigo: 'from-indigo-500 to-blue-500',
    cyan: 'from-cyan-500 to-teal-500',
    emerald: 'from-emerald-500 to-green-500',
    amber: 'from-amber-500 to-orange-500',
    pink: 'from-pink-500 to-rose-500'
  }

  const bgLight = {
    violet: 'bg-violet-50 dark:bg-violet-900/20',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    pink: 'bg-pink-50 dark:bg-pink-900/20'
  }

  const textColor = {
    violet: 'text-violet-600 dark:text-violet-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
    pink: 'text-pink-600 dark:text-pink-400'
  }

  const gradient = gradients[color] || gradients.violet

  return (
    <div className="glass p-5 hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bgLight[color]} flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className={textColor[color]} />
        </div>
        {trend != null && (
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>

      <div>
        <p className={`text-3xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent mb-0.5`}>
          {value}
        </p>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
