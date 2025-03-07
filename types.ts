import type { WithPSChange } from '~/composables/usePSUtils'
import type { BetRecord, SeasonRecord, StageRecord, RoundRecord, ChallengeRecord, RealFixtureRecord, RealTeamRecord, RealPlayerRecord, RealEventRecord } from '~/powersync/AppSchema'

interface Base {
  id: string
  name: string
  status: string
}

// Base interface with change tracking
export interface BaseWithChange extends Base, WithPSChange {}

// Non PS types
export interface User extends Base {
  email: string
}

// Export combined types for all records
export type _Bet = BetRecord & WithPSChange
export type _Season = SeasonRecord & WithPSChange
export type _Stage = StageRecord & WithPSChange
export type _Round = RoundRecord & WithPSChange
export type _Challenge = ChallengeRecord & WithPSChange
export type _RealFixture = RealFixtureRecord & WithPSChange
export type _RealTeam = RealTeamRecord & WithPSChange
export type _RealPlayer = RealPlayerRecord & WithPSChange
export type _RealEvent = RealEventRecord & WithPSChange

export interface _P_RealFixture extends Omit<_RealFixture, '_homeTeam' | '_awayTeam'> {
  _homeTeam: _RealTeam | undefined
  _awayTeam: _RealTeam | undefined
  _events?: _RealEvent[]
}

export interface _P_Challenge extends Omit<_Challenge, 'fixtureSlots'> {
  fixtureSlots: {
    _realFixture: _P_RealFixture
    slotIndex: number
  }[]
}

export interface _P_Bet extends Omit<_Bet, 'betFixtureSlots'> {
  betFixtureSlots: {
    _realFixture: string
    slotIndex: number
    bet?: string
  }[]
}

// UTIL

export type AuthResponseError = {
  success: false
  message: string
  error?: string
}

export type AuthResponseSuccess = {
  success: true
  data: {
    user: User
    accessToken: string
    powerSyncToken: string
  }
}

export type AuthResponse = AuthResponseSuccess | AuthResponseError
