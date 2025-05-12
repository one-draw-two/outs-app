import { column, Schema, Table } from '@powersync/web'

const account_users = new Table(
  {
    name: column.text,
    status: column.text,
  },
  { indexes: {} }
)

const account_subscriptions = new Table(
  {
    status: column.text,
    _user: column.text,
    _season: column.text,
    _updatedAt: column.text,
  },
  { indexes: {} }
)

const blueprint_seasons = new Table(
  {
    name: column.text,
    shortName: column.text,
    status: column.text,
    bgUrl: column.text,
  },
  { indexes: {} }
)

const blueprint_domains = new Table(
  {
    name: column.text,
    challenges: column.text,
    tournaments: column.text,
  },
  { indexes: {} }
)

const blueprint_tournaments = new Table(
  {
    name: column.text,
    color: column.text,
    scopeConfig: column.text,
    snapshotConfig: column.text,
  },
  { indexes: {} }
)

const calendar_seasons = new Table(
  {
    name: column.text,
    status: column.text,
    _bpSeason: column.text,
    _bpDomain: column.text,
    _currentRound: column.text,
    bgUrl: column.text,
  },
  { indexes: {} }
)

const calendar_stages = new Table(
  {
    name: column.text,
    status: column.text,
    color: column.text,
    _season: column.text,
    sePI: column.integer,
  },
  { indexes: {} }
)

const calendar_rounds = new Table(
  {
    name: column.text,
    status: column.text,
    _season: column.text,
    _stage: column.text,
    sePI: column.integer,
    stPI: column.integer,
    _h_roundDeadline: column.text,
    _h_lastFinishedMatchIndex: column.integer,
  },
  { indexes: {} }
)

const entry_challenges = new Table(
  {
    name: column.text,
    status: column.text,
    _round: column.text,
    family: column.text,
    type: column.text,
    order: column.integer,
    fixtureSlots: column.text,
    roundGoalCount: column.text,
  },
  { indexes: {} }
)

const entry_bets = new Table(
  {
    _user: column.text,
    _round: column.text,
    _challenge: column.text,
    isValid: column.text,
    betFixtureSlots: column.text,
  },
  { indexes: {} }
)

const group_tables = new Table(
  {
    _link: column.text,
    _season: column.text,
    _tournament: column.text,
    order: column.integer,
    scope: column.text,
    name: column.text,
    status: column.text,
    meta: column.text,
    rows: column.text,
    _parentGroup: column.text,
  },
  { indexes: {} }
)

const group_snapshots = new Table(
  {
    _season: column.text,
    _stage: column.text,
    _round: column.text,
    _realFixture: column.text,
    _realEvent: column.text,
    pointer: column.text,
    order: column.integer,
    _ref: column.text,
  },
  { indexes: {} }
)

const real_fixtures = new Table(
  {
    name: column.text,
    status: column.text,
    _homeTeam: column.text,
    _awayTeam: column.text,
    result: column.text,
    startingAt: column.text,
    liveMinute: column.text,
  },
  { indexes: {} }
)

const real_teams = new Table(
  {
    name: column.text,
    shortCode: column.text,
  },
  { indexes: {} }
)

const real_players = new Table(
  {
    name: column.text,
    age: column.integer,
    nationality: column.text,
    _team: column.text,
  },
  { indexes: {} }
)

const real_events = new Table(
  {
    _realFixture: column.text,
    _team: column.text,
    _player: column.text,
    _assist: column.text,
    type: column.text,
    detail: column.text,
    comments: column.text,
    time: column.integer,
    timeExtra: column.integer,
  },
  { indexes: {} }
)

export const AppSchema = new Schema({
  //
  account_users,
  account_subscriptions,
  //
  blueprint_seasons,
  blueprint_domains,
  blueprint_tournaments,
  //
  calendar_seasons,
  calendar_stages,
  calendar_rounds,
  //
  entry_challenges,
  entry_bets,
  //
  group_tables,
  group_snapshots,
  //
  real_fixtures,
  real_teams,
  real_players,
  real_events,
})

export type Database = (typeof AppSchema)['types']

export type UserRecord = Database['account_users']
export type SubscriptionRecord = Database['account_subscriptions']

export type BPSeasonRecord = Database['blueprint_seasons']
export type BPDomainRecord = Database['blueprint_domains']
export type BPTournamentRecord = Database['blueprint_tournaments']

export type SeasonRecord = Database['calendar_seasons']
export type StageRecord = Database['calendar_stages']
export type RoundRecord = Database['calendar_rounds']

export type ChallengeRecord = Database['entry_challenges']
export type BetRecord = Database['entry_bets']

export type TableRecord = Database['group_tables']
export type SnapshotRecord = Database['group_snapshots']

export type RealFixtureRecord = Database['real_fixtures']
export type RealTeamRecord = Database['real_teams']
export type RealPlayerRecord = Database['real_players']
export type RealEventRecord = Database['real_events']
