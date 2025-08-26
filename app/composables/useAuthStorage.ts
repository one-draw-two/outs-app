import { Preferences } from '@capacitor/preferences'
import { jwtDecode } from 'jwt-decode'
import type { AuthResponseSuccess } from '~/../types'

const AUTH_KEY = 'outs-auth'
const REFRESH_KEY = 'outs-refresh'

export const useAuthStorage = () => {
  const getTokenExpiration = (token: string): number => {
    try {
      return jwtDecode<{ exp: number }>(token).exp * 1000 // Convert to milliseconds
    } catch {
      return Date.now() + 24 * 60 * 60 * 1000 // If token can't be decoded, set default expiration to 24 hours
    }
  }

  const saveAuthAndRefreshToken = async (res: AuthResponseSuccess) => {
    try {
      const expiresAt = getTokenExpiration(res.data.accessToken)
      const { refreshToken, ...authDataWithoutRefresh } = res.data // Remove refreshToken from authData
      await Preferences.set({ key: AUTH_KEY, value: JSON.stringify({ ...authDataWithoutRefresh, expiresAt }) })
      await Preferences.set({ key: REFRESH_KEY, value: refreshToken })
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

  const getRefreshToken = async (): Promise<string | null> => {
    try {
      const { value } = await Preferences.get({ key: REFRESH_KEY })

      return value || null
    } catch (error) {
      console.error('Failed to get refresh token:', error)
      return null
    }
  }

  const updateStoredAuth = async (updateFn: (data: AuthResponseSuccess['data']) => void) => {
    try {
      const stored = await getStoredAuth()
      const refreshToken = await getRefreshToken()

      if (stored && refreshToken) {
        updateFn(stored)

        await saveAuthAndRefreshToken({
          success: true,
          data: {
            ...stored,
            refreshToken, // Dont forget to add the other components of stored auth here!
          },
        })
      }
    } catch (error) {
      console.error('Failed to update stored auth:', error)
    }
  }

  const clearAuth = async () => await Preferences.remove({ key: AUTH_KEY })
  const clearRefresh = async () => await Preferences.remove({ key: REFRESH_KEY })

  return {
    saveAuthAndRefreshToken,
    clearAuth,
    clearRefresh,
    getStoredAuth,
    getRefreshToken,
    updateStoredAuth,
  }
}
