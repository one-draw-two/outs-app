import type { _Round } from '~/types'

export const roundKey = Symbol('round') as InjectionKey<{
  round: Ref<_Round | null>
  isLoading: Ref<boolean>
}>
