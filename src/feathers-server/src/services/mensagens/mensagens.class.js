import { KnexService } from '@feathersjs/knex'

export class MensagemService extends KnexService {
  constructor(options) {
    super(options)
  }

  // Aqui você pode adicionar métodos customizados,
  // como marcar mensagens como lidas, etc.
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'mensagens', // Nome da tabela
    allowedMethods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  }
}
