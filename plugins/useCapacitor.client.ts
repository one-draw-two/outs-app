import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Network } from '@capacitor/network'
import { PushNotifications } from '@capacitor/push-notifications'
import { FCM } from '@capacitor-community/fcm'
import { CapLiveActivities } from '@outs1x2/capacitor-liveactivities'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.provide('capacitor', {
    $platform: Capacitor.getPlatform(),
    $network: Network,
    $pushNotifications: PushNotifications,
    $liveActivities: CapLiveActivities,
    $fcm: FCM,
  })

  if (Capacitor.getPlatform() === 'web') return

  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp()
    } else {
      window.history.back()
    }
  })
})
