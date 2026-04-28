import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import OverlayPanel from './OverlayPanel'
import { ACHIEVEMENT_EVENTS_SETTINGS_KEY, stringifyAchievementEvents } from '../utils/achievements'

export default function AboutPanel() {
  const { t } = useTranslation()
  const { achievementEvents, markAchievementEvent, setActiveTab } = useStore()

  useEffect(() => {
    if (achievementEvents.openedAbout) return
    markAchievementEvent('openedAbout')
    window.api.settings.set(
      ACHIEVEMENT_EVENTS_SETTINGS_KEY,
      stringifyAchievementEvents({ ...achievementEvents, openedAbout: true })
    )
  }, [achievementEvents, markAchievementEvent])

  return (
    <OverlayPanel title={t('about.title')} onClose={() => setActiveTab('map')} width={760}>
      <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.6, color: 'var(--theme-text-muted)' }}>
        {t('about.intro')}
      </p>

      <Section title={t('about.featuresTitle')} items={[
        t('about.featureMap'),
        t('about.featureStatuses'),
        t('about.featureCities'),
        t('about.featureMemories')
      ]} />

      <Section title={t('about.mechanicsTitle')} items={[
        t('about.mechanicStatuses'),
        t('about.mechanicStats'),
        t('about.mechanicExport')
      ]} />

      <Section title={t('about.usaTitle')} items={[
        t('about.usaModeCountry'),
        t('about.usaModeStates'),
        t('about.usaModeCounting')
      ]} />
    </OverlayPanel>
  )
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 500,
        color: 'var(--theme-text-soft)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 8
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'var(--theme-card-bg-soft)',
              border: '0.5px solid var(--theme-divider)',
              fontSize: 13,
              lineHeight: 1.55,
              color: 'var(--theme-text-muted)'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
