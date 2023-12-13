/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export function up (knex) {
    return knex.schema
      .table('livros', function (table) {
        // Adiciona a coluna 'genero' à tabela 'livro' como enum
        table.enum('genero', [
          'Fantasia',
          'Romance',
          'Terror',
          'Suspense',
          'Acao',
          'Aventura',
          'Ficcao',
          'Ficcao Cientifica',
          'Distopia',
          'Historia',
          'Cientifico'
        ]);
      })
      .table('textos', function (table) {
        // Adiciona a coluna 'genero' à tabela 'texto' como enum
        table.enum('genero', [
          'Fantasia',
          'Romance',
          'Terror',
          'Suspense',
          'Acao',
          'Aventura',
          'Ficcao',
          'Ficcao Cientifica',
          'Distopia',
          'Historia',
          'Cientifico'
        ]);
      });
  }
  
  /**
   * @param {import("knex").Knex} knex
   * @returns {Promise<void>}
   */
  export function down (knex) {
    return knex.schema
      .table('livros', function (table) {
        // Remove a coluna 'genero' da tabela 'livro'
        table.dropColumn('genero');
      })
      .table('textos', function (table) {
        // Remove a coluna 'genero' da tabela 'texto'
        table.dropColumn('genero');
      });
  }