import { useCallback } from 'react'
import { useStore } from '../store'
import { STATUS_COLORS, CountryStatus } from '../types'
import { featureToIso2 } from '../utils/isoMap'
import { computeDisplayStats, getUsStateCodeFromFips, TOTAL_COUNTRIES } from '../utils/usa'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { Topology, Objects } from 'topojson-specification'
import worldData from '../countries-50m.json'
import usStatesData from 'us-atlas/states-10m.json'

const EXPORT_WIDTH = 2400
const EXPORT_HEIGHT = 1400

function resolveThemeValue(value: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  if (!value.startsWith('var(')) return value

  const match = value.match(/var\((--[^,)]+)(?:,\s*([^)]+))?\)/)
  if (!match) return fallback

  const [, cssVar, cssFallback] = match
  const resolved = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
  return resolved || cssFallback?.trim() || fallback
}

export function useMapExport() {
  const { countries, cities, stats, usaMode, usStates } = useStore()

  const exportPng = useCallback(async () => {
    const canvas = document.createElement('canvas')
    canvas.width = EXPORT_WIDTH
    canvas.height = EXPORT_HEIGHT
    const ctx = canvas.getContext('2d')!

    const oceanColor = resolveThemeValue('var(--theme-ocean)', '#EAE3D6')
    const unvisitedColor = resolveThemeValue('var(--theme-country)', '#D8CCB8')
    const borderColor = resolveThemeValue('var(--theme-border)', '#9C8D76')
    const panelColor = resolveThemeValue('var(--theme-panel)', '#F7F1E7')
    const textColor = resolveThemeValue('var(--theme-text)', '#2F2923')
    const mutedTextColor = resolveThemeValue('var(--theme-text-muted)', '#7F7466')
    const softTextColor = resolveThemeValue('var(--theme-text-soft)', '#9B8E7D')
    const cardColor = resolveThemeValue('var(--theme-card-bg)', '#EFE4D2')
    const accentColor = resolveThemeValue('var(--theme-accent-soft)', '#A98052')
    const cityDotColor = resolveThemeValue('var(--theme-city-dot)', '#F7F1E7')
    const cityDotStrokeColor = resolveThemeValue('var(--theme-city-dot-stroke)', '#6F5337')

    const resolvedStatusColors: Record<CountryStatus, string> = {
      homeland: resolveThemeValue(STATUS_COLORS.homeland, '#B85C38'),
      resident: resolveThemeValue(STATUS_COLORS.resident, '#C6924A'),
      visited: resolveThemeValue(STATUS_COLORS.visited, '#6F8F69'),
      wishlist: resolveThemeValue(STATUS_COLORS.wishlist, '#6E6A8F')
    }

    ctx.fillStyle = oceanColor
    ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

    const projection = d3
      .geoNaturalEarth1()
      .scale(EXPORT_WIDTH / 6.5)
      .translate([EXPORT_WIDTH / 2, EXPORT_HEIGHT / 2])

    const path = d3.geoPath().projection(projection).context(ctx)

    const topo = worldData as unknown as Topology<Objects>
    const features = (topojson.feature(topo, topo.objects.countries) as GeoJSON.FeatureCollection)
      .features
    const usTopo = usStatesData as unknown as Topology<Objects>
    const usFeatures = (
      topojson.feature(usTopo, usTopo.objects.states) as GeoJSON.FeatureCollection
    ).features.filter((feature) => getUsStateCodeFromFips(feature.id as string))

    for (const feature of features) {
      const iso = featureToIso2(feature as any)
      const fillStatus =
        iso === 'US' && usaMode === 'states' ? undefined : iso ? countries[iso]?.status : undefined
      const fill = fillStatus ? resolvedStatusColors[fillStatus as CountryStatus] : unvisitedColor

      ctx.beginPath()
      path(feature as any)
      ctx.fillStyle = fill
      ctx.fill()
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    if (usaMode === 'states') {
      for (const feature of usFeatures) {
        const stateCode = getUsStateCodeFromFips(feature.id as string)
        if (!stateCode) continue

        const status = usStates[stateCode]
        const fill = status ? resolvedStatusColors[status] : unvisitedColor

        ctx.beginPath()
        path(feature as any)
        ctx.fillStyle = fill
        ctx.fill()
        ctx.strokeStyle = borderColor
        ctx.lineWidth = 0.7
        ctx.stroke()
      }
    }

    cities.forEach((city) => {
      const projected = projection([city.lng, city.lat])
      if (!projected) return
      const [cx, cy] = projected

      ctx.beginPath()
      ctx.arc(cx, cy, 5, 0, Math.PI * 2)
      ctx.fillStyle = cityDotColor
      ctx.fill()
      ctx.strokeStyle = cityDotStrokeColor
      ctx.lineWidth = 1.5
      ctx.stroke()
    })

    const displayStats = computeDisplayStats(countries, stats, usaMode, usStates)
    const visitedCount =
      displayStats.byStatus
        ?.filter((s) => ['visited', 'resident', 'homeland'].includes(s.status))
        ?.reduce((a, b) => a + b.count, 0) ?? 0
    const worldPct = Math.round((visitedCount / TOTAL_COUNTRIES) * 100)
    const cityCount = displayStats.totalCities
    const totalDays = displayStats.totalDays
    const byStatus = Object.fromEntries(
      (displayStats.byStatus ?? []).map((item) => [item.status, item.count])
    ) as Record<string, number>

    const topPanelY = 28
    const topPanelH = 172
    const leftPanelX = 28
    const leftPanelW = 440
    const rightPanelW = 380
    const rightPanelX = EXPORT_WIDTH - rightPanelW - 28

    ctx.fillStyle = panelColor
    ctx.fillRect(leftPanelX, topPanelY, leftPanelW, topPanelH)
    ctx.fillRect(rightPanelX, topPanelY, rightPanelW, topPanelH)

    ctx.strokeStyle = borderColor
    ctx.lineWidth = 1
    ctx.strokeRect(leftPanelX, topPanelY, leftPanelW, topPanelH)
    ctx.strokeRect(rightPanelX, topPanelY, rightPanelW, topPanelH)

    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'left'
    ctx.fillStyle = textColor
    ctx.font = '600 34px system-ui, -apple-system, sans-serif'
    ctx.fillText('Atlas Travel', leftPanelX + 24, topPanelY + 44)

    ctx.fillStyle = mutedTextColor
    ctx.font = '22px system-ui, -apple-system, sans-serif'
    ctx.fillText(`${visitedCount} countries marked`, leftPanelX + 24, topPanelY + 86)
    ctx.fillText(`${worldPct}% of the world`, leftPanelX + 24, topPanelY + 118)
    ctx.fillText(`${cityCount} cities saved`, leftPanelX + 24, topPanelY + 150)

    const statCards = [
      { label: 'Days tracked', value: String(totalDays), color: resolvedStatusColors.resident },
      {
        label: 'Homeland',
        value: String(byStatus.homeland ?? 0),
        color: resolvedStatusColors.homeland
      },
      {
        label: 'Resident',
        value: String(byStatus.resident ?? 0),
        color: resolvedStatusColors.resident
      },
      {
        label: 'Visited',
        value: String(byStatus.visited ?? 0),
        color: resolvedStatusColors.visited
      },
      {
        label: 'Wishlist',
        value: String(byStatus.wishlist ?? 0),
        color: resolvedStatusColors.wishlist
      }
    ]

    const statCardWidth = 156
    const statCardHeight = 58
    let cardX = rightPanelX + 20
    let cardY = topPanelY + 22

    for (let index = 0; index < statCards.length; index += 1) {
      const card = statCards[index]
      if (index === 3) {
        cardX = rightPanelX + 20
        cardY += statCardHeight + 14
      }

      ctx.fillStyle = cardColor
      ctx.fillRect(cardX, cardY, statCardWidth, statCardHeight)
      ctx.strokeStyle = borderColor
      ctx.strokeRect(cardX, cardY, statCardWidth, statCardHeight)

      ctx.fillStyle = card.color
      ctx.font = '600 26px system-ui, -apple-system, sans-serif'
      ctx.fillText(card.value, cardX + 14, cardY + 28)
      ctx.fillStyle = softTextColor
      ctx.font = '18px system-ui, -apple-system, sans-serif'
      ctx.fillText(card.label, cardX + 14, cardY + 48)

      cardX += statCardWidth + 14
    }

    const legendItems: { status: CountryStatus; label: string }[] = [
      { status: 'homeland', label: 'Homeland' },
      { status: 'resident', label: 'Resident' },
      { status: 'visited', label: 'Visited' },
      { status: 'wishlist', label: 'Wishlist' }
    ]
    const bottomPanelH = 104
    const bottomPanelY = EXPORT_HEIGHT - bottomPanelH - 28
    ctx.fillStyle = panelColor
    ctx.fillRect(28, bottomPanelY, EXPORT_WIDTH - 56, bottomPanelH)
    ctx.strokeStyle = borderColor
    ctx.strokeRect(28, bottomPanelY, EXPORT_WIDTH - 56, bottomPanelH)

    let lx = 56
    const ly = bottomPanelY + 64
    ctx.textAlign = 'left'
    ctx.font = '24px system-ui, sans-serif'
    for (const item of legendItems) {
      ctx.fillStyle = resolvedStatusColors[item.status]
      ctx.fillRect(lx, ly - 10, 20, 20)
      ctx.fillStyle = textColor
      ctx.fillText(item.label, lx + 28, ly + 2)
      lx += ctx.measureText(item.label).width + 60
    }

    ctx.fillStyle = accentColor
    ctx.font = '22px system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(
      `${visitedCount} countries · ${worldPct}% world · ${cityCount} cities · ${totalDays} days`,
      EXPORT_WIDTH - 52,
      ly + 2
    )

    return new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not create PNG blob'))
          return
        }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `atlas-travel-${new Date().toISOString().slice(0, 10)}.png`
        a.click()
        URL.revokeObjectURL(url)
        resolve()
      }, 'image/png')
    })
  }, [countries, cities, stats, usaMode, usStates])

  return { exportPng }
}
