export default function (params: any) {
  console.log('GETTING PUSH TOKENS')

  const { $capacitor } = useNuxtApp()

  if ($capacitor.$platform !== 'web') {
    console.log('REQO')

    $capacitor.$pushNotifications.requestPermissions().then(async (result: any) => {
      console.log('YAVAL')

      if (result.receive === 'granted') {
        await $capacitor.$pushNotifications.register()

        // const fcmToken = await $capacitor.$fcm.getToken()
        // console.log('FCM TOKEN IS')
        // console.log(fcmToken)
        // if (fcmToken) await useSecureFetch(`users/addPnToken/${fcmToken.token}`, 'post')
      } else {
        // Show some error
        console.log('Capacitor Push Notification Error')
        console.log(result)
      }
    })

    $capacitor.$pushNotifications.addListener('registration', async (token) => {
      console.log('Push registration success')
      console.log('*********')
      console.log(token.value)

      const res = await useSecureFetch('push-token', 'auth', 'post', { token: token.value })
      console.log(res)
    })
  }
}
