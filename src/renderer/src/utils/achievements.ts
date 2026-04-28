import { AchievementEvents, Country, CountryStatus, UsaMode } from '../types'
import { getEffectiveCountryStatus } from './usa'

export const ACHIEVEMENT_EVENTS_SETTINGS_KEY = 'achievementEvents'
export const ACHIEVEMENT_UNLOCKS_SETTINGS_KEY = 'achievementUnlocks'

export type AchievementCategory =
  | 'onboarding'
  | 'progress'
  | 'exploration'
  | 'collection'
  | 'functional'

export interface AchievementContext {
  countries: Record<string, Country>
  usaMode: UsaMode
  usStates: Record<string, CountryStatus>
  events: AchievementEvents
}

export interface AchievementDefinition {
  id: string
  category: AchievementCategory
  titleKey: string
  descriptionKey: string
  target: number
  evaluate: (context: AchievementContext) => number
}

export interface AchievementProgress {
  id: string
  progress: number
  target: number
  unlockedByProgress: boolean
}

export const DEFAULT_ACHIEVEMENT_EVENTS: AchievementEvents = {
  openedAbout: false,
  exportedMap: false
}

const VISITED_LIKE_STATUSES = new Set<CountryStatus>(['homeland', 'resident', 'visited'])

const EUROPE_ISOS = [
  'DE',
  'FR',
  'IT',
  'ES',
  'PT',
  'GB',
  'PL',
  'UA',
  'RO',
  'NL',
  'BE',
  'SE',
  'NO',
  'FI',
  'DK',
  'AT',
  'CH',
  'CZ',
  'HU',
  'SK',
  'HR',
  'BA',
  'RS',
  'ME',
  'MK',
  'SI',
  'AL',
  'GR',
  'BG',
  'TR',
  'LT',
  'LV',
  'EE',
  'LU',
  'IE',
  'IS',
  'MT',
  'CY',
  'BY',
  'MD',
  'AM',
  'AZ',
  'GE',
  'RU'
]
const ASIA_ISOS = [
  'CN',
  'JP',
  'KR',
  'IN',
  'ID',
  'TH',
  'VN',
  'PH',
  'MY',
  'SG',
  'BN',
  'TL',
  'LA',
  'KH',
  'MM',
  'NP',
  'BT',
  'BD',
  'LK',
  'PK',
  'AF',
  'IR',
  'IQ',
  'SY',
  'JO',
  'LB',
  'IL',
  'PS',
  'SA',
  'AE',
  'QA',
  'KW',
  'YE',
  'OM',
  'KZ',
  'UZ',
  'TM',
  'TJ',
  'KG',
  'MN',
  'AZ',
  'GE',
  'AM',
  'TR',
  'KP',
  'TW'
]
const OCEANIA_ISOS = [
  'AU',
  'NZ',
  'PG',
  'FJ',
  'SB',
  'VU',
  'WS',
  'TO',
  'PW',
  'FM',
  'MH',
  'KI',
  'NR',
  'TV'
]
const SCANDINAVIA_ISOS = ['DK', 'FI', 'IS', 'NO', 'SE']
const MEDITERRANEAN_ISOS = [
  'ES',
  'FR',
  'IT',
  'SI',
  'HR',
  'BA',
  'ME',
  'AL',
  'GR',
  'TR',
  'CY',
  'SY',
  'LB',
  'IL',
  'PS',
  'EG',
  'LY',
  'TN',
  'DZ',
  'MA',
  'MT'
]
const ISLAND_STATE_ISOS = [
  'AU',
  'BS',
  'BB',
  'CV',
  'CY',
  'DM',
  'DO',
  'FJ',
  'GD',
  'HT',
  'IS',
  'IE',
  'JM',
  'JP',
  'KI',
  'LK',
  'MG',
  'MT',
  'MU',
  'MV',
  'NR',
  'NZ',
  'PH',
  'SG',
  'TT',
  'WS',
  'TO',
  'TV',
  'VU'
]
const LANDLOCKED_ISOS = [
  'AD',
  'AF',
  'AM',
  'AT',
  'AZ',
  'BF',
  'BI',
  'BT',
  'BY',
  'CF',
  'CH',
  'CZ',
  'ET',
  'HU',
  'KZ',
  'KG',
  'LA',
  'LI',
  'LS',
  'LU',
  'MD',
  'MK',
  'ML',
  'MN',
  'MW',
  'NE',
  'NP',
  'PY',
  'RS',
  'RW',
  'SK',
  'SM',
  'SS',
  'SZ',
  'TD',
  'TJ',
  'TM',
  'UG',
  'UZ',
  'VA',
  'ZM',
  'ZW'
]
const COASTAL_ISOS = [
  'AL',
  'AO',
  'AR',
  'AU',
  'BD',
  'BE',
  'BG',
  'BR',
  'CA',
  'CL',
  'CN',
  'CO',
  'CR',
  'DE',
  'DK',
  'DO',
  'EC',
  'EG',
  'ES',
  'FI',
  'FR',
  'GB',
  'GE',
  'GH',
  'GR',
  'HR',
  'ID',
  'IE',
  'IL',
  'IN',
  'IS',
  'IT',
  'JM',
  'JP',
  'KE',
  'KR',
  'LB',
  'LK',
  'LT',
  'LV',
  'MA',
  'ME',
  'MG',
  'MM',
  'MX',
  'MY',
  'NG',
  'NL',
  'NO',
  'NZ',
  'OM',
  'PA',
  'PE',
  'PH',
  'PL',
  'PT',
  'RO',
  'RU',
  'SA',
  'SE',
  'SG',
  'SI',
  'SO',
  'TH',
  'TN',
  'TR',
  'TW',
  'TZ',
  'UA',
  'US',
  'UY',
  'VE',
  'VN',
  'ZA'
]

