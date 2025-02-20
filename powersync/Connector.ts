export class Connector {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  async fetchCredentials() {
    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL,
      // token: import.meta.env.VITE_POWERSYNC_APIKEY,
      token: this.token,
    }
  }

  async uploadData(database: any) {}
}
