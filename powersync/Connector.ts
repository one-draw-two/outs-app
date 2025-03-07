export class Connector {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  async fetchCredentials() {
    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL,
      token: this.token,
    }
  }

  async uploadData(database: any) {}
}
