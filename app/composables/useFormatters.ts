export const getRoundStatusColor = (r: any) => {
  if (r?.status === 'current-published') return 'orange'
  if (r?.status === 'current-points-getting-calculated') return 'yellow'
  if (r?.status === 'current-points-calculated') return 'teal'
  if (r?.status === 'current-live') return 'green'
  if (r?.status === 'completed') return 'blue'
  else return 'gray'
}
