import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMapExport } from '../hooks/useMapExport'
import { useStore } from '../store'
import { ACHIEVEMENT_EVENTS_SETTINGS_KEY, stringifyAchievementEvents } from '../utils/achievements'

export default function ExportButton() {
  const { t } = useTranslation()
  const { exportPng } = useMapExport()
  const { achievementEvents, markAchievementEvent } = useStore()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    if (!status) return

    const timeoutId = window.setTimeout(() => setStatus(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [status])

  const handle = async () => {
    setLoading(true)
    setStatus(null)
    try {
      await exportPng()
      if (!achievementEvents.exportedMap) {
        markAchievementEvent('exportedMap')
        await window.api.settings.set(
          ACHIEVEMENT_EVENTS_SETTINGS_KEY,
          stringifyAchievementEvents({ ...achievementEvents, exportedMap: true })
        )
      }
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <button
        onClick={handle}
        disabled={loading}
        title={t('settings.exportPng')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 8,
          border: '0.5px solid var(--theme-panel-border)',
          background: loading ? 'var(--theme-button-bg-hover)' : 'var(--theme-button-bg)',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 12,
          color: 'var(--theme-text)',
          fontFamily: 'system-ui, sans-serif',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.15s'
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1v8M4 6l3 3 3-3M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {loading ? '...' : t('settings.exportPng')}
      </button>
      {status && (
        <span
          style={{
            fontSize: 12,
            color: status === 'success' ? 'var(--theme-accent-strong)' : 'var(--theme-danger)'
          }}
        >
          {status === 'success' ? t('settings.exportSuccess') : t('settings.exportError')}
        </span>
      )}
    </div>
  )
}
