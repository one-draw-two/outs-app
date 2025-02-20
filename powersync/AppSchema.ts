import { column, Schema, Table } from '@powersync/web'

const seasons = new Table(
  {
    name: column.text,
    status: column.text,
    bgUrl: column.text,
    _currentRound: column.text,
  },
  { indexes: {} }
)

const stages = new Table(
  {
    name: column.text,
    status: column.text,
    _season: column.text,
    sePI: column.integer,
  },
  { indexes: {} }
)

const rounds = new Table(
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

const challenges = new Table(
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

const real_fixtures = new Table(
  {
    name: column.text,
    status: column.text,
    _homeTeam: column.text,
    _awayTeam: column.text,
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

const subscriptions = new Table(
  {
    name: column.text,
    _user: column.text,
    _season: column.text,
  },
  { indexes: {} }
)

export const AppSchema = new Schema({
  seasons,
  stages,
  rounds,
  challenges,
  real_fixtures,
  real_teams,
  real_players,
  real_events,
  subscriptions,
})

export type Database = (typeof AppSchema)['types']

export type SeasonRecord = Database['seasons']
export type StageRecord = Database['stages']
export type RoundRecord = Database['rounds']

export type ChallengeRecord = Database['challenges']

export type RealFixtureRecord = Database['real_fixtures']
export type RealTeamRecord = Database['real_teams']
export type RealPlayerRecord = Database['real_players']
export type RealEventRecord = Database['real_events']

export type SubscriptionRecord = Database['subscriptions']
