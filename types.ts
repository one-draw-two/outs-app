import { Bson } from 'mongo'

interface Base {
  _id: Bson.ObjectId
  name: string
  status: string
  createdAt: Date
}

export interface User extends Base {
  auth0Id: string
  email: string
}

export interface Subscription extends Base {
  _user: Bson.ObjectId
  _season: Bson.ObjectId
}

export interface Season extends Base {
  _currentRound: Bson.ObjectId
  bgUrl: string
  stages?: string
}

export interface Stage extends Base {
  _season: Bson.ObjectId
  seasonPositionIndex: number
}

export interface Round extends Base {
  _season: Bson.ObjectId
  _stage: Bson.ObjectId
  seasonPositionIndex: number
  stagePositionIndex: number
  id: string // PS
}
