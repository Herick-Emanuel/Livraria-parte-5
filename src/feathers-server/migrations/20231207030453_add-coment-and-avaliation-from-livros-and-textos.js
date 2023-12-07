/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    // Adicionar coluna 'comentario' à tabela 'livros'
    await knex.schema.table('livros', (table) => {
      table.text('comentario');
    });
  
    // Adicionar coluna 'avaliacao' à tabela 'livros'
    await knex.schema.table('livros', (table) => {
      table.integer('avaliacao');
    });
  
    // Adicionar coluna 'comentario' à tabela 'livros'
    await knex.schema.table('textos', (table) => {
        table.text('comentario');
      });
    
      // Adicionar coluna 'avaliacao' à tabela 'livros'
      await knex.schema.table('textos', (table) => {
        table.integer('avaliacao');
      });
    };
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = async (knex) => {
    // Remover coluna 'comentario' da tabela 'livros'
    await knex.schema.table('livros', (table) => {
      table.dropColumn('comentario');
    });
  
    // Remover coluna 'avaliacao' da tabela 'livros'
    await knex.schema.table('livros', (table) => {
      table.dropColumn('avaliacao');
    });

    await knex.schema.table('textos', (table) => {
        table.dropColumn('comentario');
      });
    
      // Remover coluna 'avaliacao' da tabela 'livros'
      await knex.schema.table('textos', (table) => {
        table.dropColumn('avaliacao');
      });
  };