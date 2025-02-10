import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'out.stand.ing',
  appName: 'outstanding',
  webDir: 'dist',
  server: {
    hostname: 'onedrawtwo.com',
    iosScheme: 'https',
    androidScheme: 'https',
  },
}

export default config
