import { KnexService } from '@feathersjs/knex'

export const LivrosService = class extends KnexService {
  async get(id, params) {
    try {
      const livro = await this.Model.query()
        .findById(id)
        .withGraphFetched('comentarios')
        .orderBy('comentarios.created_at', 'desc')

      if (!livro) {
        throw new Error('Livro não encontrado')
      }

      return livro
    } catch (error) {
      throw new Error(`Erro ao obter detalhes do livro: ${error.message}`)
    }
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'livros',
    id: 'id',
    whitelist: ['$eager', '$joinRelation']
  }
}
