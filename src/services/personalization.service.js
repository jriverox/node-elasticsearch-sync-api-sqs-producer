/* eslint-disable no-console */
import config from '../config'
import PersonalizationRepository from '../repositories/personalization.repository'
import SynchronizationTask from '../models/synchronizationTask.model'
import QueueManager from '../utils/queueManager'
import LogManager from '../utils/logManager'

export default class {
  constructor() {
    this.repository = new PersonalizationRepository()
    this.queueManager = new QueueManager()
    this.logManager = new LogManager()
  }

  async createJob(syncPersonalizationRequest) {
    try {
      const hrstart = process.hrtime()
      const totalRows = await this.repository.getCount(
        syncPersonalizationRequest.country,
        syncPersonalizationRequest.campaign,
        syncPersonalizationRequest.personalizationType
      )
      console.log('totalRows:', totalRows)
      let parameters = ''
      if (totalRows > 0) {
        const totalPages =
          totalRows > config.batchSize
            ? Math.ceil(totalRows / config.batchSize)
            : 1

        console.log('totalPages: ', totalPages, ' totalRows:', totalRows)
        parameters = `${syncPersonalizationRequest.correlationId} / totalPages: ${totalPages} / totalRows: ${totalRows}`
        this.logManager.logInfo(
          'PersonalizationService',
          'createJob',
          parameters,
          'Proceso iniciado.',
          0,
          syncPersonalizationRequest.country,
          totalRows
        )
        let tasks = []
        let batchCount = 0

        for (let page = 0; page < totalPages; page += 1) {
          const task = new SynchronizationTask(
            syncPersonalizationRequest.country,
            syncPersonalizationRequest.campaign,
            syncPersonalizationRequest.personalizationType,
            totalRows,
            page,
            config.batchSize,
            syncPersonalizationRequest.correlationId
          )
          tasks.push(task)
          batchCount += 1
          // console.log(
          //   'batchCount:',
          //   batchCount,
          //   'page:',
          //   page,
          //   'totalPages:',
          //   totalPages
          // )
          if (batchCount === 10 || page === totalPages - 1) {
            console.log('enviando', tasks.length)
            // eslint-disable-next-line no-await-in-loop
            await this.queueManager.sendBatch(tasks)
            tasks = []
            batchCount = 0
          }
        }
      }
      const hrend = process.hrtime(hrstart)
      const executionTimeInMS = hrend[0] + hrend[1] / 1e6
      this.logManager.logInfo(
        'PersonalizationService',
        'createJob',
        parameters,
        'Proceso terminado.',
        executionTimeInMS,
        syncPersonalizationRequest.country,
        totalRows
      )
    } catch (error) {
      console.log(error)
      this.logManager.logError(
        'PersonalizationService',
        'createJob',
        syncPersonalizationRequest.correlationId,
        error.message,
        syncPersonalizationRequest.country,
        error,
        '',
        ''
      )
    }
  }
}
