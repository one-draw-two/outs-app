import { Preferences } from '@capacitor/preferences'
import type { AuthResponseSuccess } from '~/types'

const AUTH_KEY = 'outs-auth'

export const useAuthStorage = () => {
  const saveAuth = async (res: AuthResponseSuccess) => {
    try {
      await Preferences.set({
        key: AUTH_KEY,
        value: JSON.stringify(res.data), // Store only the data object
      })
    } catch (error) {
      console.error('Failed to save auth data:', error)
      throw error
    }
  }

  const getStoredAuth = async (): Promise<AuthResponseSuccess['data'] | null> => {
    try {
      const { value } = await Preferences.get({ key: AUTH_KEY })
      if (!value) return null

      return JSON.parse(value)
    } catch (error) {
      console.error('Failed to get stored auth data:', error)
      return null
    }
  }

  const clearAuth = async () => {
    try {
      await Preferences.remove({ key: AUTH_KEY })
    } catch (error) {
      console.error('Failed to clear auth data:', error)
      throw error
    }
  }

  return {
    saveAuth,
    getStoredAuth,
    clearAuth,
  }
}
