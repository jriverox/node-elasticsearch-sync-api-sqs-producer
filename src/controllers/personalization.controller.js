import PersonalizationService from '../services/personalization.service'
import SyncPersonalizationRequest from '../models/syncPersonalizationRequest.model'

export default class {
  constructor() {
    this.service = new PersonalizationService()
  }

  async createJob(country, campaign, personalizationType) {
    const request = new SyncPersonalizationRequest(
      country.toUpperCase(),
      campaign,
      personalizationType.toUpperCase()
    )
    await this.service.createJob(request)
  }
}
