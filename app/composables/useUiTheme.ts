import type { User } from '~/../types'

export const useUiTheme = () => {
  const setTheme = (theme: 'system' | 'light' | 'dark') => {
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

    // Store preference
    if (theme === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.theme = theme
    }
  }

  // Initialize theme on page load
  onMounted(() => {
    const theme = localStorage.theme || 'system'
    setTheme(theme)
  })

  return {
    setTheme,
  }
}
