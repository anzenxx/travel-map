import { create } from 'zustand'
import {
  Country,
  City,
  Stats,
  AppTab,
  CountryStatus,
  UsaMode,
  AchievementEvents,
  AchievementEventKey,
  AchievementToast,
  MapFocusTarget
} from '../types'

const DEFAULT_ACHIEVEMENT_EVENTS: AchievementEvents = {
  openedAbout: false,
  exportedMap: false
}

interface AppState {
  countries: Record<string, Country>
  cities: City[]
  stats: Stats | null
  usaMode: UsaMode
  usStates: Record<string, CountryStatus>
  achievementEvents: AchievementEvents
  unlockedAchievements: string[]
  achievementToasts: AchievementToast[]
  achievementSoundEnabled: boolean
  activeTab: AppTab
  selectedRegionId: string | null
  selectedRegionType: 'country' | 'us-state' | null
  showCountryPopup: boolean
  popupPosition: { x: number; y: number } | null
  mapFocusTarget: MapFocusTarget | null

  setCountries: (countries: Country[]) => void
  setCities: (cities: City[]) => void
  setStats: (stats: Stats) => void
  setUsaMode: (usaMode: UsaMode) => void
  setUsStates: (states: Record<string, CountryStatus>) => void
  setAchievementEvents: (events: AchievementEvents) => void
  markAchievementEvent: (event: AchievementEventKey) => void
  setUnlockedAchievements: (ids: string[]) => void
  pushAchievementToast: (achievementId: string) => void
  removeAchievementToast: (toastId: string) => void
  setAchievementSoundEnabled: (enabled: boolean) => void
  setActiveTab: (tab: AppTab) => void
  focusCountryOnMap: (iso: string) => void
  clearMapFocusTarget: () => void
  selectCountry: (iso: string | null, pos?: { x: number; y: number }) => void
  selectUsState: (code: string | null, pos?: { x: number; y: number }) => void
  closePopup: () => void
  upsertCountry: (country: Country) => void
  removeCountry: (iso: string) => void
  upsertUsState: (code: string, status: CountryStatus) => void
  removeUsState: (code: string) => void
  addCity: (city: City) => void
  removeCity: (id: number) => void
  removeCitiesByCountry: (countryIso: string) => void
}

export const useStore = create<AppState>((set) => ({
  countries: {},
  cities: [],
  stats: null,
  usaMode: 'country',
  usStates: {},
  achievementEvents: DEFAULT_ACHIEVEMENT_EVENTS,
  unlockedAchievements: [],
  achievementToasts: [],
  achievementSoundEnabled: true,
  activeTab: 'map',
  selectedRegionId: null,
  selectedRegionType: null,
  showCountryPopup: false,
  popupPosition: null,
  mapFocusTarget: null,

  setCountries: (countries) =>
    set({
      countries: Object.fromEntries(countries.map((c) => [c.iso_code, c]))
    }),
  setCities: (cities) => set({ cities }),
  setStats: (stats) => set({ stats }),
  setUsaMode: (usaMode) =>
    set({ usaMode, showCountryPopup: false, selectedRegionId: null, selectedRegionType: null }),
  setUsStates: (usStates) => set({ usStates }),
  setAchievementEvents: (achievementEvents) => set({ achievementEvents }),
  markAchievementEvent: (event) =>
    set((state) => ({
      achievementEvents: { ...state.achievementEvents, [event]: true }
    })),
  setUnlockedAchievements: (unlockedAchievements) => set({ unlockedAchievements }),
  pushAchievementToast: (achievementId) =>
    set((state) => ({
      achievementToasts: [
        ...state.achievementToasts,
        {
          id: `${achievementId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          achievementId
        }
      ]
    })),
  removeAchievementToast: (toastId) =>
    set((state) => ({
      achievementToasts: state.achievementToasts.filter((toast) => toast.id !== toastId)
    })),
  setAchievementSoundEnabled: (achievementSoundEnabled) => set({ achievementSoundEnabled }),
  setActiveTab: (tab) => set({ activeTab: tab, showCountryPopup: false }),
  focusCountryOnMap: (iso) =>
    set({
      mapFocusTarget: { iso, requestId: Date.now() },
      activeTab: 'map',
      showCountryPopup: false
    }),
  clearMapFocusTarget: () => set({ mapFocusTarget: null }),
  selectCountry: (iso, pos) =>
    set({
      selectedRegionId: iso,
      selectedRegionType: iso ? 'country' : null,
      showCountryPopup: iso !== null,
      popupPosition: pos || null
    }),
  selectUsState: (code, pos) =>
    set({
      selectedRegionId: code,
      selectedRegionType: code ? 'us-state' : null,
      showCountryPopup: code !== null,
      popupPosition: pos || null
    }),
  closePopup: () =>
    set({ showCountryPopup: false, selectedRegionId: null, selectedRegionType: null }),
  upsertCountry: (country) =>
    set((state) => ({
      countries: { ...state.countries, [country.iso_code]: country }
    })),
  removeCountry: (iso) =>
    set((state) => {
      const next = { ...state.countries }
      delete next[iso]
      return { countries: next }
    }),
  upsertUsState: (code, status) =>
    set((state) => ({
      usStates: { ...state.usStates, [code]: status }
    })),
  removeUsState: (code) =>
    set((state) => {
      const next = { ...state.usStates }
      delete next[code]
      return { usStates: next }
    }),
  addCity: (city) => set((state) => ({ cities: [...state.cities, city] })),
  removeCity: (id) => set((state) => ({ cities: state.cities.filter((c) => c.id !== id) })),
  removeCitiesByCountry: (countryIso) =>
    set((state) => ({
      cities: state.cities.filter((city) => city.country_iso !== countryIso)
    }))
}))
