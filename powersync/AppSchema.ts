import { column, Schema, Table } from '@powersync/web'

const account_subscriptions = new Table(
  {
    status: column.text,
    _user: column.text,
    _season: column.text,
  },
  { indexes: {} }
)

const blueprint_seasons = new Table(
  {
    name: column.text,
    status: column.text,
    bgUrl: column.text,
  },
  { indexes: {} }
)

const calendar_seasons = new Table(
  {
    name: column.text,
    status: column.text,
    _bpSeason: column.text,
    _currentRound: column.text,
  },
  { indexes: {} }
)

const calendar_stages = new Table(
  {
    name: column.text,
    status: column.text,
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
  },
  { indexes: {} }
)

const game_challenges = new Table(
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

const game_bets = new Table(
  {
    _user: column.text,
    _round: column.text,
    _challenge: column.text,
    isValid: column.text,
    betFixtureSlots: column.text,
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
  account_subscriptions,
  blueprint_seasons,
  calendar_seasons,
  calendar_stages,
  calendar_rounds,
  game_challenges,
  game_bets,
  real_fixtures,
  real_teams,
  real_players,
  real_events,
})

export type Database = (typeof AppSchema)['types']

export type SubscriptionRecord = Database['account_subscriptions']

export type BPSeasonRecord = Database['blueprint_seasons']

export type SeasonRecord = Database['calendar_seasons']
export type StageRecord = Database['calendar_stages']
export type RoundRecord = Database['calendar_rounds']

export type ChallengeRecord = Database['game_challenges']
export type BetRecord = Database['game_bets']

export type RealFixtureRecord = Database['real_fixtures']
export type RealTeamRecord = Database['real_teams']
export type RealPlayerRecord = Database['real_players']
export type RealEventRecord = Database['real_events']
