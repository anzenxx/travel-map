interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        background: 'var(--theme-overlay)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: 380,
          maxWidth: '100%',
          background: 'var(--theme-panel)',
          border: '0.5px solid var(--theme-panel-border)',
          borderRadius: 16,
          boxShadow: 'var(--theme-shadow)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{ padding: '16px 18px 10px', borderBottom: '0.5px solid var(--theme-divider)' }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: danger ? 'var(--theme-danger)' : 'var(--theme-accent-strong)',
              marginBottom: 6
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--theme-text-muted)' }}>
            {message}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 18px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '0.5px solid var(--theme-panel-border)',
              background: 'var(--theme-button-bg)',
              color: 'var(--theme-text)',
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: danger ? '1px solid var(--theme-danger-border)' : 'none',
              background: danger ? 'var(--theme-danger)' : 'var(--theme-accent-soft)',
              color: 'var(--theme-paper)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
