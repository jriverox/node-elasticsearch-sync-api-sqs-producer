/* eslint-disable no-return-await */
import dbObjectManager from '../utils/dbObjectManager'

const collectionName = 'OfertaPersonalizada'

export default class {
  constructor() {
    this.db = null
  }

  async getCount(country, campaign, personalizationType) {
    this.db = dbObjectManager.getDb(country.toUpperCase())

    if (!this.db) {
      const mensaje = `error getting ${country} database`
      throw new Error(mensaje)
    }

    const ofertaPersonalizada = this.db.collection(collectionName)
    const query = {
      AnioCampanaVenta: campaign,
      TipoPersonalizacion: personalizationType,
    }

    return await ofertaPersonalizada.count(query)
  }
}
