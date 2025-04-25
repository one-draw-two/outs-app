export default function (params: any) {
  const { $capacitor } = useNuxtApp()

  const startTokenQueue: Array<{ token: string; activityType: string; instanceId?: string }> = []
  let isProcessingQueue = false
  const getLiveActivityPayload = (token: string, activityType: string, instanceId?: string) => ({
    token,
    fcmToken: useState<String>('fcmToken').value,
    activityType,
    instanceId,
    platform: $capacitor.$platform,
  })

  if ($capacitor.$platform !== 'web') {
    $capacitor.$pushNotifications.requestPermissions().then(async (result: any) => {
      if (result.receive !== 'granted') console.log('Push notifications permission denied')

      await $capacitor.$pushNotifications.register()

      const fcmToken = await $capacitor.$fcm.getToken()
      if (fcmToken) {
        console.log('FCM Token:', fcmToken)
        useState<String>('fcmToken').value = fcmToken.token
        await useSecureFetch('push-token-notification', 'auth', 'post', { token: fcmToken.token, platform: $capacitor.$platform }) // I need to make sure this gets called event when app is closed on my device
      }

      await $capacitor.$liveActivities.startLiveActivity()
    })

    $capacitor.$liveActivities.addListener('StartTokenReceived', async (data: any) => {
      console.log('LA: Start token received:', data.token.substring(0, 15) + '...')
      // startTokenQueue.push({ token: data.token, activityType: data.activityType, instanceId: data.instanceId })
      // if (!isProcessingQueue) processStartTokenQueue()
      await useSecureFetch('push-token-liveactivity-start', 'auth', 'post', getLiveActivityPayload(data.token, data.activityType, data.instanceId)) // I need to make sure this gets called event when app is closed on my device
    })

    $capacitor.$liveActivities.addListener('UpdateTokenReceived', async (data: any) => {
      console.log('LA: Update token received:', data.token.substring(0, 15) + '...')
      await useSecureFetch('push-token-liveactivity-updateend', 'auth', 'post', getLiveActivityPayload(data.token, data.activityType, data.instanceId)) // I need to make sure this gets called event when app is closed on my device
    })

    $capacitor.$liveActivities.addListener('ConsoleMessageReceived', async (data: any) => {
      console.log('LA CONSOLE:', data.message)
    })
  }

  const processStartTokenQueue = async () => {
    if (isProcessingQueue || startTokenQueue.length === 0) return
    isProcessingQueue = true
    const tokenData = startTokenQueue.shift()!
    const payload = getLiveActivityPayload(tokenData.token, tokenData.activityType, tokenData.instanceId)
    await useSecureFetch('push-token-liveactivity-start', 'auth', 'post', payload)
    isProcessingQueue = false
    if (startTokenQueue.length > 0) setTimeout(processStartTokenQueue, 500)
  }
}
