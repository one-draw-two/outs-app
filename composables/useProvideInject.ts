import type { _Round, _P_Stage, _P_Challenge } from '~/types'

export const roundKey = Symbol('round') as InjectionKey<{
  round: Ref<_Round | null>
  isLoading: Ref<boolean>
}>

export const stageKey = Symbol('stage') as InjectionKey<{
  stage: Ref<_P_Stage | null>
  isLoading: Ref<boolean>
}>

export const challengeKey = Symbol('challenge') as InjectionKey<{
  challenge: Ref<_P_Challenge | null>
  isLoading: Ref<boolean>
}>
