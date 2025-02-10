import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'outs.tand.ing',
  appName: 'outstanding',
  webDir: 'dist',
  server: {
    hostname: 'onedrawtwo.com',
    iosScheme: 'https',
    androidScheme: 'https',
  },
}

export default config
