import { PowerSyncDatabase } from '@powersync/web'
import { Network } from '@capacitor/network'
import { PushNotifications } from '@capacitor/push-notifications'
import { FCM } from '@capacitor-community/fcm'
import dayjs from 'dayjs'

declare module '#app' {
  interface NuxtApp {
    // Capacitor
    $capacitor: {
      $platform: string
      $network: typeof Network
      $pushNotifications: typeof PushNotifications
      $fcm: typeof FCM
      $liveActivities: any
    }

    $db: PowerSyncDatabase

    $day: typeof dayjs
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // Capacitor
    $capacitor: {
      $platform: string
      $network: typeof Network
      $pushNotifications: typeof PushNotifications
      $fcm: typeof FCM
      $liveActivities: any
    }

    // PowerSync
    $db: PowerSyncDatabase
    $vfsPurge: () => void
    $vfsList: () => Promise<string[]>

    $day: typeof dayjs
  }
}

export {} // This makes the file a module
