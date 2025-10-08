export const useUiTheme = () => {
  const Preferences = usePreferences()
  const THEME_KEY = 'outs-theme'

  const initTheme = async () => {
    try {
      // Get theme from Preferences
      const { value } = await Preferences.get({ key: THEME_KEY })
      const theme = value || 'system'
      await setTheme(theme as 'system' | 'light' | 'dark')
    } catch (error) {
      console.error('Error initializing theme:', error)
      // Fallback to system theme
      await setTheme('system')
    }
  }

  const setTheme = async (theme: 'system' | 'light' | 'dark') => {
    try {
      // Remove existing theme
      document.documentElement.removeAttribute('data-theme')

      if (theme === 'system') {
        // Check system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light'))
      } else {
        // Set explicit theme
        document.documentElement.setAttribute('data-theme', theme)
      }

      // Store preference in Preferences
      if (theme === 'system') {
        await Preferences.remove({ key: THEME_KEY })
      } else {
        await Preferences.set({ key: THEME_KEY, value: theme })
      }
    } catch (error) {
      console.error('Error setting theme:', error)
    }
  }

  return {
    setTheme,
    initTheme,
  }
}
