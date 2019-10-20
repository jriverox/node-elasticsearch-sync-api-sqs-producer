/* eslint-disable no-console */
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import routes from './routes'
import config from './config'
import LogManager from './utils/logManager'
import dbObjectManager from './utils/dbObjectManager'
import docs from './utils/api.docs'

const server = new Koa()
const logManager = new LogManager()

server.use(bodyParser()).use(docs)

// eslint-disable-next-line array-callback-return
routes.map(r => {
  server.use(r.routes())
  server.use(r.allowedMethods())
})

dbObjectManager
  .fetchAllDbs()
  .then(
    () => {
      console.log('All connectionStrings were successful...')

      // Inicialización del servicio
      server.listen(config.port, () => {
        console.log(`Server is up and running on port numner ${config.port}`)
      })
    },
    () => {
      console.log(
        'Application not started because at least one connectionString was unsuccessful...'
      )
    }
  )
  .catch(error => {
    console.log(error)
    logManager.logError(
      'index',
      'dbObjectManager.fetchAllDbs',
      '',
      error.message,
      '',
      error,
      '',
      ''
    )
  })
