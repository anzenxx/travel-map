import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAchievementImageSrc } from '../assets/achievementImages'
import { useStore } from '../store'
import { ACHIEVEMENTS } from '../utils/achievements'
import { TITLE_BAR_HEIGHT } from './TitleBar'

const TOAST_LIFETIME_MS = 3600
const FADE_MS = 420

export default function AchievementToasts() {
  const { t } = useTranslation()
  const { achievementToasts, removeAchievementToast } = useStore()

  return (
    <div
      style={{
        position: 'absolute',
        top: TITLE_BAR_HEIGHT + 16,
        right: 18,
        zIndex: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
        pointerEvents: 'none'
      }}
    >
      {achievementToasts.map((toast) => {
        const achievement = ACHIEVEMENTS.find((item) => item.id === toast.achievementId)
        if (!achievement) return null

        return (
          <AchievementToastCard
            key={toast.id}
            title={t('achievements.toastTitle')}
            achievementTitle={t(achievement.titleKey)}
            achievementDescription={t(achievement.descriptionKey)}
            achievementImageSrc={getAchievementImageSrc(achievement.id)}
            onDone={() => removeAchievementToast(toast.id)}
          />
        )
      })}
    </div>
  )
}

function AchievementToastCard({
  title,
  achievementTitle,
  achievementDescription,
  achievementImageSrc,
  onDone
}: {
  title: string
  achievementTitle: string
  achievementDescription: string
  achievementImageSrc?: string
  onDone: () => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const enterId = window.setTimeout(() => setVisible(true), 20)
    const exitId = window.setTimeout(() => setVisible(false), TOAST_LIFETIME_MS - FADE_MS)
    const removeId = window.setTimeout(onDone, TOAST_LIFETIME_MS)

    return () => {
      window.clearTimeout(enterId)
      window.clearTimeout(exitId)
      window.clearTimeout(removeId)
    }
  }, [onDone])

  return (
    <div
      style={{
        width: 320,
        maxWidth: 'calc(100vw - 36px)',
        borderRadius: 18,
        padding: '14px 16px',
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--theme-panel) 88%, var(--theme-accent-soft) 12%), var(--theme-paper))',
        border: '1px solid var(--theme-panel-border)',
        boxShadow: 'var(--theme-shadow)',
        color: 'var(--theme-text)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 6
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: achievementImageSrc ? 'transparent' : 'var(--theme-button-active-bg)',
            color: 'var(--theme-accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 19,
            fontWeight: 700,
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {achievementImageSrc ? (
            <img
              src={achievementImageSrc}
              alt={achievementTitle}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            '★'
          )}
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--theme-text-soft)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--theme-accent-strong)',
              lineHeight: 1.2
            }}
          >
            {achievementTitle}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--theme-text-muted)' }}>
        {achievementDescription}
      </div>
    </div>
  )
}
