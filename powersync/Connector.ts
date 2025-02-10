export class Connector {
  constructor() {}

  async fetchCredentials() {
    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL,
      token: import.meta.env.VITE_POWERSYNC_APIKEY,
    }
  }

  async uploadData(database: any) {}
}
