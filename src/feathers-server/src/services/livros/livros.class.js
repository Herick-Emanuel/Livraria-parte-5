import { KnexService } from '@feathersjs/knex';

export const LivrosService = class extends KnexService {
  async get(id, params) {
    const { Model } = this.options;
  
    try {
      // Busque os detalhes do livro pelo ID
      const livro = await Model.query().findById(id);
  
      if (!livro) {
        throw new Error('Livro não encontrado');
      }
  
      // Busque os comentários associados ao livro
      livro.comentarios = await Model.relatedQuery('comentarios')
        .for(id)
        .select('comentario', 'avaliacao')
        .orderBy('created_at', 'desc'); // ajuste conforme necessário
  
      return livro;
    } catch (error) {
      throw new Error(`Erro ao obter detalhes do livro: ${error.message}`);
    }
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
