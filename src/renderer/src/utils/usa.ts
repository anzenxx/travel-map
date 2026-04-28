import { Country, CountryStatus, Stats, UsaMode } from '../types'

export const TOTAL_COUNTRIES = 195
export const TOTAL_US_STATES = 51

export const US_STATE_FIPS_TO_CODE: Record<string, string> = {
  '01': 'US-AL',
  '02': 'US-AK',
  '04': 'US-AZ',
  '05': 'US-AR',
  '06': 'US-CA',
  '08': 'US-CO',
  '09': 'US-CT',
  '10': 'US-DE',
  '11': 'US-DC',
  '12': 'US-FL',
  '13': 'US-GA',
  '15': 'US-HI',
  '16': 'US-ID',
  '17': 'US-IL',
  '18': 'US-IN',
  '19': 'US-IA',
  '20': 'US-KS',
  '21': 'US-KY',
  '22': 'US-LA',
  '23': 'US-ME',
  '24': 'US-MD',
  '25': 'US-MA',
  '26': 'US-MI',
  '27': 'US-MN',
  '28': 'US-MS',
  '29': 'US-MO',
  '30': 'US-MT',
  '31': 'US-NE',
  '32': 'US-NV',
  '33': 'US-NH',
  '34': 'US-NJ',
  '35': 'US-NM',
  '36': 'US-NY',
  '37': 'US-NC',
  '38': 'US-ND',
  '39': 'US-OH',
  '40': 'US-OK',
  '41': 'US-OR',
  '42': 'US-PA',
  '44': 'US-RI',
  '45': 'US-SC',
  '46': 'US-SD',
  '47': 'US-TN',
  '48': 'US-TX',
  '49': 'US-UT',
  '50': 'US-VT',
  '51': 'US-VA',
  '53': 'US-WA',
  '54': 'US-WV',
  '55': 'US-WI',
  '56': 'US-WY'
}

export const US_STATE_NAMES: Record<string, string> = {
  'US-AL': 'Alabama',
  'US-AK': 'Alaska',
  'US-AZ': 'Arizona',
  'US-AR': 'Arkansas',
  'US-CA': 'California',
  'US-CO': 'Colorado',
  'US-CT': 'Connecticut',
  'US-DE': 'Delaware',
  'US-DC': 'District of Columbia',
  'US-FL': 'Florida',
  'US-GA': 'Georgia',
  'US-HI': 'Hawaii',
  'US-ID': 'Idaho',
  'US-IL': 'Illinois',
  'US-IN': 'Indiana',
  'US-IA': 'Iowa',
  'US-KS': 'Kansas',
  'US-KY': 'Kentucky',
  'US-LA': 'Louisiana',
  'US-ME': 'Maine',
  'US-MD': 'Maryland',
  'US-MA': 'Massachusetts',
  'US-MI': 'Michigan',
  'US-MN': 'Minnesota',
  'US-MS': 'Mississippi',
  'US-MO': 'Missouri',
  'US-MT': 'Montana',
  'US-NE': 'Nebraska',
  'US-NV': 'Nevada',
  'US-NH': 'New Hampshire',
  'US-NJ': 'New Jersey',
  'US-NM': 'New Mexico',
  'US-NY': 'New York',
  'US-NC': 'North Carolina',
  'US-ND': 'North Dakota',
  'US-OH': 'Ohio',
  'US-OK': 'Oklahoma',
  'US-OR': 'Oregon',
  'US-PA': 'Pennsylvania',
  'US-RI': 'Rhode Island',
  'US-SC': 'South Carolina',
  'US-SD': 'South Dakota',
  'US-TN': 'Tennessee',
  'US-TX': 'Texas',
  'US-UT': 'Utah',
  'US-VT': 'Vermont',
  'US-VA': 'Virginia',
  'US-WA': 'Washington',
  'US-WV': 'West Virginia',
  'US-WI': 'Wisconsin',
  'US-WY': 'Wyoming'
}

