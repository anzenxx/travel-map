import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getTabIconSrc } from '../assets/tabIcons'
import { useStore } from '../store'
import { STATUS_COLORS, CountryStatus, AppTab } from '../types'
import {
  computeDisplayStats,
  countMarkedUsStates,
  TOTAL_COUNTRIES,
  TOTAL_US_STATES
} from '../utils/usa'

const STATUSES: { key: CountryStatus; label: string }[] = [
  { key: 'homeland', label: 'status.homeland' },
  { key: 'resident', label: 'status.resident' },
  { key: 'visited', label: 'status.visited' },
  { key: 'wishlist', label: 'status.wishlist' }
]

const TABS: { key: AppTab; icon: string; label: string }[] = [
  { key: 'map', icon: '◉', label: 'tabs.map' },
  { key: 'countries', icon: '☰', label: 'tabs.countries' },
  { key: 'stats', icon: '▦', label: 'tabs.stats' },
  { key: 'timeline', icon: '↧', label: 'tabs.timeline' },
  { key: 'achievements', icon: '★', label: 'tabs.achievements' },
  { key: 'settings', icon: '⚙', label: 'tabs.settings' },
  { key: 'about', icon: 'i', label: 'tabs.about' }
]

export default function BottomBar() {
  const { t } = useTranslation()
  const { stats, countries, usaMode, usStates, activeTab, setActiveTab } = useStore()
  const [theme, setTheme] = useState<'atlas' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'atlas'
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'atlas'
  })
  const displayStats = computeDisplayStats(countries, stats, usaMode, usStates)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const syncTheme = () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'atlas')
    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    return () => observer.disconnect()
  }, [])

  const visitedCount =
    displayStats.byStatus
      ?.filter((s) => ['visited', 'resident', 'homeland'].includes(s.status))
      ?.reduce((a, b) => a + b.count, 0) ?? 0

  const worldPercent = Math.round((visitedCount / TOTAL_COUNTRIES) * 100)
  const cityCount = displayStats.totalCities
  const markedStates = countMarkedUsStates(usStates)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 16px 14px',
        pointerEvents: 'none',
        zIndex: 100
      }}
    >
      {/* Легенда — слева */}
      <div
        style={{
          background: 'var(--theme-button-bg)',
          backdropFilter: 'blur(8px)',
          border: '0.5px solid var(--theme-panel-border)',
          borderRadius: 10,
          padding: '8px 12px',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 5
        }}
      >
        {STATUSES.map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: STATUS_COLORS[key],
                flexShrink: 0
              }}
            />
            <span style={{ fontSize: 11, color: 'var(--theme-text-muted)' }}>{t(label)}</span>
          </div>
        ))}
      </div>

      {/* Статистика — центр */}
      <div
        style={{
          background: 'var(--theme-button-bg)',
          backdropFilter: 'blur(8px)',
          border: '0.5px solid var(--theme-panel-border)',
          borderRadius: 999,
          padding: '7px 20px',
          pointerEvents: 'auto',
          fontSize: 12,
          color: 'var(--theme-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        <strong style={{ color: 'var(--theme-text)', fontWeight: 500 }}>{visitedCount}</strong>{' '}
        {t('stats.countriesLabel')}
        <span style={{ color: 'var(--theme-text-soft)' }}>·</span>
        <strong style={{ color: 'var(--theme-text)', fontWeight: 500 }}>
          {worldPercent}%
        </strong>{' '}
        {t('stats.worldLabel')}
        <span style={{ color: 'var(--theme-text-soft)' }}>·</span>
        <strong style={{ color: 'var(--theme-text)', fontWeight: 500 }}>{cityCount}</strong>{' '}
        {t('stats.citiesLabel')}
        {usaMode === 'states' && (
          <>
            <span style={{ color: 'var(--theme-text-soft)' }}>·</span>
            <strong style={{ color: 'var(--theme-text)', fontWeight: 500 }}>
              {markedStates}/{TOTAL_US_STATES}
            </strong>{' '}
            {t('stats.statesLabel')}
          </>
        )}
      </div>

      {/* Навигация — справа */}
      <div
        style={{
          background: 'var(--theme-button-bg)',
          backdropFilter: 'blur(8px)',
          border: '0.5px solid var(--theme-panel-border)',
          borderRadius: 12,
          padding: '6px',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {TABS.map(({ key, icon, label }) =>
          (() => {
            const iconSrc = getTabIconSrc(key)
            const iconFilter =
              theme === 'dark'
                ? activeTab === key
                  ? 'brightness(0) invert(0.92) sepia(0.16) saturate(1.2)'
                  : 'brightness(0) invert(0.82)'
                : 'none'

            return (
              <button
                key={key}
                onClick={() => setActiveTab(activeTab === key && key !== 'map' ? 'map' : key)}
                title={t(label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 9,
                  border: 'none',
                  background: activeTab === key ? 'var(--theme-button-active-bg)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                  color:
                    activeTab === key ? 'var(--theme-accent-strong)' : 'var(--theme-text-soft)',
                  fontWeight: activeTab === key ? 500 : 400,
                  whiteSpace: 'nowrap'
                }}
              >
                {iconSrc ? (
                  <img
                    src={iconSrc}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: 22,
                      height: 22,
                      objectFit: 'contain',
                      opacity: activeTab === key ? 1 : 0.78,
                      filter: iconFilter
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
                )}
                <span>{t(label)}</span>
              </button>
            )
          })()
        )}
      </div>
    </div>
  )
}
