import AWS from 'aws-sdk'
import config from '../config'

AWS.config.update({ region: config.sqs.region })

export default class {
  constructor() {
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
    this.queueUrl = config.sqs.queueUrl
  }

  async send(synchronizationTask) {
    const params = {
      MessageBody: JSON.stringify(synchronizationTask),
      QueueUrl: this.getQueueUrl(),
    }
    const response = await this.sqs.sendMessage(params).promise()
    return response.MessageId
  }

  sendBatch(synchronizationTasks) {
    return new Promise((resolve, reject) => {
      const messages = synchronizationTasks.map((task, i) => {
        return {
          Id: `task-${i}`,
          MessageBody: JSON.stringify(task),
        }
      })
      const params = {
        Entries: messages,
        QueueUrl: this.queueUrl,
      }
      this.sqs.sendMessageBatch(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}
