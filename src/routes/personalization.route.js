/* eslint-disable no-console */
import Router from 'koa-router'
import PersonalizationController from '../controllers/personalization.controller'
import LogManager from '../utils/logManager'

const personalizationRouter = new Router()
const personalizationController = new PersonalizationController()
const logManager = new LogManager()

personalizationRouter.get(
  '/personalization/:country/:campaign/:personalizationType',
  async ctx => {
    try {
      await personalizationController.createJob(
        ctx.params.country,
        ctx.params.campaign,
        ctx.params.personalizationType
      )
      // eslint-disable-next-line require-atomic-updates
      ctx.body = {
        sucess: 'ok',
      }
    } catch (error) {
      console.log(error)
      logManager.logError(
        'PersonalizationService',
        'createJob',
        '',
        error.message,
        '',
        error,
        '',
        ''
      )
    }
  }
)

export default personalizationRouter
