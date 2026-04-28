export const numericToIso2: Record<string, string> = {
  "010":"AQ",
  "4":"AF","8":"AL","12":"DZ","24":"AO","32":"AR","36":"AU","40":"AT","50":"BD",
  "56":"BE","68":"BO","76":"BR","100":"BG","116":"KH","120":"CM","124":"CA",
  "140":"CF","144":"LK","152":"CL","156":"CN","170":"CO","180":"CD","188":"CR",
  "191":"HR","192":"CU","203":"CZ","204":"BJ","208":"DK","214":"DO","218":"EC",
  "818":"EG","222":"SV","231":"ET","238":"FK","246":"FI","250":"FR","260":"TF","266":"GA","276":"DE",
  "288":"GH","300":"GR","304":"GL","320":"GT","324":"GN","328":"GY","332":"HT","340":"HN","348":"HU",
  "356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE","376":"IL","380":"IT",
  "388":"JM","392":"JP","400":"JO","398":"KZ","404":"KE","410":"KR","408":"KP",
  "414":"KW","418":"LA","422":"LB","430":"LR","434":"LY","484":"MX","496":"MN",
  "504":"MA","508":"MZ","516":"NA","524":"NP","528":"NL","554":"NZ","558":"NI",
  "562":"NE","566":"NG","578":"NO","586":"PK","591":"PA","598":"PG","600":"PY",
  "604":"PE","608":"PH","616":"PL","620":"PT","634":"QA","642":"RO","643":"RU",
  "646":"RW","682":"SA","686":"SN","694":"SL","706":"SO","710":"ZA","724":"ES",
  "729":"SD","752":"SE","756":"CH","760":"SY","762":"TJ","764":"TH","768":"TG",
  "780":"TT","788":"TN","792":"TR","800":"UG","804":"UA","784":"AE","826":"GB",
  "840":"US","858":"UY","860":"UZ","862":"VE","704":"VN","887":"YE","894":"ZM",
  "716":"ZW","232":"ER","426":"LS","454":"MW","466":"ML","478":"MR","740":"SR",
  "854":"BF","064":"BT","090":"SB","096":"BN","104":"MM","108":"BI","148":"TD",
  "158":"TW","178":"CG","196":"CY","226":"GQ","242":"FJ","262":"DJ","270":"GM",
  "352":"IS","384":"CI","417":"KG","428":"LV","440":"LT","442":"LU","450":"MG",
  "458":"MY","462":"MV","470":"MT","480":"MU","498":"MD","499":"ME","512":"OM",
  "540":"NC","548":"VU","624":"GW","626":"TL","630":"PR","659":"KN","662":"LC",
  "670":"VC","688":"RS","702":"SG","703":"SK","705":"SI","728":"SS","732":"EH",
  "748":"SZ","795":"TM","807":"MK","834":"TZ","044":"BS","051":"AM","052":"BB",
  "070":"BA","072":"BW","084":"BZ","275":"PS","308":"GD","031":"AZ","112":"BY",
  "233":"EE","268":"GE","068":"BO"
}

export const a3ToIso2: Record<string, string> = {
  ABW: 'AW', AIA: 'AI', ALA: 'AX', AND: 'AD', ASM: 'AS', ATG: 'AG',
  BHR: 'BH', BLM: 'BL', BMU: 'BM', COM: 'KM', COK: 'CK', CPV: 'CV',
  CUW: 'CW', CYM: 'KY', DMA: 'DM', FSM: 'FM', FRO: 'FO', GGY: 'GG',
  GUM: 'GU', HKG: 'HK', HMD: 'HM', IMN: 'IM', IOT: 'IO', JEY: 'JE',
  KIR: 'KI', LIE: 'LI', MAC: 'MO', MAF: 'MF', MCO: 'MC', MHL: 'MH',
  MNP: 'MP', MSR: 'MS', NFK: 'NF', NIU: 'NU', NRU: 'NR', PCN: 'PN',
  PLW: 'PW', PYF: 'PF', SGS: 'GS', SHN: 'SH', SMR: 'SM', SPM: 'PM',
  STP: 'ST', SXM: 'SX', SYC: 'SC', TCA: 'TC', TON: 'TO', TUV: 'TV',
  VAT: 'VA', VGB: 'VG', VIR: 'VI', WLF: 'WF', WSM: 'WS', XKX: 'XK'
}

