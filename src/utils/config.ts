import * as fs from 'fs'
import * as dotenv from 'dotenv'

interface IConfig {
  [key: string]: string | number | boolean
}

export class Config {
  envConfig: IConfig = {}
  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV || ''}.env`))
  }
  getConfig(key: string): any {
    const variable = this.envConfig[key] as string

    if (/true|false/.test(variable)) {
      return Boolean(variable)
    }

    return this.envConfig[key]
  }
}

export const ConfigService = new Config()