const US_STATE_NAMES_RU: Record<string, string> = {
  'US-AL': 'Алабама',
  'US-AK': 'Аляска',
  'US-AZ': 'Аризона',
  'US-AR': 'Арканзас',
  'US-CA': 'Калифорния',
  'US-CO': 'Колорадо',
  'US-CT': 'Коннектикут',
  'US-DE': 'Делавэр',
  'US-DC': 'Округ Колумбия',
  'US-FL': 'Флорида',
  'US-GA': 'Джорджия',
  'US-HI': 'Гавайи',
  'US-ID': 'Айдахо',
  'US-IL': 'Иллинойс',
  'US-IN': 'Индиана',
  'US-IA': 'Айова',
  'US-KS': 'Канзас',
  'US-KY': 'Кентукки',
  'US-LA': 'Луизиана',
  'US-ME': 'Мэн',
  'US-MD': 'Мэриленд',
  'US-MA': 'Массачусетс',
  'US-MI': 'Мичиган',
  'US-MN': 'Миннесота',
  'US-MS': 'Миссисипи',
  'US-MO': 'Миссури',
  'US-MT': 'Монтана',
  'US-NE': 'Небраска',
  'US-NV': 'Невада',
  'US-NH': 'Нью-Гэмпшир',
  'US-NJ': 'Нью-Джерси',
  'US-NM': 'Нью-Мексико',
  'US-NY': 'Нью-Йорк',
  'US-NC': 'Северная Каролина',
  'US-ND': 'Северная Дакота',
  'US-OH': 'Огайо',
  'US-OK': 'Оклахома',
  'US-OR': 'Орегон',
  'US-PA': 'Пенсильвания',
  'US-RI': 'Род-Айленд',
  'US-SC': 'Южная Каролина',
  'US-SD': 'Южная Дакота',
  'US-TN': 'Теннесси',
  'US-TX': 'Техас',
  'US-UT': 'Юта',
  'US-VT': 'Вермонт',
  'US-VA': 'Виргиния',
  'US-WA': 'Вашингтон',
  'US-WV': 'Западная Виргиния',
  'US-WI': 'Висконсин',
  'US-WY': 'Вайоминг'
}

const US_STATE_NAMES_UK: Record<string, string> = {
  'US-AL': 'Алабама',
  'US-AK': 'Аляска',
  'US-AZ': 'Аризона',
  'US-AR': 'Арканзас',
  'US-CA': 'Каліфорнія',
  'US-CO': 'Колорадо',
  'US-CT': 'Коннектикут',
  'US-DE': 'Делавер',
  'US-DC': 'Округ Колумбія',
  'US-FL': 'Флорида',
  'US-GA': 'Джорджія',
  'US-HI': 'Гаваї',
  'US-ID': 'Айдахо',
  'US-IL': 'Іллінойс',
  'US-IN': 'Індіана',
  'US-IA': 'Айова',
  'US-KS': 'Канзас',
  'US-KY': 'Кентуккі',
  'US-LA': 'Луїзіана',
  'US-ME': 'Мен',
  'US-MD': 'Меріленд',
  'US-MA': 'Массачусетс',
  'US-MI': 'Мічиган',
  'US-MN': 'Міннесота',
  'US-MS': 'Міссісіпі',
  'US-MO': 'Міссурі',
  'US-MT': 'Монтана',
  'US-NE': 'Небраска',
  'US-NV': 'Невада',
  'US-NH': 'Нью-Гемпшир',
  'US-NJ': 'Нью-Джерсі',
  'US-NM': 'Нью-Мексико',
  'US-NY': 'Нью-Йорк',
  'US-NC': 'Північна Кароліна',
  'US-ND': 'Північна Дакота',
  'US-OH': 'Огайо',
  'US-OK': 'Оклахома',
  'US-OR': 'Орегон',
  'US-PA': 'Пенсильванія',
  'US-RI': 'Род-Айленд',
  'US-SC': 'Південна Кароліна',
  'US-SD': 'Південна Дакота',
  'US-TN': 'Теннессі',
  'US-TX': 'Техас',
  'US-UT': 'Юта',
  'US-VT': 'Вермонт',
  'US-VA': 'Вірджинія',
  'US-WA': 'Вашингтон',
  'US-WV': 'Західна Вірджинія',
  'US-WI': 'Вісконсин',
  'US-WY': 'Вайомінг'
}

