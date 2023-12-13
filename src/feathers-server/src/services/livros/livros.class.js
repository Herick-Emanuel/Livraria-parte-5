import { KnexService } from '@feathersjs/knex';
import { NotFound } from '@feathersjs/errors';

export const LivrosService = class extends KnexService {
  constructor(options) {
    super({
      ...options,
      Model: options.Model || options.knex.client.Model.extend({
        tableName: 'livros',
        id: 'id',
      }),
    });
  }

  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    const livro = await super.create(data, params);
    return livro;
  }

  async find(params) {
    const livros = await super.find(params);
    return livros;
  }

  async get(id, params) {
    const livro = await super.get(id, params);
    if (!livro) {
      throw new NotFound(`Livro com id ${id} não encontrado`);
    }
    return livro;
  }
};

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'livros',
    id: 'id',
    whitelist: ['$eager', '$joinRelation'],
  };
};