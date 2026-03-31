import { AlertCircle, CheckCircle2, X } from 'lucide-react'

function Modal({ isOpen, title, message, type = 'info', confirmText = 'OK', cancelText, onConfirm, onCancel }) {
  if (!isOpen) return null

  const styles = {
    success: 'bg-emerald-100 text-emerald-700',
    error: 'bg-rose-100 text-rose-700',
    info: 'bg-sky-100 text-sky-700',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${styles[type]}`}>
              {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel || onConfirm}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-6 text-sm text-slate-600">{message}</p>
        <div className="flex justify-end gap-3">
          {cancelText && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
