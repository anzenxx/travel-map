import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCountryName } from '../utils/isoMap'
import { CitySearchResult } from '../utils/citySearch'
import { Visit, City, Photo, Tag } from '../types'
import { useStore } from '../store'
import ConfirmDialog from './ConfirmDialog'

interface Props {
  iso: string
  onClose: () => void
  initialTab?: 'visits' | 'cities'
  initialAddVisit?: boolean
  placeType?: 'country' | 'city'
  placeId?: string
  title?: string
  highlightVisitId?: number
}

export default function CountryDetail({
  iso,
  onClose,
  initialTab = 'visits',
  initialAddVisit = false,
  placeType = 'country',
  placeId = iso,
  title,
  highlightVisitId
}: Props) {
  const { t, i18n } = useTranslation()
  const { addCity, removeCity, upsertCountry } = useStore()
  const [tab, setTab] = useState<'visits' | 'cities'>(initialTab)
  const [visits, setVisits] = useState<Visit[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [showAddVisit, setShowAddVisit] = useState(false)
  const [newDateFrom, setNewDateFrom] = useState('')
  const [newDateTo, setNewDateTo] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [editingVisitId, setEditingVisitId] = useState<number | null>(null)
  const [editingDateFrom, setEditingDateFrom] = useState('')
  const [editingDateTo, setEditingDateTo] = useState('')
  const [editingNotes, setEditingNotes] = useState('')
  const [newVisitError, setNewVisitError] = useState<string | null>(null)
  const [editingVisitError, setEditingVisitError] = useState<string | null>(null)
  const [cityQuery, setCityQuery] = useState('')
  const [cityResults, setCityResults] = useState<CitySearchResult[]>([])
  const [cityLoading, setCityLoading] = useState(false)
  const [cityError, setCityError] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    message: string
    onConfirm: () => void | Promise<void>
  } | null>(null)

  useEffect(() => {
    setTab(initialTab)
    setCityQuery('')
    setCityResults([])
    setCityError(null)
    setEditingVisitId(null)
    setNewVisitError(null)
    setEditingVisitError(null)
    setShowAddVisit(initialAddVisit)
    loadVisits()
    loadCities()
  }, [initialAddVisit, initialTab, iso, placeId, placeType])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (document.querySelector('[data-visit-lightbox="open"]')) return

      event.preventDefault()
      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (tab !== 'cities') return

    const trimmedQuery = cityQuery.trim()
    if (trimmedQuery.length < 2) {
      setCityResults([])
      setCityLoading(false)
      setCityError(null)
      return
    }

    let cancelled = false
    const timeoutId = window.setTimeout(async () => {
      setCityLoading(true)
      setCityError(null)

      try {
        const results = await window.api.cities.search(iso, trimmedQuery, i18n.language)
        if (!cancelled) {
          setCityResults(results)
        }
      } catch {
        if (!cancelled) {
          setCityResults([])
          setCityError(t('map.citySearchError'))
        }
      } finally {
        if (!cancelled) {
          setCityLoading(false)
        }
      }
    }, 300)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [cityQuery, iso, i18n.language, t, tab])

  const loadVisits = async () => {
    const nextVisits = await window.api.visits.get(placeType, placeId)
    setVisits(nextVisits)
  }

  const loadCities = async () => {
    const nextCities = await window.api.cities.getByCountry(iso)
    setCities(nextCities)
  }

  const refreshStats = async () => {
    const nextStats = await window.api.stats.get()
    useStore.getState().setStats(nextStats)
  }

  const addVisit = async () => {
    if (newDateFrom && newDateTo && newDateTo < newDateFrom) {
      setNewVisitError(t('map.invalidVisitDates'))
      return
    }

    setNewVisitError(null)
    await window.api.visits.add(
      placeType,
      placeId,
      newDateFrom || null,
      newDateTo || null,
      newNotes || null
    )
    setNewDateFrom('')
    setNewDateTo('')
    setNewNotes('')
    setShowAddVisit(false)
    await loadVisits()
    await refreshStats()
  }

  const deleteVisit = async (id: number) => {
    setConfirmAction({
      title: t('map.deleteVisitTitle'),
      message: t('map.deleteVisitConfirm'),
      onConfirm: async () => {
        await window.api.visits.delete(id)
        await loadVisits()
        await refreshStats()
      }
    })
  }

  const startEditingVisit = (visit: Visit) => {
    setEditingVisitId(visit.id)
    setEditingDateFrom(visit.date_from ?? '')
    setEditingDateTo(visit.date_to ?? '')
    setEditingNotes(visit.notes ?? '')
    setEditingVisitError(null)
  }

  const cancelEditingVisit = () => {
    setEditingVisitId(null)
    setEditingDateFrom('')
    setEditingDateTo('')
    setEditingNotes('')
    setEditingVisitError(null)
  }

  const saveVisitEdit = async (visitId: number) => {
    if (editingDateFrom && editingDateTo && editingDateTo < editingDateFrom) {
      setEditingVisitError(t('map.invalidVisitDates'))
      return
    }

    setEditingVisitError(null)
    await window.api.visits.update(
      visitId,
      editingDateFrom || null,
      editingDateTo || null,
      editingNotes || null
    )
    cancelEditingVisit()
    await loadVisits()
    await refreshStats()
  }

  const handleAddCity = async (city: CitySearchResult) => {
    const exists = cities.some(
      (existing) =>
        existing.name.toLowerCase() === city.name.toLowerCase() &&
        Math.abs(existing.lat - city.lat) < 0.0001 &&
        Math.abs(existing.lng - city.lng) < 0.0001
    )
    if (exists) return

    let id: number
    try {
      id = await window.api.cities.add(iso, city.name, city.lat, city.lng)
    } catch {
      setCityError(t('map.cityAddError'))
      return
    }

    const persistedCountry = await window.api.countries.get(iso)
    if (persistedCountry) {
      upsertCountry(persistedCountry)
    }

    const newCity: City = {
      id: Number(id),
      country_iso: iso,
      name: city.name,
      lat: city.lat,
      lng: city.lng,
      created_at: new Date().toISOString()
    }

    addCity(newCity)
    setCities((current) => [...current, newCity])
    setCityQuery('')
    setCityResults([])
    await refreshStats()
  }

  const handleRemoveCity = async (id: number) => {
    setConfirmAction({
      title: t('map.deleteCityTitle'),
      message: t('map.deleteCityConfirm'),
      onConfirm: async () => {
        await window.api.cities.remove(id)
        removeCity(id)
        setCities((current) => current.filter((city) => city.id !== id))
        await refreshStats()
      }
    })
  }

  const calcDays = (from: string | null, to: string | null) => {
    if (!from) return null
    const a = new Date(from)
    const b = to ? new Date(to) : new Date()
    return Math.max(1, Math.ceil((b.getTime() - a.getTime()) / 86400000))
  }

  const filteredCities = useMemo(() => {
    const trimmedQuery = cityQuery.trim().toLowerCase()
    if (!trimmedQuery) return cities
    return cities.filter((city) => city.name.toLowerCase().includes(trimmedQuery))
  }, [cities, cityQuery])

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1100,
    background: 'var(--theme-overlay)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const panelStyle: React.CSSProperties = {
    background: 'var(--theme-panel)',
    borderRadius: 14,
    width: 520,
    maxHeight: '82vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'system-ui, sans-serif',
    color: 'var(--theme-text)',
    boxShadow: 'var(--theme-shadow)'
  }

  return (
    <div data-country-detail="open" style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(event) => event.stopPropagation()}>
        <div
          style={{
            padding: '14px 18px 0',
            borderBottom: '0.5px solid var(--theme-divider)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--theme-accent-strong)' }}>
              {title ?? getCountryName(iso, i18n.language)}
            </span>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 20,
                color: 'var(--theme-text-soft)',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', gap: 0 }}>
            {(['visits', 'cities'] as const)
              .filter((tabKey) => placeType === 'country' || tabKey === 'visits')
              .map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setTab(tabKey)}
                  style={{
                    padding: '6px 14px',
                    border: 'none',
                    borderBottom:
                      tab === tabKey
                        ? '2px solid var(--theme-accent-soft)'
                        : '2px solid transparent',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: tab === tabKey ? 'var(--theme-accent-strong)' : 'var(--theme-text-soft)',
                    fontWeight: tab === tabKey ? 500 : 400
                  }}
                >
                  {tabKey === 'visits'
                    ? t('map.visitsTab')
                    : `${t('map.citiesTab')} (${cities.length})`}
                </button>
              ))}
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 18px' }}>
          {tab === 'visits' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                <button
                  onClick={() => setShowAddVisit(!showAddVisit)}
                  style={{
                    fontSize: 11,
                    padding: '4px 10px',
                    border: '0.5px solid var(--theme-panel-border)',
                    borderRadius: 6,
                    background: 'var(--theme-button-bg)',
                    cursor: 'pointer',
                    color: 'var(--theme-text)'
                  }}
                >
                  + {t('common.add')}
                </button>
              </div>

              {showAddVisit && (
                <div
                  style={{
                    border: '0.5px solid var(--theme-panel-border)',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    background: 'var(--theme-card-bg-soft)'
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          fontSize: 11,
                          color: 'var(--theme-text-soft)',
                          display: 'block',
                          marginBottom: 3
                        }}
                      >
                        {t('common.from')}
                      </label>
                      <input
                        type="date"
                        value={newDateFrom}
                        onChange={(event) => setNewDateFrom(event.target.value)}
                        style={{
                          width: '100%',
                          padding: '5px 8px',
                          border: '0.5px solid var(--theme-panel-border)',
                          borderRadius: 6,
                          fontSize: 12,
                          background: 'var(--theme-input-bg)',
                          color: 'var(--theme-text)'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          fontSize: 11,
                          color: 'var(--theme-text-soft)',
                          display: 'block',
                          marginBottom: 3
                        }}
                      >
                        {t('common.to')}
                      </label>
                      <input
                        type="date"
                        value={newDateTo}
                        onChange={(event) => setNewDateTo(event.target.value)}
                        style={{
                          width: '100%',
                          padding: '5px 8px',
                          border: '0.5px solid var(--theme-panel-border)',
                          borderRadius: 6,
                          fontSize: 12,
                          background: 'var(--theme-input-bg)',
                          color: 'var(--theme-text)'
                        }}
                      />
                    </div>
                  </div>
                  <textarea
                    value={newNotes}
                    onChange={(event) => setNewNotes(event.target.value)}
                    placeholder={`${t('common.notes')}...`}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '0.5px solid var(--theme-panel-border)',
                      borderRadius: 6,
                      fontSize: 12,
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      background: 'var(--theme-input-bg)',
                      color: 'var(--theme-text)'
                    }}
                  />
                  {newVisitError && <InlineError message={newVisitError} />}
                  <div
                    style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}
                  >
                    <button
                      onClick={() => setShowAddVisit(false)}
                      style={{
                        fontSize: 12,
                        padding: '5px 12px',
                        border: '0.5px solid var(--theme-panel-border)',
                        borderRadius: 6,
                        background: 'var(--theme-button-bg)',
                        cursor: 'pointer',
                        color: 'var(--theme-text)'
                      }}
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={addVisit}
                      style={{
                        fontSize: 12,
                        padding: '5px 12px',
                        border: 'none',
                        borderRadius: 6,
                        background: 'var(--theme-accent-soft)',
                        color: 'var(--theme-paper)',
                        cursor: 'pointer'
                      }}
                    >
                      {t('common.save')}
                    </button>
                  </div>
                </div>
              )}

              {visits.length === 0 && !showAddVisit && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '24px 0',
                    color: 'var(--theme-text-soft)',
                    fontSize: 13
                  }}
                >
                  {t('common.noVisits')}
                </div>
              )}

              {visits.map((visit) => {
                const days = calcDays(visit.date_from, visit.date_to)
                const isEditing = editingVisitId === visit.id
                const isHighlighted = highlightVisitId === visit.id
                return (
                  <div
                    key={visit.id}
                    style={{
                      border: isHighlighted
                        ? '1px solid var(--theme-accent-soft)'
                        : '0.5px solid var(--theme-divider)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      marginBottom: 8,
                      background: isHighlighted
                        ? 'var(--theme-button-active-bg)'
                        : 'var(--theme-card-bg-soft)'
                    }}
                  >
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}
                    >
                      <span style={{ fontSize: 12, color: 'var(--theme-text-muted)' }}>
                        {!isEditing && visit.date_from ? (
                          <>
                            {visit.date_from}
                            {visit.date_to && ` → ${visit.date_to}`}
                            {days && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  fontSize: 11,
                                  color: 'var(--theme-accent-soft)',
                                  fontWeight: 500
                                }}
                              >
                                {days}d
                              </span>
                            )}
                          </>
                        ) : (
                          <span style={{ color: 'var(--theme-text-soft)' }}>—</span>
                        )}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {!isEditing && (
                          <button
                            onClick={() => startEditingVisit(visit)}
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              color: 'var(--theme-accent-soft)',
                              fontSize: 12
                            }}
                          >
                            {t('common.edit')}
                          </button>
                        )}
                        <button
                          onClick={() => deleteVisit(visit.id)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: 'var(--theme-text-soft)',
                            fontSize: 14
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          <div style={{ flex: 1 }}>
                            <label
                              style={{
                                fontSize: 11,
                                color: 'var(--theme-text-soft)',
                                display: 'block',
                                marginBottom: 3
                              }}
                            >
                              {t('common.from')}
                            </label>
                            <input
                              type="date"
                              value={editingDateFrom}
                              onChange={(event) => setEditingDateFrom(event.target.value)}
                              style={{
                                width: '100%',
                                padding: '5px 8px',
                                border: '0.5px solid var(--theme-panel-border)',
                                borderRadius: 6,
                                fontSize: 12,
                                background: 'var(--theme-input-bg)',
                                color: 'var(--theme-text)'
                              }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label
                              style={{
                                fontSize: 11,
                                color: 'var(--theme-text-soft)',
                                display: 'block',
                                marginBottom: 3
                              }}
                            >
                              {t('common.to')}
                            </label>
                            <input
                              type="date"
                              value={editingDateTo}
                              onChange={(event) => setEditingDateTo(event.target.value)}
                              style={{
                                width: '100%',
                                padding: '5px 8px',
                                border: '0.5px solid var(--theme-panel-border)',
                                borderRadius: 6,
                                fontSize: 12,
                                background: 'var(--theme-input-bg)',
                                color: 'var(--theme-text)'
                              }}
                            />
                          </div>
                        </div>
                        <textarea
                          value={editingNotes}
                          onChange={(event) => setEditingNotes(event.target.value)}
                          placeholder={`${t('common.notes')}...`}
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            border: '0.5px solid var(--theme-panel-border)',
                            borderRadius: 6,
                            fontSize: 12,
                            resize: 'vertical',
                            boxSizing: 'border-box',
                            background: 'var(--theme-input-bg)',
                            color: 'var(--theme-text)'
                          }}
                        />
                        {editingVisitError && <InlineError message={editingVisitError} />}
                        <div
                          style={{
                            display: 'flex',
                            gap: 6,
                            marginTop: 8,
                            justifyContent: 'flex-end'
                          }}
                        >
                          <button
                            onClick={cancelEditingVisit}
                            style={{
                              fontSize: 12,
                              padding: '5px 12px',
                              border: '0.5px solid var(--theme-panel-border)',
                              borderRadius: 6,
                              background: 'var(--theme-button-bg)',
                              cursor: 'pointer',
                              color: 'var(--theme-text)'
                            }}
                          >
                            {t('common.cancel')}
                          </button>
                          <button
                            onClick={() => saveVisitEdit(visit.id)}
                            style={{
                              fontSize: 12,
                              padding: '5px 12px',
                              border: 'none',
                              borderRadius: 6,
                              background: 'var(--theme-accent-soft)',
                              color: 'var(--theme-paper)',
                              cursor: 'pointer'
                            }}
                          >
                            {t('common.save')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <VisitNotes note={visit.notes} />
                    )}
                    <VisitTags visitId={visit.id} />
                    <VisitPhotos visitId={visit.id} />
                  </div>
                )
              })}
            </>
          )}

          {tab === 'cities' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <input
                  value={cityQuery}
                  onChange={(event) => setCityQuery(event.target.value)}
                  placeholder={t('map.citySearchPlaceholder', {
                    country: getCountryName(iso, i18n.language)
                  })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '0.5px solid var(--theme-panel-border)',
                    borderRadius: 8,
                    fontSize: 13,
                    boxSizing: 'border-box',
                    background: 'var(--theme-input-bg)',
                    color: 'var(--theme-text)'
                  }}
                />
                <div style={{ marginTop: 6, fontSize: 11, color: 'var(--theme-text-soft)' }}>
                  {t('map.citySearchHint')}
                </div>
              </div>

              <div
                style={{
                  border: '0.5px solid var(--theme-divider)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginBottom: 14
                }}
              >
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'var(--theme-card-bg)',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--theme-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {t('map.searchResults')}
                </div>

                {cityLoading && (
                  <div
                    style={{ padding: '14px 12px', fontSize: 12, color: 'var(--theme-text-soft)' }}
                  >
                    {t('map.cityLoading')}
                  </div>
                )}

                {!cityLoading && cityError && (
                  <div style={{ padding: '14px 12px', fontSize: 12, color: 'var(--theme-danger)' }}>
                    {cityError}
                  </div>
                )}

                {!cityLoading && !cityError && cityQuery.trim().length < 2 && (
                  <div
                    style={{ padding: '14px 12px', fontSize: 12, color: 'var(--theme-text-soft)' }}
                  >
                    {t('map.citySearchStart')}
                  </div>
                )}

                {!cityLoading &&
                  !cityError &&
                  cityQuery.trim().length >= 2 &&
                  cityResults.length === 0 && (
                    <div
                      style={{
                        padding: '14px 12px',
                        fontSize: 12,
                        color: 'var(--theme-text-soft)'
                      }}
                    >
                      {t('map.cityNoResults')}
                    </div>
                  )}

                {!cityLoading &&
                  !cityError &&
                  cityResults.map((city) => {
                    const alreadyAdded = cities.some(
                      (existing) =>
                        existing.name.toLowerCase() === city.name.toLowerCase() &&
                        Math.abs(existing.lat - city.lat) < 0.0001 &&
                        Math.abs(existing.lng - city.lng) < 0.0001
                    )

                    return (
                      <button
                        key={city.id}
                        onClick={() => handleAddCity(city)}
                        disabled={alreadyAdded}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 12px',
                          border: 'none',
                          borderTop: '0.5px solid var(--theme-divider)',
                          background: alreadyAdded
                            ? 'var(--theme-button-active-bg)'
                            : 'var(--theme-input-bg)',
                          cursor: alreadyAdded ? 'default' : 'pointer'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{ fontSize: 13, color: 'var(--theme-text)', fontWeight: 500 }}
                            >
                              {city.name}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: 'var(--theme-text-soft)',
                                marginTop: 2,
                                whiteSpace: 'normal'
                              }}
                            >
                              {city.displayName}
                            </div>
                          </div>
                          <div
                            style={{
                              flexShrink: 0,
                              fontSize: 11,
                              color: alreadyAdded
                                ? 'var(--theme-accent-strong)'
                                : 'var(--theme-accent-soft)',
                              fontWeight: 600
                            }}
                          >
                            {alreadyAdded ? t('map.cityAdded') : `+ ${t('common.add')}`}
                          </div>
                        </div>
                      </button>
                    )
                  })}
              </div>

              <div
                style={{
                  marginBottom: 8,
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--theme-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {t('map.savedCities')}
              </div>

              {filteredCities.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '24px 0',
                    color: 'var(--theme-text-soft)',
                    fontSize: 13
                  }}
                >
                  {cities.length === 0 ? t('map.noCitiesYet') : t('map.cityNoSavedMatches')}
                </div>
              )}

              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 7,
                    marginBottom: 4,
                    border: '0.5px solid var(--theme-divider)',
                    background: 'var(--theme-card-bg-soft)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--theme-text)' }}>{city.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--theme-text-soft)', marginTop: 1 }}>
                      {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCity(city.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--theme-text-soft)',
                      fontSize: 16,
                      padding: '2px 6px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          danger
          onCancel={() => setConfirmAction(null)}
          onConfirm={async () => {
            await confirmAction.onConfirm()
            setConfirmAction(null)
          }}
        />
      )}
    </div>
  )
}

