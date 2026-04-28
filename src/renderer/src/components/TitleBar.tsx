import { CSSProperties, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import appIcon from '../assets/app-icon.png'

const TITLE_BAR_HEIGHT = 38
const DRAG_REGION_STYLE = { WebkitAppRegion: 'drag' } as CSSProperties
const NO_DRAG_REGION_STYLE = { WebkitAppRegion: 'no-drag' } as CSSProperties

export default function TitleBar() {
  const { t } = useTranslation()
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    window.api.window.isMaximized().then(setIsMaximized)

    const handleResize = () => {
      window.api.window.isMaximized().then(setIsMaximized)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMaximize = async () => {
    await window.api.window.toggleMaximize()
    setTimeout(() => {
      window.api.window.isMaximized().then(setIsMaximized)
    }, 30)
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: TITLE_BAR_HEIGHT,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        background: 'color-mix(in srgb, var(--theme-panel) 92%, var(--theme-paper))',
        borderBottom: '0.5px solid var(--theme-panel-border)',
        color: 'var(--theme-text)',
        zIndex: 500,
        ...DRAG_REGION_STYLE
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 14px',
          minWidth: 0
        }}
      >
        <img
          src={appIcon}
          alt=""
          style={{
            width: 16,
            height: 16,
            objectFit: 'contain',
            borderRadius: 4,
            flexShrink: 0
          }}
        />
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: 'var(--theme-accent-strong)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          Atlas Travel
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          ...NO_DRAG_REGION_STYLE
        }}
      >
        <WindowButton
          title={t('window.minimize')}
          onClick={() => window.api.window.minimize()}
          icon={
            <span
              style={{
                display: 'block',
                width: 14,
                height: 1.6,
                borderRadius: 999,
                background: 'currentColor',
                transform: 'translateY(5px)'
              }}
            />
          }
        />
        <WindowButton
          icon={<span>{isMaximized ? '❐' : '□'}</span>}
          title={isMaximized ? t('window.restore') : t('window.maximize')}
          onClick={toggleMaximize}
        />
        <WindowButton
          icon={<span>×</span>}
          title={t('window.close')}
          onClick={() => window.api.window.close()}
          danger
        />
      </div>
    </div>
  )
}

function WindowButton({
  icon,
  title,
  onClick,
  danger = false
}: {
  icon: React.ReactNode
  title: string
  onClick: () => void | Promise<void>
  danger?: boolean
}) {
  return (
    <button
      title={title}
      onClick={() => void onClick()}
      style={{
        width: 46,
        height: TITLE_BAR_HEIGHT,
        border: 'none',
        borderLeft: '0.5px solid var(--theme-divider)',
        background: 'transparent',
        color: danger ? 'var(--theme-danger)' : 'var(--theme-text)',
        cursor: 'pointer',
        fontSize: danger ? 18 : 12,
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s ease, color 0.15s ease'
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = danger
          ? 'var(--theme-danger-bg)'
          : 'var(--theme-button-bg-hover)'
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = 'transparent'
      }}
    >
      {icon}
    </button>
  )
}

export { TITLE_BAR_HEIGHT }
