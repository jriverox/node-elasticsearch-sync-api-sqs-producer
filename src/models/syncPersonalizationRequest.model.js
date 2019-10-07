import moment from 'moment'

export default class {
  constructor(country, campaign, personalizationType) {
    this.country = country
    this.campaign = campaign
    this.personalizationType = personalizationType
    this.date = new Date()
    this.correlationId = `Personalization.${country.toUpperCase()}.${campaign}.${personalizationType.toUpperCase()}.${moment(
      this.date
    ).format('YYYY.MM.DD.hh:mm:ss')}`
  }
}
