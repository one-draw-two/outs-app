import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Network } from '@capacitor/network'
import { PushNotifications } from '@capacitor/push-notifications'
import { FCM } from '@capacitor-community/fcm'
import { CapLiveActivities } from '@outs1x2/capacitor-liveactivities'
import { SafeArea } from 'capacitor-plugin-safe-area'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.provide('capacitor', {
    $platform: Capacitor.getPlatform(),
    $network: Network,
    $pushNotifications: PushNotifications,
    $liveActivities: CapLiveActivities,
    $fcm: FCM,
  })

  if (Capacitor.getPlatform() === 'web') return

  const { insets } = await SafeArea.getSafeAreaInsets()
  document.documentElement.style.setProperty('--sat-value', `${insets.top}px`)
  document.documentElement.style.setProperty('--sar-value', `${insets.right}px`)
  document.documentElement.style.setProperty('--sab-value', `${insets.bottom}px`)
  document.documentElement.style.setProperty('--sal-value', `${insets.left}px`)

  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) App.exitApp()
    else window.history.back()
  })
})
