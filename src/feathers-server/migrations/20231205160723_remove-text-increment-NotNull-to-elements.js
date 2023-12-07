/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    // Remover a coluna `[text]` da tabela 'livros'
    await knex.schema.table('livros', function(table) {
      table.dropColumn('text');
    });
  
    // Adicionar notNull para colunas existentes em 'livros'
    await knex.schema.alterTable('livros', function(table) {
      table.string('titulo').notNullable().alter();
      table.string('autor').notNullable().alter();
      table.string('editora').notNullable().alter();
      table.integer('anoPublicacao').notNullable().alter();
      table.decimal('preco').notNullable().alter();
      table.string('descricao').notNullable().alter();
    });
  
    // Adicionar colunas 'cargo' e 'apelido' na tabela 'usuario'
    await knex.schema.table('usuario', function(table) {
      table.string('cargo');
      table.string('apelido');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = async (knex) => {
    // Reverter as alterações na tabela 'livros'
    await knex.schema.alterTable('livros', function(table) {
      table.dropColumn('titulo');
      table.dropColumn('autor');
      table.dropColumn('editora');
      table.dropColumn('anoPublicacao');
      table.dropColumn('preco');
      table.dropColumn('descricao');
    });
  
    // Remover as colunas 'cargo' e 'apelido' da tabela 'usuario'
    await knex.schema.table('usuario', function(table) {
      table.dropColumn('cargo');
      table.dropColumn('apelido');
    });
  };  