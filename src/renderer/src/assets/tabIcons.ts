import mapIcon from './tabs/map.png'
import countriesIcon from './tabs/countries.png'
import statisticsIcon from './tabs/statistics.png'
import achievementsIcon from './tabs/achievements.png'
import settingsIcon from './tabs/settings.png'
import aboutIcon from './tabs/about.png'
import timelineIcon from './tabs/timeline.png'

const TAB_ICON_BY_KEY: Partial<Record<string, string>> = {
  map: mapIcon,
  countries: countriesIcon,
  stats: statisticsIcon,
  achievements: achievementsIcon,
  settings: settingsIcon,
  about: aboutIcon,
  timeline: timelineIcon
}

export function getTabIconSrc(tabKey: string): string | undefined {
  return TAB_ICON_BY_KEY[tabKey]
}
