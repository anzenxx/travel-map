import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import OverlayPanel from './OverlayPanel'
import { getAchievementImageSrc } from '../assets/achievementImages'
import { ACHIEVEMENTS, evaluateAchievements } from '../utils/achievements'

export default function AchievementsPanel() {
  const { t } = useTranslation()
  const { countries, usaMode, usStates, achievementEvents, unlockedAchievements, setActiveTab } =
    useStore()

  const progressMap = useMemo(() => {
    const progress = evaluateAchievements({
      countries,
      usaMode,
      usStates,
      events: achievementEvents
    })

    return Object.fromEntries(progress.map((item) => [item.id, item]))
  }, [achievementEvents, countries, usaMode, usStates])

  const unlockedCount = unlockedAchievements.length

  return (
    <OverlayPanel
      title={t('achievements.title')}
      onClose={() => setActiveTab('map')}
      width={940}
      maxHeight="calc(100vh - 112px)"
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '16px 18px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, var(--theme-card-bg), var(--theme-card-bg-soft))',
            border: '0.5px solid var(--theme-panel-border)'
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: 'var(--theme-text-muted)', marginBottom: 4 }}>
              {t('achievements.subtitle')}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--theme-accent-strong)' }}>
              {unlockedCount}/{ACHIEVEMENTS.length}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 230px))',
          justifyContent: 'center',
          gap: 14
        }}
      >
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = unlockedAchievements.includes(achievement.id)
          const progress = progressMap[achievement.id]
          const progressText = `${Math.min(progress.progress, progress.target)}/${progress.target}`
          const imageSrc = getAchievementImageSrc(achievement.id)

          return (
            <article
              key={achievement.id}
              style={{
                position: 'relative',
                overflow: 'hidden',
                width: 230,
                minWidth: 230,
                height: 356,
                borderRadius: 28,
                border: unlocked
                  ? '1px solid var(--theme-panel-border)'
                  : '1px dashed var(--theme-divider)',
                background: unlocked
                  ? 'linear-gradient(180deg, color-mix(in srgb, var(--theme-panel) 90%, var(--theme-accent-soft) 10%), var(--theme-paper))'
                  : 'linear-gradient(180deg, color-mix(in srgb, var(--theme-card-bg) 88%, transparent), color-mix(in srgb, var(--theme-panel) 90%, transparent))',
                boxShadow: unlocked ? 'var(--theme-shadow)' : 'none',
                opacity: unlocked ? 1 : 0.82,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {!unlocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                    padding: '4px 8px',
                    borderRadius: 999,
                    background: 'var(--theme-button-bg)',
                    color: 'var(--theme-text-soft)',
                    fontSize: 11,
                    fontWeight: 600
                  }}
                >
                  {t('achievements.locked')}
                </div>
              )}

              <div
                style={{
                  position: 'relative',
                  height: 150,
                  borderBottom: unlocked
                    ? '1px solid var(--theme-panel-border)'
                    : '1px solid var(--theme-divider)',
                  background: unlocked
                    ? 'linear-gradient(135deg, color-mix(in srgb, var(--theme-accent-soft) 40%, var(--theme-panel)), color-mix(in srgb, var(--theme-ocean) 70%, var(--theme-panel)))'
                    : 'repeating-linear-gradient(135deg, var(--theme-card-bg-soft), var(--theme-card-bg-soft) 16px, var(--theme-card-bg) 16px, var(--theme-card-bg) 32px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--theme-text-soft)',
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  filter: unlocked ? 'none' : 'grayscale(0.3)'
                }}
              >
                {imageSrc ? (
                  <>
                    <img
                      src={imageSrc}
                      alt={t(achievement.titleKey)}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: unlocked
                          ? 'linear-gradient(180deg, transparent 0%, color-mix(in srgb, transparent 68%, var(--theme-panel)) 100%)'
                          : 'linear-gradient(180deg, color-mix(in srgb, transparent 20%, var(--theme-panel)) 0%, color-mix(in srgb, var(--theme-panel) 26%, transparent) 100%)'
                      }}
                    />
                  </>
                ) : (
                  t('achievements.imageSlot')
                )}
              </div>

              <div
                style={{
                  padding: '16px 16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    lineHeight: 1,
                    marginBottom: 10,
                    color: unlocked ? 'var(--theme-accent-soft)' : 'var(--theme-text-soft)'
                  }}
                >
                  {unlocked ? '★' : '☆'}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: 'var(--theme-accent-strong)',
                    minHeight: 42,
                    marginBottom: 8
                  }}
                >
                  {t(achievement.titleKey)}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: 'var(--theme-text-muted)',
                    minHeight: 80,
                    marginBottom: 12
                  }}
                >
                  {t(achievement.descriptionKey)}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 7,
                        borderRadius: 999,
                        background: 'var(--theme-card-bg-soft)',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, (progress.progress / progress.target) * 100)}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: unlocked
                            ? 'var(--theme-accent-soft)'
                            : 'var(--theme-text-soft)'
                        }}
                      />
                    </div>
                    <div
                      style={{
                        flexShrink: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: unlocked ? 'var(--theme-accent-strong)' : 'var(--theme-text-soft)'
                      }}
                    >
                      {progressText}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </OverlayPanel>
  )
}
