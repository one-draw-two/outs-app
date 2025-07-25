import type { WithPSChange } from './app/composables/usePSUtils'
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
  FixtureRecord,
  SnapshotRecord,
} from './powersync/AppSchema'

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
export type _Fixture = FixtureRecord & WithPSChange

export type _RealFixture = RealFixtureRecord & WithPSChange
export type _RealTeam = RealTeamRecord & WithPSChange
export type _RealPlayer = RealPlayerRecord & WithPSChange
export type _RealEvent = RealEventRecord & WithPSChange

export type _Snapshot = SnapshotRecord & WithPSChange

export interface _P_RealFixture extends Omit<_RealFixture, '_homeTeam' | '_awayTeam'> {
  _homeTeam: _RealTeam | undefined
  _awayTeam: _RealTeam | undefined
  _events?: _RealEvent[]
}

export interface EnhancedRealFixture extends Partial<_RealFixture> {
  $index?: number
  $snapshotId: string
  $challenge: _P_Challenge
  $fixtureSlot?: FixtureSlot
  $aboveBetsBasedOnChallengeType?: number
  $correctBet?: any
  [key: string]: any
}

export interface FixtureSlot {
  _realFixture: string
  slotIndex: number
  totalPoints?: number
  pointsMatrix?: any[]
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

export interface _P_FixtureSlot extends Omit<FixtureSlot, '_realFixture'> {
  _realFixture: _P_RealFixture // Replace string with populated fixture
}

export interface _P_Challenge extends Omit<_Challenge, 'fixtureSlots'> {
  fixtureSlots: _P_FixtureSlot[]
}

export interface _P_Bet extends Omit<_Bet, 'betFixtureSlots'> {
  betFixtureSlots: BetFixtureSlot[]
}

export interface _P_Round extends _Round {
  challenges?: _P_Challenge[]
  snapshots?: {
    $realFixture?: EnhancedRealFixture | _P_RealFixture | null
    [key: string]: any
  }[]
  groups?: _P_Group[]
  userBets?: _P_Bet[]
}

export interface EnhancedRound extends _Round {
  challenges?: _P_Challenge[]
  snapshots?: Array<
    _Snapshot & {
      $realFixture?: EnhancedRealFixture | _P_RealFixture | null
      [key: string]: any
    }
  >
  userBets?: _P_Bet[]
  userFixtures?: _P_Group[]
  userStandings?: _P_Group[]
  userCursors?: Record<
    string,
    {
      _group: string
      _link: any
      betsAddedSnapshots?: Array<{
        _snapshot: string
        _bets?: _Bet[]
        [key: string]: any
      }>
      [key: string]: any
    }
  >
}

export interface _P_Group extends Omit<_Standing, 'rows'> {
  _link: any
  rows: Array<{
    _user: any
    [key: string]: any
  }>
  _parentGroup?: string | null
  [key: string]: any
}

export interface BPTournamentConfig {
  name: 'season' | 'stage' | 'round' | 'realFixture'
  order?: number
  options?: Record<string, any>
}

export interface DisplayGroupingOption {
  key: string
  label: string
}

interface ColumnDisplay {
  tid: string
  source: 'children' | 'own'
}

export interface ColumnDisplayConfig {
  tournamentIdGroups?: ColumnDisplay[]
  ungroupedTournamentIds?: {
    label: string
    columns: ColumnDisplay[]
  }
}

export interface GroupingConfig {
  enabled: boolean
  availableKeys: DisplayGroupingOption[]
  columnDisplay?: ColumnDisplayConfig
  metaRows?: {
    enabled: boolean
    rows: Array<{
      id: string
      name: string
      multiplier: number
    }>
    source: string
  }
}

export interface ColumnHighlightingRule {
  tournamentId: string
  color: string
}

export interface ColumnHighlightingConfig {
  enabled: boolean
  rules?: ColumnHighlightingRule[]
}

export interface DisplayConfig {
  grouping?: { [linkLevel: string]: GroupingConfig }
  columnHighlighting?: { [linkLevel: string]: ColumnHighlightingConfig }
  [configType: string]: { [linkLevel: string]: GroupingConfig | ColumnHighlightingConfig | any } | undefined
}

export interface ParsedBPTournament extends Omit<_BPTournamentRecord, 'scopeConfig' | 'snapshotConfig'> {
  scopeConfig: BPTournamentConfig[]
  snapshotConfig: BPTournamentConfig[]

  displayConfig?: DisplayConfig
}

// Update _P_Season to use the parsed tournament type
export interface _P_Season extends Omit<_Season, ''> {
  tournaments?: ParsedBPTournament[]
}

export interface _P_Stage extends Omit<_Stage, 'rounds' | 'groups'> {
  rounds: _Round[]
  groups: _P_Group[]
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
