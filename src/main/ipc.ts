import { IpcMain, dialog, BrowserWindow } from 'electron'
import { queries, CountryStatus, getStorageDir, City } from './database'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join, basename } from 'path'
import { readFile } from 'fs/promises'

interface NominatimResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
  category?: string
  name?: string
  addresstype?: string
  type?: string
  address?: {
    city?: string
    town?: string
    village?: string
    hamlet?: string
    locality?: string
    municipality?: string
    state?: string
    county?: string
    country?: string
  }
}

const allowedCityTypes = new Set(['city', 'town', 'village', 'municipality', 'hamlet', 'locality'])

function extractCityName(item: NominatimResult, fallback: string): string {
  return (
    item.address?.city ||
    item.address?.town ||
    item.address?.village ||
    item.address?.hamlet ||
    item.address?.locality ||
    item.name ||
    item.address?.municipality ||
    fallback
  )
}

function isSuspiciousCityName(name: string): boolean {
  const normalized = name.trim().toLowerCase()
  const suspiciousFragments = [
    'громада',
    'міська рада',
    'городской совет',
    'міський округ',
    'municipality',
    'district',
    'район',
    'область'
  ]

  return suspiciousFragments.some((fragment) => normalized.includes(fragment))
}

function buildCityDisplayName(item: NominatimResult, fallback: string): string {
  const cityName = extractCityName(item, fallback)
  const region = item.address?.state || item.address?.county
  const country = item.address?.country

  return [cityName, region, country].filter(Boolean).join(', ')
}

function buildCitySearchQueries(query: string): string[] {
  const normalized = query.trim().replace(/\s+/g, ' ')
  const parts = normalized.split(' ')
  const queries = new Set<string>([normalized])

  if (parts.length > 1) {
    queries.add(parts.slice(0, -1).join(' '))
  }

  return [...queries].filter((item) => item.length >= 2)
}

async function localizeCityName(city: City, language: string): Promise<string> {
  const params = new URLSearchParams({
    lat: String(city.lat),
    lon: String(city.lng),
    format: 'jsonv2',
    addressdetails: '1',
    zoom: '12'
  })

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      'Accept-Language': language || 'en',
      'User-Agent': 'atlas-travel/1.0'
    }
  })

  if (!response.ok) {
    throw new Error(`City reverse geocoding failed with status ${response.status}`)
  }

  const result = (await response.json()) as NominatimResult
  const localizedName = extractCityName(result, city.name)

  if (isSuspiciousCityName(localizedName) && !isSuspiciousCityName(city.name)) {
    return city.name
  }

  return localizedName
}

function getWindowBackgroundColor(theme: string): string {
  return theme === 'dark' ? '#0B1419' : '#F3EBDD'
}

function getPhotoMimeType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    case 'bmp':
      return 'image/bmp'
    default:
      return 'application/octet-stream'
  }
}

