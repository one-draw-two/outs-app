import type { ParsedBPTournament } from '~/types'

export const getOrder = (t: ParsedBPTournament, key: string) => t.snapshotConfig?.find((c) => c.name === key)?.order || 0

export const enhanceFixturesWithUserData = (fixtures: any[], currentUserId?: string) => {
  if (!currentUserId || !fixtures?.length) return fixtures

  return fixtures.map((fixture) => {
    const enhancedFixture = { ...fixture }

    if (fixture.rows?.length > 0) {
      // Find the row that belongs to the current user
      const userRowIndex = fixture.rows.findIndex((row: any) => {
        const rowUserId = typeof row._user === 'object' ? row._user.id : row._user
        return rowUserId === currentUserId
      })

      if (userRowIndex !== -1) {
        // User is in this fixture
        enhancedFixture.userRow = fixture.rows[userRowIndex]

        // Find the first non-user row as the opponent (for 1v1 fixtures)
        const opponentRows = fixture.rows.filter((_: any, i: number) => i !== userRowIndex)
        enhancedFixture.oppoRow = opponentRows.length > 0 ? opponentRows[0] : null
      } else {
        // User not in this fixture
        enhancedFixture.userRow = null
        enhancedFixture.oppoRow = fixture.rows[0]
      }
    } else {
      // No rows in fixture
      enhancedFixture.userRow = null
      enhancedFixture.oppoRow = null
    }

    return enhancedFixture
  })
}
