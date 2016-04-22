import dotenv from 'dotenv'
import fs from 'fs-extra'
import { exists, log } from './utils'

class Config {
  constructor () {
    this.envFile = process.cwd() + '/.env'

    this.config = {
      port: 3000,
      db: {
        host: 'localhost',
        user: 'admin',
        password: 1234,
        name: 'muffin'
      },
      // This is fine, since it's just the default
      session_secret: 'random'
    }

    if (exists(this.envFile)) {
      const fileContent = this.loadConfig()

      for (let property in fileContent) {
        let whole = fileContent[property]
        property = property.toLowerCase()

        if (property.indexOf('_') > -1 && this.config.hasOwnProperty(property.split('_')[0])) {
          this.assignProperty(this.config, property, whole)
          continue
        }

        this.config[property] = whole
      }
    }

    this.setupEnv()
  }

  setVariable (name, value) {
    name = name.toUpperCase()

    if (!process.env[name]) {
      process.env[name] = value
    }
  }

  loadConfig () {
    let fileContent = false

    try {
      fileContent = fs.readFileSync(this.envFile, {
        encoding: 'utf8'
      })

      fileContent = dotenv.parse(fileContent)
    } catch (err) {
      log(err)
      return false
    }

    return fileContent
  }

  setupEnv () {
    const properties = this.config

    for (let property in properties) {
      let whole = properties[property]

      if (typeof whole === 'object') {
        for (let subProp in whole) {
          this.setVariable(property + '_' + subProp, whole[subProp])
        }

        continue
      }

      this.setVariable(property, whole)
    }
  }

  assignProperty(obj, path, value) {
    let props = path.split('_'),
        i = 0,
        prop

    for (; i < props.length - 1; i++) {
      prop = props[i]
      obj = obj[prop]
    }

    obj[props[i]] = value
  }
}

export default Config
