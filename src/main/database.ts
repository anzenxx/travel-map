import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'

export let db: Database.Database

export type CountryStatus = 'homeland' | 'resident' | 'visited' | 'wishlist'

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

export interface Setting {
  key: string
  value: string
}

interface BackupPhoto extends Photo {
  filename?: string
  data?: string
}

interface TravelBackup {
  version: 1
  exported_at: string
  countries: Country[]
  cities: City[]
  visits: Visit[]
  photos: BackupPhoto[]
  tags: Tag[]
  visit_tags: { visit_id: number; tag_id: number }[]
  settings: Setting[]
}

export function getStorageDir(): string {
  const legacyDir = join(app.getPath('appData'), 'travel-map')
  if (!existsSync(legacyDir)) {
    mkdirSync(legacyDir, { recursive: true })
  }
  return legacyDir
}

export function initDatabase(): void {
  const dbPath = join(getStorageDir(), 'travelmap.db')
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  createTables()
}

function createTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      iso_code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL CHECK(status IN ('homeland','resident','visited','wishlist')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_iso TEXT NOT NULL,
      name TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (country_iso) REFERENCES countries(iso_code)
    );

    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_type TEXT NOT NULL CHECK(place_type IN ('country','city')),
      place_id TEXT NOT NULL,
      date_from TEXT,
      date_to TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visit_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      thumbnail_path TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS visit_tags (
      visit_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (visit_id, tag_id),
      FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    INSERT OR IGNORE INTO settings (key, value) VALUES ('language', 'en');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', 'light');

    INSERT OR IGNORE INTO tags (name) VALUES
      ('food'), ('nature'), ('architecture'), ('history'),
      ('nightlife'), ('beach'), ('mountains'), ('culture');
  `)
}

export const queries = {
  getAllCountries: () => db.prepare('SELECT * FROM countries').all() as Country[],

  getCountry: (iso: string) =>
    db.prepare('SELECT * FROM countries WHERE iso_code = ?').get(iso) as Country | undefined,

  upsertCountry: (iso: string, status: CountryStatus) =>
    db
      .prepare(
        `
      INSERT INTO countries (iso_code, status) VALUES (?, ?)
      ON CONFLICT(iso_code) DO UPDATE SET status = excluded.status
    `
      )
      .run(iso, status),

  removeCountry: (iso: string) => {
    const removeCountryTx = db.transaction((countryIso: string) => {
      const cityIds = db.prepare('SELECT id FROM cities WHERE country_iso = ?').all(countryIso) as {
        id: number
      }[]

      if (cityIds.length > 0) {
        const placeholders = cityIds.map(() => '?').join(', ')
        const ids = cityIds.map((city) => city.id)

        db.prepare(
          `
          DELETE FROM visit_tags
          WHERE visit_id IN (
            SELECT id FROM visits
            WHERE place_type = 'city' AND place_id IN (${placeholders})
          )
        `
        ).run(...ids.map(String))

        db.prepare(
          `
          DELETE FROM photos
          WHERE visit_id IN (
            SELECT id FROM visits
            WHERE place_type = 'city' AND place_id IN (${placeholders})
          )
        `
        ).run(...ids.map(String))

        db.prepare(
          `
          DELETE FROM visits
          WHERE place_type = 'city' AND place_id IN (${placeholders})
        `
        ).run(...ids.map(String))

        db.prepare('DELETE FROM cities WHERE country_iso = ?').run(countryIso)
      }

      return db.prepare('DELETE FROM countries WHERE iso_code = ?').run(countryIso)
    })

    return removeCountryTx(iso)
  },

  getCitiesByCountry: (countryIso: string) =>
    db.prepare('SELECT * FROM cities WHERE country_iso = ?').all(countryIso) as City[],

  getAllCities: () => db.prepare('SELECT * FROM cities').all() as City[],

  addCity: (countryIso: string, name: string, lat: number, lng: number) => {
    const normalizedCountryIso = countryIso.trim().toUpperCase()
    if (!normalizedCountryIso) {
      throw new Error('Cannot add city without a country ISO code')
    }

    const addCityTx = db.transaction(() => {
      const country = queries.getCountry(normalizedCountryIso)
      if (!country) {
        try {
          db.prepare("INSERT INTO countries (iso_code, status) VALUES (?, 'wishlist')").run(
            normalizedCountryIso
          )
        } catch {
          // Older local databases may have been created before the wishlist status existed.
          db.prepare(
            "INSERT OR IGNORE INTO countries (iso_code, status) VALUES (?, 'visited')"
          ).run(normalizedCountryIso)
        }
      }

      return db
        .prepare('INSERT INTO cities (country_iso, name, lat, lng) VALUES (?, ?, ?, ?)')
        .run(normalizedCountryIso, name, lat, lng)
    })

    return addCityTx()
  },

  updateCityName: (id: number, name: string) =>
    db.prepare('UPDATE cities SET name = ? WHERE id = ?').run(name, id),

  removeCity: (id: number) => db.prepare('DELETE FROM cities WHERE id = ?').run(id),

  getVisits: (placeType: string, placeId: string) =>
    db
      .prepare('SELECT * FROM visits WHERE place_type = ? AND place_id = ? ORDER BY date_from DESC')
      .all(placeType, placeId) as Visit[],

  addVisit: (
    placeType: string,
    placeId: string,
    dateFrom: string | null,
    dateTo: string | null,
    notes: string | null
  ) =>
    db
      .prepare(
        'INSERT INTO visits (place_type, place_id, date_from, date_to, notes) VALUES (?, ?, ?, ?, ?)'
      )
      .run(placeType, placeId, dateFrom, dateTo, notes),

  updateVisit: (id: number, dateFrom: string | null, dateTo: string | null, notes: string | null) =>
    db
      .prepare('UPDATE visits SET date_from = ?, date_to = ?, notes = ? WHERE id = ?')
      .run(dateFrom, dateTo, notes, id),

  deleteVisit: (id: number) => db.prepare('DELETE FROM visits WHERE id = ?').run(id),

  getAllVisits: () =>
    db
      .prepare('SELECT * FROM visits ORDER BY COALESCE(date_from, created_at) DESC')
      .all() as Visit[],

  getTimelineVisits: () =>
    db
      .prepare(
        `
      SELECT
        v.*,
        CASE
          WHEN v.place_type = 'country' THEN v.place_id
          ELSE c.country_iso
        END AS country_iso,
        c.name AS city_name,
        COUNT(p.id) AS photo_count
      FROM visits v
      LEFT JOIN cities c ON v.place_type = 'city' AND CAST(c.id AS TEXT) = v.place_id
      LEFT JOIN photos p ON p.visit_id = v.id
      GROUP BY v.id
      ORDER BY COALESCE(v.date_from, v.created_at) DESC
    `
      )
      .all() as Array<
      Visit & { country_iso: string; city_name: string | null; photo_count: number }
    >,

  getPhotos: (visitId: number) =>
    db.prepare('SELECT * FROM photos WHERE visit_id = ?').all(visitId) as Photo[],

  addPhoto: (visitId: number, filePath: string, thumbnailPath: string | null) =>
    db
      .prepare('INSERT INTO photos (visit_id, file_path, thumbnail_path) VALUES (?, ?, ?)')
      .run(visitId, filePath, thumbnailPath),

  deletePhoto: (id: number) => db.prepare('DELETE FROM photos WHERE id = ?').run(id),

  getAllTags: () => db.prepare('SELECT * FROM tags ORDER BY name').all() as Tag[],

  upsertTag: (name: string) => {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('Tag name is required')

    db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run(normalizedName)
    return db.prepare('SELECT * FROM tags WHERE name = ?').get(normalizedName) as Tag
  },

  getAllVisitTags: () =>
    db.prepare('SELECT visit_id, tag_id FROM visit_tags').all() as {
      visit_id: number
      tag_id: number
    }[],

  getVisitTags: (visitId: number) =>
    db
      .prepare(
        'SELECT t.* FROM tags t JOIN visit_tags vt ON t.id = vt.tag_id WHERE vt.visit_id = ?'
      )
      .all(visitId) as Tag[],

  addVisitTag: (visitId: number, tagId: number) =>
    db
      .prepare('INSERT OR IGNORE INTO visit_tags (visit_id, tag_id) VALUES (?, ?)')
      .run(visitId, tagId),

  removeVisitTag: (visitId: number, tagId: number) =>
    db.prepare('DELETE FROM visit_tags WHERE visit_id = ? AND tag_id = ?').run(visitId, tagId),

  getSetting: (key: string) =>
    (
      db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as
        | { value: string }
        | undefined
    )?.value,

  setSetting: (key: string, value: string) =>
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value),

  resetTravelData: () => {
    db.exec(`
      DELETE FROM visit_tags;
      DELETE FROM photos;
      DELETE FROM visits;
      DELETE FROM cities;
      DELETE FROM countries;
    `)

    const photosDir = join(getStorageDir(), 'photos')
    if (existsSync(photosDir)) {
      rmSync(photosDir, { recursive: true, force: true })
    }
  },

  exportBackup: (filePath: string) => {
    const photos = queries.getAllPhotos().map((photo) => {
      if (!existsSync(photo.file_path)) return photo
      return {
        ...photo,
        filename: photo.file_path.split(/[\\/]/).pop(),
        data: readFileSync(photo.file_path).toString('base64')
      }
    })

    const backup: TravelBackup = {
      version: 1,
      exported_at: new Date().toISOString(),
      countries: queries.getAllCountries(),
      cities: queries.getAllCities(),
      visits: queries.getAllVisits(),
      photos,
      tags: queries.getAllTags(),
      visit_tags: queries.getAllVisitTags(),
      settings: db.prepare('SELECT * FROM settings').all() as Setting[]
    }

    writeFileSync(filePath, JSON.stringify(backup, null, 2), 'utf8')
  },

  importBackup: (filePath: string) => {
    const backup = JSON.parse(readFileSync(filePath, 'utf8')) as TravelBackup
    if (backup.version !== 1) {
      throw new Error('Unsupported backup version')
    }

    const photosDir = join(getStorageDir(), 'photos')
    if (!existsSync(photosDir)) mkdirSync(photosDir, { recursive: true })

    const restoreTx = db.transaction(() => {
      db.exec(`
        DELETE FROM visit_tags;
        DELETE FROM photos;
        DELETE FROM visits;
        DELETE FROM cities;
        DELETE FROM countries;
        DELETE FROM tags;
        DELETE FROM settings;
      `)

      const countryStmt = db.prepare(
        'INSERT INTO countries (id, iso_code, status, created_at) VALUES (?, ?, ?, ?)'
      )
      for (const country of backup.countries ?? []) {
        countryStmt.run(country.id, country.iso_code, country.status, country.created_at)
      }

      const cityStmt = db.prepare(
        'INSERT INTO cities (id, country_iso, name, lat, lng, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      for (const city of backup.cities ?? []) {
        cityStmt.run(city.id, city.country_iso, city.name, city.lat, city.lng, city.created_at)
      }

      const visitStmt = db.prepare(
        'INSERT INTO visits (id, place_type, place_id, date_from, date_to, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      for (const visit of backup.visits ?? []) {
        visitStmt.run(
          visit.id,
          visit.place_type,
          visit.place_id,
          visit.date_from,
          visit.date_to,
          visit.notes,
          visit.created_at
        )
      }

      const tagStmt = db.prepare('INSERT INTO tags (id, name) VALUES (?, ?)')
      for (const tag of backup.tags ?? []) {
        tagStmt.run(tag.id, tag.name)
      }

      const visitTagStmt = db.prepare(
        'INSERT OR IGNORE INTO visit_tags (visit_id, tag_id) VALUES (?, ?)'
      )
      for (const visitTag of backup.visit_tags ?? []) {
        visitTagStmt.run(visitTag.visit_id, visitTag.tag_id)
      }

      const photoStmt = db.prepare(
        'INSERT INTO photos (id, visit_id, file_path, thumbnail_path, created_at) VALUES (?, ?, ?, ?, ?)'
      )
      for (const photo of backup.photos ?? []) {
        const filename = `${photo.id}_${photo.filename || photo.file_path.split(/[\\/]/).pop() || 'photo'}`
        const restoredPath = join(photosDir, filename)
        if (photo.data) {
          writeFileSync(restoredPath, Buffer.from(photo.data, 'base64'))
        } else if (existsSync(photo.file_path)) {
          copyFileSync(photo.file_path, restoredPath)
        }
        photoStmt.run(
          photo.id,
          photo.visit_id,
          existsSync(restoredPath) ? restoredPath : photo.file_path,
          photo.thumbnail_path,
          photo.created_at
        )
      }

      const settingStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
      for (const setting of backup.settings ?? []) {
        settingStmt.run(setting.key, setting.value)
      }
    })

    restoreTx()
  },

  getAllPhotos: () => db.prepare('SELECT * FROM photos').all() as Photo[],

  getStats: () => {
    const totalCountries = (
      db
        .prepare(
          "SELECT COUNT(*) as c FROM countries WHERE status IN ('visited','resident','homeland')"
        )
        .get() as { c: number }
    ).c
    const totalCities = (db.prepare('SELECT COUNT(*) as c FROM cities').get() as { c: number }).c
    const totalDays = db
      .prepare(
        `
      SELECT SUM(
        CAST((julianday(COALESCE(date_to, date('now'))) - julianday(date_from)) AS INTEGER) + 1
      ) as d FROM visits WHERE date_from IS NOT NULL
    `
      )
      .get() as { d: number | null }
    const byStatus = db
      .prepare('SELECT status, COUNT(*) as count FROM countries GROUP BY status')
      .all() as { status: string; count: number }[]
    return { totalCountries, totalCities, totalDays: totalDays.d || 0, byStatus }
  }
}
