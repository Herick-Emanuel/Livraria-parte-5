import { KnexService } from '@feathersjs/knex'

export class UserService extends KnexService {
  constructor(options) {
    super(options)
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'usuario',
    allowedMethods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  }
}