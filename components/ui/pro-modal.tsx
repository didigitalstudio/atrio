'use client'

import { X } from 'lucide-react'

export function ProModal({ feature, onClose }: { feature: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-line"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[3px] text-brand bg-brand-soft px-2 py-1 rounded-md">
            Plan Pro
          </span>
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition ml-2">
            <X size={18} />
          </button>
        </div>
        <h3 className="text-lg font-bold text-ink mb-2">{feature} requiere el plan Pro</h3>
        <p className="text-sm text-ink-soft mb-5 leading-relaxed">
          Esta función está disponible en el plan Pro. Contactanos y la activamos en menos de 24 horas hábiles.
        </p>
        <div className="flex gap-2">
          <a
            href="mailto:info@didigitalstudio.com?subject=Consulta%20plan%20Pro%20-%20Atrio"
            className="flex-1 text-center bg-brand text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-deep transition"
          >
            Contactar a DI Digital
          </a>
          <button
            onClick={onClose}
            className="px-4 rounded-xl border border-line text-ink-soft text-sm hover:bg-bg-soft transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
