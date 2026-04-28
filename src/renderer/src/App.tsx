import { useEffect, useRef } from 'react'
import { useStore } from './store'
import WorldMap from './components/WorldMap'
import BottomBar from './components/BottomBar'
import CountryPopup from './components/CountryPopup'
import SettingsPanel from './components/SettingsPanel'
import CountriesPanel from './components/CountriesPanel'
import StatsPanel from './components/StatsPanel'
import TimelinePanel from './components/TimelinePanel'
import UsaStatePopup from './components/UsaStatePopup'
import AboutPanel from './components/AboutPanel'
import AchievementsPanel from './components/AchievementsPanel'
import AchievementToasts from './components/AchievementToasts'
import TitleBar, { TITLE_BAR_HEIGHT } from './components/TitleBar'
import './i18n'
import i18n from './i18n'
import { applyTheme, normalizeThemeSetting } from './theme'
import { parseUsStatesSetting } from './utils/usa'
import achievementUnlockedSound from './assets/sounds/achievement-unlocked.mp3'
import {
  ACHIEVEMENT_EVENTS_SETTINGS_KEY,
  ACHIEVEMENT_UNLOCKS_SETTINGS_KEY,
  getNextUnlockedAchievements,
  parseAchievementEvents,
  parseAchievementUnlocks,
  stringifyAchievementUnlocks
} from './utils/achievements'

export default function App() {
  const achievementAudioRef = useRef<HTMLAudioElement | null>(null)
  const {
    countries,
    usaMode,
    usStates,
    achievementEvents,
    unlockedAchievements,
    setCountries,
    setCities,
    setStats,
    setUsaMode,
    setUsStates,
    setAchievementEvents,
    setUnlockedAchievements,
    setAchievementSoundEnabled,
    pushAchievementToast,
    achievementSoundEnabled,
    showCountryPopup,
    selectedRegionId,
    selectedRegionType,
    popupPosition,
    activeTab,
    setActiveTab
  } = useStore()

  useEffect(() => {
    const load = async () => {
      const [
        countries,
        cities,
        stats,
        lang,
        theme,
        usaMode,
        usStates,
        achievementEvents,
        achievementUnlocks,
        achievementSoundEnabled
      ] = await Promise.all([
        window.api.countries.getAll(),
        window.api.cities.getAll(),
        window.api.stats.get(),
        window.api.settings.get('language'),
        window.api.settings.get('theme'),
        window.api.settings.get('usaMode'),
        window.api.settings.get('usStates'),
        window.api.settings.get(ACHIEVEMENT_EVENTS_SETTINGS_KEY),
        window.api.settings.get(ACHIEVEMENT_UNLOCKS_SETTINGS_KEY),
        window.api.settings.get('achievementSoundEnabled')
      ])
      setCountries(countries)
      setCities(cities)
      setStats(stats)
      setUsaMode(usaMode === 'states' ? 'states' : 'country')
      setUsStates(parseUsStatesSetting(usStates))
      setAchievementEvents(parseAchievementEvents(achievementEvents))
      setUnlockedAchievements(parseAchievementUnlocks(achievementUnlocks))
      setAchievementSoundEnabled(achievementSoundEnabled !== 'false')
      if (lang) i18n.changeLanguage(lang)
      applyTheme(normalizeThemeSetting(theme))
    }
    load()
  }, [])

  useEffect(() => {
    const nextUnlocks = getNextUnlockedAchievements(
      { countries, usaMode, usStates, events: achievementEvents },
      unlockedAchievements
    )

    if (nextUnlocks.length === unlockedAchievements.length) return

    const previous = new Set(unlockedAchievements)
    const newlyUnlocked = nextUnlocks.filter((id) => !previous.has(id))

    if (newlyUnlocked.length > 0 && achievementSoundEnabled) {
      if (!achievementAudioRef.current) {
        achievementAudioRef.current = new Audio(achievementUnlockedSound)
        achievementAudioRef.current.volume = 0.55
      }

      achievementAudioRef.current.currentTime = 0
      achievementAudioRef.current.play().catch(() => {
        // Audio can be blocked until the user has interacted with the app.
      })
    }

    setUnlockedAchievements(nextUnlocks)
    window.api.settings.set(
      ACHIEVEMENT_UNLOCKS_SETTINGS_KEY,
      stringifyAchievementUnlocks(nextUnlocks)
    )
    newlyUnlocked.forEach((id) => pushAchievementToast(id))
  }, [
    achievementEvents,
    achievementSoundEnabled,
    countries,
    pushAchievementToast,
    setUnlockedAchievements,
    unlockedAchievements,
    usaMode,
    usStates
  ])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (activeTab === 'map') return
      if (document.querySelector('[data-country-detail="open"]')) return

      setActiveTab('map')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, setActiveTab])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'var(--theme-ocean)',
        color: 'var(--theme-text)'
      }}
    >
      <TitleBar />
      <div
        style={{
          position: 'absolute',
          top: TITLE_BAR_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <WorldMap />
        <BottomBar />
      </div>

      {showCountryPopup &&
        selectedRegionId &&
        popupPosition &&
        selectedRegionType === 'country' && (
          <CountryPopup iso={selectedRegionId} position={popupPosition} />
        )}
      {showCountryPopup &&
        selectedRegionId &&
        popupPosition &&
        selectedRegionType === 'us-state' && (
          <UsaStatePopup code={selectedRegionId} position={popupPosition} />
        )}

      {activeTab === 'settings' && <SettingsPanel />}
      {activeTab === 'countries' && <CountriesPanel />}
      {activeTab === 'stats' && <StatsPanel />}
      {activeTab === 'timeline' && <TimelinePanel />}
      {activeTab === 'achievements' && <AchievementsPanel />}
      {activeTab === 'about' && <AboutPanel />}
      <AchievementToasts />
    </div>
  )
}