const NEIGHBOR_GRAPH: Record<string, string[]> = {
  AL: ['GR', 'ME', 'MK', 'XK'],
  AT: ['CH', 'CZ', 'DE', 'HU', 'IT', 'LI', 'SK', 'SI'],
  BE: ['DE', 'FR', 'LU', 'NL'],
  BG: ['GR', 'MK', 'RO', 'RS', 'TR'],
  BA: ['HR', 'ME', 'RS'],
  BY: ['LV', 'LT', 'PL', 'RU', 'UA'],
  CH: ['AT', 'DE', 'FR', 'IT', 'LI'],
  CZ: ['AT', 'DE', 'PL', 'SK'],
  DE: ['AT', 'BE', 'CH', 'CZ', 'DK', 'FR', 'LU', 'NL', 'PL'],
  DK: ['DE'],
  EE: ['LV', 'RU'],
  ES: ['FR', 'PT'],
  FI: ['NO', 'RU', 'SE'],
  FR: ['BE', 'DE', 'ES', 'IT', 'LU', 'CH'],
  GB: ['IE'],
  GE: ['AM', 'AZ', 'RU', 'TR'],
  GR: ['AL', 'BG', 'MK', 'TR'],
  HR: ['BA', 'HU', 'ME', 'RS', 'SI'],
  HU: ['AT', 'HR', 'RO', 'RS', 'SI', 'SK', 'UA'],
  IE: ['GB'],
  IT: ['AT', 'CH', 'FR', 'SI', 'SM', 'VA'],
  LT: ['BY', 'LV', 'PL', 'RU'],
  LU: ['BE', 'DE', 'FR'],
  LV: ['BY', 'EE', 'LT', 'RU'],
  MD: ['RO', 'UA'],
  ME: ['AL', 'BA', 'HR', 'RS', 'XK'],
  MK: ['AL', 'BG', 'GR', 'RS', 'XK'],
  NL: ['BE', 'DE'],
  NO: ['FI', 'SE', 'RU'],
  PL: ['BY', 'CZ', 'DE', 'LT', 'RU', 'SK', 'UA'],
  PT: ['ES'],
  RO: ['BG', 'HU', 'MD', 'RS', 'UA'],
  RS: ['BA', 'BG', 'HR', 'HU', 'ME', 'MK', 'RO', 'XK'],
  RU: ['AZ', 'BY', 'EE', 'FI', 'GE', 'KZ', 'LT', 'LV', 'NO', 'PL', 'UA'],
  SE: ['FI', 'NO'],
  SI: ['AT', 'HR', 'HU', 'IT'],
  SK: ['AT', 'CZ', 'HU', 'PL', 'UA'],
  TR: ['AM', 'AZ', 'BG', 'GE', 'GR', 'IR', 'IQ', 'SY'],
  UA: ['BY', 'HU', 'MD', 'PL', 'RO', 'RU', 'SK'],
  AM: ['AZ', 'GE', 'IR', 'TR'],
  AZ: ['AM', 'GE', 'IR', 'RU', 'TR'],
  CN: ['IN', 'KZ', 'KG', 'LA', 'MN', 'MM', 'NP', 'PK', 'RU', 'VN'],
  IN: ['BD', 'BT', 'CN', 'MM', 'NP', 'PK'],
  JP: [],
  KR: ['KP'],
  KZ: ['CN', 'KG', 'RU', 'TM', 'UZ'],
  KG: ['CN', 'KZ', 'TJ', 'UZ'],
  LA: ['CN', 'KH', 'MM', 'TH', 'VN'],
  MM: ['BD', 'CN', 'IN', 'LA', 'TH'],
  MN: ['CN', 'RU'],
  NP: ['CN', 'IN'],
  PK: ['AF', 'CN', 'IN', 'IR'],
  TH: ['KH', 'LA', 'MM', 'MY'],
  VN: ['CN', 'KH', 'LA'],
  MY: ['TH', 'SG', 'BN'],
  SG: ['MY'],
  ID: ['MY', 'PG', 'TL'],
  PH: [],
  AU: [],
  NZ: [],
  EG: ['IL', 'LY', 'SD'],
  IL: ['EG', 'JO', 'LB', 'PS', 'SY'],
  JO: ['IL', 'IQ', 'SA', 'SY'],
  LB: ['IL', 'SY'],
  SA: ['IQ', 'JO', 'KW', 'OM', 'QA', 'YE'],
  AE: ['OM', 'SA'],
  OM: ['AE', 'SA', 'YE'],
  BR: ['AR', 'BO', 'CO', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE'],
  AR: ['BO', 'BR', 'CL', 'PY', 'UY'],
  CL: ['AR', 'BO', 'PE'],
  PE: ['BR', 'BO', 'CL', 'CO', 'EC'],
  CO: ['BR', 'EC', 'PE', 'VE'],
  MX: ['US', 'GT', 'BZ'],
  CA: ['US'],
  US: ['CA', 'MX']
}

function getStatusForIso(context: AchievementContext, iso: string): CountryStatus | undefined {
  return getEffectiveCountryStatus(iso, context.countries, context.usaMode, context.usStates)
}

function isVisitedLike(status: CountryStatus | undefined): boolean {
  return !!status && VISITED_LIKE_STATUSES.has(status)
}

function countByIsoSet(
  context: AchievementContext,
  isos: string[],
  predicate: (status: CountryStatus | undefined) => boolean
): number {
  return isos.reduce((count, iso) => count + (predicate(getStatusForIso(context, iso)) ? 1 : 0), 0)
}

function getVisitedLikeIsos(context: AchievementContext): string[] {
  const visited = new Set<string>()
  for (const iso of Object.keys(context.countries)) {
    if (isVisitedLike(getStatusForIso(context, iso))) {
      visited.add(iso)
    }
  }

  if (context.usaMode === 'states' && isVisitedLike(getStatusForIso(context, 'US'))) {
    visited.add('US')
  }

  return [...visited]
}

function countVisitedContinents(context: AchievementContext): number {
  const continents = [EUROPE_ISOS, ASIA_ISOS, OCEANIA_ISOS, MEDITERRANEAN_ISOS]
  const continentIds = ['europe', 'asia', 'oceania', 'mediterranean']
  const visited = new Set<string>()

  continents.forEach((isos, index) => {
    if (countByIsoSet(context, isos, isVisitedLike) > 0) {
      visited.add(continentIds[index])
    }
  })

  const africa = ['DZ', 'EG', 'ET', 'KE', 'MA', 'NG', 'TN', 'ZA']
  const northAmerica = ['US', 'CA', 'MX', 'CR', 'CU', 'DO', 'JM']
  const southAmerica = ['AR', 'BR', 'CL', 'CO', 'EC', 'PE', 'UY']

  if (countByIsoSet(context, africa, isVisitedLike) > 0) visited.add('africa')
  if (countByIsoSet(context, northAmerica, isVisitedLike) > 0) visited.add('north-america')
  if (countByIsoSet(context, southAmerica, isVisitedLike) > 0) visited.add('south-america')

  visited.delete('mediterranean')
  return visited.size
}

function getLargestNeighborCluster(context: AchievementContext): number {
  const visited = new Set(getVisitedLikeIsos(context))
  const seen = new Set<string>()
  let largest = 0

  for (const iso of visited) {
    if (seen.has(iso)) continue
    const stack = [iso]
    seen.add(iso)
    let size = 0

    while (stack.length > 0) {
      const current = stack.pop()!
      size += 1
      for (const neighbor of NEIGHBOR_GRAPH[current] ?? []) {
        if (!visited.has(neighbor) || seen.has(neighbor)) continue
        seen.add(neighbor)
        stack.push(neighbor)
      }
    }

    largest = Math.max(largest, size)
  }

  return largest
}

function countExactStatuses(context: AchievementContext, status: CountryStatus): number {
  let count = 0
  for (const country of Object.values(context.countries)) {
    if (country.status === status) count += 1
  }

  if (context.usaMode === 'states' && getStatusForIso(context, 'US') === status) {
    count += 1
  }

  return count
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_step',
    category: 'onboarding',
    titleKey: 'achievements.items.first_step.title',
    descriptionKey: 'achievements.items.first_step.description',
    target: 1,
    evaluate: (context) => Math.min(countExactStatuses(context, 'visited'), 1)
  },
  {
    id: 'want_here',
    category: 'onboarding',
    titleKey: 'achievements.items.want_here.title',
    descriptionKey: 'achievements.items.want_here.description',
    target: 1,
    evaluate: (context) => Math.min(countExactStatuses(context, 'wishlist'), 1)
  },
  {
    id: 'my_geography',
    category: 'onboarding',
    titleKey: 'achievements.items.my_geography.title',
    descriptionKey: 'achievements.items.my_geography.description',
    target: 3,
    evaluate: (context) => {
      let count = 0
      if (countExactStatuses(context, 'visited') > 0) count += 1
      if (countExactStatuses(context, 'wishlist') > 0) count += 1
      if (countExactStatuses(context, 'homeland') > 0) count += 1
      return count
    }
  },
  {
    id: 'curious',
    category: 'onboarding',
    titleKey: 'achievements.items.curious.title',
    descriptionKey: 'achievements.items.curious.description',
    target: 1,
    evaluate: (context) => Number(context.events.openedAbout)
  },
  {
    id: 'novice',
    category: 'progress',
    titleKey: 'achievements.items.novice.title',
    descriptionKey: 'achievements.items.novice.description',
    target: 5,
    evaluate: (context) => getVisitedLikeIsos(context).length
  },
  {
    id: 'good_pace',
    category: 'progress',
    titleKey: 'achievements.items.good_pace.title',
    descriptionKey: 'achievements.items.good_pace.description',
    target: 10,
    evaluate: (context) => getVisitedLikeIsos(context).length
  },
  {
    id: 'unstoppable',
    category: 'progress',
    titleKey: 'achievements.items.unstoppable.title',
    descriptionKey: 'achievements.items.unstoppable.description',
    target: 25,
    evaluate: (context) => getVisitedLikeIsos(context).length
  },
  {
    id: 'citizen_world',
    category: 'progress',
    titleKey: 'achievements.items.citizen_world.title',
    descriptionKey: 'achievements.items.citizen_world.description',
    target: 50,
    evaluate: (context) => getVisitedLikeIsos(context).length
  },
  {
    id: 'european_start',
    category: 'exploration',
    titleKey: 'achievements.items.european_start.title',
    descriptionKey: 'achievements.items.european_start.description',
    target: 5,
    evaluate: (context) => countByIsoSet(context, EUROPE_ISOS, isVisitedLike)
  },
  {
    id: 'asia_calls',
    category: 'exploration',
    titleKey: 'achievements.items.asia_calls.title',
    descriptionKey: 'achievements.items.asia_calls.description',
    target: 5,
    evaluate: (context) => countByIsoSet(context, ASIA_ISOS, isVisitedLike)
  },
  {
    id: 'across_ocean',
    category: 'exploration',
    titleKey: 'achievements.items.across_ocean.title',
    descriptionKey: 'achievements.items.across_ocean.description',
    target: 2,
    evaluate: (context) => countVisitedContinents(context)
  },
  {
    id: 'globe_alive',
    category: 'exploration',
    titleKey: 'achievements.items.globe_alive.title',
    descriptionKey: 'achievements.items.globe_alive.description',
    target: 3,
    evaluate: (context) => countVisitedContinents(context)
  },
  {
    id: 'oceania_heart',
    category: 'exploration',
    titleKey: 'achievements.items.oceania_heart.title',
    descriptionKey: 'achievements.items.oceania_heart.description',
    target: 1,
    evaluate: (context) => countByIsoSet(context, OCEANIA_ISOS, isVisitedLike)
  },
  {
    id: 'neighbors',
    category: 'collection',
    titleKey: 'achievements.items.neighbors.title',
    descriptionKey: 'achievements.items.neighbors.description',
    target: 5,
    evaluate: (context) => getLargestNeighborCluster(context)
  },
  {
    id: 'islander',
    category: 'collection',
    titleKey: 'achievements.items.islander.title',
    descriptionKey: 'achievements.items.islander.description',
    target: 3,
    evaluate: (context) => countByIsoSet(context, ISLAND_STATE_ISOS, isVisitedLike)
  },
  {
    id: 'sea_character',
    category: 'collection',
    titleKey: 'achievements.items.sea_character.title',
    descriptionKey: 'achievements.items.sea_character.description',
    target: 5,
    evaluate: (context) => countByIsoSet(context, COASTAL_ISOS, isVisitedLike)
  },
  {
    id: 'inland_depth',
    category: 'collection',
    titleKey: 'achievements.items.inland_depth.title',
    descriptionKey: 'achievements.items.inland_depth.description',
    target: 3,
    evaluate: (context) => countByIsoSet(context, LANDLOCKED_ISOS, isVisitedLike)
  },
  {
    id: 'mediterranean_route',
    category: 'collection',
    titleKey: 'achievements.items.mediterranean_route.title',
    descriptionKey: 'achievements.items.mediterranean_route.description',
    target: 4,
    evaluate: (context) => countByIsoSet(context, MEDITERRANEAN_ISOS, isVisitedLike)
  },
  {
    id: 'northern_wind',
    category: 'collection',
    titleKey: 'achievements.items.northern_wind.title',
    descriptionKey: 'achievements.items.northern_wind.description',
    target: 3,
    evaluate: (context) => countByIsoSet(context, SCANDINAVIA_ISOS, isVisitedLike)
  },
  {
    id: 'cartographer',
    category: 'functional',
    titleKey: 'achievements.items.cartographer.title',
    descriptionKey: 'achievements.items.cartographer.description',
    target: 1,
    evaluate: (context) => Number(context.events.exportedMap)
  }
]

