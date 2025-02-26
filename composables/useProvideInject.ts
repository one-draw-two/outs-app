import type { _Round, _Challenge } from '~/types'

export const roundKey = Symbol('round') as InjectionKey<{
  round: Ref<_Round | null>
  isLoading: Ref<boolean>
}>

export const challengeKey = Symbol('challenge') as InjectionKey<{
  challenge: Ref<_Challenge | null>
  isLoading: Ref<boolean>
}>
