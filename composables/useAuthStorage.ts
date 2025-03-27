import { Preferences } from '@capacitor/preferences'
import { jwtDecode } from 'jwt-decode'
import type { AuthResponseSuccess } from '~/types'

const AUTH_KEY = 'outs-auth'

export const useAuthStorage = () => {
  const getTokenExpiration = (token: string): number => {
    try {
      return jwtDecode<{ exp: number }>(token).exp * 1000 // Convert to milliseconds
    } catch {
      return Date.now() + 24 * 60 * 60 * 1000 // If token can't be decoded, set default expiration to 24 hours
    }
  }

  const saveAuth = async (res: AuthResponseSuccess) => {
    try {
      const expiresAt = getTokenExpiration(res.data.accessToken)
      await Preferences.set({ key: AUTH_KEY, value: JSON.stringify({ ...res.data, expiresAt }) })
    } catch (error) {
      console.error('Failed to save auth data:', error)
      throw error
    }
  }

  const getStoredAuth = async (): Promise<AuthResponseSuccess['data'] | null> => {
    try {
      const { value } = await Preferences.get({ key: AUTH_KEY })
      if (!value) return null

      const stored = JSON.parse(value)

      if (stored.expiresAt && stored.expiresAt < Date.now()) {
        await clearAuth()
        return null
      }

      const { expiresAt, ...authData } = stored
      return authData
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
