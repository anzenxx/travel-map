import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import ExportButton from './ExportButton'
import { useStore } from '../store'
import { AppTheme, applyTheme, normalizeThemeSetting } from '../theme'
import { UsaMode } from '../types'
import { parseUsStatesSetting } from '../utils/usa'
import OverlayPanel from './OverlayPanel'
import ConfirmDialog from './ConfirmDialog'
import {
  ACHIEVEMENT_EVENTS_SETTINGS_KEY,
  ACHIEVEMENT_UNLOCKS_SETTINGS_KEY,
  DEFAULT_ACHIEVEMENT_EVENTS,
  parseAchievementEvents,
  parseAchievementUnlocks,
  stringifyAchievementEvents,
  stringifyAchievementUnlocks
} from '../utils/achievements'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'cs', label: 'Čeština' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' }
]

export default function SettingsPanel() {
  const { t } = useTranslation()
  const {
    setActiveTab,
    setCountries,
    setCities,
    setStats,
    setUsaMode,
    setUsStates,
    setAchievementEvents,
    setUnlockedAchievements,
    achievementSoundEnabled,
    setAchievementSoundEnabled,
    closePopup
  } = useStore()
  const [lang, setLang] = useState(i18n.language)
  const [theme, setTheme] = useState<AppTheme>('atlas')
  const [usaMode, setLocalUsaMode] = useState<UsaMode>('country')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [backupMessage, setBackupMessage] = useState<string | null>(null)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)

  useEffect(() => {
    window.api.settings.get('language').then((v) => {
      if (v) {
        setLang(v)
        i18n.changeLanguage(v)
      }
    })
    window.api.settings.get('theme').then((v) => setTheme(normalizeThemeSetting(v)))
    window.api.settings
      .get('usaMode')
      .then((v) => setLocalUsaMode(v === 'states' ? 'states' : 'country'))
  }, [])

  const handleLang = async (code: string) => {
    setLang(code)
    await i18n.changeLanguage(code)
    await window.api.settings.set('language', code)

    try {
      const localizedCities = await window.api.cities.localizeAll(code)
      setCities(localizedCities)
    } catch {
      // Keep current city names if localization fails.
    }
  }

  const handleTheme = (nextTheme: AppTheme) => {
    setTheme(nextTheme)
    window.api.settings.set('theme', nextTheme)
    applyTheme(nextTheme)
  }

  const handleAchievementSound = (enabled: boolean) => {
    setAchievementSoundEnabled(enabled)
    window.api.settings.set('achievementSoundEnabled', enabled ? 'true' : 'false')
  }

  const handleUsaMode = (nextMode: UsaMode) => {
    setLocalUsaMode(nextMode)
    setUsaMode(nextMode)
    window.api.settings.set('usaMode', nextMode)
  }

  const handleResetMap = async () => {
    await window.api.app.resetTravelData()
    await window.api.settings.set('usStates', '{}')
    await window.api.settings.set(
      ACHIEVEMENT_EVENTS_SETTINGS_KEY,
      stringifyAchievementEvents(DEFAULT_ACHIEVEMENT_EVENTS)
    )
    await window.api.settings.set(ACHIEVEMENT_UNLOCKS_SETTINGS_KEY, stringifyAchievementUnlocks([]))
    setCountries([])
    setCities([])
    setStats({ totalCountries: 0, totalCities: 0, totalDays: 0, byStatus: [] })
    setUsStates({})
    setAchievementEvents(DEFAULT_ACHIEVEMENT_EVENTS)
    setUnlockedAchievements([])
    setShowResetConfirm(false)
    closePopup()
    setActiveTab('map')
  }

  const reloadTravelData = async () => {
    const [
      countries,
      cities,
      stats,
      usaMode,
      usStates,
      achievementEvents,
      achievementUnlocks,
      achievementSoundEnabled
    ] = await Promise.all([
      window.api.countries.getAll(),
      window.api.cities.getAll(),
      window.api.stats.get(),
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
    setLocalUsaMode(usaMode === 'states' ? 'states' : 'country')
    setUsStates(parseUsStatesSetting(usStates))
    setAchievementEvents(parseAchievementEvents(achievementEvents))
    setUnlockedAchievements(parseAchievementUnlocks(achievementUnlocks))
    setAchievementSoundEnabled(achievementSoundEnabled !== 'false')
    closePopup()
  }

  const handleExportBackup = async () => {
    setBackupMessage(null)
    try {
      const result = await window.api.app.exportBackup()
      if (result.ok) {
        setBackupMessage(t('settings.backupExported'))
      }
    } catch {
      setBackupMessage(t('settings.backupExportError'))
    }
  }

  const handleImportBackup = async () => {
    setShowRestoreConfirm(false)
    setBackupMessage(null)
    try {
      const result = await window.api.app.importBackup()
      if (result.ok) {
        await reloadTravelData()
        setBackupMessage(t('settings.backupImported'))
      }
    } catch {
      setBackupMessage(t('settings.backupImportError'))
    }
  }

  return (
    <>
      <OverlayPanel title={t('settings.title')} onClose={() => setActiveTab('map')} width={640}>
        <Section label={t('settings.language')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLang(l.code)}
                style={{
                  textAlign: 'left',
                  padding: '7px 10px',
                  borderRadius: 7,
                  border:
                    lang === l.code
                      ? '1.5px solid var(--theme-accent-soft)'
                      : '0.5px solid var(--theme-panel-border)',
                  background: lang === l.code ? 'var(--theme-button-active-bg)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: lang === l.code ? 'var(--theme-accent-strong)' : 'var(--theme-text)',
                  fontWeight: lang === l.code ? 500 : 400
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Section>

        <Section label={t('settings.theme')}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['atlas', 'dark'] as const).map((tm) => (
              <button
                key={tm}
                onClick={() => handleTheme(tm)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: 7,
                  border:
                    theme === tm
                      ? '1.5px solid var(--theme-accent-soft)'
                      : '0.5px solid var(--theme-panel-border)',
                  background: theme === tm ? 'var(--theme-button-active-bg)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: theme === tm ? 'var(--theme-accent-strong)' : 'var(--theme-text)',
                  fontWeight: theme === tm ? 500 : 400
                }}
              >
                {tm === 'atlas' ? t('settings.themeAtlas') : t('settings.themeDark')}
              </button>
            ))}
          </div>
        </Section>

        <Section label={t('settings.sound')}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 10,
              border: '0.5px solid var(--theme-panel-border)',
              background: 'var(--theme-card-bg-soft)',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--theme-text)' }}>
              {t('settings.achievementSound')}
            </span>
            <input
              type="checkbox"
              checked={achievementSoundEnabled}
              onChange={(event) => handleAchievementSound(event.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: 'var(--theme-accent-soft)',
                cursor: 'pointer'
              }}
            />
          </label>
        </Section>

        <Section label={t('settings.usaMode')}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['country', 'states'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleUsaMode(mode)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: 7,
                  border:
                    usaMode === mode
                      ? '1.5px solid var(--theme-accent-soft)'
                      : '0.5px solid var(--theme-panel-border)',
                  background: usaMode === mode ? 'var(--theme-button-active-bg)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: usaMode === mode ? 'var(--theme-accent-strong)' : 'var(--theme-text)',
                  fontWeight: usaMode === mode ? 500 : 400
                }}
              >
                {mode === 'country' ? t('settings.usaModeCountry') : t('settings.usaModeStates')}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 11,
              lineHeight: 1.45,
              color: 'var(--theme-text-soft)'
            }}
          >
            {t('settings.usaModeHint')}
          </div>
        </Section>

        <Section label={t('settings.exportPng')}>
          <ExportButton />
        </Section>

        <Section label={t('settings.backupRestore')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleExportBackup}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 8,
                border: '0.5px solid var(--theme-panel-border)',
                background: 'var(--theme-button-bg)',
                color: 'var(--theme-text)',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              {t('settings.exportBackup')}
            </button>
            <button
              onClick={() => setShowRestoreConfirm(true)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 8,
                border: '0.5px solid var(--theme-panel-border)',
                background: 'var(--theme-button-bg)',
                color: 'var(--theme-text)',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              {t('settings.importBackup')}
            </button>
          </div>
          {backupMessage && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--theme-text-muted)' }}>
              {backupMessage}
            </div>
          )}
        </Section>

        <Section label={t('settings.resetMap')}>
          <div
            style={{
              borderRadius: 14,
              border: '1px solid var(--theme-danger-border)',
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--theme-danger-bg) 90%, var(--theme-panel)), var(--theme-panel))',
              padding: 12
            }}
          >
            <button
              onClick={() => setShowResetConfirm((value) => !value)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--theme-danger-border)',
                background: 'var(--theme-danger-bg)',
                color: 'var(--theme-danger)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500
              }}
            >
              {t('settings.resetMapAction')}
            </button>

            {showResetConfirm && (
              <div
                style={{
                  marginTop: 12,
                  padding: '12px 12px 10px',
                  borderRadius: 10,
                  background: 'var(--theme-panel)',
                  border: '1px solid var(--theme-panel-border)'
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: 'var(--theme-text-muted)',
                    marginBottom: 10
                  }}
                >
                  {t('settings.resetMapConfirm')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 8
                  }}
                >
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '0.5px solid var(--theme-panel-border)',
                      background: 'var(--theme-button-bg)',
                      color: 'var(--theme-text)',
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleResetMap}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--theme-danger-border)',
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
            )}
          </div>
        </Section>
      </OverlayPanel>
      {showRestoreConfirm && (
        <ConfirmDialog
          title={t('settings.restoreTitle')}
          message={t('settings.restoreConfirm')}
          confirmLabel={t('settings.importBackup')}
          cancelLabel={t('common.cancel')}
          danger
          onCancel={() => setShowRestoreConfirm(false)}
          onConfirm={handleImportBackup}
        />
      )}
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
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
