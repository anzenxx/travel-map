# Atlas Travel

Atlas Travel is a desktop app for tracking visited countries, cities, trips, notes, photos, and travel goals. It keeps data locally, uses a clean border-only map, and does not require an account or cloud sync.

## Features

- Mark countries as homeland, resident, visited, or wishlist.
- Add cities to the map with geographic coordinates.
- Store visits with date ranges, notes, photos, and tags.
- Track progress with continent stats, country totals, and travel timelines.
- Export a share-ready PNG map.
- Switch between English, German, Russian, and Ukrainian.
- Use a local SQLite database through the Electron main process.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Desktop | Electron, electron-vite |
| UI | React 19, TypeScript |
| Map | D3, TopoJSON, world-atlas, us-atlas |
| Storage | SQLite, better-sqlite3 |
| State | Zustand |
| i18n | i18next, react-i18next |

## Requirements

- Node.js 22 or newer
- npm
- Windows, macOS, or Linux

`better-sqlite3` is a native dependency. If native modules get out of sync after changing Electron versions, run:

```bash
npx electron-builder install-app-deps
```

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Electron app in development mode |
| `npm run start` | Preview the built app |
| `npm run typecheck` | Run TypeScript checks for main/preload and renderer code |
| `npm run lint` | Run ESLint |
| `npm run format` | Format files with Prettier |
| `npm run build` | Typecheck and build the app |
| `npm run build:win` | Build a Windows package |
| `npm run build:mac` | Build a macOS package |
| `npm run build:linux` | Build a Linux package |

## Project Structure

```text
src/
  main/
    database.ts       SQLite schema and queries
    index.ts          Electron main process
    ipc.ts            IPC handlers
  preload/
    index.ts          Context bridge API
  renderer/src/
    components/       React UI components
    hooks/            Renderer hooks
    i18n/             Localized strings
    store/            Zustand store
    types/            Shared TypeScript types
    utils/            Map, country, city, and achievement helpers
```

## Data Storage

Atlas Travel stores app data locally in the Electron user data directory. It does not create accounts, upload travel data, or sync with a remote service by default.

The SQLite schema includes:

```sql
countries   (id, iso_code, status, created_at)
cities      (id, country_iso, name, lat, lng, created_at)
visits      (id, place_type, place_id, date_from, date_to, notes, created_at)
photos      (id, visit_id, file_path, thumbnail_path, created_at)
tags        (id, name)
visit_tags  (visit_id, tag_id)
settings    (key, value)
```

## Checks

Before publishing changes, run:

```bash
npm run typecheck
npm run lint
```

## Repository Notes

- Build outputs are ignored: `dist/`, `out/`, and `node_modules/`.
- TypeScript incremental build files are ignored with `*.tsbuildinfo`.
- Binary assets such as icons, screenshots, sounds, and app packages are marked as binary in `.gitattributes`.

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md).
