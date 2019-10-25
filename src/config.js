import dotenv from 'dotenv'

dotenv.config()

const config = {
  port: 3000,
  batchSize: 10000,
  mongodb: {
    PE: {
      connectionString: process.env.MONGODB_PE,
      database: 'BelcorpPeru',
    },
    CR: {
      connectionString: process.env.MONGODB_CR,
      database: 'BelcorpCostaRica',
    },
  },
  sqs: {
    region: 'us-east-1',
    queueUrl: process.env.SQS_URL,
  },
  elasticLogging: {
    endpoint: process.env.LOGGER_URL,
    pattern: 'dev-buscador-sync2-',
    type: 'LogEvent',
    enabledInfo: true,
    enabledError: true,
    application: 'Producer',
  },
}

export default config
