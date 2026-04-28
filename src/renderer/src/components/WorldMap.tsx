import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { Topology, Objects } from 'topojson-specification'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { STATUS_COLORS, CountryStatus, City, Country } from '../types'
import { featureToIso2, getCountryName } from '../utils/isoMap'
import { getDisplayCountries, getUsStateCodeFromFips, getUsStateName } from '../utils/usa'
import CountryDetail from './CountryDetail'
import worldData from '../countries-50m.json'
import usStatesData from 'us-atlas/states-10m.json'

const UNVISITED_COLOR = 'var(--theme-country)'
const BORDER_COLOR = 'var(--theme-border)'
const OCEAN_COLOR = 'var(--theme-ocean)'
const LABEL_MIN_FONT_SIZE = 7
const LABEL_MAX_FONT_SIZE = 18
const CITY_LABEL_ZOOM_THRESHOLD = 3
const US_STATE_LABEL_ZOOM_THRESHOLD = 2.2
const COUNTRY_FOCUS_MIN_SCALE = 2.2
const COUNTRY_FOCUS_MAX_SCALE = 6
const HIGHLIGHT_STROKE_WIDTH = 1.25
const SELECTED_STROKE_WIDTH = 1.45
const MAP_PAN_MARGIN_FACTOR = 0.65

const measureCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
const measureContext = measureCanvas?.getContext('2d') ?? null

function measureLabelWidth(text: string, fontSize: number): number {
  if (!measureContext) return text.length * fontSize * 0.6
  measureContext.font = `600 ${fontSize}px system-ui, sans-serif`
  return measureContext.measureText(text).width
}

function getFittingFontSize(name: string, width: number, height: number): number | null {
  const availableWidth = width * 0.82
  const availableHeight = height * 0.42

  if (availableWidth < 18 || availableHeight < LABEL_MIN_FONT_SIZE) {
    return null
  }

  const maxFontSize = Math.min(LABEL_MAX_FONT_SIZE, Math.floor(availableHeight))
  for (let fontSize = maxFontSize; fontSize >= LABEL_MIN_FONT_SIZE; fontSize -= 1) {
    if (measureLabelWidth(name, fontSize) <= availableWidth) {
      return fontSize
    }
  }

  return null
}

function getLabelFeature(
  feature: GeoJSON.Feature,
  path: d3.GeoPath<any, d3.GeoPermissibleObjects>
): GeoJSON.Feature | null {
  if (!feature.geometry) return null

  if (feature.geometry.type === 'Polygon') {
    return feature
  }

  if (feature.geometry.type === 'MultiPolygon') {
    let largestFeature: GeoJSON.Feature | null = null
    let largestArea = 0

    for (const coordinates of feature.geometry.coordinates) {
      const polygonFeature: GeoJSON.Feature = {
        type: 'Feature',
        id: feature.id,
        properties: feature.properties,
        geometry: {
          type: 'Polygon',
          coordinates
        }
      }

      const area = path.area(polygonFeature)
      if (area > largestArea) {
        largestArea = area
        largestFeature = polygonFeature
      }
    }

    return largestFeature
  }

  return feature
}

function getPolygonParts(feature: GeoJSON.Feature): GeoJSON.Feature[] {
  if (!feature.geometry) return []

  if (feature.geometry.type === 'Polygon') {
    return [feature]
  }

  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates.map((coordinates) => ({
      type: 'Feature',
      id: feature.id,
      properties: feature.properties,
      geometry: {
        type: 'Polygon',
        coordinates
      }
    }))
  }

  return [feature]
}

function getClosestPolygonPart(
  feature: GeoJSON.Feature,
  path: d3.GeoPath<any, d3.GeoPermissibleObjects>,
  transform: d3.ZoomTransform,
  point: { x: number; y: number }
): GeoJSON.Feature | null {
  const parts = getPolygonParts(feature)
  let bestPart: GeoJSON.Feature | null = null
  let bestDistance = Number.POSITIVE_INFINITY

  for (const part of parts) {
    if (!part.geometry || path.area(part) <= 0) continue

    const centroid = path.centroid(part)
    if (!centroid || Number.isNaN(centroid[0]) || Number.isNaN(centroid[1])) continue

    const dx = transform.applyX(centroid[0]) - point.x
    const dy = transform.applyY(centroid[1]) - point.y
    const distance = dx * dx + dy * dy

    if (distance < bestDistance) {
      bestDistance = distance
      bestPart = part
    }
  }

  return bestPart
}

