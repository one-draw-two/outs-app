import type { User } from '~/../types'

export const useUserHelpers = () => {
  const user = useState<User>('user')
  const isCurrentUserRow = (row: any): boolean => user.value?.id === (typeof row._user === 'object' ? row._user.id : row._user)
  const isUserInGroup = (group: any): boolean => group.rows?.some(isCurrentUserRow) || false
  const getUserRow = (group: any) => group.rows?.find(isCurrentUserRow) || null
  const getOpponentRows = (group: any) => group.rows?.filter((row: any) => !isCurrentUserRow(row)) || []
  const getOpponentRow = (fixture: any) => getOpponentRows(fixture)?.[0] || null
  const getOpponentName = (fixture: any) => getOpponentRow(fixture)?._user?.name || 'Unknown'
  return { user: readonly(user), isCurrentUserRow, isUserInGroup, getUserRow, getOpponentRows, getOpponentRow, getOpponentName }
}
