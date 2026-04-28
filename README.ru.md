<p align="center">
  <img src="docs/assets/atlas-travel-logo.png" alt="Логотип Atlas Travel" width="700">
</p>

# Atlas Travel

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.ru.md">Русский</a>
</p>

![Electron](https://img.shields.io/badge/Electron-39-47848F?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=20232A)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white)
![D3](https://img.shields.io/badge/D3.js-7-F9A03C?logo=d3&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-7CB342)

Atlas Travel — десктопное приложение для отслеживания посещенных стран, городов, поездок, заметок, фотографий и travel-целей. Данные хранятся локально, карта сделана в чистом стиле с границами без лишних деталей, аккаунт и облачная синхронизация не требуются.

Автор: Artem Silenko.

## Возможности

- Отмечать страны статусами homeland, resident, visited или wishlist.
- Добавлять города на карту по географическим координатам.
- Хранить поездки с датами, заметками, фотографиями и тегами.
- Смотреть статистику по континентам, странам и таймлайну поездок.
- Экспортировать карту в PNG для публикации или портфолио.
- Переключать интерфейс между английским, немецким, русским и украинским языками.
- Использовать локальную SQLite-базу через Electron main process.

## Стек

| Слой | Технологии |
| --- | --- |
| Desktop | Electron, electron-vite |
| UI | React 19, TypeScript |
| Карта | D3, TopoJSON, world-atlas, us-atlas |
| Хранение | SQLite, better-sqlite3 |
| Состояние | Zustand |
| i18n | i18next, react-i18next |

## Требования

- Node.js 22 или новее
- npm
- Windows, macOS или Linux

`better-sqlite3` — нативная зависимость. Если после смены версии Electron нативные модули перестали совпадать, выполните:

```bash
npx electron-builder install-app-deps
```

## Запуск

```bash
npm install
npm run dev
```

## Скрипты

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Запуск Electron-приложения в режиме разработки |
| `npm run start` | Предпросмотр собранного приложения |
| `npm run typecheck` | Проверка TypeScript для main/preload и renderer |
| `npm run lint` | Запуск ESLint |
| `npm run format` | Форматирование через Prettier |
| `npm run build` | Typecheck и сборка приложения |
| `npm run build:win` | Сборка пакета для Windows |
| `npm run build:mac` | Сборка пакета для macOS |
| `npm run build:linux` | Сборка пакета для Linux |

## Структура проекта

```text
src/
  main/
    database.ts       SQLite-схема и запросы
    index.ts          Electron main process
    ipc.ts            IPC handlers
  preload/
    index.ts          Context bridge API
  renderer/src/
    components/       React-компоненты интерфейса
    hooks/            Хуки renderer-части
    i18n/             Локализованные строки
    store/            Zustand store
    types/            Общие TypeScript-типы
    utils/            Утилиты для карты, стран, городов и достижений
```

## Хранение данных

Atlas Travel хранит данные локально в директории Electron user data. Приложение не создает аккаунты, не загружает travel-данные на сервер и не синхронизируется с облаком по умолчанию.

SQLite-схема включает:

```sql
countries   (id, iso_code, status, created_at)
cities      (id, country_iso, name, lat, lng, created_at)
visits      (id, place_type, place_id, date_from, date_to, notes, created_at)
photos      (id, visit_id, file_path, thumbnail_path, created_at)
tags        (id, name)
visit_tags  (visit_id, tag_id)
settings    (key, value)
```

## Проверки

Перед публикацией изменений выполните:

```bash
npm run typecheck
npm run lint
```

## Примечания к репозиторию

- Результаты сборки игнорируются: `dist/`, `out/` и `node_modules/`.
- Инкрементальные файлы TypeScript игнорируются через `*.tsbuildinfo`.
- Бинарные ассеты, включая иконки, изображения, звуки и app-пакеты, отмечены как binary в `.gitattributes`.

## Лицензия

Проект распространяется по лицензии MIT. См. [LICENSE.md](LICENSE.md).