export function registerIpcHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('countries:getAll', () => queries.getAllCountries())
  ipcMain.handle('countries:get', (_, iso: string) => queries.getCountry(iso))
  ipcMain.handle('countries:upsert', (_, iso: string, status: CountryStatus) => {
    queries.upsertCountry(iso, status)
    return queries.getCountry(iso)
  })
  ipcMain.handle('countries:remove', (_, iso: string) => queries.removeCountry(iso))

  ipcMain.handle('cities:getAll', () => queries.getAllCities())
  ipcMain.handle('cities:getByCountry', (_, countryIso: string) =>
    queries.getCitiesByCountry(countryIso)
  )
  ipcMain.handle('cities:add', (_, countryIso: string, name: string, lat: number, lng: number) => {
    const result = queries.addCity(countryIso, name, lat, lng)
    return result.lastInsertRowid
  })
  ipcMain.handle('cities:localizeAll', async (_, language: string) => {
    const cities = queries.getAllCities()
    const updatedCities: City[] = []

    for (const city of cities) {
      try {
        const localizedName = await localizeCityName(city, language)
        if (localizedName && localizedName !== city.name) {
          queries.updateCityName(city.id, localizedName)
          updatedCities.push({ ...city, name: localizedName })
        } else {
          updatedCities.push(city)
        }
      } catch {
        updatedCities.push(city)
      }
    }

    return updatedCities
  })
  ipcMain.handle('cities:remove', (_, id: number) => queries.removeCity(id))
  ipcMain.handle(
    'cities:search',
    async (_, countryIso: string, query: string, language: string) => {
      const trimmedQuery = query.trim()
      if (trimmedQuery.length < 2) return []

      const rawData: NominatimResult[] = []
      const seenPlaces = new Set<number>()

      for (const searchQuery of buildCitySearchQueries(trimmedQuery)) {
        const params = new URLSearchParams({
          q: searchQuery,
          countrycodes: countryIso.toLowerCase(),
          format: 'jsonv2',
          addressdetails: '1',
          dedupe: '1',
          limit: '20'
        })

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
          {
            headers: {
              'Accept-Language': language || 'en',
              'User-Agent': 'atlas-travel/1.0'
            }
          }
        )

        if (!response.ok) {
          throw new Error(`City search failed with status ${response.status}`)
        }

        const items = (await response.json()) as NominatimResult[]
        for (const item of items) {
          if (seenPlaces.has(item.place_id)) continue
          seenPlaces.add(item.place_id)
          rawData.push(item)
        }
      }

      const data = rawData
      const seen = new Set<string>()
      const normalizedQuery = trimmedQuery.toLowerCase()

      return data
        .map((item) => {
          const name = extractCityName(item, trimmedQuery)
          const normalizedName = name.toLowerCase()
          const normalizedDisplayName = buildCityDisplayName(item, trimmedQuery).toLowerCase()
          const isExactNameMatch = normalizedName === normalizedQuery
          const isPrefixNameMatch = normalizedName.startsWith(normalizedQuery)

          return {
            id: String(item.place_id),
            name,
            displayName: buildCityDisplayName(item, trimmedQuery),
            lat: Number(item.lat),
            lng: Number(item.lon),
            matchRank: isExactNameMatch
              ? 0
              : isPrefixNameMatch
                ? 1
                : normalizedDisplayName.includes(normalizedQuery)
                  ? 2
                  : 3
          }
        })
        .filter((item) => {
          const source = data.find((entry) => String(entry.place_id) === item.id)
          if (!source) return false

          const itemCategory = source.category || ''
          const itemType = source.addresstype || source.type || ''
          const isAdministrativeCity =
            itemCategory === 'boundary' &&
            ['city', 'town', 'village', 'municipality', 'hamlet', 'locality'].includes(itemType)
          const looksLikeCity =
            (itemCategory === 'place' && allowedCityTypes.has(itemType)) || isAdministrativeCity

          return looksLikeCity
        })
        .sort((a, b) => a.matchRank - b.matchRank)
        .filter((item) => {
          const key = `${item.name.toLowerCase()}|${item.lat.toFixed(4)}|${item.lng.toFixed(4)}`
          if (seen.has(key)) return false
          seen.add(key)
          return Number.isFinite(item.lat) && Number.isFinite(item.lng)
        })
        .map(({ matchRank: _matchRank, ...item }) => item)
    }
  )

  ipcMain.handle('visits:get', (_, placeType: string, placeId: string) =>
    queries.getVisits(placeType, placeId)
  )
  ipcMain.handle('visits:getTimeline', () => queries.getTimelineVisits())
  ipcMain.handle(
    'visits:add',
    (
      _,
      placeType: string,
      placeId: string,
      dateFrom: string | null,
      dateTo: string | null,
      notes: string | null
    ) => {
      const result = queries.addVisit(placeType, placeId, dateFrom, dateTo, notes)
      return result.lastInsertRowid
    }
  )
  ipcMain.handle(
    'visits:update',
    (_, id: number, dateFrom: string | null, dateTo: string | null, notes: string | null) => {
      queries.updateVisit(id, dateFrom, dateTo, notes)
    }
  )
  ipcMain.handle('visits:delete', (_, id: number) => queries.deleteVisit(id))

  ipcMain.handle('photos:get', (_, visitId: number) => queries.getPhotos(visitId))
  ipcMain.handle('photos:getDataUrl', async (_, filePath: string) => {
    const buffer = await readFile(filePath)
    return `data:${getPhotoMimeType(filePath)};base64,${buffer.toString('base64')}`
  })
  ipcMain.handle('photos:add', async (_, visitId: number) => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }]
    })
    if (result.canceled || result.filePaths.length === 0) return []

    const photosDir = join(getStorageDir(), 'photos')
    if (!existsSync(photosDir)) mkdirSync(photosDir, { recursive: true })

    const added: number[] = []
    for (const srcPath of result.filePaths) {
      const filename = `${Date.now()}_${basename(srcPath)}`
      const destPath = join(photosDir, filename)
      copyFileSync(srcPath, destPath)
      const r = queries.addPhoto(visitId, destPath, null)
      added.push(Number(r.lastInsertRowid))
    }
    return added
  })
  ipcMain.handle('photos:delete', (_, id: number) => queries.deletePhoto(id))

  ipcMain.handle('tags:getAll', () => queries.getAllTags())
  ipcMain.handle('tags:create', (_, name: string) => queries.upsertTag(name))
  ipcMain.handle('tags:getForVisit', (_, visitId: number) => queries.getVisitTags(visitId))
  ipcMain.handle('tags:addToVisit', (_, visitId: number, tagId: number) =>
    queries.addVisitTag(visitId, tagId)
  )
  ipcMain.handle('tags:removeFromVisit', (_, visitId: number, tagId: number) =>
    queries.removeVisitTag(visitId, tagId)
  )

  ipcMain.handle('settings:get', (_, key: string) => queries.getSetting(key))
  ipcMain.handle('settings:set', (event, key: string, value: string) => {
    const result = queries.setSetting(key, value)
    if (key === 'theme') {
      BrowserWindow.fromWebContents(event.sender)?.setBackgroundColor(
        getWindowBackgroundColor(value)
      )
    }
    return result
  })
  ipcMain.handle('app:resetTravelData', () => {
    queries.resetTravelData()
  })
  ipcMain.handle('app:exportBackup', async () => {
    const result = await dialog.showSaveDialog({
      title: 'Export Atlas Travel backup',
      defaultPath: `atlas-travel-backup-${new Date().toISOString().slice(0, 10)}.json`,
      filters: [{ name: 'JSON backup', extensions: ['json'] }]
    })
    if (result.canceled || !result.filePath) return { ok: false }

    queries.exportBackup(result.filePath)
    return { ok: true, filePath: result.filePath }
  })
  ipcMain.handle('app:importBackup', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Import Atlas Travel backup',
      properties: ['openFile'],
      filters: [{ name: 'JSON backup', extensions: ['json'] }]
    })
    if (result.canceled || result.filePaths.length === 0) return { ok: false }

    queries.importBackup(result.filePaths[0])
    return { ok: true }
  })
  ipcMain.handle('window:minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })
  ipcMain.handle('window:toggleMaximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (!window) return
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle('window:close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })
  ipcMain.handle('window:isMaximized', (event) => {
    return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false
  })

  ipcMain.handle('stats:get', () => queries.getStats())
}
