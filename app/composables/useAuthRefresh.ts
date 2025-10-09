import type { AuthResponse } from '~/../types'

export default async function (): Promise<AuthResponse> {
  try {
    const authStorage = useAuthStorage()
    const storedRefreshToken = await authStorage.getRefreshToken()

    if (!storedRefreshToken) return { success: false, message: 'No refresh token available' }

    return await useSecureFetch('refresh', 'auth', 'post', { refreshToken: storedRefreshToken })
  } catch (error) {
    console.error('Auth refresh error:', error)
    return { success: false, message: 'Authentication refresh failed' }
  }
}
