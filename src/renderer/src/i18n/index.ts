import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      status: {
        homeland: 'Homeland',
        resident: 'Resident',
        visited: 'Visited',
        wishlist: 'Wishlist'
      },
      stats: {
        countries: '{{count}} country',
        countries_other: '{{count}} countries',
        cities: '{{count}} city',
        cities_other: '{{count}} cities',
        world: '{{percent}}% of world',
        countriesLabel: 'countries',
        citiesLabel: 'cities',
        statesLabel: 'states',
        statesProgress: 'Progress',
        worldLabel: 'of world',
        usStatesLabel: 'US states marked',
        byStatus: 'By status',
        byContinent: 'By continent',
        days: '{{count}} day',
        days_other: '{{count}} days'
      },
      continents: {
        europe: 'Europe',
        asia: 'Asia',
        africa: 'Africa',
        northAmerica: 'North America',
        southAmerica: 'South America',
        oceania: 'Oceania'
      },
      window: {
        minimize: 'Minimize',
        maximize: 'Maximize',
        restore: 'Restore',
        close: 'Close'
      },
      tabs: {
        map: 'Map',
        countries: 'Countries',
        stats: 'Statistics',
        timeline: 'Timeline',
        achievements: 'Achievements',
        settings: 'Settings',
        about: 'About'
      },
      achievements: {
        title: 'Achievements',
        subtitle: 'Travel milestones and memorable map goals',
        lockedHint:
          'Locked cards stay visible but look quieter: muted image slot, softer frame and a clear lock badge.',
        locked: 'Locked',
        imageSlot: 'Image Slot',
        toastTitle: 'Achievement unlocked',
        categories: {
          onboarding: 'Onboarding',
          progress: 'Progress',
          exploration: 'Exploration',
          collection: 'Collection',
          functional: 'Functional'
        },
        items: {
          first_step: {
            title: 'First Step',
            description: 'Mark your first country as visited.'
          },
          want_here: {
            title: 'Want To Go',
            description: 'Add your first country to the wishlist.'
          },
          my_geography: {
            title: 'My Geography',
            description: 'Have visited, wishlist, and homeland on the map at the same time.'
          },
          curious: {
            title: 'Curious',
            description: 'Open the About tab.'
          },
          novice: {
            title: 'Novice',
            description: 'Mark 5 visited countries.'
          },
          good_pace: {
            title: 'Good Pace',
            description: 'Mark 10 visited countries.'
          },
          unstoppable: {
            title: 'Unstoppable',
            description: 'Mark 25 visited countries.'
          },
          citizen_world: {
            title: 'Citizen of the World',
            description: 'Mark 50 visited countries.'
          },
          european_start: {
            title: 'European Start',
            description: 'Visit 5 countries in Europe.'
          },
          asia_calls: {
            title: 'Asia Calls',
            description: 'Visit 5 countries in Asia.'
          },
          across_ocean: {
            title: 'Across The Ocean',
            description: 'Visit countries on 2 continents.'
          },
          globe_alive: {
            title: 'The Globe Comes Alive',
            description: 'Visit countries on 3 continents.'
          },
          oceania_heart: {
            title: 'Oceania In The Heart',
            description: 'Mark your first country in Oceania.'
          },
          neighbors: {
            title: 'Neighbors',
            description: 'Collect a connected group of 5 neighboring countries.'
          },
          islander: {
            title: 'Islander',
            description: 'Visit 3 island states.'
          },
          sea_character: {
            title: 'Sea Character',
            description: 'Visit 5 coastal countries.'
          },
          inland_depth: {
            title: 'Deep Inland',
            description: 'Visit 3 landlocked countries.'
          },
          mediterranean_route: {
            title: 'Mediterranean Route',
            description: 'Visit 4 Mediterranean countries.'
          },
          northern_wind: {
            title: 'Northern Wind',
            description: 'Visit 3 Scandinavian countries.'
          },
          cartographer: {
            title: 'Cartographer',
            description: 'Export the map for the first time.'
          }
        }
      },
      about: {
        title: 'About Atlas Travel',
        intro:
          'Atlas Travel helps you keep a clear, visual record of where you have been and what memories you want to keep from each place.',
        featuresTitle: 'What You Can Do',
        featureMap:
          'Mark countries on the world map and see your travel story take shape at a glance.',
        featureStatuses:
          'Use different statuses for places that are home, places you have lived, places you have visited, and places still on your wishlist.',
        featureCities:
          'Save cities inside each country to remember specific stops, routes, and favorite locations.',
        featureMemories:
          'Add visit dates, notes, and photos so your map becomes a personal travel archive.',
        mechanicsTitle: 'How It Works',
        mechanicStatuses:
          'Each country or state can have one status, and your statistics update automatically as you mark new places.',
        mechanicStats:
          'The app keeps track of visited countries, saved cities, and total travel days in a simple overview.',
        mechanicExport:
          'You can export the map as a PNG to share your progress or keep a snapshot of your journeys.',
        usaTitle: 'USA Modes',
        usaModeCountry:
          'You can treat the USA as one country if you prefer a classic world-map style.',
        usaModeStates: 'Or switch to state mode to mark individual US states separately.',
        usaModeCounting:
          'In state mode, the USA still counts as one visited country as soon as at least one state is marked.'
      },
      map: {
        clickCountry: 'Click a country to mark it',
        setStatus: 'Set status',
        addNote: 'Add note',
        addCity: 'Add city',
        citiesTab: 'Cities',
        remove: 'Remove mark',
        currentStatus: 'Status',
        citySearchPlaceholder: 'Search cities in {{country}}',
        citySearchHint: 'Start typing a city name and choose it from the list.',
        searchResults: 'Search results',
        cityLoading: 'Searching cities...',
        cityNoResults: 'No cities found for this query.',
        citySearchStart: 'Type at least 2 characters to search for a city.',
        citySearchError: 'Could not load cities right now.',
        cityAddError: 'Could not add this city.',
        cityAdded: 'Added',
        savedCities: 'Saved cities',
        noCitiesYet: 'No cities added yet.',
        cityNoSavedMatches: 'No saved cities match this query.',
        usState: 'US state',
        visitsTab: 'Visits',
        addVisit: 'Visit',
        invalidVisitDates: 'End date cannot be earlier than start date.',
        deleteVisitTitle: 'Delete visit?',
        deleteVisitConfirm: 'Delete this visit?',
        deleteCityTitle: 'Delete city?',
        deleteCityConfirm: 'Delete this city?',
        deletePhotoTitle: 'Delete photo?',
        deletePhotoConfirm: 'Delete this photo?',
        searchCountriesCities: 'Search countries and cities',
        searchMap: 'Find a country or city',
        centerMap: 'Center map',
        removeCountryConfirmTitle: 'Remove country mark?',
        removeCountryWithCitiesConfirm:
          'Remove the mark from {{country}}? This will also delete {{count}} saved city.',
        removeCountryWithCitiesConfirm_other:
          'Remove the mark from {{country}}? This will also delete {{count}} saved cities.'
      },
      timeline: {
        loading: 'Loading trips...',
        empty: 'No visits yet.',
        noDate: 'No date'
      },
      tags: {
        food: 'Food',
        nature: 'Nature',
        architecture: 'Architecture',
        history: 'History',
        nightlife: 'Nightlife',
        beach: 'Beach',
        mountains: 'Mountains',
        culture: 'Culture',
        createPlaceholder: 'New tag',
        createError: 'Could not create tag'
      },
      settings: {
        title: 'Settings',
        language: 'Language',
        theme: 'Theme',
        usaMode: 'USA mode',
        usaModeCountry: 'Whole country',
        usaModeStates: 'By states',
        usaModeHint:
          'In state mode, the USA is marked state by state. It still counts as one visited country as soon as at least one state is marked.',
        themeAtlas: 'Atlas',
        themeLight: 'Light',
        sound: 'Sound',
        achievementSound: 'Achievement sound',
        exportPng: 'Export PNG',
        exportSuccess: 'PNG exported',
        exportError: 'Could not export PNG',
        backupRestore: 'Backup / Restore',
        exportBackup: 'Export JSON backup',
        importBackup: 'Restore from JSON',
        backupExported: 'Backup exported',
        backupExportError: 'Could not export backup',
        backupImported: 'Backup restored',
        backupImportError: 'Could not restore backup',
        restoreTitle: 'Restore backup?',
        restoreConfirm: 'Restore backup and replace current travel data?',
        export: 'Export',
        themeDark: 'Dark',
        resetMap: 'Reset map',
        resetMapAction: 'Clear all travel data',
        resetMapConfirm:
          'Clear all marked countries, cities, visits and saved photos from this map?'
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        add: 'Add',
        yes: 'Yes',
        no: 'No',
        all: 'All',
        notes: 'Notes',
        photos: 'Photos',
        tags: 'Tags',
        from: 'From',
        to: 'To',
        showMore: 'Show full text',
        showLess: 'Collapse',
        noVisits: 'No visits yet'
      }
    }
  },
  ru: {
    translation: {
      status: {
        homeland: 'Родина',
        resident: 'Резидент',
        visited: 'Посетил',
        wishlist: 'Хочу посетить'
      },
      stats: {
        countries_one: '{{count}} страна',
        countries_few: '{{count}} страны',
        countries_many: '{{count}} стран',
        countries_other: '{{count}} стран',
        cities_one: '{{count}} город',
        cities_few: '{{count}} города',
        cities_many: '{{count}} городов',
        cities_other: '{{count}} городов',
        world: '{{percent}}% мира',
        countriesLabel: 'стран',
        citiesLabel: 'городов',
        statesLabel: 'штатов',
        statesProgress: 'Прогресс',
        worldLabel: 'мира',
        usStatesLabel: 'отмечено штатов США',
        byStatus: 'По статусам',
        byContinent: 'По континентам',
        days_one: '{{count}} день',
        days_few: '{{count}} дня',
        days_many: '{{count}} дней',
        days_other: '{{count}} дней'
      },
      continents: {
        europe: 'Европа',
        asia: 'Азия',
        africa: 'Африка',
        northAmerica: 'Северная Америка',
        southAmerica: 'Южная Америка',
        oceania: 'Океания'
      },
      window: {
        minimize: 'Свернуть',
        maximize: 'Развернуть',
        restore: 'Восстановить',
        close: 'Закрыть'
      },
      tabs: {
        map: 'Карта',
        countries: 'Страны',
        stats: 'Статистика',
        timeline: 'Лента',
        achievements: 'Достижения',
        settings: 'Настройки',
        about: 'О программе'
      },
      achievements: {
        title: 'Достижения',
        subtitle: 'Путевые достижения и красивые цели для карты',
        lockedHint:
          'Неполученные карточки остаются видимыми, но выглядят спокойнее: приглушённый слот под картинку, более мягкая рамка и заметный замок.',
        locked: 'Закрыто',
        imageSlot: 'Место под картинку',
        toastTitle: 'Получено достижение',
        categories: {
          onboarding: 'Старт',
          progress: 'Прогресс',
          exploration: 'Исследование',
          collection: 'Коллекции',
          functional: 'Функции'
        },
        items: {
          first_step: {
            title: 'Первый шаг',
            description: 'Отметить первую страну как посещённую.'
          },
          want_here: {
            title: 'Хочу сюда',
            description: 'Добавить первую страну в wishlist.'
          },
          my_geography: {
            title: 'Моя география',
            description:
              'Сделать так, чтобы на карте одновременно были visited, wishlist и homeland.'
          },
          curious: {
            title: 'Любопытный',
            description: 'Открыть вкладку «О программе».'
          },
          novice: {
            title: 'Новичок',
            description: 'Отметить 5 посещённых стран.'
          },
          good_pace: {
            title: 'В хорошем темпе',
            description: 'Отметить 10 посещённых стран.'
          },
          unstoppable: {
            title: 'Не остановить',
            description: 'Отметить 25 посещённых стран.'
          },
          citizen_world: {
            title: 'Гражданин мира',
            description: 'Отметить 50 посещённых стран.'
          },
          european_start: {
            title: 'Европейский старт',
            description: 'Посетить 5 стран Европы.'
          },
          asia_calls: {
            title: 'Азия зовёт',
            description: 'Посетить 5 стран Азии.'
          },
          across_ocean: {
            title: 'Через океан',
            description: 'Посетить страны на 2 континентах.'
          },
          globe_alive: {
            title: 'Глобус оживает',
            description: 'Посетить страны на 3 континентах.'
          },
          oceania_heart: {
            title: 'Океания в сердце',
            description: 'Отметить первую страну Океании.'
          },
          neighbors: {
            title: 'Соседи',
            description: 'Собрать группу из 5 соседних стран.'
          },
          islander: {
            title: 'Островитянин',
            description: 'Посетить 3 островных государства.'
          },
          sea_character: {
            title: 'Морской характер',
            description: 'Посетить 5 стран с выходом к морю.'
          },
          inland_depth: {
            title: 'В глубине материка',
            description: 'Посетить 3 страны без выхода к морю.'
          },
          mediterranean_route: {
            title: 'Средиземноморский маршрут',
            description: 'Посетить 4 страны Средиземноморья.'
          },
          northern_wind: {
            title: 'Северный ветер',
            description: 'Посетить 3 скандинавские страны.'
          },
          cartographer: {
            title: 'Картограф',
            description: 'Впервые экспортировать карту.'
          }
        }
      },
      about: {
        title: 'О программе Atlas Travel',
        intro:
          'Atlas Travel помогает наглядно сохранять историю поездок и собирать в одном месте страны, города и воспоминания о путешествиях.',
        featuresTitle: 'Что умеет программа',
        featureMap:
          'Можно отмечать страны на карте мира и сразу видеть общий прогресс путешествий.',
        featureStatuses:
          'Для каждой страны или штата можно выбрать статус: родина, место проживания, посещённое место или список желаний.',
        featureCities:
          'Внутри стран можно сохранять города, чтобы отмечать конкретные точки и маршруты.',
        featureMemories:
          'К поездкам можно добавлять даты, заметки и фотографии, чтобы карта становилась личным архивом.',
        mechanicsTitle: 'Как это работает',
        mechanicStatuses:
          'У каждой страны или штата один активный статус, а статистика пересчитывается автоматически.',
        mechanicStats:
          'Приложение показывает количество отмеченных стран, сохранённых городов и суммарные дни поездок.',
        mechanicExport:
          'Карту можно экспортировать в PNG, чтобы сохранить красивый снимок своего прогресса.',
        usaTitle: 'Режимы США',
        usaModeCountry:
          'США можно учитывать как одну страну, если нужен классический режим мировой карты.',
        usaModeStates: 'Либо можно включить режим штатов и отмечать каждый штат отдельно.',
        usaModeCounting:
          'В режиме штатов США всё равно считаются одной посещённой страной, как только отмечен хотя бы один штат.'
      },
      map: {
        clickCountry: 'Нажмите на страну, чтобы отметить',
        setStatus: 'Установить статус',
        addNote: 'Добавить заметку',
        addCity: 'Добавить город',
        citiesTab: 'Города',
        remove: 'Убрать отметку',
        currentStatus: 'Статус',
        citySearchPlaceholder: 'Найти города в стране {{country}}',
        citySearchHint: 'Начните вводить название города и выберите его из списка.',
        searchResults: 'Результаты поиска',
        cityLoading: 'Ищу города...',
        cityNoResults: 'По этому запросу города не найдены.',
        citySearchStart: 'Введите минимум 2 символа, чтобы искать города.',
        citySearchError: 'Сейчас не удалось загрузить список городов.',
        cityAddError: 'Не удалось добавить город.',
        cityAdded: 'Добавлен',
        savedCities: 'Сохранённые города',
        noCitiesYet: 'Города пока не добавлены.',
        cityNoSavedMatches: 'Среди сохранённых городов совпадений нет.',
        usState: 'Штат США',
        visitsTab: 'Визиты',
        addVisit: 'Визит',
        invalidVisitDates: 'Дата окончания не может быть раньше даты начала.',
        deleteVisitTitle: 'Удалить визит?',
        deleteVisitConfirm: 'Удалить этот визит?',
        deleteCityTitle: 'Удалить город?',
        deleteCityConfirm: 'Удалить этот город?',
        deletePhotoTitle: 'Удалить фото?',
        deletePhotoConfirm: 'Удалить это фото?',
        searchCountriesCities: 'Поиск стран и городов',
        searchMap: 'Найти страну или город',
        centerMap: 'Центрировать карту',
        removeCountryConfirmTitle: 'Снять отметку со страны?',
        removeCountryWithCitiesConfirm_one:
          'Снять отметку со страны {{country}}? Это также удалит {{count}} отмеченный город.',
        removeCountryWithCitiesConfirm_few:
          'Снять отметку со страны {{country}}? Это также удалит {{count}} отмеченных города.',
        removeCountryWithCitiesConfirm_many:
          'Снять отметку со страны {{country}}? Это также удалит {{count}} отмеченных городов.',
        removeCountryWithCitiesConfirm_other:
          'Снять отметку со страны {{country}}? Это также удалит {{count}} отмеченных городов.'
      },
      timeline: {
        loading: 'Загружаю поездки...',
        empty: 'Визитов пока нет.',
        noDate: 'Без даты'
      },
      tags: {
        food: 'Еда',
        nature: 'Природа',
        architecture: 'Архитектура',
        history: 'История',
        nightlife: 'Ночная жизнь',
        beach: 'Пляж',
        mountains: 'Горы',
        culture: 'Культура',
        createPlaceholder: 'Новый тег',
        createError: 'Не удалось создать тег'
      },
      settings: {
        title: 'Настройки',
        language: 'Язык',
        theme: 'Тема',
        usaMode: 'Режим США',
        usaModeCountry: 'Целиком',
        usaModeStates: 'По штатам',
        usaModeHint:
          'В режиме штатов США отмечаются по штатам, но в статистике всё равно считаются одной посещённой страной, как только отмечен хотя бы один штат.',
        themeAtlas: 'Атлас',
        themeLight: 'Светлая',
        sound: 'Звук',
        achievementSound: 'Звук достижений',
        exportPng: 'Экспорт PNG',
        exportSuccess: 'PNG экспортирован',
        exportError: 'Не удалось экспортировать PNG',
        backupRestore: 'Резервная копия',
        exportBackup: 'Экспорт JSON',
        importBackup: 'Восстановить из JSON',
        backupExported: 'Резервная копия экспортирована',
        backupExportError: 'Не удалось экспортировать резервную копию',
        backupImported: 'Резервная копия восстановлена',
        backupImportError: 'Не удалось восстановить резервную копию',
        restoreTitle: 'Восстановить резервную копию?',
        restoreConfirm: 'Восстановить резервную копию и заменить текущие данные путешествий?',
        themeDark: 'Тёмная',
        resetMap: 'Сброс карты',
        resetMapAction: 'Очистить все данные карты',
        resetMapConfirm:
          'Очистить все отмеченные страны, города, поездки и сохранённые фото на этой карте?'
      },
      common: {
        save: 'Сохранить',
        cancel: 'Отмена',
        delete: 'Удалить',
        edit: 'Редактировать',
        close: 'Закрыть',
        add: 'Добавить',
        yes: 'Да',
        no: 'Нет',
        all: 'Все',
        notes: 'Заметки',
        photos: 'Фото',
        tags: 'Теги',
        from: 'С',
        to: 'По',
        showMore: 'Показать полностью',
        showLess: 'Свернуть',
        noVisits: 'Нет визитов'
      }
    }
  },
  de: {
    translation: {
      status: {
        homeland: 'Heimat',
        resident: 'Wohnort',
        visited: 'Besucht',
        wishlist: 'Wunschliste'
      },
      stats: {
        countries: '{{count}} Land',
        countries_other: '{{count}} Länder',
        cities: '{{count}} Stadt',
        cities_other: '{{count}} Städte',
        world: '{{percent}}% der Welt',
        countriesLabel: 'Länder',
        citiesLabel: 'Städte',
        statesLabel: 'Bundesstaaten',
        statesProgress: 'Fortschritt',
        worldLabel: 'der Welt',
        usStatesLabel: 'US-Bundesstaaten markiert',
        days: '{{count}} Tag',
        days_other: '{{count}} Tage'
      },
      tabs: {
        map: 'Karte',
        countries: 'Länder',
        stats: 'Statistik',
        achievements: 'Erfolge',
        settings: 'Einstellungen',
        about: 'Info'
      },
      achievements: {
        title: 'Erfolge',
        subtitle: 'Reise-Meilensteine und Ziele auf deiner Karte',
        lockedHint:
          'Gesperrte Karten bleiben sichtbar, wirken aber ruhiger: gedämpfter Bildbereich, weichere Umrandung und ein klares Schloss-Badge.',
        locked: 'Gesperrt',
        imageSlot: 'Bildplatzhalter',
        toastTitle: 'Erfolg freigeschaltet',
        categories: {
          onboarding: 'Start',
          progress: 'Fortschritt',
          exploration: 'Entdecken',
          collection: 'Sammlung',
          functional: 'Funktionen'
        },
        items: {
          first_step: {
            title: 'Erster Schritt',
            description: 'Das erste Land als besucht markieren.'
          },
          want_here: {
            title: 'Will Ich Sehen',
            description: 'Das erste Land zur Wunschliste hinzufügen.'
          },
          my_geography: {
            title: 'Meine Geografie',
            description: 'Visited, wishlist und homeland gleichzeitig auf der Karte haben.'
          },
          curious: { title: 'Neugierig', description: 'Den Info-Tab öffnen.' },
          novice: { title: 'Anfänger', description: '5 besuchte Länder markieren.' },
          good_pace: { title: 'Gutes Tempo', description: '10 besuchte Länder markieren.' },
          unstoppable: { title: 'Nicht Zu Stoppen', description: '25 besuchte Länder markieren.' },
          citizen_world: { title: 'Weltbürger', description: '50 besuchte Länder markieren.' },
          european_start: { title: 'Europa-Start', description: '5 Länder in Europa besuchen.' },
          asia_calls: { title: 'Asien Ruft', description: '5 Länder in Asien besuchen.' },
          across_ocean: {
            title: 'Über Den Ozean',
            description: 'Länder auf 2 Kontinenten besuchen.'
          },
          globe_alive: {
            title: 'Der Globus Lebt',
            description: 'Länder auf 3 Kontinenten besuchen.'
          },
          oceania_heart: {
            title: 'Ozeanien Im Herzen',
            description: 'Das erste Land in Ozeanien markieren.'
          },
          neighbors: {
            title: 'Nachbarn',
            description: 'Eine verbundene Gruppe aus 5 Nachbarländern sammeln.'
          },
          islander: { title: 'Insulaner', description: '3 Inselstaaten besuchen.' },
          sea_character: { title: 'Meer Im Herzen', description: '5 Küstenländer besuchen.' },
          inland_depth: { title: 'Tief Im Inland', description: '3 Binnenstaaten besuchen.' },
          mediterranean_route: {
            title: 'Mittelmeerroute',
            description: '4 Mittelmeerländer besuchen.'
          },
          northern_wind: { title: 'Nordwind', description: '3 skandinavische Länder besuchen.' },
          cartographer: { title: 'Kartograf', description: 'Die Karte zum ersten Mal exportieren.' }
        }
      },
      about: {
        title: 'Über Atlas Travel',
        intro:
          'Atlas Travel hilft dabei, Reisen übersichtlich festzuhalten und Länder, Städte und Erinnerungen an einem Ort zu sammeln.',
        featuresTitle: 'Was Die App Kann',
        featureMap:
          'Länder auf der Weltkarte markieren und den eigenen Reisefortschritt auf einen Blick sehen.',
        featureStatuses:
          'Für Länder oder Bundesstaaten verschiedene Status verwenden: Heimat, Wohnort, besucht oder Wunschliste.',
        featureCities:
          'Städte innerhalb eines Landes speichern, um konkrete Orte und Reiserouten festzuhalten.',
        featureMemories:
          'Besuche mit Daten, Notizen und Fotos ergänzen und so ein persönliches Reisearchiv aufbauen.',
        mechanicsTitle: 'So Funktioniert Es',
        mechanicStatuses:
          'Jedes Land oder jeder Bundesstaat hat einen aktiven Status, und die Statistik aktualisiert sich automatisch.',
        mechanicStats:
          'Die App zeigt markierte Länder, gespeicherte Städte und gesamte Reisetage in einer einfachen Übersicht.',
        mechanicExport:
          'Die Karte kann als PNG exportiert werden, um den aktuellen Stand zu teilen oder zu archivieren.',
        usaTitle: 'USA-Modi',
        usaModeCountry:
          'Die USA können als ein einziges Land behandelt werden, wenn du eine klassische Weltkartenlogik bevorzugst.',
        usaModeStates:
          'Oder du wechselst in den Bundesstaaten-Modus und markierst einzelne US-Bundesstaaten separat.',
        usaModeCounting:
          'Im Bundesstaaten-Modus zählen die USA trotzdem als ein besuchtes Land, sobald mindestens ein Bundesstaat markiert ist.'
      },
      map: {
        clickCountry: 'Land anklicken um es zu markieren',
        setStatus: 'Status setzen',
        addNote: 'Notiz hinzufügen',
        addCity: 'Stadt hinzufügen',
        citiesTab: 'Städte',
        remove: 'Markierung entfernen',
        currentStatus: 'Status',
        citySearchPlaceholder: 'Städte in {{country}} suchen',
        citySearchHint: 'Geben Sie einen Stadtnamen ein und wählen Sie ihn aus der Liste.',
        searchResults: 'Suchergebnisse',
        cityLoading: 'Städte werden gesucht...',
        cityNoResults: 'Für diese Suche wurden keine Städte gefunden.',
        citySearchStart: 'Geben Sie mindestens 2 Zeichen ein, um nach Städten zu suchen.',
        citySearchError: 'Städte konnten gerade nicht geladen werden.',
        cityAdded: 'Hinzugefügt',
        savedCities: 'Gespeicherte Städte',
        noCitiesYet: 'Noch keine Städte hinzugefügt.',
        cityNoSavedMatches: 'Keine gespeicherten Städte passen zu dieser Suche.',
        usState: 'US-Bundesstaat',
        removeCountryConfirmTitle: 'Ländermarkierung entfernen?',
        removeCountryWithCitiesConfirm:
          'Markierung für {{country}} entfernen? Dadurch werden auch {{count}} gespeicherte Stadt entfernt.',
        removeCountryWithCitiesConfirm_other:
          'Markierung für {{country}} entfernen? Dadurch werden auch {{count}} gespeicherte Städte entfernt.'
      },
      settings: {
        title: 'Einstellungen',
        language: 'Sprache',
        theme: 'Design',
        usaMode: 'USA-Modus',
        usaModeCountry: 'Als Land',
        usaModeStates: 'Nach Bundesstaaten',
        usaModeHint:
          'Im Bundesstaaten-Modus werden die USA pro Bundesstaat markiert. In der Statistik zählen sie trotzdem als ein besuchtes Land, sobald mindestens ein Bundesstaat markiert ist.',
        themeAtlas: 'Atlas',
        themeLight: 'Hell',
        exportPng: 'PNG exportieren',
        themeDark: 'Dunkel',
        resetMap: 'Karte zurücksetzen',
        resetMapAction: 'Alle Reisedaten löschen',
        resetMapConfirm:
          'Alle markierten Länder, Städte, Reisen und gespeicherten Fotos von dieser Karte löschen?'
      },
      common: {
        save: 'Speichern',
        cancel: 'Abbrechen',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        close: 'Schließen',
        add: 'Hinzufügen',
        yes: 'Ja',
        no: 'Nein',
        all: 'Alle',
        notes: 'Notizen',
        photos: 'Fotos',
        tags: 'Tags',
        from: 'Von',
        to: 'Bis',
        showMore: 'Volltext anzeigen',
        showLess: 'Einklappen',
        noVisits: 'Keine Besuche'
      }
    }
  },
  es: {
    translation: {
      status: {
        homeland: 'País de origen',
        resident: 'Residencia',
        visited: 'Visitado',
        wishlist: 'Lista de deseos'
      },
      stats: {
        countries: '{{count}} país',
        countries_other: '{{count}} países',
        cities: '{{count}} ciudad',
        cities_other: '{{count}} ciudades',
        world: '{{percent}}% del mundo',
        countriesLabel: 'países',
        citiesLabel: 'ciudades',
        statesLabel: 'estados',
        statesProgress: 'Progreso',
        worldLabel: 'del mundo',
        usStatesLabel: 'estados de EE. UU. marcados',
        days: '{{count}} día',
        days_other: '{{count}} días'
      },
      tabs: {
        map: 'Mapa',
        countries: 'Países',
        stats: 'Estadísticas',
        achievements: 'Logros',
        settings: 'Configuración',
        about: 'Acerca de'
      },
      achievements: {
        title: 'Logros',
        subtitle: 'Hitos de viaje y objetivos memorables para tu mapa',
        lockedHint:
          'Las tarjetas bloqueadas siguen visibles, pero se ven más discretas: espacio de imagen atenuado, marco más suave y un icono de candado claro.',
        locked: 'Bloqueado',
        imageSlot: 'Espacio para imagen',
        toastTitle: 'Logro desbloqueado',
        categories: {
          onboarding: 'Inicio',
          progress: 'Progreso',
          exploration: 'Exploración',
          collection: 'Colección',
          functional: 'Funciones'
        },
        items: {
          first_step: { title: 'Primer Paso', description: 'Marca tu primer país como visitado.' },
          want_here: {
            title: 'Quiero Ir',
            description: 'Añade tu primer país a la lista de deseos.'
          },
          my_geography: {
            title: 'Mi Geografía',
            description: 'Ten visitado, lista de deseos y país natal en el mapa al mismo tiempo.'
          },
          curious: { title: 'Curiosidad', description: 'Abre la pestaña Acerca de.' },
          novice: { title: 'Principiante', description: 'Marca 5 países visitados.' },
          good_pace: { title: 'Buen Ritmo', description: 'Marca 10 países visitados.' },
          unstoppable: { title: 'Imparable', description: 'Marca 25 países visitados.' },
          citizen_world: { title: 'Ciudadanía Global', description: 'Marca 50 países visitados.' },
          european_start: { title: 'Comienzo Europeo', description: 'Visita 5 países de Europa.' },
          asia_calls: { title: 'Asia Llama', description: 'Visita 5 países de Asia.' },
          across_ocean: {
            title: 'A Través Del Océano',
            description: 'Visita países en 2 continentes.'
          },
          globe_alive: {
            title: 'El Globo Cobra Vida',
            description: 'Visita países en 3 continentes.'
          },
          oceania_heart: {
            title: 'Oceanía En El Corazón',
            description: 'Marca tu primer país en Oceanía.'
          },
          neighbors: {
            title: 'Vecinos',
            description: 'Reúne un grupo conectado de 5 países vecinos.'
          },
          islander: { title: 'Vida Insular', description: 'Visita 3 estados insulares.' },
          sea_character: { title: 'Espíritu Marino', description: 'Visita 5 países costeros.' },
          inland_depth: {
            title: 'Tierra Adentro',
            description: 'Visita 3 países sin salida al mar.'
          },
          mediterranean_route: {
            title: 'Ruta Mediterránea',
            description: 'Visita 4 países mediterráneos.'
          },
          northern_wind: {
            title: 'Viento Del Norte',
            description: 'Visita 3 países escandinavos.'
          },
          cartographer: { title: 'Cartografía', description: 'Exporta el mapa por primera vez.' }
        }
      },
      about: {
        title: 'Acerca de Atlas Travel',
        intro:
          'Atlas Travel te ayuda a guardar un registro claro y visual de dónde has estado y qué recuerdos quieres conservar de cada lugar.',
        featuresTitle: 'Qué Puedes Hacer',
        featureMap:
          'Marca países en el mapa del mundo y ve cómo toma forma tu historia de viaje de un vistazo.',
        featureStatuses:
          'Usa distintos estados para lugares que son tu hogar, donde has vivido, que has visitado o que siguen en tu lista de deseos.',
        featureCities:
          'Guarda ciudades dentro de cada país para recordar paradas concretas, rutas y lugares favoritos.',
        featureMemories:
          'Añade fechas de visita, notas y fotos para que tu mapa se convierta en un archivo personal de viajes.',
        mechanicsTitle: 'Cómo Funciona',
        mechanicStatuses:
          'Cada país o estado puede tener un estado, y tus estadísticas se actualizan automáticamente al marcar nuevos lugares.',
        mechanicStats:
          'La aplicación lleva un registro de países visitados, ciudades guardadas y días totales de viaje en un resumen sencillo.',
        mechanicExport:
          'Puedes exportar el mapa como PNG para compartir tu progreso o guardar una instantánea de tus viajes.',
        usaTitle: 'Modos de EE. UU.',
        usaModeCountry:
          'Puedes tratar a EE. UU. como un solo país si prefieres un estilo clásico de mapa mundial.',
        usaModeStates:
          'O cambiar al modo por estados para marcar los estados de EE. UU. por separado.',
        usaModeCounting:
          'En el modo por estados, EE. UU. sigue contando como un país visitado en cuanto se marca al menos un estado.'
      },
      map: {
        clickCountry: 'Haz clic en un país para marcarlo',
        setStatus: 'Establecer estado',
        addNote: 'Añadir nota',
        addCity: 'Añadir ciudad',
        citiesTab: 'Ciudades',
        remove: 'Quitar marca',
        currentStatus: 'Estado',
        citySearchPlaceholder: 'Buscar ciudades en {{country}}',
        citySearchHint: 'Empieza a escribir el nombre de una ciudad y elígela de la lista.',
        searchResults: 'Resultados de búsqueda',
        cityLoading: 'Buscando ciudades...',
        cityNoResults: 'No se encontraron ciudades para esta búsqueda.',
        citySearchStart: 'Escribe al menos 2 caracteres para buscar una ciudad.',
        citySearchError: 'No se pudieron cargar las ciudades ahora mismo.',
        cityAdded: 'Añadida',
        savedCities: 'Ciudades guardadas',
        noCitiesYet: 'Todavía no hay ciudades añadidas.',
        cityNoSavedMatches: 'Ninguna ciudad guardada coincide con esta búsqueda.',
        usState: 'Estado de EE. UU.',
        removeCountryConfirmTitle: '¿Quitar la marca del país?',
        removeCountryWithCitiesConfirm:
          '¿Quitar la marca de {{country}}? Esto también eliminará {{count}} ciudad guardada.',
        removeCountryWithCitiesConfirm_other:
          '¿Quitar la marca de {{country}}? Esto también eliminará {{count}} ciudades guardadas.'
      },
      settings: {
        title: 'Configuración',
        language: 'Idioma',
        theme: 'Tema',
        usaMode: 'Modo de EE. UU.',
        usaModeCountry: 'País completo',
        usaModeStates: 'Por estados',
        usaModeHint:
          'En el modo por estados, EE. UU. se marca estado por estado. Aun así, cuenta como un país visitado en cuanto se marca al menos un estado.',
        themeAtlas: 'Atlas',
        themeLight: 'Claro',
        exportPng: 'Exportar PNG',
        export: 'Exportar',
        themeDark: 'Oscuro',
        resetMap: 'Restablecer mapa',
        resetMapAction: 'Borrar todos los datos de viaje',
        resetMapConfirm:
          '¿Borrar todos los países, ciudades, viajes y fotos guardadas de este mapa?'
      },
      common: {
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        add: 'Añadir',
        yes: 'Sí',
        no: 'No',
        all: 'Todo',
        notes: 'Notas',
        photos: 'Fotos',
        tags: 'Etiquetas',
        from: 'Desde',
        to: 'Hasta',
        showMore: 'Mostrar texto completo',
        showLess: 'Contraer',
        noVisits: 'Aún no hay visitas'
      }
    }
  },
  pt: {
    translation: {
      status: {
        homeland: 'País de origem',
        resident: 'Residência',
        visited: 'Visitado',
        wishlist: 'Lista de desejos'
      },
      stats: {
        countries: '{{count}} país',
        countries_other: '{{count}} países',
        cities: '{{count}} cidade',
        cities_other: '{{count}} cidades',
        world: '{{percent}}% do mundo',
        countriesLabel: 'países',
        citiesLabel: 'cidades',
        statesLabel: 'estados',
        statesProgress: 'Progresso',
        worldLabel: 'do mundo',
        usStatesLabel: 'estados dos EUA marcados',
        days: '{{count}} dia',
        days_other: '{{count}} dias'
      },
      tabs: {
        map: 'Mapa',
        countries: 'Países',
        stats: 'Estatísticas',
        achievements: 'Conquistas',
        settings: 'Configurações',
        about: 'Sobre'
      },
      achievements: {
        title: 'Conquistas',
        subtitle: 'Marcos de viagem e metas memoráveis para o seu mapa',
        lockedHint:
          'Os cartões bloqueados continuam visíveis, mas com aparência mais discreta: espaço de imagem suavizado, moldura mais leve e um selo de cadeado claro.',
        locked: 'Bloqueado',
        imageSlot: 'Espaço da imagem',
        toastTitle: 'Conquista desbloqueada',
        categories: {
          onboarding: 'Início',
          progress: 'Progresso',
          exploration: 'Exploração',
          collection: 'Coleção',
          functional: 'Funções'
        },
        items: {
          first_step: {
            title: 'Primeiro Passo',
            description: 'Marque seu primeiro país como visitado.'
          },
          want_here: {
            title: 'Quero Ir',
            description: 'Adicione seu primeiro país à lista de desejos.'
          },
          my_geography: {
            title: 'Minha Geografia',
            description: 'Tenha visitado, lista de desejos e país de origem no mapa ao mesmo tempo.'
          },
          curious: { title: 'Curiosidade', description: 'Abra a aba Sobre.' },
          novice: { title: 'Iniciante', description: 'Marque 5 países visitados.' },
          good_pace: { title: 'Bom Ritmo', description: 'Marque 10 países visitados.' },
          unstoppable: { title: 'Imparável', description: 'Marque 25 países visitados.' },
          citizen_world: { title: 'Cidadania Global', description: 'Marque 50 países visitados.' },
          european_start: { title: 'Início Europeu', description: 'Visite 5 países da Europa.' },
          asia_calls: { title: 'A Ásia Chama', description: 'Visite 5 países da Ásia.' },
          across_ocean: {
            title: 'Do Outro Lado Do Oceano',
            description: 'Visite países em 2 continentes.'
          },
          globe_alive: {
            title: 'O Globo Ganha Vida',
            description: 'Visite países em 3 continentes.'
          },
          oceania_heart: {
            title: 'Oceania No Coração',
            description: 'Marque seu primeiro país na Oceania.'
          },
          neighbors: {
            title: 'Vizinhos',
            description: 'Reúna um grupo conectado de 5 países vizinhos.'
          },
          islander: { title: 'Vida Insular', description: 'Visite 3 estados insulares.' },
          sea_character: { title: 'Espírito do Mar', description: 'Visite 5 países costeiros.' },
          inland_depth: { title: 'Interior Profundo', description: 'Visite 3 países sem litoral.' },
          mediterranean_route: {
            title: 'Rota do Mediterrâneo',
            description: 'Visite 4 países mediterrâneos.'
          },
          northern_wind: { title: 'Vento do Norte', description: 'Visite 3 países escandinavos.' },
          cartographer: { title: 'Cartografia', description: 'Exporte o mapa pela primeira vez.' }
        }
      },
      about: {
        title: 'Sobre o Atlas Travel',
        intro:
          'O Atlas Travel ajuda você a manter um registro visual e claro de onde esteve e das lembranças que quer guardar de cada lugar.',
        featuresTitle: 'O Que Você Pode Fazer',
        featureMap:
          'Marque países no mapa-múndi e veja sua história de viagem ganhar forma rapidamente.',
        featureStatuses:
          'Use estados diferentes para lugares que são sua casa, onde você morou, já visitou ou ainda quer visitar.',
        featureCities:
          'Salve cidades dentro de cada país para lembrar paradas específicas, rotas e lugares favoritos.',
        featureMemories:
          'Adicione datas de visita, notas e fotos para transformar o mapa em um arquivo pessoal de viagens.',
        mechanicsTitle: 'Como Funciona',
        mechanicStatuses:
          'Cada país ou estado pode ter um status, e suas estatísticas são atualizadas automaticamente quando você marca novos lugares.',
        mechanicStats:
          'O aplicativo acompanha países visitados, cidades salvas e o total de dias de viagem em uma visão simples.',
        mechanicExport:
          'Você pode exportar o mapa em PNG para compartilhar seu progresso ou guardar uma imagem das suas viagens.',
        usaTitle: 'Modos dos EUA',
        usaModeCountry:
          'Você pode tratar os EUA como um único país se preferir um estilo clássico de mapa-múndi.',
        usaModeStates:
          'Ou mudar para o modo por estados e marcar os estados dos EUA separadamente.',
        usaModeCounting:
          'No modo por estados, os EUA ainda contam como um país visitado assim que pelo menos um estado é marcado.'
      },
      map: {
        clickCountry: 'Clique em um país para marcá-lo',
        setStatus: 'Definir status',
        addNote: 'Adicionar nota',
        addCity: 'Adicionar cidade',
        citiesTab: 'Cidades',
        remove: 'Remover marcação',
        currentStatus: 'Status',
        citySearchPlaceholder: 'Buscar cidades em {{country}}',
        citySearchHint: 'Comece a digitar o nome de uma cidade e escolha na lista.',
        searchResults: 'Resultados da busca',
        cityLoading: 'Buscando cidades...',
        cityNoResults: 'Nenhuma cidade encontrada para esta busca.',
        citySearchStart: 'Digite pelo menos 2 caracteres para buscar uma cidade.',
        citySearchError: 'Não foi possível carregar as cidades agora.',
        cityAdded: 'Adicionada',
        savedCities: 'Cidades salvas',
        noCitiesYet: 'Ainda não há cidades adicionadas.',
        cityNoSavedMatches: 'Nenhuma cidade salva corresponde a esta busca.',
        usState: 'Estado dos EUA',
        removeCountryConfirmTitle: 'Remover marcação do país?',
        removeCountryWithCitiesConfirm:
          'Remover a marcação de {{country}}? Isso também excluirá {{count}} cidade salva.',
        removeCountryWithCitiesConfirm_other:
          'Remover a marcação de {{country}}? Isso também excluirá {{count}} cidades salvas.'
      },
      settings: {
        title: 'Configurações',
        language: 'Idioma',
        theme: 'Tema',
        usaMode: 'Modo dos EUA',
        usaModeCountry: 'País inteiro',
        usaModeStates: 'Por estados',
        usaModeHint:
          'No modo por estados, os EUA são marcados estado por estado. Mesmo assim, contam como um país visitado assim que pelo menos um estado é marcado.',
        themeAtlas: 'Atlas',
        themeLight: 'Claro',
        exportPng: 'Exportar PNG',
        export: 'Exportar',
        themeDark: 'Escuro',
        resetMap: 'Redefinir mapa',
        resetMapAction: 'Apagar todos os dados de viagem',
        resetMapConfirm: 'Apagar todos os países, cidades, viagens e fotos salvas deste mapa?'
      },
      common: {
        save: 'Salvar',
        cancel: 'Cancelar',
        delete: 'Excluir',
        edit: 'Editar',
        close: 'Fechar',
        add: 'Adicionar',
        yes: 'Sim',
        no: 'Não',
        all: 'Todos',
        notes: 'Notas',
        photos: 'Fotos',
        tags: 'Etiquetas',
        from: 'De',
        to: 'Até',
        showMore: 'Mostrar texto completo',
        showLess: 'Recolher',
        noVisits: 'Ainda sem visitas'
      }
    }
  },
  cs: {
    translation: {
      status: {
        homeland: 'Domov',
        resident: 'Bydliště',
        visited: 'Navštíveno',
        wishlist: 'Seznam přání'
      },
      stats: {
        countries_one: '{{count}} země',
        countries_few: '{{count}} země',
        countries_many: '{{count}} zemí',
        countries_other: '{{count}} zemí',
        cities_one: '{{count}} město',
        cities_few: '{{count}} města',
        cities_many: '{{count}} měst',
        cities_other: '{{count}} měst',
        world: '{{percent}}% světa',
        countriesLabel: 'zemí',
        citiesLabel: 'měst',
        statesLabel: 'států',
        statesProgress: 'Průběh',
        worldLabel: 'světa',
        usStatesLabel: 'označených států USA',
        days_one: '{{count}} den',
        days_few: '{{count}} dny',
        days_many: '{{count}} dní',
        days_other: '{{count}} dne'
      },
      tabs: {
        map: 'Mapa',
        countries: 'Země',
        stats: 'Statistiky',
        achievements: 'Úspěchy',
        settings: 'Nastavení',
        about: 'O aplikaci'
      },
      achievements: {
        title: 'Úspěchy',
        subtitle: 'Cestovatelské milníky a zapamatovatelné cíle pro tvou mapu',
        lockedHint:
          'Zamčené karty zůstávají viditelné, ale působí klidněji: tlumené místo pro obrázek, jemnější rámeček a zřetelný odznak zámku.',
        locked: 'Zamčeno',
        imageSlot: 'Místo pro obrázek',
        toastTitle: 'Úspěch odemčen',
        categories: {
          onboarding: 'Začátek',
          progress: 'Pokrok',
          exploration: 'Objevování',
          collection: 'Sbírka',
          functional: 'Funkce'
        },
        items: {
          first_step: {
            title: 'První Krok',
            description: 'Označ svou první zemi jako navštívenou.'
          },
          want_here: { title: 'Chci Tam', description: 'Přidej svou první zemi do seznamu přání.' },
          my_geography: {
            title: 'Moje Geografie',
            description: 'Měj na mapě současně navštíveno, seznam přání a domov.'
          },
          curious: { title: 'Zvědavost', description: 'Otevři kartu O aplikaci.' },
          novice: { title: 'Začátečník', description: 'Označ 5 navštívených zemí.' },
          good_pace: { title: 'Dobré Tempo', description: 'Označ 10 navštívených zemí.' },
          unstoppable: { title: 'Nezastavitelný', description: 'Označ 25 navštívených zemí.' },
          citizen_world: { title: 'Občan Světa', description: 'Označ 50 navštívených zemí.' },
          european_start: { title: 'Evropský Start', description: 'Navštiv 5 zemí v Evropě.' },
          asia_calls: { title: 'Asie Volá', description: 'Navštiv 5 zemí v Asii.' },
          across_ocean: { title: 'Přes Oceán', description: 'Navštiv země na 2 kontinentech.' },
          globe_alive: { title: 'Glóbus Ožívá', description: 'Navštiv země na 3 kontinentech.' },
          oceania_heart: {
            title: 'Oceánie V Srdci',
            description: 'Označ svou první zemi v Oceánii.'
          },
          neighbors: {
            title: 'Sousedé',
            description: 'Nasbírej propojenou skupinu 5 sousedních zemí.'
          },
          islander: { title: 'Ostrovan', description: 'Navštiv 3 ostrovní státy.' },
          sea_character: { title: 'Mořská Povaha', description: 'Navštiv 5 přímořských zemí.' },
          inland_depth: {
            title: 'Hluboko Ve Vnitrozemí',
            description: 'Navštiv 3 vnitrozemské země.'
          },
          mediterranean_route: {
            title: 'Středomořská Trasa',
            description: 'Navštiv 4 středomořské země.'
          },
          northern_wind: { title: 'Severní Vítr', description: 'Navštiv 3 skandinávské země.' },
          cartographer: { title: 'Kartograf', description: 'Poprvé exportuj mapu.' }
        }
      },
      about: {
        title: 'O Atlas Travel',
        intro:
          'Atlas Travel ti pomáhá uchovávat přehledný vizuální záznam o tom, kde jsi byla a jaké vzpomínky si chceš z každého místa ponechat.',
        featuresTitle: 'Co Můžeš Dělat',
        featureMap:
          'Označuj země na mapě světa a sleduj, jak se tvůj cestovatelský příběh formuje na první pohled.',
        featureStatuses:
          'Používej různé stavy pro místa, která jsou domovem, kde jsi žila, která jsi navštívila nebo která máš na seznamu přání.',
        featureCities:
          'Ukládej města uvnitř jednotlivých zemí, aby sis pamatovala konkrétní zastávky, trasy a oblíbená místa.',
        featureMemories:
          'Přidávej data návštěv, poznámky a fotky, aby se mapa proměnila v osobní cestovní archiv.',
        mechanicsTitle: 'Jak To Funguje',
        mechanicStatuses:
          'Každá země nebo stát může mít jeden stav a statistiky se automaticky aktualizují při označení nových míst.',
        mechanicStats:
          'Aplikace sleduje navštívené země, uložená města a celkový počet dnů na cestách v jednoduchém přehledu.',
        mechanicExport:
          'Mapu můžeš exportovat do PNG, abys mohla sdílet svůj pokrok nebo si uložit snímek svých cest.',
        usaTitle: 'Režimy USA',
        usaModeCountry:
          'USA můžeš brát jako jednu zemi, pokud ti vyhovuje klasický styl mapy světa.',
        usaModeStates: 'Nebo přepni do režimu států a označuj jednotlivé státy USA zvlášť.',
        usaModeCounting:
          'V režimu států se USA stále počítají jako jedna navštívená země, jakmile je označen alespoň jeden stát.'
      },
      map: {
        clickCountry: 'Kliknutím označíš zemi',
        setStatus: 'Nastavit stav',
        addNote: 'Přidat poznámku',
        addCity: 'Přidat město',
        citiesTab: 'Města',
        remove: 'Odstranit označení',
        currentStatus: 'Stav',
        citySearchPlaceholder: 'Hledat města v {{country}}',
        citySearchHint: 'Začni psát název města a vyber ho ze seznamu.',
        searchResults: 'Výsledky hledání',
        cityLoading: 'Hledám města...',
        cityNoResults: 'Pro tento dotaz nebyla nalezena žádná města.',
        citySearchStart: 'Pro hledání města zadej alespoň 2 znaky.',
        citySearchError: 'Města se teď nepodařilo načíst.',
        cityAdded: 'Přidáno',
        savedCities: 'Uložená města',
        noCitiesYet: 'Zatím nejsou přidána žádná města.',
        cityNoSavedMatches: 'Žádné uložené město neodpovídá tomuto hledání.',
        usState: 'Stát USA',
        removeCountryConfirmTitle: 'Odstranit označení země?',
        removeCountryWithCitiesConfirm_one:
          'Odstranit označení země {{country}}? Tím se smaže také {{count}} uložené město.',
        removeCountryWithCitiesConfirm_few:
          'Odstranit označení země {{country}}? Tím se smažou také {{count}} uložená města.',
        removeCountryWithCitiesConfirm_many:
          'Odstranit označení země {{country}}? Tím se smaže také {{count}} uložených měst.',
        removeCountryWithCitiesConfirm_other:
          'Odstranit označení země {{country}}? Tím se smaže také {{count}} uloženého města.'
      },
      settings: {
        title: 'Nastavení',
        language: 'Jazyk',
        theme: 'Motiv',
        usaMode: 'Režim USA',
        usaModeCountry: 'Celá země',
        usaModeStates: 'Po státech',
        usaModeHint:
          'V režimu států se USA označují stát po státu. Ve statistikách se ale stále počítají jako jedna navštívená země, jakmile je označen alespoň jeden stát.',
        themeAtlas: 'Atlas',
        themeLight: 'Světlý',
        exportPng: 'Exportovat PNG',
        export: 'Exportovat',
        themeDark: 'Tmavý',
        resetMap: 'Reset mapy',
        resetMapAction: 'Smazat všechna cestovní data',
        resetMapConfirm: 'Smazat z této mapy všechny označené země, města, cesty a uložené fotky?'
      },
      common: {
        save: 'Uložit',
        cancel: 'Zrušit',
        delete: 'Smazat',
        edit: 'Upravit',
        close: 'Zavřít',
        add: 'Přidat',
        yes: 'Ano',
        no: 'Ne',
        all: 'Vše',
        notes: 'Poznámky',
        photos: 'Fotky',
        tags: 'Štítky',
        from: 'Od',
        to: 'Do',
        showMore: 'Zobrazit celý text',
        showLess: 'Sbalit',
        noVisits: 'Zatím žádné návštěvy'
      }
    }
  },
  pl: {
    translation: {
      status: {
        homeland: 'Ojczyzna',
        resident: 'Miejsce zamieszkania',
        visited: 'Odwiedzone',
        wishlist: 'Lista życzeń'
      },
      stats: {
        countries_one: '{{count}} kraj',
        countries_few: '{{count}} kraje',
        countries_many: '{{count}} krajów',
        countries_other: '{{count}} kraju',
        cities_one: '{{count}} miasto',
        cities_few: '{{count}} miasta',
        cities_many: '{{count}} miast',
        cities_other: '{{count}} miasta',
        world: '{{percent}}% świata',
        countriesLabel: 'krajów',
        citiesLabel: 'miast',
        statesLabel: 'stanów',
        statesProgress: 'Postęp',
        worldLabel: 'świata',
        usStatesLabel: 'oznaczonych stanów USA',
        days_one: '{{count}} dzień',
        days_few: '{{count}} dni',
        days_many: '{{count}} dni',
        days_other: '{{count}} dnia'
      },
      tabs: {
        map: 'Mapa',
        countries: 'Kraje',
        stats: 'Statystyki',
        achievements: 'Osiągnięcia',
        settings: 'Ustawienia',
        about: 'O aplikacji'
      },
      achievements: {
        title: 'Osiągnięcia',
        subtitle: 'Podróżnicze kamienie milowe i warte zapamiętania cele na mapie',
        lockedHint:
          'Zablokowane karty pozostają widoczne, ale wyglądają spokojniej: przygaszone miejsce na obraz, delikatniejsza ramka i wyraźna ikona kłódki.',
        locked: 'Zablokowane',
        imageSlot: 'Miejsce na obraz',
        toastTitle: 'Odblokowano osiągnięcie',
        categories: {
          onboarding: 'Start',
          progress: 'Postęp',
          exploration: 'Odkrywanie',
          collection: 'Kolekcja',
          functional: 'Funkcje'
        },
        items: {
          first_step: {
            title: 'Pierwszy Krok',
            description: 'Oznacz pierwszy kraj jako odwiedzony.'
          },
          want_here: {
            title: 'Chcę Tam Pojechać',
            description: 'Dodaj pierwszy kraj do listy życzeń.'
          },
          my_geography: {
            title: 'Moja Geografia',
            description: 'Miej jednocześnie na mapie odwiedzone, listę życzeń i ojczyznę.'
          },
          curious: { title: 'Ciekawość', description: 'Otwórz kartę O aplikacji.' },
          novice: { title: 'Początki', description: 'Oznacz 5 odwiedzonych krajów.' },
          good_pace: { title: 'Dobre Tempo', description: 'Oznacz 10 odwiedzonych krajów.' },
          unstoppable: {
            title: 'Nie Do Zatrzymania',
            description: 'Oznacz 25 odwiedzonych krajów.'
          },
          citizen_world: {
            title: 'Obywatel Świata',
            description: 'Oznacz 50 odwiedzonych krajów.'
          },
          european_start: { title: 'Europejski Start', description: 'Odwiedź 5 krajów w Europie.' },
          asia_calls: { title: 'Azja Woła', description: 'Odwiedź 5 krajów w Azji.' },
          across_ocean: { title: 'Przez Ocean', description: 'Odwiedź kraje na 2 kontynentach.' },
          globe_alive: { title: 'Glob Ożywa', description: 'Odwiedź kraje na 3 kontynentach.' },
          oceania_heart: {
            title: 'Oceania W Sercu',
            description: 'Oznacz pierwszy kraj w Oceanii.'
          },
          neighbors: {
            title: 'Sąsiedzi',
            description: 'Zbierz połączoną grupę 5 sąsiadujących krajów.'
          },
          islander: { title: 'Wyspiarski Szlak', description: 'Odwiedź 3 państwa wyspiarskie.' },
          sea_character: {
            title: 'Morski Charakter',
            description: 'Odwiedź 5 krajów nadmorskich.'
          },
          inland_depth: {
            title: 'W Głębi Lądu',
            description: 'Odwiedź 3 kraje bez dostępu do morza.'
          },
          mediterranean_route: {
            title: 'Szlak Śródziemnomorski',
            description: 'Odwiedź 4 kraje śródziemnomorskie.'
          },
          northern_wind: { title: 'Północny Wiatr', description: 'Odwiedź 3 kraje skandynawskie.' },
          cartographer: { title: 'Kartografia', description: 'Po raz pierwszy wyeksportuj mapę.' }
        }
      },
      about: {
        title: 'O Atlas Travel',
        intro:
          'Atlas Travel pomaga prowadzić czytelny, wizualny zapis miejsc, w których byłaś, oraz wspomnień, które chcesz zachować z każdego miejsca.',
        featuresTitle: 'Co Możesz Zrobić',
        featureMap:
          'Oznaczaj kraje na mapie świata i obserwuj, jak twoja historia podróży nabiera kształtu.',
        featureStatuses:
          'Używaj różnych statusów dla miejsc, które są twoim domem, gdzie mieszkałaś, które odwiedziłaś albo które wciąż są na liście życzeń.',
        featureCities:
          'Zapisuj miasta w obrębie każdego kraju, aby pamiętać konkretne przystanki, trasy i ulubione miejsca.',
        featureMemories:
          'Dodawaj daty wizyt, notatki i zdjęcia, aby mapa stała się twoim osobistym archiwum podróży.',
        mechanicsTitle: 'Jak To Działa',
        mechanicStatuses:
          'Każdy kraj lub stan może mieć jeden status, a statystyki aktualizują się automatycznie po oznaczeniu nowych miejsc.',
        mechanicStats:
          'Aplikacja śledzi odwiedzone kraje, zapisane miasta i łączną liczbę dni podróży w prostym podsumowaniu.',
        mechanicExport:
          'Możesz wyeksportować mapę jako PNG, aby podzielić się postępami albo zachować migawkę swoich podróży.',
        usaTitle: 'Tryby USA',
        usaModeCountry:
          'Możesz traktować USA jako jeden kraj, jeśli wolisz klasyczny styl mapy świata.',
        usaModeStates:
          'Albo przełączyć się na tryb stanów i oznaczać poszczególne stany USA osobno.',
        usaModeCounting:
          'W trybie stanów USA nadal liczą się jako jeden odwiedzony kraj, gdy tylko oznaczony zostanie co najmniej jeden stan.'
      },
      map: {
        clickCountry: 'Kliknij kraj, aby go oznaczyć',
        setStatus: 'Ustaw status',
        addNote: 'Dodaj notatkę',
        addCity: 'Dodaj miasto',
        citiesTab: 'Miasta',
        remove: 'Usuń oznaczenie',
        currentStatus: 'Status',
        citySearchPlaceholder: 'Szukaj miast w {{country}}',
        citySearchHint: 'Zacznij wpisywać nazwę miasta i wybierz je z listy.',
        searchResults: 'Wyniki wyszukiwania',
        cityLoading: 'Szukanie miast...',
        cityNoResults: 'Nie znaleziono miast dla tego zapytania.',
        citySearchStart: 'Wpisz co najmniej 2 znaki, aby wyszukać miasto.',
        citySearchError: 'Nie udało się teraz załadować miast.',
        cityAdded: 'Dodano',
        savedCities: 'Zapisane miasta',
        noCitiesYet: 'Nie dodano jeszcze żadnych miast.',
        cityNoSavedMatches: 'Żadne zapisane miasto nie pasuje do tego wyszukiwania.',
        usState: 'Stan USA',
        removeCountryConfirmTitle: 'Usunąć oznaczenie kraju?',
        removeCountryWithCitiesConfirm_one:
          'Usunąć oznaczenie kraju {{country}}? To usunie także {{count}} zapisane miasto.',
        removeCountryWithCitiesConfirm_few:
          'Usunąć oznaczenie kraju {{country}}? To usunie także {{count}} zapisane miasta.',
        removeCountryWithCitiesConfirm_many:
          'Usunąć oznaczenie kraju {{country}}? To usunie także {{count}} zapisanych miast.',
        removeCountryWithCitiesConfirm_other:
          'Usunąć oznaczenie kraju {{country}}? To usunie także {{count}} zapisanego miasta.'
      },
      settings: {
        title: 'Ustawienia',
        language: 'Język',
        theme: 'Motyw',
        usaMode: 'Tryb USA',
        usaModeCountry: 'Cały kraj',
        usaModeStates: 'Według stanów',
        usaModeHint:
          'W trybie stanów USA są oznaczane stan po stanie. W statystykach nadal liczą się jednak jako jeden odwiedzony kraj, gdy tylko oznaczony zostanie co najmniej jeden stan.',
        themeAtlas: 'Atlas',
        themeLight: 'Jasny',
        exportPng: 'Eksportuj PNG',
        export: 'Eksportuj',
        themeDark: 'Ciemny',
        resetMap: 'Reset mapy',
        resetMapAction: 'Wyczyść wszystkie dane podróży',
        resetMapConfirm:
          'Wyczyścić z tej mapy wszystkie oznaczone kraje, miasta, podróże i zapisane zdjęcia?'
      },
      common: {
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usuń',
        edit: 'Edytuj',
        close: 'Zamknij',
        add: 'Dodaj',
        yes: 'Tak',
        no: 'Nie',
        all: 'Wszystkie',
        notes: 'Notatki',
        photos: 'Zdjęcia',
        tags: 'Tagi',
        from: 'Od',
        to: 'Do',
        showMore: 'Pokaż cały tekst',
        showLess: 'Zwiń',
        noVisits: 'Brak wizyt'
      }
    }
  },
  uk: {
    translation: {
      status: {
        homeland: 'Батьківщина',
        resident: 'Резидент',
        visited: 'Відвідав',
        wishlist: 'Хочу відвідати'
      },
      stats: {
        countries_one: '{{count}} країна',
        countries_few: '{{count}} країни',
        countries_many: '{{count}} країн',
        countries_other: '{{count}} країн',
        cities_one: '{{count}} місто',
        cities_few: '{{count}} міста',
        cities_many: '{{count}} міст',
        cities_other: '{{count}} міст',
        world: '{{percent}}% світу',
        countriesLabel: 'країн',
        citiesLabel: 'міст',
        statesLabel: 'штатів',
        statesProgress: 'Прогрес',
        worldLabel: 'світу',
        usStatesLabel: 'позначено штатів США',
        days_one: '{{count}} день',
        days_few: '{{count}} дні',
        days_many: '{{count}} днів',
        days_other: '{{count}} днів'
      },
      tabs: {
        map: 'Карта',
        countries: 'Країни',
        stats: 'Статистика',
        achievements: 'Досягнення',
        settings: 'Налаштування',
        about: 'Про програму'
      },
      achievements: {
        title: 'Досягнення',
        subtitle: 'Подорожні досягнення та цілі для карти',
        lockedHint:
          'Закриті картки залишаються видимими, але виглядають спокійніше: приглушений слот для картинки, м’якша рамка та помітний замок.',
        locked: 'Закрито',
        imageSlot: 'Місце для картинки',
        toastTitle: 'Досягнення отримано',
        categories: {
          onboarding: 'Старт',
          progress: 'Прогрес',
          exploration: 'Дослідження',
          collection: 'Колекції',
          functional: 'Функції'
        },
        items: {
          first_step: { title: 'Перший крок', description: 'Позначити першу країну як відвідану.' },
          want_here: { title: 'Хочу сюди', description: 'Додати першу країну до wishlist.' },
          my_geography: {
            title: 'Моя географія',
            description: 'Зробити так, щоб на карті одночасно були visited, wishlist і homeland.'
          },
          curious: { title: 'Допитливий', description: 'Відкрити вкладку «Про програму».' },
          novice: { title: 'Новачок', description: 'Позначити 5 відвіданих країн.' },
          good_pace: { title: 'У доброму темпі', description: 'Позначити 10 відвіданих країн.' },
          unstoppable: { title: 'Не спинити', description: 'Позначити 25 відвіданих країн.' },
          citizen_world: {
            title: 'Громадянин світу',
            description: 'Позначити 50 відвіданих країн.'
          },
          european_start: { title: 'Європейський старт', description: 'Відвідати 5 країн Європи.' },
          asia_calls: { title: 'Азія кличе', description: 'Відвідати 5 країн Азії.' },
          across_ocean: { title: 'Через океан', description: 'Відвідати країни на 2 континентах.' },
          globe_alive: {
            title: 'Глобус оживає',
            description: 'Відвідати країни на 3 континентах.'
          },
          oceania_heart: {
            title: 'Океанія в серці',
            description: 'Позначити першу країну Океанії.'
          },
          neighbors: { title: 'Сусіди', description: 'Зібрати групу з 5 сусідніх країн.' },
          islander: { title: 'Острів’янин', description: 'Відвідати 3 острівні держави.' },
          sea_character: {
            title: 'Морський характер',
            description: 'Відвідати 5 країн із виходом до моря.'
          },
          inland_depth: {
            title: 'У глибині материка',
            description: 'Відвідати 3 країни без виходу до моря.'
          },
          mediterranean_route: {
            title: 'Середземноморський маршрут',
            description: 'Відвідати 4 країни Середземномор’я.'
          },
          northern_wind: {
            title: 'Північний вітер',
            description: 'Відвідати 3 скандинавські країни.'
          },
          cartographer: { title: 'Картограф', description: 'Уперше експортувати карту.' }
        }
      },
      about: {
        title: 'Про Atlas Travel',
        intro:
          'Atlas Travel допомагає зручно зберігати історію подорожей і тримати країни, міста та спогади в одному місці.',
        featuresTitle: 'Що Вміє Програма',
        featureMap:
          'Можна позначати країни на карті світу й одразу бачити загальний прогрес подорожей.',
        featureStatuses:
          'Для країн і штатів можна вибирати статус: батьківщина, місце проживання, відвідане місце або список бажань.',
        featureCities:
          'Усередині країн можна зберігати міста, щоб відмічати конкретні точки та маршрути.',
        featureMemories:
          'До поїздок можна додавати дати, нотатки й фотографії, щоб карта ставала особистим архівом.',
        mechanicsTitle: 'Як Це Працює',
        mechanicStatuses:
          'Кожна країна або штат має один активний статус, а статистика оновлюється автоматично.',
        mechanicStats:
          'Програма показує кількість позначених країн, збережених міст і сумарні дні подорожей.',
        mechanicExport:
          'Карту можна експортувати в PNG, щоб поділитися прогресом або зберегти гарний знімок.',
        usaTitle: 'Режими США',
        usaModeCountry:
          'США можна враховувати як одну країну, якщо потрібен класичний режим світової карти.',
        usaModeStates: 'Або можна ввімкнути режим штатів і позначати кожен штат окремо.',
        usaModeCounting:
          'У режимі штатів США все одно рахуються як одна відвідана країна, щойно позначено хоча б один штат.'
      },
      map: {
        clickCountry: 'Натисніть на країну щоб відзначити',
        setStatus: 'Встановити статус',
        addNote: 'Додати нотатку',
        addCity: 'Додати місто',
        citiesTab: 'Міста',
        remove: 'Прибрати позначку',
        currentStatus: 'Статус',
        citySearchPlaceholder: 'Знайти міста в країні {{country}}',
        citySearchHint: 'Почніть вводити назву міста та виберіть його зі списку.',
        searchResults: 'Результати пошуку',
        cityLoading: 'Шукаю міста...',
        cityNoResults: 'За цим запитом міста не знайдено.',
        citySearchStart: 'Введіть щонайменше 2 символи, щоб шукати міста.',
        citySearchError: 'Зараз не вдалося завантажити список міст.',
        cityAdded: 'Додано',
        savedCities: 'Збережені міста',
        noCitiesYet: 'Міста ще не додані.',
        cityNoSavedMatches: 'Серед збережених міст збігів немає.',
        usState: 'Штат США',
        removeCountryConfirmTitle: 'Зняти позначку з країни?',
        removeCountryWithCitiesConfirm_one:
          'Зняти позначку з {{country}}? Це також видалить {{count}} збережене місто.',
        removeCountryWithCitiesConfirm_few:
          'Зняти позначку з {{country}}? Це також видалить {{count}} збережені міста.',
        removeCountryWithCitiesConfirm_many:
          'Зняти позначку з {{country}}? Це також видалить {{count}} збережених міст.',
        removeCountryWithCitiesConfirm_other:
          'Зняти позначку з {{country}}? Це також видалить {{count}} збережених міст.'
      },
      settings: {
        title: 'Налаштування',
        language: 'Мова',
        theme: 'Тема',
        usaMode: 'Режим США',
        usaModeCountry: 'Як країна',
        usaModeStates: 'За штатами',
        usaModeHint:
          'У режимі штатів США позначаються окремо за штатами, але в статистиці все одно рахуються як одна відвідана країна, щойно позначено хоча б один штат.',
        themeAtlas: 'Атлас',
        themeLight: 'Світла',
        exportPng: 'Експорт PNG',
        themeDark: 'Темна',
        resetMap: 'Скинути карту',
        resetMapAction: 'Очистити всі дані карти',
        resetMapConfirm:
          'Очистити всі позначені країни, міста, поїздки та збережені фото на цій карті?'
      },
      common: {
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        edit: 'Редагувати',
        close: 'Закрити',
        add: 'Додати',
        yes: 'Так',
        no: 'Ні',
        all: 'Усі',
        notes: 'Нотатки',
        photos: 'Фото',
        tags: 'Теги',
        from: 'З',
        to: 'По',
        showMore: 'Показати повністю',
        showLess: 'Згорнути',
        noVisits: 'Немає візитів'
      }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  pluralSeparator: '_'
})

export default i18n
