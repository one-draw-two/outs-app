export default function (params: any) {
  const { $capacitor } = useNuxtApp()
  const currentFcmToken = ref()

  if ($capacitor.$platform !== 'web') {
    $capacitor.$pushNotifications.requestPermissions().then(async (result: any) => {
      if (result.receive !== 'granted') console.log('Push notifications permission denied')

      await $capacitor.$pushNotifications.register()

      const fcmToken = await $capacitor.$fcm.getToken()
      if (fcmToken) {
        console.log('FCM Token:', fcmToken)
        currentFcmToken.value = fcmToken.token
        await useSecureFetch('push-token-notification', 'auth', 'post', { token: fcmToken.token, platform: $capacitor.$platform })
      }

      await $capacitor.$liveActivities.startLiveActivity()
    })

    const registerLiveActivityListener = (eventName: string, tokenType: string) => {
      $capacitor.$liveActivities.addListener(eventName, async (data: any) => {
        console.log(`LA: ${tokenType} token received:`, data.token)
        await useSecureFetch('push-token-liveactivity', 'auth', 'post', {
          tokenType,
          token: data.token,
          fcmToken: currentFcmToken.value,
          activityType: data.activityType || 'default',
          platform: $capacitor.$platform,
        })
      })
    }

    registerLiveActivityListener('StartTokenReceived', 'start')
    registerLiveActivityListener('UpdateTokenReceived', 'update')

    /*
    // Android already generates FCM compatible tokens but to convert the APN tokens to FCM, we need the $fcm package as used above
    // const fcmToken = await $capacitor.$fcm.getToken()

    $capacitor.$pushNotifications.addListener('registration', async (token) => {
      console.log(`Push registration success: ${token.value}`)
      const res = await useSecureFetch('push-token', 'auth', 'post', { token: token.value })
      console.log(res)
    })
    */
  }
}
