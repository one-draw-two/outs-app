interface Base {
  id: string
  name: string
  status: string
  _createdAt: Date
}

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

// UTIL

export interface AuthResponseSuccess {
  data: { user: User; powerSyncToken: string }
  success: boolean
}
