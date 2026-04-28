import firstStepImage from './achievements/first_step.png'
import wantHereImage from './achievements/want_here.png'
import curiousImage from './achievements/curious.png'
import myGeographyImage from './achievements/my_geography.png'
import goodPaceImage from './achievements/good_pace.png'
import noviceImage from './achievements/novice.png'
import unstoppableImage from './achievements/unstoppable.png'
import citizenWorldImage from './achievements/citizen_world.png'
import europeanStartImage from './achievements/european_start.png'
import asiaCallsImage from './achievements/asia_calls.png'
import acrossOceanImage from './achievements/across_ocean.png'
import globeAliveImage from './achievements/globe_alive.png'
import neighborsImage from './achievements/neighbors.png'
import oceaniaHeartImage from './achievements/oceania_heart.png'
import islanderImage from './achievements/islander.png'
import seaCharacterImage from './achievements/sea_character.png'
import inlandDepthImage from './achievements/inland_depth.png'
import mediterraneanRouteImage from './achievements/mediterranean_route.png'
import northernWindImage from './achievements/northern_wind.png'
import cartographerImage from './achievements/cartographer.png'

const ACHIEVEMENT_IMAGE_BY_ID: Partial<Record<string, string>> = {
  first_step: firstStepImage,
  want_here: wantHereImage,
  curious: curiousImage,
  my_geography: myGeographyImage,
  good_pace: goodPaceImage,
  novice: noviceImage,
  unstoppable: unstoppableImage,
  citizen_world: citizenWorldImage,
  european_start: europeanStartImage,
  asia_calls: asiaCallsImage,
  across_ocean: acrossOceanImage,
  globe_alive: globeAliveImage,
  neighbors: neighborsImage,
  oceania_heart: oceaniaHeartImage,
  islander: islanderImage,
  sea_character: seaCharacterImage,
  inland_depth: inlandDepthImage,
  mediterranean_route: mediterraneanRouteImage,
  northern_wind: northernWindImage,
  cartographer: cartographerImage
}

export function getAchievementImageSrc(achievementId: string): string | undefined {
  return ACHIEVEMENT_IMAGE_BY_ID[achievementId]
}
