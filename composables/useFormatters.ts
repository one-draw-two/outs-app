import type { ParsedBPTournament } from '~/types'

export const getOrder = (t: ParsedBPTournament, key: string) => t.snapshotConfig?.find((c) => c.name === key)?.order || 0
