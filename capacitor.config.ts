import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'outs.tand.ing',
  appName: 'outstanding',
  webDir: 'dist',
  server: {
    // hostname: 'outs-auth.deno.dev', !!! Note, dont have the www or the TLD part of the domain!
    hostname: 'deno.dev',
    iosScheme: 'https',
    androidScheme: 'https',
  },
}

export default config
