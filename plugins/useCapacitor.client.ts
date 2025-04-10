import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { FCM } from '@capacitor-community/fcm'
import { CapLiveActivities } from 'outs-capacitor-liveactivities'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.provide('capacitor', {
    $platform: Capacitor.getPlatform(),
    $pushNotifications: PushNotifications,
    $liveActivities: CapLiveActivities,
    $fcm: FCM,
  })

  if (Capacitor.getPlatform() === 'web') return
})
