export type AppTheme = 'atlas' | 'dark'

export const DEFAULT_THEME: AppTheme = 'atlas'

export function normalizeThemeSetting(value: string | null | undefined): AppTheme {
  if (value === 'atlas' || value === 'dark') return value
  if (value === 'classic' || value === 'light') return 'atlas'
  return DEFAULT_THEME
}

export function applyTheme(theme: AppTheme): void {
  document.documentElement.setAttribute('data-theme', theme)
}
