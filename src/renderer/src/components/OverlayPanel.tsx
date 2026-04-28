interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: number
  maxHeight?: string
}

export default function OverlayPanel({
  title,
  onClose,
  children,
  width = 760,
  maxHeight = 'calc(100vh - 48px)'
}: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
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
          width: `min(${width}px, calc(100vw - 48px))`,
          maxHeight,
          background: 'var(--theme-panel)',
          border: '0.5px solid var(--theme-panel-border)',
          borderRadius: 20,
          boxShadow: 'var(--theme-shadow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif',
          color: 'var(--theme-text)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px 14px',
            borderBottom: '0.5px solid var(--theme-divider)'
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--theme-accent-strong)' }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 22,
              color: 'var(--theme-text-soft)',
              lineHeight: 1,
              padding: 0
            }}
          >
            ×
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: '18px 20px 22px' }}>{children}</div>
      </div>
    </div>
  )
}
