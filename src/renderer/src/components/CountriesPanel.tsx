import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { STATUS_COLORS, CountryStatus } from '../types'
import { getCountryName } from '../utils/isoMap'
import { countMarkedUsStates, getDisplayCountries, TOTAL_US_STATES } from '../utils/usa'
import OverlayPanel from './OverlayPanel'

const STATUS_ORDER: CountryStatus[] = ['homeland', 'resident', 'visited', 'wishlist']

export default function CountriesPanel() {
  const { t, i18n } = useTranslation()
  const { countries, cities, usaMode, usStates, setActiveTab, focusCountryOnMap } = useStore()
  const [filter, setFilter] = useState<CountryStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const countryList = getDisplayCountries(countries, usaMode, usStates)
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) => {
      if (!normalizedQuery) return true
      const countryName = getCountryName(c.iso_code, i18n.language).toLowerCase()
      const cityMatch = cities.some(
        (city) =>
          city.country_iso === c.iso_code && city.name.toLowerCase().includes(normalizedQuery)
      )
      return countryName.includes(normalizedQuery) || cityMatch
    })
    .sort((a, b) => {
      const so = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
      if (so !== 0) return so
      return getCountryName(a.iso_code, i18n.language).localeCompare(
        getCountryName(b.iso_code, i18n.language)
      )
    })

  return (
    <OverlayPanel title={t('tabs.countries')} onClose={() => setActiveTab('map')} width={700}>
      <div
        style={{
          height: 'min(68vh, 620px)',
          minHeight: 420,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('map.searchCountriesCities')}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 11px',
              marginBottom: 10,
              borderRadius: 9,
              border: '0.5px solid var(--theme-panel-border)',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-text)',
              fontSize: 13
            }}
          />
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <FilterChip
              label={t('common.all')}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            {STATUS_ORDER.map((s) => (
              <FilterChip
                key={s}
                label={t(`status.${s}`)}
                active={filter === s}
                color={STATUS_COLORS[s]}
                onClick={() => setFilter(s)}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            overflowY: 'auto',
            paddingRight: 4
          }}
        >
          {countryList.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 16px',
                color: 'var(--theme-text-soft)',
                fontSize: 13
              }}
            >
              {t('map.clickCountry')}
            </div>
          )}
          {countryList.map((c) => {
            const citiesInCountry = cities.filter((city) => city.country_iso === c.iso_code)
            const matchingCities = normalizedQuery
              ? citiesInCountry.filter((city) => city.name.toLowerCase().includes(normalizedQuery))
              : []
            return (
              <div
                key={c.iso_code}
                onClick={() => focusCountryOnMap(c.iso_code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  borderRadius: 10
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--theme-card-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: STATUS_COLORS[c.status],
                    flexShrink: 0
                  }}
                />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--theme-text)' }}>
                  {getCountryName(c.iso_code, i18n.language)}
                </span>
                {citiesInCountry.length > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--theme-text-soft)',
                      background: 'var(--theme-card-bg)',
                      borderRadius: 4,
                      padding: '1px 5px'
                    }}
                  >
                    {t('stats.cities', { count: citiesInCountry.length })}
                  </span>
                )}
                {matchingCities.length > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--theme-accent-strong)',
                      background: 'var(--theme-button-active-bg)',
                      borderRadius: 4,
                      padding: '1px 5px'
                    }}
                  >
                    {matchingCities
                      .slice(0, 2)
                      .map((city) => city.name)
                      .join(', ')}
                  </span>
                )}
                {usaMode === 'states' && c.iso_code === 'US' && (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--theme-accent-strong)',
                      background: 'var(--theme-button-active-bg)',
                      borderRadius: 4,
                      padding: '1px 5px'
                    }}
                  >
                    {countMarkedUsStates(usStates)}/{TOTAL_US_STATES} {t('stats.statesLabel')}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </OverlayPanel>
  )
}

function FilterChip({
  label,
  active,
  color,
  onClick
}: {
  label: string
  active: boolean
  color?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '3px 9px',
        borderRadius: 999,
        border: active ? `1.5px solid ${color || '#333'}` : '0.5px solid var(--theme-panel-border)',
        background: active ? 'var(--theme-button-active-bg)' : 'transparent',
        cursor: 'pointer',
        fontSize: 11,
        color: active ? color || 'var(--theme-text)' : 'var(--theme-text-muted)',
        fontWeight: active ? 500 : 400
      }}
    >
      {label}
    </button>
  )
}
