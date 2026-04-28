import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { STATUS_COLORS, CountryStatus } from '../types'
import { getCountryName } from '../utils/isoMap'
import CountryDetail from './CountryDetail'

const STATUSES: CountryStatus[] = ['visited', 'resident', 'homeland', 'wishlist']

interface Props {
  iso: string
  position: { x: number; y: number }
}

export default function CountryPopup({ iso, position }: Props) {
  const { t, i18n } = useTranslation()
  const { countries, cities, upsertCountry, removeCountry, removeCitiesByCountry, closePopup } =
    useStore()
  const popupRef = useRef<HTMLDivElement>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [detailTab, setDetailTab] = useState<'visits' | 'cities'>('visits')
  const [adjustedPos, setAdjustedPos] = useState(position)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const currentStatus = countries[iso]?.status
  const cityCount = cities.filter((city) => city.country_iso === iso).length

  useEffect(() => {
    if (!popupRef.current) return
    const el = popupRef.current
    const rect = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let { x, y } = position
    if (x + rect.width + 10 > vw) x = vw - rect.width - 10
    if (y + rect.height + 10 > vh) y = vh - rect.height - 10
    if (y < 10) y = 10
    setAdjustedPos({ x, y })
  }, [position])

  const removeCurrentCountry = async () => {
    await window.api.countries.remove(iso)
    removeCountry(iso)
    if (cityCount > 0) {
      removeCitiesByCountry(iso)
    }
    setShowRemoveConfirm(false)
  }

  const handleStatus = async (status: CountryStatus) => {
    if (currentStatus === status) {
      if (cityCount > 0) {
        setShowRemoveConfirm(true)
        return
      }
      await removeCurrentCountry()
    } else {
      const updated = await window.api.countries.upsert(iso, status)
      upsertCountry(updated)
    }
    await window.api.stats.get().then((s) => useStore.getState().setStats(s))
  }

  if (showDetail) {
    return (
      <CountryDetail
        iso={iso}
        initialTab={detailTab}
        onClose={() => {
          setShowDetail(false)
          closePopup()
        }}
      />
    )
  }

  return (
    <>
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
          minWidth: 200,
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
          {getCountryName(iso, i18n.language)}
          {currentStatus && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 11,
                fontWeight: 400,
                color: STATUS_COLORS[currentStatus],
                background: 'var(--theme-button-active-bg)',
                borderRadius: 4,
                padding: '1px 6px'
              }}
            >
              {t(`status.${currentStatus}`)}
            </span>
          )}
        </div>

        <div style={{ padding: '8px 14px 4px' }}>
          <div style={{ fontSize: 11, color: 'var(--theme-text-muted)', marginBottom: 6 }}>
            {t('map.setStatus')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 8px',
                  border:
                    currentStatus === s
                      ? `1.5px solid ${STATUS_COLORS[s]}`
                      : '0.5px solid var(--theme-panel-border)',
                  borderRadius: 6,
                  background: currentStatus === s ? 'var(--theme-button-active-bg)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 11,
                  color: currentStatus === s ? STATUS_COLORS[s] : 'var(--theme-text)',
                  fontWeight: currentStatus === s ? 500 : 400,
                  transition: 'all 0.15s'
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: STATUS_COLORS[s],
                    flexShrink: 0
                  }}
                />
                {t(`status.${s}`)}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: '0.5px solid var(--theme-divider)',
            display: 'flex',
            marginTop: 6
          }}
        >
          <button
            onClick={() => {
              setDetailTab('visits')
              setShowDetail(true)
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRight: '0.5px solid var(--theme-divider)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--theme-text-muted)'
            }}
          >
            {t('map.visitsTab')}
          </button>
          <button
            onClick={() => {
              setDetailTab('cities')
              setShowDetail(true)
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--theme-text-muted)'
            }}
          >
            {t('map.citiesTab')}
          </button>
        </div>
      </div>

      {showRemoveConfirm && (
        <div
          onClick={() => setShowRemoveConfirm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
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
              style={{
                padding: '16px 18px 10px',
                borderBottom: '0.5px solid var(--theme-divider)'
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--theme-accent-strong)',
                  marginBottom: 6
                }}
              >
                {t('map.removeCountryConfirmTitle')}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--theme-text-muted)'
                }}
              >
                {t('map.removeCountryWithCitiesConfirm', {
                  country: getCountryName(iso, i18n.language),
                  count: cityCount
                })}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                padding: '14px 18px'
              }}
            >
              <button
                onClick={() => setShowRemoveConfirm(false)}
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
                {t('common.no')}
              </button>
              <button
                onClick={removeCurrentCountry}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--theme-danger)',
                  color: 'var(--theme-paper)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                {t('common.yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