function VisitNotes({ note }: { note: string | null }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const LINE_HEIGHT_PX = 18
  const COLLAPSED_LINES = 3

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateWidth = () => {
      setContainerWidth(container.clientWidth)
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(() => updateWidth())
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const el = measureRef.current
    if (!el || containerWidth <= 0) return

    const checkOverflow = () => {
      setIsTruncated(el.scrollHeight > LINE_HEIGHT_PX * COLLAPSED_LINES + 1)
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [containerWidth, note])

  if (!note) return null

  return (
    <div ref={containerRef} style={{ marginBottom: 6 }}>
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          left: -9999,
          top: 0,
          width: containerWidth > 0 ? `${containerWidth}px` : undefined,
          fontSize: 12,
          lineHeight: `${LINE_HEIGHT_PX}px`,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {note}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--theme-text)',
          lineHeight: `${LINE_HEIGHT_PX}px`,
          overflow: 'hidden',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          display: expanded ? 'block' : '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: expanded ? 'unset' : COLLAPSED_LINES,
          textOverflow: 'ellipsis'
        }}
      >
        {note}
      </div>
      {isTruncated && (
        <button
          onClick={() => setExpanded((current) => !current)}
          style={{
            marginTop: 4,
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: 11,
            color: 'var(--theme-accent-soft)'
          }}
        >
          {expanded ? t('common.showLess') : t('common.showMore')}
        </button>
      )}
    </div>
  )
}

