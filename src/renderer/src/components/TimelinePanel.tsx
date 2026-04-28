import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { TimelineVisit } from '../types'
import { getCountryName } from '../utils/isoMap'
import OverlayPanel from './OverlayPanel'
import CountryDetail from './CountryDetail'

function calcDays(from: string | null, to: string | null): number | null {
  if (!from) return null
  const start = new Date(from)
  const end = to ? new Date(to) : new Date()
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))
}

function getYear(visit: TimelineVisit): string {
  return (visit.date_from ?? visit.created_at).slice(0, 4)
}

export default function TimelinePanel() {
  const { t, i18n } = useTranslation()
  const { setActiveTab } = useStore()
  const [visits, setVisits] = useState<TimelineVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVisit, setSelectedVisit] = useState<TimelineVisit | null>(null)

  useEffect(() => {
    let cancelled = false

    window.api.visits
      .getTimeline()
      .then((items) => {
        if (!cancelled) setVisits(items)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  let currentYear = ''

  return (
    <OverlayPanel title={t('tabs.timeline')} onClose={() => setActiveTab('map')} width={760}>
      <div style={{ maxHeight: 'min(70vh, 680px)', overflowY: 'auto', paddingRight: 4 }}>
        {loading && (
          <div style={{ padding: '28px 0', textAlign: 'center', color: 'var(--theme-text-soft)' }}>
            {t('timeline.loading')}
          </div>
        )}

        {!loading && visits.length === 0 && (
          <div style={{ padding: '34px 0', textAlign: 'center', color: 'var(--theme-text-soft)' }}>
            {t('timeline.empty')}
          </div>
        )}

        {visits.map((visit) => {
          const year = getYear(visit)
          const showYear = year !== currentYear
          currentYear = year
          const place =
            visit.place_type === 'city' && visit.city_name
              ? `${visit.city_name}, ${getCountryName(visit.country_iso, i18n.language)}`
              : getCountryName(visit.country_iso || visit.place_id, i18n.language)
          const days = calcDays(visit.date_from, visit.date_to)

          return (
            <div key={visit.id}>
              {showYear && (
                <div
                  style={{
                    margin: '14px 0 8px',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--theme-accent-strong)'
                  }}
                >
                  {year}
                </div>
              )}
              <button
                onClick={() => setSelectedVisit(visit)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'grid',
                  gridTemplateColumns: '92px 1fr',
                  gap: 12,
                  padding: '12px 14px',
                  marginBottom: 8,
                  borderRadius: 12,
                  border: '0.5px solid var(--theme-divider)',
                  background: 'var(--theme-card-bg-soft)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--theme-text-soft)', lineHeight: 1.45 }}>
                  {visit.date_from || t('timeline.noDate')}
                  {visit.date_to && <div>{visit.date_to}</div>}
                  {days && (
                    <div
                      style={{ marginTop: 5, color: 'var(--theme-accent-soft)', fontWeight: 600 }}
                    >
                      {t('stats.days', { count: days })}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--theme-text)', fontWeight: 600 }}>
                    {place}
                  </div>
                  {visit.notes && (
                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 12,
                        lineHeight: 1.5,
                        color: 'var(--theme-text-muted)',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {visit.notes}
                    </div>
                  )}
                  {visit.photo_count > 0 && (
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--theme-text-soft)' }}>
                      {t('common.photos')}: {visit.photo_count}
                    </div>
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>
      {selectedVisit && (
        <CountryDetail
          iso={selectedVisit.country_iso || selectedVisit.place_id}
          placeType={selectedVisit.place_type}
          placeId={selectedVisit.place_id}
          highlightVisitId={selectedVisit.id}
          title={
            selectedVisit.place_type === 'city' && selectedVisit.city_name
              ? selectedVisit.city_name
              : undefined
          }
          onClose={() => setSelectedVisit(null)}
        />
      )}
    </OverlayPanel>
  )
}
