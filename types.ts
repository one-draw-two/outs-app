import type { WithPSChange } from '~/composables/usePSUtils'
import type {
  BPSeasonRecord,
  BPDomainRecord,
  BPTournamentRecord,
  BetRecord,
  SeasonRecord,
  StageRecord,
  RoundRecord,
  ChallengeRecord,
  RealFixtureRecord,
  RealTeamRecord,
  RealPlayerRecord,
  RealEventRecord,
  StandingRecord,
} from '~/powersync/AppSchema'

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

export type _BPSeasonRecord = BPSeasonRecord & WithPSChange
export type _BPDomainRecord = BPDomainRecord & WithPSChange
export type _BPTournamentRecord = BPTournamentRecord & WithPSChange

export type _Bet = BetRecord & WithPSChange
export type _Season = SeasonRecord & WithPSChange
export type _Stage = StageRecord & WithPSChange
export type _Round = RoundRecord & WithPSChange
export type _Challenge = ChallengeRecord & WithPSChange

export type _Standing = StandingRecord & WithPSChange

export type _RealFixture = RealFixtureRecord & WithPSChange
export type _RealTeam = RealTeamRecord & WithPSChange
export type _RealPlayer = RealPlayerRecord & WithPSChange
export type _RealEvent = RealEventRecord & WithPSChange

export interface _P_RealFixture extends Omit<_RealFixture, '_homeTeam' | '_awayTeam'> {
  _homeTeam: _RealTeam | undefined
  _awayTeam: _RealTeam | undefined
  _events?: _RealEvent[]
}

// Add these type definitions for fixture slots
export interface FixtureSlot {
  _realFixture: string
  slotIndex: number
  totalPoints?: number
  pointsMatrix?: any[]
  isBetPointsDistributedOnce?: number
  [key: string]: any
}

export interface BetFixtureSlot {
  _realFixture?: string
  slotIndex: number
  bet?: string
  potentialPoints?: number[]
  correctPointIndex?: number
  [key: string]: any
}

// Update your existing _P_Challenge interface
export interface _P_Challenge extends Omit<_Challenge, 'fixtureSlots'> {
  fixtureSlots: FixtureSlot[]
}

// Update your _P_Bet interface
export interface _P_Bet extends Omit<_Bet, 'betFixtureSlots'> {
  betFixtureSlots: BetFixtureSlot[]
}

// Add a type for the enhanced challenges with user bets
export interface EnhancedChallenge extends _Challenge {
  $userBet?: BetFixtureSlot
  $points?: number[] | null
  [key: string]: any
}

// export interface _P_Round extends Omit<_Round, '_stage'> {
export interface _P_Round extends _Round {
  // _stage: _Stage | null
  challenges?: _P_Challenge[]
  snapshots?: {
    _realFixture?: EnhancedRealFixture | null
    [key: string]: any
  }[]
  groups?: _P_Standing[]
  userBets?: _P_Bet[]
}

export interface _P_Standing extends Omit<_Standing, 'rows'> {
  _link: any
  rows: Array<{
    _user: any
    [key: string]: any
  }>
  _parentGroup?: string | null
  [key: string]: any
}

export interface BPTournamentConfig {
  name: 'season' | 'stage' | 'round' | 'real-fixture'
  order?: number
  options?: Record<string, any>
}

export interface ParsedBPTournament extends Omit<_BPTournamentRecord, 'scopeConfig' | 'snapshotConfig'> {
  scopeConfig: BPTournamentConfig[]
  snapshotConfig: BPTournamentConfig[]
}

// Update _P_Season to use the parsed tournament type
export interface _P_Season extends Omit<_Season, ''> {
  tournaments?: ParsedBPTournament[]
}

export interface _P_Stage extends Omit<_Stage, 'rounds' | 'groups'> {
  rounds: _Round[]
  groups: _P_Standing[]
}

// Also ensure your EnhancedRealFixture allows for nullability
export interface EnhancedRealFixture extends Partial<_RealFixture> {
  $index?: number
  $challenges?: EnhancedChallenge[]
  [key: string]: any
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
    refreshToken: string
    powerSyncToken: string
  }
}

export type AuthResponse = AuthResponseSuccess | AuthResponseError