function InlineError({ message }: { message: string }) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: '7px 9px',
        borderRadius: 7,
        border: '1px solid var(--theme-danger-border)',
        background: 'var(--theme-danger-bg)',
        color: 'var(--theme-danger)',
        fontSize: 12,
        lineHeight: 1.4
      }}
    >
      {message}
    </div>
  )
}

function VisitTags({ visitId }: { visitId: number }) {
  const { t } = useTranslation()
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [newTagName, setNewTagName] = useState('')
  const [tagError, setTagError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([window.api.tags.getAll(), window.api.tags.getForVisit(visitId)]).then(
      ([allTags, visitTags]) => {
        if (cancelled) return
        setTags(allTags)
        setSelectedTags(visitTags)
      }
    )

    return () => {
      cancelled = true
    }
  }, [visitId])

  const selectedIds = new Set(selectedTags.map((tag) => tag.id))

  const toggleTag = async (tag: Tag) => {
    if (selectedIds.has(tag.id)) {
      await window.api.tags.removeFromVisit(visitId, tag.id)
      setSelectedTags((current) => current.filter((item) => item.id !== tag.id))
    } else {
      await window.api.tags.addToVisit(visitId, tag.id)
      setSelectedTags((current) => [...current, tag])
    }
  }

  const createTag = async () => {
    const trimmedName = newTagName.trim()
    if (!trimmedName) return

    try {
      const tag = (await window.api.tags.create(trimmedName)) as Tag
      await window.api.tags.addToVisit(visitId, tag.id)
      setTags((current) => {
        if (current.some((item) => item.id === tag.id)) return current
        return [...current, tag].sort((a, b) => a.name.localeCompare(b.name))
      })
      setSelectedTags((current) => {
        if (current.some((item) => item.id === tag.id)) return current
        return [...current, tag]
      })
      setNewTagName('')
      setTagError(null)
    } catch {
      setTagError(t('tags.createError'))
    }
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          marginBottom: 5,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--theme-text-soft)'
        }}
      >
        {t('common.tags')}
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {tags.map((tag) => {
          const active = selectedIds.has(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '3px 7px',
                borderRadius: 999,
                border: active
                  ? '1px solid var(--theme-accent-soft)'
                  : '0.5px solid var(--theme-panel-border)',
                background: active ? 'var(--theme-button-active-bg)' : 'transparent',
                color: active ? 'var(--theme-accent-strong)' : 'var(--theme-text-soft)',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: active ? 600 : 400
              }}
            >
              {t(`tags.${tag.name}`)}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 7 }}>
        <input
          value={newTagName}
          onChange={(event) => setNewTagName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              createTag()
            }
          }}
          placeholder={t('tags.createPlaceholder')}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '5px 8px',
            border: '0.5px solid var(--theme-panel-border)',
            borderRadius: 7,
            background: 'var(--theme-input-bg)',
            color: 'var(--theme-text)',
            fontSize: 11
          }}
        />
        <button
          onClick={createTag}
          disabled={!newTagName.trim()}
          style={{
            padding: '5px 9px',
            borderRadius: 7,
            border: '0.5px solid var(--theme-panel-border)',
            background: 'var(--theme-button-bg)',
            color: 'var(--theme-text)',
            cursor: newTagName.trim() ? 'pointer' : 'default',
            fontSize: 11,
            fontWeight: 600
          }}
        >
          {t('common.add')}
        </button>
      </div>
      {tagError && <InlineError message={tagError} />}
    </div>
  )
}

