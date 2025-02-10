import { column, Schema, Table } from '@powersync/web'

const rounds = new Table(
  {
    _id: column.text,
    name: column.text,
    _stage: column.text,
    _season: column.text,
  },
  { indexes: {} }
)

const stages = new Table(
  {
    _id: column.text,
    name: column.text,
    _season: column.text,
  },
  { indexes: {} }
)

const seasons = new Table(
  {
    _id: column.text,
    name: column.text,
    bgUrl: column.text,
    _currentRound: column.text,
  },
  { indexes: {} }
)

export const AppSchema = new Schema({
  rounds,
  stages,
  seasons,
})

export type Database = (typeof AppSchema)['types']

export type RoundRecord = Database['rounds']
export type StageRecord = Database['stages']
export type SeasonRecord = Database['seasons']