export function parseAchievementEvents(value: string | undefined): AchievementEvents {
  if (!value) return DEFAULT_ACHIEVEMENT_EVENTS

  try {
    const parsed = JSON.parse(value) as Partial<AchievementEvents>
    return {
      openedAbout: parsed.openedAbout === true,
      exportedMap: parsed.exportedMap === true
    }
  } catch {
    return DEFAULT_ACHIEVEMENT_EVENTS
  }
}

export function parseAchievementUnlocks(value: string | undefined): string[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) return []

    const knownIds = new Set(ACHIEVEMENTS.map((achievement) => achievement.id))
    return parsed.filter((id): id is string => typeof id === 'string' && knownIds.has(id))
  } catch {
    return []
  }
}

export function stringifyAchievementEvents(events: AchievementEvents): string {
  return JSON.stringify(events)
}

export function stringifyAchievementUnlocks(ids: string[]): string {
  return JSON.stringify([...new Set(ids)])
}

export function evaluateAchievements(context: AchievementContext): AchievementProgress[] {
  return ACHIEVEMENTS.map((achievement) => {
    const progress = Math.max(0, achievement.evaluate(context))
    return {
      id: achievement.id,
      progress,
      target: achievement.target,
      unlockedByProgress: progress >= achievement.target
    }
  })
}

export function getNextUnlockedAchievements(
  context: AchievementContext,
  unlockedIds: string[]
): string[] {
  const next = new Set(unlockedIds)
  for (const achievement of evaluateAchievements(context)) {
    if (achievement.unlockedByProgress) {
      next.add(achievement.id)
    }
  }
  return [...next]
}
