export default function (params: any) {
  const { $capacitor } = useNuxtApp()

  if ($capacitor.$platform !== 'web') {
    $capacitor.$pushNotifications.requestPermissions().then(async (result: any) => {
      if (result.receive !== 'granted') console.log('Push notifications permission denied')

      await $capacitor.$pushNotifications.register()

      const fcmToken = await $capacitor.$fcm.getToken()
      if (fcmToken) {
        console.log('FCM Token:', fcmToken)
        await useSecureFetch('push-token', 'auth', 'post', { token: fcmToken.token, platform: $capacitor.$platform })
      }

      await $capacitor.$liveActivities.startLiveActivity()
    })

    $capacitor.$liveActivities.addListener('StartTokenReceived', (data: any) => {
      console.log('LA: Start token received:', data.token)
    })
    $capacitor.$liveActivities.addListener('UpdateTokenReceived', (data: any) => {
      console.log('LA: Update token received:', data.token)
    })

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
