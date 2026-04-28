export type CountryStatus = 'homeland' | 'resident' | 'visited' | 'wishlist'
export type UsaMode = 'country' | 'states'
export type AchievementEventKey = 'openedAbout' | 'exportedMap'

export interface Country {
  id: number
  iso_code: string
  status: CountryStatus
  created_at: string
}

export interface City {
  id: number
  country_iso: string
  name: string
  lat: number
  lng: number
  created_at: string
}

export interface Visit {
  id: number
  place_type: 'country' | 'city'
  place_id: string
  date_from: string | null
  date_to: string | null
  notes: string | null
  created_at: string
}

export interface TimelineVisit extends Visit {
  country_iso: string
  country_name?: string
  city_name?: string
  photo_count: number
}

export interface Photo {
  id: number
  visit_id: number
  file_path: string
  thumbnail_path: string | null
  created_at: string
}

export interface Tag {
  id: number
  name: string
}

export interface Stats {
  totalCountries: number
  totalCities: number
  totalDays: number
  byStatus: { status: string; count: number }[]
}

export interface AchievementEvents {
  openedAbout: boolean
  exportedMap: boolean
}

export interface AchievementToast {
  id: string
  achievementId: string
}

export interface MapFocusTarget {
  iso: string
  requestId: number
}

export const STATUS_COLORS: Record<CountryStatus, string> = {
  homeland: 'var(--status-homeland)',
  resident: 'var(--status-resident)',
  visited: 'var(--status-visited)',
  wishlist: 'var(--status-wishlist)'
}

export const STATUS_KEYS: Record<CountryStatus, string> = {
  homeland: 'status.homeland',
  resident: 'status.resident',
  visited: 'status.visited',
  wishlist: 'status.wishlist'
}

export type AppTab =
  | 'map'
  | 'countries'
  | 'stats'
  | 'timeline'
  | 'achievements'
  | 'settings'
  | 'about'
