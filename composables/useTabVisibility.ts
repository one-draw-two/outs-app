import type { User } from '~/types'

export default function () {
  const visibilityFunc = () => {
    if (document.visibilityState == 'visible') {
      console.log('VisibilityChange: Tab is active, init dynamicPS')
      useState<any>('powerSyncParams').value = { ...useState<any>('powerSyncParams').value }
    } else {
      console.log('VisibilityChange: Tab is inactive')
    }
  }

  watch(
    () => useState<User>('user').value,
    (to) => document?.[to ? 'addEventListener' : 'removeEventListener']('visibilitychange', visibilityFunc, false),
    { immediate: true }
  )
}
