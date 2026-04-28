import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { STATUS_COLORS, CountryStatus } from '../types'
import {
  computeDisplayStats,
  countMarkedUsStates,
  getEffectiveCountryStatus,
  TOTAL_COUNTRIES,
  TOTAL_US_STATES
} from '../utils/usa'
import OverlayPanel from './OverlayPanel'

const CONTINENTS: { key: string; total: number; isos: string[] }[] = [
  {
    key: 'europe',
    total: 44,
    isos: [
      'DE',
      'FR',
      'IT',
      'ES',
      'PT',
      'GB',
      'PL',
      'UA',
      'RO',
      'NL',
      'BE',
      'SE',
      'NO',
      'FI',
      'DK',
      'AT',
      'CH',
      'CZ',
      'HU',
      'SK',
      'HR',
      'BA',
      'RS',
      'ME',
      'MK',
      'SI',
      'AL',
      'GR',
      'BG',
      'TR',
      'LT',
      'LV',
      'EE',
      'LU',
      'IE',
      'IS',
      'MT',
      'CY',
      'BY',
      'MD',
      'AM',
      'AZ',
      'GE',
      'RU'
    ]
  },
  {
    key: 'asia',
    total: 48,
    isos: [
      'CN',
      'JP',
      'KR',
      'IN',
      'ID',
      'TH',
      'VN',
      'PH',
      'MY',
      'SG',
      'BN',
      'TL',
      'LA',
      'KH',
      'MM',
      'NP',
      'BT',
      'BD',
      'LK',
      'PK',
      'AF',
      'IR',
      'IQ',
      'SY',
      'JO',
      'LB',
      'IL',
      'PS',
      'SA',
      'AE',
      'QA',
      'KW',
      'YE',
      'OM',
      'KZ',
      'UZ',
      'TM',
      'TJ',
      'KG',
      'MN',
      'AZ',
      'GE',
      'AM',
      'TR',
      'KP',
      'TW'
    ]
  },
  {
    key: 'africa',
    total: 54,
    isos: [
      'NG',
      'ET',
      'EG',
      'CD',
      'TZ',
      'ZA',
      'KE',
      'UG',
      'DZ',
      'SD',
      'MA',
      'AO',
      'MZ',
      'GH',
      'CM',
      'MG',
      'CI',
      'NE',
      'BF',
      'ML',
      'MW',
      'ZM',
      'SN',
      'ZW',
      'GM',
      'GN',
      'RW',
      'BI',
      'SS',
      'TN',
      'LY',
      'SO',
      'LR',
      'SL',
      'TG',
      'BJ',
      'ER',
      'MR',
      'CF',
      'CG',
      'GA',
      'GQ',
      'ST',
      'CV',
      'DJ',
      'KM',
      'MU',
      'LS',
      'SZ',
      'BW',
      'NA'
    ]
  },
  {
    key: 'northAmerica',
    total: 23,
    isos: [
      'US',
      'CA',
      'MX',
      'GT',
      'BZ',
      'HN',
      'SV',
      'NI',
      'CR',
      'PA',
      'CU',
      'JM',
      'HT',
      'DO',
      'PR',
      'BS',
      'BB',
      'GD',
      'LC',
      'VC',
      'TT',
      'KN',
      'AG'
    ]
  },
  {
    key: 'southAmerica',
    total: 12,
    isos: ['BR', 'CO', 'VE', 'PE', 'EC', 'BO', 'PY', 'UY', 'AR', 'CL', 'GY', 'SR']
  },
  {
    key: 'oceania',
    total: 14,
    isos: ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'WS', 'TO', 'PW', 'FM', 'MH', 'KI', 'NR', 'TV']
  }
]

export default function StatsPanel() {
  const { t } = useTranslation()
  const { stats, countries, usaMode, usStates, setActiveTab } = useStore()

  if (!stats) return null

  const displayStats = computeDisplayStats(countries, stats, usaMode, usStates)

  const visitedCount =
    displayStats.byStatus
      ?.filter((s) => ['visited', 'resident', 'homeland'].includes(s.status))
      ?.reduce((a, b) => a + b.count, 0) ?? 0

  return (
    <OverlayPanel title={t('tabs.stats')} onClose={() => setActiveTab('map')} width={760}>
      {/* Общая статистика */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <StatCard value={visitedCount} label={t('tabs.countries')} color="var(--status-visited)" />
        <StatCard
          value={displayStats.totalCities}
          label={t('stats.citiesLabel')}
          color="var(--theme-accent-soft)"
        />
        <StatCard
          value={`${Math.round((visitedCount / TOTAL_COUNTRIES) * 100)}%`}
          label={t('stats.worldLabel')}
          color="var(--status-wishlist)"
        />
        <StatCard
          value={displayStats.totalDays}
          label={t('stats.days', { count: displayStats.totalDays })}
          color="var(--status-resident)"
        />
      </div>

      {usaMode === 'states' && (
        <Section label="USA">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              marginBottom: 6
            }}
          >
            <span style={{ color: 'var(--theme-text-muted)' }}>{t('stats.usStatesLabel')}</span>
            <span style={{ color: 'var(--theme-text)', fontWeight: 500 }}>
              {countMarkedUsStates(usStates)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12
            }}
          >
            <span style={{ color: 'var(--theme-text-muted)' }}>{t('stats.statesProgress')}</span>
            <span style={{ color: 'var(--theme-text)', fontWeight: 500 }}>
              {countMarkedUsStates(usStates)}/{TOTAL_US_STATES}
            </span>
          </div>
        </Section>
      )}

      {/* По статусам */}
      <Section label={t('stats.byStatus')}>
        {(['homeland', 'resident', 'visited', 'wishlist'] as CountryStatus[]).map((s) => {
          const count = displayStats.byStatus?.find((b) => b.status === s)?.count ?? 0
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: STATUS_COLORS[s],
                  flexShrink: 0
                }}
              />
              <span style={{ flex: 1, fontSize: 12, color: 'var(--theme-text-muted)' }}>
                {t(`status.${s}`)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--theme-text)' }}>
                {count}
              </span>
            </div>
          )
        })}
      </Section>

      {/* По континентам */}
      <Section label={t('stats.byContinent')}>
        {CONTINENTS.map((cont) => {
          const visited = cont.isos.filter((iso) => {
            const status = getEffectiveCountryStatus(iso, countries, usaMode, usStates)
            return status && ['visited', 'resident', 'homeland'].includes(status)
          }).length
          const pct = Math.round((visited / cont.total) * 100)
          return (
            <div key={cont.key} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: 'var(--theme-text-muted)' }}>
                  {t(`continents.${cont.key}`)}
                </span>
                <span style={{ fontSize: 11, color: 'var(--theme-text-soft)' }}>
                  {visited}/{cont.total}
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  background: 'var(--theme-card-bg)',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: 'var(--theme-accent-soft)',
                    borderRadius: 3,
                    transition: 'width 0.3s'
                  }}
                />
              </div>
            </div>
          )
        })}
      </Section>
    </OverlayPanel>
  )
}

function StatCard({
  value,
  label,
  color
}: {
  value: number | string
  label: string
  color: string
}) {
  return (
    <div
      style={{
        background: 'var(--theme-card-bg)',
        borderRadius: 10,
        padding: '10px 12px'
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 500, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--theme-text-soft)', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--theme-text-soft)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 8
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}
