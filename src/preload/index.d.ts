import { ElectronAPI } from '@electron-toolkit/preload'

type CountryStatus = 'homeland' | 'resident' | 'visited' | 'wishlist'

interface TravelAPI {
  countries: {
    getAll: () => Promise<any[]>
    get: (iso: string) => Promise<any>
    upsert: (iso: string, status: string) => Promise<any>
    remove: (iso: string) => Promise<any>
  }
  cities: {
    getAll: () => Promise<any[]>
    getByCountry: (countryIso: string) => Promise<any[]>
    localizeAll: (language: string) => Promise<any[]>
    search: (countryIso: string, query: string, language: string) => Promise<any[]>
    add: (countryIso: string, name: string, lat: number, lng: number) => Promise<number>
    remove: (id: number) => Promise<any>
  }
  visits: {
    get: (placeType: string, placeId: string) => Promise<any[]>
    getTimeline: () => Promise<any[]>
    add: (
      placeType: string,
      placeId: string,
      dateFrom: string | null,
      dateTo: string | null,
      notes: string | null
    ) => Promise<number>
    update: (
      id: number,
      dateFrom: string | null,
      dateTo: string | null,
      notes: string | null
    ) => Promise<void>
    delete: (id: number) => Promise<any>
  }
  photos: {
    get: (visitId: number) => Promise<any[]>
    getDataUrl: (filePath: string) => Promise<string>
    add: (visitId: number) => Promise<number[]>
    delete: (id: number) => Promise<any>
  }
  tags: {
    getAll: () => Promise<any[]>
    create: (name: string) => Promise<any>
    getForVisit: (visitId: number) => Promise<any[]>
    addToVisit: (visitId: number, tagId: number) => Promise<any>
    removeFromVisit: (visitId: number, tagId: number) => Promise<any>
  }
  settings: {
    get: (key: string) => Promise<string | undefined>
    set: (key: string, value: string) => Promise<any>
  }
  app: {
    resetTravelData: () => Promise<void>
    exportBackup: () => Promise<{ ok: boolean; filePath?: string }>
    importBackup: () => Promise<{ ok: boolean }>
  }
  window: {
    minimize: () => Promise<void>
    toggleMaximize: () => Promise<void>
    close: () => Promise<void>
    isMaximized: () => Promise<boolean>
  }
  stats: {
    get: () => Promise<any>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: TravelAPI
  }
}
