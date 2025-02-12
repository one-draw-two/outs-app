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

const subscriptions = new Table(
  {
    _createdAt: column.text,
    _season: column.text,
    _user: column.text,
    name: column.text,
    status: column.text,
  },
  { indexes: {} }
)

export const AppSchema = new Schema({
  seasons,
  stages,
  rounds,
  // subscriptions,
})

export type Database = (typeof AppSchema)['types']

export type SeasonRecord = Database['seasons']
export type StageRecord = Database['stages']
export type RoundRecord = Database['rounds']

// export type SubscriptionRecord = Database['subscriptions']
