import type { WithPSChange } from '~/composables/usePSUtils'
import type { BetRecord, SeasonRecord, StageRecord, RoundRecord, ChallengeRecord, RealFixtureRecord, RealTeamRecord, RealPlayerRecord } from '~/powersync/AppSchema'

interface Base {
  id: string
  name: string
  status: string
  _createdAt: Date
}

// Base interface with change tracking
export interface BaseWithChange extends Base, WithPSChange {}

export interface User extends Base {
  email: string
}

export interface Subscription extends Base {
  _user: string
  _season: string
}

export interface Season extends Base {
  _currentRound: string
  bgUrl: string
  stages?: string
}

export interface Stage extends Base {
  _season: string
  sePI: number
}

export interface Round extends Base {
  _season: string
  _stage: string
  sePI: number
  stPI: number
  challenges?: any
}

export interface Stage_Populated extends Stage {
  rounds: Round[]
}

export interface Season_Populated extends Omit<Season, 'stages'> {
  stages: Stage_Populated[]
}

export interface Challenge extends Base {
  _round: string
  family: string
  type: string
  order: number
  fixtureSlots: string | FixtureSlot[]
  roundGoalCount: number | null
}

export interface FixtureSlot extends Base {
  _realFixture: string
  slotIndex: number
}

export interface RealFixture extends Base {
  _homeTeam: string
  _awayTeam: string
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

// UTIL

export interface AuthResponseSuccess {
  data: { user: User; powerSyncToken: string }
  success: boolean
}
