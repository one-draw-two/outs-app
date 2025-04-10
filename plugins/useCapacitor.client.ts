import { Capacitor } from '@capacitor/core'
import { Network } from '@capacitor/network'
import { PushNotifications } from '@capacitor/push-notifications'
import { FCM } from '@capacitor-community/fcm'
import { CapLiveActivities } from 'outs-capacitor-liveactivities'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.provide('capacitor', {
    $platform: Capacitor.getPlatform(),
    $network: Network,
    $pushNotifications: PushNotifications,
    $liveActivities: CapLiveActivities,
    $fcm: FCM,
  })

  if (Capacitor.getPlatform() === 'web') return
})
