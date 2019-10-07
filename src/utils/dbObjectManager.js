/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import mongodb from 'mongodb'
import config from '../config'

const mongoClient = mongodb.MongoClient

class DbObjectManager {
  constructor() {
    if (!DbObjectManager.instance) {
      this._dbMap = {}
      DbObjectManager.instance = this
    }

    return DbObjectManager.instance
  }

  getDbMap() {
    return this._dbMap
  }

  setDbMap(dbMap) {
    this._dbMap = dbMap
  }

  getDb(codigoPais) {
    return this._dbMap[codigoPais]
  }

  getDbAsync(codigoPais) {
    return new Promise((resolve, reject) => {
      console.log(codigoPais)

      if (this._dbMap[codigoPais]) {
        resolve(this._dbMap[codigoPais])
      } else {
        mongoClient
          .connect(config.mongodb[codigoPais].connectionString, {
            useNewUrlParser: true,
          })
          .then(
            client => {
              console.log(
                `Connected correctly to ${codigoPais} database server`
              )

              this._dbMap[codigoPais] = client.db(
                config.mongodb[codigoPais].database
              )
              resolve(this._dbMap[codigoPais])
            },
            response => {
              console.log(
                `Could not establish connection with ${codigoPais} database server`
              )
              reject(response)
            }
          )
          .catch(err => {
            console.error(err)
            reject(err)
          })
      }
    })
  }

  fetchAllDbs() {
    const dbPromisesArr = []

    // eslint-disable-next-line no-restricted-syntax
    for (const country in config.mongodb) {
      if (Object.prototype.hasOwnProperty.call(config.mongodb, country)) {
        dbPromisesArr.push(this.getDbAsync(country))
      }
    }

    return Promise.all(dbPromisesArr)
  }
}

const instance = new DbObjectManager()
Object.freeze(instance)

export default instance
