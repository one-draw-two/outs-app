import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'outs.tand.ing',
  appName: 'outstanding',
  webDir: 'dist',
  server: {
    hostname: 'outs-auth.deno.dev',
    iosScheme: 'https',
    androidScheme: 'https',
  },
}

export default config
