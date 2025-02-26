import type { WithPSChange } from '~/composables/usePSUtils'
import type { BetRecord, SeasonRecord, StageRecord, RoundRecord, ChallengeRecord, RealFixtureRecord, RealTeamRecord, RealPlayerRecord } from '~/powersync/AppSchema'

interface Base {
  id: string
  name: string
  status: string
}

// Components

interface FixtureSlot {
  _realFixture: _RealFixture
  slotIndex: number
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

export interface _P_Challenge extends Omit<_Challenge, 'fixtureSlots'> {
  fixtureSlots: FixtureSlot[]
}

// UTIL
export interface AuthResponseSuccess {
  data: { user: User; powerSyncToken: string }
  success: boolean
}