function VisitPhotos({ visitId }: { visitId: number }) {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [photoSources, setPhotoSources] = useState<Record<string, string>>({})
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null)

  useEffect(() => {
    window.api.photos.get(visitId).then(setPhotos)
  }, [visitId])

  useEffect(() => {
    let cancelled = false

    const loadPhotoSources = async () => {
      const entries = await Promise.all(
        photos.map(
          async (photo) =>
            [photo.file_path, await window.api.photos.getDataUrl(photo.file_path)] as const
        )
      )

      if (!cancelled) {
        setPhotoSources(Object.fromEntries(entries))
      }
    }

    if (photos.length === 0) {
      setPhotoSources({})
      return
    }

    loadPhotoSources().catch(() => {
      if (!cancelled) {
        setPhotoSources({})
      }
    })

    return () => {
      cancelled = true
    }
  }, [photos])

  const addPhotos = async () => {
    await window.api.photos.add(visitId)
    window.api.photos.get(visitId).then(setPhotos)
  }

  const deletePhoto = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setPhotoToDelete(id)
  }

  const confirmDeletePhoto = async () => {
    if (photoToDelete === null) return
    await window.api.photos.delete(photoToDelete)
    setPhotoToDelete(null)
    window.api.photos.get(visitId).then(setPhotos)
  }

  const lightboxIndex = lightbox ? photos.findIndex((photo) => photo.file_path === lightbox) : -1
  const canSwitchPhotos = photos.length > 1 && lightboxIndex >= 0

  const showPhotoByOffset = (offset: number) => {
    if (!canSwitchPhotos) return

    const nextIndex = (lightboxIndex + offset + photos.length) % photos.length
    setLightbox(photos[nextIndex]?.file_path ?? null)
  }

  useEffect(() => {
    if (!lightbox) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightbox(null)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPhotoByOffset(-1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        showPhotoByOffset(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canSwitchPhotos, lightbox, lightboxIndex, photos])

  return (
    <>
      {lightbox && (
        <div
          data-visit-lightbox="open"
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {canSwitchPhotos && (
            <button
              onClick={(event) => {
                event.stopPropagation()
                showPhotoByOffset(-1)
              }}
              style={{
                position: 'absolute',
                left: 24,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(0,0,0,0.38)',
                color: 'white',
                fontSize: 24,
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              ‹
            </button>
          )}
          <img
            src={photoSources[lightbox]}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8, objectFit: 'contain' }}
            alt=""
          />
          {canSwitchPhotos && (
            <button
              onClick={(event) => {
                event.stopPropagation()
                showPhotoByOffset(1)
              }}
              style={{
                position: 'absolute',
                right: 24,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(0,0,0,0.38)',
                color: 'white',
                fontSize: 24,
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              ›
            </button>
          )}
          <button
            onClick={(event) => {
              event.stopPropagation()
              setLightbox(null)
            }}
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              border: 'none',
              background: 'none',
              color: 'white',
              fontSize: 32,
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            ×
          </button>
          {canSwitchPhotos && (
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '6px 12px',
                borderRadius: 999,
                background: 'rgba(0,0,0,0.42)',
                color: 'white',
                fontSize: 12
              }}
            >
              {lightboxIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
      <div
        style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setLightbox(photo.file_path)}
            style={{
              width: 56,
              height: 56,
              borderRadius: 6,
              background: 'var(--theme-card-bg)',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0
            }}
          >
            {photoSources[photo.file_path] ? (
              <img
                src={photoSources[photo.file_path]}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=""
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--theme-text-soft)',
                  fontSize: 18
                }}
              >
                …
              </div>
            )}
            <button
              onClick={(event) => deletePhoto(photo.id, event)}
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontSize: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addPhotos}
          style={{
            width: 56,
            height: 56,
            borderRadius: 6,
            border: '1px dashed var(--theme-panel-border)',
            background: 'var(--theme-button-bg)',
            cursor: 'pointer',
            fontSize: 22,
            color: 'var(--theme-text-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          +
        </button>
      </div>
      {photoToDelete !== null && (
        <ConfirmDialog
          title={t('map.deletePhotoTitle')}
          message={t('map.deletePhotoConfirm')}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          danger
          onCancel={() => setPhotoToDelete(null)}
          onConfirm={confirmDeletePhoto}
        />
      )}
    </>
  )
}
