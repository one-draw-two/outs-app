import { Capacitor, registerPlugin } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { FCM } from '@capacitor-community/fcm'
import { CapLiveActivities } from 'outs-capacitor-liveactivities'

interface LiveActivityPlugin {
  startLiveActivity(): Promise<{ message: string }>
}

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.provide('capacitor', {
    $platform: Capacitor.getPlatform(),
    $pushNotifications: PushNotifications,
    $fcm: FCM,
    $liveActivity: registerPlugin<LiveActivityPlugin>('LiveActivityPlugin'),
    $cli: CapLiveActivities,
  })

  if (Capacitor.getPlatform() === 'web') return

  /*
export interface LiveActivityPlugin {
  startLiveActivity(): Promise<{ message: string }>;
}
  */
})
