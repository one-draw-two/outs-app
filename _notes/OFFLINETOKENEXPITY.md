# Offline Token Expiry

- At the moment, the offline storage (enabled by @capacitor/preferences) are not expiring. This behaviour might be desired or not in the future.
- But later if you want to set an expiration data from the access-token, you can use the 'jwt-token' package shown as below:
- We use JWT token expiration time to manage offline authentication storage lifetime. The implementation:

1. Extracts expiration time from JWT access token
2. Falls back to 24-hour expiration if token can't be decoded
3. Automatically clears expired tokens on app startup
4. Uses Capacitor Preferences API for cross-platform storage

## Key Components

- `@capacitor/preferences` for secure cross-platform storage
- `jwt-decode` for extracting token expiration
- Automatic token cleanup on expired authentication

## Code Implementation

Check the `useAuthStorage` composable for the implementation details.

## Apple Privacy Requirements

Remember that using Preferences API requires privacy manifest in iOS:
- File: `/ios/App/App/PrivacyInfo.xcprivacy`
- Required by: May 1st, 2024

```
import { Preferences } from '@capacitor/preferences'
import jwtDecode from 'jwt-decode'
import type { AuthResponseSuccess } from '~/types'

const AUTH_KEY = 'outs-auth'

export const useAuthStorage = () => {
  const getTokenExpiration = (token: string): number => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      return decoded.exp * 1000 // Convert to milliseconds
    } catch {
      // If token can't be decoded, set default expiration to 24 hours
      return Date.now() + (24 * 60 * 60 * 1000)
    }
  }

  const saveAuth = async (res: AuthResponseSuccess) => {
    try {
      const expiresAt = getTokenExpiration(res.data.accessToken)
      await Preferences.set({
        key: AUTH_KEY,
        value: JSON.stringify({
          ...res.data,
          expiresAt
        })
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

      const stored = JSON.parse(value)
      
      // Check if token is expired
      if (stored.expiresAt && stored.expiresAt < Date.now()) {
        await clearAuth()
        return null
      }

      // Remove expiresAt before returning
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
```