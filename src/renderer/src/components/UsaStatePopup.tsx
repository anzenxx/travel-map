import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { STATUS_COLORS, CountryStatus } from '../types'
import { getUsStateName } from '../utils/usa'

const STATUSES: CountryStatus[] = ['visited', 'resident', 'homeland', 'wishlist']

interface Props {
  code: string
  position: { x: number; y: number }
}

export default function UsaStatePopup({ code, position }: Props) {
  const { t, i18n } = useTranslation()
  const { usStates, upsertUsState, removeUsState, closePopup } = useStore()
  const popupRef = useRef<HTMLDivElement>(null)
  const [adjustedPos, setAdjustedPos] = useState(position)
  const currentStatus = usStates[code]

  useEffect(() => {
    if (!popupRef.current) return
    const rect = popupRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let { x, y } = position
    if (x + rect.width + 10 > vw) x = vw - rect.width - 10
    if (y + rect.height + 10 > vh) y = vh - rect.height - 10
    if (y < 10) y = 10
    setAdjustedPos({ x, y })
  }, [position])

  const persistStates = async (nextStates: Record<string, CountryStatus>) => {
    await window.api.settings.set('usStates', JSON.stringify(nextStates))
  }

  const handleStatus = async (status: CountryStatus) => {
    if (currentStatus === status) {
      const nextStates = { ...usStates }
      delete nextStates[code]
      removeUsState(code)
      await persistStates(nextStates)
      return
    }

    const nextStates = { ...usStates, [code]: status }
    upsertUsState(code, status)
    await persistStates(nextStates)
  }

  return (
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        left: adjustedPos.x,
        top: adjustedPos.y,
        zIndex: 1000,
        background: 'var(--theme-panel)',
        border: '0.5px solid var(--theme-panel-border)',
        borderRadius: 12,
        boxShadow: 'var(--theme-shadow)',
        minWidth: 220,
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
        color: 'var(--theme-text)'
      }}
    >
      <button
        onClick={closePopup}
        aria-label={t('common.close')}
        title={t('common.close')}
        style={{
          position: 'absolute',
          top: 7,
          right: 7,
          width: 26,
          height: 26,
          border: '0.5px solid var(--theme-panel-border)',
          borderRadius: '50%',
          background: 'var(--theme-button-bg)',
          color: 'var(--theme-text-muted)',
          cursor: 'pointer',
          fontSize: 18,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        ×
      </button>
      <div
        style={{
          padding: '10px 44px 8px 14px',
          borderBottom: '0.5px solid var(--theme-divider)',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--theme-accent-strong)'
        }}
      >
        {getUsStateName(code, i18n.language)}
        <div
          style={{ marginTop: 3, fontSize: 11, fontWeight: 400, color: 'var(--theme-text-soft)' }}
        >
          {t('map.usState')}
        </div>
      </div>

      <div style={{ padding: '8px 14px 10px' }}>
        <div style={{ fontSize: 11, color: 'var(--theme-text-muted)', marginBottom: 6 }}>
          {t('map.setStatus')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleStatus(status)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 8px',
                border:
                  currentStatus === status
                    ? `1.5px solid ${STATUS_COLORS[status]}`
                    : '0.5px solid var(--theme-panel-border)',
                borderRadius: 6,
                background:
                  currentStatus === status ? 'var(--theme-button-active-bg)' : 'transparent',
                cursor: 'pointer',
                fontSize: 11,
                color: currentStatus === status ? STATUS_COLORS[status] : 'var(--theme-text)',
                fontWeight: currentStatus === status ? 500 : 400
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: STATUS_COLORS[status],
                  flexShrink: 0
                }}
              />
              {t(`status.${status}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