const US_STATE_NAMES_DE: Record<string, string> = {
  'US-CA': 'Kalifornien',
  'US-DC': 'District of Columbia',
  'US-NC': 'North Carolina',
  'US-ND': 'North Dakota',
  'US-NH': 'New Hampshire',
  'US-NJ': 'New Jersey',
  'US-NM': 'New Mexico',
  'US-NY': 'New York',
  'US-PA': 'Pennsylvania',
  'US-RI': 'Rhode Island',
  'US-SC': 'South Carolina',
  'US-SD': 'South Dakota',
  'US-WV': 'West Virginia'
}

const US_STATE_NAMES_ES: Record<string, string> = {
  'US-CA': 'California',
  'US-DC': 'Distrito de Columbia',
  'US-FL': 'Florida',
  'US-GA': 'Georgia',
  'US-NC': 'Carolina del Norte',
  'US-ND': 'Dakota del Norte',
  'US-NH': 'Nuevo Hampshire',
  'US-NJ': 'Nueva Jersey',
  'US-NM': 'Nuevo México',
  'US-NY': 'Nueva York',
  'US-PA': 'Pensilvania',
  'US-RI': 'Rhode Island',
  'US-SC': 'Carolina del Sur',
  'US-SD': 'Dakota del Sur',
  'US-TX': 'Texas',
  'US-WV': 'Virginia Occidental'
}

const US_STATE_NAMES_PT: Record<string, string> = {
  'US-CA': 'Califórnia',
  'US-DC': 'Distrito de Columbia',
  'US-FL': 'Flórida',
  'US-GA': 'Geórgia',
  'US-HI': 'Havaí',
  'US-NC': 'Carolina do Norte',
  'US-ND': 'Dakota do Norte',
  'US-NH': 'Nova Hampshire',
  'US-NJ': 'Nova Jérsia',
  'US-NM': 'Novo México',
  'US-NY': 'Nova Iorque',
  'US-PA': 'Pensilvânia',
  'US-RI': 'Rhode Island',
  'US-SC': 'Carolina do Sul',
  'US-SD': 'Dakota do Sul',
  'US-TX': 'Texas',
  'US-WV': 'Virgínia Ocidental'
}

const US_STATE_NAMES_CS: Record<string, string> = {
  'US-CA': 'Kalifornie',
  'US-DC': 'Distrikt Kolumbie',
  'US-FL': 'Florida',
  'US-GA': 'Georgie',
  'US-HI': 'Havaj',
  'US-NC': 'Severní Karolína',
  'US-ND': 'Severní Dakota',
  'US-NH': 'New Hampshire',
  'US-NJ': 'New Jersey',
  'US-NM': 'Nové Mexiko',
  'US-NY': 'New York',
  'US-PA': 'Pensylvánie',
  'US-RI': 'Rhode Island',
  'US-SC': 'Jižní Karolína',
  'US-SD': 'Jižní Dakota',
  'US-TX': 'Texas',
  'US-WV': 'Západní Virginie'
}

const US_STATE_NAMES_PL: Record<string, string> = {
  'US-CA': 'Kalifornia',
  'US-DC': 'Dystrykt Kolumbii',
  'US-FL': 'Floryda',
  'US-GA': 'Georgia',
  'US-HI': 'Hawaje',
  'US-NC': 'Karolina Północna',
  'US-ND': 'Dakota Północna',
  'US-NH': 'New Hampshire',
  'US-NJ': 'New Jersey',
  'US-NM': 'Nowy Meksyk',
  'US-NY': 'Nowy Jork',
  'US-PA': 'Pensylwania',
  'US-RI': 'Rhode Island',
  'US-SC': 'Karolina Południowa',
  'US-SD': 'Dakota Południowa',
  'US-TX': 'Teksas',
  'US-WV': 'Wirginia Zachodnia'
}

