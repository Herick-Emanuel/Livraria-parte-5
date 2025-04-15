import { KnexService } from '@feathersjs/knex'

export class AmizadeService extends KnexService {
  constructor(options) {
    super(options)
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'amizades',
    allowedMethods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  }
}
