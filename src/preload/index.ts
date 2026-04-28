import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  countries: {
    getAll: () => ipcRenderer.invoke('countries:getAll'),
    get: (iso: string) => ipcRenderer.invoke('countries:get', iso),
    upsert: (iso: string, status: string) => ipcRenderer.invoke('countries:upsert', iso, status),
    remove: (iso: string) => ipcRenderer.invoke('countries:remove', iso)
  },
  cities: {
    getAll: () => ipcRenderer.invoke('cities:getAll'),
    getByCountry: (countryIso: string) => ipcRenderer.invoke('cities:getByCountry', countryIso),
    localizeAll: (language: string) => ipcRenderer.invoke('cities:localizeAll', language),
    search: (countryIso: string, query: string, language: string) =>
      ipcRenderer.invoke('cities:search', countryIso, query, language),
    add: (countryIso: string, name: string, lat: number, lng: number) =>
      ipcRenderer.invoke('cities:add', countryIso, name, lat, lng),
    remove: (id: number) => ipcRenderer.invoke('cities:remove', id)
  },
  visits: {
    get: (placeType: string, placeId: string) =>
      ipcRenderer.invoke('visits:get', placeType, placeId),
    getTimeline: () => ipcRenderer.invoke('visits:getTimeline'),
    add: (
      placeType: string,
      placeId: string,
      dateFrom: string | null,
      dateTo: string | null,
      notes: string | null
    ) => ipcRenderer.invoke('visits:add', placeType, placeId, dateFrom, dateTo, notes),
    update: (id: number, dateFrom: string | null, dateTo: string | null, notes: string | null) =>
      ipcRenderer.invoke('visits:update', id, dateFrom, dateTo, notes),
    delete: (id: number) => ipcRenderer.invoke('visits:delete', id)
  },
  photos: {
    get: (visitId: number) => ipcRenderer.invoke('photos:get', visitId),
    getDataUrl: (filePath: string) => ipcRenderer.invoke('photos:getDataUrl', filePath),
    add: (visitId: number) => ipcRenderer.invoke('photos:add', visitId),
    delete: (id: number) => ipcRenderer.invoke('photos:delete', id)
  },
  tags: {
    getAll: () => ipcRenderer.invoke('tags:getAll'),
    create: (name: string) => ipcRenderer.invoke('tags:create', name),
    getForVisit: (visitId: number) => ipcRenderer.invoke('tags:getForVisit', visitId),
    addToVisit: (visitId: number, tagId: number) =>
      ipcRenderer.invoke('tags:addToVisit', visitId, tagId),
    removeFromVisit: (visitId: number, tagId: number) =>
      ipcRenderer.invoke('tags:removeFromVisit', visitId, tagId)
  },
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: string) => ipcRenderer.invoke('settings:set', key, value)
  },
  app: {
    resetTravelData: () => ipcRenderer.invoke('app:resetTravelData'),
    exportBackup: () => ipcRenderer.invoke('app:exportBackup'),
    importBackup: () => ipcRenderer.invoke('app:importBackup')
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized')
  },
  stats: {
    get: () => ipcRenderer.invoke('stats:get')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
