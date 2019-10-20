/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import request from 'sync-request'
import config from '../config'
import LogEvent from './logEvent'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default class {
  constructor() {
    const today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1
    const yyyy = today.getFullYear()
    if (dd < 10) {
      dd = `0${dd}`
    }
    if (mm < 10) {
      mm = `0${mm}`
    }
    const indexName = `${config.elasticLogging.pattern}${yyyy}.${mm}.${dd}`
    this.indexName = indexName
    this.url = `${config.elasticLogging.endpoint}/${indexName}/${config.elasticLogging.type}`
  }

  addLog(logEvent) {
    try {
      logEvent.Application = config.elasticLogging.application
      if (
        config.elasticLogging.enabledInfo === true ||
        config.elasticLogging.enabledError === true
      ) {
        request('POST', this.url, { json: logEvent })
      }
    } catch (error) {
      console.error('Logging error: ', error)
    }
  }

  logInfo(
    className,
    method,
    parameters,
    message,
    elapsedTime,
    country,
    contentLength
  ) {
    let parametersString
    if (typeof parameters === 'object' && parameters !== null)
      parametersString = JSON.stringify(parameters)
    else parametersString = parameters
    const log = new LogEvent(
      'INFO',
      className,
      method,
      parametersString,
      message,
      elapsedTime,
      country,
      '',
      contentLength,
      '',
      ''
    )
    this.addLog(log)
  }

  logError(
    className,
    method,
    parameters,
    message,
    pais,
    exception,
    remoteAddr,
    source = ''
  ) {
    let parametersString
    if (typeof parameters === 'object' && parameters !== null)
      parametersString = JSON.stringify(parameters)
    else parametersString = parameters
    let exceptionString
    if (typeof exception === 'object' && exception !== null)
      exceptionString = JSON.stringify(exception)
    else exceptionString = exception
    const log = new LogEvent(
      'ERROR',
      className,
      method,
      parametersString,
      message,
      0,
      pais,
      exceptionString,
      0,
      remoteAddr,
      source
    )
    this.addLog(log)
  }
}