const US_STATE_NAMES_BY_LANGUAGE: Record<string, Record<string, string>> = {
  ru: US_STATE_NAMES_RU,
  uk: US_STATE_NAMES_UK,
  de: US_STATE_NAMES_DE,
  es: US_STATE_NAMES_ES,
  pt: US_STATE_NAMES_PT,
  cs: US_STATE_NAMES_CS,
  pl: US_STATE_NAMES_PL
}

const STATUS_PRIORITY: CountryStatus[] = ['homeland', 'resident', 'visited', 'wishlist']

export function getUsStateCodeFromFips(fips: string | number | null | undefined): string | null {
  if (fips === null || fips === undefined) return null
  const normalized = String(fips).padStart(2, '0')
  return US_STATE_FIPS_TO_CODE[normalized] ?? null
}

export function getUsStateName(code: string, language = 'en'): string {
  const normalizedLanguage = language.split('-')[0]
  return US_STATE_NAMES_BY_LANGUAGE[normalizedLanguage]?.[code] ?? US_STATE_NAMES[code] ?? code
}

export function parseUsStatesSetting(value: string | undefined): Record<string, CountryStatus> {
  if (!value) return {}

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, CountryStatus] =>
          typeof entry[1] === 'string' && STATUS_PRIORITY.includes(entry[1] as CountryStatus)
      )
    )
  } catch {
    return {}
  }
}

export function getAggregateUsStatus(
  usStates: Record<string, CountryStatus>,
  fallbackStatus?: CountryStatus
): CountryStatus | undefined {
  const markedStatuses = Object.values(usStates)
  if (markedStatuses.length === 0) return fallbackStatus

  for (const status of STATUS_PRIORITY) {
    if (markedStatuses.includes(status)) return status
  }

  return fallbackStatus
}

export function countMarkedUsStates(usStates: Record<string, CountryStatus>): number {
  return Object.keys(usStates).length
}

export function getEffectiveCountryStatus(
  iso: string,
  countries: Record<string, Country>,
  usaMode: UsaMode,
  usStates: Record<string, CountryStatus>
): CountryStatus | undefined {
  if (iso === 'US' && usaMode === 'states') {
    return getAggregateUsStatus(usStates, countries.US?.status)
  }

  return countries[iso]?.status
}

export function getDisplayCountries(
  countries: Record<string, Country>,
  usaMode: UsaMode,
  usStates: Record<string, CountryStatus>
): Country[] {
  const list = Object.values(countries).filter(
    (country) => !(usaMode === 'states' && country.iso_code === 'US')
  )

  if (usaMode !== 'states') return list

  const usStatus = getAggregateUsStatus(usStates, countries.US?.status)
  if (!usStatus) return list

  return [
    ...list,
    countries.US ?? {
      id: -1,
      iso_code: 'US',
      status: usStatus,
      created_at: ''
    }
  ].map((country) => (country.iso_code === 'US' ? { ...country, status: usStatus } : country))
}

export function computeDisplayStats(
  countries: Record<string, Country>,
  baseStats: Stats | null,
  usaMode: UsaMode,
  usStates: Record<string, CountryStatus>
): Stats {
  const counts: Record<CountryStatus, number> = {
    homeland: 0,
    resident: 0,
    visited: 0,
    wishlist: 0
  }

  for (const country of Object.values(countries)) {
    if (usaMode === 'states' && country.iso_code === 'US') continue
    counts[country.status] += 1
  }

  if (usaMode === 'states') {
    const usStatus = getAggregateUsStatus(usStates, countries.US?.status)
    if (usStatus) {
      counts[usStatus] += 1
    }
  }

  const totalCountries = counts.homeland + counts.resident + counts.visited

  return {
    totalCountries,
    totalCities: baseStats?.totalCities ?? 0,
    totalDays: baseStats?.totalDays ?? 0,
    byStatus: STATUS_PRIORITY.map((status) => ({ status, count: counts[status] }))
  }
}
