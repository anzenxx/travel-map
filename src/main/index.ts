import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { initDatabase, queries } from './database'
import { registerIpcHandlers } from './ipc'

function getWindowBackgroundColor(theme: string | undefined): string {
  return theme === 'dark' ? '#0B1419' : '#F3EBDD'
}

function createWindow(): void {
  const savedTheme = queries.getSetting('theme')
  const mainWindow = new BrowserWindow({
    title: 'Atlas Travel',
    icon: join(app.getAppPath(), 'build', 'icon.png'),
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: getWindowBackgroundColor(savedTheme),
    autoHideMenuBar: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.atlastravel.app')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))
  initDatabase()
  registerIpcHandlers(ipcMain)
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