export const iso2ToName: Record<string, string> = {
  AF:"Afghanistan",AL:"Albania",DZ:"Algeria",AO:"Angola",AR:"Argentina",
  AU:"Australia",AT:"Austria",BD:"Bangladesh",BE:"Belgium",BO:"Bolivia",
  BR:"Brazil",BG:"Bulgaria",KH:"Cambodia",CM:"Cameroon",CA:"Canada",
  CF:"Central African Republic",LK:"Sri Lanka",CL:"Chile",CN:"China",
  CO:"Colombia",CD:"DR Congo",CG:"Congo",CR:"Costa Rica",HR:"Croatia",
  CU:"Cuba",CZ:"Czech Republic",DK:"Denmark",DO:"Dominican Republic",
  EC:"Ecuador",EG:"Egypt",SV:"El Salvador",ET:"Ethiopia",FI:"Finland",
  FR:"France",GA:"Gabon",DE:"Germany",GH:"Ghana",GR:"Greece",GT:"Guatemala",
  GN:"Guinea",HT:"Haiti",HN:"Honduras",HU:"Hungary",IN:"India",ID:"Indonesia",
  IR:"Iran",IQ:"Iraq",IE:"Ireland",IL:"Israel",IT:"Italy",JM:"Jamaica",
  JP:"Japan",JO:"Jordan",KZ:"Kazakhstan",KE:"Kenya",KR:"South Korea",
  KP:"North Korea",KW:"Kuwait",LA:"Laos",LB:"Lebanon",LR:"Liberia",
  LY:"Libya",MX:"Mexico",MN:"Mongolia",MA:"Morocco",MZ:"Mozambique",
  NA:"Namibia",NP:"Nepal",NL:"Netherlands",NZ:"New Zealand",NI:"Nicaragua",
  NE:"Niger",NG:"Nigeria",NO:"Norway",PK:"Pakistan",PA:"Panama",
  PG:"Papua New Guinea",PY:"Paraguay",PE:"Peru",PH:"Philippines",PL:"Poland",
  PT:"Portugal",QA:"Qatar",RO:"Romania",RU:"Russia",RW:"Rwanda",
  SA:"Saudi Arabia",SN:"Senegal",SL:"Sierra Leone",SO:"Somalia",
  ZA:"South Africa",ES:"Spain",SD:"Sudan",SE:"Sweden",CH:"Switzerland",
  SY:"Syria",TJ:"Tajikistan",TH:"Thailand",TG:"Togo",TT:"Trinidad and Tobago",
  TN:"Tunisia",TR:"Turkey",UG:"Uganda",UA:"Ukraine",AE:"UAE",
  GB:"United Kingdom",US:"United States",UY:"Uruguay",UZ:"Uzbekistan",
  VE:"Venezuela",VN:"Vietnam",YE:"Yemen",ZM:"Zambia",ZW:"Zimbabwe",
  ER:"Eritrea",LS:"Lesotho",MW:"Malawi",ML:"Mali",MR:"Mauritania",
  BA:"Bosnia and Herzegovina",MK:"North Macedonia",SI:"Slovenia",RS:"Serbia",
  ME:"Montenegro",AM:"Armenia",AZ:"Azerbaijan",BY:"Belarus",GE:"Georgia",
  KG:"Kyrgyzstan",MD:"Moldova",TM:"Turkmenistan",MT:"Malta",CY:"Cyprus",
  IS:"Iceland",SK:"Slovakia",LT:"Lithuania",LV:"Latvia",EE:"Estonia",
  LU:"Luxembourg",PS:"Palestine",BJ:"Benin",BF:"Burkina Faso",BI:"Burundi",
  DJ:"Djibouti",GM:"Gambia",CI:"Ivory Coast",MG:"Madagascar",MU:"Mauritius",
  SS:"South Sudan",TZ:"Tanzania",MY:"Malaysia",SG:"Singapore",BN:"Brunei",
  TL:"Timor-Leste",BT:"Bhutan",MV:"Maldives",FJ:"Fiji",SB:"Solomon Islands",
  VU:"Vanuatu",SR:"Suriname",GY:"Guyana",BS:"Bahamas",BB:"Barbados",
  BZ:"Belize",GD:"Grenada",KN:"Saint Kitts and Nevis",LC:"Saint Lucia",
  VC:"Saint Vincent",KM:"Comoros",CV:"Cape Verde",GQ:"Equatorial Guinea",
  GW:"Guinea-Bissau",ST:"São Tomé and Príncipe",SC:"Seychelles",BW:"Botswana",
  AQ:"Antarctica",EH:"Western Sahara",FK:"Falkland Islands",GL:"Greenland",
  MM:"Myanmar",NC:"New Caledonia",OM:"Oman",PR:"Puerto Rico",
  SZ:"Eswatini",TD:"Chad",TF:"French Southern Lands",TW:"Taiwan",
  XK:"Kosovo"
}

const displayNamesCache = new Map<string, Intl.DisplayNames>()

function normalizeLanguage(language: string): string {
  return language.toLowerCase().split('-')[0]
}

export function numericIdToIso2(id: string | number): string | undefined {
  const normalizedId = String(id)
  if (/^[A-Z]{2}$/.test(normalizedId)) {
    return normalizedId
  }
  return numericToIso2[normalizedId] || numericToIso2[String(Number(normalizedId))]
}

export function featureToIso2(feature: { id?: string | number; properties?: { a3?: string } }): string | undefined {
  if (feature.id !== undefined) {
    const isoFromId = numericIdToIso2(feature.id)
    if (isoFromId) return isoFromId
  }

  const a3 = feature.properties?.a3
  if (a3) return a3ToIso2[a3]

  return undefined
}

export function getCountryName(iso: string, language: string): string {
  const normalizedLanguage = normalizeLanguage(language || 'en')
  const cacheKey = normalizedLanguage

  let displayNames = displayNamesCache.get(cacheKey)
  if (!displayNames) {
    displayNames = new Intl.DisplayNames([normalizedLanguage], { type: 'region' })
    displayNamesCache.set(cacheKey, displayNames)
  }

  return displayNames.of(iso) || iso2ToName[iso] || iso
}