function boxesOverlap(
  a: { left: number; right: number; top: number; bottom: number },
  b: { left: number; right: number; top: number; bottom: number },
  padding = 4
): boolean {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  )
}

function redrawLabels(
  overlayLayer: d3.Selection<SVGGElement, unknown, null, undefined>,
  features: GeoJSON.Feature[],
  projection: d3.GeoProjection,
  transform: d3.ZoomTransform,
  countries: Record<string, Country>,
  language: string,
  usaMode: 'country' | 'states'
) {
  const labelsLayer = overlayLayer
    .append('g')
    .attr('class', 'country-labels')
    .style('pointer-events', 'none')

  const path = d3.geoPath().projection(projection)
  const candidates: Array<{
    iso: string
    name: string
    fontSize: number
    x: number
    y: number
    area: number
    box: { left: number; right: number; top: number; bottom: number }
  }> = []

  for (const feature of features) {
    const iso = featureToIso2(feature as any)
    if (!iso) continue
    if (iso === 'US' && usaMode === 'states') continue

    const country = countries[iso]
    if (!country) continue

    const labelFeature = getLabelFeature(feature, path)
    if (!labelFeature) continue

    const bounds = path.bounds(labelFeature)
    const centroid = path.centroid(labelFeature)
    if (!centroid || Number.isNaN(centroid[0]) || Number.isNaN(centroid[1])) continue

    const width = Math.abs(transform.applyX(bounds[1][0]) - transform.applyX(bounds[0][0]))
    const height = Math.abs(transform.applyY(bounds[1][1]) - transform.applyY(bounds[0][1]))
    const name = getCountryName(iso, language)
    const fontSize = getFittingFontSize(name, width, height)

    if (!fontSize) continue

    const x = transform.applyX(centroid[0])
    const y = transform.applyY(centroid[1])
    const labelWidth = measureLabelWidth(name, fontSize)
    const labelHeight = fontSize * 1.15

    candidates.push({
      iso,
      name,
      fontSize,
      x,
      y,
      area: path.area(labelFeature),
      box: {
        left: x - labelWidth / 2,
        right: x + labelWidth / 2,
        top: y - labelHeight / 2,
        bottom: y + labelHeight / 2
      }
    })
  }

  candidates.sort((a, b) => b.area - a.area)

  const placedBoxes: Array<{ left: number; right: number; top: number; bottom: number }> = []

  for (const candidate of candidates) {
    const collides = placedBoxes.some((box) => boxesOverlap(box, candidate.box))
    if (collides) continue

    labelsLayer
      .append('text')
      .attr('x', candidate.x)
      .attr('y', candidate.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', candidate.fontSize)
      .attr('font-family', 'system-ui, sans-serif')
      .attr('font-weight', '600')
      .attr('fill', 'var(--theme-map-label-fill)')
      .attr('stroke', 'var(--theme-map-label-stroke)')
      .attr('stroke-width', 2)
      .attr('paint-order', 'stroke')
      .text(candidate.name)

    placedBoxes.push(candidate.box)
  }
}

function redrawUsStateLabels(
  overlayLayer: d3.Selection<SVGGElement, unknown, null, undefined>,
  features: GeoJSON.Feature[],
  projection: d3.GeoProjection,
  transform: d3.ZoomTransform,
  usStates: Record<string, CountryStatus>,
  language: string
) {
  if (transform.k < US_STATE_LABEL_ZOOM_THRESHOLD) return

  const labelsLayer = overlayLayer
    .append('g')
    .attr('class', 'us-state-labels')
    .style('pointer-events', 'none')

  const path = d3.geoPath().projection(projection)

  for (const feature of features) {
    const code = getUsStateCodeFromFips(feature.id as string)
    if (!code) continue
    if (!usStates[code]) continue

    const labelFeature = getLabelFeature(feature, path)
    if (!labelFeature) continue

    const bounds = path.bounds(labelFeature)
    const centroid = path.centroid(labelFeature)
    if (!centroid || Number.isNaN(centroid[0]) || Number.isNaN(centroid[1])) continue

    const width = Math.abs(transform.applyX(bounds[1][0]) - transform.applyX(bounds[0][0]))
    const height = Math.abs(transform.applyY(bounds[1][1]) - transform.applyY(bounds[0][1]))
    const name = getUsStateName(code, language)
    const fontSize = getFittingFontSize(name, width, height)

    if (!fontSize || fontSize < 8) continue

    labelsLayer
      .append('text')
      .attr('x', transform.applyX(centroid[0]))
      .attr('y', transform.applyY(centroid[1]))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', fontSize)
      .attr('font-family', 'system-ui, sans-serif')
      .attr('font-weight', '600')
      .attr('fill', 'var(--theme-map-label-fill)')
      .attr('stroke', 'var(--theme-map-label-stroke)')
      .attr('stroke-width', 2)
      .attr('paint-order', 'stroke')
      .text(name)
  }
}

function redrawHoverUsStateLabel(
  overlayLayer: d3.Selection<SVGGElement, unknown, null, undefined>,
  feature: GeoJSON.Feature,
  projection: d3.GeoProjection,
  transform: d3.ZoomTransform,
  code: string,
  language: string
) {
  overlayLayer.selectAll('.hover-us-state-label').remove()

  const path = d3.geoPath().projection(projection)
  const labelFeature = getLabelFeature(feature, path)
  if (!labelFeature) return

  const centroid = path.centroid(labelFeature)
  if (!centroid || Number.isNaN(centroid[0]) || Number.isNaN(centroid[1])) return

  const x = transform.applyX(centroid[0])
  const y = transform.applyY(centroid[1])
  const name = getUsStateName(code, language)

  const label = overlayLayer
    .append('g')
    .attr('class', 'hover-us-state-label')
    .style('pointer-events', 'none')
    .style('opacity', 0)

  label
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', 13)
    .attr('font-family', 'system-ui, sans-serif')
    .attr('font-weight', '600')
    .attr('fill', 'var(--theme-map-label-fill)')
    .attr('stroke', 'var(--theme-map-label-stroke)')
    .attr('stroke-width', 2)
    .attr('paint-order', 'stroke')
    .text(name)

  label.transition().duration(140).style('opacity', 1)
}

function redrawCities(
  overlayLayer: d3.Selection<SVGGElement, unknown, null, undefined>,
  projection: d3.GeoProjection,
  transform: d3.ZoomTransform,
  cities: City[],
  onCityClick?: (city: City) => void
) {
  const citiesLayer = overlayLayer
    .append('g')
    .attr('class', 'cities')
    .style('pointer-events', 'auto')

  if (transform.k < CITY_LABEL_ZOOM_THRESHOLD) return

  for (const city of cities) {
    const projected = projection([city.lng, city.lat])
    if (!projected) return
    const [x, y] = projected
    const screenX = transform.applyX(x)
    const screenY = transform.applyY(y)

    const cityGroup = citiesLayer
      .append('g')
      .style('pointer-events', 'auto')
      .style('cursor', 'pointer')
      .on('click', (event) => {
        event.stopPropagation()
        onCityClick?.(city)
      })

    cityGroup
      .append('circle')
      .attr('cx', screenX)
      .attr('cy', screenY)
      .attr('r', 4)
      .attr('fill', 'var(--theme-city-dot)')
      .attr('stroke', 'var(--theme-city-dot-stroke)')
      .attr('stroke-width', 1.5)

    cityGroup
      .append('text')
      .attr('x', screenX + 7)
      .attr('y', screenY)
      .attr('dominant-baseline', 'central')
      .attr('font-size', 10)
      .attr('font-family', 'system-ui, sans-serif')
      .attr('font-weight', '500')
      .attr('fill', 'var(--theme-text)')
      .attr('stroke', 'var(--theme-paper)')
      .attr('stroke-width', 2)
      .attr('paint-order', 'stroke')
      .text(city.name)
  }
}

function redrawHoverCountryLabel(
  overlayLayer: d3.Selection<SVGGElement, unknown, null, undefined>,
  feature: GeoJSON.Feature,
  projection: d3.GeoProjection,
  transform: d3.ZoomTransform,
  iso: string,
  language: string
) {
  overlayLayer.selectAll('.hover-country-label').remove()

  const path = d3.geoPath().projection(projection)
  const labelFeature = getLabelFeature(feature, path)
  if (!labelFeature) return

  const centroid = path.centroid(labelFeature)
  if (!centroid || Number.isNaN(centroid[0]) || Number.isNaN(centroid[1])) return

  const x = transform.applyX(centroid[0])
  const y = transform.applyY(centroid[1])
  const name = getCountryName(iso, language)

  const label = overlayLayer
    .append('g')
    .attr('class', 'hover-country-label')
    .style('pointer-events', 'none')
    .style('opacity', 0)

  label
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', 13)
    .attr('font-family', 'system-ui, sans-serif')
    .attr('font-weight', '600')
    .attr('fill', 'var(--theme-map-label-fill)')
    .attr('stroke', 'var(--theme-map-label-stroke)')
    .attr('stroke-width', 2)
    .attr('paint-order', 'stroke')
    .text(name)

  label.transition().duration(140).style('opacity', 1)
}

export default function WorldMap() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapLayerRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
  const overlayLayerRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
  const projectionRef = useRef<d3.GeoProjection | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const featuresRef = useRef<GeoJSON.Feature[]>([])
  const usStateFeaturesRef = useRef<GeoJSON.Feature[]>([])
  const transformRef = useRef(d3.zoomIdentity)
  const countriesRef = useRef<Record<string, Country>>({})
  const citiesRef = useRef<City[]>([])
  const languageRef = useRef('en')
  const usaModeRef = useRef<'country' | 'states'>('country')
  const usStatesRef = useRef<Record<string, CountryStatus>>({})
  const hoveredCountryRef = useRef<string | null>(null)
  const hoveredUsStateRef = useRef<string | null>(null)
  const selectedRegionRef = useRef<{ id: string | null; type: 'country' | 'us-state' | null }>({
    id: null,
    type: null
  })
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [mapSearchQuery, setMapSearchQuery] = useState('')

  const selectCountry = useStore((state) => state.selectCountry)
  const selectUsState = useStore((state) => state.selectUsState)
  const closePopup = useStore((state) => state.closePopup)
  const mapFocusTarget = useStore((state) => state.mapFocusTarget)
  const clearMapFocusTarget = useStore((state) => state.clearMapFocusTarget)
  const selectedRegionId = useStore((state) => state.selectedRegionId)
  const selectedRegionType = useStore((state) => state.selectedRegionType)
  const countries = useStore((state) => state.countries)
  const cities = useStore((state) => state.cities)
  const usaMode = useStore((state) => state.usaMode)
  const usStates = useStore((state) => state.usStates)
  const { t, i18n } = useTranslation()

  countriesRef.current = Object.fromEntries(
    getDisplayCountries(countries, usaMode, usStates).map((country) => [country.iso_code, country])
  )
  citiesRef.current = cities
  languageRef.current = i18n.language
  usaModeRef.current = usaMode
  usStatesRef.current = usStates
  selectedRegionRef.current = { id: selectedRegionId, type: selectedRegionType }

  function getColor(iso: string): string {
    if (iso === 'US' && usaModeRef.current === 'states') return UNVISITED_COLOR
    const country = countriesRef.current[iso]
    if (!country) return UNVISITED_COLOR
    return STATUS_COLORS[country.status as CountryStatus] || UNVISITED_COLOR
  }

  function getUsStateColor(code: string): string {
    const status = usStatesRef.current[code]
    if (!status) return UNVISITED_COLOR
    return STATUS_COLORS[status] || UNVISITED_COLOR
  }

  function updateMapHighlights() {
    if (!mapLayerRef.current) return

    const hoveredCountry = hoveredCountryRef.current
    const hoveredUsState = hoveredUsStateRef.current
    const selected = selectedRegionRef.current

    mapLayerRef.current
      .selectAll<SVGPathElement, GeoJSON.Feature>('path.country')
      .attr('fill', (d: any) => {
        const iso = featureToIso2(d)
        return iso ? getColor(iso) : UNVISITED_COLOR
      })
      .attr('stroke', (d: any) => {
        const iso = featureToIso2(d)
        const isActive =
          Boolean(iso && iso === hoveredCountry) ||
          Boolean(iso && selected.type === 'country' && selected.id === iso)
        return isActive ? 'var(--theme-map-highlight)' : BORDER_COLOR
      })
      .attr('stroke-width', (d: any) => {
        const iso = featureToIso2(d)
        if (iso && selected.type === 'country' && selected.id === iso) return SELECTED_STROKE_WIDTH
        if (iso && iso === hoveredCountry) return HIGHLIGHT_STROKE_WIDTH
        return 0.5
      })
      .attr('filter', (d: any) => {
        const iso = featureToIso2(d)
        const isActive =
          Boolean(iso && iso === hoveredCountry) ||
          Boolean(iso && selected.type === 'country' && selected.id === iso)
        return isActive ? 'url(#map-country-highlight)' : null
      })
      .attr('opacity', 1)
      .filter((d: any) => {
        const iso = featureToIso2(d)
        return (
          Boolean(iso && iso === hoveredCountry) ||
          Boolean(iso && selected.type === 'country' && selected.id === iso)
        )
      })
      .raise()

    mapLayerRef.current
      .selectAll<SVGPathElement, GeoJSON.Feature>('path.us-state')
      .attr('fill', (d) => {
        const code = getUsStateCodeFromFips(d.id as string)
        return code ? getUsStateColor(code) : UNVISITED_COLOR
      })
      .attr('stroke', (d) => {
        const code = getUsStateCodeFromFips(d.id as string)
        const isActive =
          Boolean(code && code === hoveredUsState) ||
          Boolean(code && selected.type === 'us-state' && selected.id === code)
        return isActive ? 'var(--theme-map-highlight)' : BORDER_COLOR
      })
      .attr('stroke-width', (d) => {
        const code = getUsStateCodeFromFips(d.id as string)
        if (code && selected.type === 'us-state' && selected.id === code)
          return SELECTED_STROKE_WIDTH
        if (code && code === hoveredUsState) return HIGHLIGHT_STROKE_WIDTH
        return 0.45
      })
      .attr('filter', (d) => {
        const code = getUsStateCodeFromFips(d.id as string)
        const isActive =
          Boolean(code && code === hoveredUsState) ||
          Boolean(code && selected.type === 'us-state' && selected.id === code)
        return isActive ? 'url(#map-country-highlight)' : null
      })
      .attr('opacity', 1)
      .filter((d) => {
        const code = getUsStateCodeFromFips(d.id as string)
        return (
          Boolean(code && code === hoveredUsState) ||
          Boolean(code && selected.type === 'us-state' && selected.id === code)
        )
      })
      .raise()
  }

  function redrawOverlays() {
    if (!overlayLayerRef.current || !projectionRef.current) return

    overlayLayerRef.current.selectAll('*').remove()
    redrawLabels(
      overlayLayerRef.current,
      featuresRef.current,
      projectionRef.current,
      transformRef.current,
      countriesRef.current,
      languageRef.current,
      usaModeRef.current
    )
    if (usaModeRef.current === 'states') {
      redrawUsStateLabels(
        overlayLayerRef.current,
        usStateFeaturesRef.current,
        projectionRef.current,
        transformRef.current,
        usStatesRef.current,
        languageRef.current
      )
    }
    redrawCities(
      overlayLayerRef.current,
      projectionRef.current,
      transformRef.current,
      citiesRef.current,
      setSelectedCity
    )
  }

  function focusCountry(iso: string, clientPoint?: { x: number; y: number }) {
    if (!svgRef.current || !containerRef.current || !projectionRef.current || !zoomRef.current) {
      return false
    }

    const feature = featuresRef.current.find((item) => featureToIso2(item as any) === iso)
    if (!feature) return false

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    const path = d3.geoPath().projection(projectionRef.current)
    const rect = container.getBoundingClientRect()
    const localPoint = clientPoint
      ? { x: clientPoint.x - rect.left, y: clientPoint.y - rect.top }
      : null
    const focusFeature =
      (localPoint
        ? getClosestPolygonPart(feature, path, transformRef.current, localPoint)
        : getLabelFeature(feature, path)) ?? feature
    const bounds = path.bounds(focusFeature)
    const dx = bounds[1][0] - bounds[0][0]
    const dy = bounds[1][1] - bounds[0][1]

    if (dx <= 0 || dy <= 0) return false

    const scale = Math.min(
      COUNTRY_FOCUS_MAX_SCALE,
      Math.max(COUNTRY_FOCUS_MIN_SCALE, 0.82 / Math.max(dx / width, dy / height))
    )
    const x = (bounds[0][0] + bounds[1][0]) / 2
    const y = (bounds[0][1] + bounds[1][1]) / 2
    const transform = d3.zoomIdentity
      .translate(width / 2 - scale * x, height / 2 - scale * y)
      .scale(scale)

    const svg = d3.select(svgRef.current)
    svg.interrupt()
    svg.transition().duration(650).call(zoomRef.current.transform, transform)

    const centroid = path.centroid(focusFeature)
    selectCountry(iso, {
      x: rect.left + transform.applyX(centroid[0]),
      y: rect.top + transform.applyY(centroid[1])
    })

    return true
  }

  function focusCity(city: City) {
    if (!svgRef.current || !containerRef.current || !projectionRef.current || !zoomRef.current) {
      return false
    }

    const point = projectionRef.current([city.lng, city.lat])
    if (!point) return false

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    const scale = Math.max(transformRef.current.k, 5)
    const transform = d3.zoomIdentity
      .translate(width / 2 - scale * point[0], height / 2 - scale * point[1])
      .scale(scale)

    const svg = d3.select(svgRef.current)
    svg.interrupt()
    svg.transition().duration(650).call(zoomRef.current.transform, transform)
    setSelectedCity(city)
    return true
  }

  function resetMapView() {
    if (!svgRef.current || !zoomRef.current) return
    const svg = d3.select(svgRef.current)
    svg.interrupt()
    svg.transition().duration(520).call(zoomRef.current.transform, d3.zoomIdentity)
  }

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    const svg = d3.select(svgRef.current)

    svg.selectAll('*').remove()
    svg
      .attr('width', width)
      .attr('height', height)
      .style('background', OCEAN_COLOR)
      .style('cursor', 'grab')

    const defs = svg.append('defs')
    const highlightFilter = defs
      .append('filter')
      .attr('id', 'map-country-highlight')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%')
    const brighten = highlightFilter
      .append('feComponentTransfer')
      .attr('in', 'SourceGraphic')
      .attr('result', 'brightened')
    brighten.append('feFuncR').attr('type', 'linear').attr('slope', 1.12)
    brighten.append('feFuncG').attr('type', 'linear').attr('slope', 1.12)
    brighten.append('feFuncB').attr('type', 'linear').attr('slope', 1.12)
    highlightFilter
      .append('feDropShadow')
      .attr('in', 'brightened')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('stdDeviation', 2.4)
      .attr('flood-color', 'var(--theme-map-highlight-glow)')
      .attr('flood-opacity', 1)

    const projection = d3
      .geoNaturalEarth1()
      .scale(width / 6.5)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)
    const mapLayer = svg.append('g').attr('class', 'map-layer')
    const overlayLayer = svg.append('g').attr('class', 'overlay-layer')
    const topo = worldData as unknown as Topology<Objects>
    const features = (topojson.feature(topo, topo.objects.countries) as GeoJSON.FeatureCollection)
      .features
    const usTopo = usStatesData as unknown as Topology<Objects>
    const usStateFeatures = (
      topojson.feature(usTopo, usTopo.objects.states) as GeoJSON.FeatureCollection
    ).features.filter((feature) => getUsStateCodeFromFips(feature.id as string))

    projectionRef.current = projection
    mapLayerRef.current = mapLayer
    overlayLayerRef.current = overlayLayer
    featuresRef.current = features
    usStateFeaturesRef.current = usStateFeatures

    mapLayer
      .selectAll<SVGPathElement, GeoJSON.Feature>('path.country')
      .data(features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('data-id', (d: any) => String(d.id))
      .attr('d', path as any)
      .attr('fill', (d: any) => getColor(featureToIso2(d) || ''))
      .attr('stroke', BORDER_COLOR)
      .attr('stroke-width', 0.5)
      .attr('vector-effect', 'non-scaling-stroke')
      .style('cursor', 'pointer')
      .style(
        'transition',
        'fill 170ms ease, stroke 170ms ease, stroke-width 170ms ease, filter 190ms ease'
      )
      .on('mouseover', function (_event, d: any) {
        const iso = featureToIso2(d)
        if (iso === 'US' && usaModeRef.current === 'states') return
        hoveredCountryRef.current = iso ?? null
        d3.select(this).raise()
        updateMapHighlights()
        if (iso && !countriesRef.current[iso] && overlayLayerRef.current && projectionRef.current) {
          redrawHoverCountryLabel(
            overlayLayerRef.current,
            d,
            projectionRef.current,
            transformRef.current,
            iso,
            languageRef.current
          )
        }
      })
      .on('mouseout', function () {
        hoveredCountryRef.current = null
        overlayLayerRef.current?.selectAll('.hover-country-label').remove()
        updateMapHighlights()
      })
      .on('click', function (event: MouseEvent, d: any) {
        event.stopPropagation()
        const iso = featureToIso2(d)
        if (!iso) return
        if (iso === 'US' && usaModeRef.current === 'states') return
        if (!focusCountry(iso, { x: event.clientX, y: event.clientY })) {
          selectCountry(iso, { x: event.clientX, y: event.clientY })
        }
      })

    mapLayer
      .append('g')
      .attr('class', 'us-states-layer')
      .selectAll<SVGPathElement, GeoJSON.Feature>('path.us-state')
      .data(usStateFeatures)
      .enter()
      .append('path')
      .attr('class', 'us-state')
      .attr('d', path as any)
      .attr('fill', (d) => {
        const code = getUsStateCodeFromFips(d.id as string)
        return code ? getUsStateColor(code) : UNVISITED_COLOR
      })
      .attr('stroke', BORDER_COLOR)
      .attr('stroke-width', 0.45)
      .attr('vector-effect', 'non-scaling-stroke')
      .style('cursor', 'pointer')
      .style('display', usaModeRef.current === 'states' ? 'block' : 'none')
      .style(
        'transition',
        'fill 170ms ease, stroke 170ms ease, stroke-width 170ms ease, filter 190ms ease'
      )
      .on('mouseover', function (_event, d) {
        if (usaModeRef.current !== 'states') return
        const code = getUsStateCodeFromFips(d.id as string)
        hoveredUsStateRef.current = code
        d3.select(this).raise()
        updateMapHighlights()
        if (code && overlayLayerRef.current && projectionRef.current) {
          redrawHoverUsStateLabel(
            overlayLayerRef.current,
            d,
            projectionRef.current,
            transformRef.current,
            code,
            languageRef.current
          )
        }
      })
      .on('mouseout', function () {
        hoveredUsStateRef.current = null
        overlayLayerRef.current?.selectAll('.hover-us-state-label').remove()
        updateMapHighlights()
      })
      .on('click', function (event: MouseEvent, d) {
        if (usaModeRef.current !== 'states') return
        event.stopPropagation()
        const code = getUsStateCodeFromFips(d.id as string)
        if (!code) return
        selectUsState(code, { x: event.clientX, y: event.clientY })
      })

    const borders = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b)
    mapLayer
      .append('path')
      .datum(borders)
      .attr('class', 'borders')
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', BORDER_COLOR)
      .attr('stroke-width', 0.4)
      .style('pointer-events', 'none')

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [-width * MAP_PAN_MARGIN_FACTOR, -height * MAP_PAN_MARGIN_FACTOR],
        [width * (1 + MAP_PAN_MARGIN_FACTOR), height * (1 + MAP_PAN_MARGIN_FACTOR)]
      ])
      .extent([
        [0, 0],
        [width, height]
      ])
      .on('start', () => {
        svg.style('cursor', 'grabbing')
        mapLayer.selectAll('path.country, path.us-state').style('cursor', 'grabbing')
      })
      .on('zoom', (event) => {
        transformRef.current = event.transform
        mapLayer.attr('transform', event.transform.toString())
        redrawOverlays()
      })
      .on('end', () => {
        svg.style('cursor', 'grab')
        mapLayer.selectAll('path.country, path.us-state').style('cursor', 'pointer')
      })

    zoomRef.current = zoom
    svg.call(zoom)

    svg.on('click', (event) => {
      if ((event.target as Element).tagName === 'svg') closePopup()
    })

    redrawOverlays()
    updateMapHighlights()

    return () => {
      zoomRef.current = null
      svg.selectAll('*').remove()
    }
  }, [closePopup, selectCountry, selectUsState, usaMode])

  useEffect(() => {
    if (!mapFocusTarget) return
    if (focusCountry(mapFocusTarget.iso)) {
      clearMapFocusTarget()
    }
  }, [clearMapFocusTarget, mapFocusTarget, selectCountry])

  useEffect(() => {
    if (!mapLayerRef.current) return

    mapLayerRef.current
      .selectAll<SVGPathElement, GeoJSON.Feature>('path.us-state')
      .style('display', usaMode === 'states' ? 'block' : 'none')

    updateMapHighlights()
    redrawOverlays()
  }, [countries, cities, i18n.language, selectedRegionId, selectedRegionType, usaMode, usStates])

  const normalizedMapSearch = mapSearchQuery.trim().toLowerCase()
  const mapSearchResults = normalizedMapSearch
    ? [
        ...featuresRef.current
          .map((feature) => featureToIso2(feature as any))
          .filter((iso): iso is string => Boolean(iso))
          .filter((iso) =>
            getCountryName(iso, i18n.language).toLowerCase().includes(normalizedMapSearch)
          )
          .slice(0, 6)
          .map((iso) => ({
            id: `country-${iso}`,
            type: 'country' as const,
            label: getCountryName(iso, i18n.language),
            iso
          })),
        ...cities
          .filter((city) => city.name.toLowerCase().includes(normalizedMapSearch))
          .slice(0, 6)
          .map((city) => ({
            id: `city-${city.id}`,
            type: 'city' as const,
            label: city.name,
            city
          }))
      ].slice(0, 8)
    : []

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          zIndex: 90,
          width: 300,
          pointerEvents: 'auto'
        }}
      >
        <input
          value={mapSearchQuery}
          onChange={(event) => setMapSearchQuery(event.target.value)}
          placeholder={t('map.searchMap')}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '9px 12px',
            borderRadius: 999,
            border: '0.5px solid var(--theme-panel-border)',
            background: 'var(--theme-button-bg)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'var(--theme-shadow)',
            color: 'var(--theme-text)',
            fontSize: 13,
            outline: 'none'
          }}
        />
        {mapSearchResults.length > 0 && (
          <div
            style={{
              marginTop: 6,
              borderRadius: 12,
              overflow: 'hidden',
              border: '0.5px solid var(--theme-panel-border)',
              background: 'var(--theme-panel)',
              boxShadow: 'var(--theme-shadow)'
            }}
          >
            {mapSearchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  if (result.type === 'country') {
                    focusCountry(result.iso)
                  } else {
                    focusCity(result.city)
                  }
                  setMapSearchQuery('')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: '9px 11px',
                  border: 'none',
                  borderBottom: '0.5px solid var(--theme-divider)',
                  background: 'transparent',
                  color: 'var(--theme-text)',
                  cursor: 'pointer',
                  fontSize: 12,
                  textAlign: 'left'
                }}
              >
                <span>{result.label}</span>
                <span style={{ color: 'var(--theme-text-soft)' }}>
                  {result.type === 'country'
                    ? t('tabs.countries')
                    : getCountryName(result.city.country_iso, i18n.language)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={resetMapView}
        title={t('map.centerMap')}
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          zIndex: 90,
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '0.5px solid var(--theme-panel-border)',
          background: 'var(--theme-button-bg)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'var(--theme-shadow)',
          color: 'var(--theme-accent-strong)',
          cursor: 'pointer',
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1
        }}
      >
        ⌖
      </button>
      {selectedCity && (
        <CountryDetail
          iso={selectedCity.country_iso}
          placeType="city"
          placeId={String(selectedCity.id)}
          title={selectedCity.name}
          onClose={() => setSelectedCity(null)}
        />
      )}
    </div>
  )
}
