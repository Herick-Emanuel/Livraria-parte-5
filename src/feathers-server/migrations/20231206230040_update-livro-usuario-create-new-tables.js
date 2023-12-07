/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
    return Promise.all([
      // Adiciona a coluna 'imagem' na tabela 'livros'
      knex.schema.table('livros', (table) => {
        table.string('imagem');
      }),
  
      // Adiciona a coluna 'publicar' na tabela 'livros'
      knex.schema.table('livros', (table) => {
        table.boolean('publicar').defaultTo(false);
      }),
  
      // Adiciona a coluna 'leitura' na tabela 'livros'
      knex.schema.table('livros', (table) => {
        table.text('leitura');
      }),
  
      // Adiciona a coluna 'imagemPerfil' na tabela 'usuario'
      knex.schema.table('usuario', (table) => {
        table.string('imagemPerfil');
      }),
  
      // Cria a tabela 'textos'
      knex.schema.createTable('textos', (table) => {
        table.increments('id').primary();
        table.string('leitura');
        table.boolean('publicar').defaultTo(false);
        // Adicione outras colunas conforme necessário
      }),
    ]);
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down (knex) {
    return Promise.all([
      // Remove a coluna 'imagem' da tabela 'livros'
      knex.schema.table('livros', (table) => {
        table.dropColumn('imagem');
      }),
  
      // Remove a coluna 'publicar' da tabela 'livros'
      knex.schema.table('livros', (table) => {
        table.dropColumn('publicar');
      }),
  
      // Remove a coluna 'leitura' da tabela 'livros'
      knex.schema.table('livros', (table) => {
        table.dropColumn('leitura');
      }),
  
      // Remove a coluna 'imagemPerfil' da tabela 'usuario'
      knex.schema.table('usuario', (table) => {
        table.dropColumn('imagemPerfil');
      }),
  
      // Remove a tabela 'textos'
      knex.schema.dropTableIfExists('textos'),
    ]);
  }
  