import type { _P_Season, _P_Stage, _P_Round, _P_Challenge, _P_Group, ParsedBPTournament } from '~/types'

/*
export const seasonKey = Symbol('season') as InjectionKey<{
  season: Ref<_P_Season | null>
  isLoading: Ref<boolean>
}>

export const stageKey = Symbol('stage') as InjectionKey<{
  stage: Ref<_P_Stage | null>
  isLoading: Ref<boolean>
}>
*/

/*
export const roundKey = Symbol('round') as InjectionKey<{
  round: Ref<_P_Round | null>
  tournamentCols: Ref<any[]>
  isLoading?: Ref<boolean>
}>

export const groupKey = Symbol('group') as InjectionKey<{
  standings: Ref<_P_Group | null>
  tournament: Ref<any>
  isLoading?: Ref<boolean>
}>
*/

export const challengeKey = Symbol('challenge') as InjectionKey<{
  challenge: Ref<_P_Challenge | null>
  isLoading?: Ref<boolean>
}>
